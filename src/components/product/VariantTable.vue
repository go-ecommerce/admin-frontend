<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { Pencil } from 'lucide-vue-next'
import { h } from 'vue'
import { useRouter } from 'vue-router'

import DataTable from '@/components/data-table/DataTable.vue'
import DataTableColumnHeader from '@/components/data-table/DataTableColumnHeader.vue'
import { Button } from '@/components/ui/button'
import type { IVariantListResponse } from '@/utils/types/api/apiGo'
import type { ProductVariantListItem } from '@/utils/types/api/generatedApiGo'

defineProps<{
  params: { page: number; pageSize: number }
  variants: IVariantListResponse
  isLoading: boolean
}>()

const router = useRouter()

const fileStorageUrl = import.meta.env.VITE_FILE_STORAGE_URL || ''

const columns: ColumnDef<ProductVariantListItem>[] = [
  {
    id: 'image',
    header: '',
    cell: ({ row }) => {
      const image = row.original.image?.string
      return h('div', { class: 'w-12' }, [
        image
          ? h('img', {
              src: fileStorageUrl + image,
              alt: row.original.name || '',
              class: 'h-10 w-10 object-cover rounded',
            })
          : h('div', { class: 'h-10 w-10 rounded bg-muted' }),
      ])
    },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Name' }),
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('name') ?? '—'),
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Slug' }),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-muted-foreground' }, row.getValue('slug') ?? '—'),
  },
  {
    accessorKey: 'viewed',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Views' }),
    cell: ({ row }) => h('div', { class: 'text-sm' }, row.getValue('viewed') ?? 0),
  },
  {
    accessorKey: 'is_enable',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Status' }),
    cell: ({ row }) => {
      const enabled = row.getValue('is_enable')
      return h(
        'span',
        {
          class: `text-xs px-2 py-0.5 rounded-full ${
            enabled
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-muted text-muted-foreground'
          }`,
        },
        enabled ? 'Active' : 'Disabled',
      )
    },
  },
  {
    id: 'actions',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: 'Actions', class: 'text-right' }),
    cell: ({ row }) =>
      h('div', { class: 'flex justify-end' }, [
        h(
          Button,
          {
            variant: 'ghost',
            size: 'icon',
            class: 'h-8 w-8',
            onClick: () =>
              router.push({
                name: 'product-edit',
                params: { id: row.original.product_id },
              }),
          },
          () => h(Pencil, { class: 'h-4 w-4' }),
        ),
      ]),
  },
]
</script>

<template>
  <DataTable
    v-model:page="params.page"
    v-model:page-size="params.pageSize"
    :columns="columns"
    :is-loading="isLoading"
    :data="variants.items ?? []"
    :total-items="variants.pagination.total ?? 0"
  />
</template>