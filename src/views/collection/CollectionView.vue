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
import { useCollectionStore } from '@/stores/collection'
import type { ICollectionRequest } from '@/utils/types/api/apiGo.ts'

const { collections, isLoading } = storeToRefs(useCollectionStore())
const { getCollections } = useCollectionStore()

const router = useRouter()

const params = ref({
  page: 1,
  pageSize: 10,
})

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
      h(DataTableRowActions, { row, class: 'justify-end', editUrlName: 'collection-edit' }),
  },
]

const fetchCollections = async () => {
  const payload: ICollectionRequest = { page: params.value.page, page_size: params.value.pageSize }
  await getCollections(payload)
}

watch(params, fetchCollections, { deep: true, immediate: true })
</script>

<style scoped></style>

<template>
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Collections</CardTitle>
            <CardDescription>Manage product collections.</CardDescription>
          </div>
          <Button size="sm" class="h-7 gap-1" @click="router.push({ name: 'collection-create' })">
            <PlusCircle class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Collection</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          v-model:page="params.page"
          v-model:page-size="params.pageSize"
          :columns="columns"
          :is-loading="isLoading"
          :data="collections?.items ?? []"
          :total-items="collections?.pagination.total ?? 0"
        />
      </CardContent>
    </Card>
  </main>
</template>
