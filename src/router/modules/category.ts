import type {
  RouteRecordSingleView,
} from 'vue-router'

import { APP_LAYOUT } from '@/layouts'
import auth from '@/router/middlewares/auth'

export const category: RouteRecordSingleView[] = [
  {
    path: '/category',
    name: 'category',
    component: () => import('@/views/category/CategoryView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Category', name: 'category' },
    },
  },
  {
    path: '/category/create',
    name: 'category-create',
    component: () => import('@/views/category/CreateCategoryView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Category', name: 'category' },
    },
  },
  {
    path: '/category/:id/edit',
    name: 'category-edit',
    component: () => import('@/views/category/EditCategoryView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Category', name: 'category' },
    },
  },
]
