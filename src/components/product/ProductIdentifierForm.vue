<script setup lang="ts">
import { ref, watch } from 'vue'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const productSku = ref('')
const productUpc = ref('')
const productEan = ref('')
const productJan = ref('')
const productIsbn = ref('')
const productMpn = ref('')

watch(
  () => props.modelValue,
  (newValue) => {
    productSku.value = newValue.sku || ''
    productUpc.value = newValue.upc || ''
    productEan.value = newValue.ean || ''
    productJan.value = newValue.jan || ''
    productIsbn.value = newValue.isbn || ''
    productMpn.value = newValue.Mpn || ''
  },
  { immediate: true },
)

watch([productSku, productUpc, productEan, productJan, productIsbn, productMpn], () => {
  emit('update:modelValue', {
    ...props.modelValue,
    sku: productSku.value,
    upc: productUpc.value,
    ean: productEan.value,
    jan: productJan.value,
    isbn: productIsbn.value,
    mpn: productMpn.value,
  })
})
</script>

<template>
  <form>
    <div class="grid items-center w-full gap-4">
      <div class="flex flex-col space-y-1.5">
        <Label for="sku">Sku</Label>
        <Input id="sku" v-model="productSku" placeholder="Sku of your product" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="upc">Upc</Label>
        <Input id="upc" v-model="productUpc" placeholder="Upc of your product" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="ean">Ean</Label>
        <Input id="ean" v-model="productEan" placeholder="Ean of your product" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="jan">Jan</Label>
        <Input id="jan" v-model="productJan" placeholder="Jan of your product" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="isbn">Isbn</Label>
        <Input id="isbn" v-model="productIsbn" placeholder="Isbn of your product" />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="mpn">Mpn</Label>
        <Input id="mpn" v-model="productMpn" placeholder="Mpn of your product" />
      </div>
    </div>
  </form>
</template>
