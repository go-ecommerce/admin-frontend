import type { DeliveryPointResponse } from '@/utils/types/api/generatedApiGo'

export function deliveryPointLat(point: Pick<DeliveryPointResponse, 'latitude'>) {
  return Number(point.latitude)
}

export function deliveryPointLon(point: Pick<DeliveryPointResponse, 'longitude'>) {
  return Number(point.longitude)
}

function detailString(point: DeliveryPointResponse, key: string) {
  const value = point.details?.[key]
  return typeof value === 'string' ? value.trim() : ''
}

export function deliveryPointAddress(point: DeliveryPointResponse) {
  const direct = (point.address || '').trim()
  if (direct) return direct

  const full = detailString(point, 'full_address')
  if (full) return full

  const streetHouse = [detailString(point, 'street'), detailString(point, 'house')]
    .filter(Boolean)
    .join(', ')
  if (streetHouse) return streetHouse

  return [point.locality, point.region].filter(Boolean).join(', ')
}
