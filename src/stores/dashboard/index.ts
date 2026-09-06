import { defineStore } from 'pinia'

import { ref } from 'vue'

import { useToast } from '@/components/ui/toast'
import DashboardService from '@/services/DashboardService'
import OrderService from '@/services/OrderService'
import { extractApiErrorMessage } from '@/utils/apiError'
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@/utils/order'
import type { AdminOrderResponse, DashboardResponse } from '@/utils/types/api/generatedApiGo'

export type DashboardStatusCounts = Record<(typeof ORDER_STATUSES)[number], number>
export type DashboardPaymentCounts = Record<(typeof PAYMENT_STATUSES)[number], number>

export type DashboardSnapshot = {
  periodFrom?: string
  periodTo?: string
  ordersToday: number
  ordersTotal: number
  unpaid: number
  statusCounts: DashboardStatusCounts
  paymentCounts: DashboardPaymentCounts
  revenueToday: string
  revenuePeriod: string
  currency: string
  averageOrderValue: string
  products: number
  productsWithoutVariants: number
  variants: number
  variantsOutOfStock: number
  categories: number
  collections: number
  customersNewToday: number
  customersTotal: number
  recentOrders: AdminOrderResponse[]
}

const emptyStatusCounts = (): DashboardStatusCounts =>
  Object.fromEntries(ORDER_STATUSES.map((status) => [status, 0])) as DashboardStatusCounts

const emptyPaymentCounts = (): DashboardPaymentCounts =>
  Object.fromEntries(PAYMENT_STATUSES.map((status) => [status, 0])) as DashboardPaymentCounts

export const emptySnapshot = (): DashboardSnapshot => ({
  ordersToday: 0,
  ordersTotal: 0,
  unpaid: 0,
  statusCounts: emptyStatusCounts(),
  paymentCounts: emptyPaymentCounts(),
  revenueToday: '0.00',
  revenuePeriod: '0.00',
  currency: 'RUB',
  averageOrderValue: '0.00',
  products: 0,
  productsWithoutVariants: 0,
  variants: 0,
  variantsOutOfStock: 0,
  categories: 0,
  collections: 0,
  customersNewToday: 0,
  customersTotal: 0,
  recentOrders: [],
})

export const mapDashboardResponse = (
  data: DashboardResponse,
  recentOrders: AdminOrderResponse[] = [],
): DashboardSnapshot => ({
  periodFrom: data.period?.from,
  periodTo: data.period?.to,
  ordersToday: data.orders?.today ?? 0,
  ordersTotal: data.orders?.total ?? 0,
  unpaid: data.orders?.by_payment_status?.unpaid ?? 0,
  statusCounts: {
    pending: data.orders?.by_status?.pending ?? 0,
    paid: data.orders?.by_status?.paid ?? 0,
    processing: data.orders?.by_status?.processing ?? 0,
    shipped: data.orders?.by_status?.shipped ?? 0,
    delivered: data.orders?.by_status?.delivered ?? 0,
    cancelled: data.orders?.by_status?.cancelled ?? 0,
    refunded: data.orders?.by_status?.refunded ?? 0,
  },
  paymentCounts: {
    unpaid: data.orders?.by_payment_status?.unpaid ?? 0,
    paid: data.orders?.by_payment_status?.paid ?? 0,
    refunded: data.orders?.by_payment_status?.refunded ?? 0,
    failed: data.orders?.by_payment_status?.failed ?? 0,
  },
  revenueToday: data.revenue?.today ?? '0.00',
  revenuePeriod: data.revenue?.period ?? '0.00',
  currency: data.revenue?.currency ?? 'RUB',
  averageOrderValue: data.average_order_value ?? '0.00',
  products: data.catalog?.products ?? 0,
  productsWithoutVariants: data.catalog?.products_without_variants ?? 0,
  variants: data.catalog?.variants ?? 0,
  variantsOutOfStock: data.catalog?.variants_out_of_stock ?? 0,
  categories: data.catalog?.categories ?? 0,
  collections: data.catalog?.collections ?? 0,
  customersNewToday: data.customers?.new_today ?? 0,
  customersTotal: data.customers?.total ?? 0,
  recentOrders,
})

export const useDashboardStore = defineStore('dashboard', () => {
  const isLoading = ref(false)
  const snapshot = ref<DashboardSnapshot>(emptySnapshot())
  const { toast } = useToast()

  const load = async (): Promise<void> => {
    isLoading.value = true
    try {
      const [overview, recent] = await Promise.allSettled([
        DashboardService.getOverview(),
        OrderService.getOrders({ page: 1, page_size: 8 }),
      ])

      if (overview.status === 'rejected') {
        toast({
          title: 'Не удалось загрузить обзор',
          description: extractApiErrorMessage(overview.reason, 'Ошибка при загрузке данных дашборда'),
          variant: 'destructive',
        })
        return
      }

      const recentOrders =
        recent.status === 'fulfilled' ? (recent.value.items ?? []) : snapshot.value.recentOrders

      snapshot.value = mapDashboardResponse(overview.value, recentOrders)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    snapshot,
    load,
  }
})
