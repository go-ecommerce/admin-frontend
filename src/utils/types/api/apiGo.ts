import type {
  AttributeGroupResponse,
  AttributeResponse,
  AttributeValueResponse,
  CategoryResponse,
  CollectionResponse,
  ProductResponse,
} from '@/utils/types/api/generatedApiGo'





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
