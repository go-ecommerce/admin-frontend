import type { RouteRecordRaw } from 'vue-router'

import { attribute } from '@/router/modules/attribute.ts'
import { auth } from '@/router/modules/auth.ts'
import { category } from '@/router/modules/category.ts'
import { collection } from '@/router/modules/collection.ts'
import { dashboard } from '@/router/modules/dashboard.ts'
import { order } from '@/router/modules/order.ts'
import { product } from '@/router/modules/product.ts'
import { review } from '@/router/modules/review.ts'

export const routes: RouteRecordRaw[] = [
  ...auth,
  ...dashboard,
  ...order,
  ...review,
  ...category,
  ...collection,
  ...product,
  ...attribute,
]
