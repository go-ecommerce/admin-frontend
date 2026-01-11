<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'

import { ref, watch } from 'vue'

import AttributeGroupSearch from '@/components/attribute/AttributeGroupSearch.vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SLUG_DELIMITERS, generateSlug as generateSlugUtil } from '@/utils/slug.ts'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const getAttributeGroupId = (value: any): string | undefined => {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (value.valid && value.uuid) return value.uuid
  return undefined
}

const attributeName = ref<string>(props.modelValue.name || '')
const attributeSlug = ref<string>(props.modelValue.slug || '')
const attributeType = ref<string>(props.modelValue.type || 'text')
const attributeUnit = ref<string>(props.modelValue.unit || '')
const attributeGroupId = ref<string | undefined>(
  getAttributeGroupId(props.modelValue.attribute_group_id),
)
const sortOrder = ref<number>(props.modelValue.sort_order || 0)
const isVisible = ref<boolean>(props.modelValue.is_visible ?? true)
const isFilterable = ref<boolean>(props.modelValue.is_filterable ?? false)
const isRequired = ref<boolean>(props.modelValue.is_required ?? false)

watch(
  [
    attributeName,
    attributeSlug,
    attributeType,
    attributeUnit,
    attributeGroupId,
    sortOrder,
    isVisible,
    isFilterable,
    isRequired,
  ],
  () => {
    emit('update:modelValue', {
      ...props.modelValue,
      name: attributeName.value.trim(),
      slug: attributeSlug.value.trim(),
      type: attributeType.value,
      unit: attributeUnit.value.trim() || undefined,
      attribute_group_id: attributeGroupId.value || undefined,
      sort_order: sortOrder.value,
      is_visible: isVisible.value,
      is_filterable: isFilterable.value,
      is_required: isRequired.value,
    })
  },
)
const generateSlug = (): void => {
  attributeSlug.value = generateSlugUtil(attributeName.value, SLUG_DELIMITERS.UNDERSCORE)
}
</script>

<template>
  <form>
    <div class="grid items-center w-full gap-4">
      <div class="flex flex-col space-y-1.5">
        <Label for="name">Name</Label>
        <Input id="name" v-model="attributeName" placeholder="Name of your attribute" />
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
            :disabled="!attributeName.trim()"
          >
            <Sparkles class="h-3.5 w-3.5" />
            <span>Generate</span>
          </Button>
        </div>
        <Input id="value" v-model="attributeSlug" placeholder="Slug of your attribute" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="type">Type</Label>
        <Select v-model="attributeType">
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="select">Select</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="unit">Unit (optional)</Label>
        <Input id="unit" v-model="attributeUnit" placeholder="e.g., cm, kg, W" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="attribute_group_id">Attribute Group (optional)</Label>
        <AttributeGroupSearch v-model="attributeGroupId" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="sort_order">Sort Order</Label>
        <Input
          id="sort_order"
          v-model.number="sortOrder"
          type="number"
          min="0"
          placeholder="Sort order"
        />
      </div>
      <div class="flex items-center space-x-2">
        <Checkbox id="is_visible" v-model:checked="isVisible" />
        <Label for="is_visible" class="cursor-pointer">Visible</Label>
      </div>
      <div class="flex items-center space-x-2">
        <Checkbox id="is_filterable" v-model:checked="isFilterable" />
        <Label for="is_filterable" class="cursor-pointer">Filterable</Label>
      </div>
      <div class="flex items-center space-x-2">
        <Checkbox id="is_required" v-model:checked="isRequired" />
        <Label for="is_required" class="cursor-pointer">Required</Label>
      </div>
    </div>
  </form>
</template>
