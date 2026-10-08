<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { Minus, Plus, Trash2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { computed, ref, watch } from 'vue'

import OrderVariantSearch from '@/components/order/OrderVariantSearch.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast/use-toast'
import { useOrderStore } from '@/stores/order'
import { extractApiErrorMessage } from '@/utils/apiError'
import { fileSrc } from '@/utils/media'
import { formatOrderMoney } from '@/utils/order'
import type {
  AdminOrderItemsEditResponse,
  AdminOrderLineRequest,
  AdminOrderResponse,
  OrderItemResponse,
  VariantCardResponse,
} from '@/utils/types/api/generatedApiGo'

type DraftLine = {
  key: string
  variant_id: string
  quantity: number
  name?: string
  sku?: string
  unit_price?: number
  image_path?: string
}

const props = defineProps<{
  order: AdminOrderResponse
}>()

const emit = defineEmits<{
  cancel: []
  saved: [result: AdminOrderItemsEditResponse]
}>()

const { toast } = useToast()
const orderStore = useOrderStore()
const { isLoading } = storeToRefs(orderStore)
const { previewOrderItems, updateOrderItems } = orderStore

const money = (value?: number) => formatOrderMoney(value, props.order.currency)

const draftLines = ref<DraftLine[]>([])
const comment = ref('')
const preview = ref<AdminOrderItemsEditResponse | null>(null)
const previewError = ref('')
const previewLoading = ref(false)
const saving = ref(false)
let draftKey = 0
let previewSeq = 0

const isPaidLike = computed(
  () =>
    props.order.payment_status === 'paid' || props.order.payment_status === 'partially_refunded',
)

const toDraft = (items: OrderItemResponse[] = []): DraftLine[] =>
  items
    .filter((item) => Boolean(item.variant_id))
    .map((item) => ({
      key: `existing-${item.variant_id}-${++draftKey}`,
      variant_id: item.variant_id!,
      quantity: Math.max(1, item.quantity ?? 1),
      name: item.name,
      sku: item.sku || item.slug,
      unit_price: item.unit_price,
      image_path: item.image_path,
    }))

const resetDraft = () => {
  draftLines.value = toDraft(props.order.items)
  comment.value = ''
  preview.value = null
  previewError.value = ''
}

resetDraft()

watch(
  () => props.order.number,
  () => resetDraft(),
)

const buildLinesPayload = (): AdminOrderLineRequest[] => {
  const merged = new Map<string, number>()
  for (const line of draftLines.value) {
    if (!line.variant_id) continue
    merged.set(line.variant_id, (merged.get(line.variant_id) ?? 0) + line.quantity)
  }
  return [...merged.entries()].map(([variant_id, quantity]) => ({ variant_id, quantity }))
}

const linesSignature = computed(() =>
  JSON.stringify(buildLinesPayload().sort((a, b) => a.variant_id.localeCompare(b.variant_id))),
)

const canSave = computed(() => {
  const order = preview.value?.order
  return (
    draftLines.value.length > 0 &&
    order != null &&
    order.version != null &&
    order.grand_total != null &&
    !previewError.value &&
    !previewLoading.value
  )
})

const runPreview = async () => {
  if (!props.order.number) return
  const lines = buildLinesPayload()
  if (!lines.length) {
    preview.value = null
    previewError.value = 'В заказе должна остаться хотя бы одна позиция'
    return
  }

  const seq = ++previewSeq
  previewLoading.value = true
  previewError.value = ''
  try {
    const result = await previewOrderItems(props.order.number, { lines })
    if (seq !== previewSeq) return
    preview.value = result
  } catch (error: unknown) {
    if (seq !== previewSeq) return
    preview.value = null
    previewError.value = extractApiErrorMessage(error, 'Не удалось пересчитать состав')
  } finally {
    if (seq === previewSeq) previewLoading.value = false
  }
}

// Drop stale preview as soon as lines change; debounce only the network call.
watch(linesSignature, () => {
  preview.value = null
  previewError.value = ''
})

watchDebounced(linesSignature, () => void runPreview(), { debounce: 400, immediate: true })

const setQuantity = (line: DraftLine, next: number) => {
  const quantity = Math.floor(Number(next))
  if (!Number.isFinite(quantity) || quantity < 1) {
    line.quantity = 1
    return
  }
  line.quantity = Math.min(100000, quantity)
}

const increase = (line: DraftLine) => setQuantity(line, line.quantity + 1)
const decrease = (line: DraftLine) => {
  if (line.quantity <= 1) return
  setQuantity(line, line.quantity - 1)
}

const removeLine = (key: string) => {
  draftLines.value = draftLines.value.filter((line) => line.key !== key)
}

const addVariant = (variant: VariantCardResponse) => {
  if (!variant.id) return
  const existing = draftLines.value.find((line) => line.variant_id === variant.id)
  if (existing) {
    existing.quantity += 1
    return
  }
  draftLines.value.push({
    key: `new-${variant.id}-${++draftKey}`,
    variant_id: variant.id,
    quantity: 1,
    name: variant.name,
    sku: variant.model || variant.slug,
    unit_price: variant.price_retail,
  })
}

const save = async () => {
  const orderNumber = props.order.number
  if (!orderNumber) return

  const lines = buildLinesPayload()
  if (!lines.length) {
    previewError.value = 'В заказе должна остаться хотя бы одна позиция'
    return
  }

  saving.value = true
  try {
    // Fresh preview right before apply — avoids stale totals / string|number drift.
    await runPreview()
    const previewOrder = preview.value?.order
    const expectedVersion = previewOrder?.version
    const expectedGrandTotal = previewOrder?.grand_total
    if (expectedVersion == null || expectedGrandTotal == null) {
      toast({
        title: 'Нет данных превью',
        description: previewError.value || 'Пересчитайте состав и попробуйте снова',
        variant: 'destructive',
      })
      return
    }

    const result = await updateOrderItems(orderNumber, {
      lines,
      expected_version: expectedVersion,
      // Runtime JSON may be a decimal string; service accepts number | string.
      expected_grand_total: expectedGrandTotal as unknown as number,
      comment: comment.value.trim() || undefined,
    })
    emit('saved', result)
  } catch {
    // toast in store; refresh preview in case of version conflict
    void runPreview()
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-muted-foreground">
      Меняйте количество, удаляйте строки или добавляйте варианты. У оплаченного заказа итог можно
      только уменьшить — переплата уйдёт в возврат.
    </p>

    <div class="divide-y rounded-md border">
      <div
        v-for="line in draftLines"
        :key="line.key"
        class="flex items-center gap-3 p-3"
      >
        <img
          v-if="fileSrc(line.image_path)"
          :src="fileSrc(line.image_path)"
          :alt="line.name"
          class="size-12 shrink-0 rounded border object-cover"
        />
        <div class="min-w-0 flex-1">
          <div class="truncate text-sm font-medium">{{ line.name || 'Товар' }}</div>
          <div class="truncate text-xs text-muted-foreground">
            {{ line.sku || line.variant_id }}
            <template v-if="line.unit_price != null"> · {{ money(line.unit_price) }}</template>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            class="size-8"
            :disabled="line.quantity <= 1 || saving"
            @click="decrease(line)"
          >
            <Minus class="h-3.5 w-3.5" />
          </Button>
          <Input
            class="h-8 w-14 text-center"
            type="number"
            min="1"
            :model-value="line.quantity"
            :disabled="saving"
            @update:model-value="(v) => setQuantity(line, Number(v))"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            class="size-8"
            :disabled="saving"
            @click="increase(line)"
          >
            <Plus class="h-3.5 w-3.5" />
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          class="size-8 text-destructive"
          :disabled="saving"
          @click="removeLine(line.key)"
        >
          <Trash2 class="h-4 w-4" />
        </Button>
      </div>
      <div v-if="!draftLines.length" class="p-6 text-center text-sm text-muted-foreground">
        Нет позиций — добавьте хотя бы один товар
      </div>
    </div>

    <OrderVariantSearch
      :currency="order.currency"
      :disabled="saving"
      @select="addVariant"
    />

    <div class="grid gap-1.5">
      <Label for="items_comment">Комментарий к изменению</Label>
      <Textarea
        id="items_comment"
        v-model="comment"
        rows="2"
        maxlength="2000"
        placeholder="Необязательно"
        :disabled="saving"
      />
    </div>

    <div class="rounded-md border bg-muted/40 px-3 py-2 text-sm space-y-1">
      <div class="flex justify-between">
        <span class="text-muted-foreground">Сейчас</span>
        <span>{{ money(order.grand_total) }}</span>
      </div>
      <div class="flex justify-between font-medium">
        <span>После изменения</span>
        <span v-if="previewLoading">…</span>
        <span v-else-if="preview?.order">{{ money(preview.order.grand_total) }}</span>
        <span v-else>—</span>
      </div>
      <div
        v-if="(preview?.refund_due ?? 0) > 0"
        class="flex justify-between text-amber-700 dark:text-amber-400"
      >
        <span>К возврату после сохранения</span>
        <span>{{ money(preview?.refund_due) }}</span>
      </div>
      <p v-if="isPaidLike && !previewError" class="text-xs text-muted-foreground pt-1">
        Для оплаченного заказа нельзя увеличить сумму.
      </p>
      <p v-if="previewError" class="text-sm text-destructive pt-1">{{ previewError }}</p>
    </div>

    <div class="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        class="h-8"
        :disabled="saving"
        @click="emit('cancel')"
      >
        Отмена
      </Button>
      <Button
        type="button"
        size="sm"
        class="h-8"
        :disabled="!canSave || saving || isLoading"
        @click="save"
      >
        {{ saving ? 'Сохранение…' : 'Сохранить состав' }}
      </Button>
    </div>
  </div>
</template>
