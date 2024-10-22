import {
    includeHTML, setLastState,
    getLocal, setLocal
} from './common.js'
import {
    DropSelect, SRange,
} from './components/comp-global.js'
import {
    getMessCompare, overrideItem,
    getCopyItem
} from './mock-data.js'
import dnbStore from './main-store.js'
import {
    CompModal, CompFormLand, CompFormRegion, CompFormMarket,
    CompFormValuation, CompMessNewLand
} from './forms/comp-modal.js'
import { getData } from './repo-services.js'
import MarketSegment from './pages/MarketSegment.js'
import SubmarketProduct from './pages/SubmarketProduct.js'
import ActionPlan from './pages/ActionPlan.js'
import { createApp } from 'vue'

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
                IndexPage: 0,
                TabStatus: [1, 1, 1, 1, 1], // [M@rk3t, SubM@rk3t, @ctionPl4n, Ro4dm@p, T3mB0@rd]
                ActviePrGrpIds: [],
                ActiveLandIds: [],

                MarketCriterias: [],    // [Type, Ids]
                SubMarketCrites: [],    // [Type, Ids]
                ProcessState: 0,    // loading (0), success (1)
                PopupMenu: null,
                DragDrop: null,
                PopTooltip: null,
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
            IndexPage(val) { setLocal(6, val) },
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

                    this.$store.commit('setDes', [land, mLand.Description])
                    delete mLand.Description

                    overrideItem.call(land, mLand)
                    this.$store.commit('addUpdateLocal', [1, null, iProject])
                }
                const xClose = (mLand) => {
                    setLastState(1, 0)
                    let mess = getMessCompare(land, mLand)
                    mess = this.$store.getters.checkChangeExt([land, mLand, mess])
                    if (mess && confirm(mess)) saveClose(mLand)
                }
                const item = {
                    title: `Edit Land`,
                    data: getCopyItem.call(this, land),
                    type: `comp-form-land`
                }
                this.$store.commit('setModal', [item, saveClose, xClose])
            },
            clearPopupMenu(type) {
                const popMenu = this.$root.PopupMenu
                if (Object.is(popMenu, null)) return;
                switch (type) {
                    case 1:     // Menu valuation
                        if (typeof popMenu != 'object') return;
                        if (popMenu.type != 1) return;
                        this.$root.PopupMenu = null;
                        break;
                    default: break;
                }
            },
            viewName(name, type) {
                switch (type) {
                    case 1: // land
                    case 2: // region
                        if (18 < name.length) return `${name.slice(0, 18)} ...`
                        break;
                    default: break;
                }
                return name;
            },
            activeItem(type, item) {
                let acIds, ii;
                switch (type) {
                    case 1: // Land
                        acIds = this.ActiveLandIds.map(id => id)
                        ii = acIds.indexOf(item.Id)
                        if (ii < 0) {
                            acIds.push(item.Id)
                            this.ActiveLandIds = acIds  // set to run watcher
                            return
                        }
                        if (1 < acIds.length) {
                            acIds.splice(ii, 1);
                            this.ActiveLandIds = acIds  // set to run watcher
                        }
                        break;
                    case 5: // Product group
                        acIds = this.ActviePrGrpIds.map(id => id)
                        ii = acIds.indexOf(item.Id)
                        if (ii < 0) {
                            acIds.push(item.Id)
                            this.ActviePrGrpIds = acIds  // set to run watcher
                            return
                        }
                        if (1 < acIds.length) {
                            acIds.splice(ii, 1);
                            this.ActiveLandIds = acIds  // set to run watcher
                        }
                        break;
                }

            },
            traceHeap(mess) {
                if (performance.memory) {
                    let memoryUsage = performance.memory.usedJSHeapSize;
                    memoryUsage = memoryUsage / 1024
                    memoryUsage = memoryUsage / 1024
                    console.log(`${mess} used JS heap size: ${Math.ceil(memoryUsage)} M.Bytes`);
                } else {
                    console.log('The performance.memory API is not supported in this environment.');
                }
            },
        },
        //  beforeCreate() { },
        created() {
            Promise.all([getData(1), getData(2)]).then((values) => {
                const [projects, langs] = values
                this.$store.state.Projects = projects
                this.$store.state.Languages = langs

                this.$root.IndexProject = 0;
                this.IndexPage = getLocal(6)
            })
        },
        mounted() {
            values.forEach((path, ii) => {
                // console.log(path, ii)
                let pDom = document.body.querySelector(`.dnbimporthtml[dnbpath="${path}"]`)
                if (pDom) pDom.remove();
            })
            this.traceHeap('Main App')
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
