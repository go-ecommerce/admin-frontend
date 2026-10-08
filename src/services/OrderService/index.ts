import { api } from '@/api/api'
import type { IOrderRequest, IOrderResponse } from '@/utils/types/api/apiGo'
import type {
  AdminOrderItemsEditResponse,
  AdminOrderResponse,
  AdminPreviewOrderItemsRequest,
  AdminRefundOrderRequest,
  AdminUpdateOrderItemsRequest,
  AdminUpdateOrderRequest,
  OrderEditResponse,
  RefundResponse,
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

  public static async refundOrder(
    number: number,
    payload: AdminRefundOrderRequest,
    idempotencyKey: string,
  ): Promise<AdminOrderResponse> {
    const { data }: any = await api.post(`/admin/orders/${number}/refund`, payload, {
      headers: { 'Idempotency-Key': idempotencyKey },
    })
    return data
  }

  public static async getOrderRefunds(number: number): Promise<RefundResponse[]> {
    const { data }: any = await api.get(`/admin/orders/${number}/refunds`)
    return data ?? []
  }

  public static async getOrderEdits(number: number): Promise<OrderEditResponse[]> {
    const { data }: any = await api.get(`/admin/orders/${number}/edits`)
    return data ?? []
  }

  public static async previewOrderItems(
    number: number,
    payload: AdminPreviewOrderItemsRequest,
  ): Promise<AdminOrderItemsEditResponse> {
    const { data }: any = await api.post(`/admin/orders/${number}/items/preview`, payload)
    return data
  }

  public static async updateOrderItems(
    number: number,
    payload: AdminUpdateOrderItemsRequest & {
      // shopspring decimal is JSON-encoded as a string; pass it through as-is.
      expected_grand_total: number | string
    },
  ): Promise<AdminOrderItemsEditResponse> {
    const { data }: any = await api.put(`/admin/orders/${number}/items`, payload)
    return data
  }
}
