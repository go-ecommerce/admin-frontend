import { defineStore } from 'pinia'

import { ref } from 'vue'

import { useToast } from '@/components/ui/toast'
import ProductService from '@/services/ProductService'
import type { IProductRequest, IProductResponse, ProductAttributesResponse } from '@/utils/types/api/apiGo.ts'
import type {
  CreateProductRequest,
  MediumResponse,
  ProductResponse,
  UpdateProductRequest,
  ShortProduct,
  SyncRelatedProductRequest,
} from '@/utils/types/api/generatedApiGo'

const defaultDataProducts: IProductResponse = {
  items: [],
  pagination: {
    page: 1,
    page_size: 10,
    total: 100,
    last_page: 1,
  },
}

export const useProductStore = defineStore('product', () => {
  const isLoading = ref<boolean>(true)
  const products = ref<IProductResponse>(defaultDataProducts)
  const currentProduct = ref<ProductResponse | null>(null)
  const currentProductMedium = ref<MediumResponse[]>([])
  const currentRelatedProducts = ref<ShortProduct[]>([])
  const currentProductAttributes = ref<ProductAttributesResponse | null>(null)
  const { toast } = useToast()

  const getProducts = async (payload: IProductRequest): Promise<void> => {
    try {
      isLoading.value = true
      products.value = await ProductService.getProducts(payload)
    } catch (error: any) {
      toast({
        title: 'Error fetching products.',
        description: error.message || 'An error occurred while fetching products.',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getProductById = async (uuid: string): Promise<void> => {
    try {
      isLoading.value = true
      currentProduct.value = await ProductService.getProductById(uuid)
    } catch (error: any) {
      toast({
        title: 'Error fetching products.',
        description: error.message || 'An error occurred while fetching products.',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getProductsWithMedium = async (uuid: string): Promise<void> => {
    try {
      isLoading.value = true
      const { product, medium } = await ProductService.getProductWithMediumById(uuid)
      currentProduct.value = product || null
      currentProductMedium.value = medium || []
    } catch (error: any) {
      toast({
        title: 'Error fetching products.',
        description: error.message || 'An error occurred while fetching products.',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createProduct = async (request: CreateProductRequest): Promise<ProductResponse> => {
    try {
      isLoading.value = true
      const product = await ProductService.createApiProduct(request)
      toast({
        title: '✅ Success create',
        variant: 'success',
      })
      return product
    } catch (error: any) {
      toast({
        title: 'Error creating product',
        description: error.message || 'An error occurred while creating product.',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateProduct = async (request: UpdateProductRequest): Promise<void> => {
    if (!currentProduct.value?.id) {
      throw new Error('No product selected for update')
    }

    try {
      isLoading.value = true
      await ProductService.updateApiProduct(currentProduct.value.id, request)
      toast({
        title: '✅ Success update',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error updating product',
        description: error.message || 'An error occurred while updating product.',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getRelatedProducts = async (uuid: string): Promise<void> => {
    try {
      currentRelatedProducts.value = await ProductService.getRelatedProducts(uuid)
    } catch (error: any) {
      toast({
        title: 'Error fetching related products',
        description: error.message || 'An error occurred while fetching related products.',
        variant: 'destructive',
      })
      throw error
    }
  }

  const syncRelatedProducts = async (uuid: string, productIds: string[]): Promise<void> => {
    try {
      const payload: SyncRelatedProductRequest = { product_ids: productIds }
      await ProductService.syncRelatedProducts(uuid, payload)
      toast({
        title: '✅ Related products updated',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error syncing related products',
        description: error.message || 'An error occurred while syncing related products.',
        variant: 'destructive',
      })
      throw error
    }
  }

  const getProductAttributes = async (uuid: string): Promise<void> => {
    try {
      currentProductAttributes.value = await ProductService.getProductAttributes(uuid)
    } catch (error: any) {
      toast({
        title: 'Error fetching product attributes',
        description: error.message || 'An error occurred while fetching product attributes.',
        variant: 'destructive',
      })
      throw error
    }
  }

  const syncProductAttributes = async (
    uuid: string,
    attributeValueIds: string[],
  ): Promise<void> => {
    try {
      const payload = { attribute_value_ids: attributeValueIds }
      await ProductService.syncProductAttributes(uuid, payload)
      toast({
        title: '✅ Product attributes updated',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error syncing product attributes',
        description: error.message || 'An error occurred while syncing product attributes.',
        variant: 'destructive',
      })
      throw error
    }
  }

  return {
    // state
    isLoading,
    products,
    currentProduct,
    currentProductMedium,
    currentRelatedProducts,
    currentProductAttributes,
    // methods
    createProduct,
    updateProduct,
    getProducts,
    getProductById,
    getProductsWithMedium,
    getRelatedProducts,
    syncRelatedProducts,
    getProductAttributes,
    syncProductAttributes,
  }
})
