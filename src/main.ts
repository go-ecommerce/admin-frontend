import { createPinia } from 'pinia'

import { createApp } from 'vue'

import { intiRequests } from '@/utils/helpers/init'

import App from './App.vue'
import './assets/index.css'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

intiRequests().then(() => app.mount('#app'))
