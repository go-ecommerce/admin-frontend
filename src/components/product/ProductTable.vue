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
const fileStorageUrl = import.meta.env.VITE_FILE_STORAGE_URL || 'http://localhost:3000/storage/'

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
    accessorKey: 'image', // Adjust this key to match your data property
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Image' }),
    cell: ({ row }) => {
      const imagePath = fileStorageUrl + row.getValue('image')
      return h('div', { class: 'w-20' }, [
        imagePath
          ? h('img', {
              src: imagePath,
              alt: row.getValue('name') || 'Product image',
              class: 'h-12 w-12 object-cover rounded', // Adjust styling as needed
            })
          : h('span', 'No image'),
      ])
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Name' }),
    cell: ({ row }) => h('div', { class: 'w-20' }, row.getValue('name')),
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Slug' }),
    cell: ({ row }) => h('div', { class: 'w-20' }, row.getValue('slug')),
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
