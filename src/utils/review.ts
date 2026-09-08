import type { UpdateProductReviewStatusRequest } from '@/utils/types/api/generatedApiGo'

export const REVIEW_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const

export type ReviewStatus = (typeof REVIEW_STATUSES)[number]
export type ReviewStatusTarget = UpdateProductReviewStatusRequest['status']

const REVIEW_STATUS_LABELS: Record<string, string> = {
  PENDING: 'На модерации',
  APPROVED: 'Одобрен',
  REJECTED: 'Отклонён',
}

const REVIEW_STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function reviewStatusLabel(status?: string) {
  if (!status) return '—'
  return REVIEW_STATUS_LABELS[status] || status
}

export function reviewStatusClass(status?: string) {
  if (!status) return 'bg-muted text-muted-foreground'
  return REVIEW_STATUS_CLASS[status] || 'bg-muted text-muted-foreground'
}

export function formatReviewDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatReviewRating(rating?: number) {
  if (rating == null || Number.isNaN(rating)) return '—'
  return `${rating} / 5`
}

export function shortId(value?: string, size = 8) {
  if (!value) return '—'
  return value.length <= size ? value : `${value.slice(0, size)}…`
}
