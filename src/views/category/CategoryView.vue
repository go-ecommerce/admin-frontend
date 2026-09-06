<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { PlusCircle } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { h, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import DataTable from '@/components/data-table/DataTable.vue'
import DataTableColumnHeader from '@/components/data-table/DataTableColumnHeader.vue'
import DataTableRowActions from '@/components/data-table/DataTableRowActions.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { useCategoryStore } from '@/stores/category'
import type { ICategoryRequest } from '@/utils/types/api/apiGo.ts'
import type { CategoryResponse } from '@/utils/types/api/generatedApiGo'

const { categories, isLoading } = storeToRefs(useCategoryStore())
const { getCategories, setCategoryEnabled } = useCategoryStore()

const router = useRouter()

const params = ref({
  page: 1,
  pageSize: 10,
})

const togglingId = ref<string | null>(null)

const onToggleEnabled = async (category: CategoryResponse, value: boolean) => {
  if (!category.id) return
  togglingId.value = category.id
  try {
    await setCategoryEnabled(category, value)
  } finally {
    togglingId.value = null
  }
}

const columns: ColumnDef<CategoryResponse>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:checked': (value: any) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
        class: 'translate-y-0.5',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (value: any) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
        class: 'translate-y-0.5',
      }),
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
    accessorKey: 'is_enabled',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Status' }),
    cell: ({ row }) =>
      h(Switch, {
        checked: Boolean(row.original.is_enabled),
        disabled: togglingId.value === row.original.id,
        'onUpdate:checked': (value: boolean) => onToggleEnabled(row.original, value),
      }),
  },
  {
    id: 'actions',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: 'Actions', class: 'text-right' }),
    cell: ({ row }) =>
      h(DataTableRowActions, {
        row,
        class: 'justify-end',
        editUrlName: 'category-edit',
      }),
  },
]

const fetchCategories = async () => {
  const payload: ICategoryRequest = { page: params.value.page, page_size: params.value.pageSize }
  await getCategories(payload)
}


watch(params, fetchCategories, { deep: true, immediate: true })
</script>

<template>
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Manage product categories.</CardDescription>
          </div>
          <Button size="sm" class="h-7 gap-1" @click="router.push({ name: 'category-create' })">
            <PlusCircle class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Category</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          v-model:page="params.page"
          v-model:page-size="params.pageSize"
          :columns="columns"
          :is-loading="isLoading"
          :data="categories?.items ?? []"
          :total-items="categories?.pagination.total ?? 0"
        />
      </CardContent>
    </Card>
  </main>
</template>
