<script setup lang="ts">
import { ref, watch } from 'vue'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

enum StockStatus {
  InStock = 'IN_STOCK',
  PreOrder = 'PRE_ORDER',
  OutOfStock = 'OUT_OF_STOCK',
}

const statusLabels: Record<StockStatus, string> = {
  [StockStatus.InStock]: 'In Stock',
  [StockStatus.PreOrder]: 'Pre Order',
  [StockStatus.OutOfStock]: 'Out of Stock',
}

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const productQuantity = ref<number>(props.modelValue.quantity || 1)
const productStockStatus = ref<StockStatus>(props.modelValue.stock_status ?? StockStatus.InStock)
const productLocation = ref<string>(props.modelValue.location || '')
const productSubtract = ref<boolean>(props.modelValue.subtract || false)
const productMinimum = ref<number>(props.modelValue.minimum || 1)

watch(
  [productQuantity, productStockStatus, productLocation, productSubtract, productMinimum],
  () => {
    emit('update:modelValue', {
      ...props.modelValue,
      quantity: productQuantity.value,
      stock_status: productStockStatus.value,
      location: productLocation.value,
      subtract: productSubtract.value,
      minimum: productMinimum.value,
    })
  },
)
</script>

<template>
  <form>
    <div class="grid items-center w-full gap-4">
      <div class="grid grid-cols-2 w-full gap-4">
        <NumberField v-model="productQuantity">
          <Label>Quantity</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <NumberField v-model="productMinimum">
          <Label>Minimum order</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <div class="grid gap-1.5">
          <Label>Stock status</Label>
          <Select v-model="productStockStatus">
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="status in Object.values(StockStatus)"
                  :key="status"
                  :value="status"
                >
                  {{ statusLabels[status] }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="grid gap-1.5">
          <Label for="location">Location</Label>
          <Input id="location" v-model="productLocation" placeholder="location of your product" />
        </div>
      </div>
    </div>
  </form>
</template>
