import {
    FTypeId, MxFCriterial,
    getLandMarketIds, commSelectTypeId
} from "../components/dFilter.js";
import { setLastState, getLastState, MxSortable, counterClick } from "../common.js";
import {
    getMessCompare, overrideItem,
    getCopyItem, deleteDes
} from "../mock-data.js";

import { VueDraggableNext } from 'vue-draggable-next'

const CellValuation = {
    template: `#tmp-comp-cell-valuation`,
    inject: ['getValuation', 'getBgColor', 'clssCheckMark',
        'openFormEval', 'toggleMenuEval'],
    props: {
        market: Object,
        region: Object,
    },
    //computed: { },
    methods: {
        dblclOpenFormValue() {
            const mId = this.market.Id
            const rId = this.region.Id;
            const item = this.$store.getters.MarketRegionBy([mId, rId])
            if (!item) return
            this.openFormEval(this.market, this.region)
        },
    },
}
const FCriterialMarket = {
    template: `#tmp-comp-criterial-market`,
    mixins: [MxFCriterial],
    emits: ['remove:item'],
    inject: ['ignoreIds'],
    computed: {
        ItemSelectLand() {
            return {
                Id: FTypeId.SelectLand, // -29
                Name: this.$store.getters.txtFilter(FTypeId.SelectLand)
            }
        },
        ItemSelectMarket() {
            return {
                Id: FTypeId.SelectMarketSegments,   // -10
                Name: this.$store.getters.txtFilter(FTypeId.SelectMarketSegments)
            }
        }
    },
    methods: {
        selectTypeId(index) {
            const fId = commSelectTypeId(this, index)
            switch (fId) {
                case FTypeId.Land_Region:
                    this.ids.push(FTypeId.SelectLand)
                    break;
                case FTypeId.MarketSegments:
                    this.ids.push(FTypeId.SelectMarketSegments)
                    break;
                default: break;
            }
        },
        getSrcId() {
            let ignIds
            switch (this.filterType) {
                case FTypeId.Land_Region:
                    ignIds = this.ignoreIds(this.index, 1)
                    return [this.ItemSelectLand, ...this.$store.getters.SortedItems([1, [], ignIds])]
                case FTypeId.MarketSegments:
                    ignIds = this.ignoreIds(this.index, 2)
                    return [this.ItemSelectMarket, ...this.$store.getters.SortedItems([2, [], ignIds])]
                default: break;
            }
            return []
        },

    },
}
const MsFilterMarket = {
    template: `#tmp-comp-filter-market`,
    components: {
        'comp-criterial-market': FCriterialMarket,
    },
    emits: ['set:filter'],
    props: {
        marketIds: {
            type: Array,
            default: [0]
        },
    },
    beforeCreate() {
        const rootCrs = this.$root.MarketCriterias
        if (!rootCrs.length) {
            rootCrs.push([FTypeId.PleaseSelect, []])    // [Type, Ids]
        }
    },
    data() {
        return {
            Criterials: JSON.parse(JSON.stringify(this.$root.MarketCriterias))
        }
    },
    watch: {
        '$root.MarketCriterias'(lstC) {
            this.Criterials = JSON.parse(JSON.stringify(lstC))
            this.setFilter()
        },
    },
    provide() {
        return {
            ignoreIds: (index, type) => {
                const lst = []
                switch (type) {
                    case 1: // Land
                        for (let ii = this.Criterials.length - 1; -1 < ii; ii--) {
                            if (ii == index) continue
                            const crite = this.Criterials[ii]
                            if (crite[0] == FTypeId.PleaseSelect) continue
                            if (crite[0] == FTypeId.MarketSegments) continue
                            const id = crite[1][0]
                            if (id < 1) continue
                            lst.push(id)
                        }
                        break;
                    case 2:         // Market
                        for (let ii = this.Criterials.length - 1; -1 < ii; ii--) {
                            if (ii == index) continue
                            const crite = this.Criterials[ii]
                            if (crite[0] == FTypeId.PleaseSelect) continue
                            if (crite[0] == FTypeId.Land_Region) continue
                            const id = crite[1][0]
                            if (id < 1) continue
                            lst.push(id)
                        }
                        break;
                }
                if (!lst.length) return [-1989]
                return lst
            },
        }
    },
    created() {
        const rootCrs = this.$root.MarketCriterias
        if (1 < rootCrs.length || rootCrs[0][0] != FTypeId.PleaseSelect) {
            this.setFilter()
        }
    },
    methods: {
        setTypeF(ii, val) {
            const crts = this.Criterials[ii]
            crts[0] = val
        },
        setIds(ii, ids) { this.Criterials[ii].splice(1, 1, ids) },
        addFilter(e) { this.Criterials.push([FTypeId.PleaseSelect, []]) },
        setFilter(e) {
            const lstC = this.Criterials
            const [landIds, marketIds] = getLandMarketIds(lstC)
            this.$emit('set:filter', [landIds, marketIds])

            const rLstC = this.$root.MarketCriterias
            removeRootCrites.call(this)
            addToRootCrites.call(this)
            function removeRootCrites() {
                for (let ii = 0; ii < rLstC.length; ii++) {
                    const rCrite = rLstC[ii]
                    const crite = lstC[ii]
                    if (!crite) continue;

                    if (rCrite[0] != crite[0]) {
                        ii = removeAt(ii)
                        continue
                    }
                    const rIds = rCrite[1]
                    const ids = crite[1]
                    if (rIds.length != ids.length) {
                        ii = removeAt(ii)
                        continue
                    }
                    for (let jj = 0; jj < rIds.length; jj++) {
                        if (rIds[jj] != ids[jj]) {
                            ii = removeAt(ii)
                            break;
                        }
                    }
                }
                function removeAt(ii) {
                    rLstC.splice(ii, 1) // remove at ii
                    return --ii
                }
            }
            function addToRootCrites() {
                for (let ii = 0; ii < lstC.length; ii++) {
                    const rCrite = rLstC[ii]        // [type, ids]
                    const crite = lstC[ii]
                    if (!rCrite) {
                        rLstC.splice(ii, 0, crite);     // add at ii
                        continue
                    }
                    if (rCrite[0] != crite[0]) {
                        rLstC.splice(ii, 0, crite);     // add at ii
                        continue
                    }
                    const rIds = rCrite[1]
                    const ids = crite[1]
                    if (rIds.length != ids.length) {
                        rLstC.splice(ii, 0, crite);     // add at ii
                        continue
                    }
                    for (let jj = 0; jj < rIds.length; jj++) {
                        if (rIds[jj] != ids[jj]) {
                            rLstC.splice(ii, 0, crite);     // add at ii
                            break;
                        }
                    }
                }
            }
        },
        resetFilter(e) {
            const lstC = this.Criterials
            for (let cc = lstC.length - 1; 0 < cc; cc--) {
                const items = lstC[cc]
                items[1].splice(0)
                items.splice(0)
                lstC.splice(cc, 1)
            }
            lstC[0][1].splice(0)
            lstC[0].splice(0, 1, FTypeId.PleaseSelect)
            this.setFilter()
        },
        removeCriterial(iic) { this.Criterials.splice(iic, 1) },
    },
}
export default {
    template: `#tmp-comp-market`,
    components: {
        'comp-filter-market': MsFilterMarket,
        'cell-valuation': CellValuation,
        draggable: VueDraggableNext
    },
    mixins: [MxSortable],
    data() {
        return {
            Lands: [],
            Regions: [],
            Markets: [],
        }
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "land",
                disabled: false,
                ghostClass: "ghost"
            }
        },

    },
    watch: {
        '$root.ActiveLandIds'(ids) {
            let lstC = this.$root.MarketCriterias
            const landIds = getLandMarketIds(lstC, 'land')

            let mergeIdLands = ids
            if (!landIds.includes(0)) {
                mergeIdLands = ids.filter(id => landIds.includes(id))
            }
            this.Regions = this.$store.getters.sortedItemsBy([2, mergeIdLands])
        },
        '$root.IndexProject'(iPrj) {
            let lstC = this.$root.MarketCriterias
            const [landIds, marketIds] = getLandMarketIds(lstC)
            
            this.setFilter([landIds, marketIds])
        },
        Lands(lst, oldLst) {
            this.updateAsort(1, lst, oldLst)
        },
        Regions(lst, oldLst) {
            this.updateAsort(2, lst, oldLst)
        },
        Markets(lst, oldLst) {
            this.updateAsort(3, lst, oldLst)
        },
    },
    methods: {
        setFilter([landIds, marketIds]) {
            this.Lands = this.$store.getters.SortedItems([1, landIds, []])

            this.setRegions(landIds)

            this.Markets = this.$store.getters.SortedItems([2, marketIds, []])
        },
        setLandRegionMarket() {
            this.$root.ProcessState = 0     // loading
            let lstC = this.$root.MarketCriterias
            const [landIds, marketIds] = getLandMarketIds(lstC)

            this.setFilter([landIds, marketIds])
            this.$root.ProcessState = 1     // success
        },
        setRegions(landIds) {
            let mergeIdLands = this.$root.ActiveLandIds
            if (!landIds.includes(0)) {
                mergeIdLands = mergeIdLands.filter(id => landIds.includes(id))
            }
            this.Regions = this.$store.getters.sortedItemsBy([2, mergeIdLands])
        },
        countClick(type, item, e) {
            counterClick(() => {
                this.$root.activeItem(type, item)
            })
        },
        onShowMenu(type, item, e) {
            counterClick(() => {
                let offTarget = e.target.getBoundingClientRect()
                this.$root.Popup_UI = { // type 1
                    type: type,     // menu Land (1)
                    Entry: item,
                    Style: {
                        top: `${offTarget.top + offTarget.height}px`,
                        left: `${offTarget.left - 89}px`,
                    },
                }
            })
        },
        openFormLand(land) {
            const iProject = this.$root.IndexProject
            if (!land) {        // add new
                land = {
                    Id: this.$store.getters.newNumId(1),
                    Name: '', Description: '', IsNew: false,
                    ASort: this.$store.getters.newASort(1)
                }
                const saveClose = (mLand) => {
                    this.$store.commit('setDes', [land, mLand.Description])
                    deleteDes.call(mLand)
                    deleteDes.call(land)

                    overrideItem.call(land, mLand)
                    this.$store.commit('addUpdateLocal', [1, land, iProject])

                    let lstC = this.$root.MarketCriterias
                    const landIds = getLandMarketIds(lstC, 'land')
                    if (landIds.includes(0)) this.setLandRegionMarket()
                    else {
                        let mess = `New Land has not in filter result. Do you want?`
                        // reset filter or add new land in filter criterial
                        const resetLands = () => {
                            lstC = JSON.parse(JSON.stringify(lstC))
                            if (lstC.filter(x => x[0] === FTypeId.Land_Region).length) {
                                for (let cc = lstC.length - 1; -1 < cc; cc--) {
                                    const crites = lstC[cc]
                                    if (crites[0] === FTypeId.Land_Region) {
                                        const id = crites[1][0]
                                        if (0 < id) lstC.splice(cc, 1)      // remove at cc
                                    }
                                }
                                if (!lstC.length) {
                                    lstC.push([FTypeId.Land_Region, [0]])
                                }
                                this.$root.MarketCriterias = lstC
                            }

                        }
                        const filterContainNewLand = () => {
                            lstC = JSON.parse(JSON.stringify(lstC));
                            lstC.push([FTypeId.Land_Region, [land.Id]])
                            this.$root.MarketCriterias = lstC
                        }
                        let item = {
                            type: 'comp-mess-newland',
                            title: mess,
                            data: null
                        }
                        this.$store.commit('setModal', [item, filterContainNewLand, resetLands])
                    }
                }
                const xClose = (mLand) => {
                    if (typeof mLand.Name != 'string') return
                    if (!mLand.Name.length) return
                    let mess = `Do you want to save?`
                    if (confirm(mess)) saveClose(mLand)
                    else deleteDes.call(land)
                }
                const item = {
                    title: `New Land`,
                    data: land,
                    type: `comp-form-land`
                }
                this.$store.commit('setModal', [item, saveClose, xClose])
                return
            }
            // edit
            this.$root.openFormEditLand(land)
            setLastState(1, land.Id)
        },
        onClickTab(e) {
            this.$root.clearPopupUI(1)
        },
        hasExistMarketName(mMarket, elName) {
            const allMarket = this.$store.getters.SortedItems([2, [0], []])
            if (!allMarket.length) return false;
            const mNames = allMarket.map(x => x.Name)

            if (mNames.includes(mMarket.Name)) {
                $(elName).popup('show');
                return true
            }
            return false;
        },
        openFormMarket(market) {
            const iProject = this.$root.IndexProject
            const landActiveIds = this.$root.ActiveLandIds
            // add new
            if (!market) {
                market = {
                    Id: this.$store.getters.newNumId(3),
                    Name: '', Description: '', LandId: landActiveIds[0],
                    ASort: this.$store.getters.newASort(3)
                }
                const saveClose = (mMarket, elName) => {
                    if (this.hasExistMarketName(mMarket, elName)) return false

                    overrideItem.call(market, mMarket)
                    this.$store.commit('addUpdateLocal', [3, market, iProject])
                    this.setLandRegionMarket()
                    return true
                }
                const xClose = (mMarket, elName) => {
                    if (typeof mMarket.Name != 'string') return true;
                    if (!mMarket.Name.length) return true;
                    let mess = `Do you want to save?`
                    if (confirm(mess)) return saveClose(mMarket, elName);
                    return true;
                }
                const item = {
                    title: `New Market`,
                    data: market,
                    landActiveIds,
                    type: `comp-form-market`
                }
                this.$store.commit('setModal', [item, saveClose, xClose])
                return;
            }
            // Edit
            this.openFormEdit(3, market)
            setLastState(3, market.Id)
        },
        resetRegion() {
            let lstC = this.$root.MarketCriterias
            const landIds = getLandMarketIds(lstC, 'land')
            this.setRegions(landIds)
        },
        openFormRegion(region) {
            const iProject = this.$root.IndexProject
            const landActiveIds = this.$root.ActiveLandIds
            // add new
            if (!region) {
                region = {
                    Id: this.$store.getters.newNumId(2), Name: '', Description: '',
                    LandId: landActiveIds[0], Currency: 'USD',
                    ASort: this.$store.getters.newASort(2)
                }
                const saveClose = (mRegion) => {
                    this.$store.commit('setDes', [region, mRegion.Description])
                    deleteDes.call(mRegion)
                    deleteDes.call(region)

                    overrideItem.call(region, mRegion)
                    this.$store.commit('addUpdateLocal', [2, region, iProject])
                    this.resetRegion()
                }
                const xClose = (mRegion) => {
                    if (typeof mRegion.Name != 'string') return
                    if (!mRegion.Name.length) return
                    let mess = `Do you want to save?`
                    if (confirm(mess)) saveClose(mRegion)
                    else deleteDes.call(region)
                }
                const item = {
                    title: `New REgion`,
                    data: region,
                    landActiveIds,
                    type: `comp-form-region`
                }
                this.$store.commit('setModal', [item, saveClose, xClose])
                return
            }
            // edit
            this.openFormEdit(2, region)
            setLastState(2, region.Id)
        },
        openFormEdit(type, dItem) {
            const iProject = this.$root.IndexProject
            const landActiveIds = this.$root.ActiveLandIds
            let saveClose, xClose, item, cpyItm;
            switch (type) {
                case 2:     // Region
                    saveClose = (mRegion) => {
                        setLastState(2, 0)

                        this.$store.commit('setDes', [dItem, mRegion.Description])
                        deleteDes.call(mRegion)

                        overrideItem.call(dItem, mRegion)
                        this.$store.commit('addUpdateLocal', [2, null, iProject])
                        this.resetRegion()
                    }
                    xClose = (mRegion) => {
                        let mess = getMessCompare(dItem, mRegion)
                        mess = this.$store.getters.checkChangeExt([dItem, mRegion, mess])
                        if (mess && confirm(mess)) saveClose(mRegion)
                        else setLastState(2, 0)
                    }
                    item = {
                        title: this.$store.state.ContextLang.TxtEdtRegion,  // Edit Region
                        data: getCopyItem.call(this, dItem),
                        landActiveIds,
                        type: `comp-form-region`
                    }
                    break;
                case 3:     // Market
                    saveClose = (mMarket, elName) => {
                        if (this.hasExistMarketName(mMarket, elName)) return false
                        overrideItem.call(dItem, mMarket)
                        this.$store.commit('addUpdateLocal', [3, null, iProject])
                        this.setLandRegionMarket()
                        setLastState(3, 0)
                        return true
                    }
                    xClose = (mMarket) => {
                        if (!mMarket.Name.length) return false;
                        let mess = getMessCompare(dItem, mMarket)
                        if (mess && confirm(mess)) return saveClose(mMarket)
                        setLastState(3, 0)
                        return true;
                    }
                    item = {
                        title: `Edit Market`,
                        data: JSON.parse(JSON.stringify(dItem)),
                        landActiveIds,
                        type: `comp-form-market`
                    }
                    break;
                default: return;
            }
            this.$store.commit('setModal', [item, saveClose, xClose])
        },
        openFormEval(market, region) {
            const landId = region.LandId
            let land = this.$store.getters.ItemBy([1, landId])
            if (land) {
                land = land.Name + (land.IsNew ? ' *' : '')
            } else land = 'LAND'

            this.$root.clearPopupUI(1)

            this.$store.dispatch('openFormValue',
                [market.Id, region.Id]).then(([ii, item]) => {
                    if (ii < 0) return;
                    const saveClose = (mItem) => {
                        const itemCopy = Object.assign(item, mItem)
                        this.$store.state.MarketRegions.splice(ii, 1, itemCopy)
                    }
                    this.$store.commit('setModal', [{
                        data: item,
                        path: `${market.Name} / ${land} / ${region.Name}`,
                        type: `comp-form-valuation`
                    }, saveClose, () => { }])
                })

        },
        // #region menu cell valuation
        toggleMenuEval(e, market, region) {
            let offTarget = e.target.getBoundingClientRect()
            this.$root.Popup_UI = {     // type 23
                type: 23,    // menu valuation market region
                Market: market,
                Region: region,
                Style: {
                    top: `${offTarget.top + offTarget.height}px`,
                    left: `${offTarget.left - 147}px`,
                },
            }
        },
        openFormValun() {
            const popMenu = this.$root.Popup_UI
            if (Object.is(popMenu, null)) return;
            const market = popMenu.Market
            const region = popMenu.Region
            this.openFormEval(market, region)
        },
        activeValuation() {
            const popMenu = this.$root.Popup_UI
            if (Object.is(popMenu, null)) return;
            const MarketId = popMenu.Market.Id
            const RegionId = popMenu.Region.Id
            const item = this.$store.getters.MarketRegionBy([MarketId, RegionId])
            if (!item) {
                this.$store.state.MarketRegions.push({
                    MarketId, RegionId,
                    Criterias: [], Active: true,
                    Comment: ``
                })
                return
            }
            item.Active = !item.Active
        },
        isCelInActive(mId, rId) {
            const item = this.$store.state.MarketRegions.find(x => x.MarketId == mId && x.RegionId == rId)
            if (item) return false;
            return true;
        },
        classSquare() {
            const popMenu = this.$root.Popup_UI
            if (Object.is(popMenu, null)) return;
            const mId = popMenu.Market.Id
            const rId = popMenu.Region.Id
            const item = this.$store.getters.MarketRegionBy([mId, rId])
            if (!item) return `bi-square`
            return this.$root.classSqr(item.Active)
        },
        // #endregion
        initDragDrop(type) {
            switch (type) {
                case 2: // region
                    if (this.Regions.length < 2) return;
                    break;
                case 3: // market
                    if (this.Markets.length < 2) return;
                    break;
            }
            const dnd = {
                type,
                options: {
                    animation: 200,
                    disabled: false,
                    ghostClass: "ghost"
                },
            }
            switch (type) {
                case 2:     // region
                    dnd.options.direction = 'horizontal'
                    dnd.options.group = "region"
                    break;
                case 3:  // Market
                    dnd.options.direction = 'vertical'
                    dnd.options.group = "market"
                    break;
            }
            this.$root.DragDrop = dnd
        },
        finishDragDrop() { this.$root.DragDrop = null },
        getValuation(mId, rId, item) {
            if (!item) item = this.$store.getters.MarketRegionBy([mId, rId])
            if (!item) return;
            return getTotal(item.Criterias)
            function getTotal(items) {
                if (!items.length) return
                const lstCrt = items.map(x => x.Value * x.Weight)
                const sum = lstCrt.reduce((a, b) => a + b, 0)
                return Math.round(sum / lstCrt.length)
            }
        },
        clssCheckMark(mId, rId) {
            const item = this.$store.getters.MarketRegionBy([mId, rId])
            if (!item) return
            if (item.Active) return `bi-check`
        },
        getBgColor(mId, rId) {
            const item = this.$store.getters.MarketRegionBy([mId, rId])
            if (!item) return
            if (!item.Active) return { backgroundColor: `#eaeaea`, color: `#fff` }

            const total = this.getValuation(mId, rId, item)
            if (0 == total) return { backgroundColor: `#f0de4f`, color: `#fff` }

            if (-11 < total && total < 0) return { backgroundColor: `#f9bb51`, color: `#fff` }
            if (-21 < total && total < -10) return { backgroundColor: `#f2ad4d`, color: `#fff` }
            if (-31 < total && total < -20) return { backgroundColor: `#e99c49`, color: `#fff` }
            if (-41 < total && total < -30) return { backgroundColor: `#df8a44`, color: `#fff` }
            if (-51 < total && total < -40) return { backgroundColor: `#d5773f`, color: `#fff` }
            if (-61 < total && total < -50) return { backgroundColor: `#cb633a`, color: `#fff` }
            if (-71 < total && total < -60) return { backgroundColor: `#e2a696`, color: `#000` }
            if (-81 < total && total < -70) return { backgroundColor: `#e4a399`, color: `#000` }
            if (-91 < total && total < -80) return { backgroundColor: `#e59d99`, color: `#000` }
            if (-101 < total && total < -90) return { backgroundColor: `#e59494`, color: `#000` }
            if (0 < total && total < 11) return { backgroundColor: `#c0d02e`, color: `#fff` }
            if (10 < total && total < 21) return { backgroundColor: `#b8c92e`, color: `#fff` }
            if (20 < total && total < 31) return { backgroundColor: `#adc02c`, color: `#fff` }
            if (30 < total && total < 41) return { backgroundColor: `#a1b42b`, color: `#fff` }
            if (40 < total && total < 51) return { backgroundColor: `#93a82a`, color: `#fff` }
            if (50 < total && total < 61) return { backgroundColor: `#adc02c`, color: `#fff` }
            if (60 < total && total < 71) return { backgroundColor: `#839b27`, color: `#fff` }
            if (70 < total && total < 81) return { backgroundColor: `#668125`, color: `#fff` }
            if (80 < total && total < 91) return { backgroundColor: `#597623`, color: `#fff` }
            if (90 < total && total < 101) return { backgroundColor: `#4e6d22`, color: `#fff` }
        },
        clickMenuEdit(item, type) {
            switch (type) {
                case 1: this.openFormLand(item)
                    break;
                default: break;
            }
            this.$root.Popup_UI = null
        },
        toggleIsNew(item, type) {
            switch (type) {
                case 1: // Land
                    item.IsNew = !item.IsNew
                    break;
                default: break;
            }
            this.$root.Popup_UI = null
        },
        getNameMenu(name) {
            if (name.length <= 12) return name;
            return name.slice(0, 12) + ' ...'
        },
        clkGotoTabBy(type) {
            const popMenu = this.$root.Popup_UI;
            switch (type) {
                case 23: // Cell market region
                    let market = popMenu.Market
                    let region = popMenu.Region
                    this.$root.SubMarketCrites = [
                        [FTypeId.PleaseSelect, [region.LandId, region.Id]],
                        [FTypeId.MarketSegments_Submarket, [market.Id, FTypeId.SelectAll]]
                    ]
                    break;
                case 1:    // Land
                    let land = popMenu.Entry
                    this.$root.SubMarketCrites = [
                        [FTypeId.PleaseSelect, [land.Id, FTypeId.SelectRegion]]
                    ]
                    this.$root.onGotoTab(1, land)
                    return;
            }
            this.$root.onGotoTab(1)
        },
        scrollViewSegRegion(e) {
            // console.log('scroll view seg region ')
            // console.log(e)
            // console.log(e.target.scrollTop, e.target.scrollLeft)
        },
        styleColMarketStickyLeft(wrap, isReset) {
            if (isReset) {
                wrap.querySelectorAll(`.col-market`).forEach(col => {
                    col.style.position = ''
                    col.style.left = ''
                    col.style.zIndex = ''
                })
                return
            }
            wrap.querySelectorAll(`.col-market`).forEach(col => {
                col.style.position = 'sticky'
                col.style.left = '0'
                col.style.zIndex = '1'
            })
        },
    },
    provide() {
        return {
            getValuation: this.getValuation,
            clssCheckMark: this.clssCheckMark,
            getBgColor: this.getBgColor,
            openFormEval: this.openFormEval,
            toggleMenuEval: this.toggleMenuEval,
        }
    },
    //beforeCreate() { },
    created() {
        switch (this.$root.TabStatus[0]) {
            case 1:
                this.$root.ProcessState = 0     // loading

                this.$nextTick(() => {
                    getLastState().then(oData => {
                        let sItem;
                        switch (oData.type) {
                            case 1:     // Edit Land
                                sItem = this.$store.getters.ItemBy([1, oData.id])
                                if (sItem) this.$root.openFormEditLand(sItem);
                                break;
                            case 2:     // Edit Region
                                sItem = this.$store.getters.ItemBy([3, oData.id])
                                if (sItem) this.openFormEdit(2, sItem);
                                break;
                            case 3:     // Edit Market
                                sItem = this.$store.getters.ItemBy([2, oData.id])
                                if (sItem) this.openFormEdit(3, sItem);
                                break;
                            case 4:     // Edit Submarket
                                console.log('edit sub market')
                                break;
                        }
                        this.$root.TabStatus[0] = 0
                    })
                })
                this.setLandRegionMarket()
                break;
            default:
                this.setLandRegionMarket()
                break;
        }

    },
    mounted() {
        //this.initDragDrop(2) 
        this.$root.traceHeap('Market segment')
    },
    updated() {

        if (Object.is(this.$root.DragDrop, null)) {
            const vwSegRgn = this.$el.querySelector(`.dnb-view-seg-region`);
            if (vwSegRgn.clientWidth < vwSegRgn.scrollWidth) {
                this.styleColMarketStickyLeft(vwSegRgn, false)
            } else {
                this.styleColMarketStickyLeft(vwSegRgn, true)
            }
        } else if (3 == this.$root.DragDrop.type) {
            const vwSegRgn = this.$el.querySelector(`.dnb-dnd-seg-region`);
            if (vwSegRgn.clientWidth < vwSegRgn.scrollWidth) {
                this.styleColMarketStickyLeft(vwSegRgn, false)
            } else {
                this.styleColMarketStickyLeft(vwSegRgn, true)
            }
        }
    },
}
