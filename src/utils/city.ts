import type { CityResponse } from '@/utils/types/api/generatedApiGo'

const DEFAULT_CITY_LABEL = 'г. Санкт-Петербург'
/** [longitude, latitude] */
export const DEFAULT_CITY_COORDINATES: [number, number] = [30.347328, 59.929316]

export function cityLabel(city?: CityResponse | null): string {
  if (!city) return DEFAULT_CITY_LABEL
  if (city.address) return city.address
  if (city.city) {
    return city.city_type ? `${city.city_type}. ${city.city}` : city.city
  }
  if (city.settlement) {
    return city.settlement_type ? `${city.settlement_type}. ${city.settlement}` : city.settlement
  }
  return DEFAULT_CITY_LABEL
}

export function cityKey(city: CityResponse) {
  return city.id || city.fias_id || city.kladr_id || `${city.city}-${city.region}-${city.postal_code}`
}

export function cityCoordinates(city?: CityResponse | null): [number, number] {
  const lat = Number(city?.geo_lat)
  const lon = Number(city?.geo_lon)
  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    return [lon, lat]
  }
  return DEFAULT_CITY_COORDINATES
}

export function hasCityCoordinates(city?: CityResponse | null) {
  const lat = Number(city?.geo_lat)
  const lon = Number(city?.geo_lon)
  return Number.isFinite(lat) && Number.isFinite(lon)
}
