import { ListPrj, Langs } from './mock-data.js';
import { getTxtBy } from './common.js';
import { FTypeId } from './components/dFilter.js';
const { createStore } = Vuex
export default createStore({
    state: {
        Projects: ListPrj,  // [{Id, Name}]
        Languages: Langs,   // [{Key, Name}]
        IndexLang: 0,

        Pages: ['Market segment strategy', `Sub-market/Product Strategy`, `Action plan`, 'Roadmap', `Team Board`],

        Lands: [
            { Id: 1, Name: 'Mien bac', IsNew: false, ASort: 2, Description: '' },
            { Id: 3, Name: 'Hanoi', IsNew: false, ASort: 1, Description: '' },
            { Id: 4, Name: 'Mien trung', IsNew: false, ASort: 3, Description: '' },
            { Id: 5, Name: 'Mien nam', IsNew: false, ASort: 5, Description: '' },
            { Id: 6, Name: 'TP.HoChiMinh', IsNew: false, ASort: 4, Description: '' },
        ],
        Regions: [
            { Id: 1, Name: 'TP.Hanoi', LandId: 3, ASort: 1 },
            { Id: 3, Name: 'Haiphong', LandId: 1, ASort: 3 },
            { Id: 4, Name: 'TP.Can Tho', LandId: 6, ASort: 5 },
            { Id: 5, Name: 'Hue', LandId: 4, ASort: 4 },
            { Id: 7, Name: 'Quang Ninh', LandId: 1, ASort: 2 },
        ],
        Markets: [
            { Id: 2, Name: 'Dong Xuan', LandId: 3, ASort: 3, Description: '' },
            { Id: 3, Name: 'Sapa market', LandId: 1, ASort: 1, Description: '' },
            { Id: 4, Name: 'Quang Ninh market', LandId: 1, ASort: 2, Description: '' },
            { Id: 5, Name: 'Hue market', LandId: 4, ASort: 4, Description: '' },
            { Id: 6, Name: 'Cai Rang market', LandId: 6, ASort: 5, Description: '' },
        ],
        Submarkets: [
            { Id: 7, Name: 'Square 1', MarketId: 2 },
            { Id: 3, Name: 'Cho Tinh', MarketId: 3 },
            { Id: 4, Name: 'Hue submarket 1', MarketId: 5 },
            { Id: 5, Name: 'Quangninh submarket 2', MarketId: 4 },
            { Id: 6, Name: 'Cairang submarket 3', MarketId: 6 },
        ],

        MarketRegions: [], // [{MarketId, RegionId, Criterias [], Active, Comment}]
        count: 0,
        Modals: [],
    },
    actions: {
        // resetCount({ commit, state }) { commit('resetCount'); return state.Project; },
        openFormValue({ commit, state }, [mId, rId]) {
            const ii = state.MarketRegions.findIndex(x => mId == x.MarketId && rId == x.RegionId);
            return [ii, JSON.parse(JSON.stringify(state.MarketRegions[ii]))]
        },
    },
    getters: {
        ListModal(state) { return state.Modals },

        activeLang(state) {
            const lng = state.Languages[state.IndexLang]
            if (typeof lng != 'object' || Object.is(lng, null)) return {}
            return lng
        },
        txtLang(state) {
            const lng = state.Languages[state.IndexLang]
            if (lng) return getTxtBy(lng.Key);
            return getTxtBy()
        },
        txtFilter: (state) => (id) => {
            const lng = state.Languages[state.IndexLang]
            if (!lng) return ''
            const txt = getTxtBy(lng.Key);
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

        newId: (state) => (type) => {
            let lst = []
            switch (type) {
                case 1: lst = state.Lands.map(x => x.Id)
                    break;
                case 2: lst = state.Regions.map(x => x.Id)
                    break;
                case 3: lst = state.Markets.map(x => x.Id)
                    break;
            }
            if (!lst.length) return 1;
            lst.sort((a, b) => b - a)
            return lst[0] + 1
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
        LandsBy: (state) => (ids) => {
            const lst = []
            let land
            for (let ii = 0; ii < state.Lands.length; ii++) {
                land = state.Lands[ii]
                if (ids.includes(0)) lst.push(land)
                else if (ids.includes(land.Id)) lst.push(land)
            }
            lst.sort((a, b) => a.ASort - b.ASort)
            return lst
        },
        RegionByLands: (state) => (landIds) => {
            const lst = []
            for (let rr = 0; rr < state.Regions.length; rr++) {
                let region = state.Regions[rr]
                if (landIds.includes(0)) lst.push(region)
                else if (landIds.includes(region.LandId)) lst.push(region)
            }
            lst.sort((a, b) => a.ASort - b.ASort)
            return lst
        },
        MarketsBy: (state) => (ids) => {
            const lst = []
            let item
            for (let ii = 0; ii < state.Markets.length; ii++) {
                item = state.Markets[ii]
                if (ids.includes(0)) lst.push(item)
                else if (ids.includes(item.Id)) lst.push(item)
            }
            lst.sort((a, b) => a.ASort - b.ASort)
            return lst
        },
        MarketRegionBy: (state) => ([mId, rId]) => {
            return state.MarketRegions.find(x => mId == x.MarketId && rId == x.RegionId);
        },
    },
    mutations: {
        setModal(state, [item, saveClose, exitClose]) { state.Modals.push({ item, saveClose, exitClose }) },
        outModal(state, [fncTxt, data]) {
            if (!state.Modals.length) return
            let lastItem = state.Modals.pop()
            if (Object.is(lastItem, null)) return null
            switch (fncTxt) {
                case 'save-close':
                    if (typeof lastItem.saveClose != 'function') return
                    lastItem.saveClose(data)
                    break;
                case 'exit-close':
                    if (typeof lastItem.exitClose != 'function') return
                    lastItem.exitClose(data)
                    break;
            }
        },

        setILang(state, val) { state.IndexLang = val },
    }
})