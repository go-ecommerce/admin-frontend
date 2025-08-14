import router from '@/router'
import { useAuthStore } from '@/stores/auth'

export const intiRequests = async () => {
  try {
    await router.isReady()
    if (useAuthStore().isLoggedIn) {
      await useAuthStore().initStore()
    }
  } catch (error: any) {
    throw error
  }
}
