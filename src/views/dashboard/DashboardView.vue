<script setup lang="ts">
import { TriangleAlert } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProductStore } from '@/stores/product'

const router = useRouter()
const productStore = useProductStore()
const { productsWithoutVariantsCount } = storeToRefs(productStore)
const { fetchProductsWithoutVariantsCount } = productStore

onMounted(() => {
  fetchProductsWithoutVariantsCount()
})
</script>

<template>
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        class="cursor-pointer transition-shadow hover:shadow-md"
        @click="router.push({ name: 'product', query: { filter: 'without_variants' } })"
      >
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Without variants</CardTitle>
          <TriangleAlert class="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ productsWithoutVariantsCount }}</div>
          <p class="text-xs text-muted-foreground mt-1">Products without any variant</p>
        </CardContent>
      </Card>
    </div>
  </main>
</template>
