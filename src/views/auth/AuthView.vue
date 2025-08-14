<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="auth">
    <div class="auth__header">
      <div class="auth__header-title">
        <h1>{{ route?.meta?.title ? route?.meta?.title : '' }}</h1>
        <p>{{ route?.meta?.subtitle ? route?.meta?.subtitle : '' }}</p>
      </div>
    </div>
    <RouterView />
  </div>
</template>
