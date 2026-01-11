<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { ChevronsUpDown } from 'lucide-vue-next'

import { computed, ref, watch } from 'vue'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import CommandGroupCustom from '@/components/ui/command/CommandGroupCustom.vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import AttributeService from '@/services/AttributeService'
import type { AttributeGroupResponse } from '@/utils/types/api/generatedApiGo'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | undefined): void
  (e: 'select', attributeGroup: AttributeGroupResponse): void
}>()

const open = ref(false)
const selectedAttributeGroup = ref<AttributeGroupResponse | undefined>()
const searchQuery = ref('')
const attributeGroups = ref<AttributeGroupResponse[]>([])
const loading = ref(false)

// Watch for external modelValue changes
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue && !selectedAttributeGroup.value) {
      try {
        const group = await AttributeService.getApiAttributeGroupById(newValue)
        selectedAttributeGroup.value = group
      } catch (e) {
        console.error('Failed to load attribute group:', e)
      }
    } else if (!newValue) {
      selectedAttributeGroup.value = undefined
    }
  },
  { immediate: true },
)

watchDebounced(
  searchQuery,
  async (query) => {
    if (!query.trim()) {
      attributeGroups.value = []
      return
    }

    try {
      loading.value = true
      const result = await AttributeService.findApiAttributeGroup({
        attribute: query,
        page: 1,
        page_size: 20,
      })
      attributeGroups.value = result?.items || []
    } catch (e) {
      attributeGroups.value = []
      console.error('Error loading attribute groups:', e)
    } finally {
      loading.value = false
    }
  },
  { debounce: 300 },
)

const onAttributeGroupSelect = (selected: any): void => {
  const attributeGroup = selected.detail.value as AttributeGroupResponse
  selectedAttributeGroup.value = attributeGroup
  emit('update:modelValue', attributeGroup.id)
  emit('select', attributeGroup)
  open.value = false
}

const displayValue = computed(() => {
  return selectedAttributeGroup.value?.name || 'Select attribute group...'
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="flex-1 justify-between"
      >
        {{ displayValue }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="p-0"
      align="start"
    >
      <Command :filter-function="() => 1">
        <CommandInput v-model="searchQuery" placeholder="Search attribute group..." />

        <CommandList>
          <CommandGroupCustom v-if="attributeGroups.length > 0">
            <CommandItem
              v-for="attributeGroup in attributeGroups"
              :key="attributeGroup.id"
              :value="attributeGroup"
              @select="onAttributeGroupSelect($event)"
            >
              {{ attributeGroup.name || 'Unnamed' }}
            </CommandItem>
          </CommandGroupCustom>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
