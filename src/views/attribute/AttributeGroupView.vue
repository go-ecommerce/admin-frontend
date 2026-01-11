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
import type { IAttributeGroupRequest, ICollectionRequest } from '@/utils/types/api/apiGo.ts'

const { attributesGroups, isLoading } = storeToRefs(useAttributeStore())
const { getAttributesGroups, deleteAttributeGroup } = useAttributeStore()

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
    accessorKey: 'description',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Description' }),

    cell: ({ row }) => h('div', { class: 'w-20' }, row.getValue('description')),
  },
  {
    id: 'actions',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: 'Actions', class: 'text-right' }),
    cell: ({ row }) =>
      h(DataTableRowActions, {
        row,
        class: 'justify-end',
        editUrlName: 'attribute-group-edit',
        onDelete: handleDelete,
      }),
  },
]

const fetchAttributeGroups = async () => {
  const payload: IAttributeGroupRequest = {
    page: params.value.page,
    page_size: params.value.pageSize,
  }
  await getAttributesGroups(payload)
}

const handleDelete = async (id: string) => {
  await deleteAttributeGroup(id)
  await fetchAttributeGroups()
}

watch(params.value, fetchAttributeGroups, { immediate: true })

onMounted(async () => {
  await fetchAttributeGroups()
})
</script>

<style scoped></style>

<template>
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Tabs default-value="all">
      <div class="flex items-center">
        <div class="ml-auto flex items-center gap2">
          <Button
            size="sm"
            class="h-7 gap-1"
            @click="router.push({ name: 'attribute-group-create' })"
          >
            <PlusCircle class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add Attribute group </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Attribute Groups</CardTitle>
            <CardDescription> Manage your Attribute groups. </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              v-model:page="params.page"
              v-model:page-size="params.pageSize"
              :columns="columns"
              :is-loading="isLoading"
              :data="attributesGroups?.items ?? []"
              :total-items="attributesGroups?.pagination.total ?? 0"
            />
          </CardContent>
          <CardFooter>
            <div class="text-xs text-muted-foreground">
              Showing
              <strong>{{ attributesGroups?.pagination?.total }}</strong> of attribute groups
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </main>
</template>
