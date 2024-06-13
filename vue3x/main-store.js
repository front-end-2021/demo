import { ListPrj, Langs } from './mock-data.js'
const { createStore } = Vuex
export default createStore({
    state: {
        Projects: ListPrj,
        IndexProject: 0,
        Languages: Langs,
        IndexLang: 0,

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
        iproject(state) { return state.IndexProject },
        project: (state) => (id) => {
            if (typeof id != 'number') return state.Projects[state.IndexProject]
            return state.Projects.find(x => x.Id === id)
        },
        languages(state) { return state.Languages },
        ilang(state) { return state.IndexLang },

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
        setIProject(state, ii) { state.IndexProject = ii },
        setILang(state, ii) { state.IndexLang = ii },
    }
})
function setMessCount() {
    const state = this
    state.message = `Hello world: ${state.count} ${1 == state.count ? 'time' : 'times'}`
}