<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { ref } from 'vue'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth'
import type { AuthRequest } from '@/utils/types/api/generatedApiGo'

const { isLoading, loginError } = storeToRefs(useAuthStore())
const { login } = useAuthStore()

const form = ref<AuthRequest>({ email: '', password: '' })
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="mx-auto grid w-[350px] gap-6">
      <div class="grid gap-2 text-center">
        <h1 class="text-3xl font-bold">Войти</h1>
        <p class="text-balance text-muted-foreground">
          Введите свой адрес электронной почты ниже, чтобы войти в свою учетную запись
        </p>
      </div>
      <form @submit.prevent="login(form)" class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="email@example.com"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="grid gap-2">
          <Label for="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            v-model="form.password"
            required
            :disabled="isLoading"
          />
        </div>
        <Alert v-if="loginError" variant="destructive">
          <AlertDescription>{{ loginError }}</AlertDescription>
        </Alert>
        <Button type="submit" class="w-full" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="animate-spin" />
          {{ isLoading ? 'Вход…' : 'Вход' }}
        </Button>
      </form>
    </div>
  </div>
</template>
