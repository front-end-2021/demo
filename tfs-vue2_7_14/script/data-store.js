const TfsStore = Vuex.createStore({
    state() {
        return {
            Filter: { Search: '', AssignedTo: [], States: [] },
            Users: [{ Id: -(Date.now()), Name: 'Bill Gate' },
            { Id: -(Date.now() + 10), Name: 'Ellon Musk' },
            { Id: -(Date.now() + 20), Name: 'Larry Page' },
            { Id: -(Date.now() + 30), Name: 'Segey Brin' },
            { Id: -(Date.now() + 40), Name: 'Mark Zukerberc' }],
            States: ['New', 'Approved', 'Committed', 'Done', 'Removed'],
        }
    },
    actions: {
        setFilterSearch(context, txt) { context.commit('setFSearch', txt) },
        switchFilter(context, isNew) { context.commit('switchFilter', isNew) },
        setFilterChecks(context, data) { context.commit('setFilterChecks', data) },
        clearFilterChecks(context, type) { context.commit('clearFilterChecks', type) },
    },
    mutations: { // Commit with Payload (https://vuex.vuejs.org/guide/mutations.html)
        setFSearch(state, txt) {
            if (typeof txt != 'string') return
            txt = txt.trim()
            state.Filter.Search = txt
        },
        switchFilter(state, isNew) {
            if (isNew) return;
            state.Filter.Search = ''
            state.Filter.AssignedTo.splice(0)
            state.Filter.States.splice(0)
        },
        setFilterChecks(state, data) {
            if (Object.is(state.Filter, null)) return;
            let ii = -2
            switch (data.type) {
                case 2:         // Assigned to
                    ii = state.Filter.AssignedTo.indexOf(data.name)
                    if (ii < 0) state.Filter.AssignedTo.push(data.name)
                    else state.Filter.AssignedTo.splice(ii, 1)
                    break;
                case 3:         // States
                    ii = state.Filter.States.indexOf(data.name)
                    if (ii < 0) state.Filter.States.push(data.name)
                    else state.Filter.States.splice(ii, 1)
                    break;
                default: break;
            }
        },
        clearFilterChecks(state, type) {
            if (Object.is(state.Filter, null)) return;
            switch (type) {
                case 2:         // Assigned to
                    state.Filter.AssignedTo.splice(0)
                    break;
                case 3:         // States
                    state.Filter.States.splice(0)
                    break;
                default: break;
            }
        },
    },
    getters: {
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
        getFStates: (state) => (ii) => {
            if (Object.is(state.Filter, null)) return []
            if (typeof ii != 'number') return state.Filter.States
            return [state.Filter.States[ii]]
        },
    }
});
Vue.use(Vuex);