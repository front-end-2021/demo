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
        }
    },
    actions: {
        pushLand(context, land) { context.commit('pushLand', land) },
        pushRegion(context, region) { context.commit('pushRegion', region) },
        setPageTab(context, index) { context.commit('setPageTab', index) },
        setListTask(context, lstFnc) { context.commit('setListTask', lstFnc) },
        pushTasks(context, lstFnc) { context.commit('pushTasks', lstFnc) },
        setMtFilter(context, flters) { context.commit('setMtFilter', flters) },
        pushMtFilter(context, flter) { context.commit('pushMtFilter', flter) },
        runFncFilters(context, fnc) { context.commit('runFncFilters', fnc) },
    },
    mutations: { // Commit with Payload (https://vuex.vuejs.org/guide/mutations.html)
        pushLand(state, land) { state.ListLand.push(land) },
        pushRegion(state, region) { state.Regions.push(region) },
        setPageTab(state, index) { state.PageTab = index },
        setListTask(state, lstFnc) {
            state.ListTask.splice(0)
            lstFnc.forEach(fnc => { state.ListTask.push(fnc) })
        },
        pushTasks(state, lstFnc) {
            lstFnc.forEach(fnc => { state.ListTask.push(fnc) })
        },
        setMtFilter(state, flters) {
            state.mtFilters.splice(0)
            flters.forEach(flter => { state.mtFilters.push(flter) })
        },
        pushMtFilter(state, flter) { state.mtFilters.push(flter) },
        runFncFilters(state, fnc) { state.mtFilters.forEach(f => fnc(f)) },
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
        getProducts: (state) => () => { return state.Products },
        getSubPrdcts: (state) => () => { return state.SubProducts },
        getMktSegment: (state) => (id) => { return state.MarketSegments.find(x => x.Id == id) },
        getMktSegments: (state) => () => { return state.MarketSegments },
        getSubMarkets: (state) => () => { return state.StakeholderGroups },
        getGoals: (state) => () => { return state.Goals },
        getMapGoals: (state) => (submarketIds, productIds) => {
            const mapGoals = state.Goals.GroupBy(x => x.SubmarketProductId)
            return mapGoals.FilterGoals(submarketIds, productIds)
        },
        getActivities: (state) => () => { return state.Activities },
        getRefActv: (state) => (goalIds) => {
            const lst = []
            if(!Array.isArray(goalIds)) {
                for (let aa = 0; aa < state.Activities.length; aa++) {
                    const actv = state.Activities[aa]
                    lst.push(actv)
                }
                return lst
            }
            const copyGoalIds = [...goalIds]
            for (let aa = 0; aa < state.Activities.length; aa++) {
                const actv = state.Activities[aa]
                const ii = copyGoalIds.indexOf(actv.GoalId)
                if (-1 < ii) {
                    lst.push(actv)
                    copyGoalIds.splice(ii, 1)
                }
            }
            return lst
        },
        getPageTab: (state) => () => { return state.PageTab },
        getListTask: (state) => () => { return state.ListTask },
        getMtFilter: (state) => (i) => { return state.mtFilters[i] },
    }
});
Vue.use(Vuex);