<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const props = defineProps<{
  title: string
  value: number | string
  hint: string
  icon: Component
  loading?: boolean
  warn?: boolean
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  click: []
}>()

const displayValue = (value: number | string) =>
  typeof value === 'number' ? value.toLocaleString('ru-RU') : value
</script>

<template>
  <button
    type="button"
    :class="
      cn(
        'flex min-w-0 items-center justify-between gap-3 bg-card px-3 py-2.5 text-left transition-colors hover:bg-accent/40',
        props.class,
      )
    "
    @click="emit('click')"
  >
    <div class="min-w-0">
      <div class="flex items-center gap-1.5">
        <component
          :is="icon"
          class="h-3.5 w-3.5 shrink-0"
          :class="warn ? 'text-amber-500' : 'text-muted-foreground'"
        />
        <span class="truncate text-sm font-medium">{{ title }}</span>
      </div>
      <p class="mt-0.5 truncate text-xs text-muted-foreground">{{ hint }}</p>
    </div>
    <Skeleton v-if="loading" class="h-7 w-16 shrink-0" />
    <div v-else class="shrink-0 text-2xl font-semibold tracking-tight tabular-nums">
      {{ displayValue(value) }}
    </div>
  </button>
</template>
