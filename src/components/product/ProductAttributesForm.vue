<script setup lang="ts">
import { Check, ChevronsUpDown, Loader2, Plus, Trash2 } from 'lucide-vue-next'
import { ref, watch, computed } from 'vue'

import AttributeSearch from '@/components/attribute/AttributeSearch.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import CommandGroupCustom from '@/components/ui/command/CommandGroupCustom.vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/toast/use-toast'
import AttributeService from '@/services/AttributeService'
import type { ProductAttributesResponse } from '@/utils/types/api/apiGo'
import type { AttributeResponse, AttributeValueResponse } from '@/utils/types/api/generatedApiGo'

interface ProductAttributeItem {
  attribute: AttributeResponse
  selectedValueId?: string
  availableValues: AttributeValueResponse[]
  tempValue?: any
}

const props = defineProps<{
  modelValue?: ProductAttributesResponse | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const { toast } = useToast()

const productAttributes = ref<ProductAttributeItem[]>([])
const searchValueInputs = ref<Record<string, string>>({})
const openPopovers = ref<Record<string, boolean>>({})
const isLoadingInitial = ref(false)
const isUpdatingFromParent = ref(false)
const isAddingAttribute = ref(false)
const creatingValueFor = ref<string | null>(null) // Track which attribute is creating a new value

// Load initial data from modelValue (ProductAttributesResponse with groups)
watch(
  () => props.modelValue,
  async (newValue) => {
    isUpdatingFromParent.value = true

    try {
      if (!newValue || !newValue.groups || newValue.groups.length === 0) {
        productAttributes.value = []
        return
      }

      // Avoid reloading if already loaded
      if (productAttributes.value.length > 0) return

      isLoadingInitial.value = true
      const loadedAttributes: ProductAttributeItem[] = []

      try {
        // Parse groups structure from API response
        for (const group of newValue.groups) {
          for (const attr of group.attributes) {
            // Get the selected value (first value in the array from API)
            const selectedValue = attr.values && attr.values.length > 0 ? attr.values[0] : null

            // Load all available values for this attribute
            let availableValues: AttributeValueResponse[] = []
            try {
              availableValues = await AttributeService.getApiAttributeValuesByAttributeId(attr.id)
            } catch (error) {
              console.error(`Error loading values for attribute ${attr.id}:`, error)
              // Use values from API response as fallback
              availableValues = attr.values.map(v => ({
                id: v.id,
                value: v.value,
                attribute_id: attr.id,
              }))
            }

            loadedAttributes.push({
              attribute: {
                id: attr.id,
                name: attr.name,
                slug: attr.slug,
                type: attr.type,
                unit: attr.unit,
                is_filterable: attr.is_filterable,
              },
              availableValues,
              selectedValueId: selectedValue?.id,
            })
          }
        }

        productAttributes.value = loadedAttributes

        // Initialize lastEmittedValueIds with loaded values
        const initialValueIds = loadedAttributes
          .map((pa) => pa.selectedValueId)
          .filter((id): id is string => !!id)
        lastEmittedValueIds.value = initialValueIds
      } finally {
        isLoadingInitial.value = false
      }
    } finally {
      // Reset flag after a tick to allow reactive system to settle
      setTimeout(() => {
        isUpdatingFromParent.value = false
      }, 0)
    }
  },
  { immediate: true },
)

// Track last emitted valueIds to prevent unnecessary updates
const lastEmittedValueIds = ref<string[]>([])

// Emit changes - only selected attribute_value_ids
watch(
  productAttributes,
  (newValue) => {
    // Don't emit during initial loading, updating from parent, or adding new attribute
    if (isLoadingInitial.value || isUpdatingFromParent.value || isAddingAttribute.value) return

    const valueIds = newValue.map((pa) => pa.selectedValueId).filter((id): id is string => !!id)

    // Only emit if valueIds actually changed
    const hasChanged =
      valueIds.length !== lastEmittedValueIds.value.length ||
      valueIds.some((id, index) => id !== lastEmittedValueIds.value[index])

    if (!hasChanged) return

    lastEmittedValueIds.value = [...valueIds]
    emit('update:modelValue', valueIds)
  },
  { deep: true },
)

const onAttributeSelect = async (attribute: AttributeResponse) => {
  // Check if attribute already added
  const exists = productAttributes.value.find((pa) => pa.attribute.id === attribute.id)
  if (exists) {
    toast({
      title: 'Атрибут уже добавлен',
      variant: 'destructive',
    })
    return
  }

  // Set flag to prevent emitting during attribute addition
  isAddingAttribute.value = true

  try {
    // Load available values for this attribute
    let availableValues: AttributeValueResponse[] = []
    if (attribute.id) {
      try {
        availableValues = await AttributeService.getApiAttributeValuesByAttributeId(attribute.id)
      } catch (error) {
        console.error('Error loading attribute values:', error)
      }
    }

    productAttributes.value.push({
      attribute,
      availableValues,
    })

    toast({
      title: `Атрибут "${attribute.name}" добавлен`,
      variant: 'success',
    })
  } finally {
    setTimeout(() => {
      isAddingAttribute.value = false
    }, 0)
  }
}

const removeAttribute = (attributeId: string | undefined) => {
  if (!attributeId) return
  const attr = productAttributes.value.find((pa) => pa.attribute.id === attributeId)
  productAttributes.value = productAttributes.value.filter((pa) => pa.attribute.id !== attributeId)
  if (attr) {
    toast({
      title: `Атрибут "${attr.attribute.name}" удалён`,
    })
  }
}

const updateSelectedValue = (attributeId: string, valueId: string) => {
  const attr = productAttributes.value.find((pa) => pa.attribute.id === attributeId)
  if (attr) {
    attr.selectedValueId = valueId
    attr.tempValue = undefined
    openPopovers.value[attributeId] = false
    searchValueInputs.value[attributeId] = ''
  }
}

const onValueSelect = (attributeId: string, selected: any) => {
  const valueId = selected.detail?.value?.id || selected.detail?.value
  if (valueId) {
    updateSelectedValue(attributeId, valueId)
  }
}

const createAndSelectValue = async (attributeId: string, value: string) => {
  const attr = productAttributes.value.find((pa) => pa.attribute.id === attributeId)
  if (!attr) return

  creatingValueFor.value = attributeId

  try {
    const newValue = await AttributeService.createApiAttributeValue({
      attribute_id: attributeId,
      value: value,
    })

    // Add to available values and select it
    attr.availableValues.push(newValue)
    attr.selectedValueId = newValue.id
    attr.tempValue = undefined
    openPopovers.value[attributeId] = false
    searchValueInputs.value[attributeId] = ''

    toast({
      title: `Значение "${value}" создано и выбрано`,
      variant: 'success',
    })
  } catch (error) {
    console.error('Error creating attribute value:', error)
    toast({
      title: 'Ошибка создания значения',
      description: 'Не удалось создать новое значение атрибута',
      variant: 'destructive',
    })
  } finally {
    creatingValueFor.value = null
  }
}

const createNewValueFromSearch = async (attributeId: string) => {
  const searchText = String(searchValueInputs.value[attributeId] || '').trim()
  if (!searchText) return
  await createAndSelectValue(attributeId, searchText)
}

// Get filtered values based on search
const getFilteredValues = (attributeId: string, availableValues: AttributeValueResponse[]) => {
  const searchQuery = String(searchValueInputs.value[attributeId] || '').toLowerCase()
  if (!searchQuery) return availableValues

  return availableValues.filter((val) => String(val.value).toLowerCase().includes(searchQuery))
}

// Check if search query matches any existing value exactly
const searchMatchesExisting = (attributeId: string, availableValues: AttributeValueResponse[]) => {
  const searchQuery = String(searchValueInputs.value[attributeId] || '').trim().toLowerCase()
  if (!searchQuery) return true
  return availableValues.some((val) => String(val.value).toLowerCase() === searchQuery)
}

// Get selected value display text
const getSelectedValueText = (pa: ProductAttributeItem) => {
  if (!pa.selectedValueId) return 'Выберите значение...'
  const selectedValue = pa.availableValues.find((v) => v.id === pa.selectedValueId)
  if (!selectedValue) return 'Выберите значение...'
  return pa.attribute.unit ? `${selectedValue.value} ${pa.attribute.unit}` : String(selectedValue.value)
}

// Handle boolean attribute change
const handleBooleanChange = async (attributeId: string, checked: boolean) => {
  const attr = productAttributes.value.find((pa) => pa.attribute.id === attributeId)
  if (!attr) return

  const valueStr = String(checked)

  // Check if there's already an AttributeValue with this exact value
  const existingValue = attr.availableValues.find((v) => String(v.value) === valueStr)

  if (existingValue) {
    attr.selectedValueId = existingValue.id
  } else {
    // Create new AttributeValue
    await createAndSelectValue(attributeId, valueStr)
  }
}

// Get boolean checked state
const getBooleanChecked = (pa: ProductAttributeItem) => {
  if (!pa.selectedValueId) return false
  const selectedValue = pa.availableValues.find((v) => v.id === pa.selectedValueId)
  return selectedValue?.value === 'true' || selectedValue?.value === true
}
</script>

<template>
  <div class="space-y-4">
    <AttributeSearch @select="onAttributeSelect" />

    <div v-if="isLoadingInitial" class="flex items-center justify-center py-8 gap-2">
      <Loader2 class="h-4 w-4 animate-spin" />
      <span class="text-sm text-muted-foreground">Загрузка атрибутов...</span>
    </div>

    <div v-else-if="productAttributes.length === 0" class="text-center py-8 border rounded-lg border-dashed">
      <p class="text-sm text-muted-foreground">
        Атрибуты не добавлены. Найдите и добавьте атрибуты выше.
      </p>
    </div>

    <div v-else class="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[200px]">Атрибут</TableHead>
            <TableHead>Значение</TableHead>
            <TableHead class="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="pa in productAttributes" :key="pa.attribute.id">
            <!-- Attribute Name -->
            <TableCell class="font-medium">
              <div class="flex flex-col gap-1">
                <span>{{ pa.attribute.name }}</span>
                <Badge variant="outline" class="text-xs w-fit">{{ pa.attribute.type }}</Badge>
              </div>
            </TableCell>

            <!-- Value Selection -->
            <TableCell>
              <!-- Boolean type: simple checkbox -->
              <div v-if="pa.attribute.type === 'boolean'" class="flex items-center gap-2">
                <Checkbox
                  :checked="getBooleanChecked(pa)"
                  :disabled="creatingValueFor === pa.attribute.id"
                  @update:checked="(checked: boolean) => handleBooleanChange(pa.attribute.id || '', checked)"
                />
                <span class="text-sm">{{ getBooleanChecked(pa) ? 'Да' : 'Нет' }}</span>
                <Loader2 v-if="creatingValueFor === pa.attribute.id" class="h-3 w-3 animate-spin ml-2" />
              </div>

              <!-- Other types: Combobox with inline creation -->
              <Popover v-else v-model:open="openPopovers[pa.attribute.id || '']">
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    role="combobox"
                    :aria-expanded="openPopovers[pa.attribute.id || '']"
                    class="w-full max-w-[300px] justify-between"
                    :class="{ 'text-muted-foreground': !pa.selectedValueId }"
                  >
                    <span class="truncate">{{ getSelectedValueText(pa) }}</span>
                    <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" class="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      v-model="searchValueInputs[pa.attribute.id || '']"
                      :placeholder="`Поиск или создание значения...`"
                    />
                    <CommandList>
                      <CommandGroupCustom>
                        <!-- Existing values -->
                        <CommandItem
                          v-for="val in getFilteredValues(pa.attribute.id || '', pa.availableValues)"
                          :key="val.id"
                          :value="val"
                          @select="onValueSelect(pa.attribute.id || '', $event)"
                        >
                          <Check
                            class="mr-2 h-4 w-4"
                            :class="pa.selectedValueId === val.id ? 'opacity-100' : 'opacity-0'"
                          />
                          <span>{{ val.value }}</span>
                          <span v-if="pa.attribute.unit" class="text-xs text-muted-foreground ml-1">
                            {{ pa.attribute.unit }}
                          </span>
                        </CommandItem>

                        <!-- No results message -->
                        <CommandItem
                          v-if="getFilteredValues(pa.attribute.id || '', pa.availableValues).length === 0 && !searchValueInputs[pa.attribute.id || '']"
                          disabled
                          value="__no_values__"
                        >
                          Нет доступных значений
                        </CommandItem>

                        <!-- Create new value option -->
                        <div
                          v-if="searchValueInputs[pa.attribute.id || '']?.trim() && !searchMatchesExisting(pa.attribute.id || '', pa.availableValues)"
                          class="border-t px-2 py-1.5"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            class="w-full justify-start h-8 text-sm font-normal"
                            :disabled="creatingValueFor === pa.attribute.id"
                            @click="createNewValueFromSearch(pa.attribute.id || '')"
                          >
                            <Plus class="mr-2 h-4 w-4" />
                            <span>Создать "{{ searchValueInputs[pa.attribute.id || ''] }}"</span>
                            <Loader2 v-if="creatingValueFor === pa.attribute.id" class="ml-2 h-3 w-3 animate-spin" />
                          </Button>
                        </div>
                      </CommandGroupCustom>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </TableCell>

            <!-- Delete Button -->
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8 text-muted-foreground hover:text-destructive"
                @click="removeAttribute(pa.attribute.id)"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
