import { api } from '@/api/api'
import type { AuthRequest, AuthResponse, UserInfoResponse } from '@/utils/types/api/generatedApiGo'

export default class AuthService {
  public static async loginUser(payload: AuthRequest): Promise<AuthResponse> {
    const { data }: any = await api.post('/auth/login', payload)
    return data.token
  }

  public static async getUserInfo(): Promise<UserInfoResponse> {
    const { data }: any = await api.get('/user/info/')
    return data
  }
}
