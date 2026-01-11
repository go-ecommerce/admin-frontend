<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { PlusCircle } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { h, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useAttributeStore } from '@/stores/attribute'

const { attributeValues, isLoading } = storeToRefs(useAttributeStore())
const { getAttributeValuesByAttributeId, deleteAttributeValue } = useAttributeStore()

const router = useRouter()
const route = useRoute()

const attributeId = typeof route.query.attribute_id === 'string' ? route.query.attribute_id : undefined

// Params for UI pagination (client-side since API returns all values)
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
    accessorKey: 'value',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Value' }),
    cell: ({ row }) => h('div', { class: 'w-20' }, row.getValue('value')),
  },
  {
    accessorKey: 'value_numeric',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Numeric' }),
    cell: ({ row }) => h('div', { class: 'w-20' }, row.getValue('value_numeric') || '—'),
  },
  {
    accessorKey: 'display_order',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Order' }),
    cell: ({ row }) => h('div', { class: 'w-16' }, row.getValue('display_order')),
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Active' }),
    cell: ({ row }) =>
      h('div', { class: 'w-16' }, row.getValue('is_active') ? '✓' : '✗'),
  },
  {
    id: 'actions',
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: 'Actions', class: 'text-right' }),
    cell: ({ row }) =>
      h(DataTableRowActions, {
        row,
        class: 'justify-end',
        editUrlName: 'attribute-value-edit',
        onDelete: handleDelete,
      }),
  },
]

const fetchAttributeValues = async () => {
  if (!attributeId) {
    console.warn('No attribute_id provided')
    return
  }
  await getAttributeValuesByAttributeId(attributeId)
}

const handleDelete = async (id: string) => {
  await deleteAttributeValue(id)
  await fetchAttributeValues()
}

watch(() => route.query.attribute_id, fetchAttributeValues, { immediate: true })

onMounted(async () => {
  await fetchAttributeValues()
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
            @click="
              router.push({
                name: 'attribute-value-create',
                query: { attribute_id: attributeId },
              })
            "
          >
            <PlusCircle class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add Value </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Attribute Values</CardTitle>
            <CardDescription> Manage attribute values. </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              v-model:page="params.page"
              v-model:page-size="params.pageSize"
              :columns="columns"
              :is-loading="isLoading"
              :data="attributeValues?.items ?? []"
              :total-items="attributeValues?.pagination.total ?? 0"
            />
          </CardContent>
          <CardFooter>
            <div class="text-xs text-muted-foreground">
              Showing
              <strong>{{ attributeValues?.pagination?.total }}</strong> of attribute values
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </main>
</template>
