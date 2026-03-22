<script setup lang="ts">
import { Loader2, Package, Save, X } from 'lucide-vue-next'
import { ref, watch, computed, onMounted } from 'vue'

import ProductSearch from '@/components/product/ProductSearch.vue'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast/use-toast'
import ProductService from '@/services/ProductService'
import type { ProductVariantResponse, ShortProduct } from '@/utils/types/api/generatedApiGo'

const props = defineProps<{
  variants: ProductVariantResponse[]
}>()

const { toast } = useToast()

const selectedVariantId = ref<string>('')
const relatedMap = ref<Record<string, ShortProduct[]>>({})
const loading = ref(false)
const saving = ref(false)

const currentRelated = computed({
  get: () => relatedMap.value[selectedVariantId.value] ?? [],
  set: (val) => {
    relatedMap.value = { ...relatedMap.value, [selectedVariantId.value]: val }
  },
})

onMounted(async () => {
  const ids = props.variants.map((v) => v.id!).filter(Boolean)
  if (!ids.length) return

  selectedVariantId.value = ids[0]
  loading.value = true
  try {
    relatedMap.value = await ProductService.getRelatedProductsBatch(ids)
  } catch {
    relatedMap.value = {}
  } finally {
    loading.value = false
  }
})

watch(
  () => props.variants,
  (variants) => {
    if (variants.length && !selectedVariantId.value) {
      selectedVariantId.value = variants[0]?.id ?? ''
    }
  },
)

const remove = (id: string | undefined) => {
  currentRelated.value = currentRelated.value.filter((p) => p.id !== id)
}

const save = async () => {
  saving.value = true
  try {
    const ids = currentRelated.value.map((p) => p.id!).filter(Boolean)
    await ProductService.syncRelatedProducts(selectedVariantId.value, { variant_ids: ids })
    toast({ title: '✅ Связанные товары сохранены', variant: 'success' })
  } catch {
    toast({ title: 'Ошибка сохранения', variant: 'destructive' })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <Select v-model="selectedVariantId">
      <SelectTrigger>
        <SelectValue placeholder="Выберите вариант" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="v in variants" :key="v.id" :value="v.id!">
          {{ v.name }}
        </SelectItem>
      </SelectContent>
    </Select>

    <div v-if="loading" class="space-y-2">
      <Skeleton v-for="i in 3" :key="i" class="h-12 w-full" />
    </div>

    <template v-else>
      <ProductSearch
        :model-value="currentRelated"
        @update:model-value="currentRelated = $event"
      />

      <div v-if="currentRelated.length" class="border rounded-md divide-y">
        <div
          v-for="product in currentRelated"
          :key="product.id"
          class="flex items-center gap-3 px-3 py-2 group"
        >
          <Package class="h-4 w-4 shrink-0 text-muted-foreground" />
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium truncate">{{ product.name }}</div>
            <div class="text-xs text-muted-foreground truncate">{{ product.model }}</div>
          </div>
          <span v-if="product.price" class="text-sm text-muted-foreground shrink-0">
            {{ Number(product.price).toLocaleString() }} ₽
          </span>
          <button
            type="button"
            class="shrink-0 rounded p-0.5 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
            @click="remove(product.id)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>

      <div v-else class="text-sm text-muted-foreground text-center py-6 border rounded-md">
        Нет связанных товаров для этого варианта
      </div>

      <Button type="button" size="sm" class="gap-1.5" :disabled="saving" @click="save">
        <Loader2 v-if="saving" class="h-3.5 w-3.5 animate-spin" />
        <Save v-else class="h-3.5 w-3.5" />
        Сохранить
      </Button>
    </template>
  </div>
</template>
