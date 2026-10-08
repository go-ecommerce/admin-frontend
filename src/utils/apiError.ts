type ApiErrorItem = {
  field?: string
  message?: string
}

type ApiErrorBody = {
  code?: number
  message?: string
  errors?: ApiErrorItem[] | Record<string, ApiErrorItem | string>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isGenericFetchMessage(message?: string) {
  return Boolean(message && /^\[[A-Z]+\]\s+"/.test(message))
}

export function getApiErrorBody(error: unknown): ApiErrorBody | undefined {
  if (!isRecord(error)) return undefined
  const data = error.data ?? error._data
  return isRecord(data) ? (data as ApiErrorBody) : undefined
}

export function normalizeFieldErrors(errors: ApiErrorBody['errors']): Record<string, string> {
  const result: Record<string, string> = {}
  if (!errors) return result

  if (Array.isArray(errors)) {
    for (const item of errors) {
      if (item?.field && item.message) result[item.field] = item.message
    }
    return result
  }

  for (const [key, value] of Object.entries(errors)) {
    if (typeof value === 'string') result[key] = value
    else if (value?.field && value.message) result[value.field] = value.message
    else if (value?.message) result[key] = value.message
  }

  return result
}

export function extractApiFieldErrors(error: unknown): Record<string, string> {
  return normalizeFieldErrors(getApiErrorBody(error)?.errors)
}

export function collectApiErrorMessages(error: unknown): string[] {
  const body = getApiErrorBody(error)
  const messages: string[] = []

  if (Array.isArray(body?.errors)) {
    for (const item of body.errors) {
      if (item?.message) messages.push(item.message)
    }
  } else if (body?.errors) {
    messages.push(...Object.values(normalizeFieldErrors(body.errors)))
  }

  if (body?.message) messages.push(body.message)

  const err = error as { message?: string; statusMessage?: string }
  if (err.message && !isGenericFetchMessage(err.message)) messages.push(err.message)
  if (err.statusMessage && !isGenericFetchMessage(err.statusMessage)) {
    messages.push(err.statusMessage)
  }

  return [...new Set(messages.filter(Boolean))]
}

export function extractApiErrorMessage(error: unknown, fallback: string): string {
  return collectApiErrorMessages(error)[0] || fallback
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (!isRecord(error)) return undefined
  if (typeof error.status === 'number') return error.status
  if (typeof error.statusCode === 'number') return error.statusCode
  if (isRecord(error.response) && typeof error.response.status === 'number') {
    return error.response.status
  }
  return undefined
}

export function isNetworkOrTimeoutError(error: unknown): boolean {
  if (!isRecord(error)) return false
  const status = getApiErrorStatus(error)
  if (status != null && status > 0) return false

  const name = String(error.name || '')
  const message = String(error.message || '').toLowerCase()
  if (name === 'AbortError' || name === 'TimeoutError') return true
  if (message.includes('timeout') || message.includes('network') || message.includes('failed to fetch')) {
    return true
  }
  if (message.includes('<no response>') || message.includes('fetch failed')) return true
  // ofetch FetchError without an HTTP status → transport failure
  return name === 'FetchError' || status === 0
}

export type RefundErrorKind = 'pending' | 'nothing' | 'rejected' | 'unknown_status' | 'other'

export function classifyRefundError(error: unknown): { kind: RefundErrorKind; message: string } {
  if (isNetworkOrTimeoutError(error)) {
    return { kind: 'unknown_status', message: 'Статус неизвестен' }
  }

  const status = getApiErrorStatus(error)
  const raw = collectApiErrorMessages(error).join(' ')
  const text = raw.toLowerCase()

  if (status === 409 && text.includes('pending at the acquirer')) {
    return {
      kind: 'pending',
      message: 'Возврат обрабатывается банком. Проверьте позже',
    }
  }

  if (status === 409 && text.includes('nothing to refund')) {
    return { kind: 'nothing', message: 'Возвращать нечего' }
  }

  if (status === 422 && (text.includes('rejected') || text.includes('refund rejected'))) {
    return {
      kind: 'rejected',
      message: `Банк отклонил возврат: ${raw || 'отклонено'}`,
    }
  }

  return {
    kind: 'other',
    message: extractApiErrorMessage(error, 'Не удалось оформить возврат'),
  }
}
