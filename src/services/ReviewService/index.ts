import { api } from '@/api/api'
import type { IProductReviewRequest, IProductReviewResponse } from '@/utils/types/api/apiGo'
import type {
  AdminProductReviewResponse,
  UpdateProductReviewStatusRequest,
} from '@/utils/types/api/generatedApiGo'

function compactParams(payload: IProductReviewRequest): Partial<IProductReviewRequest> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== ''),
  ) as Partial<IProductReviewRequest>
}

export default class ReviewService {
  public static async getReviews(payload: IProductReviewRequest): Promise<IProductReviewResponse> {
    const { data }: any = await api.get('/admin/product-reviews', compactParams(payload))
    return data
  }

  public static async getReviewById(id: string): Promise<AdminProductReviewResponse> {
    const { data }: any = await api.get(`/admin/product-reviews/${id}`)
    return data
  }

  public static async updateReviewStatus(
    id: string,
    payload: UpdateProductReviewStatusRequest,
  ): Promise<AdminProductReviewResponse> {
    const { data }: any = await api.patch(`/admin/product-reviews/${id}/status`, payload)
    return data
  }

  public static async deleteReview(id: string): Promise<void> {
    await api.delete(`/admin/product-reviews/${id}`)
  }

  public static async restoreReview(id: string): Promise<AdminProductReviewResponse> {
    const { data }: any = await api.post(`/admin/product-reviews/${id}/restore`)
    return data
  }
}
