<script setup lang="ts">
import { type Component, computed } from 'vue'
import { useRoute } from 'vue-router'

import Toaster from '@/components/ui/toast/Toaster.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import type { LayoutNames } from '@/layouts'

const route = useRoute()

const layouts: Record<LayoutNames, Component> = {
  'auth-layout': AuthLayout,
  'default-layout': DefaultLayout,
}
const resolveLayout = computed(() => {
  return layouts[route.meta.layout as keyof typeof layouts]
})
</script>

<template>
  <component :is="resolveLayout">
    <RouterView />
  </component>
  <Toaster />
</template>
