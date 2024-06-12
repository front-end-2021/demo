import { getRandomInt } from './common.js'
import { Langs } from './mock-data.js'
import CompNav from './comp-nav.js'
import { DropSelect } from './comp-global.js'
import dnbStore from './main-store.js'
const { createApp } = Vue
const app = createApp({
    name: `app-main`,
    components: {
        //'drop-select': DropSelect,
        'compnav': CompNav
    },
    data() {
        return {
            IndexProject: 0,

            Users: ['Unassigned', 'Bill Gate', 'Elon Musk', 'Larry Page'],
            UserAssign: ''
        }
    },
    computed: {
        message() { return dnbStore.getters.message },
        projects() { return dnbStore.getters.projects },
        languages() { return Langs },
    },
    methods: {
        increment() {
            this.$store.commit('increment')
          //  console.log(this.$store.state.count)
        },
        setIndex(val) {
            this.IndexProject = parseInt(val);
        },
        setUserAssign(val) {
            this.UserAssign = val;
            dnbStore.commit('assignUser', val)
        },
    },
    // provide() {
    //     return { }
    // },
    created() {
        this.IndexProject = getRandomInt(0, this.projects.length)
    },
    beforeMount() {
       // console.log('before mount', this)
    },
    //mounted() { },
})
app.use(dnbStore)
app.component('drop-select', DropSelect)
app.mount('#app')