<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { ref, watchEffect } from 'vue'

import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import { useCategoryStore } from '@/stores/category'

const { getCategories } = useCategoryStore()
const { categories } = storeToRefs(useCategoryStore())

const searchQuery = ref('')
const selectedCategory = ref(null)

const fetchCategories = async () => {
  await getCategories({ page: 1, page_size: 100 })
}

watchEffect(() => {
  fetchCategories()
})

defineEmits(['select'])
</script>

<template>
  <Combobox v-model="selectedCategory" @update:modelValue="$emit('select', $event)">
    <ComboboxAnchor as-child>
      <ComboboxTrigger as-child>
        <Button variant="outline" class="justify-between">
<!--          {{ selectedCategory?.name ?? 'Select category' }}-->
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList>
      <ComboboxInput v-model="searchQuery" placeholder="Search category..." />
      <ComboboxEmpty> No categories found. </ComboboxEmpty>
      <ComboboxGroup>
        <ComboboxItem v-for="category in categories.items" :key="category.id" :value="category.id ?? ''">
          {{ category.name }}
          <ComboboxItemIndicator><Check class="ml-auto h-4 w-4" /></ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
