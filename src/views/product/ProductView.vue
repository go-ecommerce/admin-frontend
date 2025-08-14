<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { File, ListFilter, PlusCircle } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { h, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import DataTable from '@/components/data-table/DataTable.vue'
import DataTableColumnHeader from '@/components/data-table/DataTableColumnHeader.vue'
import DataTableRowActions from '@/components/data-table/DataTableRowActions.vue'
import ProductTable from '@/components/product/ProductTable.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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

const { products, isLoading } = storeToRefs(useProductStore())
const { getProducts } = useProductStore()

const router = useRouter()

const params = ref({
  page: 1,
  pageSize: 10,
})

const fetchProducts = async () => {
  const payload: IProductRequest = { page: params.value.page, page_size: params.value.pageSize }
  await getProducts(payload)
}

watch(params.value, fetchProducts, { immediate: true })

onMounted(async () => {
  await fetchProducts()
})
</script>

<style scoped></style>

<template>
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Tabs default-value="all">
      <div class="flex items-center">
        <TabsList>
          <TabsTrigger value="all"> All</TabsTrigger>
          <TabsTrigger value="active"> Active</TabsTrigger>
          <TabsTrigger value="draft"> Draft</TabsTrigger>
          <TabsTrigger value="archived" class="hidden sm:flex"> Archived</TabsTrigger>
        </TabsList>
        <div class="ml-auto flex items-center gap2">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="sm" class="h-7 gap-1">
                <ListFilter class="h-3.5 w-3.5" />
                <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Filter </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem checked> Active</DropdownMenuItem>
              <DropdownMenuItem>Draft</DropdownMenuItem>
              <DropdownMenuItem> Archived</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" class="h-7 gap-1">
            <File class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Export </span>
          </Button>
          <Button size="sm" class="h-7 gap-1" @click="router.push({ name: 'product-create' })">
            <PlusCircle class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add Products </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage your Products and view their sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductTable :params="params" :products="products" :isLoading="isLoading" />
          </CardContent>
          <CardFooter>
            <div class="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>{{ products?.pagination?.total }}</strong>
              products
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </main>
</template>
