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
        setModal({ commit, state }, item) {
            commit('setModal', item)
            return state.Modal
        },
    },
    getters: {
        count(state) { return state.count },
        message(state) { return state.message },
        
        modal(state) { return state.Modal },

        projects(state) { return state.Projects },
        iproject(state) { return state.IndexProject},
        project: (state) => (id) => {
            if (typeof id != 'number') return state.Projects[state.IndexProject]
            return state.Projects.find(x => x.Id === id)
        },
        languages(state) { return state.Languages },
        ilang(state) { return state.IndexLang},

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
        setModal(state, item) { state.Modal = item },
        setIProject(state, ii) { state.IndexProject = ii },
        setILang(state, ii) { state.IndexLang = ii },
    }
})
function setMessCount() {
    const state = this
    state.message = `Hello world: ${state.count} ${1 == state.count ? 'time' : 'times'}`
}