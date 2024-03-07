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
            PageTab: 1,
            CntProcess: 0,
        }
    },
    actions: {
        pushLand(context, land) { context.commit('pushLand', land) },
        pushRegion(context, region) { context.commit('pushRegion', region) },
        setPageTab(context, index) { context.commit('setPageTab', index) },
        setPageTab(context, index) { context.commit('setPageTab', index) },
        setCntProcess(context, count) { context.commit('setCntProcess', count) },
    },
    mutations: { // Commit with Payload (https://vuex.vuejs.org/guide/mutations.html)
        pushLand(state, land) { state.ListLand.push(land) },
        pushRegion(state, region) { state.Regions.push(region) },
        setPageTab(state, index) { state.PageTab = index },
        setCntProcess(state, count) { state.CntProcess += count },
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
        getDataPGroups: (state) => (prdIds) => {
            const lst = []
            let prdGrp = null
            for (let ii = 0; ii < state.Products.length; ii++) {
                const prd = state.Products[ii]
                if (!prdIds.includes(prd.Id)) continue
                if (!prdGrp || prdGrp.Id != prd.PrgId) {
                    prdGrp = state.ProductGroups.find(x => x.Id == prd.PrgId)
                    lst.push({ PGroup: prdGrp, Products: [{ Data: prd }] })
                } else {
                    const item = lst.find(x => x.PGroup.Id == prdGrp.Id)
                    item.Products.push({ Data: prd })
                }
            }
            return lst
        },
        getPGroups: (state) => () => { return state.ProductGroups },
        getProducts: (state) => () => { return state.Products },
        getSubPrdcts: (state) => () => { return state.SubProducts },
        getMktSegment: (state) => (id) => { return state.MarketSegments.find(x => x.Id == id) },
        getMktSegments: (state) => () => { return state.MarketSegments },
        getSubMarkets: (state) => () => { return state.StakeholderGroups },
        getGoals: (state) => () => { return state.Goals },
        getActivities: (state) => () => { return state.Activities },
        getPageTab: (state) => () => { return state.PageTab },
        getCntProcess: (state) => () => { return state.CntProcess },
    }
});
Vue.use(Vuex);