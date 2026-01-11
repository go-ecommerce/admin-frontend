<script setup lang="ts">
import { CornerUpLeft, PlusCircle } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AttributeGroupForm from '@/components/attribute/AttributeGroupForm.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast'
import { useAttributeStore } from '@/stores/attribute'
import type { UpdateAttributeGroupRequest } from '@/utils/types/api/generatedApiGo'

// Инициализация хранилища, роутера и toast
const attributeStore = useAttributeStore()
const { getAttributeGroupById, updateAttributeGroup } = attributeStore
const { currentAttributeGroup } = storeToRefs(attributeStore)
const route = useRoute()
const router = useRouter()
const { toast } = useToast()

// Получение UUID из параметров маршрута
const uuid = typeof route.params.id === 'string' ? route.params.id : ''

onMounted(async () => {
  if (uuid) {
    try {
      await getAttributeGroupById(uuid)
    } catch (error: any) {
      toast({
        title: 'Error loading attribute group',
        description: error.message || 'Failed to load attribute group data',
        variant: 'destructive',
      })
    }
  } else {
    toast({
      title: 'Error',
      description: 'Attribute group ID not specified',
      variant: 'destructive',
    })
    await router.push({ name: 'attribute-group' })
  }
})

// Обновление группы атрибутов
const updateWithUpload = async () => {
  if (!currentAttributeGroup.value?.id) {
    throw new Error('Attribute group not selected')
  }

  try {
    // Подготовка данных для обновления
    const updateRequest: UpdateAttributeGroupRequest = {
      ...(currentAttributeGroup.value as UpdateAttributeGroupRequest),
    }

    // Обновление группы атрибутов
    await updateAttributeGroup(updateRequest)
    toast({
      title: '✅ Attribute group updated',
      variant: 'success',
    })
    await router.push({ name: 'attribute-group' })
  } catch (error: any) {
    toast({
      title: 'Error updating attribute group',
      description: error.message || 'Failed to update attribute group',
      variant: 'destructive',
    })
  }
}
</script>

<template>
  <div class="p-4 sm:px-6 md:gap-8">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          class="h-7 gap-1"
          @click="router.push({ name: 'attribute-group' })"
        >
          <CornerUpLeft class="h-3.5 w-3.5" />
        </Button>
        <span class="text-2xl font-semibold sr-only sm:not-sr-only sm:whitespace-nowrap">
          Edit attribute group
        </span>
      </div>
      <Button size="sm" class="h-7 gap-1" @click="updateWithUpload">
        <PlusCircle class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Update </span>
      </Button>
    </div>
  </div>
  <main class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:px-6 sm:py-0 md:gap-8">
    <div class="col-span-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Info about attribute group</CardTitle>
        </CardHeader>
        <CardContent>
          <AttributeGroupForm v-if="currentAttributeGroup" v-model="currentAttributeGroup" />
        </CardContent>
      </Card>
    </div>
  </main>
</template>
