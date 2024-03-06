const DnbVxStore = Vuex.createStore({
    state() {
        return {
            ListLand: Lands,
            Regions: Regions,
            ProductGroups: ProductGroups,
            Products: Products,
            SubProducts: SubProducts,
            MarketSegments: MarketSegments,
            StakeholderGroups: StakeholderGroups,
            Goals: Goals,
            Activities: Activities,
        }
    },
    actions: {
        pushLand(context, land) { context.commit('pushLand', land) },
        pushRegion(context, region) { context.commit('pushRegion', region) },
    },
    mutations: { // Commit with Payload (https://vuex.vuejs.org/guide/mutations.html)
        pushLand(state, land) { state.ListLand.push(land) },
        pushRegion(state, region) { state.Regions.push(region) },
    },
    getters: {
        getAllLandId: (state) => () => { return state.ListLand.map(x => x.Id) },
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