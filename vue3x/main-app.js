import { getRandomInt } from './common.js'
import { Langs } from './mock-data.js'
import CompNav from './comp-nav.js'
import { DropSelect } from './comp-global.js'
import dnbStore from './main-store.js'
import { AppModal } from './comp-modal.js'
const { createApp } = Vue

const appModal = createApp(AppModal)
appModal.use(dnbStore)
appModal.mount(`#app-modal`)

const app = createApp({
    name: `app-main`,
    components: {
        //'drop-select': DropSelect,
        'compnav': CompNav
    },
    data() {
        return {

            Users: ['Unassigned', 'Bill Gate', 'Elon Musk', 'Larry Page'],
            UserAssign: ''
        }
    },
    computed: {
        message() { return dnbStore.getters.message },

        projects() { return dnbStore.getters.projects },
        IProject() { return dnbStore.getters.iproject },

        languages() { return dnbStore.getters.languages },
        ILang() { return dnbStore.getters.ilang },
    },
    methods: {
        increment() {
            this.$store.commit('increment')
            //  console.log(this.$store.state.count)
        },
        setIndexProject(val) {
            this.$store.commit('setIProject', parseInt(val))
        },
        setIndexLang(val) {
            this.$store.commit('setILang', parseInt(val))
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
        this.$store.commit('setIProject', getRandomInt(0, this.projects.length))
    },
    beforeMount() {
        // console.log('before mount', this)
    },
    //mounted() { },
})
app.use(dnbStore)
app.component('drop-select', DropSelect)
app.mount('#app')