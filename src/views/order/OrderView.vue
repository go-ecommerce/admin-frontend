<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import OrderTable from '@/components/order/OrderTable.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOrderStore } from '@/stores/order'
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  orderStatusLabel,
  paymentStatusLabel,
} from '@/utils/order'
import type { IOrderRequest } from '@/utils/types/api/apiGo'

const orderStore = useOrderStore()
const { orders, isLoading } = storeToRefs(orderStore)
const { getOrders } = orderStore
const route = useRoute()
const router = useRouter()

const ALL = 'all'

const parseStatus = (value: unknown) => {
  const next = String(value || ALL)
  return (ORDER_STATUSES as readonly string[]).includes(next) ? next : ALL
}

const parsePayment = (value: unknown) => {
  const next = String(value || ALL)
  return (PAYMENT_STATUSES as readonly string[]).includes(next) ? next : ALL
}

const params = ref({ page: 1, pageSize: 10 })
const status = ref(parseStatus(route.query.status))
const paymentStatus = ref(parsePayment(route.query.payment_status))

const fetchOrders = async () => {
  const payload: IOrderRequest = {
    page: params.value.page,
    page_size: params.value.pageSize,
  }
  if (status.value !== ALL) payload.status = status.value
  if (paymentStatus.value !== ALL) payload.payment_status = paymentStatus.value
  try {
    await getOrders(payload)
  } catch {
    // toast is shown in the store
  }
}

const syncQuery = () => {
  const query: Record<string, string> = {}
  if (status.value !== ALL) query.status = status.value
  if (paymentStatus.value !== ALL) query.payment_status = paymentStatus.value
  router.replace({ name: 'order', query })
}

watch([params, status, paymentStatus], fetchOrders, { immediate: true, deep: true })

watch(
  () => [route.query.status, route.query.payment_status],
  () => {
    status.value = parseStatus(route.query.status)
    paymentStatus.value = parsePayment(route.query.payment_status)
  },
)

const onStatusChange = (value: unknown) => {
  status.value = parseStatus(value)
  params.value.page = 1
  syncQuery()
}

const onPaymentStatusChange = (value: unknown) => {
  paymentStatus.value = parsePayment(value)
  params.value.page = 1
  syncQuery()
}

const resetFilters = () => {
  status.value = ALL
  paymentStatus.value = ALL
  params.value.page = 1
  syncQuery()
}
</script>

<template>
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Card>
      <CardHeader>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Заказы</CardTitle>
            <CardDescription>Список заказов магазина. Фильтры необязательны.</CardDescription>
          </div>
          <div class="flex flex-wrap items-end gap-3">
            <div class="grid gap-1.5">
              <Label class="text-xs text-muted-foreground">Статус</Label>
              <Select :model-value="status" @update:model-value="onStatusChange">
                <SelectTrigger class="w-[200px] h-8">
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="ALL">Все статусы</SelectItem>
                  <SelectItem v-for="item in ORDER_STATUSES" :key="item" :value="item">
                    {{ orderStatusLabel(item) }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-1.5">
              <Label class="text-xs text-muted-foreground">Оплата</Label>
              <Select :model-value="paymentStatus" @update:model-value="onPaymentStatusChange">
                <SelectTrigger class="w-[180px] h-8">
                  <SelectValue placeholder="Все оплаты" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="ALL">Все оплаты</SelectItem>
                  <SelectItem v-for="item in PAYMENT_STATUSES" :key="item" :value="item">
                    {{ paymentStatusLabel(item) }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              v-if="status !== ALL || paymentStatus !== ALL"
              variant="ghost"
              size="sm"
              class="h-8"
              @click="resetFilters"
            >
              Сбросить
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <OrderTable :params="params" :orders="orders" :is-loading="isLoading" />
      </CardContent>
      <CardFooter>
        <div class="text-xs text-muted-foreground">
          Всего: <strong>{{ orders.pagination.total ?? 0 }}</strong> заказов
        </div>
      </CardFooter>
    </Card>
  </main>
</template>
