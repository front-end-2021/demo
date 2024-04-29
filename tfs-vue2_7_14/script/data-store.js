const TfsStore = Vuex.createStore({
    state() {
        return {
            Filter: { Search: '' },
            Users: [{ Id: -(Date.now()), Name: 'Bill Gate' },
            { Id: -(Date.now() + 10), Name: 'Ellon Musk' },
            { Id: -(Date.now() + 20), Name: 'Larry Page' },
            { Id: -(Date.now() + 30), Name: 'Segey Brin' },
            { Id: -(Date.now() + 40), Name: 'Mark Zukerberc' }]
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
            if (!state.Filter.Search.length) return true
            if (typeof txt != 'string') return false
            txt = txt.trim()
            if (!txt.length) return true;
            txt = txt.toLowerCase()
            let txtS = state.Filter.Search.toLowerCase()
            let inS = txt.includes(txtS)
            if (inS) return true
            return txtS.includes(txt)
        },
        getUsers: (state) => (name) => {
            if (typeof name != 'string') return state.Users
            return state.Users.find(x => x.Name === name)
        },
        getUsersIgnore: (state) => (name) => {
            if (typeof name != 'string') return state.Users
            return state.Users.filter(x => x.Name !== name)
        }
    }
});
Vue.use(Vuex);