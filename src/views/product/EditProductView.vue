<script setup lang="ts">
import { CornerUpLeft, PlusCircle, Trash2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ProductIdentifierForm from '@/components/product/ProductIdentifierForm.vue'
import ProductPhysicalAttribute from '@/components/product/ProductPhysicalAttribute.vue'
import ProductStockForm from '@/components/product/ProductStockForm.vue'
import ProductAttributesForm from '@/components/product/ProductAttributesForm.vue'
import ProductVariantsForm from '@/components/product/ProductVariantsForm.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUpload, FileUploadGrid, FileUploaded } from '@/components/ui/file-upload'
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
import { useToast } from '@/components/ui/toast/use-toast'
import MediaService from '@/services/MediaService'
import { useProductStore } from '@/stores/product'
import { Input } from '@/components/ui/input'
import type { MediumResponse } from '@/utils/types/api/generatedApiGo'

interface EditFormState {
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
const route = useRoute()
const { toast } = useToast()

const productStore = useProductStore()
const {
  getProductsWithMedium,
  updateProduct,

  syncRelatedProducts,
  getProductAttributes,
  syncProductAttributes,
  getProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} = productStore
const {
  currentProduct,
  currentProductMedium,
  currentRelatedProducts,
  currentProductAttributes,
  currentProductVariants,
} = storeToRefs(productStore)

const selectedAttributeValueIds = ref<string[]>([])
const attributesWereModified = ref(false)

const handleAttributesUpdate = (valueIds: string[]) => {
  selectedAttributeValueIds.value = valueIds
  attributesWereModified.value = true
}

const editInfo = ref<EditFormState>({
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

const files = ref([])
const loadFile = async () => {
  const uploads = files.value.map((file) => MediaService.uploadFile(file))
  return await Promise.all(uploads)
}
const handleFilesChange = (newFiles: any) => {
  files.value = newFiles
}

const updateAll = async () => {
  let uploadedFiles: MediumResponse[] = []

  try {
    uploadedFiles = await loadFile()

    const existingMediaIds = currentProductMedium.value
      .map((file) => file.id)
      .filter((id): id is string => typeof id === 'string')

    const newMediaIds = uploadedFiles
      .map((file) => file.id)
      .filter((id): id is string => typeof id === 'string')

    const allMediaFiles = [...currentProductMedium.value, ...uploadedFiles]
    const firstImagePath = allMediaFiles[0]?.path

    await updateProduct({
      model: editInfo.value.model,
      sku: editInfo.value.sku,
      upc: editInfo.value.upc,
      ean: editInfo.value.ean,
      jan: editInfo.value.jan,
      isbn: editInfo.value.isbn,
      mpn: editInfo.value.mpn,
      location: editInfo.value.location,
      price: editInfo.value.price,
      weight: editInfo.value.weight,
      length: editInfo.value.length,
      width: editInfo.value.width,
      height: editInfo.value.height,
      quantity: editInfo.value.quantity,
      stock_status: editInfo.value.stock_status,
      subtract: editInfo.value.subtract,
      minimum: editInfo.value.minimum,
      sort_order: editInfo.value.sort_order,
      is_enable: editInfo.value.is_enable,
      media_ids: [...existingMediaIds, ...newMediaIds],
      variant: {
        id: currentProduct.value?.variant?.id || '',
        name: editInfo.value.name,
        slug: editInfo.value.slug,
        description: editInfo.value.description,
        meta_title: editInfo.value.meta_title,
        meta_h1: editInfo.value.meta_h1,
        meta_description: editInfo.value.meta_description,
        meta_keyword: editInfo.value.meta_keyword,
        category_id: editInfo.value.category_id,
        image: firstImagePath,
        is_enable: editInfo.value.is_enable,
        sort_order: editInfo.value.sort_order,
      },
    })

    if (uuid && currentRelatedProducts.value.length >= 0) {
      const productIds = currentRelatedProducts.value
        .map((p) => p.id)
        .filter((id): id is string => typeof id === 'string')
      await syncRelatedProducts(uuid, productIds)
    }

    if (uuid && attributesWereModified.value) {
      await syncProductAttributes(uuid, selectedAttributeValueIds.value)
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

const uuid = typeof route.params.id === 'string' ? route.params.id : ''

onMounted(async () => {
  if (uuid) {
    try {
      await getProductsWithMedium(uuid)

      await getProductAttributes(uuid)
      await getProductVariants(uuid)

      const p = currentProduct.value
      if (p) {
        editInfo.value = {
          model: p.model || '',
          sku: p.sku || '',
          upc: p.upc || '',
          ean: p.ean || '',
          jan: p.jan || '',
          isbn: p.isbn || '',
          mpn: p.mpn || '',
          location: p.location || '',
          manufacturer_id: p.manufacturer_id?.uuid,
          price: p.price || 0,
          weight: p.weight || 0,
          length: p.length || 0,
          width: p.width || 0,
          height: p.height || 0,
          quantity: p.quantity || 0,
          stock_status: p.stock_status || 'IN_STOCK',
          subtract: p.subtract ?? true,
          minimum: p.minimum || 1,
          sort_order: p.sort_order || 0,
          is_enable: p.is_enable ?? true,
          name: p.variant?.name || '',
          slug: p.variant?.slug || '',
          description: p.variant?.description || '',
          meta_title: p.variant?.meta_title || '',
          meta_h1: p.variant?.meta_h1 || '',
          meta_description: p.variant?.meta_description || '',
          meta_keyword: p.variant?.meta_keyword || '',
          category_id: p.variant?.category_id?.uuid,
        }
      }

      if (currentProductAttributes.value?.groups) {
        const valueIds: string[] = []
        for (const group of currentProductAttributes.value.groups) {
          for (const attr of group.attributes) {
            if (attr.values && attr.values.length > 0) {
              valueIds.push(attr.values[0].id)
            }
          }
        }
        selectedAttributeValueIds.value = valueIds
      }
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
          <span class="text-3xl font-semibold">{{ editInfo.model }}</span>
        </div>
      </div>
      <Button size="sm" class="h-7 gap-1" @click="updateAll()">
        <PlusCircle class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Обновить </span>
      </Button>
    </div>
  </div>
  <main class="p-4 sm:px-6 sm:py-0 md:gap-8" v-if="currentProduct">
    <Tabs default-value="general" class="w-full">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="general">General Info</TabsTrigger>
        <TabsTrigger value="variants">Variants</TabsTrigger>
        <TabsTrigger value="attributes">Attributes</TabsTrigger>
      </TabsList>

      <TabsContent value="general" class="space-y-6 mt-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product info</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="flex flex-col space-y-1.5">
                  <Label for="model">Model</Label>
                  <Input id="model" v-model="editInfo.model" placeholder="Model of your product" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Identifier</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductIdentifierForm v-model="editInfo" />
              </CardContent>
            </Card>
          </div>
          <div class="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Addition Info</CardTitle>
              </CardHeader>
              <CardContent>
                <NumberField v-model="editInfo.sort_order">
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
                <Switch v-model="editInfo.is_enable" />
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
                <NumberField v-model="editInfo.price">
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
                <ProductStockForm v-model="editInfo" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Phisical Attribute</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductPhysicalAttribute v-model="editInfo" />
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="variants" class="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Варианты товара</CardTitle>
            <p class="text-sm text-muted-foreground">
              Один товар может присутствовать в нескольких категориях с разными названиями и описаниями
            </p>
          </CardHeader>
          <CardContent>
            <ProductVariantsForm
              :product-id="uuid"
              :variants="currentProductVariants"
              @create="(payload) => createProductVariant(uuid, payload)"
              @update="(variantId, payload) => updateProductVariant(uuid, variantId, payload)"
              @delete="(variantId) => deleteProductVariant(uuid, variantId)"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="attributes" class="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Attributes</CardTitle>
            <p class="text-sm text-muted-foreground">
              Manage product-specific attributes and their values
            </p>
          </CardHeader>
          <CardContent>
            <ProductAttributesForm
              :model-value="currentProductAttributes"
              @update:model-value="handleAttributesUpdate"
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </main>
</template>
<style scoped></style>
