import type { RouteRecordRaw } from 'vue-router'

import { APP_LAYOUT } from '@/layouts'
import auth from '@/router/middlewares/auth'

export const dashboard: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: {
        title: 'Обзор',
        name: 'dashboard',
      },
    },
  },
  {
    path: '/',
    name: 'home',
    redirect: { name: 'dashboard' },
  },
]
