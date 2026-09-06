import { collectApiErrorMessages } from '@/utils/apiError'

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'invalid credentials': 'Неверный email или пароль',
  'invalid email or password': 'Неверный email или пароль',
  'account is banned': 'Аккаунт заблокирован',
}

export function translateAuthError(error: unknown): string {
  const status =
    (error as { status?: number; statusCode?: number }).status ||
    (error as { statusCode?: number }).statusCode

  for (const message of collectApiErrorMessages(error)) {
    const normalized = message.trim().toLowerCase()
    const translated =
      AUTH_ERROR_MESSAGES[normalized] ||
      Object.entries(AUTH_ERROR_MESSAGES).find(([key]) => normalized.includes(key))?.[1]

    if (translated) return translated
  }

  if (status === 401) return AUTH_ERROR_MESSAGES['invalid email or password']
  if (status === 403) return AUTH_ERROR_MESSAGES['account is banned']

  return 'Не удалось войти'
}
