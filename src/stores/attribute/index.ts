import { defineStore } from 'pinia'

import { ref } from 'vue'

import { useToast } from '@/components/ui/toast'
import AttributeService from '@/services/AttributeService'
import type {
  IAttributeGroupRequest,
  IAttributeGroupResponse,
  IAttributeRequest,
  IAttributeResponse,
  IAttributeValueRequest,
  IAttributeValueResponse,
} from '@/utils/types/api/apiGo.ts'
import type {
  AttributeGroupResponse,
  AttributeResponse,
  AttributeValueResponse,
  CreateAttributeGroupRequest,
  CreateAttributeRequest,
  CreateAttributeValueRequest,
  UpdateAttributeGroupRequest,
  UpdateAttributeValueRequest,
} from '@/utils/types/api/generatedApiGo'

export const useAttributeStore = defineStore('attribute', () => {
  const isLoading = ref<boolean>(false)
  const attributesGroups = ref<IAttributeGroupResponse | null>(null)
  const currentAttributeGroup = ref<AttributeGroupResponse | null>(null)
  const attributes = ref<IAttributeResponse | null>(null)
  const currentAttribute = ref<AttributeResponse | null>(null)
  const attributeValues = ref<IAttributeValueResponse | null>(null)
  const currentAttributeValue = ref<AttributeValueResponse | null>(null)

  const { toast } = useToast()

  const getAttributesGroups = async (paylaod: IAttributeGroupRequest): Promise<void> => {
    try {
      isLoading.value = true
      attributesGroups.value = await AttributeService.getApiAttributeGroups(paylaod)
    } catch (error: any) {
      toast({
        title: 'Error fetching attributes groups.',
        description: error.message || 'An error occurred while fetching attributes groups.',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getAttributeGroupById = async (id: string): Promise<void> => {
    try {
      isLoading.value = true
      currentAttributeGroup.value = await AttributeService.getApiAttributeGroupById(id)
    } catch (error: any) {
      toast({
        title: 'Error fetching attribute group',
        description: error.message || 'An error occurred while fetching attribute group',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createAttributeGroup = async (
    request: CreateAttributeGroupRequest,
  ): Promise<AttributeGroupResponse> => {
    try {
      isLoading.value = true
      const response = await AttributeService.createApiAttributeGroup(request)
      toast({
        title: '✅ Success create',
        variant: 'success',
      })
      return response
    } catch (error: any) {
      toast({
        title: 'Error creating attribute group',
        description: error.message || 'An error occurred while creating the attribute group',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateAttributeGroup = async (request: UpdateAttributeGroupRequest): Promise<void> => {
    if (!currentAttributeGroup.value?.id) {
      throw new Error('No attribute group selected for update')
    }

    try {
      isLoading.value = true
      await AttributeService.updateApiAttributeGroup(currentAttributeGroup.value.id, request)
      toast({
        title: '✅ Success update',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error updating attribute group',
        description: error.message || 'An error occurred while updating the attribute group',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteAttributeGroup = async (id: string): Promise<void> => {
    try {
      isLoading.value = true
      await AttributeService.deleteApiAttributeGroup(id)
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

  const getAttributes = async (payload: IAttributeRequest): Promise<void> => {
    try {
      isLoading.value = true
      attributes.value = await AttributeService.getApiAttributes(payload)
    } catch (error: any) {
      toast({
        title: 'Error fetching attributes',
        description: error.message || 'An error occurred while fetching attributes',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getAttributeById = async (id: string): Promise<void> => {
    try {
      isLoading.value = true
      currentAttribute.value = await AttributeService.getApiAttributeById(id)
    } catch (error: any) {
      toast({
        title: 'Error fetching attribute',
        description: error.message || 'An error occurred while fetching attribute',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createAttribute = async (request: CreateAttributeRequest): Promise<AttributeResponse> => {
    try {
      isLoading.value = true
      const response = await AttributeService.createApiAttribute(request)
      toast({
        title: '✅ Success create',
        variant: 'success',
      })
      return response
    } catch (error: any) {
      toast({
        title: 'Error creating attribute',
        description: error.message || 'An error occurred while creating the attribute',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateAttribute = async (request: CreateAttributeRequest): Promise<void> => {
    if (!currentAttribute.value?.id) {
      throw new Error('No attribute selected for update')
    }

    try {
      isLoading.value = true
      await AttributeService.updateApiAttribute(currentAttribute.value.id, request)
      toast({
        title: '✅ Success update',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error updating attribute',
        description: error.message || 'An error occurred while updating the attribute',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteAttribute = async (id: string): Promise<void> => {
    try {
      isLoading.value = true
      await AttributeService.deleteApiAttribute(id)
      toast({
        title: '✅ Success delete',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error deleting attribute',
        description: error.message || 'An error occurred while deleting the attribute',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const clearCurrentAttribute = (): void => {
    currentAttribute.value = null
  }

  const clearCurrentAttributeGroup = (): void => {
    currentAttributeGroup.value = null
  }

  // AttributeValue methods
  const getAttributeValues = async (payload: IAttributeValueRequest): Promise<void> => {
    try {
      isLoading.value = true
      attributeValues.value = await AttributeService.getApiAttributeValues(payload)
    } catch (error: any) {
      toast({
        title: 'Error fetching attribute values',
        description: error.message || 'An error occurred while fetching attribute values',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getAttributeValuesByAttributeId = async (attributeId: string): Promise<void> => {
    try {
      isLoading.value = true
      const values = await AttributeService.getApiAttributeValuesByAttributeId(attributeId)
      // Convert to the same format as getAttributeValues
      attributeValues.value = {
        items: values,
        pagination: {
          total: values.length,
          page: 1,
          page_size: values.length,
          last_page: 1,
        },
      }
    } catch (error: any) {
      toast({
        title: 'Error fetching attribute values',
        description: error.message || 'An error occurred while fetching attribute values',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getAttributeValueById = async (id: string): Promise<void> => {
    try {
      isLoading.value = true
      currentAttributeValue.value = await AttributeService.getApiAttributeValueById(id)
    } catch (error: any) {
      toast({
        title: 'Error fetching attribute value',
        description: error.message || 'An error occurred while fetching attribute value',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createAttributeValue = async (request: CreateAttributeValueRequest): Promise<void> => {
    try {
      isLoading.value = true
      await AttributeService.createApiAttributeValue(request)
      toast({
        title: '✅ Success create',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error creating attribute value',
        description: error.message || 'An error occurred while creating the attribute value',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateAttributeValue = async (request: UpdateAttributeValueRequest): Promise<void> => {
    if (!currentAttributeValue.value?.id) {
      throw new Error('No attribute value selected for update')
    }

    try {
      isLoading.value = true
      await AttributeService.updateApiAttributeValue(currentAttributeValue.value.id, request)
      toast({
        title: '✅ Success update',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error updating attribute value',
        description: error.message || 'An error occurred while updating the attribute value',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteAttributeValue = async (id: string): Promise<void> => {
    try {
      isLoading.value = true
      await AttributeService.deleteApiAttributeValue(id)
      toast({
        title: '✅ Success delete',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error deleting attribute value',
        description: error.message || 'An error occurred while deleting the attribute value',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const clearCurrentAttributeValue = (): void => {
    currentAttributeValue.value = null
  }

  return {
    isLoading,
    attributesGroups,
    currentAttributeGroup,
    attributes,
    currentAttribute,
    attributeValues,
    currentAttributeValue,
    getAttributesGroups,
    getAttributeGroupById,
    createAttributeGroup,
    updateAttributeGroup,
    deleteAttributeGroup,
    getAttributes,
    getAttributeById,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    clearCurrentAttribute,
    clearCurrentAttributeGroup,
    getAttributeValues,
    getAttributeValuesByAttributeId,
    getAttributeValueById,
    createAttributeValue,
    updateAttributeValue,
    deleteAttributeValue,
    clearCurrentAttributeValue,
  }
})
