<script setup lang="ts">
import { GripVertical, Plus, Trash2 } from 'lucide-vue-next'

import { computed, ref } from 'vue'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AttributeValueResponse } from '@/utils/types/api/generatedApiGo'

const props = defineProps<{
  attributeId?: string
  values?: AttributeValueResponse[]
  disabled?: boolean
}>()

const emit = defineEmits<{
  (
    e: 'add-value',
    value: {
      value: string
      value_normalized?: string
      value_numeric?: number
      display_order: number
      is_active: boolean
    },
  ): void
  (e: 'delete-value', id: string): void
  (e: 'update-value', value: AttributeValueResponse): void
}>()

interface LocalValue {
  id?: string
  value: string
  value_normalized?: string
  value_numeric?: number
  display_order: number
  is_active: boolean
  isNew?: boolean
  isEditing?: boolean
}

const localValues = ref<LocalValue[]>([])
const newValue = ref<LocalValue>({
  value: '',
  value_normalized: '',
  value_numeric: undefined,
  display_order: 0,
  is_active: true,
  isNew: true,
})

const hasValues = computed(() => {
  return props.values && props.values.length > 0
})

const sortedValues = computed(() => {
  if (!props.values) return []
  return [...props.values].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
})

const addNewValue = () => {
  if (!newValue.value.value.trim()) return

  const valueToAdd = {
    value: newValue.value.value,
    value_normalized: newValue.value.value_normalized || undefined,
    value_numeric: newValue.value.value_numeric,
    display_order: newValue.value.display_order || props.values?.length || 0,
    is_active: newValue.value.is_active,
  }

  emit('add-value', valueToAdd)

  // Reset form
  newValue.value = {
    value: '',
    value_normalized: '',
    value_numeric: undefined,
    display_order: 0,
    is_active: true,
    isNew: true,
  }
}

const deleteValue = (id?: string) => {
  if (!id) return
  emit('delete-value', id)
}

const updateValue = (value: AttributeValueResponse) => {
  emit('update-value', value)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <Label class="text-base font-semibold">Attribute Values</Label>
      <span v-if="hasValues" class="text-sm text-muted-foreground">
        {{ values?.length }} value(s)
      </span>
    </div>
    <!-- Add new value form -->
    <div class="border rounded-lg p-4 space-y-4">
      <Label class="text-sm font-medium">Add New Value</Label>
      <div class="grid grid-cols-12 gap-3">
        <div class="col-span-3">
          <Input
            v-model="newValue.value"
            placeholder="Value"
            :disabled="disabled || !attributeId"
          />
        </div>
        <div class="col-span-3">
          <Input
            v-model="newValue.value_normalized"
            placeholder="Normalized (optional)"
            :disabled="disabled || !attributeId"
          />
        </div>
        <div class="col-span-2">
          <Input
            v-model.number="newValue.value_numeric"
            type="number"
            placeholder="Numeric"
            :disabled="disabled || !attributeId"
          />
        </div>
        <div class="col-span-1">
          <Input
            v-model.number="newValue.display_order"
            type="number"
            min="0"
            placeholder="Order"
            :disabled="disabled || !attributeId"
          />
        </div>
        <div class="col-span-1 flex items-center justify-center">
          <Checkbox v-model:checked="newValue.is_active" :disabled="disabled || !attributeId" />
        </div>
        <div class="col-span-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            class="w-full"
            @click="addNewValue"
            :disabled="disabled || !attributeId || !newValue.value.trim()"
          >
            <Plus class="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
      <p v-if="!attributeId" class="text-sm text-muted-foreground">
        Save the attribute first to add values
      </p>
    </div>
    <!-- Existing values table -->
    <div v-if="hasValues" class="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-12"></TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Normalized</TableHead>
            <TableHead class="w-24">Numeric</TableHead>
            <TableHead class="w-20">Order</TableHead>
            <TableHead class="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="value in sortedValues" :key="value.id">
            <TableCell>
              <GripVertical class="h-4 w-4 text-muted-foreground cursor-grab" />
            </TableCell>
            <TableCell class="font-medium">{{ value.value }}</TableCell>
            <TableCell class="text-sm text-muted-foreground">
              {{ value.value_normalized || '—' }}
            </TableCell>
            <TableCell class="text-sm">
              {{ value.value_numeric ?? '—' }}
            </TableCell>
            <TableCell class="text-sm">{{ value.display_order }}</TableCell>

            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                @click="deleteValue(value.id)"
                :disabled="disabled"
              >
                <Trash2 class="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
