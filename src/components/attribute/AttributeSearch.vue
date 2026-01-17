<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { ChevronsUpDown } from 'lucide-vue-next'
import { ref } from 'vue'

import { Button } from '@/components/ui/button'
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import CommandGroupCustom from '@/components/ui/command/CommandGroupCustom.vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import AttributeService from '@/services/AttributeService'
import type { AttributeResponse } from '@/utils/types/api/generatedApiGo'

const emit = defineEmits<{
  (e: 'select', attribute: AttributeResponse): void
}>()

const open = ref(false)
const searchQuery = ref('')
const attributes = ref<AttributeResponse[]>([])
const loading = ref(false)

watchDebounced(
  searchQuery,
  async (query) => {
    if (!query.trim()) {
      attributes.value = []
      return
    }

    try {
      loading.value = true
      const response = await AttributeService.findApiAttribute({
        attribute: query,
        page: 1,
        page_size: 20,
      })
      attributes.value = response.items || []
    } catch (e) {
      attributes.value = []
      console.error(e)
    } finally {
      loading.value = false
    }
  },
  { debounce: 300 },
)

const onAttributeSelect = (selected: any): void => {
  console.log('AttributeSearch - onAttributeSelect called', selected)
  console.log('AttributeSearch - selected.detail', selected.detail)
  console.log('AttributeSearch - selected.detail.value', selected.detail?.value)
  emit('select', selected.detail.value)
  open.value = false
  searchQuery.value = ''
  attributes.value = []
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-full justify-between"
      >
        Search and add attribute...
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" class="w-full p-0">
      <Command>
        <CommandInput v-model="searchQuery" placeholder="Search attribute..." />

        <CommandList>
          <CommandGroupCustom>
            <CommandItem
              v-if="loading"
              disabled
            >
              Loading...
            </CommandItem>
            <CommandItem
              v-else-if="!attributes.length && searchQuery"
              disabled
            >
              No attributes found
            </CommandItem>
            <template v-else>
              <CommandItem
                v-for="attribute in attributes"
                :key="attribute.id"
                :value="attribute"
                @select="onAttributeSelect($event)"
              >
                <div class="flex flex-col">
                  <span class="font-medium">{{ attribute.name }}</span>
                  <span class="text-xs text-muted-foreground">{{ attribute.type }}</span>
                </div>
              </CommandItem>
            </template>
          </CommandGroupCustom>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
