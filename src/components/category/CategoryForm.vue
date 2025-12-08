<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'
import { ref, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { generateSlug as generateSlugUtil } from '@/utils/slug'

import CategoryCombobox from './CategoryCombobox.vue'

const frontendCategoryUrl = '/category/'
const appFrontend = import.meta.env.VITE_FRONTEND_URL

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

// Локальные refs для полей формы
const categoryName = ref<string>(props.modelValue.name || '')
const categorySlug = ref<string>(props.modelValue.slug || '')
const categoryDescription = ref<string>(props.modelValue.description || '')
const categoryParentId = ref<string | null>(props.modelValue.parentId || null)

// Обновляем modelValue при изменении полей
watch([categoryName, categorySlug, categoryDescription, categoryParentId], () => {
  emit('update:modelValue', {
    ...props.modelValue,
    name: categoryName.value.trim() || null,
    slug: categorySlug.value.trim() || null,
    description: categoryDescription.value.trim() || null,
    parent_id: categoryParentId.value,
  })
})

const generateSlug = (): void => {
  categorySlug.value = generateSlugUtil(categoryName.value)
}
</script>

<template>
  <form>
    <div class="grid items-center w-full gap-4">
      <div class="flex flex-col space-y-1.5">
        <Label for="name">Name</Label>
        <Input id="name" v-model="categoryName" placeholder="Name of your category" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <div class="flex items-center justify-between">
          <Label for="Slug">Slug</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            class="h-7 gap-1"
            @click="generateSlug"
            :disabled="!categoryName.trim()"
          >
            <Sparkles class="h-3.5 w-3.5" />
            <span>Generate</span>
          </Button>
        </div>
        <div class="relative w-full items-center">
          <Input id="slug" v-model="categorySlug" type="text" placeholder="slug" class="pl-60" />
          <span
            class="absolute bg-accent rounded-l-md start-0 inset-y-0 flex items-center justify-center px-2"
          >
            {{ appFrontend }}{{ frontendCategoryUrl }}
          </span>
        </div>
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="parent">Parent category</Label>
        <CategoryCombobox v-model="categoryParentId" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="description">Description</Label>
        <Textarea
          id="description"
          v-model="categoryDescription"
          placeholder="Type your description"
        />
      </div>
    </div>
  </form>
</template>
