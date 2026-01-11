<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'

import { ref, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SLUG_DELIMITERS, generateSlug as generateSlugUtil } from '@/utils/slug.ts'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const attributeGroupName = ref<string>(props.modelValue.name || '')
const attributeGroupSlug = ref<string>(props.modelValue.slug || '')
const attributeGroupDescription = ref<string>(props.modelValue.description || '')

// Обновляем modelValue при изменении полей
watch([attributeGroupName, attributeGroupSlug, attributeGroupDescription], () => {
  emit('update:modelValue', {
    ...props.modelValue,
    name: attributeGroupName.value.trim(),
    slug: attributeGroupSlug.value.trim(),
    description: attributeGroupDescription.value.trim(),
  })
})

const generateSlug = (): void => {
  attributeGroupSlug.value = generateSlugUtil(attributeGroupName.value, SLUG_DELIMITERS.UNDERSCORE)
}
</script>

<template>
  <form>
    <div class="grid items-center w-full gap-4">
      <div class="flex flex-col space-y-1.5">
        <Label for="name">Name</Label>
        <Input id="name" v-model="attributeGroupName" placeholder="Name of your attribute group" />
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
            :disabled="!attributeGroupName.trim()"
          >
            <Sparkles class="h-3.5 w-3.5" />
            <span>Generate</span>
          </Button>
        </div>
        <Input id="name" v-model="attributeGroupSlug" placeholder="Slug of your attribute group" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="description">Description</Label>
        <Textarea
          id="description"
          v-model="attributeGroupDescription"
          placeholder="Type your description"
        />
      </div>
    </div>
  </form>
</template>
