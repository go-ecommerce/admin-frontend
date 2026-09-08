import type { RouteRecordSingleView } from 'vue-router'

import { APP_LAYOUT } from '@/layouts'
import auth from '@/router/middlewares/auth'

export const review: RouteRecordSingleView[] = [
  {
    path: '/product-review',
    name: 'product-review',
    component: () => import('@/views/review/ProductReviewView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Отзывы', name: 'product-review' },
    },
  },
  {
    path: '/product-review/:id',
    name: 'product-review-detail',
    component: () => import('@/views/review/ProductReviewDetailView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Отзывы', name: 'product-review' },
    },
  },
]
