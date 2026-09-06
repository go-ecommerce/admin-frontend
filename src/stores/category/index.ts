import { defineStore } from 'pinia'

import { ref } from 'vue'

import { useToast } from '@/components/ui/toast/use-toast'
import CategoryService from '@/services/CatergoryService'
import { extractApiErrorMessage } from '@/utils/apiError'
import type { ICategoriesResponse, ICategoryRequest } from '@/utils/types/api/apiGo.ts'
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/utils/types/api/generatedApiGo'

const defaultDataCategories: ICategoriesResponse = {
  items: [],
  pagination: {
    page: 1,
    page_size: 10,
    total: 0,
    last_page: 1,
  },
}

const toUpdateRequest = (
  category: CategoryResponse,
  overrides: Partial<UpdateCategoryRequest> = {},
): UpdateCategoryRequest => ({
  name: category.name,
  slug: category.slug,
  description: category.description,
  image_path: category.image_path,
  meta_title: category.meta_title,
  meta_h1: category.meta_h1,
  meta_description: category.meta_description,
  meta_keyword: category.meta_keywords,
  parent_id: category.parent_id,
  is_enabled: category.is_enabled,
  ...overrides,
})

export const useCategoryStore = defineStore('category', () => {
  const isLoading = ref<boolean>(false)
  const categories = ref<ICategoriesResponse>(defaultDataCategories)
  const currentCategory = ref<CategoryResponse | null>(null)
  const { toast } = useToast()

  const getCategories = async (payload: ICategoryRequest): Promise<void> => {
    try {
      isLoading.value = true
      categories.value = await CategoryService.getApiCategories(payload)
    } catch (error: any) {
      toast({
        title: 'Error fetching categories',
        description: extractApiErrorMessage(error, 'An error occurred while fetching categories'),
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getCategoryById = async (uuid: string): Promise<void> => {
    try {
      isLoading.value = true
      currentCategory.value = await CategoryService.getApiCategoryById(uuid)
    } catch (error: any) {
      toast({
        title: 'Error fetching category',
        description: extractApiErrorMessage(error, 'An error occurred while fetching the category'),
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createCategory = async (request: CreateCategoryRequest): Promise<void> => {
    try {
      isLoading.value = true
      await CategoryService.createApiCategory(request)
      toast({
        title: '✅ Success create',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error creating category',
        description: extractApiErrorMessage(error, 'An error occurred while creating the category'),
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateCategory = async (request: UpdateCategoryRequest): Promise<void> => {
    if (!currentCategory.value?.id) {
      throw new Error('No category selected for update')
    }

    try {
      isLoading.value = true
      await CategoryService.updateApiCategoryById(currentCategory.value.id, request)
      toast({
        title: '✅ Success update',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error updating category',
        description: extractApiErrorMessage(error, 'An error occurred while updating the category'),
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const setCategoryEnabled = async (
    category: CategoryResponse,
    isEnabled: boolean,
  ): Promise<void> => {
    if (!category.id) {
      throw new Error('Category id is missing')
    }

    const previous = category.is_enabled
    const item = categories.value.items.find((entry) => entry.id === category.id)
    if (item) item.is_enabled = isEnabled

    try {
      await CategoryService.updateApiCategoryById(
        category.id,
        toUpdateRequest(category, { is_enabled: isEnabled }),
      )
    } catch (error: any) {
      if (item) item.is_enabled = previous
      toast({
        title: 'Не удалось изменить статус',
        description: extractApiErrorMessage(error, 'An error occurred while updating the category'),
        variant: 'destructive',
      })
      throw error
    }
  }

  const clearCurrentCategory = (): void => {
    currentCategory.value = null
  }

  return {
    isLoading,
    categories,
    currentCategory,
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    setCategoryEnabled,
    clearCurrentCategory,
  }
})
