<script setup lang="ts">
import { CornerUpLeft, RotateCcw, Trash2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/toast/use-toast'
import { useReviewStore } from '@/stores/review'
import {
  REVIEW_STATUSES,
  formatReviewDate,
  formatReviewRating,
  reviewStatusClass,
  reviewStatusLabel,
} from '@/utils/review'
import type { ReviewStatusTarget } from '@/utils/review'
import type { UpdateProductReviewStatusRequest } from '@/utils/types/api/generatedApiGo'

const route = useRoute()
const router = useRouter()
const { toast } = useToast()
const reviewStore = useReviewStore()
const { currentReview, isLoading } = storeToRefs(reviewStore)
const { getReviewById, updateReviewStatus, deleteReview, restoreReview } = reviewStore

const reviewId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : raw
})

const nextStatus = ref<ReviewStatusTarget | ''>('')
const isDeleted = computed(() => Boolean(currentReview.value?.deleted_at))

const resetStatusForm = () => {
  const current = currentReview.value?.status
  const fallback = (REVIEW_STATUSES as readonly string[]).includes(String(current))
    ? (current as ReviewStatusTarget)
    : 'PENDING'
  nextStatus.value = fallback
}

const loadReview = async () => {
  if (!reviewId.value) {
    toast({
      title: 'Ошибка',
      description: 'Некорректный идентификатор отзыва',
      variant: 'destructive',
    })
    await router.push({ name: 'product-review' })
    return
  }
  try {
    await getReviewById(reviewId.value)
    resetStatusForm()
  } catch {
    await router.push({ name: 'product-review' })
  }
}

watch(reviewId, loadReview, { immediate: true })

const saveStatus = async () => {
  if (!nextStatus.value || !currentReview.value?.id) return
  if (nextStatus.value === currentReview.value.status) {
    toast({ title: 'Статус не изменился' })
    return
  }
  const payload: UpdateProductReviewStatusRequest = {
    status: nextStatus.value,
  }
  try {
    await updateReviewStatus(currentReview.value.id, payload)
    resetStatusForm()
  } catch {
    // toast is shown in the store
  }
}

const onDelete = async () => {
  if (!currentReview.value?.id) return
  try {
    await deleteReview(currentReview.value.id)
  } catch {
    // toast is shown in the store
  }
}

const onRestore = async () => {
  if (!currentReview.value?.id) return
  try {
    await restoreReview(currentReview.value.id)
    resetStatusForm()
  } catch {
    // toast is shown in the store
  }
}
</script>

<template>
  <div class="p-4 sm:px-6 md:gap-8">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          class="h-7 gap-1"
          @click="router.push({ name: 'product-review' })"
        >
          <CornerUpLeft class="h-3.5 w-3.5" />
        </Button>
        <div class="text-2xl font-semibold sr-only sm:not-sr-only sm:whitespace-nowrap">
          Отзыв
        </div>
      </div>
    </div>
  </div>

  <main v-if="currentReview" class="p-4 sm:px-6 sm:py-0 md:gap-8 space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Содержание</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <span
                :class="`text-xs px-2 py-0.5 rounded-full ${reviewStatusClass(currentReview.status)}`"
              >
                {{ reviewStatusLabel(currentReview.status) }}
              </span>
              <span class="text-sm font-medium tabular-nums">
                {{ formatReviewRating(currentReview.rating) }}
              </span>
              <span
                v-if="isDeleted"
                class="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                Удалён
              </span>
            </div>
            <div>
              <div class="text-lg font-medium">{{ currentReview.title || 'Без заголовка' }}</div>
              <p class="mt-2 text-sm whitespace-pre-wrap text-muted-foreground">
                {{ currentReview.body || 'Текст отзыва отсутствует' }}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Связи</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <div class="text-muted-foreground">Вариант товара</div>
              <div class="break-all font-mono text-xs">{{ currentReview.variant_id || '—' }}</div>
            </div>
            <div>
              <div class="text-muted-foreground">Пользователь</div>
              <div class="break-all font-mono text-xs">{{ currentReview.user_id || '—' }}</div>
            </div>
            <div>
              <div class="text-muted-foreground">Заказ</div>
              <div class="break-all font-mono text-xs">{{ currentReview.order_id || '—' }}</div>
            </div>
            <div>
              <div class="text-muted-foreground">ID отзыва</div>
              <div class="break-all font-mono text-xs">{{ currentReview.id || '—' }}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Модерация</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="text-sm space-y-1">
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">Создан</span>
                <span>{{ formatReviewDate(currentReview.created_at) }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted-foreground">Обновлён</span>
                <span>{{ formatReviewDate(currentReview.updated_at) }}</span>
              </div>
              <div v-if="isDeleted" class="flex justify-between gap-2">
                <span class="text-muted-foreground">Удалён</span>
                <span>{{ formatReviewDate(currentReview.deleted_at) }}</span>
              </div>
            </div>

            <form class="grid gap-3 pt-2 border-t" @submit.prevent="saveStatus">
              <div class="grid gap-1.5">
                <Label>Статус</Label>
                <Select v-model="nextStatus">
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="item in REVIEW_STATUSES" :key="item" :value="item">
                      {{ reviewStatusLabel(item) }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" :disabled="isLoading || !nextStatus || isDeleted">
                Обновить статус
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Действия</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              v-if="isDeleted"
              variant="outline"
              class="w-full gap-2"
              :disabled="isLoading"
              @click="onRestore"
            >
              <RotateCcw class="h-4 w-4" />
              Восстановить
            </Button>
            <AlertDialog v-else>
              <AlertDialogTrigger as-child>
                <Button variant="destructive" class="w-full gap-2" :disabled="isLoading">
                  <Trash2 class="h-4 w-4" />
                  Удалить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить отзыв?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Отзыв будет скрыт из публичного списка. Его можно восстановить позже.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction @click="onDelete">Удалить</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</template>
