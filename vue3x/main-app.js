import { getRandomInt, includeHTML } from './common.js'
import {
    DropSelect,
} from './components/comp-global.js'
import dnbStore from './main-store.js'
import {
    CompModal, CompFormLand,
    CompFormValuation
} from './forms/comp-modal.js'
import MarketSegmentStrategy from './pages/MarketSegmentStrategy.js'
import SubmarketProduct from './pages/SubmarketProduct.js'
import ActionPlan from './pages/ActionPlan.js'
const { createApp } = Vue

Promise.all([
    includeHTML(`./components/semantics.html`),
    includeHTML(`./pages/MarketSegmentStrategy.html`),
    includeHTML(`./pages/SubmarketProduct.html`),
    includeHTML(`./pages/ActionPlan.html`),
    includeHTML(`./components/dFilter.html`),
    includeHTML(`./forms/form-land.html`),
    includeHTML(`./forms/AppWindow.html`),
]).then((values) => {
    const app = createApp({
        name: `app-main`,
        components: {
            'page-market': MarketSegmentStrategy,
            'page-sub-market': SubmarketProduct,
            'page-action-plan': ActionPlan,
        },
        data() {
            return {
                IndexProject: 0,
                IndexPage: 0,

                LandIds: [0],
                ActiveLandId: 0,
                MarketIds: [0],
            }
        },
        computed: {
            //  CLang() { return this.$store.getters.activeLang },
            // CProject() {
            //     const prj = this.$store.state.Projects[this.IndexProject]
            //     if (typeof prj != 'object' || Object.is(prj, null)) return {}
            //     return prj
            // },
            CompPage() {
                switch (this.IndexPage) {
                    case 0: return 'page-market';
                    case 1: return 'page-sub-market';
                    case 2: return 'page-action-plan';
                    default: break;
                }
            },
        },
        methods: {
            selectPage(index) { this.IndexPage = index },
            
            setIndexProject(val) { this.IndexProject = parseInt(val) },
            setIndexLang(val) { this.$store.commit('setILang', parseInt(val)) },
           
            
        },
        created() {
            this.IndexProject = getRandomInt(0, this.$store.state.Projects.length)
        },
        beforeMount() {
            // console.log('before mount', this)
        },
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
            'comp-form-valuation': CompFormValuation
        },
        computed: {
            // #region trace dev
            OItem() { return this.$store.getters.moItem },
            // #endregion
        },
        methods: {

        },

    })
    appModal.use(dnbStore)
    appModal.component('drop-select', DropSelect)
    appModal.mount(`#app-modal`)
}).catch(errStatus => { console.log('Woop!', errStatus) })
