import { api } from '@/api/api'
import type {
  AuthRequest,
  JSONResponseAuthResponse,
  JSONResponseUserInfoResponse,
  UserInfoResponse,
} from '@/utils/types/api/generatedApiGo'

export default class AuthService {
  public static async loginUser(payload: AuthRequest): Promise<string> {
    const response = await api.post<AuthRequest, JSONResponseAuthResponse>('/auth/login', payload)
    const token = response.data?.token
    if (!token) {
      throw new Error('Токен не получен')
    }
    return token
  }

  public static async getUserInfo(): Promise<UserInfoResponse> {
    const response = await api.get<unknown, JSONResponseUserInfoResponse>('/user/info')
    if (!response.data) {
      throw new Error('Не удалось получить данные пользователя')
    }
    return response.data
  }
}
