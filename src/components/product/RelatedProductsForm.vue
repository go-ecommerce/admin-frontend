<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { ref, watch } from 'vue'

import ProductSearch from '@/components/product/ProductSearch.vue'
import { Button } from '@/components/ui/button'
import type { ProductResponse, ShortProduct } from '@/utils/types/api/generatedApiGo'

const props = defineProps<{
  modelValue?: ShortProduct[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ShortProduct[]): void
}>()

const relatedProducts = ref<ShortProduct[]>(props.modelValue || [])

watch(
  () => props.modelValue,
  (newValue) => {
    relatedProducts.value = newValue || []
  },
)

const onProductSelect = (product: ProductResponse) => {
  // Конвертируем ProductResponse в ShortProduct
  const shortProduct: ShortProduct = {
    id: product.id,
    name: product.name,
    model: product.model,
    price: product.price,
    slug: product.slug,
    image: product.image ? { string: product.image, valid: true } : undefined,
    is_enable: product.is_enable,
  }

  const exists = relatedProducts.value.find((p) => p.id === shortProduct.id)
  if (!exists) {
    relatedProducts.value = [...relatedProducts.value, shortProduct]
    emit('update:modelValue', relatedProducts.value)
  }
}

const removeProduct = (productId: string | undefined) => {
  if (!productId) return
  relatedProducts.value = relatedProducts.value.filter((p) => p.id !== productId)
  emit('update:modelValue', relatedProducts.value)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <ProductSearch @select="onProductSelect" />
    </div>

    <div v-if="relatedProducts.length > 0" class="space-y-2">
      <div class="text-sm font-medium text-muted-foreground">
        Selected Products ({{ relatedProducts.length }})
      </div>
      <div class="space-y-2">
        <div
          v-for="product in relatedProducts"
          :key="product.id"
          class="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <img
              v-if="product.image?.string"
              :src="product.image.string"
              :alt="product.name"
              class="w-12 h-12 object-cover rounded"
            />
            <div class="w-12 h-12 bg-muted rounded flex items-center justify-center" v-else>
              <span class="text-xs text-muted-foreground">No img</span>
            </div>
            <div>
              <div class="font-medium">{{ product.name }}</div>
              <div class="text-sm text-muted-foreground">
                {{ product.model }} • {{ product.price }}₽
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" @click="removeProduct(product.id)">
            <Trash2 class="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>

    <div v-else class="text-sm text-muted-foreground text-center py-8 border rounded-lg">
      No related products selected. Use search above to add products.
    </div>
  </div>
</template>
