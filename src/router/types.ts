import type { NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

import type { APP_LAYOUT } from '@/layouts'

export interface IContext {
  to: RouteLocationNormalized
  from: RouteLocationNormalized
  next: NavigationGuardNext
}

export type MiddlewareReturnValue = boolean | void | RouteLocationRaw
export type Middleware = (
  context: IContext,
) => MiddlewareReturnValue | Promise<MiddlewareReturnValue>
export type TMiddlewareFunction = (context: IContext) => void

declare module 'vue-router' {
  interface RouteMeta {
    layout: APP_LAYOUT
    middleware?: Middleware[]
    title?: string
    subtitle?: string
    breadcrumb?: {
      title: string
      name: string
    }
  }
}
