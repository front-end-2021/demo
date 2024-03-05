Vue.component('mf-viewgoal', {
    name: 'DnbViewGoal',
    props: ['entry'],
    //beforeCreate(){ },
    data() {
        return {
            ListActivity: [],
            IsExpand: true
        }
    },
    computed: {
        Start() {
            const start = this.entry.Start
            if (typeof start != 'string') return ''
            if (start.trim() == '') return ''
            return getDateStr(start, 'dd/MM/YYYY')
        },
        End() {
            const end = this.entry.End
            if (typeof end != 'string') return ''
            if (end.trim() == '') return ''
            return getDateStr(end, 'dd/MM/YYYY')
        },
    },
    methods: {
        genListActivity(activities) {
            const goalId = this.entry.Id
            this.ListActivity = genListActivity(goalId, activities)
        },
        toggleExpand() { this.IsExpand = !this.IsExpand },
    },
    watch: {
        'entry.Finish'(val, old) {
            if (val && !this.entry.End) {
                setStartEndNow.call(this, true)
            }
        },
    },
    created() {
        const goalId = this.entry.Id
        if (getBrowser() == 'Mozilla Firefox') {
            const activities = this.$root.Activities
            this.ListActivity = genListActivity(goalId, activities)
            return
        }
        window._mCtrlBackground = window._mCtrlBackground || new TaskController({ priority: 'background' });
        const task = scheduler.postTask(() => {
            const activities = this.$root.Activities
            this.ListActivity = genListActivity(goalId, activities)
        }, { signal: window._mCtrlBackground.signal });
        const lstTask = window._mSchedulerTasks
        lstTask.push(task)
        if (this.$root.CountGoal === lstTask.length) {
            (async () => {
                await Promise.all(lstTask).then(() => {
                    delete window._mSchedulerTasks
                    delete window._mCtrlBackground
                })
            })();
        }
    },
    // beforeMount(){},
    //mounted() { },
    // beforeUpdate(){},
    // updated(){},
    //beforeDestroy() { },
    //destroyed() { },
})
async function processTask(arrFnc) {
    //https://github.com/GoogleChromeLabs/scheduler-polyfill/blob/main/test/test.scheduler.js
    const ctrlBackground = new TaskController({ priority: 'background' });
    const options = { signal: ctrlBackground.signal };
    const lstTask = []
    for (let ii = 0; ii < arrFnc.length; ii++) {
        lstTask.push(scheduler.postTask(arrFnc[ii], options))
    }
    return await Promise.all(lstTask)
}
function newAppVue(mFlter) {
    const app = new Vue({
        el: '#dnb-app-vue',
        name: 'DnbAppVue',
        data: {
            ProductGroups: ProductGroups,
            Products: Products,
            SubProducts: SubProducts,
            MarketSegments: MarketSegments,
            StakeholderGroups: StakeholderGroups,
            Goals: Goals,
            Activities: Activities,
            ListDataUI: [],
            CollapsePrdId: [],
            AppMsg: null,
        },
        methods: {
            renderData() {
                const filter = mFlter
                this.AppMsg = 'Loadding ...'
                this.ListDataUI.splice(0)
                if (getBrowser() == 'Mozilla Firefox') {
                    processDataInFireFox.call(this)
                    return
                }
                processTask([
                    () => { return getGoals.call(this) },
                    () => {
                        const lstLand = DnbVxStore.getters.getLands(filter.LandIds)
                        const lstRegion = DnbVxStore.getters.getRegions(filter.RegionIds)
                        return getPaths(lstLand, lstRegion)  // [{Land, Region}]
                    },
                    () => { return getProductGroups.call(this, filter.ProductIds) },
                    () => { return getSubmarketIds.call(this, filter.SubmarketIds, filter.LandIds) }
                ]).then((values) => {
                    const lstGoal = values[0]
                    let lstPath = values[1]
                    const lstProductGrp = values[2]
                    const lstSubmarketId = values[3]
                    processTask([
                        () => {
                            addProducts.call(lstPath, lstProductGrp)         // [{ Land, Region, PGroups: { PGroup, Products: [{ Data }] } }]
                        },
                        () => {
                            addSubmarketIds.call(lstPath, lstSubmarketId)           //  [{Land, Region, PGroup, IdSubmarkets}]
                        }
                    ]).then(() => {
                        const fncsAddGoal = []
                        for (let ii = lstPath.length - 1; -1 < ii; ii--) {
                            const item = lstPath[ii]        // {Land, Region, PGroups: [{PGroup, Products: [{ Data }]}], IdSubmarkets}
                            fncsAddGoal.push(() => {
                                addGoalToList.call(item, lstGoal)
                                return item
                            })
                        }
                        processTask(fncsAddGoal).then((items) => {
                            removeEmptyGoal.call(lstPath)
                            this.ListDataUI = lstPath;
                            window._mSchedulerTasks = []
                            setAppMsg.call(this, lstPath)
                        })
                    })
                })
                function filterGoalsBy(idSubmrkPrdIds, type) {    // type = 0 | 1
                    const goals = this
                    const lst = []
                    for (let gg = 0; gg < goals.length; gg++) {
                        const goal = goals[gg]
                        const lstSmkPrdId = goal.SubmarketProductId.split('-')
                        const spId = parseInt(lstSmkPrdId[type])
                        if (idSubmrkPrdIds.includes(spId)) lst.push(goal)
                    }
                    return lst
                }
                function getGoals() {
                    const lst = []
                    for (let gg = 0; gg < this.Goals.length; gg++) {
                        const x = this.Goals[gg]
                        lst.push(x)
                    }
                    return lst
                }
                function addSubmarketIds(lstSubmarketId) {
                    const lstPath = this
                    for (let ii = lstPath.length - 1; -1 < ii; ii--) {
                        const item = lstPath[ii]
                        const submrkIds = lstSubmarketId.filter(x => x.IdLands.includes(item.Land.Id))
                        if (!submrkIds.length) {
                            lstPath.splice(ii, 1);
                            continue;
                        }
                        if (!Array.isArray(item.IdSubmarkets)) item.IdSubmarkets = []
                        submrkIds.forEach(itmSubmrkId => {
                            item.IdSubmarkets = [...item.IdSubmarkets, ...itmSubmrkId.IdSubmarkets]
                        })
                        item.IdSubmarkets.distinct()    //     [{ Land, Region, IdSubmarkets }]
                    }
                }
                function addProducts(lstProductGrp) {
                    const lstPath = this    // [{ Land, Region }]
                    for (let ii = 0; ii < lstPath.length; ii++) {
                        const item = lstPath[ii]
                        const rgnId = item.Region.Id

                        const lstGrp = []
                        for (let pp = 0; pp < lstProductGrp.length; pp++) {
                            const x = lstProductGrp[pp]
                            if (x.PGroup.RegionIds.includes(rgnId)) lstGrp.push(x)
                        }
                        if (lstGrp.length) {
                            item.PGroups = []
                            for (let pp = 0; pp < lstGrp.length; pp++) {
                                item.PGroups.push(lstGrp[pp])       // [{ Land, Region, PGroups: { PGroup, Products: [{ Data }] } }]
                            }
                        }
                    }
                    for (let ii = lstPath.length - 1; -1 < ii; ii--) {
                        const item = lstPath[ii]
                        if (!Array.isArray(item.PGroups)) {
                            lstPath.splice(ii, 1)
                        }
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
                            lst.push({ PGroup: prdGrp, Products: [{ Data: prd }] })
                        } else {
                            const item = lst.find(x => x.PGroup.Id == prdGrp.Id)
                            item.Products.push({ Data: prd })
                        }
                    }
                    return lst
                }
                function getSubmarketIds(subMrkIds, land_Ids) {
                    const lstsMrkId = [];
                    let mrk;
                    const submarkets = this.StakeholderGroups
                    const lstLandId =  DnbVxStore.getters.getLands(land_Ids).map(x => x.Id)
                    const isAllSubmrk = subMrkIds.includes(0)
                    for (let ii = 0; ii < submarkets.length; ii++) {
                        const sMkr = submarkets[ii]
                        if (!isAllSubmrk && !subMrkIds.includes(sMkr.Id)) continue

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
                        if (!anyIds(lstLandId, mrkItem.IdLands)) {
                            lstsMrkId.splice(ii, 1)
                        }
                    }
                    return lstsMrkId
                }
                function setAppMsg(lstPath) {
                    if (!lstPath.length) this.AppMsg = 'No results'
                    else {
                        let cGoal = 0, cAction = 0
                        for (let ii = lstPath.length - 1; -1 < ii; ii--) {
                            const item = lstPath[ii]        // {Land, Region, PGroups: [{PGroup, Products: [{ Data }]}], IdSubmarkets}
                            for (let pp = 0; pp < item.PGroups.length; pp++) {
                                const pGrp = item.PGroups[pp]
                                for (let pd = 0; pd < pGrp.Products.length; pd++) {
                                    const product = pGrp.Products[pd]           // { Data }
                                    if (Array.isArray(product.ListGoal))
                                        cGoal += product.ListGoal.length
                                }
                            }
                        }
                        this.AppMsg = `Land > Region / Product group / Product / List goal (${cGoal}) / Activties`
                    }
                }
                function processDataInFireFox() {
                    const lstGoal = getGoals.call(this)
                    const lstLand = DnbVxStore.getters.getLands(filter.LandIds)
                    const lstRegion = DnbVxStore.getters.getRegions(filter.RegionIds)
                    const lstPath = getPaths(lstLand, lstRegion)  // [{Land, Region}]
                    const lstProductGrp = getProductGroups.call(this, filter.ProductIds)
                    const lstSubmarketId = getSubmarketIds.call(this, filter.SubmarketIds, filter.LandIds)
                    addProducts.call(lstPath, lstProductGrp)         // [{ Land, Region, PGroups: { PGroup, Products: [{ Data }] } }]
                    addSubmarketIds.call(lstPath, lstSubmarketId)           //  [{Land, Region, PGroup, IdSubmarkets}]
                    for (let ii = lstPath.length - 1; -1 < ii; ii--) {
                        const item = lstPath[ii]        // {Land, Region, PGroups: [{PGroup, Products: [{ Data }]}], IdSubmarkets}
                        addGoalToList.call(item, lstGoal)
                    }
                    removeEmptyGoal.call(lstPath)
                    this.ListDataUI = lstPath;
                    setAppMsg.call(this, lstPath)
                }
                function removeEmptyGoal() {
                    const lstPath = this
                    for (let ii = lstPath.length - 1; -1 < ii; ii--) {
                        const item = lstPath[ii]        // {Land, Region, PGroups: [{Products}], IdSubmarkets}
                        for (let pp = 0; pp < item.PGroups.length; pp++) {
                            const pGrp = item.PGroups[pp]
                            let sumG = 0
                            for (let pd = 0; pd < pGrp.Products.length; pd++) {
                                const product = pGrp.Products[pd]           // { Data }
                                if (Array.isArray(product.ListGoal) && product.ListGoal.length) {
                                    sumG += product.ListGoal.length
                                } else {
                                    pGrp.Products.splice(pd, 1)
                                    pd -= 1
                                }
                            }
                            if (!pGrp.Products.length) {
                                item.PGroups.splice(pp, 1)
                                pp -= 1
                                continue
                            } else pGrp.SumGoal = sumG
                        }
                        if (!item.PGroups.length) {
                            lstPath.splice(ii, 1)
                        }
                    }
                }
                function addGoalToList(lstGoal) {
                    const item = this
                    const submkGoals = filterGoalsBy.call(lstGoal, item.IdSubmarkets, 0)
                    if (submkGoals.length) {
                        for (let pp = 0; pp < item.PGroups.length; pp++) {
                            const pGrp = item.PGroups[pp]
                            const idProducts = pGrp.Products.map(x => x.Data.Id)
                            const goals = filterGoalsBy.call(submkGoals, idProducts, 1)
                            if (goals.length) {
                                for (let pd = 0; pd < pGrp.Products.length; pd++) {
                                    const product = pGrp.Products[pd]           // { Data }
                                    product.ListGoal = []
                                    for (let gg = 0; gg < goals.length; gg++) {
                                        const goal = goals[gg]
                                        const lstSmkPrdId = goal.SubmarketProductId.split('-')
                                        const pId = parseInt(lstSmkPrdId[1])
                                        if (pId == product.Data.Id) product.ListGoal.push(goal)
                                    }
                                }
                            }
                        }
                    }
                }
            },
            genListActivity() {
                const activities = this.Activities
                this.$children.forEach(comp => {
                    comp.genListActivity(activities)
                })
            },
            isPrdExpand(id, pgId, rgId) { return !this.CollapsePrdId.includes(`${rgId}.${pgId}.${id}`) },
            onTogglePrdExpand(id, pgId, rgId) {
                const lstId = this.CollapsePrdId
                const tId = `${rgId}.${pgId}.${id}`
                const i = lstId.indexOf(tId)
                if (i < 0) lstId.push(tId)
                else lstId.splice(i, 1)
            },
        },
        computed: {
            CountGoal() {
                const lstPath = this.ListDataUI
                let cGoal = 0;
                for (let ii = lstPath.length - 1; -1 < ii; ii--) {
                    const item = lstPath[ii]        // {Land, Region, PGroups: [{PGroup, Products: [{ Data }]}], IdSubmarkets}
                    for (let pp = 0; pp < item.PGroups.length; pp++) {
                        const pGrp = item.PGroups[pp]
                        for (let pd = 0; pd < pGrp.Products.length; pd++) {
                            const product = pGrp.Products[pd]           // { Data }
                            if (Array.isArray(product.ListGoal))
                                cGoal += product.ListGoal.length
                        }
                    }
                }
                return cGoal
            },
        },
        // created() { },
        // updated() { },
    })
    mFlter.setFilter = app.renderData
    app.renderData()
    return app
}
Vue.component('mf-dashgoal', {
    name: 'DnVDashGoal',
    props: ['entry'],
    inject: ['onChange'],
    data() {
        let start = this.entry.Start
        if (typeof start != 'string') start = ''
        else if (start.trim() == '') start = ''
        else start = getDateStr(start, 'YYYY-MM-dd')
        let end = this.entry.End
        if (typeof end != 'string') end = ''
        else if (end.trim() == '') end = ''
        else end = getDateStr(end, 'YYYY-MM-dd')

        return {
            Start: start, End: end,
        }
    },
    beforeMount() {
        if (this.entry.Finish && !this.entry.End) {
            setStartEndNow.call(this)
        }
    },
    watch: {
        'entry.Start'(val, old) {
            if (old && !val && this.End) {
                this.entry.End = null
                this.End = ''
            }
        },
        'entry.End'(val, old) {
            if (!old && val && !this.End) {
                this.entry.End = null
                this.End = getDateStr(val, 'YYYY-MM-dd')
            }
        },
        'entry.Finish'(val, old) {
            if (val && !this.entry.End) {
                setStartEndNow.call(this)
            }
        },
    },
    methods: {
        changeStart(e) {
            const newD = e.target.value
            const isDate = isDateStr(newD)
            if (!isDate) {
                this.entry.Start = null
                this.Start = ''
                return
            }
            const newStr = new Date(newD).toISOString()
            this.entry.Start = newStr
            this.Start = newD
        },
        changeEnd(e) {
            const newD = e.target.value
            const isDate = isDateStr(newD)
            if (!isDate) {
                this.entry.End = null
                this.End = ''
                return
            }
            const newStr = new Date(newD).toISOString()
            this.entry.End = newStr
            this.End = newD
        }
    },
})
function newAppVueDasboard(mFlter, app) {
    new Vue({
        el: '#dashboard',
        name: 'DnbAppDashboard',
        data: {
            ProductGroups: ProductGroups,
            Products: Products,
            SubProducts: SubProducts,
            MarketSegments: MarketSegments,
            StakeholderGroups: StakeholderGroups,
            Goals: Goals,
            Activities: Activities,
            ExpandIds: [],
            NewItems: [],
        },
        computed: {
            Lands() { return DnbVxStore.getters.getLands([0]) },
            Regions() { return DnbVxStore.getters.getRegions([0]) },
            MinLandId() {
                const ids = DnbVxStore.getters.getAllLandId()
                return getMinFrom(ids)
            },
            MaxLandId() {
                const ids = DnbVxStore.getters.getAllLandId()
                return getMaxFrom(ids)
            },
            MinGoalId() {
                const ids = this.Goals.map(x => x.Id)
                return getMinFrom(ids)
            },
            MaxGoalId() {
                const ids = this.Goals.map(x => x.Id)
                return getMaxFrom(ids)
            },
        },
        beforeMount() {
            let minId = getMinFrom(DnbVxStore.getters.getAllLandId())
            let maxId = getMaxFrom(DnbVxStore.getters.getAllLandId())
            this.NewItems.push({ Id: maxId + 1, Name: '' })    // Land

            maxId = getMaxFrom(this.Regions.map(x => x.Id))
            this.NewItems.push({ Id: maxId + 1, Name: '', LandId: minId })    // Region

            maxId = getMaxFrom(this.ProductGroups.map(x => x.Id))
            this.NewItems.push({ Id: maxId + 1, Name: '', RegionIds: [] })    // Product Group
        },
        methods: {
            toggleCollapse(id) {
                const ii = this.ExpandIds.indexOf(id)
                if (ii < 0) this.ExpandIds.push(id)
                else this.ExpandIds.splice(ii, 1)
            },
            showExpand(id) { return this.ExpandIds.includes(id) },
            onChange() { mFlter.setDataSource() },
            onChangeId(e, item, type) {
                const target = e.target
                const newVal = target.value
                const newId = parseInt(newVal)
                if (isNaN(newId)) return;
                switch (type) {
                    case 1: // Region
                        item.LandId = newId;
                        mFlter.setDataSource();
                        return;
                    case 2: // Activity
                        item.GoalId = newId;
                        app.genListActivity()
                        return;
                }
            },
            newItem(ii) {
                const nItem = this.NewItems[ii]
                if (!nItem) return
                if (nItem.Name.trim() == '') return
                switch (ii) {
                    case 0: {
                        DnbVxStore.dispatch('pushLand', Object.assign({}, nItem));
                        updateNewItem(DnbVxStore.getters.getLands([0]))
                        break;
                    }
                    case 1: {
                        DnbVxStore.dispatch('pushRegion', Object.assign({}, nItem));
                        updateNewItem(DnbVxStore.getters.getRegions([0]))
                        break;
                    }
                }
                mFlter.setDataSource()
                function updateNewItem(arr) {
                    nItem.Id = getMaxFrom(arr.map(x => x.Id)) + 1
                    nItem.Name = ''
                }
            }
        },
        provide() {
            return {
                onChange: this.onChange
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
function getDateStr(strDate, tFormat) {
    const dS = new Date(strDate)
    const year = dS.getFullYear()
    const month = dS.getMonth() + 1
    const day = dS.getDate()
    let mm = month < 10 ? `0${month}` : month
    let dd = day < 10 ? `0${day}` : day
    switch (tFormat) {
        case 'YYYY-MM-dd':
            return `${year}-${mm}-${dd}`;
        case 'dd/MM/YYYY':
            return `${dd}/${mm}/${year}`;
    }
    return ''
}
function isDateStr(str) {       // 'yyyy-mm-dd'
    if (typeof str != 'string') return false;
    str = str.trim()
    if (str === '') return false
    const arr = str.split('-')
    if (arr.length < 3) return false
    let nn = arr[0]
    nn = parseInt(nn)
    if (nn.toString().length < 4) return false
    for (let ii = arr.length - 1; 0 < ii; ii--) {
        nn = arr[ii]
        nn = parseInt(nn)
        if (isNaN(nn)) return false
    }
    return true;
}
function setStartEndNow(notData) {
    if (!this.entry.Finish) return
    if (this.entry.End) return
    let dNow = new Date()
    if (this.entry.Start) {
        dNow = new Date(this.entry.Start)
    }
    const tE = dNow.toISOString()
    let end = getDateStr(tE, 'YYYY-MM-dd')
    this.entry.End = tE
    if (!notData) this.End = end
    if (!this.entry.Start) {
        if (!notData) this.Start = end
        this.entry.Start = tE
    }
}
function genListActivity(goalId, activities) {
    const lstA = []
    for (let aa = 0; aa < activities.length; aa++) {
        const act = activities[aa]
        if (goalId == act.GoalId) lstA.push({ Data: act })
    }
    return lstA
}