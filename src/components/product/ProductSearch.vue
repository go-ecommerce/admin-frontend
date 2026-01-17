<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { ChevronsUpDown } from 'lucide-vue-next'

import { ref, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import CommandGroupCustom from '@/components/ui/command/CommandGroupCustom.vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ProductService from '@/services/ProductService'
import type { ProductResponse } from '@/utils/types/api/generatedApiGo'

const props = defineProps<{
  modelValue?: ProductResponse[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ProductResponse): void
  (e: 'select', product: ProductResponse): void
}>()

const open = ref(false)
const value = ref<ProductResponse>()

const selectedProducts = ref<ProductResponse[] | undefined>(props.modelValue)
const searchQuery = ref('')
const products = ref<ProductResponse[]>([])
const loading = ref(false)

watch(
  () => props.modelValue,
  (newValue) => {
    selectedProducts.value = newValue
  },
)

watchDebounced(
  searchQuery,
  async (query) => {
    if (!query.trim()) {
      products.value = []
      return
    }

    try {
      loading.value = true
      products.value = (await ProductService.findProduct(query)).filter(
        (product) =>
          !selectedProducts.value?.find((selectedProduct) => selectedProduct.id === product.id),
      )
    } catch (e) {
      products.value = []
      console.error(e)
    } finally {
      loading.value = false
    }
  },
  { debounce: 300 },
)

const onProductSelect = (selected: any): void => {
  emit('select', selected.detail.value)
  selectedProducts.value = [...(selectedProducts.value ?? []), ...selected.detail.value]
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-[200px] justify-between"
      >
        Select product...
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0">
      <Command>
        <CommandInput v-model="searchQuery" placeholder="Search product..." />

        <CommandList>
          <CommandGroupCustom>
            <CommandItem
              v-for="product in products"
              :key="product.id"
              :value="product"
              @select="onProductSelect($event)"
            >
              {{ product.name }}
            </CommandItem>
          </CommandGroupCustom>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
