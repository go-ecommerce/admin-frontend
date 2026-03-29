<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { Loader2, Plus, Search } from 'lucide-vue-next'

import { computed, ref, watch } from 'vue'

import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import ProductService from '@/services/ProductService'
import type { ProductResponse, ShortProduct } from '@/utils/types/api/generatedApiGo'

const props = defineProps<{
  modelValue?: ShortProduct[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ShortProduct[]): void
}>()

const selectedProducts = ref<ShortProduct[]>(props.modelValue ?? [])
const searchQuery = ref('')
const searchResults = ref<ProductResponse[]>([])
const loading = ref(false)
const focused = ref(false)
const showDropdown = computed(() => focused.value && searchQuery.value.trim().length > 0)

watch(
  () => props.modelValue,
  (newValue) => {
    selectedProducts.value = newValue ?? []
  },
)

watchDebounced(
  searchQuery,
  async (query) => {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    try {
      loading.value = true
      const results = await ProductService.findProduct(query)
      searchResults.value = results.filter(
        (product) => !selectedProducts.value.find((s) => s.id === product.id),
      )
    } catch (e) {
      searchResults.value = []
      console.error(e)
    } finally {
      loading.value = false
    }
  },
  { debounce: 300 },
)

const addProduct = (product: ProductResponse): void => {
  const shortProduct: ShortProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    model: product.model,
    is_enable: product.is_enable,
  }
  const updated = [...selectedProducts.value, shortProduct]
  selectedProducts.value = updated
  emit('update:modelValue', updated)
  searchQuery.value = ''
  searchResults.value = []
}


const onBlur = (): void => {
  setTimeout(() => {
    focused.value = false
  }, 150)
}
</script>

<template>
  <div class="relative">
    <!-- Search input -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        v-model="searchQuery"
        placeholder="Поиск по названию..."
        class="pl-9 pr-9"
        @focus="focused = true"
        @blur="onBlur"
      />
      <Loader2
        v-if="loading"
        class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground"
      />
    </div>

    <!-- Dropdown results -->
    <div
      v-if="showDropdown"
      class="absolute top-full left-0 right-0 mt-1 z-50 border rounded-md shadow-lg bg-background overflow-hidden"
    >
      <!-- Skeleton loading -->
      <div v-if="loading" class="p-2 space-y-1">
        <Skeleton v-for="i in 3" :key="i" class="h-10 w-full" />
      </div>

      <!-- Results -->
      <template v-else>
        <div v-if="searchResults.length === 0" class="py-5 text-center text-sm text-muted-foreground">
          Ничего не найдено
        </div>
        <button
          v-for="product in searchResults"
          :key="product.id"
          type="button"
          class="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-accent transition-colors group/item"
          @mousedown.prevent="addProduct(product)"
        >
          <div class="flex-1 min-w-0">
            <div class="font-medium text-sm truncate">{{ product.name || product.model }}</div>
            <div class="text-xs text-muted-foreground truncate">{{ product.model }}</div>
          </div>
          <span v-if="product.price" class="text-sm text-muted-foreground shrink-0">
            {{ Number(product.price).toLocaleString() }} ₽
          </span>
          <Plus class="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity" />
        </button>
      </template>
    </div>
  </div>
</template>
