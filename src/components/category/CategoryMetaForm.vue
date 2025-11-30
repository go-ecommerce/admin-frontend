<script setup lang="ts">
import { ref, watch } from 'vue'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

// Локальные refs для полей формы
const categoryMetaTitle = ref<string>(props.modelValue.meta_title || '')
const categoryMetaH1 = ref<string>(props.modelValue.meta_h1 || '')
const categoryMetaKeyword = ref<string>(props.modelValue.meta_keyword || '')
const categoryMetaDescription = ref<string>(props.modelValue.meta_description || '')

// Обновляем modelValue при изменении полей
watch([categoryMetaTitle, categoryMetaH1, categoryMetaKeyword, categoryMetaDescription], () => {
  emit('update:modelValue', {
    ...props.modelValue,
    meta_title: categoryMetaTitle.value.trim() || null,
    meta_h1: categoryMetaH1.value.trim() || null,
    meta_keyword: categoryMetaKeyword.value.trim() || null,
    meta_description: categoryMetaDescription.value.trim() || null,
  })
})
</script>

<template>
  <form>
    <div class="grid items-center w-full gap-4">
      <div class="flex flex-col space-y-1.5">
        <Label for="m-title">Meta title</Label>
        <Input id="m-title" v-model="categoryMetaTitle" placeholder="Meta title of your category" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="m-h1">Meta H1</Label>
        <Input id="m-h1" v-model="categoryMetaH1" placeholder="Meta H1 of your category" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="m-h1">Meta keyword</Label>
        <Input
          id="m-h1"
          v-model="categoryMetaKeyword"
          placeholder="Meta keyword of your category"
        />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="meta-description">Meta Description</Label>
        <Textarea
          id="meta-description"
          v-model="categoryMetaDescription"
          placeholder="Type meta your description"
        />
      </div>
    </div>
  </form>
</template>
