<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { ListboxGroupProps } from 'reka-ui'
import { ListboxGroup, ListboxGroupLabel, useId } from 'reka-ui'

import type { HTMLAttributes } from 'vue'
import { onMounted, onUnmounted } from 'vue'

import { cn } from '@/lib/utils'

import { provideCommandGroupContext, useCommand } from '.'

const props = defineProps<
  ListboxGroupProps & {
    class?: HTMLAttributes['class']
    heading?: string
  }
>()

const delegatedProps = reactiveOmit(props, 'class')

const { allGroups } = useCommand()
const id = useId()

provideCommandGroupContext({ id })
onMounted(() => {
  if (!allGroups.value.has(id)) allGroups.value.set(id, new Set())
})
onUnmounted(() => {
  allGroups.value.delete(id)
})
</script>

<template>
  <ListboxGroup
    v-bind="delegatedProps"
    :id="id"
    data-slot="command-group"
    :class="cn('text-foreground overflow-hidden p-1', props.class)"
  >
    <ListboxGroupLabel v-if="heading" class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
      {{ heading }}
    </ListboxGroupLabel>
    <slot />
  </ListboxGroup>
</template>
