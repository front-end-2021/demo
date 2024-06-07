import CompNav from './comp-nav.js'
import dnbStore from './main-store.js'
const { createApp } = Vue
const app = createApp({
    data() {
        return {
            Users: ['Unassigned', 'Bill Gate', 'Elon Musk', 'Larry Page'],
            UserAssign: ''
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
    },
    mounted() {
        const onChangeUser = (value, text, $selectedItem) => {
            this.UserAssign = value
            dnbStore.commit('assignUser', value)
        }
        $('.ui.dropdown').dropdown({
            onChange: onChangeUser
        })
    },
})
app.use(dnbStore)
app.component('compnav', CompNav)
app.mount('#app')