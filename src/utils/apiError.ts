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
