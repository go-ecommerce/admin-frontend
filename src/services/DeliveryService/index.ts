import { api } from '@/api/api'
import type {
  DeliveryMethodResponse,
  DeliveryPointResponse,
} from '@/utils/types/api/generatedApiGo'

export type DeliveryPointsQuery = {
  index?: string
  latitude?: number
  locality?: string
  longitude?: number
  max_lat?: number
  max_lon?: number
  min_lat?: number
  min_lon?: number
  radius_km?: number
  region?: string
  type?: string
}

export default class DeliveryService {
  public static async getMethods(): Promise<DeliveryMethodResponse[]> {
    const { data }: any = await api.get('/delivery/methods')
    return data ?? []
  }

  public static async getDeliveryPoints(
    provider: string,
    query: DeliveryPointsQuery = {},
  ): Promise<DeliveryPointResponse[]> {
    const { data }: any = await api.get(`/delivery/${provider}/points`, query)
    return data ?? []
  }
}
