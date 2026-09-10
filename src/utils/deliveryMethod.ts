import type {
  DeliveryMethodResponse,
  OrderShippingResponse,
} from '@/utils/types/api/generatedApiGo'

export type ProviderMapUi = {
  provider: string
  label: string
  iconSrc: string
  clusterClass: string
}

const PROVIDER_MAP_UI: Record<string, Omit<ProviderMapUi, 'provider'>> = {
  cdek: {
    label: 'СДЭК',
    iconSrc: '/icons/cdek_point.svg',
    clusterClass: 'bg-[#1AB248]',
  },
  pochta: {
    label: 'Почты России',
    iconSrc: '/icons/pochta_point.svg',
    clusterClass: 'bg-[#1928DC]',
  },
  yandex_delivery: {
    label: 'Яндекс Доставки',
    iconSrc: '/icons/yandex_point.svg',
    clusterClass: 'bg-[#FC3F1D]',
  },
}

export function deliveryMethodTitle(method: DeliveryMethodResponse) {
  return method.title?.trim() || method.code || ''
}

/**
 * Backend stores shipping.method as the method title (e.g. "СДЭК"), not the
 * catalogue code ("cdek_pvz"). Match by code, title, then provider snapshot.
 */
export function resolveDeliveryMethod(
  shipping: OrderShippingResponse | null | undefined,
  methods: DeliveryMethodResponse[],
): DeliveryMethodResponse | null {
  if (!shipping || !methods.length) return null

  const stored = shipping.method?.trim()
  if (stored) {
    const byCode = methods.find((method) => method.code === stored)
    if (byCode) return byCode

    const byTitle = methods.find(
      (method) => deliveryMethodTitle(method).toLowerCase() === stored.toLowerCase(),
    )
    if (byTitle) return byTitle
  }

  if (shipping.provider) {
    const sameProvider = methods.filter((method) => method.provider === shipping.provider)
    if (shipping.point_code) {
      const withPoints = sameProvider.find((method) => method.has_points)
      if (withPoints) return withPoints
    }
    if (shipping.tariff_code) {
      const byTariff = sameProvider.find((method) => method.tariff_code === shipping.tariff_code)
      if (byTariff) return byTariff
    }
    if (sameProvider[0]) return sameProvider[0]
  }

  return null
}

export function pointsMapUi(
  method: DeliveryMethodResponse | null | undefined,
): ProviderMapUi | null {
  if (!method?.has_points || !method.provider) return null
  const ui = PROVIDER_MAP_UI[method.provider] || {
    label: deliveryMethodTitle(method),
    iconSrc: '/icons/cdek_point.svg',
    clusterClass: 'bg-muted-foreground',
  }
  return { provider: method.provider, ...ui }
}
