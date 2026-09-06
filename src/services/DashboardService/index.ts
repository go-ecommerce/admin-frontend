import { api } from '@/api/api'
import type { DashboardResponse } from '@/utils/types/api/generatedApiGo'

export type DashboardOverviewRequest = {
  from?: string
  to?: string
}

export default class DashboardService {
  public static async getOverview(
    payload: DashboardOverviewRequest = {},
  ): Promise<DashboardResponse> {
    const params = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => Boolean(value)),
    )
    const { data }: { data?: DashboardResponse } = await api.get(
      '/admin/dashboard',
      Object.keys(params).length ? params : null,
    )
    return data ?? {}
  }
}
