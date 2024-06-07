// import { createApp, ref } from 'vue'
// import CompNav from './comp-nav.js'
//import { createStore } from 'vuex'

const { createApp } = Vue
const app = createApp({
    computed: {
        message() { return store.getters.message }
    },
    methods: {
        increment() {
            this.$store.commit('increment')
            console.log(this.$store.state.count)
        }
    }
})
app.use(store)
app.component('compnav', CompNav)
app.mount('#app')