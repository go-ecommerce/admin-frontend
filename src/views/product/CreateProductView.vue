<script setup lang="ts">
import { CornerUpLeft, LogIn, PlusCircle } from 'lucide-vue-next'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import ProductForm from '@/components/product/ProductForm.vue'
import ProductIdentifierForm from '@/components/product/ProductIdentifierForm.vue'
import ProductMetaForm from '@/components/product/ProductMetaForm.vue'
import ProductPhysicalAttribute from '@/components/product/ProductPhysicalAttribute.vue'
import ProductStockForm from '@/components/product/ProductStockForm.vue'
import RelatedProductsForm from '@/components/product/RelatedProductsForm.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUpload, FileUploadGrid } from '@/components/ui/file-upload'
import { Label } from '@/components/ui/label'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MediaService from '@/services/MediaService'
import { useProductStore } from '@/stores/product'
import type { MediumResponse, ShortProduct } from '@/utils/types/api/generatedApiGo'

interface ProductFormState {
  // Root fields
  model: string
  sku: string
  upc: string
  ean: string
  jan: string
  isbn: string
  mpn: string
  location: string
  manufacturer_id: string | undefined
  price: number
  weight: number
  length: number
  width: number
  height: number
  quantity: number
  stock_status: string
  subtract: boolean
  minimum: number
  sort_order: number
  is_enable: boolean
  // Variant fields (flat for UI)
  name: string
  slug: string
  description: string
  meta_title: string
  meta_h1: string
  meta_description: string
  meta_keyword: string
  category_id: string | undefined
}

const router = useRouter()
const { createProduct, syncRelatedProducts } = useProductStore()

const relatedProducts = ref<ShortProduct[]>([])

const productInfo = ref<ProductFormState>({
  model: '',
  sku: '',
  upc: '',
  ean: '',
  jan: '',
  isbn: '',
  mpn: '',
  location: '',
  manufacturer_id: undefined,
  price: 0,
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  quantity: 0,
  stock_status: 'IN_STOCK',
  subtract: true,
  minimum: 1,
  sort_order: 0,
  is_enable: true,
  name: '',
  slug: '',
  description: '',
  meta_title: '',
  meta_h1: '',
  meta_description: '',
  meta_keyword: '',
  category_id: undefined,
})

const saveAll = async () => {
  let uploadedFiles: MediumResponse[] = []
  let createdProductId: string | undefined

  try {
    uploadedFiles = await loadFile()

    const mediaIds = uploadedFiles
      .map((file) => file.id)
      .filter((id): id is string => typeof id === 'string')

    const createdProduct = await createProduct({
      model: productInfo.value.model,
      sku: productInfo.value.sku,
      upc: productInfo.value.upc,
      ean: productInfo.value.ean,
      jan: productInfo.value.jan,
      isbn: productInfo.value.isbn,
      mpn: productInfo.value.mpn,
      location: productInfo.value.location,
      manufacturer_id: productInfo.value.manufacturer_id,
      price: productInfo.value.price,
      weight: productInfo.value.weight,
      length: productInfo.value.length,
      width: productInfo.value.width,
      height: productInfo.value.height,
      quantity: productInfo.value.quantity,
      stock_status: productInfo.value.stock_status,
      subtract: productInfo.value.subtract,
      minimum: productInfo.value.minimum,
      sort_order: productInfo.value.sort_order,
      is_enable: productInfo.value.is_enable,
      media_ids: mediaIds,
      variant: {
        name: productInfo.value.name,
        slug: productInfo.value.slug,
        description: productInfo.value.description,
        meta_title: productInfo.value.meta_title,
        meta_h1: productInfo.value.meta_h1,
        meta_description: productInfo.value.meta_description,
        meta_keyword: productInfo.value.meta_keyword,
        category_id: productInfo.value.category_id,
        image: uploadedFiles[0]?.path,
        is_enable: productInfo.value.is_enable,
        sort_order: productInfo.value.sort_order,
      },
    })
    createdProductId = createdProduct?.id

    if (createdProductId && relatedProducts.value.length > 0) {
      const productIds = relatedProducts.value
        .map((p) => p.id)
        .filter((id): id is string => typeof id === 'string')
      await syncRelatedProducts(createdProductId, productIds)
    }

    await router.push({ name: 'product' })
  } catch (error) {
    await Promise.all(
      uploadedFiles
        .map((file) => file.id)
        .filter((id): id is string => typeof id === 'string')
        .map((id) => MediaService.deleteFile(id)),
    )

    console.error('Ошибка при сохранении продукта:', error)
  }
}

const files = ref([])
const loadFile = async () => {
  const uploads = files.value.map((file) => MediaService.uploadFile(file))
  const uploadedFiles = await Promise.all(uploads)
  return uploadedFiles
}
const handleFilesChange = (newFiles: any) => {
  files.value = newFiles
}
</script>
<template>
  <div class="p-4 sm:px-6 md:gap-8">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          class="h-7 gap-1"
          @click="router.push({ name: 'product' })"
        >
          <CornerUpLeft class="h-3.5 w-3.5" />
        </Button>
        <span class="text-2xl font-semibold sr-only sm:not-sr-only sm:whitespace-nowrap">
          New product
        </span>
      </div>
      <Button size="sm" class="h-7 gap-1" @click="saveAll">
        <PlusCircle class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Save </span>
      </Button>
    </div>
  </div>
  <main class="p-4 sm:px-6 sm:py-0 md:gap-8">
    <Tabs default-value="general" class="w-full">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="general">General Info</TabsTrigger>
        <TabsTrigger value="related">Related Products</TabsTrigger>
      </TabsList>

      <TabsContent value="general" class="space-y-6 mt-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product info</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductForm v-model="productInfo" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meta information</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductMetaForm v-model="productInfo" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Identifier</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductIdentifierForm v-model="productInfo" />
              </CardContent>
            </Card>
          </div>
          <div class="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Addition Info</CardTitle>
              </CardHeader>
              <CardContent>
                <NumberField v-model="productInfo.sort_order">
                  <Label>Sort order</Label>
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
              </CardContent>
            </Card>
            <div
              class="p-4 bg-card text-card-foreground flex justify-between gap-6 rounded-xl border py-6 shadow-sm"
            >
              <div class="space-y-0.5">
                <div
                  class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
                >
                  Product status
                </div>
                <p class="text-sm text-muted-foreground">Product status show product on catalog</p>
              </div>
              <div>
                <Switch v-model="productInfo.is_enable" />
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Image Category</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  @onChange="handleFilesChange"
                  class="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800"
                >
                  <FileUploadGrid />
                </FileUpload>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Price</CardTitle>
              </CardHeader>
              <CardContent>
                <NumberField v-model="productInfo.price">
                  <Label>Price</Label>
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stocks</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductStockForm v-model="productInfo" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Phisical Attribute</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductPhysicalAttribute v-model="productInfo" />
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="related" class="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Related Products</CardTitle>
          </CardHeader>
          <CardContent>
            <RelatedProductsForm v-model="relatedProducts" />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </main>
</template>
