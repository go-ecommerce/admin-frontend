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
          New attribute
        </span>
      </div>
      <Button size="sm" class="h-7 gap-1" @click="saveAll">
        <PlusCircle class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Save </span>
      </Button>
    </div>
  </div>
  <main class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:px-6 sm:py-0 md:gap-8">
    <div class="col-span-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attribute info</CardTitle>
        </CardHeader>
        <CardContent>
          <AttributeForm v-model="attributeInfo" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
            <p class="font-medium mb-2">💡 Add values on the next step</p>
            <p>
              After saving, you'll be redirected to the edit page where you can add predefined
              values. This is especially useful for 'select' type attributes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
</template>
<script setup lang="ts">
import { CornerUpLeft, PlusCircle } from 'lucide-vue-next'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AttributeForm from '@/components/attribute/AttributeForm.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAttributeStore } from '@/stores/attribute'
import type { CreateAttributeRequest } from '@/utils/types/api/generatedApiGo'

const router = useRouter()
const { createAttribute } = useAttributeStore()
const attributeInfo = ref<CreateAttributeRequest>({
  name: '',
  slug: '',
  type: 'text',
  unit: undefined,
  is_visible: true,
  is_filterable: false,
  is_required: false,
  attribute_group_id: undefined,
  sort_order: 0,
})

const saveAll = async () => {
  try {
    const result = await createAttribute(attributeInfo.value)
    console.log('Created attribute result:', result)

    // Redirect to edit page so user can add values immediately
    if (result?.id) {
      console.log('Redirecting to edit page with ID:', result.id)
      await router.push({ name: 'attribute-edit', params: { id: result.id } })
    } else {
      console.log('No ID found, redirecting to list')
      await router.push({ name: 'attribute' })
    }
  } catch (error) {
    console.error('Error creating attribute:', error)
  }
}
</script>
