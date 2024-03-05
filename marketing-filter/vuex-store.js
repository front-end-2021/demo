const DnbVxStore = Vuex.createStore({
    state() {
        return {
            ListLand: Lands,
            Regions: Regions,
        }
    },
    actions: {
        setLands(context, lands) { context.commit('setLands', lands) },
        pushRegion(context, region) { context.commit('pushRegion', region) },
    },
    mutations: { // Commit with Payload (https://vuex.vuejs.org/guide/mutations.html)
        pushRegion(state, region) {
            state.Regions.push(region)
        },
    },
    getters: {
        getLands: (state) => (land_Ids) => {
            const lstLand = state.ListLand
            if (land_Ids.includes(0)) return lstLand
            const lst = []
            for (let ii = 0; ii < lstLand.length; ii++) {
                const land = lstLand[ii]
                if (land_Ids.includes(land.Id)) lst.push(land)
            }
            return lst
        },
        getRegions: (state) => (region_Ids) => {
            const lstRegn = state.Regions
            const lst = []
            if (region_Ids.includes(0)) return lstRegn
            for (let ii = 0; ii < lstRegn.length; ii++) {
                const rgn = lstRegn[ii]
                if (region_Ids.includes(rgn.Id)) lst.push(rgn)
            }
            return lst
        },
    }
});
Vue.use(Vuex);