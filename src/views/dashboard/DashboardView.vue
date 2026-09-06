<script setup lang="ts">
import {
  AlertTriangle,
  Clock3,
  CreditCard,
  FolderTree,
  Library,
  Package,
  PlusCircle,
  RefreshCw,
  ShoppingBag,
  Tags,
  Users,
  Wallet,
} from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import DashboardStatCard from '@/components/dashboard/DashboardStatCard.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStore } from '@/stores/dashboard'
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  formatOrderDate,
  formatOrderMoney,
  orderStatusClass,
  orderStatusLabel,
  paymentStatusClass,
  paymentStatusLabel,
} from '@/utils/order'

const router = useRouter()
const dashboardStore = useDashboardStore()
const { snapshot, isLoading } = storeToRefs(dashboardStore)
const { load } = dashboardStore

const periodLabel = computed(() => {
  if (!snapshot.value.periodFrom) {
    return new Date().toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }
  const from = new Date(snapshot.value.periodFrom)
  const to = snapshot.value.periodTo ? new Date(snapshot.value.periodTo) : from
  if (Number.isNaN(from.getTime())) {
    return 'Текущий день магазина'
  }
  const sameDay = from.toDateString() === to.toDateString()
  const dateText = from.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return sameDay ? dateText : `${from.toLocaleDateString('ru-RU')} — ${to.toLocaleDateString('ru-RU')}`
})

const money = (value: string) => formatOrderMoney(value, snapshot.value.currency)

const attentionItems = computed(() => [
  {
    title: 'Ожидают обработки',
    count: snapshot.value.statusCounts.pending,
    hint: 'Новые заказы без следующего шага',
    to: { name: 'order', query: { status: 'pending' } },
    warn: true,
  },
  {
    title: 'Не оплачены',
    count: snapshot.value.unpaid,
    hint: 'Нужно подтвердить оплату или отменить',
    to: { name: 'order', query: { payment_status: 'unpaid' } },
    warn: true,
  },
  {
    title: 'Ошибка оплаты',
    count: snapshot.value.paymentCounts.failed,
    hint: 'Платёж не прошёл',
    to: { name: 'order', query: { payment_status: 'failed' } },
    warn: true,
  },
  {
    title: 'Нет в наличии',
    count: snapshot.value.variantsOutOfStock,
    hint: 'Варианты с нулевым остатком',
    to: { name: 'product', query: { tab: 'variants' } },
    warn: true,
  },
  {
    title: 'Товары без вариантов',
    count: snapshot.value.productsWithoutVariants,
    hint: 'Карточка не попадёт в витрину',
    to: { name: 'product', query: { filter: 'without_variants' } },
    warn: true,
  },
])

const catalogItems = computed(() => [
  {
    title: 'Товары',
    count: snapshot.value.products,
    to: { name: 'product' },
    icon: Package,
  },
  {
    title: 'Варианты',
    count: snapshot.value.variants,
    to: { name: 'product', query: { tab: 'variants' } },
    icon: Tags,
  },
  {
    title: 'Категории',
    count: snapshot.value.categories,
    to: { name: 'category' },
    icon: FolderTree,
  },
  {
    title: 'Коллекции',
    count: snapshot.value.collections,
    to: { name: 'collection' },
    icon: Library,
  },
])

const maxStatusCount = computed(() =>
  Math.max(1, ...ORDER_STATUSES.map((status) => snapshot.value.statusCounts[status])),
)

const maxPaymentCount = computed(() =>
  Math.max(1, ...PAYMENT_STATUSES.map((status) => snapshot.value.paymentCounts[status])),
)

const formatCount = (value: number) => value.toLocaleString('ru-RU')

onMounted(() => {
  load()
})
</script>

<template>
  <main class="flex w-full min-w-0 flex-col gap-2 px-3 pb-3 pt-1">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Обзор</h1>
        <p class="text-sm text-muted-foreground capitalize">{{ periodLabel }}</p>
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          class="h-7 gap-1"
          :disabled="isLoading"
          @click="load"
        >
          <RefreshCw class="h-3.5 w-3.5" :class="{ 'animate-spin': isLoading }" />
          <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Обновить</span>
        </Button>
        <Button size="sm" class="h-7 gap-1" @click="router.push({ name: 'product-create' })">
          <PlusCircle class="h-3.5 w-3.5" />
          <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Добавить товар</span>
        </Button>
      </div>
    </div>

    <Card class="gap-0 overflow-hidden py-0">
      <div class="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
        <DashboardStatCard
          title="Выручка сегодня"
          :value="money(snapshot.revenueToday)"
          :hint="`Средний чек: ${money(snapshot.averageOrderValue)}`"
          :icon="Wallet"
          :loading="isLoading"
          @click="router.push({ name: 'order', query: { payment_status: 'paid' } })"
        />
        <DashboardStatCard
          title="Заказы сегодня"
          :value="snapshot.ordersToday"
          :hint="`Всего в магазине: ${formatCount(snapshot.ordersTotal)}`"
          :icon="ShoppingBag"
          :loading="isLoading"
          @click="router.push({ name: 'order' })"
        />
        <DashboardStatCard
          title="Ожидают обработки"
          :value="snapshot.statusCounts.pending"
          hint="Новые заказы, которые ещё не взяли в работу"
          :icon="Clock3"
          :loading="isLoading"
          :warn="snapshot.statusCounts.pending > 0"
          @click="router.push({ name: 'order', query: { status: 'pending' } })"
        />
        <DashboardStatCard
          title="Не оплачены"
          :value="snapshot.unpaid"
          hint="Заказы с неоплаченным счётом"
          :icon="CreditCard"
          :loading="isLoading"
          :warn="snapshot.unpaid > 0"
          @click="router.push({ name: 'order', query: { payment_status: 'unpaid' } })"
        />
      </div>
    </Card>

    <div class="grid w-full grid-cols-1 gap-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <Card class="w-full min-w-0 gap-2 py-3 [&_[data-slot=card-content]]:px-4 [&_[data-slot=card-header]]:px-4">
        <CardHeader>
          <div class="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Последние заказы</CardTitle>
              <CardDescription>Новые сверху. Откройте карточку, чтобы сменить статус.</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              class="h-7"
              @click="router.push({ name: 'order' })"
            >
              Все заказы
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="isLoading && snapshot.recentOrders.length === 0" class="space-y-3">
            <Skeleton v-for="index in 5" :key="index" class="h-12 w-full" />
          </div>
          <div
            v-else-if="snapshot.recentOrders.length === 0"
            class="flex flex-col items-center justify-center py-10 text-center"
          >
            <ShoppingBag class="mb-3 h-8 w-8 text-muted-foreground" />
            <p class="text-sm font-medium">Заказов пока нет</p>
            <p class="mt-1 text-xs text-muted-foreground">Новые появятся здесь сразу после оформления.</p>
          </div>
          <div v-else class="divide-y">
            <button
              v-for="order in snapshot.recentOrders"
              :key="order.id || order.number"
              type="button"
              class="flex w-full items-center gap-3 py-2 text-left transition-colors first:pt-0 last:pb-0 hover:bg-accent/40 -mx-2 px-2 rounded-md"
              @click="router.push({ name: 'order-detail', params: { number: order.number } })"
            >
              <div class="min-w-16">
                <div class="text-sm font-medium">#{{ order.number }}</div>
                <div class="text-xs text-muted-foreground">{{ formatOrderDate(order.created_at) }}</div>
              </div>
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm">{{ order.email || 'Гость' }}</div>
                <div class="truncate text-xs text-muted-foreground">
                  {{ order.phone || order.shipping?.recipient || 'Без телефона' }}
                </div>
              </div>
              <div class="hidden items-center gap-1.5 sm:flex">
                <span
                  class="rounded-full px-2 py-0.5 text-xs"
                  :class="orderStatusClass(order.status)"
                >
                  {{ orderStatusLabel(order.status) }}
                </span>
                <span
                  class="rounded-full px-2 py-0.5 text-xs"
                  :class="paymentStatusClass(order.payment_status)"
                >
                  {{ paymentStatusLabel(order.payment_status) }}
                </span>
              </div>
              <div class="text-sm font-medium tabular-nums">
                {{ formatOrderMoney(order.grand_total, order.currency) }}
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      <div class="flex min-w-0 flex-col gap-2">
        <Card class="w-full gap-2 py-3 [&_[data-slot=card-content]]:px-4 [&_[data-slot=card-header]]:px-4">
          <CardHeader>
            <CardTitle>Требует внимания</CardTitle>
            <CardDescription>Очередь, с которой обычно начинают смену.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-1">
            <button
              v-for="item in attentionItems"
              :key="item.title"
              type="button"
              class="flex w-full items-center justify-between rounded-md px-2 py-2 text-left transition-colors hover:bg-accent/40"
              @click="router.push(item.to)"
            >
              <div class="min-w-0 pr-3">
                <div class="text-sm font-medium">{{ item.title }}</div>
                <div class="text-xs text-muted-foreground">{{ item.hint }}</div>
              </div>
              <span
                class="text-sm font-semibold tabular-nums"
                :class="item.warn && item.count > 0 ? 'text-amber-600 dark:text-amber-400' : ''"
              >
                {{ formatCount(item.count) }}
              </span>
            </button>
          </CardContent>
        </Card>

        <Card class="w-full gap-2 py-3 [&_[data-slot=card-content]]:px-4 [&_[data-slot=card-header]]:px-4">
          <CardHeader class="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Покупатели</CardTitle>
              <CardDescription>Новые за сегодня и всего в базе.</CardDescription>
            </div>
            <Users class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent class="grid grid-cols-2 gap-2">
            <div class="rounded-lg border px-3 py-3">
              <div class="text-lg font-semibold tabular-nums">
                {{ formatCount(snapshot.customersNewToday) }}
              </div>
              <div class="text-xs text-muted-foreground">Новые сегодня</div>
            </div>
            <div class="rounded-lg border px-3 py-3">
              <div class="text-lg font-semibold tabular-nums">
                {{ formatCount(snapshot.customersTotal) }}
              </div>
              <div class="text-xs text-muted-foreground">Всего</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <div class="grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
      <Card class="w-full min-w-0 gap-2 py-3 [&_[data-slot=card-content]]:px-4 [&_[data-slot=card-header]]:px-4">
        <CardHeader>
          <CardTitle>Каталог</CardTitle>
          <CardDescription>Объём витрины и дыры в карточках.</CardDescription>
        </CardHeader>
        <CardContent class="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <button
            v-for="item in catalogItems"
            :key="item.title"
            type="button"
            class="rounded-lg border px-3 py-3 text-left transition-colors hover:bg-accent/40"
            @click="router.push(item.to)"
          >
            <component :is="item.icon" class="mb-2 h-4 w-4 text-muted-foreground" />
            <div class="text-lg font-semibold tabular-nums">{{ formatCount(item.count) }}</div>
            <div class="text-xs text-muted-foreground">{{ item.title }}</div>
          </button>
          <button
            type="button"
            class="rounded-lg border px-3 py-3 text-left transition-colors hover:bg-accent/40"
            @click="router.push({ name: 'product', query: { tab: 'variants' } })"
          >
            <AlertTriangle
              class="mb-2 h-4 w-4"
              :class="snapshot.variantsOutOfStock > 0 ? 'text-amber-500' : 'text-muted-foreground'"
            />
            <div class="text-lg font-semibold tabular-nums">
              {{ formatCount(snapshot.variantsOutOfStock) }}
            </div>
            <div class="text-xs text-muted-foreground">Нет в наличии</div>
          </button>
          <button
            type="button"
            class="rounded-lg border px-3 py-3 text-left transition-colors hover:bg-accent/40"
            @click="router.push({ name: 'product', query: { filter: 'without_variants' } })"
          >
            <Package
              class="mb-2 h-4 w-4"
              :class="
                snapshot.productsWithoutVariants > 0 ? 'text-amber-500' : 'text-muted-foreground'
              "
            />
            <div class="text-lg font-semibold tabular-nums">
              {{ formatCount(snapshot.productsWithoutVariants) }}
            </div>
            <div class="text-xs text-muted-foreground">Без вариантов</div>
          </button>
        </CardContent>
      </Card>

      <Card class="w-full min-w-0 gap-2 py-3 [&_[data-slot=card-content]]:px-4 [&_[data-slot=card-header]]:px-4">
        <CardHeader>
          <CardTitle>Оплата</CardTitle>
          <CardDescription>Текущее распределение по статусу платежа.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <button
            v-for="status in PAYMENT_STATUSES"
            :key="status"
            type="button"
            class="grid w-full grid-cols-[8rem_1fr_3rem] items-center gap-3 text-left"
            @click="router.push({ name: 'order', query: { payment_status: status } })"
          >
            <span class="truncate text-sm">{{ paymentStatusLabel(status) }}</span>
            <div class="h-2 overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full bg-primary/80 transition-[width]"
                :style="{
                  width: `${(snapshot.paymentCounts[status] / maxPaymentCount) * 100}%`,
                }"
              />
            </div>
            <span class="text-right text-sm tabular-nums text-muted-foreground">
              {{ formatCount(snapshot.paymentCounts[status]) }}
            </span>
          </button>
          <p class="pt-1 text-xs text-muted-foreground">
            Выручка периода: {{ money(snapshot.revenuePeriod) }}. Считаются только оплаченные заказы.
          </p>
        </CardContent>
      </Card>
    </div>

    <Card class="w-full gap-2 py-3 [&_[data-slot=card-content]]:px-4 [&_[data-slot=card-header]]:px-4">
      <CardHeader>
        <CardTitle>Заказы по статусам</CardTitle>
        <CardDescription>Текущие корзины статусов, не выборка за период.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-3">
        <button
          v-for="status in ORDER_STATUSES"
          :key="status"
          type="button"
          class="grid w-full grid-cols-[10rem_1fr_3rem] items-center gap-3 text-left"
          @click="router.push({ name: 'order', query: { status } })"
        >
          <span class="truncate text-sm">{{ orderStatusLabel(status) }}</span>
          <div class="h-2 overflow-hidden rounded-full bg-muted">
            <div
              class="h-full rounded-full bg-primary/80 transition-[width]"
              :style="{
                width: `${(snapshot.statusCounts[status] / maxStatusCount) * 100}%`,
              }"
            />
          </div>
          <span class="text-right text-sm tabular-nums text-muted-foreground">
            {{ formatCount(snapshot.statusCounts[status]) }}
          </span>
        </button>
      </CardContent>
    </Card>
  </main>
</template>
