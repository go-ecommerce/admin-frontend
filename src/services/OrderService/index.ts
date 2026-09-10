import { api } from '@/api/api'
import type { IOrderRequest, IOrderResponse } from '@/utils/types/api/apiGo'
import type {
  AdminOrderResponse,
  AdminUpdateOrderRequest,
  UpdateOrderStatusRequest,
} from '@/utils/types/api/generatedApiGo'

function compactParams(payload: IOrderRequest): Partial<IOrderRequest> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== ''),
  ) as Partial<IOrderRequest>
}

export default class OrderService {
  public static async getOrders(payload: IOrderRequest): Promise<IOrderResponse> {
    const { data }: any = await api.get('/admin/orders', compactParams(payload))
    return data
  }

  public static async getOrderByNumber(number: number): Promise<AdminOrderResponse> {
    const { data }: any = await api.get(`/admin/orders/${number}`)
    return data
  }

  public static async updateOrder(
    number: number,
    payload: AdminUpdateOrderRequest,
  ): Promise<AdminOrderResponse> {
    const { data }: any = await api.patch(`/admin/orders/${number}`, payload)
    return data
  }

  public static async updateOrderStatus(
    number: number,
    payload: UpdateOrderStatusRequest,
  ): Promise<AdminOrderResponse> {
    const { data }: any = await api.patch(`/admin/orders/${number}/status`, payload)
    return data
  }
}
