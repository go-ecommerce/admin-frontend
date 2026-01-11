import type { RouteRecordRaw } from 'vue-router'

import { auth } from '@/router/modules/auth.ts'
import { category } from '@/router/modules/category.ts'
import { collection } from '@/router/modules/collection.ts'
import { dashboard } from '@/router/modules/dashboard.ts'
import { product } from '@/router/modules/product.ts'
import { attribute } from '@/router/modules/attribute.ts'

export const routes: RouteRecordRaw[] = [
  ...auth,
  ...dashboard,
  ...category,
  ...collection,
  ...product,
  ...attribute
]
