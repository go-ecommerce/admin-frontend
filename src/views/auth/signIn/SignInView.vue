<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { ref } from 'vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth'
import type { AuthRequest } from '@/utils/types/api/generatedApiGo'

const { isLoading } = storeToRefs(useAuthStore())
const { login } = useAuthStore()

const form = ref<AuthRequest>({ email: '', password: '' })
</script>

<template>
  <div class="w-full lg:grid lg:grid-cols-2 min-h-screen">
    <div class="flex items-center justify-center py-12">
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
              placeholder="m@example.com"
              required
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Пароль</Label>
            </div>
            <Input id="password" type="password" v-model="form.password" required />
          </div>
          <Button type="submit" class="w-full"> Вход </Button>
        </form>
      </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <!--      <img-->
      <!--        src="/placeholder.svg"-->
      <!--        alt="Image"-->
      <!--        width="1920"-->
      <!--        height="1080"-->
      <!--        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"-->
      <!--      >-->
    </div>
  </div>
</template>
