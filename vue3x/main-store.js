import { ListPrj, Langs } from './mock-data.js'
const { createStore } = Vuex
export default createStore({
    state: {
        Projects: ListPrj,  // [{Id, Name}]
        Languages: Langs,   // [{Key, Name}]
        
        Pages: ['Market segment strategy', `Sub-market/Product Strategy`, `Action plan`, 'Roadmap', `Team Board`],

        Lands: [
            { Id: 1, Name: 'Mien bac'},
            { Id: 3, Name: 'Hanoi'},
            { Id: 4, Name: 'Mien trung'},
            { Id: 5, Name: 'Mien nam'},
            { Id: 6, Name: 'TP.HoChiMinh'},
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

        projects(state) { return state.Projects },
        languages(state) { return state.Languages },

        pages(state) { return state.Pages },
        lands(state) { return state.Lands },
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
            state.Modal = { item, saveClose, exitClose }
        },
        outModal(state, [fncTxt, data]){
            if (Object.is(state.Modal, null)) return
            switch(fncTxt) {
                case 'save-close':
                    if(typeof state.Modal.saveClose != 'function') return
                    state.Modal.saveClose(data)
                break;
                case 'exit-close':
                    if(typeof state.Modal.exitClose != 'function') return
                    state.Modal.exitClose(data)
                break;
            }
            state.Modal = null
        },

    }
})
function setMessCount() {
    const state = this
    state.message = `Hello world: ${state.count} ${1 == state.count ? 'time' : 'times'}`
}