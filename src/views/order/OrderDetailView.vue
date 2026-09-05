<script setup lang="ts">
import { CornerUpLeft } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useOrderStore } from '@/stores/order'
import { fileSrc } from '@/utils/media'
import {
  formatOrderDate,
  formatOrderMoney,
  nextOrderStatuses,
  orderStatusClass,
  orderStatusLabel,
  paymentMethodLabel,
  paymentStatusClass,
  paymentStatusLabel,
  shippingMethodLabel,
} from '@/utils/order'
import type { OrderStatusTarget } from '@/utils/order'
import type { UpdateOrderStatusRequest } from '@/utils/types/api/generatedApiGo'

const route = useRoute()
const router = useRouter()
const { toast } = useToast()
const orderStore = useOrderStore()
const { currentOrder, isLoading } = storeToRefs(orderStore)
const { getOrderByNumber, updateOrderStatus } = orderStore

const orderNumber = computed(() => {
  const raw = route.params.number
  const value = Array.isArray(raw) ? raw[0] : raw
  return Number(value)
})

const nextStatuses = computed(() => nextOrderStatuses(currentOrder.value?.status))
const nextStatus = ref<OrderStatusTarget | ''>('')
const comment = ref('')
const paymentMethod = ref('')

const resetStatusForm = () => {
  nextStatus.value = nextStatuses.value[0] ?? ''
  comment.value = ''
  paymentMethod.value = currentOrder.value?.payment_method || ''
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
  } catch {
    await router.push({ name: 'order' })
  }
}

watch(orderNumber, loadOrder, { immediate: true })

const money = (value?: number) => formatOrderMoney(value, currentOrder.value?.currency)

const saveStatus = async () => {
  if (!nextStatus.value || !currentOrder.value?.number) return
  const payload: UpdateOrderStatusRequest = {
    status: nextStatus.value,
  }
  if (comment.value.trim()) payload.comment = comment.value.trim()
  if (nextStatus.value === 'paid' && paymentMethod.value.trim()) {
    payload.payment_method = paymentMethod.value.trim()
  }
  try {
    await updateOrderStatus(currentOrder.value.number, payload)
    resetStatusForm()
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
          </CardHeader>
          <CardContent class="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <div class="text-muted-foreground">Получатель</div>
              <div>{{ currentOrder.shipping?.recipient || '—' }}</div>
            </div>
            <div>
              <div class="text-muted-foreground">Способ</div>
              <div>{{ shippingMethodLabel(currentOrder.shipping?.method) }}</div>
            </div>
            <div>
              <div class="text-muted-foreground">Город</div>
              <div>{{ currentOrder.shipping?.city_name || '—' }}</div>
            </div>
            <div>
              <div class="text-muted-foreground">Индекс</div>
              <div>{{ currentOrder.shipping?.postcode || '—' }}</div>
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
                <Input v-model="paymentMethod" placeholder="card, cash, invoice" />
              </div>
              <div class="grid gap-1.5">
                <Label>Комментарий</Label>
                <Textarea v-model="comment" rows="3" placeholder="Необязательно" />
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
          <CardContent class="space-y-2 text-sm">
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
