import { getRandomInt, getTxtBy } from './common.js'
import CompNav from './comp-nav.js'
import { DropSelect } from './comp-global.js'
import dnbStore from './main-store.js'
import { AppModal } from './comp-modal.js'
import { MarketPage } from './comp-page.js'
const { createApp } = Vue

const appModal = createApp(AppModal)
appModal.use(dnbStore)
appModal.mount(`#app-modal`)

const app = createApp({
    name: `app-main`,
    components: {
        'comp-nav': CompNav,
        'page-market': MarketPage,
    },
    data() {
        return {
            UserInfo: {
                img: `https://allimages.sgp1.digitaloceanspaces.com/tipeduvn/2022/01/1642393308_940_Hinh-Anh-Girl-Xinh-Viet-Nam-Dep-De-Thuong-Cute.jpg`,
                header: `Profile`,
                content: {
                    head: `We've auto-chosen a profile image for you.`,
                    description: `We've grabbed the following image from the <a href="https://www.gravatar.com" target="_blank">gravatar</a>
                    image associated with your registered e-mail address.</p>
                  <p>Is it okay to use this photo?`
                }
            },
            Users: ['Unassigned', 'Bill Gate', 'Elon Musk', 'Larry Page'],
            UserAssign: '',

            IndexProject: 0,
            IndexLang: 0,
            IndexPage: 0,
        }
    },
    computed: {
        TxtLang() { return getTxtBy(this.CLang.Key) },
        CLang() {
            const lng = this.$store.getters.languages[this.IndexLang]
            if (typeof lng != 'object' || Object.is(lng, null)) return {}
            return lng
        },
        CProject() {
            const prj = this.$store.getters.projects[this.IndexProject]
            if (typeof prj != 'object' || Object.is(prj, null)) return {}
            return prj
        },
        CompPage() {
            switch (this.IndexPage) {
                case 0: return 'page-market';
                default: break;
            }
        },

        // #region trace dev
        message() { return this.$store.getters.message },
        // #endregion
    },
    methods: {
        selectPage(index) { this.IndexPage = index },
        increment() {
            this.$store.commit('increment')
            //  console.log(this.$store.state.count)
        },
        setIndexProject(val) { this.IndexProject = parseInt(val) },
        setIndexLang(val) { this.IndexLang = parseInt(val) },
        setUserAssign(val) {
            this.UserAssign = val;
            this.$store.commit('assignUser', val)
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
                    this.$store.commit('setModal', [this.UserInfo, saveClose, exitClose])
                    break;
            }
        }
    },
    // provide() {
    //     return { }
    // },
    created() {
        this.IndexProject = getRandomInt(0, this.$store.getters.projects.length)
    },
    beforeMount() {
        // console.log('before mount', this)
    },
    //mounted() { },
})
app.use(dnbStore)
app.component('drop-select', DropSelect)
app.mount('#app')