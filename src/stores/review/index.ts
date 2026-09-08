import { defineStore } from 'pinia'

import { ref } from 'vue'

import { useToast } from '@/components/ui/toast'
import ReviewService from '@/services/ReviewService'
import { extractApiErrorMessage } from '@/utils/apiError'
import type { IProductReviewRequest, IProductReviewResponse } from '@/utils/types/api/apiGo'
import type {
  AdminProductReviewResponse,
  UpdateProductReviewStatusRequest,
} from '@/utils/types/api/generatedApiGo'

const defaultPagination = { page: 1, page_size: 10, total: 0, last_page: 1 }

const defaultReviews: IProductReviewResponse = {
  items: [],
  pagination: { ...defaultPagination },
}

export const useReviewStore = defineStore('review', () => {
  const isLoading = ref(false)
  const reviews = ref<IProductReviewResponse>(defaultReviews)
  const currentReview = ref<AdminProductReviewResponse | null>(null)
  const { toast } = useToast()

  const getReviews = async (payload: IProductReviewRequest): Promise<void> => {
    try {
      isLoading.value = true
      reviews.value = await ReviewService.getReviews(payload)
    } catch (error: unknown) {
      toast({
        title: 'Не удалось загрузить отзывы',
        description: extractApiErrorMessage(error, 'Ошибка при загрузке списка отзывов'),
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getReviewById = async (id: string): Promise<void> => {
    try {
      isLoading.value = true
      currentReview.value = await ReviewService.getReviewById(id)
    } catch (error: unknown) {
      toast({
        title: 'Не удалось загрузить отзыв',
        description: extractApiErrorMessage(error, 'Ошибка при загрузке отзыва'),
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateReviewStatus = async (
    id: string,
    payload: UpdateProductReviewStatusRequest,
  ): Promise<AdminProductReviewResponse> => {
    try {
      isLoading.value = true
      const updated = await ReviewService.updateReviewStatus(id, payload)
      currentReview.value = updated
      reviews.value = {
        ...reviews.value,
        items: reviews.value.items.map((item) => (item.id === updated.id ? updated : item)),
      }
      toast({ title: '✅ Статус отзыва обновлён', variant: 'success' })
      return updated
    } catch (error: unknown) {
      toast({
        title: 'Не удалось обновить статус',
        description: extractApiErrorMessage(error, 'Ошибка при смене статуса отзыва'),
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteReview = async (id: string): Promise<void> => {
    try {
      isLoading.value = true
      await ReviewService.deleteReview(id)
      if (currentReview.value?.id === id) {
        currentReview.value = {
          ...currentReview.value,
          deleted_at: currentReview.value.deleted_at || new Date().toISOString(),
        }
      }
      toast({ title: '✅ Отзыв удалён', variant: 'success' })
    } catch (error: unknown) {
      toast({
        title: 'Не удалось удалить отзыв',
        description: extractApiErrorMessage(error, 'Ошибка при удалении отзыва'),
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const restoreReview = async (id: string): Promise<AdminProductReviewResponse> => {
    try {
      isLoading.value = true
      const restored = await ReviewService.restoreReview(id)
      currentReview.value = restored
      reviews.value = {
        ...reviews.value,
        items: reviews.value.items.map((item) => (item.id === restored.id ? restored : item)),
      }
      toast({ title: '✅ Отзыв восстановлен', variant: 'success' })
      return restored
    } catch (error: unknown) {
      toast({
        title: 'Не удалось восстановить отзыв',
        description: extractApiErrorMessage(error, 'Ошибка при восстановлении отзыва'),
        variant: 'destructive',
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    reviews,
    currentReview,
    getReviews,
    getReviewById,
    updateReviewStatus,
    deleteReview,
    restoreReview,
  }
})
