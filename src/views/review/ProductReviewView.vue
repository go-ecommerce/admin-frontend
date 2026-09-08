<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ProductReviewTable from '@/components/review/ProductReviewTable.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useReviewStore } from '@/stores/review'
import { REVIEW_STATUSES, reviewStatusLabel } from '@/utils/review'
import type { IProductReviewRequest } from '@/utils/types/api/apiGo'

const reviewStore = useReviewStore()
const { reviews, isLoading } = storeToRefs(reviewStore)
const { getReviews } = reviewStore
const route = useRoute()
const router = useRouter()

const ALL = 'all'
const SORT_OPTIONS = ['asc', 'desc'] as const

const parseStatus = (value: unknown) => {
  const next = String(value || ALL)
  return (REVIEW_STATUSES as readonly string[]).includes(next) ? next : ALL
}

const parseSort = (value: unknown) => {
  const next = String(value || ALL)
  return (SORT_OPTIONS as readonly string[]).includes(next) ? next : ALL
}

const parseWithDeleted = (value: unknown) => value === 'true' || value === true

const params = ref({ page: 1, pageSize: 10 })
const status = ref(parseStatus(route.query.status))
const sortByRating = ref(parseSort(route.query.sort_by_rating))
const withDeleted = ref(parseWithDeleted(route.query.with_deleted))

const fetchReviews = async () => {
  const payload: IProductReviewRequest = {
    page: params.value.page,
    page_size: params.value.pageSize,
  }
  if (status.value !== ALL) payload.status = status.value
  if (sortByRating.value !== ALL) {
    payload.sort_by_rating = sortByRating.value as 'asc' | 'desc'
  }
  if (withDeleted.value) payload.with_deleted = true
  try {
    await getReviews(payload)
  } catch {
    // toast is shown in the store
  }
}

const syncQuery = () => {
  const query: Record<string, string> = {}
  if (status.value !== ALL) query.status = status.value
  if (sortByRating.value !== ALL) query.sort_by_rating = sortByRating.value
  if (withDeleted.value) query.with_deleted = 'true'
  router.replace({ name: 'product-review', query })
}

watch([params, status, sortByRating, withDeleted], fetchReviews, { immediate: true, deep: true })

watch(
  () => [route.query.status, route.query.sort_by_rating, route.query.with_deleted],
  () => {
    status.value = parseStatus(route.query.status)
    sortByRating.value = parseSort(route.query.sort_by_rating)
    withDeleted.value = parseWithDeleted(route.query.with_deleted)
  },
)

const onStatusChange = (value: unknown) => {
  status.value = parseStatus(value)
  params.value.page = 1
  syncQuery()
}

const onSortChange = (value: unknown) => {
  sortByRating.value = parseSort(value)
  params.value.page = 1
  syncQuery()
}

const onWithDeletedChange = (value: unknown) => {
  withDeleted.value = value === 'true'
  params.value.page = 1
  syncQuery()
}

const resetFilters = () => {
  status.value = ALL
  sortByRating.value = ALL
  withDeleted.value = false
  params.value.page = 1
  syncQuery()
}

const hasFilters = computed(
  () => status.value !== ALL || sortByRating.value !== ALL || withDeleted.value,
)
</script>

<template>
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Card>
      <CardHeader>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Отзывы</CardTitle>
            <CardDescription>Модерация отзывов на товары. Фильтры необязательны.</CardDescription>
          </div>
          <div class="flex flex-wrap items-end gap-3">
            <div class="grid gap-1.5">
              <Label class="text-xs text-muted-foreground">Статус</Label>
              <Select :model-value="status" @update:model-value="onStatusChange">
                <SelectTrigger class="w-[180px] h-8">
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="ALL">Все статусы</SelectItem>
                  <SelectItem v-for="item in REVIEW_STATUSES" :key="item" :value="item">
                    {{ reviewStatusLabel(item) }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-1.5">
              <Label class="text-xs text-muted-foreground">Оценка</Label>
              <Select :model-value="sortByRating" @update:model-value="onSortChange">
                <SelectTrigger class="w-[180px] h-8">
                  <SelectValue placeholder="Без сортировки" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="ALL">Без сортировки</SelectItem>
                  <SelectItem value="desc">Сначала высокие</SelectItem>
                  <SelectItem value="asc">Сначала низкие</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-1.5">
              <Label class="text-xs text-muted-foreground">Удалённые</Label>
              <Select
                :model-value="withDeleted ? 'true' : 'false'"
                @update:model-value="onWithDeletedChange"
              >
                <SelectTrigger class="w-[160px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Скрыть</SelectItem>
                  <SelectItem value="true">Показать</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              v-if="hasFilters"
              variant="ghost"
              size="sm"
              class="h-8"
              @click="resetFilters"
            >
              Сбросить
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ProductReviewTable :params="params" :reviews="reviews" :is-loading="isLoading" />
      </CardContent>
      <CardFooter>
        <div class="text-xs text-muted-foreground">
          Всего: <strong>{{ reviews.pagination.total ?? 0 }}</strong> отзывов
        </div>
      </CardFooter>
    </Card>
  </main>
</template>
