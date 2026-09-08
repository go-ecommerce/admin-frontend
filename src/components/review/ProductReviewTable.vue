<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { Eye } from 'lucide-vue-next'

import { h } from 'vue'
import { RouterLink } from 'vue-router'

import DataTable from '@/components/data-table/DataTable.vue'
import DataTableColumnHeader from '@/components/data-table/DataTableColumnHeader.vue'
import {
  formatReviewDate,
  formatReviewRating,
  reviewStatusClass,
  reviewStatusLabel,
  shortId,
} from '@/utils/review'
import type { IProductReviewResponse } from '@/utils/types/api/apiGo'
import type { AdminProductReviewResponse } from '@/utils/types/api/generatedApiGo'

defineProps<{
  params: {
    page: number
    pageSize: number
  }
  reviews: IProductReviewResponse
  isLoading: boolean
}>()

const columns: ColumnDef<AdminProductReviewResponse>[] = [
  {
    accessorKey: 'rating',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Оценка' }),
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-sm font-medium tabular-nums' },
        formatReviewRating(row.original.rating),
      ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Отзыв' }),
    cell: ({ row }) =>
      h('div', { class: 'min-w-48 max-w-80' }, [
        h(
          RouterLink,
          {
            to: { name: 'product-review-detail', params: { id: row.original.id } },
            class: 'text-sm font-medium hover:underline line-clamp-1',
          },
          () => row.original.title || 'Без заголовка',
        ),
        h('div', { class: 'text-xs text-muted-foreground line-clamp-1' }, row.original.body || ''),
      ]),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Статус' }),
    cell: ({ row }) =>
      h(
        'span',
        { class: `text-xs px-2 py-0.5 rounded-full ${reviewStatusClass(row.original.status)}` },
        reviewStatusLabel(row.original.status),
      ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Дата' }),
    cell: ({ row }) => h('div', { class: 'text-sm' }, formatReviewDate(row.original.created_at)),
  },
  {
    accessorKey: 'variant_id',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Вариант' }),
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-xs font-mono text-muted-foreground' },
        shortId(row.original.variant_id),
      ),
  },
  {
    accessorKey: 'user_id',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Пользователь' }),
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-xs font-mono text-muted-foreground' },
        shortId(row.original.user_id),
      ),
  },
  {
    id: 'actions',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: '', class: 'text-right' }),
    cell: ({ row }) =>
      h(
        RouterLink,
        {
          to: { name: 'product-review-detail', params: { id: row.original.id } },
          class: 'inline-flex h-7 items-center gap-1 rounded-md px-2 text-sm hover:bg-accent',
        },
        () => [h(Eye, { class: 'h-3.5 w-3.5' }), 'Открыть'],
      ),
  },
]
</script>

<template>
  <DataTable
    v-model:page="params.page"
    v-model:page-size="params.pageSize"
    :columns="columns"
    :is-loading="isLoading"
    :data="reviews.items ?? []"
    :total-items="reviews.pagination.total ?? 0"
  />
</template>
