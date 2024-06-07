const { createApp } = Vue
const app = createApp({
    computed: {
        message() { return dnbStore.getters.message }
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