<script setup lang="ts">
import { File, PlusCircle, TriangleAlert } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ProductTable from '@/components/product/ProductTable.vue'
import VariantTable from '@/components/product/VariantTable.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProductStore } from '@/stores/product'
import type { IProductRequest } from '@/utils/types/api/apiGo.ts'

const productStore = useProductStore()
const { products, allVariants, isLoading } = storeToRefs(productStore)
const { getProducts, getProductsWithoutVariants, getAllVariants } = productStore

const router = useRouter()
const route = useRoute()

type ProductFilter = 'all' | 'without_variants'

const productFilter = ref<ProductFilter>(
  route.query.filter === 'without_variants' ? 'without_variants' : 'all',
)
const productParams = ref({ page: 1, pageSize: 10 })
const variantParams = ref({ page: 1, pageSize: 10 })

const fetchProducts = async () => {
  const payload: IProductRequest = {
    page: productParams.value.page,
    page_size: productParams.value.pageSize,
  }
  if (productFilter.value === 'without_variants') {
    await getProductsWithoutVariants(payload)
  } else {
    await getProducts(payload)
  }
}

const fetchVariants = async () => {
  const payload: IProductRequest = {
    page: variantParams.value.page,
    page_size: variantParams.value.pageSize,
  }
  await getAllVariants(payload)
}

const setFilter = (filter: ProductFilter) => {
  productFilter.value = filter
  productParams.value.page = 1
  fetchProducts()
}

watch(productParams.value, fetchProducts, { immediate: true })
watch(variantParams.value, fetchVariants)

const onTabChange = (val: string) => {
  if (val === 'variants' && allVariants.value.items.length === 0) {
    fetchVariants()
  }
}
</script>

<template>
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Tabs default-value="products" @update:model-value="onTabChange">
      <div class="flex items-center gap-2">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>
        <div class="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" class="h-7 gap-1">
            <File class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
          </Button>
          <Button size="sm" class="h-7 gap-1" @click="router.push({ name: 'product-create' })">
            <PlusCircle class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Product</span>
          </Button>
        </div>
      </div>

      <TabsContent value="products">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your products and their variants.</CardDescription>
              </div>
              <div class="flex items-center gap-1 rounded-lg border p-1">
                <Button
                  size="sm"
                  :variant="productFilter === 'all' ? 'default' : 'ghost'"
                  class="h-7 text-xs"
                  @click="setFilter('all')"
                >
                  All
                </Button>
                <Button
                  size="sm"
                  :variant="productFilter === 'without_variants' ? 'default' : 'ghost'"
                  class="h-7 gap-1 text-xs"
                  @click="setFilter('without_variants')"
                >
                  <TriangleAlert class="h-3 w-3" />
                  Without variants
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ProductTable :params="productParams" :products="products" :is-loading="isLoading" />
          </CardContent>
          <CardFooter>
            <div class="text-xs text-muted-foreground">
              Total: <strong>{{ products?.pagination?.total ?? 0 }}</strong> products
            </div>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="variants">
        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
            <CardDescription>All product variants across the catalog.</CardDescription>
          </CardHeader>
          <CardContent>
            <VariantTable :params="variantParams" :variants="allVariants" :is-loading="isLoading" />
          </CardContent>
          <CardFooter>
            <div class="text-xs text-muted-foreground">
              Total: <strong>{{ allVariants?.pagination?.total ?? 0 }}</strong> variants
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </main>
</template>
