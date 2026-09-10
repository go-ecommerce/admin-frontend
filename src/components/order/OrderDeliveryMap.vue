<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import {
  YandexMap,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapListener,
  YandexMapMarker,
  YandexMapZoomControl,
} from 'vue-yandex-maps'
import type { YandexMapListenerSettings } from 'vue-yandex-maps'

import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue'

import OrderDeliveryCluster from '@/components/order/OrderDeliveryCluster.vue'
import DeliveryService from '@/services/DeliveryService'
import type { DeliveryPointsQuery } from '@/services/DeliveryService'
import {
  deliveryPointAddress,
  deliveryPointLat,
  deliveryPointLon,
} from '@/utils/deliveryPoint'
import type { DeliveryPointResponse } from '@/utils/types/api/generatedApiGo'

const CITY_ZOOM = 11
const CENTER_PAD = 0.35

const props = defineProps<{
  provider: string
  providerLabel: string
  iconSrc: string
  clusterClass: string
  cityCoordinates: [number, number]
  cityKey?: string
  savedPointCode?: string
  savedPointAddress?: string
}>()

const modelValue = defineModel<DeliveryPointResponse | null>({ default: null })

const map = ref<any>(null)
const points = shallowRef<DeliveryPointResponse[]>([])
const loading = ref(false)
const loadError = ref('')
const ready = ref(false)
let loadSeq = 0
let lastQueryKey = ''

const mapSettings = computed(() => ({
  location: {
    center: props.cityCoordinates,
    zoom: CITY_ZOOM,
  },
}))

const workTimeLabel = computed(() => (modelValue.value?.work_time || []).filter(Boolean).join('; '))

const selectedAddress = computed(() =>
  modelValue.value ? deliveryPointAddress(modelValue.value) : '',
)

const displayPoint = computed(() => {
  if (modelValue.value) {
    return {
      title: modelValue.value.name || modelValue.value.code || 'Пункт выдачи',
      address: selectedAddress.value,
      workTime: workTimeLabel.value,
      code: modelValue.value.code,
    }
  }
  const code = props.savedPointCode?.trim()
  if (!code) return null
  return {
    title: code,
    address: props.savedPointAddress?.trim() || '',
    workTime: '',
    code,
  }
})

function restoreSavedPoint() {
  const code = props.savedPointCode?.trim()
  if (!code || modelValue.value?.code === code) return
  const found = points.value.find((item) => item.code === code)
  if (found) modelValue.value = found
}

function boundsQuery(
  minLon: number,
  minLat: number,
  maxLon: number,
  maxLat: number,
): DeliveryPointsQuery {
  return {
    min_lat: Math.min(minLat, maxLat),
    max_lat: Math.max(minLat, maxLat),
    min_lon: Math.min(minLon, maxLon),
    max_lon: Math.max(minLon, maxLon),
  }
}

function isUsableQuery(query: DeliveryPointsQuery | null): query is DeliveryPointsQuery {
  if (!query) return false
  if (query.min_lat == null || query.max_lat == null || query.min_lon == null || query.max_lon == null) {
    return false
  }
  const dLat = query.max_lat - query.min_lat
  const dLon = query.max_lon - query.min_lon
  if (dLat < 0.01 || dLon < 0.01) return false
  if (dLat > 4 || dLon > 4) return false
  return query.min_lat >= -90 && query.max_lat <= 90 && query.min_lon >= -180 && query.max_lon <= 180
}

function queryFromBounds(bounds: unknown): DeliveryPointsQuery | null {
  if (!Array.isArray(bounds) || !Array.isArray(bounds[0]) || !Array.isArray(bounds[1])) return null
  const lon1 = Number(bounds[0][0])
  const lat1 = Number(bounds[0][1])
  const lon2 = Number(bounds[1][0])
  const lat2 = Number(bounds[1][1])
  if (![lon1, lat1, lon2, lat2].every(Number.isFinite)) return null
  const padLon = Math.abs(lon2 - lon1) * 0.08 || 0.02
  const padLat = Math.abs(lat2 - lat1) * 0.08 || 0.02
  return boundsQuery(lon1 - padLon, lat1 - padLat, lon2 + padLon, lat2 + padLat)
}

function queryKey(query: DeliveryPointsQuery) {
  return [
    props.provider,
    query.min_lat?.toFixed(4),
    query.max_lat?.toFixed(4),
    query.min_lon?.toFixed(4),
    query.max_lon?.toFixed(4),
  ].join(':')
}

async function loadPoints(query: DeliveryPointsQuery | null, force = false) {
  if (!isUsableQuery(query)) return

  const key = queryKey(query)
  if (!force && key === lastQueryKey) return

  const seq = ++loadSeq
  loading.value = true
  loadError.value = ''

  try {
    const data = await DeliveryService.getDeliveryPoints(props.provider, query)
    if (seq !== loadSeq) return
    lastQueryKey = key
    points.value = data.filter(
      (point) => Number.isFinite(deliveryPointLat(point)) && Number.isFinite(deliveryPointLon(point)),
    )
    restoreSavedPoint()
  } catch {
    if (seq !== loadSeq) return
    loadError.value = `Не удалось загрузить пункты ${props.providerLabel}`
    points.value = []
  } finally {
    if (seq === loadSeq) loading.value = false
  }
}

function queryFromCenter(): DeliveryPointsQuery | null {
  const [lon, lat] = props.cityCoordinates
  return boundsQuery(lon - CENTER_PAD, lat - CENTER_PAD, lon + CENTER_PAD, lat + CENTER_PAD)
}

async function goToCity() {
  lastQueryKey = ''
  points.value = []
  if (map.value?.setLocation) {
    map.value.setLocation({
      center: [...props.cityCoordinates] as [number, number],
      zoom: CITY_ZOOM,
      duration: 300,
    })
    await nextTick()
    // Give the map a tick to apply location before reading bounds.
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  // Always reload around the new city center — bounds may still be stale.
  await loadPoints(queryFromCenter(), true)
}

const loadFromViewport = useDebounceFn((bounds?: unknown) => {
  const query = queryFromBounds(bounds)
  if (!isUsableQuery(query)) return
  loadPoints(query)
}, 300)

function selectPoint(point: { code?: string }) {
  const code = point.code
  modelValue.value = code ? points.value.find((item) => item.code === code) || null : null
}

const selectedMarkerSettings = computed(() => {
  const point = modelValue.value
  if (!point) return null
  const lat = deliveryPointLat(point)
  const lon = deliveryPointLon(point)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  return {
    id: `selected-${point.code || `${lat}-${lon}`}`,
    coordinates: [lon, lat] as [number, number],
    zIndex: 1000,
  }
})

const VIEWPORT_ACTIONS = new Set(['drag', 'scrollZoom', 'pinchZoom'])

const listenerSettings: YandexMapListenerSettings = {
  onActionEnd: (event) => {
    if (!VIEWPORT_ACTIONS.has(event.type)) return
    loadFromViewport(event.location.bounds)
  },
}

onMounted(async () => {
  ready.value = true
  await loadPoints(queryFromCenter(), true)
})

watch(
  () => props.provider,
  () => {
    if (!ready.value) return
    modelValue.value = null
    lastQueryKey = ''
    points.value = []
    void loadPoints(queryFromCenter(), true)
  },
)

watch(
  () => [props.cityKey, props.cityCoordinates[0], props.cityCoordinates[1]] as const,
  (next, prev) => {
    if (!ready.value) return
    if (prev && next[0] === prev[0] && next[1] === prev[1] && next[2] === prev[2]) return
    modelValue.value = null
    void goToCity()
  },
)

watch(map, async (instance) => {
  if (!instance) return
  await nextTick()
  await loadPoints(queryFromCenter(), true)
})
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-3">
    <div class="w-full overflow-hidden rounded-md border">
      <yandex-map
        v-model="map"
        cursor-grab
        :settings="mapSettings"
        readonly-settings
        width="100%"
        height="360px"
      >
        <yandex-map-default-scheme-layer />
        <yandex-map-default-features-layer />
        <yandex-map-controls :settings="{ position: 'right', orientation: 'vertical' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>
        <yandex-map-listener :settings="listenerSettings" />
        <OrderDeliveryCluster
          :points="points"
          :icon-src="iconSrc"
          :cluster-class="clusterClass"
          @select="selectPoint"
          @updated-bounds="loadFromViewport"
        />
        <yandex-map-marker
          v-if="selectedMarkerSettings"
          :settings="selectedMarkerSettings"
          position="top left-center"
          :zero-sizes="false"
        >
          <img
            :src="iconSrc"
            width="28"
            height="36"
            alt=""
            class="block h-9 w-7 max-w-none scale-110 drop-shadow-md"
          />
        </yandex-map-marker>
      </yandex-map>
    </div>

    <p v-if="loading" class="text-sm text-muted-foreground">
      Загрузка пунктов {{ providerLabel }}…
    </p>
    <p v-else-if="loadError" class="text-sm text-destructive">{{ loadError }}</p>
    <p v-else-if="!points.length" class="text-sm text-muted-foreground">
      Пункты {{ providerLabel }} не найдены.
    </p>

    <div v-if="displayPoint" class="rounded-md border bg-muted/40 px-3 py-2 text-sm">
      <p class="text-xs text-muted-foreground">Выбранный пункт выдачи</p>
      <p class="font-medium">{{ displayPoint.title }}</p>
      <p v-if="displayPoint.code && displayPoint.title !== displayPoint.code" class="mt-0.5 text-xs text-muted-foreground">
        Код: {{ displayPoint.code }}
      </p>
      <p v-if="displayPoint.address" class="mt-1 text-muted-foreground">{{ displayPoint.address }}</p>
      <p v-if="displayPoint.workTime" class="mt-1 text-xs text-muted-foreground">
        {{ displayPoint.workTime }}
      </p>
    </div>
    <p v-else class="text-sm text-muted-foreground">Выберите пункт выдачи на карте</p>
  </div>
</template>
