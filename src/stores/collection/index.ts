import { defineStore } from 'pinia'

import { ref } from 'vue'

import { useToast } from '@/components/ui/toast'
import CollectionService from '@/services/CollectionService'
import type { ICollectionRequest, ICollectionResponse } from '@/utils/types/api/apiGo.ts'
import type {
  CollectionResponse,
  CreateCollectionRequest,
  UpdateCollectionRequest,
} from '@/utils/types/api/generatedApiGo'

export const useCollectionStore = defineStore('collection', () => {
  const isLoading = ref<boolean>(true)
  const collections = ref<ICollectionResponse | null>(null)
  const currentCollection = ref<CollectionResponse | null>(null)
  const { toast } = useToast()

  const getCollections = async (payload: ICollectionRequest): Promise<void> => {
    try {
      isLoading.value = true
      collections.value = await CollectionService.getApiCollections(payload)
    } catch (error: any) {
      toast({
        title: 'Error fetching collections',
        description: error.message || 'An error occurred while fetching collections',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getCollectionById = async (id: string): Promise<void> => {
    try {
      isLoading.value = true
      currentCollection.value = await CollectionService.getApiCollectionById(id)
    } catch (error: any) {
      toast({
        title: 'Error fetching collection ',
        description: error.message || 'An error occurred while fetching collection',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createCollection = async (request: CreateCollectionRequest): Promise<void> => {
    try {
      isLoading.value = true
      await CollectionService.CreateApiCollection(request)
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

  const updateCollection = async (request: UpdateCollectionRequest): Promise<void> => {
    if (!currentCollection.value?.id) {
      throw new Error('No collection selected for update')
    }

    try {
      isLoading.value = true
      await CollectionService.UpdateApiCollection(currentCollection.value.id, request)
      toast({
        title: '✅ Success update',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error updating collection',
        description: error.message || 'An error occurred while updating the collection',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }
  return {
    isLoading,
    collections,
    currentCollection,
    createCollection,
    updateCollection,
    getCollections,
    getCollectionById,
  }
})
