import {
    ListPrj, Langs,
    DemoLands, DemoRegions,
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
        //Pages: ['Market segment strategy', `Sub-market/Product Strategy`, `Action plan`, 'Roadmap', `Team Board`],
        Pages: ['M4rk3t s3gm3nt str@t3gy', `$_b-m4rk3t/Pr0d-ct Str4t3gy`, `@ct10n pl4n`, 'Ro@dm4p', `T3@m B04rd`], /*dnb_dev */
        Lands: [], // DemoLands,
        Regions: [], // DemoRegions,
        Markets: [], // DemoMarkets,
        Submarkets: [], // DemoSubmarkets,

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
            const lstNewSort = []
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
            newIds.forEach((nId, ii) => {
                oId = oldIds[ii]
                oItem = items.find(l => l.Id == oId)
                lstNewSort.push([nId, oItem.ASort])
            });
            lstNewSort.forEach(([nId, nSort]) => {
                item = items.find(l => l.Id == nId)
                item.ASort = nSort
            });
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

        activeLang(state) {
            const lng = state.Languages[state.IndexLang]
            if (typeof lng != 'object' || Object.is(lng, null)) return {}
            return lng
        },
        txtFilter: (state) => (id) => {
            const txt = state.ContextLang;
            if(!txt) return;
            switch (id) {
                case FTypeId.SelectAll:
                    return txt.SelectAll;
                case FTypeId.PleaseSelect:
                    return txt.PleaseSelect;
                case FTypeId.SelectLand:
                    return txt.SelectLand;
                case FTypeId.SelectMarketSegments:
                    return txt.SelectMarketsegments;
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
            }
            if (!lst.length) return 1;
            lst.sort((a, b) => b - a)
            return lst[0] + 1
        },
        LandsMarketsBy: (state) => ([type, ids]) => {
            let lst = []
            switch (type) {
                case 1:     // Land
                    lst = buildListBy.call(state.Lands, ids, (itm) => ids.includes(itm.Id))
                    
                    break;
                case 2:     // Market
                    lst = buildListBy.call(state.Markets, ids, (itm) => ids.includes(itm.Id))
                    
                    break
            }
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
        LandsMarketsExept: (state) => ([type, ignoreIds]) => {
            const lst = []
            switch (type) {
                case 1:     // Land
                    buildList(state.Lands)
                    
                    break;
                case 2:     // Market
                    buildList(state.Markets)
                    
                    break
            }
            lst.sort((a, b) => a.ASort - b.ASort)
            return lst
            function buildList(lstItem) {
                for (let ii = 0, item; ii < lstItem.length; ii++) {
                    item = lstItem[ii]
                    if (!ignoreIds.includes(item.Id)) lst.push(item)
                }
            }
        },
        RegionByLands: (state) => (landIds) => {
            const lst = buildListBy.call(state.Regions, landIds, (itm) => landIds.includes(itm.LandId))
            
            lst.sort((a, b) => a.ASort - b.ASort)
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
                    return;
                case 2:     // localStorage
                    state.Lands = getLocal(1)
                    state.Regions = getLocal(2)
                    state.Markets = getLocal(3)
                    state.Submarkets = getLocal(4)
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
        },
        addUpdateLocal(state, [type, item, iProject]) {
            const prj = state.Projects[iProject]
            if (!prj) return
            if (!Object.is(item, null)) {
                switch (type) {
                    case 1:     // Lands
                        state.Lands.push(item);
                        break;;
                    case 2:     // Regions
                        state.Regions.push(item);
                        break;
                    case 3:     // Markets
                        state.Markets.push(item);
                        break;
                    case 4:     // Submarkets
                        state.Submarkets.push(item);
                        break;
                }
            }
            if (2 == prj.Id) {          //localStorage
                switch (type) {
                    case 1:     // Lands
                        setLocal(type, state.Lands)
                        break;;
                    case 2:     // Regions
                        setLocal(type, state.Regions)
                        break;
                    case 3:     // Markets
                        setLocal(type, state.Markets)
                        break;
                    case 4:     // Submarkets
                        setLocal(type, state.Submarkets)
                        break;
                }
            }
        },
    }
})