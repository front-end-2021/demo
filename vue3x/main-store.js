import {
    ListPrj, Langs,
    DemoLands, DemoRegions,
    DemoPrdGroups, DemoProducts,
    DemoMarkets, DemoSubmarkets,
} from './mock-data.js';
import { getTxtBy, getLocal, setLocal } from './common.js';
import { FTypeId } from './components/dFilter.js';
import { createStore } from 'vuex'

function buildListBy(ids, fnc) {
    const lst = []
    for (let ii = 0, item; ii < this.length; ii++) {
        item = this[ii]
        if (ids.includes(0)) lst.push(item)
        else if (fnc(item)) lst.push(item)
    }
    return lst
}
export default createStore({
    state: {
        Projects: [],// ListPrj,  // [{Id, Name}]
        Languages: [], // Langs,   // [{Key, Name}]
        IndexLang: 0,
        ContextLang: getTxtBy('en'),

        Lands: [], // DemoLands,
        Regions: [], // DemoRegions,
        Markets: [], // DemoMarkets,
        Submarkets: [], // DemoSubmarkets,
        ProductGroups: DemoPrdGroups,
        Products: DemoProducts,

        WkMapDes: new WeakMap(),

        MarketRegions: [], // [{MarketId, RegionId, Criterias [], Active, Comment}]
        count: 0,
        Modals: [],
    },
    actions: {
        openFormValue({ commit, state }, [mId, rId]) {
            const ii = state.MarketRegions.findIndex(x => mId == x.MarketId && rId == x.RegionId);
            return [ii, state.MarketRegions[ii]]
        },
        outConfirmModal({ commit, state }, [fncTxt, data, elDom]) {
            if (!state.Modals.length) return
            const lastMdl = state.Modals[state.Modals.length - 1]
            if (Object.is(lastMdl, null)) return null;

            switch (fncTxt) {
                case 'save-close':
                    if (typeof lastMdl.saveClose != 'function') return;
                    if (!lastMdl.saveClose(data, elDom)) return false;
                    break;
                case 'exit-close':
                    if (typeof lastMdl.exitClose != 'function') return
                    if (!lastMdl.exitClose(data, elDom)) return false
                    break;
            }
            return state
        },
        updateAsort({ commit, state }, [type, oldIds, newIds]) {
            const mapIndex = new Map()
            let oId, oItem, item;
            const items = [];
            switch (type) {
                case 1:     // Lands
                    buildItems(state.Lands)
                    break;
                case 2:     // Region
                    buildItems(state.Regions);
                    break;
                case 3:     // Market
                    buildItems(state.Markets)
                    break;
                default: return items;
            }
            //  const lstNewSort = []
            newIds.forEach((nId, ii) => {
                oId = oldIds[ii]
                oItem = items.find(l => l.Id == oId)
                mapIndex.set(nId, oItem.ASort)
               // lstNewSort.push([nId, oItem.ASort])
            });
            for(let ii = 0; ii < items.length; ii++) {
                item = items[ii]
                item.ASort = mapIndex.get(item.Id)
            }
            // lstNewSort.forEach(([nId, nSort]) => { item = items.find(l => l.Id == nId); item.ASort = nSort})
            return items;
            function buildItems(lstItem) {
                for (let ii = 0; ii < lstItem.length; ii++) {
                    item = lstItem[ii]
                    if (newIds.includes(item.Id)) items.push(item)
                }
            }
        },
    },
    getters: {
        ListModal(state) { return state.Modals },
        Pages(state) {
            const ctxLang = state.ContextLang
            return [ctxLang.NavMarkt, ctxLang.NavTeilmarkt, ctxLang.NavMass, ctxLang.NavRMap, ctxLang.NavTBoard]
        },
        activeLang(state) {
            const lng = state.Languages[state.IndexLang]
            if (typeof lng != 'object' || Object.is(lng, null)) return {}
            return lng
        },
        txtFilter: (state) => (id) => {
            const txt = state.ContextLang;
            if (!txt) return;
            switch (id) {
                case FTypeId.SelectAll:
                    return txt.SelectAll;
                case FTypeId.PleaseSelect:
                    return txt.PleaseSelect;
                case FTypeId.SelectLand:
                    return txt.SelectLand;
                case FTypeId.SelectMarketSegments:
                    return txt.SelectMarketsegments;
                case FTypeId.SelectRegion:
                    return txt.SelectRegion;
                case FTypeId.Land_Region:
                    return `${txt.Land}/${txt.Region}`;
                case FTypeId.ProductGroups_Product:
                    return `${txt.ProductGroups}/${txt.Product}`;
                case FTypeId.MarketSegments_Submarket:
                    return `${txt.Marketsegments}/${txt.Submarkets}`;
                default: break;
            }
            return ''
        },
        newASort: (state) => (type) => {
            let lst = []
            switch (type) {
                case 1: lst = state.Lands.map(x => x.ASort)
                    break;
                case 2: lst = state.Regions.map(x => x.ASort)
                    break;
                case 3: lst = state.Markets.map(x => x.ASort)
                    break;
                case 5: lst = state.ProductGroups.map(x => x.ASort)
                    break;
                case 8: lst = state.Products.map(x => x.ASort)
                    break;
            }
            if (!lst.length) return 1;
            lst.sort((a, b) => b - a)
            return lst[0] + 1
        },
        SortedItems: (state) => ([type, ids, ignoreIds]) => {
            if (!ids.length && !ignoreIds.length) return []
            let lst = []
            if (ids.length) {
                switch (type) {
                    case 1:     // Land
                        lst = buildListBy.call(state.Lands, ids, (itm) => ids.includes(itm.Id))
                        break;
                    case 2:     // Market
                        lst = buildListBy.call(state.Markets, ids, (itm) => ids.includes(itm.Id))
                        break
                    case 3:     // Region
                        lst = buildListBy.call(state.Regions, ids, (itm) => ids.includes(itm.Id))
                        break
                    case 4: //Submarkets
                        lst = buildListBy.call(state.Submarkets, ids, (itm) => ids.includes(itm.Id))
                        break
                    case 5:     // Product Groups
                        lst = buildListBy.call(state.ProductGroups, ids, (itm) => ids.includes(itm.Id))
                        break
                    case 8:     // Products
                        lst = buildListBy.call(state.Products, ids, (itm) => ids.includes(itm.Id))
                        break
                }
            } else {
                switch (type) {
                    case 1: lst = state.Lands;
                        break;
                    case 2: lst = state.Markets;
                        break
                    case 3: lst = state.Regions;
                        break
                    case 4: lst = state.Submarkets;
                        break
                    case 5: lst = state.ProductGroups;
                        break
                    case 8: lst = state.Products;
                        break
                }
            }
            if (ignoreIds.length) {
                lst = buildList(lst)
                function buildList(srItems) {
                    const dItems = []
                    for (let ii = 0, item; ii < srItems.length; ii++) {
                        item = srItems[ii]
                        if (!ignoreIds.includes(item.Id)) dItems.push(item)
                    }
                    return dItems
                }
            }
            if (lst.length < 2) return lst;
            lst.sort((a, b) => a.ASort - b.ASort)
            return lst
        },
        ItemBy: (state) => ([type, id]) => {
            switch (type) {
                case 1:     // Land
                    return state.Lands.find(x => x.Id == id);
                case 2:     // Market
                    return state.Markets.find(x => x.Id == id);
                case 3:     // Region
                    return state.Regions.find(x => x.Id == id);
            }
        },
        SortItemsByParent: (state) => ([type, ptIds, ids]) => {
            let lst = []
            switch (type) {
                case 2: // Regions by LandId
                    lst = buildListBy.call(state.Regions, ptIds, (itm) => ptIds.includes(itm.LandId))
                    break;
                case 3: // Product groups by RegionId
                    lst = buildListBy.call(state.ProductGroups, ptIds, (itm) => ptIds.includes(itm.RegionId))
                    if (Array.isArray(ids) && ids.length && !ids.includes(0)) {
                        lst = buildListBy.call(lst, ids, (itm) => ids.includes(itm.Id))
                    }
                    break;
                case 4: // Products by PrdGroupId
                    if (ptIds.length)
                        lst = buildListBy.call(state.Products, ptIds, (itm) => ptIds.includes(itm.PrdGroupId))
                    else lst = buildListBy.call(state.Products, [0])
                    if (Array.isArray(ids) && ids.length && !ids.includes(0)) {
                        lst = buildListBy.call(lst, ids, (itm) => ids.includes(itm.Id))
                    }
                    break;
                case 5: // Markets by LandId
                    lst = buildListBy.call(state.Markets, ptIds, (itm) => ptIds.includes(itm.LandId))
                    if (Array.isArray(ids) && ids.length && !ids.includes(0)) {
                        lst = buildListBy.call(lst, ids, (itm) => ids.includes(itm.Id))
                    }
                    break;
                case 6: // SubMarkets by MarketId
                    lst = buildListBy.call(state.Submarkets, ptIds, (itm) => ptIds.includes(itm.MarketId))
                    if (Array.isArray(ids) && ids.length && !ids.includes(0)) {
                        lst = buildListBy.call(lst, ids, (itm) => ids.includes(itm.Id))
                    }
                    break;
            }
            if (1 < lst.length) lst.sort((a, b) => a.ASort - b.ASort)
            return lst
        },
        MarketRegionBy: (state) => ([mId, rId]) => {
            return state.MarketRegions.find(x => mId == x.MarketId && rId == x.RegionId);
        },
        newNumId: (state) => (type) => {
            let demoIds = [];
            switch (type) {
                case 1: // Land
                    demoIds = DemoLands.map(x => x.Id)
                    break;
                case 2: // Region
                    demoIds = DemoRegions.map(x => x.Id)
                    break;
                case 3: // Market
                    demoIds = DemoMarkets.map(x => x.Id)
                    break;
                case 4: // Submarket
                    demoIds = DemoSubmarkets.map(x => x.Id)
                    break;
                default: return 1989;
            }
            const localIds = getLocal(type).map(x => x.Id)
            const allIds = [...demoIds, ...localIds];
            if (!allIds.length) return 1;
            allIds.sort((a, b) => b - a)        // decrease
            return allIds[0] + 1;
        },
        Des: (state) => (item) => { return state.WkMapDes.get(item) || '' },
        checkChangeExt: (state, getters) => ([item, mItem, mess]) => {
            let des = mItem.Description
            if (typeof des == 'string') {
                des = des.trim()
                if (!state.WkMapDes.has(item)) {
                    if ('' != des) setDes()
                } else if (state.WkMapDes.get(item) != des) {
                    setDes()
                }
                function setDes() {
                    if (!mess) mess = `Something changes: \n`;
                    mess += `Description : ${getters.Des(item)} => ${des}`
                }
            }
            return mess;
        },
    },
    mutations: {
        setModal(state, [item, saveClose, exitClose]) { state.Modals.push({ item, saveClose, exitClose }) },
        outModal(state, [fncTxt, data]) {
            if (!state.Modals.length) return
            let lastMdl = state.Modals.pop()
            if (Object.is(lastMdl, null)) return null
            switch (fncTxt) {
                case 'save-close':
                    if (typeof lastMdl.saveClose != 'function') return
                    lastMdl.saveClose(data)
                    break;
                case 'exit-close':
                    if (typeof lastMdl.exitClose != 'function') return
                    lastMdl.exitClose(data)
                    break;
            }
        },
        setILang(state, val) {
            state.IndexLang = val
            const lng = state.Languages[val]
            if (lng) state.ContextLang = getTxtBy(lng.Key);
            else state.ContextLang = getTxtBy()
        },
        setDataProject(state, iProject) {
            const prj = state.Projects[iProject]
            if (!prj) return
            switch (prj.Id) {
                case 1:     // Demo
                    state.Lands = DemoLands
                    state.Regions = DemoRegions
                    state.Markets = DemoMarkets
                    state.Submarkets = DemoSubmarkets
                    state.ProductGroups = DemoPrdGroups
                    state.Products = DemoProducts
                    return;
                case 2:     // localStorage
                    state.Lands = getLocal(1)
                    state.Regions = getLocal(2)
                    state.Markets = getLocal(3)
                    state.Submarkets = getLocal(4)
                    state.ProductGroups = getLocal(7)
                    state.Products = getLocal(8)
                    return;
                case 3:     // Clear local storage
                    localStorage.clear();
                    break;
                default:
                    break;
            }
            state.Lands = []
            state.Regions = []
            state.Markets = []
            state.Submarkets = []
            state.ProductGroups = []
            state.Products = []
        },
        addUpdateLocal(state, [type, item, iProject]) {
            const prj = state.Projects[iProject]
            if (!prj) return
            if (!Object.is(item, null)) {
                switch (type) {
                    case 1: state.Lands.push(item);
                        break;;
                    case 2: state.Regions.push(item);
                        break;
                    case 3: state.Markets.push(item);
                        break;
                    case 4: state.Submarkets.push(item);
                        break;
                    case 5: state.ProductGroups.push(item);
                        break;
                    case 8: state.Products.push(item);
                        break;
                }
            }
            if (2 == prj.Id) {          //localStorage
                switch (type) {
                    case 1: setLocal(type, state.Lands)
                        break;;
                    case 2: setLocal(type, state.Regions)
                        break;
                    case 3: setLocal(type, state.Markets)
                        break;
                    case 4: setLocal(type, state.Submarkets)
                        break;
                    case 5: setLocal(7, state.ProductGroups)
                        break;
                    case 8: setLocal(8, state.ProductGroups)
                        break;
                }
            }
        },
        setDes(state, [item, des]) {
            if (typeof des != 'string' || '' == des.trim()) {
                state.WkMapDes.delete(item)
                return;
            }
            state.WkMapDes.set(item, des)
        },
    }
})