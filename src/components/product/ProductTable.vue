<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'

import { h } from 'vue'

import DataTable from '@/components/data-table/DataTable.vue'
import DataTableColumnHeader from '@/components/data-table/DataTableColumnHeader.vue'
import DataTableRowActions from '@/components/data-table/DataTableRowActions.vue'
import { Checkbox } from '@/components/ui/checkbox'
import type { IProductResponse } from '@/utils/types/api/apiGo'

defineProps<{
  params: {
    page: number
    pageSize: number
  }
  products: IProductResponse
  isLoading: boolean
}>()

const columns: ColumnDef<any>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:checked': (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
        class: 'translate-y-0.5',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (value) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
        class: 'translate-y-0.5',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'model',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Model' }),
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('model') ?? '—'),
  },
  {
    accessorKey: 'sku',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'SKU' }),
    cell: ({ row }) => h('div', { class: 'text-sm text-muted-foreground' }, row.getValue('sku') ?? '—'),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Price' }),
    cell: ({ row }) => h('div', {}, row.getValue('price') ?? '—'),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Qty' }),
    cell: ({ row }) => h('div', {}, row.getValue('quantity') ?? '—'),
  },
  {
    accessorKey: 'stock_status',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Stock' }),
    cell: ({ row }) => {
      const status = row.getValue('stock_status') as string
      const map: Record<string, { label: string; class: string }> = {
        IN_STOCK:   { label: 'In Stock',   class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
        PRE_ORDER:  { label: 'Pre-Order',  class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
        OUT_OF_STOCK: { label: 'Out of Stock', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      }
      const s = map[status] ?? { label: status ?? '—', class: 'bg-muted text-muted-foreground' }
      return h('span', { class: `text-xs px-2 py-0.5 rounded-full ${s.class}` }, s.label)
    },
  },
  {
    accessorKey: 'is_enable',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Status' }),
    cell: ({ row }) => {
      const enabled = row.getValue('is_enable')
      return h('span', {
        class: `text-xs px-2 py-0.5 rounded-full ${enabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`
      }, enabled ? 'Active' : 'Disabled')
    },
  },

  {
    id: 'actions',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: 'Actions', class: 'text-right' }),
    cell: ({ row }) =>
      h(DataTableRowActions, { row, class: 'justify-end', editUrlName: 'product-edit' }),
  },
]
</script>
<template>
  <DataTable
    v-model:page="params.page"
    v-model:page-size="params.pageSize"
    :columns="columns"
    :is-loading="isLoading"
    :data="products.items ?? []"
    :total-items="products.pagination.total ?? 0"
  />
</template>
