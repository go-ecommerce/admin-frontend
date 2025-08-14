import type { IContext } from '@/router/types'
import { useAuthStore } from '@/stores/auth'

export default function auth({ next }: IContext): void {
  if (!useAuthStore().isLoggedIn) {
    return next({ name: 'auth' })
  }
  return next()
}
