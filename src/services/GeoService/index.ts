import { api } from '@/api/api'
import type { CityResponse } from '@/utils/types/api/generatedApiGo'

export default class GeoService {
  public static async getPopularCities(): Promise<CityResponse[]> {
    const { data }: any = await api.get('/geo/city/popular')
    return data ?? []
  }

  public static async findCity(city: string): Promise<CityResponse[]> {
    const { data }: any = await api.get('/geo/city/find', { city })
    return data ?? []
  }
}
