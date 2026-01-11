<script setup lang="ts">
import { CornerUpLeft, PlusCircle } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AttributeForm from '@/components/attribute/AttributeForm.vue'
import AttributeValueManager from '@/components/attribute/AttributeValueManager.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast'
import { useAttributeStore } from '@/stores/attribute'
import type {
  CreateAttributeRequest,
  CreateAttributeValueRequest,
} from '@/utils/types/api/generatedApiGo'

const attributeStore = useAttributeStore()
const {
  getAttributeById,
  updateAttribute,
  clearCurrentAttribute,
  getAttributeValuesByAttributeId,
  createAttributeValue,
  deleteAttributeValue,
} = attributeStore
const { currentAttribute, attributeValues } = storeToRefs(attributeStore)
const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const uuid = typeof route.params.id === 'string' ? route.params.id : ''

const loadAttributeValues = async () => {
  if (!uuid) return
  try {
    await getAttributeValuesByAttributeId(uuid)
  } catch (error) {
    console.error('Failed to load attribute values:', error)
  }
}

onMounted(async () => {
  clearCurrentAttribute()
  if (uuid) {
    try {
      await getAttributeById(uuid)
      await loadAttributeValues()
    } catch (error: any) {
      toast({
        title: 'Error loading attribute',
        description: error.message || 'Failed to load attribute data',
        variant: 'destructive',
      })
    }
  } else {
    toast({
      title: 'Error',
      description: 'Attribute ID not specified',
      variant: 'destructive',
    })
    await router.push({ name: 'attribute' })
  }
})

const handleAddValue = async (valueData: {
  value: string
  value_normalized?: string
  value_numeric?: number
  display_order: number
  is_active: boolean
}) => {
  if (!uuid) return

  try {
    const request: CreateAttributeValueRequest = {
      attribute_id: uuid,
      ...valueData,
    }
    await createAttributeValue(request)
    await loadAttributeValues()
    toast({
      title: '✅ Value added',
      variant: 'success',
    })
  } catch (error: any) {
    toast({
      title: 'Error adding value',
      description: error.message,
      variant: 'destructive',
    })
  }
}

const handleDeleteValue = async (id: string) => {
  try {
    await deleteAttributeValue(id)
    await loadAttributeValues()
  } catch (error: any) {
    toast({
      title: 'Error deleting value',
      description: error.message,
      variant: 'destructive',
    })
  }
}

const updateWithUpload = async () => {
  if (!currentAttribute.value?.id) {
    throw new Error('Attribute not selected')
  }

  try {
    const attributeGroupId = currentAttribute.value.attribute_group_id?.valid
      ? currentAttribute.value.attribute_group_id.uuid
      : undefined

    const updateRequest: CreateAttributeRequest = {
      name: currentAttribute.value.name || '',
      slug: currentAttribute.value.slug || '',
      type: (currentAttribute.value.type as 'text' | 'number' | 'select' | 'boolean') || 'text',
      unit: currentAttribute.value.unit,
      is_visible: currentAttribute.value.is_visible,
      is_filterable: currentAttribute.value.is_filterable,
      is_required: currentAttribute.value.is_required,
      attribute_group_id: attributeGroupId,
      sort_order: currentAttribute.value.sort_order,
    }

    await updateAttribute(updateRequest)
    toast({
      title: '✅ Attribute updated',
      variant: 'success',
    })
    await router.push({ name: 'attribute' })
  } catch (error: any) {
    toast({
      title: 'Error updating attribute',
      description: error.message || 'Failed to update attribute',
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
          @click="router.push({ name: 'attribute' })"
        >
          <CornerUpLeft class="h-3.5 w-3.5" />
        </Button>
        <span class="text-2xl font-semibold sr-only sm:not-sr-only sm:whitespace-nowrap">
          Edit attribute
        </span>
      </div>
      <Button size="sm" class="h-7 gap-1" @click="updateWithUpload">
        <PlusCircle class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Update </span>
      </Button>
    </div>
  </div>
  <main class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Attribute Info</CardTitle>
      </CardHeader>
      <CardContent>
        <AttributeForm v-if="currentAttribute" v-model="currentAttribute" />
      </CardContent>
    </Card>

    <Card v-if="currentAttribute?.id" class="col-span-2 space-y-6">
      <CardHeader>
        <CardTitle>Values</CardTitle>
        <p class="text-sm text-muted-foreground mt-2">
          <span v-if="currentAttribute.type === 'select'">
            Define possible values for this select attribute
          </span>
          <span v-else-if="currentAttribute.type === 'number'">
            Optional: Define predefined numeric values
          </span>
          <span v-else> Optional: Values are typically used for 'select' type attributes </span>
        </p>
      </CardHeader>
      <CardContent>
        <AttributeValueManager
          :attribute-id="currentAttribute.id"
          :values="attributeValues?.items || []"
          @add-value="handleAddValue"
          @delete-value="handleDeleteValue"
        />
      </CardContent>
    </Card>
  </main>
</template>
