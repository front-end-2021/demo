const { createStore } = Vuex
export default createStore({
    state: {
        count: 0,
        message: 'Hello world'
    },
    actions: {
        increment({ commit, state }) {
            commit('increment')
            return state.count
        }
    },
    getters: {
        count(state) { return state.count },
        message(state) { return state.message },
    },
    mutations: {
        increment(state) { state.count++ },
        resetCount(state) { state.count = 0 },
    }
})