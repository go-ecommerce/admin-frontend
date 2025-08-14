<script setup lang="ts">
import { CornerUpLeft, PlusCircle } from 'lucide-vue-next'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import CategoryForm from '@/components/category/CategoryForm.vue'
import MetaInformationForm from '@/components/category/CategoryMetaForm.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUpload, FileUploadGrid } from '@/components/ui/file-upload'
import MediaService from '@/services/MediaService'
import { useCategoryStore } from '@/stores/category'
import type { CreateCategoryRequest } from '@/utils/types/api/generatedApiGo'

const router = useRouter()
const { createCategory } = useCategoryStore()

const categoryInfo = ref<CreateCategoryRequest>({
  name: '',
  slug: '',
  description: '',
  parent_id: undefined,
  image_path: undefined,
  meta_title: '',
  meta_h1: '',
  meta_keyword: '',
  meta_description: '',
  is_enabled: true,
})

const saveAll = async () => {
  try {
    const file = await loadFile()
    categoryInfo.value.image_path = file.path
    await createCategory(categoryInfo.value)
    await router.push({ name: 'category' })
  } catch (error) {
    console.error(error)
  }
}

const files = ref([])

const loadFile = async () => {
  return await MediaService.uploadFile(files.value[0])
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
          @click="router.push({ name: 'category' })"
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
          <CardTitle>Category info</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm v-model="categoryInfo" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meta information</CardTitle>
        </CardHeader>
        <CardContent>
          <MetaInformationForm v-model="categoryInfo" />
        </CardContent>
      </Card>
    </div>
    <div>
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
    </div>
  </main>
</template>
