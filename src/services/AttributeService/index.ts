import { api } from '@/api/api'
import type {
  IAttributeFindRequest,
  IAttributeGroupFindRequest,
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

export default class AttributeService {
  public static async getApiAttributeGroups(
    payload: IAttributeGroupRequest,
  ): Promise<IAttributeGroupResponse> {
    const { data }: any = await api.get('/attribute-group', payload)
    return data
  }

  public static async getApiAttributeGroupById(id: string): Promise<AttributeGroupResponse> {
    const { data }: any = await api.get(`/attribute-group/${id}`)
    return data
  }

  public static async createApiAttributeGroup(
    payload: CreateAttributeGroupRequest,
  ): Promise<AttributeGroupResponse> {
    const { data }: any = await api.post('/attribute-group', payload)
    return data
  }

  public static async updateApiAttributeGroup(
    id: string,
    payload: UpdateAttributeGroupRequest,
  ): Promise<AttributeGroupResponse> {
    const { data }: any = await api.put(`/attribute-group/${id}`, payload)
    return data
  }

  public static async deleteApiAttributeGroup(id: string): Promise<void> {
    await api.delete(`/attribute-group/${id}`)
  }

  public static async findApiAttributeGroup(
    payload: IAttributeGroupFindRequest,
  ): Promise<IAttributeGroupResponse> {
    const { data }: any = await api.get(`/attribute-group/find`, payload)
    return data
  }

  // Attribute methods
  public static async getApiAttributes(payload: IAttributeRequest): Promise<IAttributeResponse> {
    const { data }: any = await api.get('/attribute', payload)
    return data
  }

  public static async getApiAttributeById(id: string): Promise<AttributeResponse> {
    const { data }: any = await api.get(`/attribute/${id}`)
    return data
  }

  public static async createApiAttribute(
    payload: CreateAttributeRequest,
  ): Promise<AttributeResponse> {
    const { data }: any = await api.post('/attribute', payload)
    return data
  }

  public static async updateApiAttribute(
    id: string,
    payload: CreateAttributeRequest,
  ): Promise<AttributeResponse> {
    const { data }: any = await api.put(`/attribute/${id}`, payload)
    return data
  }

  public static async deleteApiAttribute(id: string): Promise<void> {
    await api.delete(`/attribute/${id}`)
  }

  public static async findApiAttribute(
    payload: IAttributeFindRequest,
  ): Promise<IAttributeResponse> {
    const { data }: any = await api.get(`/attribute/find`, payload)
    return data
  }

  // AttributeValue methods
  public static async getApiAttributeValues(
    payload: IAttributeValueRequest,
  ): Promise<IAttributeValueResponse> {
    const { data }: any = await api.get('/attribute-value', payload)
    return data
  }

  public static async getApiAttributeValuesByAttributeId(
    attributeId: string,
  ): Promise<AttributeValueResponse[]> {
    const { data }: any = await api.get(`/attribute/${attributeId}/values`)
    return data
  }

  public static async getApiAttributeValueById(id: string): Promise<AttributeValueResponse> {
    const { data }: any = await api.get(`/attribute-value/${id}`)
    return data
  }

  public static async createApiAttributeValue(
    payload: CreateAttributeValueRequest,
  ): Promise<AttributeValueResponse> {
    const { data }: any = await api.post('/attribute-value', payload)
    return data
  }

  public static async updateApiAttributeValue(
    id: string,
    payload: UpdateAttributeValueRequest,
  ): Promise<AttributeValueResponse> {
    const { data }: any = await api.put(`/attribute-value/${id}`, payload)
    return data
  }

  public static async deleteApiAttributeValue(id: string): Promise<void> {
    await api.delete(`/attribute-value/${id}`)
  }
}
