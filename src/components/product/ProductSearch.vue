<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import ProductService from '@/services/ProductService'
import type { ProductResponse } from '@/utils/types/api/generatedApiGo'

const props = defineProps<{
  modelValue?: ProductResponse
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ProductResponse): void
  (e: 'select', product: ProductResponse): void
}>()

const open = ref(false)
const value = ref<ProductResponse>()

const selectedProduct = ref<ProductResponse | undefined>(props.modelValue)
const searchQuery = ref('')
const products = ref<ProductResponse[]>([])
const loading = ref(false)
const searchTimer = ref<number | null>(null)

watch(
  () => props.modelValue,
  (newValue) => {
    selectedProduct.value = newValue
  },
)

watch(searchQuery, (query) => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }

  searchTimer.value = setTimeout(async () => {
    if (!query) {
      products.value = []
      return
    }

    try {
      loading.value = true
      const result = await ProductService.findProduct(query)
      products.value = Array.isArray(result) ? result : [result]
    } catch (e) {
      products.value = []
      console.error(e)
    } finally {
      loading.value = false
    }
  }, 300)
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button variant="outline" role="combobox" :aria-expanded="open" class="w-[200px] justify-between">
        Select product...
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0">
      <Command v-model="value">
        <CommandInput v-model="searchQuery" placeholder="Search framework..." />
        <CommandEmpty>No framework found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem v-for="product in products" :key="product.id" :value="product" @select="open = false">
              {{ product.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
