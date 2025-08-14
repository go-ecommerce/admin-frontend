import type {
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
