<script setup lang="ts">
import { CornerUpLeft, PlusCircle, Trash2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CollectionForm from '@/components/collection/CollectionForm.vue'
import DataTable from '@/components/data-table/DataTable.vue'
import ProductSearch from '@/components/product/ProductSearch.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/toast/use-toast'
import { useCollectionStore } from '@/stores/collection'
import type { UpdateCollectionRequest } from '@/utils/types/api/generatedApiGo'

// Инициализация хранилища, роутера и toast
const collectionStore = useCollectionStore()
const { getCollectionById, updateCollection } = collectionStore
const { currentCollection } = storeToRefs(collectionStore)
const route = useRoute()
const router = useRouter()
const { toast } = useToast()

// Получение UUID из параметров маршрута
const uuid = typeof route.params.id === 'string' ? route.params.id : ''

onMounted(async () => {
  if (uuid) {
    try {
      await getCollectionById(uuid)
    } catch (error: any) {
      toast({
        title: 'Ошибка загрузки коллекции',
        description: error.message || 'Не удалось загрузить данные коллекции',
        variant: 'destructive',
      })
    }
  } else {
    toast({
      title: 'Ошибка',
      description: 'Идентификатор коллекции не указан',
      variant: 'destructive',
    })
    await router.push({ name: 'collection' })
  }
})

// Обновление категории с загрузкой изображения
const updateWithUpload = async () => {
  if (!currentCollection.value?.id) {
    throw new Error('Collection not selected')
  }
  try {
    // Подготовка данных для обновления
    const updateRequest: UpdateCollectionRequest = {
      ...(currentCollection.value as UpdateCollectionRequest),
    }

    // Обновление категории
    await updateCollection(updateRequest)
    toast({
      title: '✅ Collection updated',
      variant: 'success',
    })
    await router.push({ name: 'collection' })
  } catch (error: any) {
    toast({
      title: 'Ошибка обновления категории',
      description: error.message || 'Не удалось обновить категорию',
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
          Редактирование категории
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
          <CollectionForm v-if="currentCollection" v-model="currentCollection" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Add product collection</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductSearch />

<!--          <div v-for="row in products" :key="row.id" class=""></div> -->
        </CardContent>
      </Card>
    </div>
  </main>
</template>
