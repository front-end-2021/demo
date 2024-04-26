const TfsStore = Vuex.createStore({
    state() {
        return {
            Filter: { Search: '' },
        }
    },
    actions: {
        setFilterSearch(context, txt) { context.commit('setFSearch', txt) },
        removeFilter(context) { context.commit('removeFilter') },
        setFilter(context) { context.commit('setFilter') },
    },
    mutations: { // Commit with Payload (https://vuex.vuejs.org/guide/mutations.html)
        setFSearch(state, txt) {
            if (typeof txt != 'string') return
            txt = txt.trim()
            state.Filter.Search = txt
        },
        removeFilter(state) {
            state.Filter = null
        },
        setFilter(state) {
            state.Filter = { Search: '' }
        },
    },
    getters: {
        getFilter: (state) => () => { return state.Filter },
        getSearch: (state) => () => { return state.Filter.Search },
        inSearch: (state) => (txt) => {
            if(!state.Filter.Search.length) return true
            if (typeof txt != 'string') return false
            txt = txt.trim()
            if(!txt.length) return true;
            txt = txt.toLowerCase()
            let txtS = state.Filter.Search.toLowerCase()
            let inS = txt.includes(txtS)
            if(inS) return true
            return txtS.includes(txt)
        },
    }
});
Vue.use(Vuex);