import { api } from '@/api/api'
import type { ICategoriesResponse, ICategoryRequest } from '@/utils/types/api/apiGo.ts'
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/utils/types/api/generatedApiGo'

export default class CategoryService {
  public static async getApiCategories(payload: ICategoryRequest): Promise<ICategoriesResponse> {
    const { data }: any = await api.get('/category', payload)
    return data
  }

  public static async getApiCategoryById(uuid: string): Promise<CategoryResponse> {
    const { data }: any = await api.get(`/category/id/${uuid}`)
    return data
  }

  public static async createApiCategory(payload: CreateCategoryRequest): Promise<CategoryResponse> {
    const { data }: any = await api.post('/category', payload)
    return data
  }

  public static async updateApiCategoryById(
    uuid: string,
    payload: UpdateCategoryRequest,
  ): Promise<CategoryResponse> {
    const { data }: any = await api.put(`/category/${uuid}`, payload)
    return data
  }
}
