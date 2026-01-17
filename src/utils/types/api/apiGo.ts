import type {
  AttributeGroupResponse,
  AttributeResponse,
  AttributeValueResponse,
  CategoryResponse,
  CollectionResponse,
  ProductResponse,
} from '@/utils/types/api/generatedApiGo'

// Product Attributes API response types
export interface ProductAttributeValue {
  id: string
  value: string
  value_normalized?: string
  value_numeric?: string
  display_order?: number
}

export interface ProductAttributeItem {
  id: string
  name: string
  slug: string
  type: string
  unit?: string
  is_filterable?: boolean
  values: ProductAttributeValue[]
}

export interface ProductAttributeGroup {
  group_id: string
  group_name: string
  group_slug: string
  group_description?: string
  attributes: ProductAttributeItem[]
}

export interface ProductAttributesResponse {
  groups: ProductAttributeGroup[]
}





export interface ICategoryRequest {
  page: number
  page_size: number
}

export interface IPagination {
  last_page: number
  page: number
  page_size: number
  total: number
}
export interface ICategoriesResponse {
  items: CategoryResponse[]
  pagination: IPagination
}

export interface ICollectionRequest {
  page: number
  page_size: number
}

export interface ICollectionResponse {
  items: CollectionResponse[]
  pagination: IPagination
}

export interface IProductRequest {
  page: number
  page_size: number
}

export interface IProductResponse {
  items: ProductResponse[]
  pagination: IPagination
}

export interface IAttributeGroupRequest {
  page: number
  page_size: number
}

export interface IAttributeGroupFindRequest {
  attribute: string
  page: number
  page_size: number
}

export interface IAttributeGroupResponse {
  items: AttributeGroupResponse[]
  pagination: IPagination
}

export interface IAttributeRequest {
  page: number
  page_size: number
}

export interface IAttributeFindRequest {
  attribute: string
  page: number
  page_size: number
}

export interface IAttributeResponse {
  items: AttributeResponse[]
  pagination: IPagination
}

export interface IAttributeValueRequest {
  page: number
  page_size: number
  attribute_id?: string
}

export interface IAttributeValueResponse {
  items: AttributeValueResponse[]
  pagination: IPagination
}
