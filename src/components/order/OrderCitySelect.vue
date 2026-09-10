<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { ChevronsUpDown } from 'lucide-vue-next'

import { computed, ref, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import CommandGroupCustom from '@/components/ui/command/CommandGroupCustom.vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import GeoService from '@/services/GeoService'
import { cityKey, cityLabel } from '@/utils/city'
import type { CityResponse } from '@/utils/types/api/generatedApiGo'

const model = defineModel<CityResponse | null>({ default: null })

const open = ref(false)
const searchQuery = ref('')
const cities = ref<CityResponse[]>([])
const loading = ref(false)
let loadSeq = 0

const selectedLabel = computed(() => (model.value ? cityLabel(model.value) : 'Выберите город'))

const isSelected = (city: CityResponse) => {
  const current = model.value
  if (!current) return false
  if (current.id && city.id) return current.id === city.id
  if (current.fias_id && city.fias_id) return current.fias_id === city.fias_id
  return cityLabel(current) === cityLabel(city)
}

const loadPopular = async () => {
  const seq = ++loadSeq
  loading.value = true
  try {
    const data = await GeoService.getPopularCities()
    if (seq !== loadSeq) return
    cities.value = data
  } catch {
    if (seq !== loadSeq) return
    cities.value = []
  } finally {
    if (seq === loadSeq) loading.value = false
  }
}

const searchCities = async (query: string) => {
  const seq = ++loadSeq
  loading.value = true
  try {
    const data = await GeoService.findCity(query)
    if (seq !== loadSeq) return
    cities.value = data
  } catch {
    if (seq !== loadSeq) return
    cities.value = []
  } finally {
    if (seq === loadSeq) loading.value = false
  }
}

watchDebounced(
  searchQuery,
  (value) => {
    if (!open.value) return
    const query = value.trim()
    if (query.length >= 2) {
      void searchCities(query)
      return
    }
    void loadPopular()
  },
  { debounce: 300 },
)

watch(open, async (isOpen) => {
  if (!isOpen) {
    searchQuery.value = ''
    return
  }
  searchQuery.value = ''
  await loadPopular()
})

const select = (city: CityResponse) => {
  model.value = city
  open.value = false
  searchQuery.value = ''
}

const onCitySelect = (selected: any): void => {
  const city = selected?.detail?.value as CityResponse | undefined
  if (city) select(city)
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-full justify-between font-normal"
      >
        <span class="truncate">{{ selectedLabel }}</span>
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" class="w-[var(--reka-popover-trigger-width)] p-0">
      <Command>
        <CommandInput v-model="searchQuery" placeholder="Поиск города" />
        <CommandList>
          <CommandGroupCustom>
            <CommandItem v-if="loading" disabled>Загрузка…</CommandItem>
            <CommandItem v-else-if="!cities.length" disabled>
              {{
                searchQuery.trim().length >= 2 ? 'Городов не найдено' : 'Начните вводить название'
              }}
            </CommandItem>
            <template v-else>
              <CommandItem
                v-for="city in cities"
                :key="cityKey(city)"
                :value="city"
                :class="{ 'bg-accent': isSelected(city) }"
                @select="onCitySelect($event)"
              >
                <div class="flex min-w-0 flex-col">
                  <span class="truncate font-medium">
                    {{ city.city || city.settlement || city.address || 'Город' }}
                  </span>
                  <span v-if="city.region" class="truncate text-xs text-muted-foreground">
                    {{ city.region }}{{ city.region_type ? ` ${city.region_type}` : '' }}
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
