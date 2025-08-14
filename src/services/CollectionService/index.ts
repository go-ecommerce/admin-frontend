import { api } from '@/api/api'
import type { ICollectionRequest, ICollectionResponse } from '@/utils/types/api/apiGo.ts'
import type {
  CollectionResponse,
  CreateCollectionRequest,
  UpdateCollectionRequest,
} from '@/utils/types/api/generatedApiGo'

export default class CollectionService {
  public static async getApiCollections(payload: ICollectionRequest): Promise<ICollectionResponse> {
    const { data }: any = await api.get('/collection', payload)
    return data
  }

  public static async getApiCollectionById(uuid: string): Promise<CollectionResponse> {
    const { data }: any = await api.get(`/collection/id/${uuid}`)
    return data
  }

  public static async CreateApiCollection(
    payload: CreateCollectionRequest,
  ): Promise<CollectionResponse> {
    const { data }: any = await api.post(`/collection`, payload)
    return data
  }

  public static async UpdateApiCollection(
    uuid: string,
    payload: UpdateCollectionRequest,
  ): Promise<CollectionResponse> {
    const { data }: any = await api.put(`/collection/${uuid}`, payload)
    return data
  }
}
