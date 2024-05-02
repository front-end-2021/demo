const TfsStore = Vuex.createStore({
    state() {
        return {
            Filter: { Search: '', AssignedTo: [], States: [] },
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
        setFilterAssigns(context, type, txt) { context.commit('setFilterAssigns', type, txt) },
        setFilterStates(context, type, txt) { context.commit('setFilterStates', type, txt) },
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
        setFilterAssigns(state, txt) {
            if (Object.is(state.Filter, null)) return;
            let ii = state.Filter.AssignedTo.indexOf(txt)
            if (ii < 0) state.Filter.AssignedTo.push(txt)
            else state.Filter.AssignedTo.splice(ii, 1)
        },
        setFilterStates(state, txt) {
            if (Object.is(state.Filter, null)) return;
            let ii = state.Filter.States.indexOf(txt)
            if (ii < 0) state.Filter.States.push(txt)
            else state.Filter.States.splice(ii, 1)
        },
    },
    getters: {
        getFilter: (state) => () => { return state.Filter },
        getSearch: (state) => () => {
            if (Object.is(state.Filter, null)) return ''
            return state.Filter.Search
        },
        inSearch: (state) => (txt) => {
            if (Object.is(state.Filter, null)) return true
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
            return state.Users.filter(x => x.Name === name)
        },
        getUsersIgnore: (state) => (name) => {
            if (typeof name != 'string') return state.Users
            return state.Users.filter(x => x.Name !== name)
        },
        getAssignsTo: (state) => (ii) => {
            if (Object.is(state.Filter, null)) return []
            if (typeof ii != 'number') return state.Filter.AssignedTo
            return [state.Filter.AssignedTo[ii]]
        },
        getStates: (state) => (ii) => {
            if (Object.is(state.Filter, null)) return []
            if (typeof ii != 'number') return state.Filter.States
            return [state.Filter.States[ii]]
        },
    }
});
Vue.use(Vuex);