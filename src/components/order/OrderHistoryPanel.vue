<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

import { computed } from 'vue'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  diffOrderEditLines,
  formatOrderActor,
  formatOrderDate,
  formatOrderMoney,
  refundStatusClass,
  refundStatusLabel,
} from '@/utils/order'
import type { OrderEditResponse, RefundResponse } from '@/utils/types/api/generatedApiGo'

const props = defineProps<{
  refunds: RefundResponse[]
  edits: OrderEditResponse[]
  currency?: string
  loading?: boolean
}>()

const money = (value?: number) => formatOrderMoney(value, props.currency)

const editRows = computed(() =>
  props.edits.map((edit) => ({
    edit,
    diffs: diffOrderEditLines(edit.lines_before, edit.lines_after),
  })),
)
</script>

<template>
  <Tabs default-value="refunds" class="w-full">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="refunds">Возвраты</TabsTrigger>
      <TabsTrigger value="edits">Изменения состава</TabsTrigger>
    </TabsList>

    <TabsContent value="refunds" class="mt-4 space-y-2">
      <p v-if="loading" class="text-sm text-muted-foreground">Загрузка…</p>
      <p v-else-if="!refunds.length" class="text-sm text-muted-foreground">Возвратов пока нет</p>
      <div
        v-for="item in refunds"
        :key="item.id"
        class="rounded-md border px-3 py-2 text-sm space-y-1"
        :class="
          item.status === 'pending'
            ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30'
            : ''
        "
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="font-medium">{{ money(item.amount) }}</div>
          <span
            class="text-xs px-2 py-0.5 rounded-full"
            :class="refundStatusClass(item.status)"
          >
            {{ refundStatusLabel(item.status) }}
          </span>
        </div>
        <div class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{{ formatOrderDate(item.created_at) }}</span>
          <span>{{ formatOrderActor(item.actor) }}</span>
        </div>
        <p v-if="item.reason" class="text-muted-foreground">{{ item.reason }}</p>
        <p v-if="item.status === 'pending'" class="text-xs text-amber-700 dark:text-amber-400">
          Проверьте статус в личном кабинете банка — исход ещё неизвестен.
        </p>
      </div>
    </TabsContent>

    <TabsContent value="edits" class="mt-4 space-y-2">
      <p v-if="loading" class="text-sm text-muted-foreground">Загрузка…</p>
      <p v-else-if="!edits.length" class="text-sm text-muted-foreground">
        Изменений состава пока нет
      </p>
      <Collapsible
        v-for="row in editRows"
        :key="row.edit.id"
        class="rounded-md border px-3 py-2 text-sm"
      >
        <CollapsibleTrigger
          class="flex w-full items-start justify-between gap-2 text-left [&[data-state=open]>svg]:rotate-180"
        >
          <div class="min-w-0 space-y-1">
            <div class="font-medium">
              {{ money(row.edit.grand_total_before) }}
              →
              {{ money(row.edit.grand_total_after) }}
            </div>
            <div class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{{ formatOrderDate(row.edit.created_at) }}</span>
              <span>{{ formatOrderActor(row.edit.actor) }}</span>
            </div>
            <p v-if="row.edit.comment" class="text-muted-foreground">{{ row.edit.comment }}</p>
          </div>
          <ChevronDown class="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent class="mt-2 space-y-1 border-t pt-2">
          <p v-if="!row.diffs.length" class="text-xs text-muted-foreground">
            Состав строк не менялся
          </p>
          <div
            v-for="(diff, index) in row.diffs"
            :key="index"
            class="text-xs"
            :class="{
              'text-red-700 dark:text-red-400': diff.kind === 'removed',
              'text-green-700 dark:text-green-400': diff.kind === 'added',
              'text-foreground': diff.kind === 'changed',
            }"
          >
            <template v-if="diff.kind === 'removed'">
              Удалено: {{ diff.line.name || diff.line.sku || '—' }}
              ({{ diff.line.quantity }} × {{ money(diff.line.unit_price) }})
            </template>
            <template v-else-if="diff.kind === 'added'">
              Добавлено: {{ diff.line.name || diff.line.sku || '—' }}
              ({{ diff.line.quantity }} × {{ money(diff.line.unit_price) }})
            </template>
            <template v-else>
              Изменено: {{ diff.after.name || diff.after.sku || '—' }} —
              {{ diff.before.quantity }} → {{ diff.after.quantity }}
            </template>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </TabsContent>
  </Tabs>
</template>
