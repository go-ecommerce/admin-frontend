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
          New attribute group
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
          <CardTitle>Attribute group info</CardTitle>
        </CardHeader>
        <CardContent>
          <AttributeGroupForm v-model="attributeGroupInfo" />
        </CardContent>
      </Card>
    </div>
  </main>
</template>
<script setup lang="ts">
import { CornerUpLeft, PlusCircle } from 'lucide-vue-next'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AttributeGroupForm from '@/components/attribute/AttributeGroupForm.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAttributeStore } from '@/stores/attribute'
import type { CreateAttributeGroupRequest } from '@/utils/types/api/generatedApiGo'

const router = useRouter()
const { createAttributeGroup } = useAttributeStore()
const attributeGroupInfo = ref<CreateAttributeGroupRequest>({
  name: '',
  slug: '',
  description: undefined,
})

const saveAll = async () => {
  try {
    const result = await createAttributeGroup(attributeGroupInfo.value)
    // Redirect to edit page (or list if no ID)
    if (result?.id) {
      await router.push({ name: 'attribute-group-edit', params: { id: result.id } })
    } else {
      await router.push({ name: 'attribute-group' })
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
