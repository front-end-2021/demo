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
            ListTask: [],
            mtFilters: [],

            FilterIds: [],
        }
    },
    actions: {
        pushLand({ commit, state }, land) {
            commit('pushLand', land)
            return state.ListLand
        },
        pushRegion({ commit, state }, region) {
            commit('pushRegion', region)
            return state.Regions
        },
        setPageTab(context, index) { context.commit('setPageTab', index) },
        setListTask({ commit, state }, lstFnc) {
            commit('setListTask', lstFnc)
            return state.ListTask
        },
        pushMtFilter(context, flter) { context.commit('pushMtFilter', flter) },
        runFncFilters(context, fnc) { context.commit('runFncFilters', fnc) },
        onFilter({commit, state}, ii) {
            commit('onFilter', ii)
            return state.FilterIds[ii]
        },
    },
    mutations: { // Commit with Payload (https://vuex.vuejs.org/guide/mutations.html)
        pushLand(state, land) { state.ListLand.push(land) },
        pushRegion(state, region) { state.Regions.push(region) },
        setPageTab(state, index) { state.PageTab = index },
        setListTask(state, lstFnc) {
            state.ListTask.splice(0)
            lstFnc.forEach(fnc => { state.ListTask.push(fnc) })
        },
        setMtFilter(state, flters) {
            state.mtFilters.splice(0)
            flters.forEach(flter => {
                state.mtFilters.push(flter)
                state.FilterIds.push({
                    LandIds: flter.LandIds,
                    RegionIds: flter.RegionIds,
                    ProductIds: flter.ProductIds,
                    MarketIds: flter.MarketIds,
                    SubmarketIds: flter.SubmarketIds,
                })
            })
        },
        pushMtFilter(state, flter) {
            state.mtFilters.push(flter)
            state.FilterIds.push({
                LandIds: flter.LandIds,
                RegionIds: flter.RegionIds,
                ProductIds: flter.ProductIds,
                MarketIds: flter.MarketIds,
                SubmarketIds: flter.SubmarketIds,
            })
        },
        runFncFilters(state, fnc) { state.mtFilters.forEach(f => fnc(f)) },
        onFilter(state, ii) {
            const flt = state.mtFilters[ii]
            state.FilterIds.splice(ii, 1, {
                LandIds: flt.LandIds,
                RegionIds: flt.RegionIds,
                ProductIds: flt.ProductIds,
                MarketIds: flt.MarketIds,
                SubmarketIds: flt.SubmarketIds
            })
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
        getDataPGroups: (state) => (prdIds) => {
            const lst = []
            let prdGrp = null
            for (let ii = 0; ii < state.Products.length; ii++) {
                const prd = state.Products[ii]
                if (!prdIds.includes(0) && !prdIds.includes(prd.Id)) continue
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
        getProducts: (state) => (pIds) => {
            if (!Array.isArray(pIds)) return state.Products
            if (!pIds.length) return []
            if (pIds.includes(0)) return state.Products
            const lst = []
            for (let ii = 0; ii < state.Products.length; ii++) {
                const prd = state.Products[ii]
                if (pIds.includes(prd.Id)) lst.push(prd)
            }
            return lst
        },
        getSubPrdcts: (state) => () => { return state.SubProducts },
        getMktSegment: (state) => (id) => { return state.MarketSegments.find(x => x.Id == id) },
        getMktSegments: (state) => (ids) => {
            if (!Array.isArray(ids)) return state.MarketSegments
            if (!ids.length) return []
            if (ids.includes(0)) return state.MarketSegments
            const lst = []
            for (let ii = 0; ii < state.MarketSegments.length; ii++) {
                const item = state.MarketSegments[ii]
                if (ids.includes(item.Id)) lst.push(item)
            }
            return lst
        },
        getSubMarkets: (state) => (ids) => {
            if (!Array.isArray(ids)) return state.StakeholderGroups
            if (!ids.length) return []
            if (ids.includes(0)) return state.StakeholderGroups
            const lst = []
            for (let ii = 0; ii < state.StakeholderGroups.length; ii++) {
                const item = state.StakeholderGroups[ii]
                if (ids.includes(item.Id)) lst.push(item)
            }
            return lst
        },
        getGoals: (state) => () => { return state.Goals },
        getActivities: (state) => (gIds) => {
            if (!Array.isArray(gIds)) return state.Activities
            if (!gIds.length) return []
            const lst = []
            for (let ii = 0; ii < state.Activities.length; ii++) {
                const item = state.Activities[ii]
                if (gIds.includes(item.GoalId)) lst.push(item)
            }
            return lst
        },
        getPageTab: (state) => () => { return state.PageTab },
        getListTask: (state) => () => { return state.ListTask },
        getMtFilter: (state) => (i) => { return state.mtFilters[i] },
        getFilterIds: (state) => (ii) => { return state.FilterIds[ii] },
        getGoalByFids: (state) => (ii) => {
            const flt = state.FilterIds[ii]
            return state.Goals.getGoalsBy(flt.SubmarketIds, flt.ProductIds)
        },
    }
});
Vue.use(Vuex);