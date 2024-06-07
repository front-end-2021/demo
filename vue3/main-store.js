const { createStore } = Vuex
export default createStore({
    state: {
        count: 0,
        message: 'Hello world!'
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
    }
})
function setMessCount() {
    const state = this
    state.message = `Hello world: ${state.count} ${1 == state.count ? 'time' : 'times'}`
}