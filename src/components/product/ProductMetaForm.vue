<script setup lang="ts">
import { ref, watch } from 'vue'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const productMetaTitle = ref<string>('')
const productMetaH1 = ref<string>('')
const productMetaKeyword = ref<string>('')
const productMetaDescription = ref<string>('')

watch(
  () => props.modelValue,
  (newValue) => {
    productMetaTitle.value = newValue.metaTitle || ''
    productMetaH1.value = newValue.metaH1 || ''
    productMetaKeyword.value = newValue.metaKeyword || ''
    productMetaDescription.value = newValue.metaDescription || ''
  },
  { immediate: true },
)

watch([productMetaTitle, productMetaH1, productMetaKeyword, productMetaDescription], () => {
  emit('update:modelValue', {
    ...props.modelValue,
    meta_title: productMetaTitle.value,
    meta_h1: productMetaH1.value,
    meta_keyword: productMetaKeyword.value,
    meta_description: productMetaDescription.value,
  })
})
</script>

<template>
  <form>
    <div class="grid items-center w-full gap-4">
      <div class="flex flex-col space-y-1.5">
        <Label for="m-title">Meta title</Label>
        <Input id="m-title" v-model="productMetaTitle" placeholder="Meta title of your product" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="m-h1">Meta H1</Label>
        <Input id="m-h1" v-model="productMetaH1" placeholder="Meta H1 of your product" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="m-h1">Meta keyword</Label>
        <Input id="m-h1" v-model="productMetaKeyword" placeholder="Meta keyword of your product" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="meta-description">Meta Description</Label>
        <Textarea
          id="meta-description"
          v-model="productMetaDescription"
          placeholder="Type meta your description"
        />
      </div>
    </div>
  </form>
</template>
