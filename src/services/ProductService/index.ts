import { api } from '@/api/api'
import type { IProductRequest, IProductResponse, IVariantListResponse, ProductAttributesResponse } from '@/utils/types/api/apiGo.ts'
import type {
  CategoryResponse,
  CreateProductRequest,
  CreateProductVariantRequest,
  ProductResponse,
  ProductVariantResponse,
  ProductWithMediumResponse,
  UpdateProductRequest,
  UpdateProductVariantRequest,
  SyncRelatedProductRequest,
  ShortProduct,
} from '@/utils/types/api/generatedApiGo'

export default class ProductService {
  public static async getProducts(payload: IProductRequest): Promise<IProductResponse> {
    const { data }: any = await api.get('/product', payload)
    return data
  }

  public static async getProductsWithoutVariants(payload: IProductRequest): Promise<IProductResponse> {
    const { data }: any = await api.get('/product/list/without-variants', payload)
    return data
  }

  public static async getProductById(uuid: string): Promise<ProductResponse> {
    const { data }: any = await api.get(`/product/id/${uuid}`)
    return data
  }

  public static async getProductWithMediumById(uuid: string): Promise<ProductWithMediumResponse> {
    const { data }: any = await api.get(`/product/id/${uuid}/with-media`)
    return data
  }

  public static async createApiProduct(payload: CreateProductRequest): Promise<ProductResponse> {
    const { data }: any = await api.post(`/product`, payload)
    return data
  }

  public static async findProduct(query: String): Promise<ProductResponse[]> {
    const { data }: any = await api.get(`/product/find`, {
      product: query,
    })
    return data
  }

  public static async updateApiProduct(
    uuid: string,
    payload: UpdateProductRequest,
  ): Promise<ProductResponse> {
    const { data }: any = await api.put(`/product/${uuid}`, payload)
    return data
  }

  public static async syncRelatedProducts(
    uuid: string,
    payload: SyncRelatedProductRequest,
  ): Promise<void> {
    await api.post(`/product/variant/${uuid}/sync-related-products`, payload)
  }

  public static async getRelatedProducts(uuid: string): Promise<ShortProduct[]> {
    const { data }: any = await api.get(`/product/variant/${uuid}/related-products`)
    return data
  }

  public static async getRelatedProductsBatch(
    variantIds: string[],
  ): Promise<Record<string, ShortProduct[]>> {
    const { data }: any = await api.post(`/product/variant/related-products/batch`, {
      variant_ids: variantIds,
    })
    return data
  }

  public static async syncProductAttributes(
    uuid: string,
    payload: { attribute_value_ids: string[] },
  ): Promise<void> {
    await api.post(`/product/${uuid}/sync-attribute`, payload)
  }

  public static async getProductAttributes(uuid: string): Promise<ProductAttributesResponse> {
    const { data }: any = await api.get(`/product/id/${uuid}/attributes`)
    return data.data || data
  }

  public static async getAllVariants(payload: IProductRequest): Promise<IVariantListResponse> {
    const { data }: any = await api.get('/product/variant/list', payload)
    return data
  }

  public static async getProductVariants(productId: string): Promise<ProductVariantResponse[]> {
    const { data }: any = await api.get(`/product/${productId}/variants`)
    return data
  }

  public static async createProductVariant(
    productId: string,
    payload: CreateProductVariantRequest,
  ): Promise<ProductVariantResponse> {
    const { data }: any = await api.post(`/product/${productId}/variants`, payload)
    return data
  }

  public static async updateProductVariant(
    productId: string,
    variantId: string,
    payload: UpdateProductVariantRequest,
  ): Promise<ProductVariantResponse> {
    const { data }: any = await api.put(`/product/${productId}/variants/${variantId}`, payload)
    return data
  }

  public static async deleteProductVariant(
    productId: string,
    variantId: string,
  ): Promise<void> {
    await api.delete(`/product/${productId}/variants/${variantId}`)
  }

  public static async getVariantCategories(variantId: string): Promise<CategoryResponse[]> {
    const { data }: any = await api.get(`/product/variant/${variantId}/categories`)
    return (data ?? []).map((item: any) => ({
      id: item.category_id,
      name: item.category_name,
      slug: item.category_slug,
      is_enabled: item.category_is_enable,
    }))
  }

  public static async syncVariantCategories(
    variantId: string,
    categoryIds: string[],
  ): Promise<void> {
    await api.post(`/product/variant/${variantId}/sync-categories`, { category_ids: categoryIds })
  }

  public static async getVariantCategoriesBatch(
    variantIds: string[],
  ): Promise<Record<string, CategoryResponse[]>> {
    console.log('Fetching categories for variant IDs:', variantIds)
    const results: Record<string, CategoryResponse[]> = {}
    await Promise.all(
      variantIds.map(async (id) => {
        try {
          results[id] = await ProductService.getVariantCategories(id)
        } catch {
          results[id] = []
        }
      }),
    )
    return results
  }
}
