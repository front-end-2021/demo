import { getRandomInt } from './common.js'
import { Langs } from './mock-data.js'
import CompNav from './comp-nav.js'
import { DropSelect } from './comp-global.js'
import dnbStore from './main-store.js'
const { createApp, onBeforeMount } = Vue
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
    setup() {
        onBeforeMount(() => {

            console.log('on before mount', this)
        })
        // return { }
    },
    computed: {
        message() { return dnbStore.getters.message },
        projects() { return dnbStore.getters.projects },
        languages() { return Langs },
    },
    methods: {
        increment() {
            this.$store.commit('increment')
            console.log(this.$store.state.count)
        },
        setIndex(val, type) {
            switch (type) {
                case '1': this.IndexProject = val;
                    break;
                case '2': 
                    this.UserAssign = val;
                    dnbStore.commit('assignUser', val)
                    break;
                default: break;
            }
        },
    },
    provide() {
        return {
            setIndex: this.setIndex
        }
    },
    created() {
        this.IndexProject = getRandomInt(0, this.projects.length)
    },
    beforeMount() {
        console.log('before mount', this)
    },
    //mounted() { },
})
app.use(dnbStore)
app.component('drop-select', DropSelect)
app.mount('#app')