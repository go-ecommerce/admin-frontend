import type { RouteRecordSingleView } from 'vue-router';



import { APP_LAYOUT } from '@/layouts';
import auth from '@/router/middlewares/auth.ts';





export const attribute: RouteRecordSingleView[] = [
  {
    path: '/attribute-group',
    name: 'attribute-group',
    component: () => import('@/views/attribute/AttributeGroupView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Attribute-group', name: 'attribute-group' },
    },
  },
  {
    path: '/attribute-group/create',
    name: 'attribute-group-create',
    component: () => import('@/views/attribute/CreateAttributeGroupView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Create Attribute Group', name: 'attribute-group-create' },
    },
  },
  {
    path: '/attribute-group/:id/edit',
    name: 'attribute-group-edit',
    component: () => import('@/views/attribute/EditAttributeGroupView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Edit Attribute Group', name: 'attribute-group-edit' },
    },
  },

  {
    path: '/attribute',
    name: 'attribute',
    component: () => import('@/views/attribute/AttributeView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Attribute', name: 'attribute' },
    },
  },
  {
    path: '/attribute/create',
    name: 'attribute-create',
    component: () => import('@/views/attribute/CreateAttributeView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Create Attribute', name: 'attribute-create' },
    },
  },
  {
    path: '/attribute/:id/edit',
    name: 'attribute-edit',
    component: () => import('@/views/attribute/EditAttributeView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Edit Attribute', name: 'attribute-edit' },
    },
  },

  {
    path: '/attribute-value',
    name: 'attribute-value',
    component: () => import('@/views/attribute/AttributeValueView.vue'),
    meta: {
      layout: APP_LAYOUT.DEFAULT,
      middleware: [auth],
      breadcrumb: { title: 'Attribute Values', name: 'attribute-value' },
    },
  },
]
