<script setup lang="ts">
import { MdEditor, type ToolbarNames } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

import { computed } from 'vue'

import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    class?: string
    height?: string
  }>(),
  {
    modelValue: '',
    placeholder: 'Описание в Markdown…',
    disabled: false,
    height: '280px',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const toolbarsExclude: ToolbarNames[] = [
  'github',
  'save',
  'htmlPreview',
  'mermaid',
  'katex',
  'catalog',
  'previewOnly',
]

const value = computed({
  get: () => props.modelValue,
  set: (next) => emit('update:modelValue', next),
})
</script>

<template>
  <MdEditor
    v-model="value"
    language="en-US"
    preview-theme="github"
    :placeholder="placeholder"
    :disabled="disabled"
    :style="{ height }"
    :class="cn('overflow-hidden shadow-xs', props.class)"
    :toolbars-exclude="toolbarsExclude"
    no-mermaid
    no-katex
    no-upload-img
    :footers="[]"
  />
</template>

<style scoped>
:deep(.md-editor) {
  --md-border-color: hsl(var(--border));
  --md-bk-color: hsl(var(--background));
  --md-color: hsl(var(--foreground));
  border-color: hsl(var(--input));
  border-radius: calc(var(--radius) - 2px);
}
</style>
