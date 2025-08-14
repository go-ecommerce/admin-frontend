<script setup lang="ts">
import { CornerUpLeft, PlusCircle, Trash2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ProductForm from '@/components/product/ProductForm.vue'
import ProductIdentifierForm from '@/components/product/ProductIdentifierForm.vue'
import ProductMetaForm from '@/components/product/ProductMetaForm.vue'
import ProductPhysicalAttribute from '@/components/product/ProductPhysicalAttribute.vue'
import ProductStockForm from '@/components/product/ProductStockForm.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUpload, FileUploadGrid, FileUploaded } from '@/components/ui/file-upload'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import { useToast } from '@/components/ui/toast/use-toast'
import MediaService from '@/services/MediaService'
import { useProductStore } from '@/stores/product'
import type { MediumResponse, UpdateProductRequest } from '@/utils/types/api/generatedApiGo'

const router = useRouter()
const route = useRoute()
const { toast } = useToast()

const productStore = useProductStore()
const { getProductsWithMedium, updateProduct } = productStore
const { currentProduct, currentProductMedium } = storeToRefs(productStore)

const files = ref([])
const loadFile = async () => {
  const uploads = files.value.map((file) => MediaService.uploadFile(file))
  const uploadedFiles = await Promise.all(uploads)
  return uploadedFiles
}
const handleFilesChange = (newFiles: any) => {
  files.value = newFiles
}

const updateAll = async () => {
  let uploadedFiles: MediumResponse[] = []

  try {
    uploadedFiles = await loadFile()

    const updateResquest: UpdateProductRequest = {
      ...currentProduct.value,
      manufacturer_id: undefined, // todo make normal omitempty
      media_ids: [],
    }

    updateResquest.media_ids = currentProductMedium.value
      .map((file) => file.id)
      .filter((id): id is string => typeof id === 'string')

    if (uploadedFiles.length > 0) {
      const mediaIDs = uploadedFiles
        .map((file) => file.id)
        .filter((id): id is string => typeof id === 'string')
      updateResquest.media_ids.push(...mediaIDs)
    }

    await updateProduct(updateResquest)
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

const uuid = typeof route.params.id === 'string' ? route.params.id : ''

onMounted(async () => {
  if (uuid) {
    try {
      await getProductsWithMedium(uuid)
    } catch (error: any) {
      toast({
        title: 'Ошибка загрузки Товара',
        description: error.message || 'Не удалось загрузить данные товара',
        variant: 'destructive',
      })
    }
  } else {
    toast({
      title: 'Ошибка',
      description: 'Идентификатор товара не указан',
      variant: 'destructive',
    })
    router.push({ name: 'product' })
  }
})
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
        <div class="text-2xl sr-only sm:not-sr-only sm:whitespace-nowrap">
          Редактирование Товара
          <span class="text-3xl font-semibold">{{ currentProduct?.name }} </span>
        </div>
      </div>
      <Button size="sm" class="h-7 gap-1" @click="updateAll()">
        <PlusCircle class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Обновить </span>
      </Button>
    </div>
  </div>
  <main
    class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:px-6 sm:py-0 md:gap-8"
    v-if="currentProduct"
  >
    <div class="col-span-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product info</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm v-model="currentProduct" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Meta information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductMetaForm v-model="currentProduct" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Identifier</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductIdentifierForm v-model="currentProduct" />
        </CardContent>
      </Card>
    </div>
    <div class="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Addition Info</CardTitle>
        </CardHeader>
        <CardContent>
          <NumberField v-model="currentProduct.sort_order">
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
          <Switch v-model="currentProduct.is_enable" />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Image Product</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploaded v-model="currentProductMedium" />
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
          <NumberField v-model="currentProduct.price">
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
          <ProductStockForm v-model="currentProduct" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Phisical Attribute</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductPhysicalAttribute v-model="currentProduct" />
        </CardContent>
      </Card>
    </div>
  </main>
</template>
<style scoped></style>
