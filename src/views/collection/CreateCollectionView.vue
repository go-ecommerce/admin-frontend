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
          New category
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
          <CardTitle>Collection info</CardTitle>
        </CardHeader>
        <CardContent>
          <CollectionForm v-model="collectionInfo" />
        </CardContent>
      </Card>
    </div>
  </main>
</template>
<script setup lang="ts">
import { CornerUpLeft, PlusCircle } from 'lucide-vue-next'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import CollectionForm from '@/components/collection/CollectionForm.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCollectionStore } from '@/stores/collection'
import type { CreateCollectionRequest } from '@/utils/types/api/generatedApiGo'

const router = useRouter()
const { createCollection } = useCollectionStore()
const collectionInfo = ref<CreateCollectionRequest>({
  name: '',
  description: undefined,
  slug: '',
})

const saveAll = async () => {
  try {
    await createCollection(collectionInfo.value)
    await router.push({ name: 'collections' })
  } catch (error) {
    console.error(error)
  }
}
</script>
