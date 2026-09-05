<template>
  <div class="w-full flex flex-wrap gap-4">
    <div
      v-for="(media, idx) in localMedia"
      :key="media.id"
      class="relative w-52 h-52"
      draggable="true"
      @dragstart="() => (dragIndex = idx)"
      @dragover.prevent="onDragOver(idx)"
      @drop.prevent="onDrop"
    >
      <img
        :src="imageSrc(media, 'card')"
        :alt="media.alt || 'uploaded'"
        class="w-full h-full object-cover rounded-md border"
      />
      <button
        class="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1 shadow"
        @click.stop="remove(idx)"
      >
        <Trash2 class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'

import { onMounted, ref, watch } from 'vue'

import { imageSrc } from '@/utils/media'
import type { ImageDTO } from '@/utils/types/api/generatedApiGo'

const props = defineProps<{
  modelValue: ImageDTO[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: ImageDTO[]): void
}>()

const localMedia = ref<ImageDTO[]>([])
const dragIndex = ref<number | null>(null)

onMounted(() => {
  localMedia.value = Array.isArray(props.modelValue) ? [...props.modelValue] : []
})

watch(
  () => props.modelValue,
  (val) => {
    if (!dragIndex.value) {
      localMedia.value = Array.isArray(val) ? [...val] : []
    }
  },
)

function onDragOver(overIndex: number) {
  if (dragIndex.value === null || dragIndex.value === overIndex) return
  const temp = [...localMedia.value]
  const dragged = temp.splice(dragIndex.value, 1)[0]
  temp.splice(overIndex, 0, dragged)
  localMedia.value = temp
  dragIndex.value = overIndex
  emit('update:modelValue', localMedia.value)
}

function onDrop() {
  dragIndex.value = null
}

function remove(idx: number) {
  localMedia.value.splice(idx, 1)
  emit('update:modelValue', localMedia.value)
}
</script>
