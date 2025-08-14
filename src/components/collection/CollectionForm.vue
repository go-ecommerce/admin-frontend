<script setup lang="ts">
import { ref, watch } from 'vue'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const frontendCollectionUrl = '/collection/'
const appFrontend = import.meta.env.VITE_FRONTEND_URL

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const collectionName = ref<string>(props.modelValue.name || '')
const collectionSlug = ref<string>(props.modelValue.slug || '')
const collectionDescription = ref<string>(props.modelValue.description || '')

// Обновляем modelValue при изменении полей
watch([collectionName, collectionSlug, collectionDescription], () => {
  emit('update:modelValue', {
    ...props.modelValue,
    name: collectionName.value,
    slug: collectionSlug.value,
    description: collectionDescription.value,
  })
})
</script>

<template>
  <form>
    <div class="grid items-center w-full gap-4">
      <div class="flex flex-col space-y-1.5">
        <Label for="name">Name</Label>
        <Input id="name" v-model="collectionName" placeholder="Name of your collection" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="Slug">Slug</Label>
        <div class="relative w-full items-center">
          <Input id="slug" v-model="collectionSlug" type="text" placeholder="slug" class="pl-60" />
          <span
            class="absolute bg-accent rounded-l-md start-0 inset-y-0 flex items-center justify-center px-2"
          >
            {{ appFrontend }}{{ frontendCollectionUrl }}
          </span>
        </div>
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="description">Description</Label>
        <Textarea
          id="description"
          v-model="collectionDescription"
          placeholder="Type your description"
        />
      </div>
    </div>
  </form>
</template>
