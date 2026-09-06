import { defineStore } from 'pinia'

import { normalizeFieldErrors } from '@/utils/apiError'

export const useErrorStore = defineStore('error', {
  state: () => {
    return {
      errors: {} as Record<string, string>,
    }
  },
  getters: {
    getError(state) {
      return (name: string) => state.errors[name]
    },
    hasError(state) {
      return Object.keys(state.errors).length > 0
    },
  },
  actions: {
    resetError() {
      this.errors = {}
    },
    setErrors(errors: unknown) {
      this.errors = normalizeFieldErrors(
        errors as Parameters<typeof normalizeFieldErrors>[0],
      )
    },
    clearError(name: string) {
      if (this.errors[name]) {
        delete this.errors[name]
      }
    },
  },
})
