<script setup lang="ts">
import { File, ListFilter, PlusCircle } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProductStore } from '@/stores/product'
import type { IProductRequest } from '@/utils/types/api/apiGo.ts'

const productStore = useProductStore()
const { products, allVariants, isLoading } = storeToRefs(productStore)
const { getProducts, getAllVariants } = productStore

const router = useRouter()

const activeTab = ref<'products' | 'variants'>('products')

const productParams = ref({ page: 1, pageSize: 10 })
const variantParams = ref({ page: 1, pageSize: 10 })

const fetchProducts = async () => {
  const payload: IProductRequest = { page: productParams.value.page, page_size: productParams.value.pageSize }
  await getProducts(payload)
}

const fetchVariants = async () => {
  const payload: IProductRequest = { page: variantParams.value.page, page_size: variantParams.value.pageSize }
  await getAllVariants(payload)
}

watch(productParams.value, fetchProducts, { immediate: true })
watch(variantParams.value, fetchVariants)

const onTabChange = (val: string) => {
  activeTab.value = val as 'products' | 'variants'
  if (val === 'variants' && allVariants.value.items.length === 0) {
    fetchVariants()
  }
}
</script>

<style scoped></style>

<template>
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Tabs default-value="products" @update:model-value="onTabChange">
      <div class="flex items-center gap-2">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>
        <div class="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="sm" class="h-7 gap-1">
                <ListFilter class="h-3.5 w-3.5" />
                <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Active</DropdownMenuItem>
              <DropdownMenuItem>Draft</DropdownMenuItem>
              <DropdownMenuItem>Archived</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your products and their variants.</CardDescription>
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
