<script setup lang="ts">
import { Pencil, Plus, Sparkles, Trash2, X, Check, Package } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast/use-toast'
import ProductSearch from '@/components/product/ProductSearch.vue'
import ProductService from '@/services/ProductService'
import { generateSlug as generateSlugUtil } from '@/utils/slug'
import type {
  CreateProductVariantRequest,
  ProductVariantResponse,
  ShortProduct,
  UpdateProductVariantRequest,
} from '@/utils/types/api/generatedApiGo'

const props = defineProps<{
  productId: string
  variants: ProductVariantResponse[]
}>()

const emit = defineEmits<{
  create: [payload: CreateProductVariantRequest]
  update: [variantId: string, payload: UpdateProductVariantRequest]
  delete: [variantId: string]
}>()

const { toast } = useToast()

interface VariantFormState {
  name: string
  slug: string
  description: string
  meta_title: string
  meta_h1: string
  meta_description: string
  meta_keyword: string
  category_id: string
  sort_order: number
  is_enable: boolean
}

const emptyForm = (): VariantFormState => ({
  name: '',
  slug: '',
  description: '',
  meta_title: '',
  meta_h1: '',
  meta_description: '',
  meta_keyword: '',
  category_id: '',
  sort_order: 0,
  is_enable: true,
})

const showAddForm = ref(false)
const editingVariantId = ref<string | null>(null)
const addForm = ref<VariantFormState>(emptyForm())
const editForms = ref<Record<string, VariantFormState>>({})
const showMetaAdd = ref(false)
const showMetaEdit = ref<Record<string, boolean>>({})
const showRelatedEdit = ref<Record<string, boolean>>({})
const relatedMap = ref<Record<string, ShortProduct[]>>({})
onMounted(async () => {
  const ids = props.variants.map((v) => v.id!).filter(Boolean)
  if (!ids.length) return
  try {
    relatedMap.value = await ProductService.getRelatedProductsBatch(ids)
  } catch {
    relatedMap.value = {}
  }
})

const saveRelated = async (variantId: string) => {
  try {
    const ids = (relatedMap.value[variantId] ?? []).map((p) => p.id!).filter(Boolean)
    await ProductService.syncRelatedProducts(variantId, { variant_ids: ids })
  } catch {
    toast({ title: 'Ошибка сохранения связанных товаров', variant: 'destructive' })
  }
}

const startEdit = (variant: ProductVariantResponse) => {
  editingVariantId.value = variant.id!
  editForms.value[variant.id!] = {
    name: variant.name || '',
    slug: variant.slug || '',
    description: variant.description || '',
    meta_title: variant.meta_title || '',
    meta_h1: variant.meta_h1 || '',
    meta_description: variant.meta_description || '',
    meta_keyword: variant.meta_keyword || '',
    category_id: variant.category_id?.uuid || '',
    sort_order: variant.sort_order || 0,
    is_enable: variant.is_enable ?? true,
  }
  showMetaEdit.value[variant.id!] = false
  showRelatedEdit.value[variant.id!] = false
}

const cancelEdit = () => {
  editingVariantId.value = null
}

const saveEdit = async (variantId: string) => {
  const form = editForms.value[variantId]
  emit('update', variantId, {
    id: variantId,
    name: form.name,
    slug: form.slug,
    description: form.description,
    meta_title: form.meta_title,
    meta_h1: form.meta_h1,
    meta_description: form.meta_description,
    meta_keyword: form.meta_keyword,
    category_id: form.category_id || undefined,
    sort_order: form.sort_order,
    is_enable: form.is_enable,
  })
  await saveRelated(variantId)
  editingVariantId.value = null
}

const saveAdd = () => {
  emit('create', {
    name: addForm.value.name,
    slug: addForm.value.slug,
    description: addForm.value.description,
    meta_title: addForm.value.meta_title,
    meta_h1: addForm.value.meta_h1,
    meta_description: addForm.value.meta_description,
    meta_keyword: addForm.value.meta_keyword,
    category_id: addForm.value.category_id || undefined,
    sort_order: addForm.value.sort_order,
    is_enable: addForm.value.is_enable,
  })
  addForm.value = emptyForm()
  showAddForm.value = false
  showMetaAdd.value = false
}

const cancelAdd = () => {
  addForm.value = emptyForm()
  showAddForm.value = false
  showMetaAdd.value = false
}
</script>

<template>
  <div class="space-y-3">
    <!-- Existing variants -->
    <div
      v-for="variant in variants"
      :key="variant.id"
      class="border rounded-lg overflow-hidden"
    >
      <!-- Collapsed row -->
      <div v-if="editingVariantId !== variant.id" class="flex items-center gap-3 px-4 py-3">
        <div class="flex-1 min-w-0">
          <div class="font-medium truncate">{{ variant.name }}</div>
          <div class="text-sm text-muted-foreground truncate">/{{ variant.slug }}</div>
        </div>
        <div
          class="text-xs px-2 py-0.5 rounded-full"
          :class="variant.is_enable ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'"
        >
          {{ variant.is_enable ? 'Активен' : 'Отключён' }}
        </div>
        <Button variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="startEdit(variant)">
          <Pencil class="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
          @click="emit('delete', variant.id!)"
        >
          <Trash2 class="h-4 w-4" />
        </Button>
      </div>

      <!-- Expanded edit form -->
      <div v-else class="p-4 space-y-4 bg-muted/30">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <div class="flex items-center h-6">
              <Label>Название</Label>
            </div>
            <Input v-model="editForms[variant.id!].name" placeholder="Название варианта" />
          </div>
          <div class="space-y-1.5">
            <div class="flex items-center justify-between h-6">
              <Label>Slug</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                class="h-6 gap-1 text-xs"
                @click="editForms[variant.id!].slug = generateSlugUtil(editForms[variant.id!].name)"
                :disabled="!editForms[variant.id!].name.trim()"
              >
                <Sparkles class="h-3 w-3" />
                Generate
              </Button>
            </div>
            <Input v-model="editForms[variant.id!].slug" placeholder="variant-slug" />
          </div>
          <div class="space-y-1.5 sm:col-span-2">
            <Label>Описание</Label>
            <Textarea v-model="editForms[variant.id!].description" placeholder="Описание варианта" rows="2" />
          </div>
          <div class="space-y-1.5">
            <Label>Sort order</Label>
            <Input type="number" v-model.number="editForms[variant.id!].sort_order" />
          </div>
          <div class="flex items-center gap-3 pt-5">
            <Switch v-model="editForms[variant.id!].is_enable" />
            <Label>Активен</Label>
          </div>
        </div>

        <!-- SEO toggle -->
        <button
          type="button"
          class="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          @click="showMetaEdit[variant.id!] = !showMetaEdit[variant.id!]"
        >
          {{ showMetaEdit[variant.id!] ? '▾' : '▸' }} SEO / Meta
        </button>
        <div v-if="showMetaEdit[variant.id!]" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <Label>Meta title</Label>
            <Input v-model="editForms[variant.id!].meta_title" />
          </div>
          <div class="space-y-1.5">
            <Label>Meta H1</Label>
            <Input v-model="editForms[variant.id!].meta_h1" />
          </div>
          <div class="space-y-1.5">
            <Label>Meta keyword</Label>
            <Input v-model="editForms[variant.id!].meta_keyword" />
          </div>
          <div class="space-y-1.5">
            <Label>Meta description</Label>
            <Textarea v-model="editForms[variant.id!].meta_description" rows="2" />
          </div>
        </div>

        <!-- Related products toggle -->
        <button
          type="button"
          class="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          @click="showRelatedEdit[variant.id!] = !showRelatedEdit[variant.id!]"
        >
          {{ showRelatedEdit[variant.id!] ? '▾' : '▸' }} Связанные товары
          <span v-if="relatedMap[variant.id!]?.length" class="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
            {{ relatedMap[variant.id!].length }}
          </span>
        </button>
        <div v-if="showRelatedEdit[variant.id!]" class="space-y-3">
          <ProductSearch
            :model-value="relatedMap[variant.id!] ?? []"
            @update:model-value="relatedMap[variant.id!] = $event"
          />
          <div v-if="relatedMap[variant.id!]?.length" class="border rounded-md divide-y">
            <div
              v-for="product in relatedMap[variant.id!]"
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
                @click="relatedMap[variant.id!] = relatedMap[variant.id!].filter(p => p.id !== product.id)"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
          </div>
          <div v-else class="text-sm text-muted-foreground text-center py-4 border rounded-md">
            Нет связанных товаров
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <Button variant="outline" size="sm" @click="cancelEdit">
            <X class="h-4 w-4 mr-1" />
            Отмена
          </Button>
          <Button size="sm" @click="saveEdit(variant.id!)">
            <Check class="h-4 w-4 mr-1" />
            Сохранить
          </Button>
        </div>
      </div>
    </div>

    <!-- Add new variant form -->
    <div v-if="showAddForm" class="border rounded-lg p-4 space-y-4 bg-muted/30">
      <div class="font-medium">Новый вариант</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <div class="flex items-center h-6">
            <Label>Название</Label>
          </div>
          <Input v-model="addForm.name" placeholder="Название варианта" />
        </div>
        <div class="space-y-1.5">
          <div class="flex items-center justify-between h-6">
            <Label>Slug</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              class="h-6 gap-1 text-xs"
              @click="addForm.slug = generateSlugUtil(addForm.name)"
              :disabled="!addForm.name.trim()"
            >
              <Sparkles class="h-3 w-3" />
              Generate
            </Button>
          </div>
          <Input v-model="addForm.slug" placeholder="variant-slug" />
        </div>
        <div class="space-y-1.5 sm:col-span-2">
          <Label>Описание</Label>
          <Textarea v-model="addForm.description" placeholder="Описание варианта" rows="2" />
        </div>
        <div class="space-y-1.5">
          <Label>Sort order</Label>
          <Input type="number" v-model.number="addForm.sort_order" />
        </div>
        <div class="flex items-center gap-3 pt-5">
          <Switch v-model="addForm.is_enable" />
          <Label>Активен</Label>
        </div>
      </div>

      <button
        type="button"
        class="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        @click="showMetaAdd = !showMetaAdd"
      >
        {{ showMetaAdd ? '▾' : '▸' }} SEO / Meta
      </button>
      <div v-if="showMetaAdd" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label>Meta title</Label>
          <Input v-model="addForm.meta_title" />
        </div>
        <div class="space-y-1.5">
          <Label>Meta H1</Label>
          <Input v-model="addForm.meta_h1" />
        </div>
        <div class="space-y-1.5">
          <Label>Meta keyword</Label>
          <Input v-model="addForm.meta_keyword" />
        </div>
        <div class="space-y-1.5">
          <Label>Meta description</Label>
          <Textarea v-model="addForm.meta_description" rows="2" />
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button variant="outline" size="sm" @click="cancelAdd">
          <X class="h-4 w-4 mr-1" />
          Отмена
        </Button>
        <Button size="sm" @click="saveAdd" :disabled="!addForm.name.trim() || !addForm.slug.trim()">
          <Check class="h-4 w-4 mr-1" />
          Добавить
        </Button>
      </div>
    </div>

    <Button
      v-if="!showAddForm"
      variant="outline"
      size="sm"
      class="w-full"
      @click="showAddForm = true"
    >
      <Plus class="h-4 w-4 mr-2" />
      Добавить вариант
    </Button>
  </div>
</template>
