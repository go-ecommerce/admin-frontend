import type { RouteRecordSingleView } from 'vue-router'

import { APP_LAYOUT } from '@/layouts'
import auth from '@/router/middlewares/auth'

export const order: RouteRecordSingleView[] = [
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/order/OrderView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Orders', name: 'order' },
    },
  },
  {
    path: '/order/:number',
    name: 'order-detail',
    component: () => import('@/views/order/OrderDetailView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Orders', name: 'order' },
    },
  },
]
