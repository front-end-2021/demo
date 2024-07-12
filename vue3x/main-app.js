import { getRandomInt, includeHTML } from './common.js'
import {
    DropSelect, SRange
} from './components/comp-global.js'
import dnbStore from './main-store.js'
import {
    CompModal, CompFormLand, CompFormRegion,
    CompFormValuation, CompMessNewLand
} from './forms/comp-modal.js'
import MarketSegment from './pages/MarketSegment.js'
import SubmarketProduct from './pages/SubmarketProduct.js'
import ActionPlan from './pages/ActionPlan.js'
const { createApp } = Vue

Promise.all([
    includeHTML(`./components/semantics.html`),
    includeHTML(`./pages/MarketSegment.html`),
    includeHTML(`./pages/SubmarketProduct.html`),
    includeHTML(`./pages/ActionPlan.html`),
    includeHTML(`./components/dFilter.html`),
    includeHTML(`./forms/form-land.html`),
    includeHTML(`./forms/AppWindow.html`),
]).then((values) => {
    const app = createApp({
        name: `app-main`,
        components: {
            'page-market': MarketSegment,
            'page-sub-market': SubmarketProduct,
            'page-action-plan': ActionPlan,
        },
        data() {
            return {
                IndexProject: 0,
                IndexPage: 0,

             //   LandIds: [0],
                ActiveLandIds: [3],
                MarketIds: [0],
                MarketCriterias: [],

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
                UserAssign: 'Assign',
            }
        },
        computed: {
            CompPage() {
                switch (this.IndexPage) {
                    case 0: return 'page-market';
                    case 1: return 'page-sub-market';
                    case 2: return 'page-action-plan';
                    default: break;
                }
            },
        },
        watch: {
            MarketCriterias(val) { console.log('watch market crites', val) }
        },
        methods: {
            selectPage(index) { this.IndexPage = index },
            setIndexProject(val) {
                val = parseInt(val)
                this.IndexProject = val
                this.$store.commit('setDataProject', val)
            },
            setIndexLang(val) { this.$store.commit('setILang', parseInt(val)) },

            openForm(type) {
                switch (type) {
                    case 1:     // user
                        const saveClose = (mItem) => {
                            //    console.log('save close', mItem)
                            this.UserInfo = mItem
                        }
                        const exitClose = (mItem) => {
                            //    console.log('exit close', mItem)
                        }
                        const item = {
                            data: this.UserInfo,
                            type: `comp-modal`
                        }
                        this.$store.commit('setModal', [item, saveClose, exitClose])
                        break;
                }
            }
        },
        //created() { },
        //beforeMount() { console.log('before mount', this) },
        mounted() {
            values.forEach((path, ii) => {
                // console.log(path, ii)
                let pDom = document.body.querySelector(`.dnbimporthtml[dnbpath="${path}"]`)
                if (pDom) pDom.remove();
            })
        },
    })
    app.use(dnbStore)
    app.component('drop-select', DropSelect)
    app.mount('#app')

    const appModal = createApp({
        name: `app-modal`,
        components: {
            'comp-modal': CompModal,
            'comp-form-land': CompFormLand,
            'comp-form-valuation': CompFormValuation,
            'comp-mess-newland': CompMessNewLand,
            'comp-form-region': CompFormRegion,
        },
        computed: {
            // #region trace dev
            Items() { return this.$store.state.Modals },
            // #endregion
        },
        methods: {

        },

    })
    appModal.use(dnbStore)
    appModal.component('drop-select', DropSelect)
    appModal.component('s-range', SRange)
    appModal.mount(`#app-modal`)
}).catch(errStatus => { console.log('Woop!', errStatus) })
