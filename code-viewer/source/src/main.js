import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { inViewPlugin } from './directives/inView'
import './styles.css'

// Map ở root app: Element → state của v-in-view (observer, throttle, trạng thái hiển thị…)
const inViewRegistry = new Map()

createApp(App).use(createPinia()).use(inViewPlugin, inViewRegistry).mount('#app')
