import { createApp, ref } from 'vue'
import CompNav from './comp-nav.js'
const app = createApp({
    setup() {
        const message = ref('Hello world')
        return { message }
    },
})
app.component('comp-nav', CompNav)
app.mount('#app')
