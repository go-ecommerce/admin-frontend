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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const productWeight = ref<number>(props.modelValue.weight || 0)
const productLength = ref<number>(props.modelValue.length || 0)
const productWidth = ref<number>(props.modelValue.width || 0)
const productHeight = ref<number>(props.modelValue.height || 0)

watch([productWeight, productLength, productWidth, productHeight], () => {
  emit('update:modelValue', {
    ...props.modelValue,
    weight: productWeight.value,
    length: productLength.value,
    width: productWidth.value,
    height: productHeight.value,
  })
})
</script>

<template>
  <form>
    <div class="grid items-center w-full gap-4">
      <div class="grid grid-cols-2 w-full gap-4">
        <NumberField v-model="productWeight">
          <Label>Weight</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <NumberField v-model="productLength">
          <Label>Length</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <NumberField v-model="productWidth">
          <Label>Width</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <NumberField v-model="productHeight">
          <Label>Height</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
    </div>
  </form>
</template>
