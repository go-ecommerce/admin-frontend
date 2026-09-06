import type { UpdateOrderStatusRequest } from '@/utils/types/api/generatedApiGo'

export const ORDER_STATUSES = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const

export const PAYMENT_STATUSES = ['unpaid', 'paid', 'refunded', 'failed'] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]
export type OrderStatusTarget = UpdateOrderStatusRequest['status']

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает обработки',
  paid: 'Оплачен',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
  refunded: 'Возврат',
}

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: 'Не оплачен',
  paid: 'Оплачен',
  refunded: 'Возврат',
  failed: 'Ошибка оплаты',
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: 'Банковская карта',
  invoice: 'По счёту',
  cash: 'При получении',
}

const SHIPPING_METHOD_LABELS: Record<string, string> = {
  pickup: 'Самовывоз',
  cdek: 'СДЭК',
  post: 'Почта России',
  yandex: 'Яндекс Доставка',
}

const ORDER_STATUS_CLASS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  paid: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-muted text-muted-foreground',
  refunded: 'bg-muted text-muted-foreground',
}

const PAYMENT_STATUS_CLASS: Record<string, string> = {
  unpaid: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  refunded: 'bg-muted text-muted-foreground',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const ALLOWED_TRANSITIONS: Record<string, OrderStatusTarget[]> = {
  pending: ['paid', 'cancelled'],
  paid: ['processing', 'cancelled', 'refunded'],
  processing: ['shipped', 'cancelled', 'refunded'],
  shipped: ['delivered', 'refunded'],
  delivered: ['refunded'],
}

export function orderStatusLabel(status?: string) {
  if (!status) return '—'
  return ORDER_STATUS_LABELS[status] || status
}

export function paymentStatusLabel(status?: string) {
  if (!status) return '—'
  return PAYMENT_STATUS_LABELS[status] || status
}

export function paymentMethodLabel(method?: string) {
  if (!method) return '—'
  return PAYMENT_METHOD_LABELS[method] || method
}

export function shippingMethodLabel(method?: string) {
  if (!method) return '—'
  return SHIPPING_METHOD_LABELS[method] || method
}

export function orderStatusClass(status?: string) {
  return ORDER_STATUS_CLASS[status ?? ''] || 'bg-muted text-muted-foreground'
}

export function paymentStatusClass(status?: string) {
  return PAYMENT_STATUS_CLASS[status ?? ''] || 'bg-muted text-muted-foreground'
}

export function nextOrderStatuses(status?: string): OrderStatusTarget[] {
  return ALLOWED_TRANSITIONS[status ?? ''] ?? []
}

export function formatOrderMoney(value?: number | string, currency = 'RUB') {
  const amount = typeof value === 'string' ? Number(value.replace(',', '.')) : value
  if (amount == null || !Number.isFinite(amount)) return `0 ${currency}`
  return `${amount.toLocaleString('ru-RU')} ${currency}`
}

export function formatOrderDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export { extractApiErrorMessage } from '@/utils/apiError'
