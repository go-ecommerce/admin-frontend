<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'
import { ref, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { generateSlug as generateSlugUtil } from '@/utils/slug'

const frontendProductUrl = '/product/'
const appFrontend = import.meta.env.VITE_FRONTEND_URL

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const productName = ref('')
const productSlug = ref('')
const productModel = ref('')
const productDescription = ref('')

watch(
  () => props.modelValue,
  (newValue) => {
    productName.value = newValue.name || ''
    productSlug.value = newValue.slug || ''
    productModel.value = newValue.model || ''
    productDescription.value = newValue.description || ''
  },
  { immediate: true },
)

watch([productName, productSlug, productModel, productDescription], () => {
  emit('update:modelValue', {
    ...props.modelValue,
    name: productName.value,
    slug: productSlug.value,
    model: productModel.value,
    description: productDescription.value,
  })
})

const generateSlug = (): void => {
  productSlug.value = generateSlugUtil(productName.value)
}
</script>

<template>
  <form>
    <div class="grid items-center w-full gap-4">
      <div class="flex flex-col space-y-1.5">
        <Label for="name">Name</Label>
        <Input id="name" v-model="productName" placeholder="Name of your product" />
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
            :disabled="!productName.trim()"
          >
            <Sparkles class="h-3.5 w-3.5" />
            <span>Generate</span>
          </Button>
        </div>
        <div class="relative w-full items-center">
          <Input id="slug" v-model="productSlug" type="text" placeholder="slug" class="pl-60" />
          <span
            class="absolute bg-accent rounded-l-md start-0 inset-y-0 flex items-center justify-center px-2"
          >
            {{ appFrontend }}{{ frontendProductUrl }}
          </span>
        </div>
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="model">Model</Label>
        <Input id="model" v-model="productModel" placeholder="Model of your product" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="description">Description</Label>
        <Textarea
          id="description"
          v-model="productDescription"
          placeholder="Type your description"
        />
      </div>
    </div>
  </form>
</template>
