import { getRandomInt, includeHTML } from './common.js'
import CompNav from './comp-nav.js'
import { DropSelect } from './comp-global.js'
import dnbStore from './main-store.js'
import { AppModal } from './comp-modal.js'
import { MarketPage } from './comp-page.js'
const { createApp } = Vue

Promise.all([
    includeHTML(`./components/semantics.html`), 
    includeHTML(`./pages/MarketSegmentStrategy.html`),
    includeHTML(`./AppWindow.html`),
    includeHTML(`./components/dFilter.html`)
]).then((values) => {
    const path = values[0].path
    const pMSS = values[1].path
    const pApWn = values[2].path
    const pFlt = values[2].path
    
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
                IndexPage: 0,
            }
        },
        computed: {
            //  CLang() { return this.$store.getters.activeLang },
            CProject() {
                const prj = this.$store.state.Projects[this.IndexProject]
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
            setIndexLang(val) { this.$store.commit('setILang', parseInt(val)) },
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
            this.IndexProject = getRandomInt(0, this.$store.state.Projects.length)
        },
        beforeMount() {
            // console.log('before mount', this)
        },
        mounted() {
            let pDom = document.querySelector(`.dnbimporthtml[dnbpath="${path}"]`)
            if (pDom) pDom.remove();

            pDom = document.querySelector(`.dnbimporthtml[dnbpath="${pMSS}"]`)
            if (pDom) pDom.remove();

            pDom = document.querySelector(`.dnbimporthtml[dnbpath="${pApWn}"]`)
            if (pDom) pDom.remove();

            pDom = document.querySelector(`.dnbimporthtml[dnbpath="${pFlt}"]`)
            if (pDom) pDom.remove();
        },
    })
    app.use(dnbStore)
    app.component('drop-select', DropSelect)
    app.mount('#app')

    const appModal = createApp(AppModal)
    appModal.use(dnbStore)
    appModal.mount(`#app-modal`)
}).catch(errStatus => {
    console.log('Woop!', errStatus)
})