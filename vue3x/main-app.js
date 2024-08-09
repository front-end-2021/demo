import { getLastState, includeHTML, setLastState } from './common.js'
import { getData } from './repo-services.js'
import {
    DropSelect, SRange
} from './components/comp-global.js'
import { getMessCompare, overrideItem } from './mock-data.js'
import dnbStore from './main-store.js'
import {
    CompModal, CompFormLand, CompFormRegion, CompFormMarket,
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
                IndexProject: -1,
                IndexPage: -1,

                ActiveLandIds: [],
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
            ProjectName() {
                const iPrj = this.IndexProject
                if (iPrj < 0) return ''
                return this.$store.state.Projects[iPrj].Name
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
            },
            openFormEditLand(land) {
                const iProject = this.IndexProject
                const saveClose = (mLand) => {
                    setLastState(1, 0)
                    overrideItem.call(land, mLand)
                    this.$store.commit('addUpdateLocal', [1, null, iProject])
                }
                const xClose = (mLand) => {
                    setLastState(1, 0)
                    let mess = getMessCompare(land, mLand)
                    if (mess && confirm(mess)) saveClose(mLand)
                }
                const item = {
                    title: `Edit Land`,
                    data: JSON.parse(JSON.stringify(land)),
                    type: `comp-form-land`
                }
                this.$store.commit('setModal', [item, saveClose, xClose])
            },
        },
        created() {
            Promise.all([
                getData(1),
                getData(2),
                getData(3),
                getData(4),
                getData(5),
                getData(6),
            ]).then((values) => {
                const [projects, langs, lands, regions, markets, subMarkets] = values
                this.$store.state.Projects = projects
                this.$store.state.Languages = langs
                this.$store.state.Lands = lands
                this.$store.state.Regions = regions
                this.$store.state.Markets = markets
                this.$store.state.Submarkets = subMarkets
                this.ActiveLandIds = [3];
                this.IndexProject = 0;
                this.IndexPage = 0;

                this.$nextTick(() => {
                    getLastState().then((oData) => {
                        let sItem;

                        switch (oData.type) {
                            case 1:     // Edit Land
                                sItem = this.$store.getters.ItemBy([1, oData.id])
                                if (sItem) {
                                    this.openFormEditLand(sItem)
                                }
                                break;
                            case 2:     // Edit Region
                                console.log('edit region')
                                break;
                            case 3:     // Edit Market
                                console.log('edit market')
                                break;
                            case 4:     // Edit Submarket
                                console.log('edit sub market')
                                break;
                        }
                        console.log(oData)
                    })
                })
            })

        },
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
            'comp-form-market': CompFormMarket,
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
