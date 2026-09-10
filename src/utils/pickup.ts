export const STORE_PICKUP = {
  address: 'г. Санкт-Петербург, Владимирский проспект 15, офис 31',
  title: 'ПВЗ 3delectronics',
  /** [longitude, latitude] — Yandex JS API 3 */
  coordinates: [30.347328, 59.929316] as [number, number],
}

/** Самовывоз доступен только в Санкт-Петербурге. */
export function isStorePickupCity(
  city?: {
    address?: string
    city?: string
    region?: string
    settlement?: string
  } | null,
) {
  const haystack = [city?.city, city?.region, city?.settlement, city?.address]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  if (!haystack) return false
  return haystack.includes('санкт-Петербург') || haystack.includes('петербург')
}
