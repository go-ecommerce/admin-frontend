import { defineStore } from 'pinia'

import { ref } from 'vue'

import { useToast } from '@/components/ui/toast'
import OrderService from '@/services/OrderService'
import { extractApiErrorMessage } from '@/utils/apiError'
import type { IOrderRequest, IOrderResponse } from '@/utils/types/api/apiGo'
import type {
  AdminOrderResponse,
  AdminUpdateOrderRequest,
  UpdateOrderStatusRequest,
} from '@/utils/types/api/generatedApiGo'

const defaultPagination = { page: 1, page_size: 10, total: 0, last_page: 1 }

const defaultOrders: IOrderResponse = {
  items: [],
  pagination: { ...defaultPagination },
}

const applyUpdatedOrder = (
  orders: IOrderResponse,
  updated: AdminOrderResponse,
): IOrderResponse => ({
  ...orders,
  items: orders.items.map((item) => (item.number === updated.number ? updated : item)),
})

export const useOrderStore = defineStore('order', () => {
  const isLoading = ref(false)
  const orders = ref<IOrderResponse>(defaultOrders)
  const currentOrder = ref<AdminOrderResponse | null>(null)
  const { toast } = useToast()

  const getOrders = async (payload: IOrderRequest): Promise<void> => {
    try {
      isLoading.value = true
      orders.value = await OrderService.getOrders(payload)
    } catch (error: unknown) {
      toast({
        title: 'Не удалось загрузить заказы',
        description: extractApiErrorMessage(error, 'Ошибка при загрузке списка заказов'),
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getOrderByNumber = async (number: number): Promise<void> => {
    try {
      isLoading.value = true
      currentOrder.value = await OrderService.getOrderByNumber(number)
    } catch (error: unknown) {
      toast({
        title: 'Не удалось загрузить заказ',
        description: extractApiErrorMessage(error, 'Ошибка при загрузке заказа'),
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateOrder = async (
    number: number,
    payload: AdminUpdateOrderRequest,
  ): Promise<AdminOrderResponse> => {
    try {
      isLoading.value = true
      const updated = await OrderService.updateOrder(number, payload)
      currentOrder.value = updated
      orders.value = applyUpdatedOrder(orders.value, updated)
      toast({ title: '✅ Заказ сохранён', variant: 'success' })
      return updated
    } catch (error: unknown) {
      toast({
        title: 'Не удалось сохранить заказ',
        description: extractApiErrorMessage(error, 'Ошибка при редактировании заказа'),
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateOrderStatus = async (
    number: number,
    payload: UpdateOrderStatusRequest,
  ): Promise<AdminOrderResponse> => {
    try {
      isLoading.value = true
      const updated = await OrderService.updateOrderStatus(number, payload)
      currentOrder.value = updated
      orders.value = applyUpdatedOrder(orders.value, updated)
      toast({ title: '✅ Статус заказа обновлён', variant: 'success' })
      return updated
    } catch (error: unknown) {
      toast({
        title: 'Не удалось обновить статус',
        description: extractApiErrorMessage(error, 'Ошибка при смене статуса заказа'),
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    orders,
    currentOrder,
    getOrders,
    getOrderByNumber,
    updateOrder,
    updateOrderStatus,
  }
})
