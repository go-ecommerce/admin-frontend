<script setup lang="ts">
import { CornerUpLeft, LogIn, PlusCircle } from 'lucide-vue-next'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import ProductForm from '@/components/product/ProductForm.vue'
import ProductIdentifierForm from '@/components/product/ProductIdentifierForm.vue'
import ProductMetaForm from '@/components/product/ProductMetaForm.vue'
import ProductPhysicalAttribute from '@/components/product/ProductPhysicalAttribute.vue'
import ProductStockForm from '@/components/product/ProductStockForm.vue'
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
import MediaService from '@/services/MediaService'
import { useProductStore } from '@/stores/product'
import type { CreateProductRequest, MediumResponse } from '@/utils/types/api/generatedApiGo'

const router = useRouter()
const { createProduct } = useProductStore()

const productInfo = ref<CreateProductRequest>({
  name: '',
  model: '',
  slug: '',
  description: '',
  meta_title: '',
  meta_h1: '',
  meta_description: '',
  meta_keyword: '',
  sku: '',
  upc: '',
  ean: '',
  jan: '',
  isbn: '',
  mpn: '',
  location: '',
  quantity: 0,
  stock_status: 'IN_STOCK',
  image: '',
  manufacturer_id: undefined,
  price: 0.0,
  weight: 0.0,
  length: 0.0,
  width: 0.0,
  height: 0.0,
  subtract: true,
  minimum: 1,
  sort_order: 1,
  is_enable: true,
  media_ids: [],
})

const saveAll = async () => {
  let uploadedFiles: MediumResponse[] = []

  try {
    uploadedFiles = await loadFile()

    productInfo.value.media_ids = uploadedFiles
      .map((file) => file.id)
      .filter((id): id is string => typeof id === 'string')

    if (uploadedFiles.length > 0) {
      productInfo.value.image = uploadedFiles[0].path
    }

    await createProduct(productInfo.value)
    // await router.push({ name: 'product' })
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
  <main class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:px-6 sm:py-0 md:gap-8">
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
      <div class="flex flex-row items-center justify-between rounded-lg border p-4">
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
  </main>
</template>
