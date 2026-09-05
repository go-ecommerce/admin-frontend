import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AuthService from '@/services/AuthService'
import { translateAuthError } from '@/utils/authErrors'
import { USER } from '@/utils/constants/user'
import type { AuthRequest, UserInfoResponse } from '@/utils/types/api/generatedApiGo'

export const userStartData: UserInfoResponse = {
  id: '',
  email: '',
  location: '',
  language: '',
  is_admin: false,
  email_verified_at: undefined,
  created_at: undefined,
  updated_at: undefined,
}

export const setUserData = (data: UserInfoResponse) => {
  return {
    id: data.id ?? userStartData.id,
    email: data.email ?? userStartData.email,
    location: data.location ?? userStartData.location,
    language: data.language ?? userStartData.language,
    is_admin: data.is_admin ?? userStartData.is_admin,
    created_at: data.created_at ?? userStartData.created_at,
    updated_at: data.updated_at ?? userStartData.updated_at,
  }
}

export const useAuthStore = defineStore('Auth', () => {
  const isLoggedIn = ref<boolean>(!!localStorage.getItem(USER.TOKEN_KEY_LS))
  const isLoading = ref<boolean>(false)
  const loginError = ref<string>('')
  const user = ref<UserInfoResponse>(cloneDeep(userStartData))

  const router = useRouter()

  const clearSession = (): void => {
    localStorage.removeItem(USER.TOKEN_KEY_LS)
    isLoggedIn.value = false
    user.value = cloneDeep(userStartData)
  }

  const initStore = async (): Promise<void> => {
    try {
      await getUser()
      isLoggedIn.value = true
    } catch (error: unknown) {
      removeToken()
      throw error
    }
  }

  const getUser = async () => {
    const data = await AuthService.getUserInfo()
    if (!data.is_admin) {
      throw new Error('Недостаточно прав для входа в админ-панель')
    }
    user.value = setUserData(data)
  }

  const setToken = (token: string): void => {
    localStorage.setItem(USER.TOKEN_KEY_LS, token)
  }

  const login = async (body: AuthRequest) => {
    try {
      isLoading.value = true
      loginError.value = ''
      const token = await AuthService.loginUser(body)
      setToken(token)
      const data = await AuthService.getUserInfo()
      if (!data.is_admin) {
        clearSession()
        loginError.value = 'Недостаточно прав для входа в админ-панель'
        return
      }
      user.value = setUserData(data)
      isLoggedIn.value = true
      await router.push({ name: 'dashboard' })
    } catch (error: unknown) {
      clearSession()
      loginError.value = translateAuthError(error)
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    removeToken()
  }

  const removeToken = () => {
    clearSession()
    window.location.href = '/'
  }

  return {
    user,
    isLoggedIn,
    isLoading,
    loginError,
    initStore,
    login,
    logout,
  }
})
