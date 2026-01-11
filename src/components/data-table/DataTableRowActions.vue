<script setup lang="ts">
import { DotsHorizontalIcon } from '@radix-icons/vue'
import type { Row } from '@tanstack/vue-table'
import { ref } from 'vue'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils.ts'

interface DataTableRowActionsProps {
  row: Row<{ id: string }>
  editUrlName: string
}

const props = defineProps<DataTableRowActionsProps>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const isDeleteDialogOpen = ref(false)

const handleDelete = () => {
  emit('delete', props.row.original.id)
  isDeleteDialogOpen.value = false
}
</script>

<template>
  <div :class="cn('flex items-center space-x-2', $attrs.class ?? '')">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon class="h-4 w-4" />
          <span class="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-[160px]">
        <RouterLink :to="{ name: props.editUrlName, params: { id: row.original.id } }">
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </RouterLink>

        <DropdownMenuSeparator />
        <DropdownMenuItem @click="isDeleteDialogOpen = true">
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialog v-model:open="isDeleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleDelete">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
