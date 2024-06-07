import CompNav from './comp-nav.js'
import dnbStore from './main-store.js'
const { createApp } = Vue
const app = createApp({
    data(){
        return {
          
        }
    },
    computed: {
        message() { return dnbStore.getters.message },
    },
    methods: {
        increment() {
            this.$store.commit('increment')
            console.log(this.$store.state.count)
        }
    }
})
app.use(dnbStore)
app.component('compnav', CompNav)
app.mount('#app')