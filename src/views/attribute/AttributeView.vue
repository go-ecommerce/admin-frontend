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
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useAttributeStore } from '@/stores/attribute'
import type {
  IAttributeGroupRequest,
  IAttributeRequest,
  ICollectionRequest,
} from '@/utils/types/api/apiGo.ts'

const { attributes, isLoading } = storeToRefs(useAttributeStore())
const { getAttributes, deleteAttribute } = useAttributeStore()

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
    accessorKey: 'value',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Value' }),

    cell: ({ row }) => h('div', { class: 'w-20' }, row.getValue('value')),
  },
  {
    id: 'actions',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: 'Actions', class: 'text-right' }),
    cell: ({ row }) =>
      h(DataTableRowActions, {
        row,
        class: 'justify-end',
        editUrlName: 'attribute-edit',
        onDelete: handleDelete,
      }),
  },
]

const fetchAttributes = async () => {
  const payload: IAttributeRequest = {
    page: params.value.page,
    page_size: params.value.pageSize,
  }
  await getAttributes(payload)
}

const handleDelete = async (id: string) => {
  await deleteAttribute(id)
  await fetchAttributes()
}

watch(params.value, fetchAttributes, { immediate: true })

onMounted(async () => {
  await fetchAttributes()
})
</script>

<style scoped></style>

<template>
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Tabs default-value="all">
      <div class="flex items-center">
        <div class="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            class="h-7 gap-1"
            @click="router.push({ name: 'attribute-create' })"
          >
            <PlusCircle class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add Attribute </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Attributes</CardTitle>
            <CardDescription> Manage your Attributes. </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              v-model:page="params.page"
              v-model:page-size="params.pageSize"
              :columns="columns"
              :is-loading="isLoading"
              :data="attributes?.items ?? []"
              :total-items="attributes?.pagination.total ?? 0"
            />
          </CardContent>
          <CardFooter>
            <div class="text-xs text-muted-foreground">
              Showing
              <strong>{{ attributes?.pagination?.total }}</strong> of attribute groups
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </main>
</template>
