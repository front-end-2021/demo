import { createApp, ref } from 'vue'
import CompNav from './comp-nav.js'
// import { createStore } from 'vuex'
// const store = createStore({
//     state() {
//         return {
//             count: 0
//         }
//     },
//     mutations: {
//         increment(state) {
//             state.count++
//         }
//     }
// })
const app = createApp({
    setup() {
        const message = ref('Hello world')
        return { message }
    },
})
app.component('comp-nav', CompNav)
app.mount('#app')
//app.use(store)
