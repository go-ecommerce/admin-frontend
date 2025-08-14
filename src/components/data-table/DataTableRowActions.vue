<script setup lang="ts">
import { DotsHorizontalIcon } from '@radix-icons/vue'
import type { Row } from '@tanstack/vue-table'

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
import type { CategoryResponse } from '@/utils/types/api/generatedApiGo'

interface DataTableRowActionsProps {
  row: Row<{ id: string }>
  editUrlName: string
}

const props = defineProps<DataTableRowActionsProps>()
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

        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
