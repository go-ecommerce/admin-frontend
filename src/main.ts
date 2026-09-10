import { createPinia } from 'pinia'
import { createYmaps } from 'vue-yandex-maps'

import { createApp } from 'vue'

import { intiRequests } from '@/utils/helpers/init'

import App from './App.vue'
import './assets/index.css'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(
  createYmaps({
    apikey: import.meta.env.VITE_YANDEX_MAPS_API_KEY || '',
  }),
)

intiRequests().then(() => app.mount('#app'))
