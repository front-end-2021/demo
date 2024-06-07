import { createApp, ref } from 'vue'
//const { createApp, ref } = Vue
import CompNav from './comp-nav.js'
//import { createStore } from 'vuex'
//const { createStore } = Vuex
// const store = createStore({
//     state: {
//         counter: 0
//     }
// });
const app = createApp({
    setup() {
        const message = ref('Hello world')
        return { message }
    },
})
app.component('compnav', CompNav)
app.mount('#app')
//app.use(store)