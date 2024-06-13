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
        'comp-nav': CompNav
    },
    data() {
        return {
            UserInfo: {
                img: `https://allimages.sgp1.digitaloceanspaces.com/tipeduvn/2022/01/1642393308_940_Hinh-Anh-Girl-Xinh-Viet-Nam-Dep-De-Thuong-Cute.jpg`,
                header: `Profile`,
                content: {
                    head: `We've auto-chosen a profile image for you.`,
                    description:  `We've grabbed the following image from the <a href="https://www.gravatar.com" target="_blank">gravatar</a>
                    image associated with your registered e-mail address.</p>
                  <p>Is it okay to use this photo?`
                }
            },
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
        openForm(type) {
            switch (type) {
                case 1:     // user
                    const saveClose = (mItem) => {
                        console.log('save close', mItem)
                        this.UserInfo = mItem
                    }
                    const exitClose = (mItem) => {
                        console.log('exit close', mItem)
                    }
                    dnbStore.commit('setModal', [this.UserInfo, saveClose, exitClose])
                    break;
            }
        }
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