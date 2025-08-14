import { api } from '@/api/api'
import type { MediumResponse } from '@/utils/types/api/generatedApiGo'

export default class MediaService {
  public static async uploadFile(file: File): Promise<MediumResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const { data }: any = await api.uploadFile('/media/upload', formData)
    return data
  }
  public static async deleteFile(uuid: string): Promise<void> {
    await api.delete(`/media/${uuid}`)
  }
}
