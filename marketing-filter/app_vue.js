function newAppVue(mFlter) {
    const app = new Vue({
        el: '#dnb-app-vue',
        name: 'DnbAppVue',
        data: {
            Lands: Lands,
            Regions: Regions,
            ProductGroups: ProductGroups,
            Products: Products,
            SubProducts: SubProducts,
            MarketSegments: MarketSegments,
            StakeholderGroups: StakeholderGroups,
            Goals: Goals,

            ListDataUI: [],
        },
        // computed: { },
        // provide() {
        //     return { }
        // },
        methods: {
            renderData(filter) {
                const lstGoal = getGoals.call(this, filter.GoalIds)
                const lstLand = getLands.call(this, filter.LandIds)
                const lstRegion = getRegions.call(this, filter.RegionIds)
                const lstProductGrp = getProductGroups.call(this, filter.ProductIds)
                const lstSubmarketId = getSubmarketIds.call(this, filter.SubmarketIds, filter.LandIds)
                const lstPath = getPaths(lstLand, lstRegion)        // {Land, Region}
                addProducts()
                addSubmarketIds()
                addGoals()
                this.ListDataUI = lstPath

                function addGoals() {
                    for (let ii = lstPath.length - 1; -1 < ii; ii--) {
                        const item = lstPath[ii]
                        let goals = filterGoalsBy.call(lstGoal, item.IdSubmarkets, 0)
                        if (!goals.length) {
                            lstPath.splice(ii, 1)
                            continue
                        }
                        const idProducts = item.Products.map(x => x.Id)
                        goals = filterGoalsBy.call(goals, idProducts, 1)
                        if (!goals.length) {
                            lstPath.splice(ii, 1)
                            continue
                        }
                        for (let pd = 0; pd < item.Products.length; pd++) {
                            const product = item.Products[pd]
                            product.ListGoal = []
                            for (let gg = 0; gg < goals.length; gg++) {
                                product.ListGoal.push(goals[gg])
                            }
                        }
                    }
                }
                function filterGoalsBy(idSubmrkPrdIds, type) {    // type = 0 | 1
                    const goals = this
                    const lst = []
                    for (let gg = goals.length - 1; -1 < gg; gg--) {
                        const goal = goals[gg]
                        const lstSmkPrdId = goal.SubmarketProductId.split('-')
                        const spId = parseInt(lstSmkPrdId[type])
                        if (idSubmrkPrdIds.includes(spId)) lst.push(goal)
                    }
                    return lst
                }
                function getGoals(goalIds) {
                    const lstGoal = []
                    for (let gg = 0; gg < this.Goals.length; gg++) {
                        const x = this.Goals[gg]
                        if (goalIds.includes(x.Id)) lstGoal.push(x)
                    }
                    return lstGoal
                }
                function addSubmarketIds() {
                    for (let ii = lstPath.length - 1; -1 < ii; ii--) {
                        const item = lstPath[ii]
                        const submrkIds = lstSubmarketId.filter(x => x.IdLands.includes(item.Land.Id))
                        if (!submrkIds.length) {
                            lstPath.splice(ii, 1); continue;
                        }
                        if (!Array.isArray(item.IdSubmarkets)) item.IdSubmarkets = []
                        submrkIds.forEach(itmSubmrkId => {
                            item.IdSubmarkets = [...item.IdSubmarkets, ...itmSubmrkId.IdSubmarkets]
                        })
                        item.IdSubmarkets.distinct()
                    }
                }
                function addProducts() {
                    for (let ii = lstPath.length - 1; -1 < ii; ii--) {
                        const item = lstPath[ii]
                        const prdGrp = lstProductGrp.find(x => x.PGroup.RegionIds.includes(item.Region.Id))
                        if (!prdGrp) {
                            lstPath.splice(ii, 1); continue;
                        }
                        item.PGroup = prdGrp
                        item.Products = prdGrp.Products//.map(x => { return { Id: x.Id, Name: x.Name } })
                    }
                }
                function getPaths(lands, regns) {
                    const lst = []
                    for (let ii = 0; ii < regns.length; ii++) {
                        const regn = regns[ii]
                        const land = lands.find(x => x.Id == regn.LandId)
                        if (!land) continue
                        lst.push({ Land: land, Region: regn })
                    }
                    return lst
                }
                function getProductGroups(prdIds) {
                    const lst = []
                    let prdGrp = null
                    for (let ii = 0; ii < this.Products.length; ii++) {
                        const prd = this.Products[ii]
                        if (!prdIds.includes(prd.Id)) continue
                        if (!prdGrp || prdGrp.Id != prd.PrgId) {
                            prdGrp = this.ProductGroups.find(x => x.Id == prd.PrgId)
                            lst.push({ PGroup: prdGrp, Products: [prd] })
                        } else {
                            const item = lst.find(x => x.PGroup.Id == prdGrp.Id)
                            item.Products.push(prd)
                        }
                    }
                    return lst
                }
                function getLands(landIds) {
                    const lst = []
                    for (let ii = 0; ii < this.Lands.length; ii++) {
                        const land = this.Lands[ii]
                        if (landIds.includes(land.Id)) lst.push(land)
                    }
                    return lst
                }
                function getRegions(regnIds) {
                    const lst = []
                    for (let ii = 0; ii < this.Regions.length; ii++) {
                        const rgn = this.Regions[ii]
                        if (regnIds.includes(rgn.Id)) lst.push(rgn)
                    }
                    return lst
                }
                function getSubmarketIds(subMrkIds, landIds) {
                    const lstsMrkId = [];
                    let mrk;
                    const submarkets = this.StakeholderGroups
                    for (let ii = 0; ii < submarkets.length; ii++) {
                        const sMkr = submarkets[ii]
                        if (!subMrkIds.includes(sMkr.Id)) continue

                        if (!mrk || sMkr.MarketId != mrk.Id) {
                            mrk = this.MarketSegments.find(x => x.Id == sMkr.MarketId)
                            lstsMrkId.push({
                                IdMarket: mrk.Id,
                                IdLands: mrk.LandIds,
                                IdSubmarkets: [sMkr.Id]
                            })
                            continue
                        }
                        const lstItem = lstsMrkId.find(x => x.IdMarket == mrk.Id)
                        if (!lstItem) continue
                        lstItem.IdSubmarkets.push(sMkr.Id)
                    }
                    for (let ii = lstsMrkId.length - 1; -1 < ii; ii--) {
                        const mrkItem = lstsMrkId[ii]
                        if (!anyIds(landIds, mrkItem.IdLands)) {
                            lstsMrkId.splice(ii, 1)
                        }
                    }
                    return lstsMrkId
                }
            },
        },
        // created() { },
        // updated() { },
    })
    mFlter.setFilter = app.renderData
    app.renderData(mFlter)
}
function newAppVueDasboard(mFlter) {
    new Vue({
        el: '#dashboard',
        name: 'DnbAppDashboard',
        data: {
            Lands: Lands,
            Regions: Regions,
            ProductGroups: ProductGroups,
            Products: Products,
            SubProducts: SubProducts,
            MarketSegments: MarketSegments,
            StakeholderGroups: StakeholderGroups,
            Goals: Goals,
            ExpandIds: [],

            NewItems: [],
        },
        computed: {
            MinLandId() {
                const ids = this.Lands.map(x => x.Id)
                return getMinFrom(ids)
            },
            MaxLandId() {
                const ids = this.Lands.map(x => x.Id)
                return getMaxFrom(ids)
            }
        },
        beforeMount() {
            let minId = getMinFrom(this.Lands.map(x => x.Id))
            let maxId = getMaxFrom(this.Lands.map(x => x.Id))
            this.NewItems.push({ Id: maxId + 1, Name: '' })    // Land

            maxId = getMaxFrom(this.Regions.map(x => x.Id))
            this.NewItems.push({ Id: maxId + 1, Name: '', LandId: minId })    // Region

            maxId = getMaxFrom(this.ProductGroups.map(x => x.Id))
            this.NewItems.push({ Id: maxId + 1, Name: '', RegionIds: [] })    // Product Group
        },
        //mounted() { },
        methods: {
            toggleCollapse(id) {
                const ii = this.ExpandIds.indexOf(id)
                if (ii < 0) this.ExpandIds.push(id)
                else this.ExpandIds.splice(ii, 1)
            },
            showExpand(id) { return this.ExpandIds.includes(id) },
            onChange() { mFlter.setDataSource() },
            newItem(ii) {
                const nItem = this.NewItems[ii]
                if (!nItem) return
                if (nItem.Name.trim() == '') return
                switch (ii) {
                    case 0: {
                        this.Lands.push(Object.assign({}, nItem))
                        updateNewItem(this.Lands)
                    }
                    case 1: {
                        this.Regions.push(Object.assign({}, nItem))
                        updateNewItem(this.Regions)
                    }
                }

                mFlter.setDataSource()
                function updateNewItem(arr) {
                    nItem.Id = getMaxFrom(arr.map(x => x.Id)) + 1
                    nItem.Name = ''
                }
            }
        },
    })
}
function anyIds(lstId1, lstId2) {
    for (let ii = 0; ii < lstId1.length; ii++) {
        if (lstId2.includes(lstId1[ii])) return true
    }
    return false
}
function getMaxFrom(arr) { return arr.reduce((a, b) => Math.max(a, b), -Infinity); }
function getMinFrom(arr) { return arr.reduce((a, b) => Math.min(a, b), Infinity); }