import type { IContext } from '@/router/types'
import { useAuthStore } from '@/stores/auth'

export default function guest({ next }: IContext) {
  if (useAuthStore().isLoggedIn) {
    return next({ name: 'dashboard' })
  }
  return next()
}
