import type {
  RouteRecordSingleView,
} from 'vue-router'

import { APP_LAYOUT } from '@/layouts'
import auth from '@/router/middlewares/auth'

export const collection: RouteRecordSingleView[] = [
  {
    path: '/collection',
    name: 'collection',
    component: () => import('@/views/collection/CollectionView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Collection', name: 'collection' },
    },
  },
  {
    path: '/collection/create',
    name: 'collection-create',
    component: () => import('@/views/collection/CreateCollectionView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Collection', name: 'collection' },
    },
  },
  {
    path: '/collection/:id/edit',
    name: 'collection-edit',
    component: () => import('@/views/collection/EditCollectionView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Collection', name: 'collection' },
    },
  },
]
