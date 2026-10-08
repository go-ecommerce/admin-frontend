import type {
  OrderEditLineResponse,
  UpdateOrderStatusRequest,
} from '@/utils/types/api/generatedApiGo'

export const ORDER_STATUSES = [
  'new',
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const

export const PAYMENT_STATUSES = [
  'unpaid',
  'paid',
  'partially_refunded',
  'refunded',
  'failed',
] as const

export const PAYMENT_METHODS = ['card', 'cash', 'invoice'] as const

export const EDITABLE_ORDER_STATUSES = ['new', 'pending'] as const

/** Statuses that allow replacing order lines via PUT /items. */
export const ITEMS_EDITABLE_ORDER_STATUSES = ['new', 'pending', 'paid', 'processing'] as const

export const REFUND_STATUSES = ['pending', 'succeeded', 'failed'] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]
export type OrderStatusTarget = UpdateOrderStatusRequest['status']
export type RefundStatus = (typeof REFUND_STATUSES)[number]

const ORDER_STATUS_LABELS: Record<string, string> = {
  new: 'Новый',
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
  partially_refunded: 'Частичный возврат',
  refunded: 'Возврат',
  failed: 'Ошибка оплаты',
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: 'Банковская карта',
  invoice: 'По счёту',
  cash: 'При получении',
}

const ORDER_SOURCE_LABELS: Record<string, string> = {
  checkout: 'Оформление',
  quick: 'Быстрый заказ',
}

const SHIPPING_METHOD_LABELS: Record<string, string> = {
  pickup: 'Самовывоз',
  cdek: 'СДЭК',
  post: 'Почта России',
  pochta: 'Почта России',
  yandex: 'Яндекс Доставка',
  yandex_delivery: 'Яндекс Доставка',
}

const ORDER_STATUS_CLASS: Record<string, string> = {
  new: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
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
  partially_refunded: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  refunded: 'bg-muted text-muted-foreground',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const REFUND_STATUS_LABELS: Record<string, string> = {
  pending: 'В обработке',
  succeeded: 'Успешно',
  failed: 'Ошибка',
}

const REFUND_STATUS_CLASS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  succeeded: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const ALLOWED_TRANSITIONS: Record<string, OrderStatusTarget[]> = {
  // new -> pending happens via PATCH /admin/orders/{number} (edit), not status
  new: ['cancelled'],
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

export function orderSourceLabel(source?: string) {
  if (!source) return '—'
  return ORDER_SOURCE_LABELS[source] || source
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

export function refundStatusLabel(status?: string) {
  if (!status) return '—'
  return REFUND_STATUS_LABELS[status] || status
}

export function refundStatusClass(status?: string) {
  return REFUND_STATUS_CLASS[status ?? ''] || 'bg-muted text-muted-foreground'
}

export function nextOrderStatuses(status?: string): OrderStatusTarget[] {
  return ALLOWED_TRANSITIONS[status ?? ''] ?? []
}

export function isOrderEditable(status?: string) {
  return (EDITABLE_ORDER_STATUSES as readonly string[]).includes(status ?? '')
}

export function canEditOrderItems(status?: string) {
  return (ITEMS_EDITABLE_ORDER_STATUSES as readonly string[]).includes(status ?? '')
}

/** Online refund via POST /admin/orders/{number}/refund when payment was captured. */
export function canRefundOrder(
  order?: { status?: string; payment_status?: string; payment_method?: string } | null,
) {
  if (!order) return false
  if (order.payment_method === 'cash' || order.payment_method === 'invoice') return false
  if (order.payment_status !== 'paid' && order.payment_status !== 'partially_refunded') {
    return false
  }
  if (order.status === 'cancelled' || order.status === 'refunded') return false
  return true
}

/** Overpayment still owed to the customer: paid − already refunded − current total. */
export function orderRefundDue(order?: {
  paid_total?: number
  refunded_total?: number
  grand_total?: number
} | null) {
  if (!order) return 0
  const paid = order.paid_total ?? 0
  const refunded = order.refunded_total ?? 0
  const grand = order.grand_total ?? 0
  return Math.max(0, paid - refunded - grand)
}

export function formatOrderActor(actor?: string) {
  if (!actor) return '—'
  if (actor.startsWith('admin:')) {
    const id = actor.slice(6)
    return id.length > 8 ? `Админ ${id.slice(0, 8)}…` : `Админ ${id}`
  }
  if (actor === 'system') return 'Система'
  if (actor === 'customer') return 'Покупатель'
  if (actor.startsWith('payment:')) return `Платёж (${actor.slice(8)})`
  return actor
}

export type OrderEditLineDiff =
  | { kind: 'removed'; line: OrderEditLineResponse }
  | { kind: 'added'; line: OrderEditLineResponse }
  | {
      kind: 'changed'
      before: OrderEditLineResponse
      after: OrderEditLineResponse
    }

function lineKey(line: OrderEditLineResponse) {
  return line.variant_id || line.sku || line.name || ''
}

export function diffOrderEditLines(
  before: OrderEditLineResponse[] = [],
  after: OrderEditLineResponse[] = [],
): OrderEditLineDiff[] {
  const beforeMap = new Map(before.map((line) => [lineKey(line), line]))
  const afterMap = new Map(after.map((line) => [lineKey(line), line]))
  const diffs: OrderEditLineDiff[] = []

  for (const [key, line] of beforeMap) {
    const next = afterMap.get(key)
    if (!next) {
      diffs.push({ kind: 'removed', line })
      continue
    }
    if ((line.quantity ?? 0) !== (next.quantity ?? 0)) {
      diffs.push({ kind: 'changed', before: line, after: next })
    }
  }

  for (const [key, line] of afterMap) {
    if (!beforeMap.has(key)) diffs.push({ kind: 'added', line })
  }

  return diffs
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
