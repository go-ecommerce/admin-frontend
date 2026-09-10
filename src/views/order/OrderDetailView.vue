<script setup lang="ts">
import { CornerUpLeft, Save } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import OrderCitySelect from '@/components/order/OrderCitySelect.vue'
import OrderDeliveryMap from '@/components/order/OrderDeliveryMap.vue'
import OrderPickupMap from '@/components/order/OrderPickupMap.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast/use-toast'
import DeliveryService from '@/services/DeliveryService'
import { useOrderStore } from '@/stores/order'
import { cityCoordinates, cityKey, cityLabel } from '@/utils/city'
import { deliveryPointAddress } from '@/utils/deliveryPoint'
import { deliveryMethodTitle, pointsMapUi, resolveDeliveryMethod } from '@/utils/deliveryMethod'
import { fileSrc } from '@/utils/media'
import {
  PAYMENT_METHODS,
  formatOrderDate,
  formatOrderMoney,
  isOrderEditable,
  nextOrderStatuses,
  orderSourceLabel,
  orderStatusClass,
  orderStatusLabel,
  paymentMethodLabel,
  paymentStatusClass,
  paymentStatusLabel,
  shippingMethodLabel,
} from '@/utils/order'
import type { OrderStatusTarget } from '@/utils/order'
import { STORE_PICKUP, isStorePickupCity } from '@/utils/pickup'
import type {
  AdminUpdateOrderRequest,
  CityResponse,
  DeliveryMethodResponse,
  DeliveryPointResponse,
  UpdateOrderStatusRequest,
} from '@/utils/types/api/generatedApiGo'

const route = useRoute()
const router = useRouter()
const { toast } = useToast()
const orderStore = useOrderStore()
const { currentOrder, isLoading } = storeToRefs(orderStore)
const { getOrderByNumber, updateOrder, updateOrderStatus } = orderStore

const NONE = '__none__'

const orderNumber = computed(() => {
  const raw = route.params.number
  const value = Array.isArray(raw) ? raw[0] : raw
  return Number(value)
})

const editable = computed(() => isOrderEditable(currentOrder.value?.status))
const isQuickNew = computed(() => currentOrder.value?.status === 'new')

const nextStatuses = computed(() => nextOrderStatuses(currentOrder.value?.status))
const nextStatus = ref<OrderStatusTarget | ''>('')
const statusComment = ref('')
const statusPaymentMethod = ref(NONE)

const deliveryMethods = ref<DeliveryMethodResponse[]>([])
const methodsError = ref('')
const selectedCity = ref<CityResponse | null>(null)
const selectedPoint = ref<DeliveryPointResponse | null>(null)

const form = ref({
  email: '',
  phone: '',
  comment: '',
  payment_method: NONE,
  ship_recipient: '',
  ship_city_name: '',
  ship_city_id: '',
  ship_address: '',
  ship_postcode: '',
  delivery_method_code: NONE,
  ship_point_code: '',
})

const availableMethods = computed(() => {
  const methods = deliveryMethods.value.filter((method) => Boolean(method.code))
  if (isStorePickupCity(selectedCity.value)) return methods
  return methods.filter((method) => method.kind !== 'self_pickup')
})

const activeMethod = computed(
  () =>
    availableMethods.value.find((method) => method.code === form.value.delivery_method_code) ||
    null,
)

const isSelfPickup = computed(() => activeMethod.value?.kind === 'self_pickup')
const isCourier = computed(() => activeMethod.value?.kind === 'courier')
const mapUi = computed(() => pointsMapUi(activeMethod.value))

const mapCityCoordinates = computed(() => cityCoordinates(selectedCity.value))
const mapCityKey = computed(() =>
  selectedCity.value ? cityKey(selectedCity.value) : form.value.ship_city_name,
)

const currentShippingMethodLabel = computed(() => {
  const shipping = currentOrder.value?.shipping
  const method = resolveDeliveryMethod(shipping, deliveryMethods.value)
  if (method) return deliveryMethodTitle(method)
  return shippingMethodLabel(shipping?.method) || shipping?.method || '—'
})

const activeMethodLabel = computed(() => {
  if (activeMethod.value) return deliveryMethodTitle(activeMethod.value)
  return currentShippingMethodLabel.value
})

const savedPointSummary = computed(() => {
  const code = form.value.ship_point_code.trim() || selectedPoint.value?.code || ''
  if (!code && !selectedPoint.value) {
    // Still show address for courier / self-pickup below separately
    return null
  }
  return {
    code: code || selectedPoint.value?.code || '',
    name: selectedPoint.value?.name || '',
    address:
      (selectedPoint.value ? deliveryPointAddress(selectedPoint.value) : '') ||
      form.value.ship_address.trim(),
  }
})

const showSavedDeliverySummary = computed(
  () =>
    form.value.delivery_method_code !== NONE ||
    Boolean(savedPointSummary.value) ||
    Boolean(form.value.ship_address.trim()),
)

const shippingWindow = computed(() => {
  const min = currentOrder.value?.shipping?.min_days
  const max = currentOrder.value?.shipping?.max_days
  if (min == null && max == null) return null
  if (min != null && max != null && min !== max) return `${min}–${max} дн.`
  return `${min ?? max} дн.`
})

const syncingForm = ref(false)

const resetStatusForm = () => {
  nextStatus.value = nextStatuses.value[0] ?? ''
  statusComment.value = ''
  statusPaymentMethod.value = currentOrder.value?.payment_method || NONE
}

const cityFromOrder = (): CityResponse | null => {
  const shipping = currentOrder.value?.shipping
  if (!shipping?.city_name && !shipping?.city_id) return null
  return {
    id: shipping.city_id,
    city: shipping.city_name,
    address: shipping.city_name,
    postal_code: shipping.postcode,
  }
}

const resolveMethodCodeFromOrder = () => {
  const resolved = resolveDeliveryMethod(currentOrder.value?.shipping, availableMethods.value)
  if (resolved?.code) return resolved.code
  // Prefer catalogue match over raw title so method buttons stay selected.
  const raw = currentOrder.value?.shipping?.method?.trim()
  if (raw && availableMethods.value.some((method) => method.code === raw)) return raw
  return NONE
}

const resetEditForm = () => {
  const order = currentOrder.value
  const shipping = order?.shipping
  syncingForm.value = true
  selectedPoint.value = null
  selectedCity.value = cityFromOrder()

  form.value = {
    email: order?.email || '',
    phone: order?.phone || '',
    comment: order?.comment || '',
    payment_method: order?.payment_method || NONE,
    ship_recipient: shipping?.recipient || '',
    ship_city_name: shipping?.city_name || '',
    ship_city_id: shipping?.city_id || '',
    ship_address: shipping?.address || '',
    ship_postcode: shipping?.postcode || '',
    delivery_method_code: resolveMethodCodeFromOrder(),
    ship_point_code: shipping?.point_code || '',
  }
  syncingForm.value = false
}

const loadDeliveryMethods = async () => {
  try {
    const methods = await DeliveryService.getMethods()
    deliveryMethods.value = methods.filter((method) => method.enabled !== false && method.code)
    methodsError.value = ''
  } catch {
    deliveryMethods.value = []
    methodsError.value = 'Не удалось загрузить способы доставки'
  }
}

const loadOrder = async () => {
  if (!Number.isFinite(orderNumber.value) || orderNumber.value <= 0) {
    toast({
      title: 'Ошибка',
      description: 'Некорректный номер заказа',
      variant: 'destructive',
    })
    await router.push({ name: 'order' })
    return
  }
  try {
    await getOrderByNumber(orderNumber.value)
    resetStatusForm()
    resetEditForm()
  } catch {
    await router.push({ name: 'order' })
  }
}

watch(orderNumber, loadOrder, { immediate: true })

void loadDeliveryMethods().then(() => {
  if (currentOrder.value) resetEditForm()
})

watch(selectedCity, (city) => {
  if (syncingForm.value || !city) return
  form.value.ship_city_id = city.id || ''
  form.value.ship_city_name = cityLabel(city)
  if (city.postal_code) form.value.ship_postcode = city.postal_code

  if (
    form.value.delivery_method_code !== NONE &&
    !availableMethods.value.some((method) => method.code === form.value.delivery_method_code)
  ) {
    // Keep resolved catalogue code if possible; otherwise clear instead of
    // silently switching to an unrelated first method.
    form.value.delivery_method_code = resolveMethodCodeFromOrder()
    if (
      form.value.delivery_method_code !== NONE &&
      !availableMethods.value.some((method) => method.code === form.value.delivery_method_code)
    ) {
      form.value.delivery_method_code = NONE
    }
  }
})

watch(
  () => form.value.delivery_method_code,
  (code) => {
    if (syncingForm.value) return
    const method = availableMethods.value.find((item) => item.code === code)
    selectedPoint.value = null
    form.value.ship_point_code = ''

    if (method?.kind === 'self_pickup') {
      form.value.ship_address = STORE_PICKUP.address
      return
    }

    if (method?.has_points) {
      form.value.ship_address = ''
    }
  },
)

watch(selectedPoint, (point) => {
  if (syncingForm.value || !point) return
  form.value.ship_point_code = point.code || ''
  form.value.ship_address = deliveryPointAddress(point)
  if (point.postal_code) form.value.ship_postcode = point.postal_code
})

const money = (value?: number) => formatOrderMoney(value, currentOrder.value?.currency)

const trimOrUndefined = (value: string) => {
  const trimmed = value.trim()
  return trimmed || undefined
}

const optionalSelect = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed || trimmed === NONE) return undefined
  return trimmed
}

const selectShipping = (code: string) => {
  form.value.delivery_method_code = code
}

const buildUpdatePayload = (): AdminUpdateOrderRequest => {
  const payload: AdminUpdateOrderRequest = {
    email: form.value.email.trim(),
    phone: trimOrUndefined(form.value.phone),
    comment: trimOrUndefined(form.value.comment),
    payment_method: optionalSelect(form.value.payment_method),
    ship_recipient: form.value.ship_recipient.trim(),
    ship_city_name: form.value.ship_city_name.trim(),
    ship_address: form.value.ship_address.trim(),
    ship_postcode: trimOrUndefined(form.value.ship_postcode),
  }

  const cityId = form.value.ship_city_id.trim()
  if (cityId) payload.ship_city_id = cityId

  const methodCode = optionalSelect(form.value.delivery_method_code)
  if (methodCode) {
    payload.delivery_method_code = methodCode
    if (mapUi.value) {
      payload.ship_point_code = trimOrUndefined(form.value.ship_point_code)
    }
  }

  return payload
}

const saveOrder = async () => {
  if (!currentOrder.value?.number || !editable.value) return

  if (isQuickNew.value) {
    const missing =
      !form.value.ship_recipient.trim() ||
      !form.value.ship_city_name.trim() ||
      !form.value.ship_address.trim()
    if (missing) {
      toast({
        title: 'Заполните доставку',
        description: 'Для подтверждения быстрого заказа нужны получатель, город и адрес',
        variant: 'destructive',
      })
      return
    }
  }

  if (mapUi.value && !form.value.ship_point_code.trim()) {
    toast({
      title: 'Выберите пункт выдачи',
      description: 'Отметьте ПВЗ на карте',
      variant: 'destructive',
    })
    return
  }

  if (isCourier.value && !form.value.ship_address.trim()) {
    toast({
      title: 'Укажите адрес',
      description: 'Для курьерской доставки нужен адрес',
      variant: 'destructive',
    })
    return
  }

  try {
    await updateOrder(currentOrder.value.number, buildUpdatePayload())
    resetStatusForm()
    resetEditForm()
  } catch {
    // toast is shown in the store
  }
}

const saveStatus = async () => {
  if (!nextStatus.value || !currentOrder.value?.number) return
  const payload: UpdateOrderStatusRequest = {
    status: nextStatus.value,
  }
  if (statusComment.value.trim()) payload.comment = statusComment.value.trim()
  if (nextStatus.value === 'paid') {
    const method = optionalSelect(statusPaymentMethod.value)
    if (method) payload.payment_method = method
  }
  try {
    await updateOrderStatus(currentOrder.value.number, payload)
    resetStatusForm()
    resetEditForm()
  } catch {
    // toast is shown in the store
  }
}
</script>

<template>
  <div class="p-4 sm:px-6 md:gap-8">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          class="h-7 gap-1"
          @click="router.push({ name: 'order' })"
        >
          <CornerUpLeft class="h-3.5 w-3.5" />
        </Button>
        <div class="text-2xl font-semibold sr-only sm:not-sr-only sm:whitespace-nowrap">
          Заказ
          <span v-if="currentOrder?.number">№{{ currentOrder.number }}</span>
        </div>
      </div>
      <Button
        v-if="editable"
        size="sm"
        class="h-7 gap-1"
        :disabled="isLoading"
        @click="saveOrder"
      >
        <Save class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">
          {{ isQuickNew ? 'Подтвердить заказ' : 'Сохранить' }}
        </span>
      </Button>
    </div>
  </div>

  <main v-if="currentOrder" class="p-4 sm:px-6 sm:py-0 md:gap-8 space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Состав заказа</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="divide-y rounded-md border">
              <div
                v-for="(item, index) in currentOrder.items ?? []"
                :key="item.variant_id || item.product_id || index"
                class="flex items-center gap-3 p-3"
              >
                <img
                  v-if="fileSrc(item.image_path)"
                  :src="fileSrc(item.image_path)"
                  :alt="item.name"
                  class="size-12 rounded border object-cover shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate">{{ item.name }}</div>
                  <div class="text-xs text-muted-foreground truncate">
                    {{ item.sku || item.slug || '—' }}
                    · {{ item.quantity }} × {{ money(item.unit_price) }}
                  </div>
                </div>
                <div class="text-sm font-medium shrink-0">{{ money(item.line_total) }}</div>
              </div>
              <div
                v-if="!currentOrder.items?.length"
                class="p-6 text-sm text-muted-foreground text-center"
              >
                В заказе нет позиций
              </div>
            </div>

            <div class="mt-4 space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Подытог</span>
                <span>{{ money(currentOrder.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Скидка</span>
                <span>{{ money(currentOrder.discount_total) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Доставка</span>
                <span>{{ money(currentOrder.shipping_total) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Налог</span>
                <span>{{ money(currentOrder.tax_total) }}</span>
              </div>
              <div class="flex justify-between font-medium pt-2 border-t">
                <span>Итого</span>
                <span>{{ money(currentOrder.grand_total) }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Доставка</CardTitle>
            <CardDescription v-if="editable">
              {{
                isQuickNew
                  ? 'Укажите город и способ получения — заказ перейдёт в «Ожидает обработки».'
                  : 'Смена способа доставки пересчитает стоимость перевозки.'
              }}
            </CardDescription>
          </CardHeader>
          <CardContent v-if="editable" class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="grid gap-1.5">
                <Label for="ship_recipient">Получатель</Label>
                <Input
                  id="ship_recipient"
                  v-model="form.ship_recipient"
                  placeholder="ФИО получателя"
                />
              </div>
              <div class="grid gap-1.5">
                <Label>Город</Label>
                <OrderCitySelect v-model="selectedCity" />
              </div>
            </div>

            <div class="grid gap-1.5">
              <Label>Способ получения</Label>
              <div class="flex flex-wrap gap-2">
                <Button
                  v-for="method in availableMethods"
                  :key="method.code"
                  type="button"
                  size="sm"
                  class="h-8"
                  :variant="form.delivery_method_code === method.code ? 'default' : 'outline'"
                  @click="selectShipping(method.code!)"
                >
                  {{ deliveryMethodTitle(method) }}
                </Button>
              </div>
              <p v-if="methodsError" class="text-sm text-destructive">{{ methodsError }}</p>
            </div>

            <div
              v-if="showSavedDeliverySummary"
              class="rounded-md border bg-muted/40 px-3 py-2 text-sm space-y-2"
            >
              <div>
                <div class="text-xs text-muted-foreground">Сохранённый способ</div>
                <div class="font-medium">{{ activeMethodLabel }}</div>
              </div>
              <div v-if="savedPointSummary">
                <div class="text-xs text-muted-foreground">Пункт выдачи</div>
                <div class="font-medium">
                  {{ savedPointSummary.name || savedPointSummary.code || '—' }}
                </div>
                <div
                  v-if="savedPointSummary.code && savedPointSummary.name"
                  class="text-xs text-muted-foreground"
                >
                  Код: {{ savedPointSummary.code }}
                </div>
                <div v-if="savedPointSummary.address" class="mt-1 text-muted-foreground">
                  {{ savedPointSummary.address }}
                </div>
              </div>
              <div v-else-if="form.ship_address.trim()">
                <div class="text-xs text-muted-foreground">Адрес</div>
                <div>{{ form.ship_address }}</div>
              </div>
              <div v-if="form.ship_postcode.trim()" class="text-xs text-muted-foreground">
                Индекс: {{ form.ship_postcode }}
              </div>
            </div>

            <div v-if="isSelfPickup" class="space-y-3">
              <p class="text-sm">{{ STORE_PICKUP.address }}</p>
              <OrderPickupMap />
            </div>

            <OrderDeliveryMap
              v-else-if="mapUi"
              :key="`${mapUi.provider}:${mapCityKey}`"
              v-model="selectedPoint"
              :provider="mapUi.provider"
              :provider-label="mapUi.label"
              :icon-src="mapUi.iconSrc"
              :cluster-class="mapUi.clusterClass"
              :city-coordinates="mapCityCoordinates"
              :city-key="mapCityKey"
              :saved-point-code="form.ship_point_code"
              :saved-point-address="form.ship_address"
            />

            <div v-else-if="isCourier" class="grid gap-4 sm:grid-cols-2">
              <div class="grid gap-1.5">
                <Label for="ship_postcode">Индекс</Label>
                <Input id="ship_postcode" v-model="form.ship_postcode" placeholder="190000" />
              </div>
              <div class="grid gap-1.5 sm:col-span-2">
                <Label for="ship_address">Адрес</Label>
                <Textarea
                  id="ship_address"
                  v-model="form.ship_address"
                  rows="2"
                  placeholder="Улица, дом, квартира"
                />
              </div>
            </div>

            <div
              v-else-if="form.delivery_method_code === NONE"
              class="text-sm text-muted-foreground"
            >
              Выберите способ получения
            </div>
          </CardContent>
          <CardContent v-else class="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <div class="text-muted-foreground">Получатель</div>
              <div>{{ currentOrder.shipping?.recipient || '—' }}</div>
            </div>
            <div>
              <div class="text-muted-foreground">Способ</div>
              <div>{{ currentShippingMethodLabel }}</div>
            </div>
            <div>
              <div class="text-muted-foreground">Город</div>
              <div>{{ currentOrder.shipping?.city_name || '—' }}</div>
            </div>
            <div>
              <div class="text-muted-foreground">Индекс</div>
              <div>{{ currentOrder.shipping?.postcode || '—' }}</div>
            </div>
            <div v-if="currentOrder.shipping?.provider">
              <div class="text-muted-foreground">Перевозчик</div>
              <div>{{ shippingMethodLabel(currentOrder.shipping.provider) }}</div>
            </div>
            <div v-if="currentOrder.shipping?.point_code">
              <div class="text-muted-foreground">Пункт выдачи</div>
              <div>{{ currentOrder.shipping.point_code }}</div>
            </div>
            <div v-if="shippingWindow">
              <div class="text-muted-foreground">Срок</div>
              <div>{{ shippingWindow }}</div>
            </div>
            <div class="sm:col-span-2">
              <div class="text-muted-foreground">Адрес</div>
              <div>{{ currentOrder.shipping?.address || '—' }}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Статус</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <span
                :class="`text-xs px-2 py-0.5 rounded-full ${orderStatusClass(currentOrder.status)}`"
              >
                {{ orderStatusLabel(currentOrder.status) }}
              </span>
              <span
                :class="`text-xs px-2 py-0.5 rounded-full ${paymentStatusClass(currentOrder.payment_status)}`"
              >
                {{ paymentStatusLabel(currentOrder.payment_status) }}
              </span>
              <span
                v-if="currentOrder.source"
                class="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {{ orderSourceLabel(currentOrder.source) }}
              </span>
            </div>
            <div class="text-sm space-y-1">
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">Создан</span>
                <span>{{ formatOrderDate(currentOrder.created_at) }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">Оплачен</span>
                <span>{{ formatOrderDate(currentOrder.paid_at) }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">Отменён</span>
                <span>{{ formatOrderDate(currentOrder.cancelled_at) }}</span>
              </div>
            </div>

            <form
              v-if="nextStatuses.length"
              class="grid gap-3 pt-2 border-t"
              @submit.prevent="saveStatus"
            >
              <div class="grid gap-1.5">
                <Label>Новый статус</Label>
                <Select v-model="nextStatus">
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="item in nextStatuses" :key="item" :value="item">
                      {{ orderStatusLabel(item) }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div v-if="nextStatus === 'paid'" class="grid gap-1.5">
                <Label>Способ оплаты</Label>
                <Select v-model="statusPaymentMethod">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Способ оплаты" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="method in PAYMENT_METHODS" :key="method" :value="method">
                      {{ paymentMethodLabel(method) }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="grid gap-1.5">
                <Label>Комментарий</Label>
                <Textarea v-model="statusComment" rows="3" placeholder="Необязательно" />
              </div>
              <Button type="submit" :disabled="isLoading || !nextStatus">Обновить статус</Button>
            </form>
            <p v-else class="text-sm text-muted-foreground pt-2 border-t">
              Дальнейшие переходы недоступны.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Покупатель</CardTitle>
          </CardHeader>
          <CardContent v-if="editable" class="space-y-4">
            <div class="grid gap-1.5">
              <Label for="email">Email</Label>
              <Input id="email" v-model="form.email" type="email" placeholder="email@example.com" />
            </div>
            <div class="grid gap-1.5">
              <Label for="phone">Телефон</Label>
              <Input id="phone" v-model="form.phone" placeholder="+7…" />
            </div>
            <div class="grid gap-1.5">
              <Label>Способ оплаты</Label>
              <Select v-model="form.payment_method">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Не указан" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="NONE">Не указан</SelectItem>
                  <SelectItem v-for="method in PAYMENT_METHODS" :key="method" :value="method">
                    {{ paymentMethodLabel(method) }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-1.5">
              <Label for="comment">Комментарий</Label>
              <Textarea id="comment" v-model="form.comment" rows="3" placeholder="Необязательно" />
            </div>
            <div class="text-sm">
              <div class="text-muted-foreground">Аккаунт</div>
              <div class="break-all">{{ currentOrder.user_id || 'Гость' }}</div>
            </div>
          </CardContent>
          <CardContent v-else class="space-y-2 text-sm">
            <div>
              <div class="text-muted-foreground">Email</div>
              <div>{{ currentOrder.email || '—' }}</div>
            </div>
            <div>
              <div class="text-muted-foreground">Телефон</div>
              <div>{{ currentOrder.phone || '—' }}</div>
            </div>
            <div>
              <div class="text-muted-foreground">Оплата</div>
              <div>{{ paymentMethodLabel(currentOrder.payment_method) }}</div>
            </div>
            <div>
              <div class="text-muted-foreground">Аккаунт</div>
              <div class="break-all">{{ currentOrder.user_id || 'Гость' }}</div>
            </div>
            <div v-if="currentOrder.comment">
              <div class="text-muted-foreground">Комментарий</div>
              <div>{{ currentOrder.comment }}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</template>
