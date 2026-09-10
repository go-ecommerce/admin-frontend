<script setup lang="ts">
import { YandexMapClusterer, YandexMapMarker } from 'vue-yandex-maps'

import { computed } from 'vue'

export type DeliveryClusterPoint = {
  code?: string
  latitude?: number
  longitude?: number
}

const props = defineProps<{
  points: DeliveryClusterPoint[]
  iconSrc: string
  clusterClass: string
}>()

const emit = defineEmits<{
  select: [point: DeliveryClusterPoint]
  updatedBounds: [bounds: unknown]
}>()

function pointKey(point: DeliveryClusterPoint) {
  return point.code || `${point.latitude}-${point.longitude}`
}

const clusterKey = computed(() => props.points.map(pointKey).join('|'))

const markerSettingsMap = computed(() => {
  const result = new Map<string, { id: string; coordinates: [number, number] }>()
  for (const point of props.points) {
    const id = pointKey(point)
    result.set(id, {
      id,
      coordinates: [Number(point.longitude), Number(point.latitude)],
    })
  }
  return result
})
</script>

<template>
  <yandex-map-clusterer
    v-if="points.length"
    :key="clusterKey"
    :grid-size="64"
    zoom-on-cluster-click
    :cluster-marker-props="{ position: 'top left-center', zeroSizes: false }"
    @updated-bounds="emit('updatedBounds', $event)"
  >
    <yandex-map-marker
      v-for="point in points"
      :key="pointKey(point)"
      :settings="markerSettingsMap.get(pointKey(point))!"
      position="top left-center"
      :zero-sizes="false"
    >
      <img
        :src="iconSrc"
        width="28"
        height="36"
        alt=""
        class="block h-9 w-7 max-w-none cursor-pointer"
        @click.stop="emit('select', point)"
      />
    </yandex-map-marker>
    <template #cluster="{ length }">
      <div
        class="flex size-10 cursor-pointer items-center justify-center rounded-full text-[13px] font-medium text-white shadow"
        :class="clusterClass"
      >
        {{ length }}
      </div>
    </template>
  </yandex-map-clusterer>
</template>
