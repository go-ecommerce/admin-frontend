<script setup lang="ts">
import { CornerUpLeft, PlusCircle } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CollectionForm from '@/components/collection/CollectionForm.vue'
import ProductSearch from '@/components/product/ProductSearch.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast'
import { useCollectionStore } from '@/stores/collection'
import type { ShortProduct, UpdateCollectionRequest } from '@/utils/types/api/generatedApiGo'

const collectionStore = useCollectionStore()
const { getCollectionWithProducts, updateCollection } = collectionStore
const { currentCollectionWithProducts } = storeToRefs(collectionStore)
const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const uuid = typeof route.params.id === 'string' ? route.params.id : ''

const collectionInfo = ref<{ name: string; slug: string; description?: string }>({
  name: '',
  slug: '',
  description: undefined,
})
const selectedVariants = ref<ShortProduct[]>([])

onMounted(async () => {
  if (!uuid) {
    toast({
      title: 'Ошибка',
      description: 'Идентификатор коллекции не указан',
      variant: 'destructive',
    })
    await router.push({ name: 'collection' })
    return
  }

  try {
    await getCollectionWithProducts(uuid)
    const c = currentCollectionWithProducts.value
    if (c) {
      collectionInfo.value = {
        name: c.name ?? '',
        slug: c.slug ?? '',
        description: c.description,
      }
      selectedVariants.value = c.products ?? []
    }
  } catch (error: any) {
    toast({
      title: 'Ошибка загрузки коллекции',
      description: error.message || 'Не удалось загрузить данные коллекции',
      variant: 'destructive',
    })
  }
})

const updateWithUpload = async () => {
  try {
    const updateRequest: UpdateCollectionRequest = {
      name: collectionInfo.value.name,
      slug: collectionInfo.value.slug,
      description: collectionInfo.value.description,
      variant_ids: selectedVariants.value.map((p) => p.id!).filter(Boolean),
    }

    await updateCollection(updateRequest)
    toast({ title: '✅ Collection updated', variant: 'success' })
    await router.push({ name: 'collection' })
  } catch (error: any) {
    toast({
      title: 'Ошибка обновления коллекции',
      description: error.message || 'Не удалось обновить коллекцию',
      variant: 'destructive',
    })
  }
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
          @click="router.push({ name: 'collection' })"
        >
          <CornerUpLeft class="h-3.5 w-3.5" />
        </Button>
        <span class="text-2xl font-semibold sr-only sm:not-sr-only sm:whitespace-nowrap">
          Редактирование коллекции
        </span>
      </div>
      <Button size="sm" class="h-7 gap-1" @click="updateWithUpload">
        <PlusCircle class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Обновить </span>
      </Button>
    </div>
  </div>
  <main class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:px-6 sm:py-0 md:gap-8">
    <div class="col-span-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Info about collection</CardTitle>
        </CardHeader>
        <CardContent>
          <CollectionForm v-if="currentCollectionWithProducts" v-model="collectionInfo" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Variants in collection</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductSearch v-model="selectedVariants" />
        </CardContent>
      </Card>
    </div>
  </main>
</template>
