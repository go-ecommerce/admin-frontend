<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { Search, PlusCircle, Package2, Trash2, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { computed, h, ref, watch } from 'vue'
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
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAttributeStore } from '@/stores/attribute'
import type { IAttributeRequest } from '@/utils/types/api/apiGo.ts'

const { attributes, isLoading } = storeToRefs(useAttributeStore())
const { getAttributes, deleteAttribute, findAttributes } = useAttributeStore()

const router = useRouter()

const searchQuery = ref('')
const typeFilter = ref<string>('all')
const visibilityFilter = ref<string>('all')
const selectedRows = ref<Record<string, boolean>>({})

const params = ref({
  page: 1,
  pageSize: 10,
})

const selectedCount = computed(() => Object.values(selectedRows.value).filter(Boolean).length)

const handleBulkDelete = async () => {
  const idsToDelete = Object.keys(selectedRows.value).filter((id) => selectedRows.value[id])

  if (idsToDelete.length === 0) return

  if (!confirm(`Are you sure you want to delete ${idsToDelete.length} attribute(s)?`)) return

  try {
    await Promise.all(idsToDelete.map((id) => deleteAttribute(id)))
    selectedRows.value = {}
    await fetchAttributes()
  } catch (error) {
    console.error('Error deleting attributes:', error)
  }
}

const clearSelection = () => {
  selectedRows.value = {}
}

const columns: ColumnDef<any>[] = [
  {
    id: 'select',
    header: () =>
      h(Checkbox, {
        checked: filteredAttributes.value.length > 0 && filteredAttributes.value.every((attr) => attr.id && selectedRows.value[attr.id]),
        'onUpdate:checked': (value: boolean) => {
          filteredAttributes.value.forEach((attr) => {
            if (attr.id) selectedRows.value[attr.id] = value
          })
        },
        ariaLabel: 'Select all',
        class: 'translate-y-0.5',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: !!selectedRows.value[row.original.id],
        'onUpdate:checked': (value: boolean) => {
          selectedRows.value[row.original.id] = value
        },
        ariaLabel: 'Select row',
        class: 'translate-y-0.5',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Name' }),
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('name')),
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Slug' }),
    cell: ({ row }) => h('div', { class: 'text-muted-foreground text-sm' }, row.getValue('slug')),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Type' }),
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      const typeColors: Record<string, string> = {
        text: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        number: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        select: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        boolean: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      }
      return h(Badge, { class: typeColors[type] || '', variant: 'secondary' }, () => type)
    },
  },
  {
    accessorKey: 'is_visible',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Status' }),
    cell: ({ row }) => {
      const isVisible = row.getValue('is_visible')
      const isFilterable = row.original.is_filterable
      const isRequired = row.original.is_required

      return h('div', { class: 'flex gap-1' }, [
        isVisible && h(Badge, { variant: 'outline', class: 'text-xs' }, () => 'Visible'),
        isFilterable && h(Badge, { variant: 'outline', class: 'text-xs' }, () => 'Filterable'),
        isRequired && h(Badge, { variant: 'outline', class: 'text-xs' }, () => 'Required'),
      ])
    },
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
  if (searchQuery.value.trim()) {
    const payload = {
      attribute: searchQuery.value.trim(),
      page: params.value.page,
      page_size: params.value.pageSize,
    }
    await findAttributes(payload)
  } else {
    const payload: IAttributeRequest = {
      page: params.value.page,
      page_size: params.value.pageSize,
    }
    await getAttributes(payload)
  }
}

const handleDelete = async (id: string) => {
  await deleteAttribute(id)
  await fetchAttributes()
}

const filteredAttributes = computed(() => {
  if (!attributes.value?.items) return []

  let filtered = attributes.value.items

  if (typeFilter.value !== 'all') {
    filtered = filtered.filter((attr) => attr.type === typeFilter.value)
  }

  if (visibilityFilter.value === 'visible') {
    filtered = filtered.filter((attr) => attr.is_visible)
  } else if (visibilityFilter.value === 'hidden') {
    filtered = filtered.filter((attr) => !attr.is_visible)
  }

  return filtered
})

watch([params.value, searchQuery], fetchAttributes, { immediate: true })

// Reset to page 1 when filters change
watch([typeFilter, visibilityFilter], () => {
  // Don't reset if already on page 1
  if (params.value.page !== 1) {
    params.value.page = 1
  }
})
</script>

<style scoped></style>

<template>
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Tabs default-value="all">
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Attributes</CardTitle>
                <CardDescription>Manage your Attributes.</CardDescription>
              </div>
              <Button size="sm" @click="router.push({ name: 'attribute-create' })">
                <PlusCircle class="h-4 w-4 mr-2" />
                Add Attribute
              </Button>
            </div>
            <div class="flex items-center gap-2 mt-4">
              <div class="relative flex-1 max-w-sm">
                <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input v-model="searchQuery" placeholder="Search attributes..." class="pl-8" />
              </div>
              <Select v-model="typeFilter">
                <SelectTrigger class="w-[150px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                </SelectContent>
              </Select>
              <Select v-model="visibilityFilter">
                <SelectTrigger class="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="visible">Visible</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div v-if="selectedCount > 0" class="flex items-center justify-between p-3 mb-4 bg-muted rounded-md">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">{{ selectedCount }} selected</span>
                <Button variant="ghost" size="sm" @click="clearSelection">
                  <X class="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
              <Button variant="destructive" size="sm" @click="handleBulkDelete">
                <Trash2 class="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            </div>
            <div v-if="!isLoading && filteredAttributes.length === 0" class="flex flex-col items-center justify-center py-12">
              <Package2 class="h-12 w-12 text-muted-foreground mb-4" />
              <h3 class="text-lg font-semibold mb-2">No attributes found</h3>
              <p class="text-sm text-muted-foreground mb-4">
                {{ searchQuery || typeFilter !== 'all' || visibilityFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first attribute' }}
              </p>
              <Button v-if="!searchQuery && typeFilter === 'all' && visibilityFilter === 'all'" @click="router.push({ name: 'attribute-create' })">
                <PlusCircle class="h-4 w-4 mr-2" />
                Add Attribute
              </Button>
            </div>
            <DataTable
              v-else
              v-model:page="params.page"
              v-model:page-size="params.pageSize"
              :columns="columns"
              :is-loading="isLoading"
              :data="filteredAttributes"
              :total-items="attributes?.pagination.total ?? 0"
            />
          </CardContent>
          <CardFooter v-if="attributes?.pagination">
            <div class="text-xs text-muted-foreground">
              <template v-if="typeFilter === 'all' && visibilityFilter === 'all'">
                Showing
                <strong>{{ ((attributes.pagination.page - 1) * attributes.pagination.page_size) + 1 }}-{{ Math.min(attributes.pagination.page * attributes.pagination.page_size, attributes.pagination.total) }}</strong>
                of <strong>{{ attributes.pagination.total }}</strong> attributes
              </template>
              <template v-else>
                Showing <strong>{{ filteredAttributes.length }}</strong> filtered results from page {{ attributes.pagination.page }}
              </template>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </main>
</template>
