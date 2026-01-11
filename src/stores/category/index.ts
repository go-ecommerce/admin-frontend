import { defineStore } from 'pinia';



import { ref } from 'vue';



import { useToast } from '@/components/ui/toast/use-toast';
import AttributeService from '@/services/AttributeService';
import CategoryService from '@/services/CatergoryService';
import type { ICategoriesResponse, ICategoryRequest } from '@/utils/types/api/apiGo.ts';
import type { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from '@/utils/types/api/generatedApiGo';





const defaultDataCategories: ICategoriesResponse = {
  items: [],
  pagination: {
    page: 1,
    page_size: 10,
    total: 100,
    last_page: 1,
  },
}

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
        description: error.message || 'An error occurred while fetching categories',
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
        description: error.message || 'An error occurred while fetching the category',
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
        description: error.message || 'An error occurred while creating the category',
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
        description: error.message || 'An error occurred while updating the category',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteCategory = async (uuid: string): Promise<void> => {
    try {
      isLoading.value = true
      await CategoryService.dele(id)
      toast({
        title: '✅ Success delete',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error deleting attribute group',
        description: error.message || 'An error occurred while deleting the attribute group',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
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
    clearCurrentCategory,
  }
})
