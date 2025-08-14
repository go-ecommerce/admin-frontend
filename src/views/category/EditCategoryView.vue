<script setup lang="ts">
import { CornerUpLeft, PlusCircle, Trash2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CategoryForm from '@/components/category/CategoryForm.vue'
import MetaInformationForm from '@/components/category/CategoryMetaForm.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUpload, FileUploadGrid } from '@/components/ui/file-upload'
import { useToast } from '@/components/ui/toast/use-toast'
import MediaService from '@/services/MediaService'
import { useCategoryStore } from '@/stores/category'
import type { MediumResponse, UpdateCategoryRequest } from '@/utils/types/api/generatedApiGo'

// Инициализация хранилища, роутера и toast
const categoryStore = useCategoryStore()
const { getCategoryById, updateCategory } = categoryStore
const { currentCategory } = storeToRefs(categoryStore)
const route = useRoute()
const router = useRouter()
const { toast } = useToast()

// Типизация файлов
const files = ref<File[]>([])

// Получение UUID из параметров маршрута
const uuid = typeof route.params.id === 'string' ? route.params.id : ''

// Базовый URL для хранения файлов (замените на вашу реализацию)
const fileStorageUrl = import.meta.env.VITE_FILE_STORAGE_URL || 'http://localhost:3000/storage/'

// Загрузка категории при монтировании компонента
onMounted(async () => {
  if (uuid) {
    try {
      await getCategoryById(uuid)
    } catch (error: any) {
      toast({
        title: 'Ошибка загрузки категории',
        description: error.message || 'Не удалось загрузить данные категории',
        variant: 'destructive',
      })
    }
  } else {
    toast({
      title: 'Ошибка',
      description: 'Идентификатор категории не указан',
      variant: 'destructive',
    })
    router.push({ name: 'category' })
  }
})

// Обработка изменения файлов
const handleFilesChange = (newFiles: File[]) => {
  files.value = newFiles
}

// Удаление изображения
const removeImage = () => {
  if (currentCategory.value) {
    currentCategory.value.image_path = undefined
  }
}

// Загрузка файла
const loadFile = async (): Promise<MediumResponse> => {
  if (!files.value[0]) {
    throw new Error('Файл не выбран')
  }
  return await MediaService.uploadFile(files.value[0])
}

// Обновление категории с загрузкой изображения
const updateWithUpload = async () => {
  if (!currentCategory.value?.id) {
    throw new Error('Category not selected')
  }
  try {
    // Подготовка данных для обновления
    const updateRequest: UpdateCategoryRequest = {
      ...currentCategory.value,
      image_path: currentCategory.value.image_path || undefined,
    }

    // Загрузка нового изображения, если выбрано
    if (files.value.length > 0) {
      const file = await loadFile()
      updateRequest.image_path = file.path
    }

    // Обновление категории
    await updateCategory(updateRequest)
    toast({
      title: '✅ Категория обновлена',
      variant: 'success',
    })
    await router.push({ name: 'category' })
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
          @click="router.push({ name: 'category' })"
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
          <CardTitle>Информация о категории</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm v-if="currentCategory" v-model="currentCategory" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Мета-информация</CardTitle>
        </CardHeader>
        <CardContent>
          <MetaInformationForm v-if="currentCategory" v-model="currentCategory" />
        </CardContent>
      </Card>
    </div>
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Изображение категории</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="currentCategory?.image_path" class="relative w-full flex justify-center">
            <div class="relative">
              <img
                :src="fileStorageUrl + currentCategory.image_path"
                alt="Изображение категории"
                class="h-52 w-52 rounded-md object-cover border"
              />
              <Button
                @click="removeImage"
                size="icon"
                class="absolute top-1 right-1 bg-red-500 text-white p-1 shadow-md hover:bg-red-600 transition"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          </div>
          <FileUpload
            v-else
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
