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
            { Id: 1, Name: 'Mien bac', IsNew: false, Index: 2, Description: '' },
            { Id: 3, Name: 'Hanoi', IsNew: false, Index: 1, Description: '' },
            { Id: 4, Name: 'Mien trung', IsNew: false, Index: 3, Description: '' },
            { Id: 5, Name: 'Mien nam', IsNew: false, Index: 4, Description: '' },
            { Id: 6, Name: 'TP.HoChiMinh', IsNew: false, Index: 5, Description: '' },
        ],
        Regions: [
            { Id: 1, Name: 'TP.Hanoi', LandId: 3 },
            { Id: 3, Name: 'Haiphong', LandId: 1 },
            { Id: 4, Name: 'Quang Ninh', LandId: 1 },
            { Id: 5, Name: 'Hue', LandId: 4 },
            { Id: 6, Name: 'TP.Can Tho', LandId: 6 },
        ],
        Markets: [
            { Id: 2, Name: 'Dong Xuan', LandId: 3 },
            { Id: 3, Name: 'Sapa market', LandId: 1 },
            { Id: 4, Name: 'Quang Ninh market', LandId: 1 },
            { Id: 5, Name: 'Hue market', LandId: 4 },
            { Id: 6, Name: 'Cai Rang market', LandId: 6 },
        ],
        Submarkets: [
            { Id: 7, Name: 'Square 1', MarketId: 2 },
            { Id: 3, Name: 'Cho Tinh', MarketId: 3 },
            { Id: 4, Name: 'Hue submarket 1', MarketId: 5 },
            { Id: 5, Name: 'Quangninh submarket 2', MarketId: 4 },
            { Id: 6, Name: 'Cairang submarket 3', MarketId: 6 },
        ],

        count: 0,
        message: 'Hello world!',
        Modal: null,
    },
    actions: {
        increment({ commit, state }) {
            commit('increment')
            if (state.message.includes('world')) {
                setMessCount.call(state)
            }
            return state.count
        },
        resetCount({ commit, state }) {
            commit('resetCount')
            if (state.message.includes('world')) {
                setMessCount.call(state)
            }
        },
    },
    getters: {
        count(state) { return state.count },
        message(state) { return state.message },

        moItem(state) {
            if (Object.is(state.Modal, null)) return null
            return state.Modal.item
        },

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
        LandsBy: (state) => (ids) => {
            const lst = []
            let land
            for (let ii = 0; ii < state.Lands.length; ii++) {
                land = state.Lands[ii]
                if (ids.includes(0)) lst.push(land)
                else if (ids.includes(land.Id)) lst.push(land)
            }
            lst.sort((a, b) => a.Index - b.Index)
            return lst
        },
    },
    mutations: {
        increment(state) { state.count++ },
        resetCount(state) { state.count = 0 },
        assignUser(state, name) {
            if (!name || 'Unassigned' == name) {
                setMessCount.call(state)
                return
            }
            state.message = `Hello ${name}!`
        },

        setModal(state, [item, saveClose, exitClose]) {
            console.log('set modal', item)
            state.Modal = { item, saveClose, exitClose }
        },
        outModal(state, [fncTxt, data]) {
            if (Object.is(state.Modal, null)) return
            switch (fncTxt) {
                case 'save-close':
                    if (typeof state.Modal.saveClose != 'function') return
                    state.Modal.saveClose(data)
                    break;
                case 'exit-close':
                    if (typeof state.Modal.exitClose != 'function') return
                    state.Modal.exitClose(data)
                    break;
            }
            state.Modal = null
        },

        setILang(state, val) { state.IndexLang = val },
    }
})
function setMessCount() {
    const state = this
    state.message = `Hello world: ${state.count} ${1 == state.count ? 'time' : 'times'}`
}