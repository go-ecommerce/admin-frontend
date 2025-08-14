import { createRouter, createWebHistory } from 'vue-router'

import { routes } from '@/router/routes'
import type { TMiddlewareFunction } from '@/router/types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const middleware: TMiddlewareFunction | undefined =
    to && to.meta && to.meta.middleware && to.meta.middleware.length
      ? to.meta.middleware[0]
      : undefined
  if (!middleware) return next()
  middleware({ to, from, next })
})

export default router
