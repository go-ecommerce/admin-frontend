<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { Plus } from 'lucide-vue-next'

import { ref, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import CommandGroupCustom from '@/components/ui/command/CommandGroupCustom.vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ProductService from '@/services/ProductService'
import { formatOrderMoney } from '@/utils/order'
import type { VariantCardResponse } from '@/utils/types/api/generatedApiGo'

const emit = defineEmits<{
  select: [variant: VariantCardResponse]
}>()

defineProps<{
  currency?: string
  disabled?: boolean
}>()

const open = ref(false)
const searchQuery = ref('')
const variants = ref<VariantCardResponse[]>([])
const loading = ref(false)
let loadSeq = 0

const search = async (query: string) => {
  const seq = ++loadSeq
  loading.value = true
  try {
    const items = await ProductService.searchVariants(query)
    if (seq !== loadSeq) return
    variants.value = items.filter((item) => Boolean(item.id))
  } catch {
    if (seq !== loadSeq) return
    variants.value = []
  } finally {
    if (seq === loadSeq) loading.value = false
  }
}

watchDebounced(
  searchQuery,
  (value) => {
    if (!open.value) return
    const query = value.trim()
    if (query.length < 2) {
      variants.value = []
      return
    }
    void search(query)
  },
  { debounce: 300 },
)

watch(open, (isOpen) => {
  if (!isOpen) {
    searchQuery.value = ''
    variants.value = []
  }
})

const pick = (variant: VariantCardResponse) => {
  emit('select', variant)
  open.value = false
  searchQuery.value = ''
  variants.value = []
}

const onSelect = (event: any) => {
  const variant = event?.detail?.value as VariantCardResponse | undefined
  if (variant) pick(variant)
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="outline"
        size="sm"
        class="h-8 gap-1"
        :disabled="disabled"
      >
        <Plus class="h-3.5 w-3.5" />
        Добавить товар
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" class="w-80 p-0 sm:w-96">
      <Command>
        <CommandInput v-model="searchQuery" placeholder="Название или артикул" />
        <CommandList>
          <CommandGroupCustom>
            <CommandItem v-if="loading" value="__loading" disabled>Поиск…</CommandItem>
            <CommandItem v-else-if="searchQuery.trim().length < 2" value="__hint" disabled>
              Введите минимум 2 символа
            </CommandItem>
            <CommandItem v-else-if="!variants.length" value="__empty" disabled>
              Ничего не найдено
            </CommandItem>
            <template v-else>
              <CommandItem
                v-for="variant in variants"
                :key="variant.id"
                :value="variant"
                @select="onSelect"
              >
                <div class="flex min-w-0 flex-col">
                  <span class="truncate font-medium">{{ variant.name || 'Без названия' }}</span>
                  <span class="truncate text-xs text-muted-foreground">
                    {{ variant.model || variant.slug || variant.id }}
                    <template v-if="variant.price_retail != null">
                      · {{ formatOrderMoney(variant.price_retail, currency) }}
                    </template>
                  </span>
                </div>
              </CommandItem>
            </template>
          </CommandGroupCustom>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
