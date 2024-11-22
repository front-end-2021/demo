// #region import
import {
    includeHTML, setLastState,
    getLocal, setLocal,
} from './common.js'
import {
    DropSelect, SRange,
} from './components/comp-global.js'
import {
    getMessCompare, overrideItem,
    getCopyItem, deleteDes
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
import VueObserveVisibility from 'vue3-observe-visibility'
// #endregion
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
                TabStatus: [1, 1, 1, 1, 1], // [M@rk3t, SubM@rk3t, @ctionPl4n, Ro4dm@p, T3mB0@rd]
                ActviePrGrpIds: [],
                ActiveLandIds: [],
                IsShowF: false,
                MarketCriterias: [],    // [Type, Ids]
                SubMarketCrites: [],    // [Type, Ids]
                ProcessState: 0,    // loading (0), success (1)
                DragDrop: null,
                Popup_UI: null,  // 

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
            UiTooltipType() {
                const popTlp = this.Popup_UI
                if (Object.is(popTlp, null)) return 0;
                if (typeof popTlp != 'object') return 0;
                if (popTlp.type < 1000) return 0;
                return popTlp.type
            },
            UiPopupType() {
                const popMenu = this.$root.Popup_UI
                if (Object.is(popMenu, null)) return 0;
                if (typeof popMenu != 'object') return 0;
                if (999 < popMenu.type) return 0;        // tooltip
                return popMenu.type
                // 23 (Menu Cell Valuation), 1 (Menu btn Land)
            },
        },
        watch: {
            IndexPage(val) { setLocal(6, val) },
            
        },
        methods: {
            selectPage(index) { this.IndexPage = index },
            setIndexProject(iPrj) {
                iPrj = parseInt(iPrj)
                const oldIprj = this.IndexProject
                this.IndexProject = iPrj
                this.$store.commit('setDataProject', [iPrj, oldIprj])
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
                    deleteDes.call(mLand)

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
            clearPopupUI(type) {
                const popMenu = this.Popup_UI
                if (Object.is(popMenu, null)) return;
                switch (type) {
                    case 23:     // Menu valuation
                        if (typeof popMenu != 'object') return;
                        if (popMenu.type != 1) return;
                        this.Popup_UI = null;
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
                            this.ActviePrGrpIds = acIds  // set to run watcher
                        }
                        break;
                }

            },
            onMouseOver(type, item, e) {
                let text, des,
                    offTarget = e.target.getBoundingClientRect()
                switch (type) {
                    case 1:     // Land
                    case 2:     // Region
                        des = this.$store.getters.Des(item)
                        if (18 < item.Name.length) {
                            if (des) {
                                text = `<strong>Name</strong>`
                                text += `<p>${item.Name}</p>`
                                text += `<strong>Description</strong>`
                                text += `<p>${des}</p>`
                            } else text = item.Name;
                        } else {
                            text = des
                        }
                        break;
                    default: break;
                }
                //  console.log(e, offTarget)
                if (text) {
                    this.Popup_UI = {   // type 1000
                        type: 1000,     // tooltip
                        BodyText: text,
                        Style: {
                            top: `${offTarget.top + offTarget.height}px`,
                            left: `${offTarget.left}px`,
                            minWidth: `${offTarget.width}px`,
                            minHeight: `${offTarget.height}px`
                        },
                        StyleArr: { transform: `translateX(${offTarget.width / 2 - 8}px)` },
                        placement: 'bottom'
                    }
                }
            },
            hideTooltip(type, item, e){ this.Popup_UI = null },
            classSqr(isCheck) {
                if (isCheck) return `bi-check2-square`
                return `bi-square`
            },
            onGotoTab(type, entry) {
                this.Popup_UI = null
                this.IndexPage = type

                switch (type) {
                    case 0: // M@rk3t
                        break;
                    case 1: // Subm@rk3t
                        break;
                    case 2: // @ct1on Pl@n
                        break;
                    default: break;
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
            this.ProcessState = 0     // loading
            Promise.all([
                getData(1),
                getData(2),
                getData(3),        // Lands
                getData(4),       // Regions
                getData(5),       // Markets
                getData(6),       // Submarkets
                getData(9),        // Goals
                getData(7),       // Product group
                getData(8),       // Products
                getData(10),       // Subs
                getData(11),       // Tasks
            ]).then((values) => {
                const [projects, langs, lands, regions, markets, subMarkets] = values

                this.$store.state.Projects = projects
                this.$store.state.Languages = langs
                this.$store.state.Lands = lands
                this.$store.state.Regions = regions
                this.$store.state.Markets = markets
                this.$store.state.Submarkets = subMarkets;
                this.$store.state.ListGoal = values[6]
                this.$store.state.ProductGroups = values[7]
                this.$store.state.Products = values[8]
                this.$store.state.ListSub = values[9]
                this.$store.state.ListTask = values[10]

                this.ActiveLandIds = lands.map(x => x.Id)

                this.IndexProject = 0;
                this.IndexPage = getLocal(6)

                this.ProcessState = 1     // success
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
    app.directive('observe-visibility', VueObserveVisibility.ObserveVisibility)
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
