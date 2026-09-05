<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { Eye } from 'lucide-vue-next'

import { h } from 'vue'
import { RouterLink } from 'vue-router'

import DataTable from '@/components/data-table/DataTable.vue'
import DataTableColumnHeader from '@/components/data-table/DataTableColumnHeader.vue'
import {
  formatOrderDate,
  formatOrderMoney,
  orderStatusClass,
  orderStatusLabel,
  paymentStatusClass,
  paymentStatusLabel,
} from '@/utils/order'
import type { IOrderResponse } from '@/utils/types/api/apiGo'
import type { AdminOrderResponse } from '@/utils/types/api/generatedApiGo'

defineProps<{
  params: {
    page: number
    pageSize: number
  }
  orders: IOrderResponse
  isLoading: boolean
}>()

const statusBadge = (value: string | undefined, kind: 'order' | 'payment') => {
  const label = kind === 'order' ? orderStatusLabel(value) : paymentStatusLabel(value)
  const klass = kind === 'order' ? orderStatusClass(value) : paymentStatusClass(value)
  return h('span', { class: `text-xs px-2 py-0.5 rounded-full ${klass}` }, label)
}

const columns: ColumnDef<AdminOrderResponse>[] = [
  {
    accessorKey: 'number',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: '№' }),
    cell: ({ row }) =>
      h(
        RouterLink,
        {
          to: { name: 'order-detail', params: { number: row.original.number } },
          class: 'font-medium hover:underline',
        },
        () => `#${row.original.number}`,
      ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Дата' }),
    cell: ({ row }) => h('div', { class: 'text-sm' }, formatOrderDate(row.original.created_at)),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Покупатель' }),
    cell: ({ row }) =>
      h('div', { class: 'min-w-40' }, [
        h('div', { class: 'text-sm truncate' }, row.original.email || '—'),
        h(
          'div',
          { class: 'text-xs text-muted-foreground truncate' },
          row.original.phone || row.original.shipping?.recipient || '',
        ),
      ]),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Статус' }),
    cell: ({ row }) => statusBadge(row.original.status, 'order'),
  },
  {
    accessorKey: 'payment_status',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Оплата' }),
    cell: ({ row }) => statusBadge(row.original.payment_status, 'payment'),
  },
  {
    accessorKey: 'grand_total',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Сумма' }),
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-sm font-medium' },
        formatOrderMoney(row.original.grand_total, row.original.currency),
      ),
  },
  {
    id: 'actions',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: '', class: 'text-right' }),
    cell: ({ row }) =>
      h(
        RouterLink,
        {
          to: { name: 'order-detail', params: { number: row.original.number } },
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
    :data="orders.items ?? []"
    :total-items="orders.pagination.total ?? 0"
  />
</template>
