import { defineStore } from 'pinia'

import { ref } from 'vue'

import { useToast } from '@/components/ui/toast'
import ProductService from '@/services/ProductService'
import type { IProductRequest, IProductResponse, IVariantListResponse, ProductAttributesResponse } from '@/utils/types/api/apiGo.ts'
import type {
  CreateProductRequest,
  CreateProductVariantRequest,
  MediumResponse,
  ProductResponse,
  ProductVariantResponse,
  UpdateProductRequest,
  UpdateProductVariantRequest,
  ShortProduct,
  SyncRelatedProductRequest,
} from '@/utils/types/api/generatedApiGo'

const defaultPagination = { page: 1, page_size: 10, total: 0, last_page: 1 }

const defaultDataProducts: IProductResponse = {
  items: [],
  pagination: { ...defaultPagination },
}

const defaultDataVariants: IVariantListResponse = {
  items: [],
  pagination: { ...defaultPagination },
}

export const useProductStore = defineStore('product', () => {
  const isLoading = ref<boolean>(true)
  const products = ref<IProductResponse>(defaultDataProducts)
  const allVariants = ref<IVariantListResponse>(defaultDataVariants)
  const currentProduct = ref<ProductResponse | null>(null)
  const currentProductMedium = ref<MediumResponse[]>([])
  const currentRelatedProducts = ref<ShortProduct[]>([])
  const currentProductAttributes = ref<ProductAttributesResponse | null>(null)
  const currentProductVariants = ref<ProductVariantResponse[]>([])
  const productsWithoutVariantsCount = ref<number>(0)
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

  const fetchProductsWithoutVariantsCount = async (): Promise<void> => {
    try {
      const result = await ProductService.getProductsWithoutVariants({ page: 1, page_size: 1 })
      productsWithoutVariantsCount.value = result.pagination.total ?? 0
    } catch {
      productsWithoutVariantsCount.value = 0
    }
  }

  const getProductsWithoutVariants = async (payload: IProductRequest): Promise<void> => {
    try {
      isLoading.value = true
      products.value = await ProductService.getProductsWithoutVariants(payload)
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

  const syncRelatedProducts = async (uuid: string, variantIds: string[]): Promise<void> => {
    try {
      const payload: SyncRelatedProductRequest = { variant_ids: variantIds }
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

  const getAllVariants = async (payload: IProductRequest): Promise<void> => {
    try {
      isLoading.value = true
      allVariants.value = await ProductService.getAllVariants(payload)
    } catch (error: any) {
      toast({
        title: 'Error fetching variants',
        description: error.message || 'An error occurred while fetching variants.',
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getProductVariants = async (productId: string): Promise<void> => {
    try {
      currentProductVariants.value = await ProductService.getProductVariants(productId)
    } catch (error: any) {
      toast({
        title: 'Error fetching variants',
        description: error.message || 'An error occurred while fetching variants.',
        variant: 'destructive',
      })
      throw error
    }
  }

  const createProductVariant = async (
    productId: string,
    request: CreateProductVariantRequest,
  ): Promise<ProductVariantResponse> => {
    try {
      const variant = await ProductService.createProductVariant(productId, request)
      currentProductVariants.value.push(variant)
      toast({ title: '✅ Вариант создан', variant: 'success' })
      return variant
    } catch (error: any) {
      toast({
        title: 'Error creating variant',
        description: error.message || 'An error occurred while creating variant.',
        variant: 'destructive',
      })
      throw error
    }
  }

  const updateProductVariant = async (
    productId: string,
    variantId: string,
    request: UpdateProductVariantRequest,
  ): Promise<void> => {
    try {
      const updated = await ProductService.updateProductVariant(productId, variantId, request)
      const idx = currentProductVariants.value.findIndex((v) => v.id === variantId)
      if (idx !== -1) currentProductVariants.value[idx] = updated
      toast({ title: '✅ Вариант обновлён', variant: 'success' })
    } catch (error: any) {
      toast({
        title: 'Error updating variant',
        description: error.message || 'An error occurred while updating variant.',
        variant: 'destructive',
      })
      throw error
    }
  }

  const deleteProductVariant = async (productId: string, variantId: string): Promise<void> => {
    try {
      await ProductService.deleteProductVariant(productId, variantId)
      currentProductVariants.value = currentProductVariants.value.filter((v) => v.id !== variantId)
      toast({ title: '✅ Вариант удалён', variant: 'success' })
    } catch (error: any) {
      toast({
        title: 'Error deleting variant',
        description: error.message || 'An error occurred while deleting variant.',
        variant: 'destructive',
      })
      throw error
    }
  }

  return {
    // state
    isLoading,
    products,
    allVariants,
    productsWithoutVariantsCount,
    currentProduct,
    currentProductMedium,
    currentRelatedProducts,
    currentProductAttributes,
    currentProductVariants,
    // methods
    getAllVariants,
    getProductsWithoutVariants,
    fetchProductsWithoutVariantsCount,
    createProduct,
    updateProduct,
    getProducts,
    getProductById,
    getProductsWithMedium,
    getRelatedProducts,
    syncRelatedProducts,
    getProductAttributes,
    syncProductAttributes,
    getProductVariants,
    createProductVariant,
    updateProductVariant,
    deleteProductVariant,
  }
})
