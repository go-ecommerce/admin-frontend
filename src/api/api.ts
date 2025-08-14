import { type $Fetch, $fetch, type FetchOptions } from 'ofetch'

import { CustomError } from '@/api/errors/customError'
import type { Token } from '@/api/types'
import { useErrorStore } from '@/stores/error'
import { USER } from '@/utils/constants/user'

const baseConfig: FetchOptions = {
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
  },
  async onResponseError({ request, response, options }) {
    if (response?.status === 422) {
      const message = response._data.message
      useErrorStore().setErrors(response._data.errors)
      console.error(response._data)
      throw new CustomError(message, response.status)
    }

    if (response?.status === 401) {
      localStorage.removeItem('api_token')
      window.location.replace('/')
    }
  },
}
export default class Api {
  private accessToken: Token
  private readonly accessTokenProvider: () => Token

  private readonly fetchInstance: $Fetch

  constructor(fetchOptions: FetchOptions, accessTokenProvider: () => Token) {
    this.fetchInstance = $fetch.create(fetchOptions)
    this.accessTokenProvider = accessTokenProvider
    this.setAccessToken(this.accessTokenProvider())
  }

  protected getBearer(): string {
    return `Bearer ${this.accessToken}`
  }

  protected setAccessToken(accessToken: Token): void {
    this.accessToken = accessToken
  }

  private async request<D, R>(
    url: string,
    options: FetchOptions<'json'>, // Set the type directly here
  ): Promise<R> {
    this.setAccessToken(this.accessTokenProvider())
    useErrorStore().resetError() // clear store error
    try {
      const requestOptions: FetchOptions<'json'> = {
        ...options,
      }

      if (this.accessToken) {
        requestOptions.headers = {
          ...options.headers,
          Authorization: this.getBearer(),
        }
      }

      return await this.fetchInstance<R>(url, requestOptions)
    } catch (error) {
      throw error
    }
  }

  public get<D, R>(
    url: string,
    params: Partial<D> | null = null,
    options: FetchOptions<'json'> = {},
  ) {
    return this.request<D, R>(url, {
      ...options,
      method: 'GET',
      params: params ?? undefined,
    })
  }

  public post<D, R>(
    url: string,
    data: Partial<D> | null = null,
    options: FetchOptions<'json'> = {},
  ) {
    return this.request<D, R>(url, {
      ...options,
      method: 'POST',
      body: data,
    })
  }

  public patch<D, R>(
    url: string,
    data: Partial<D> | null = null,
    options: FetchOptions<'json'> = {},
  ) {
    return this.request<D, R>(url, {
      ...options,
      method: 'PATCH',
      body: data,
    })
  }

  public put<D, R>(
    url: string,
    data: Partial<D> | null = null,
    options: FetchOptions<'json'> = {},
  ) {
    return this.request<D, R>(url, {
      ...options,
      method: 'PUT',
      body: data,
    })
  }

  public delete<D, R>(
    url: string,
    data: Partial<D> | null = null,
    options: FetchOptions<'json'> = {},
  ) {
    return this.request<D, R>(url, {
      ...options,
      method: 'DELETE',
      body: data,
    })
  }

  public uploadFile<R>(
    url: string,
    data: FormData,
    options: FetchOptions<'json'> = {},
  ): Promise<R> {
    return this.request<FormData, R>(url, {
      ...options,
      method: 'POST',
      body: data,
      headers: {
        ...options.headers,
      },
    })
  }
}

const getAccessTokenFromStorage = (): Token => {
  return localStorage.getItem(USER.TOKEN_KEY_LS) || ''
}
export const api = new Api(baseConfig, getAccessTokenFromStorage)
