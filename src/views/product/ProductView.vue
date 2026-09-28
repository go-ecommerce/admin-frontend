<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { Search, TriangleAlert, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { computed, ref, watch } from 'vue'
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
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProductService from '@/services/ProductService'
import { useProductStore } from '@/stores/product'
import type { IProductRequest, IProductResponse, IVariantListResponse } from '@/utils/types/api/apiGo.ts'
import type {
  ProductResponse,
  ProductVariantListItem,
  VariantCardResponse,
  VariantListResponse,
} from '@/utils/types/api/generatedApiGo'

const productStore = useProductStore()
const { products, allVariants, isLoading } = storeToRefs(productStore)
const { getProducts, getProductsWithoutVariants, getAllVariants } = productStore

const router = useRouter()
const route = useRoute()

type ProductFilter = 'all' | 'without_variants'

const emptyPagination = { page: 1, page_size: 10, total: 0, last_page: 1 }

const productFilter = ref<ProductFilter>(
  route.query.filter === 'without_variants' ? 'without_variants' : 'all',
)
const activeTab = ref(route.query.tab === 'variants' ? 'variants' : 'products')
const productParams = ref({ page: 1, pageSize: 10 })
const variantParams = ref({ page: 1, pageSize: 10 })

const productSearch = ref(String(route.query.q || ''))
const variantSearch = ref(String(route.query.vq || ''))

const productSearchData = ref<VariantListResponse>({ items: [], pagination: { ...emptyPagination } })
const variantSearchData = ref<VariantListResponse>({ items: [], pagination: { ...emptyPagination } })
const productSearchLoading = ref(false)
const variantSearchLoading = ref(false)

const toProductRows = (items: VariantCardResponse[] = []): ProductResponse[] =>
  items.map((item) => ({
    id: item.product_id || item.id,
    sku: item.model || item.name,
    price_retail: item.price_retail,
    price_business: item.price_business,
    price_wholesale: item.price_wholesale,
    stock_status: item.stock_status,
    is_enable: item.is_enable,
  }))

const toVariantRows = (items: VariantCardResponse[] = []): ProductVariantListItem[] =>
  items.map((item) => ({
    id: item.id,
    product_id: item.product_id,
    name: item.name,
    slug: item.slug,
    model: item.model,
    is_enable: item.is_enable,
    category_id: item.category_id,
  }))

const normalizePagination = (
  pagination: VariantListResponse['pagination'],
  fallbackPage: number,
  fallbackPageSize: number,
) => ({
  page: pagination?.page ?? fallbackPage,
  page_size: pagination?.page_size ?? fallbackPageSize,
  total: pagination?.total ?? 0,
  last_page: pagination?.last_page ?? 1,
})

const displayedProducts = computed<IProductResponse>(() => {
  if (!productSearch.value.trim()) return products.value
  return {
    items: toProductRows(productSearchData.value.items),
    pagination: normalizePagination(
      productSearchData.value.pagination,
      productParams.value.page,
      productParams.value.pageSize,
    ),
  }
})

const displayedVariants = computed<IVariantListResponse>(() => {
  if (!variantSearch.value.trim()) return allVariants.value
  return {
    items: toVariantRows(variantSearchData.value.items),
    pagination: normalizePagination(
      variantSearchData.value.pagination,
      variantParams.value.page,
      variantParams.value.pageSize,
    ),
  }
})

const productsLoading = computed(() =>
  productSearch.value.trim() ? productSearchLoading.value : isLoading.value,
)
const variantsLoading = computed(() =>
  variantSearch.value.trim() ? variantSearchLoading.value : isLoading.value,
)

const syncQuery = () => {
  const query: Record<string, string> = {}
  if (productFilter.value === 'without_variants') query.filter = 'without_variants'
  if (activeTab.value === 'variants') query.tab = 'variants'
  if (productSearch.value.trim()) query.q = productSearch.value.trim()
  if (variantSearch.value.trim()) query.vq = variantSearch.value.trim()
  router.replace({ name: 'product', query })
}

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
  await getAllVariants({
    page: variantParams.value.page,
    page_size: variantParams.value.pageSize,
  })
}

const searchProducts = async () => {
  const q = productSearch.value.trim()
  if (!q) {
    productSearchData.value = { items: [], pagination: { ...emptyPagination } }
    return
  }
  try {
    productSearchLoading.value = true
    productSearchData.value = await ProductService.search({
      q,
      page: productParams.value.page,
      page_size: productParams.value.pageSize,
    })
  } catch {
    productSearchData.value = { items: [], pagination: { ...emptyPagination } }
  } finally {
    productSearchLoading.value = false
  }
}

const searchVariants = async () => {
  const q = variantSearch.value.trim()
  if (!q) {
    variantSearchData.value = { items: [], pagination: { ...emptyPagination } }
    return
  }
  try {
    variantSearchLoading.value = true
    variantSearchData.value = await ProductService.search({
      q,
      page: variantParams.value.page,
      page_size: variantParams.value.pageSize,
    })
  } catch {
    variantSearchData.value = { items: [], pagination: { ...emptyPagination } }
  } finally {
    variantSearchLoading.value = false
  }
}

const setFilter = (filter: ProductFilter) => {
  productFilter.value = filter
  productParams.value.page = 1
  syncQuery()
  if (!productSearch.value.trim()) fetchProducts()
}

watch(
  productParams,
  () => {
    if (productSearch.value.trim()) searchProducts()
    else fetchProducts()
  },
  { deep: true, immediate: true },
)

watch(
  variantParams,
  () => {
    if (variantSearch.value.trim()) searchVariants()
    else if (activeTab.value === 'variants') fetchVariants()
  },
  { deep: true },
)

if (activeTab.value === 'variants' && !variantSearch.value.trim()) {
  fetchVariants()
} else if (activeTab.value === 'variants' && variantSearch.value.trim()) {
  searchVariants()
}

watchDebounced(
  productSearch,
  () => {
    syncQuery()
    if (productParams.value.page !== 1) {
      productParams.value.page = 1
      return
    }
    if (productSearch.value.trim()) searchProducts()
    else fetchProducts()
  },
  { debounce: 300 },
)

watchDebounced(
  variantSearch,
  () => {
    syncQuery()
    if (variantParams.value.page !== 1) {
      variantParams.value.page = 1
      return
    }
    if (variantSearch.value.trim()) searchVariants()
    else if (activeTab.value === 'variants') fetchVariants()
  },
  { debounce: 300 },
)

const onTabChange = (val: string | number) => {
  const tab = String(val)
  activeTab.value = tab
  syncQuery()
  if (tab === 'variants' && !variantSearch.value.trim() && allVariants.value.items.length === 0) {
    fetchVariants()
  }
}
</script>

<template>
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Tabs :model-value="activeTab" @update:model-value="onTabChange">
      <div class="flex items-center gap-2">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="products">
        <Card>
          <CardHeader>
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your products and their variants.</CardDescription>
              </div>
              <div class="flex flex-wrap items-end gap-2">
                <div class="relative w-full sm:w-[240px]">
                  <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    v-model="productSearch"
                    placeholder="Поиск товаров…"
                    class="h-8 pl-8 pr-8"
                  />
                  <button
                    v-if="productSearch"
                    type="button"
                    class="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                    @click="productSearch = ''"
                  >
                    <X class="h-4 w-4" />
                  </button>
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
            </div>
          </CardHeader>
          <CardContent>
            <ProductTable
              :params="productParams"
              :products="displayedProducts"
              :is-loading="productsLoading"
            />
          </CardContent>
          <CardFooter>
            <div class="text-xs text-muted-foreground">
              <template v-if="productSearch.trim()">
                Найдено: <strong>{{ displayedProducts.pagination.total }}</strong>
              </template>
              <template v-else>
                Total: <strong>{{ products?.pagination?.total ?? 0 }}</strong> products
              </template>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="variants">
        <Card>
          <CardHeader>
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle>Variants</CardTitle>
                <CardDescription>All product variants across the catalog.</CardDescription>
              </div>
              <div class="relative w-full sm:w-[280px]">
                <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  v-model="variantSearch"
                  placeholder="Поиск вариантов…"
                  class="h-8 pl-8 pr-8"
                />
                <button
                  v-if="variantSearch"
                  type="button"
                  class="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                  @click="variantSearch = ''"
                >
                  <X class="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <VariantTable
              :params="variantParams"
              :variants="displayedVariants"
              :is-loading="variantsLoading"
            />
          </CardContent>
          <CardFooter>
            <div class="text-xs text-muted-foreground">
              <template v-if="variantSearch.trim()">
                Найдено: <strong>{{ displayedVariants.pagination.total }}</strong>
              </template>
              <template v-else>
                Total: <strong>{{ allVariants?.pagination?.total ?? 0 }}</strong> variants
              </template>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </main>
</template>
