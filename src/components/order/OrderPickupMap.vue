<script setup lang="ts">
import {
  YandexMap,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapPopupMarker,
} from 'vue-yandex-maps'

import { STORE_PICKUP } from '@/utils/pickup'
</script>

<template>
  <div class="overflow-hidden rounded-md border">
    <yandex-map
      :settings="{
        location: {
          center: STORE_PICKUP.coordinates,
          zoom: 16,
        },
      }"
      width="100%"
      height="360px"
    >
      <yandex-map-default-scheme-layer />
      <yandex-map-default-features-layer />
      <yandex-map-popup-marker :settings="{ coordinates: STORE_PICKUP.coordinates }">
        {{ STORE_PICKUP.title }}
      </yandex-map-popup-marker>
    </yandex-map>
  </div>
</template>
