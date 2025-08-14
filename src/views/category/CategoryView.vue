<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { File, ListFilter, PlusCircle } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { h, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import DataTable from '@/components/data-table/DataTable.vue'
import DataTableColumnHeader from '@/components/data-table/DataTableColumnHeader.vue'
import DataTableRowActions from '@/components/data-table/DataTableRowActions.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCategoryStore } from '@/stores/category'
import type { ICategoryRequest } from '@/utils/types/api/apiGo.ts'

const { categories, isLoading } = storeToRefs(useCategoryStore())
const { getCategories } = useCategoryStore()

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
    accessorKey: 'is_enable',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Status' }),
    cell: ({ row }) =>
      h(Switch, {
        checked: row.getValue('is_enable'),
        'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
      }),
  },
  {
    id: 'actions',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: 'Actions', class: 'text-right' }),
    cell: ({ row }) =>
      h(DataTableRowActions, { row, class: 'justify-end', editUrlName: 'category-edit' }),
  },
]

const fetchCategories = async () => {
  const payload: ICategoryRequest = { page: params.value.page, page_size: params.value.pageSize }
  await getCategories(payload)
}

watch(params.value, fetchCategories, { immediate: true })

onMounted(async () => {
  await fetchCategories()
})
</script>

<template>
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Tabs default-value="all">
      <div class="flex items-center">
        <TabsList>
          <TabsTrigger value="all"> All</TabsTrigger>
          <TabsTrigger value="active"> Active</TabsTrigger>
          <TabsTrigger value="draft"> Draft</TabsTrigger>
          <TabsTrigger value="archived" class="hidden sm:flex"> Archived</TabsTrigger>
        </TabsList>
        <div class="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="sm" class="h-7 gap-1">
                <ListFilter class="h-3.5 w-3.5" />
                <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Filter </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem checked> Active</DropdownMenuItem>
              <DropdownMenuItem>Draft</DropdownMenuItem>
              <DropdownMenuItem> Archived</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" class="h-7 gap-1">
            <File class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Export </span>
          </Button>
          <Button size="sm" class="h-7 gap-1" @click="router.push({ name: 'category-create' })">
            <PlusCircle class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add Category </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Manage your Category and view their sales performance.
            </CardDescription>
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
          <CardFooter>
            <div class="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>{{ categories?.pagination?.total }}</strong>
              products
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </main>
</template>
