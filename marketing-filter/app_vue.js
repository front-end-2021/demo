function newAppVueNav() {
    new Vue({
        el: '#dnb-appvue-nav',
        name: 'DnbAppNav',
        // data: {
        //     PopModel: false,
        // },
        computed: {
            PageTab() { return DnbVxStore.getters.getPageTab() },
        },
        methods: {
            setTab(index) {
                if (DnbVxStore.getters.getListTask().length > 0) return
                DnbVxStore.dispatch('setPageTab', index)
            },
        }
    })
}
Vue.component('mf-viewgoal', {
    name: 'DnbViewGoal',
    props: ['entry'],
    //beforeCreate(){ },
    data() {
        return {
            IsExpand: true
        }
    },
    computed: {
        Start() {
            const start = this.entry.Item.Start
            if (typeof start != 'string') return ''
            if (start.trim() == '') return ''
            return getDateStr(start, 'dd/MM/YYYY')
        },
        End() {
            const end = this.entry.Item.End
            if (typeof end != 'string') return ''
            if (end.trim() == '') return ''
            return getDateStr(end, 'dd/MM/YYYY')
        },
    },
    methods: {
        toggleExpand() { this.IsExpand = !this.IsExpand },
    },
    watch: {
        'entry.Item.Finish'(val, old) {
            if (val && !this.entry.End) {
                setStartEndNow.call(this, true)
            }
        },
    },
    // created() { },
    //beforeMount() { },
    //mounted() { },
    //beforeUpdate() { },
    //updated(){ },
    //beforeDestroy() { },
    //destroyed() { },
})
function performTask(items, numToProcess, processItem) {
    let pos = 0;
    function iteration() {
        const j = Math.min(pos + numToProcess, items.length);
        for (let i = pos; i < j; i++) { processItem(items, i) }
        pos += numToProcess;
        if (pos < items.length) {
            setTimeout(iteration, 3); // Wait 3 ms to let the UI update.
        }
    }
    iteration();
}
async function processTask(arrFnc) {
    const lstTask = []
    if (getBrowser() == 'Mozilla Firefox') {
        const lst = []
        for (let ii = 0; ii < arrFnc.length; ii++) {
            const fnc = arrFnc[ii]
            lst.push(fnc())
        }
        performTask(
            lst,
            arrFnc.length,
            (items, index) => {
                lstTask.push(new Promise(resv => resv(items[index])))
            }
        );
        return await Promise.all(lstTask)
    }
    //https://github.com/GoogleChromeLabs/scheduler-polyfill/blob/main/test/test.scheduler.js
    const ctrlBackground = new TaskController({ priority: 'background' });
    const options = { signal: ctrlBackground.signal };
    for (let ii = 0; ii < arrFnc.length; ii++) {
        lstTask.push(scheduler.postTask(arrFnc[ii], options))
    }
    return await Promise.all(lstTask)
}
function newAppVue() {
    const app = new Vue({
        el: '#dnb-app-vue',
        name: 'DnbAppVue',
        data: {
            ListDataUI: [],
            CollapsePrdId: [],
            AppMsg: null,
        },
        methods: {
            renderData() {
                document.body.classList.add('dnb-app-loading_')
                this.AppMsg = 'Loadding ...'
                this.ListDataUI.splice(0)
                DnbVxStore.dispatch('onFilter', 0).then(filter => {
                    DnbVxStore.dispatch('setListTask', [
                        () => { return DnbVxStore.getters.getGoalByFids(0) },
                        () => {
                            const lstLand = DnbVxStore.getters.getLands(filter.LandIds)
                            const lstRegion = DnbVxStore.getters.getRegions(filter.RegionIds)
                            return getPaths(lstLand, lstRegion)  // [{Land, Region}]
                        },
                        () => { return DnbVxStore.getters.getDataPGroups(filter.ProductIds) },
                        () => { return getSubmarketIds.call(this, filter.SubmarketIds, filter.LandIds) }
                    ]).then(tasks => {
                        processTask(tasks).then((values) => {
                            const fGoals = values[0]
                            let lstPath = values[1]
                            const lstProductGrp = values[2]
                            const lstSubmarketId = values[3]
                            DnbVxStore.dispatch('setListTask', [
                                () => { return DnbVxStore.getters.getActivities() },
                                () => { addProducts.call(lstPath, lstProductGrp) },         // [{ Land, Region, PGroups: { PGroup, Products: [{ Data }] } }]
                                () => { addSubmarketIds.call(lstPath, lstSubmarketId) }           //  [{Land, Region, PGroup, IdSubmarkets}]
                            ]).then(tasks2 => {
                                processTask(tasks2).then((values) => {
                                    const lstActivity = values[0]
                                    const fncsAddGoal = []
                                    for (let ii = lstPath.length - 1; -1 < ii; ii--) {
                                        const item = lstPath[ii]        // {Land, Region, PGroups: [{PGroup, Products: [{ Data }]}], IdSubmarkets}
                                        fncsAddGoal.push(() => {
                                            return addGoalToList.call(item, fGoals, lstActivity)
                                        })
                                    }
                                    DnbVxStore.dispatch('setListTask', fncsAddGoal).then(tasks3 => {
                                        processTask(tasks3).then((lstSumActv) => {
                                            const sumActv = lstSumActv.reduce(
                                                (accumulator, crtVal) => accumulator + crtVal, 0,
                                            );
                                            removeEmptyGoal.call(lstPath)
                                            this.ListDataUI = lstPath;
                                            setAppMsg.call(this, lstPath, sumActv)
                                            DnbVxStore.dispatch('setListTask', [])      // remove array / clear memory
                                        })
                                    })
                                })
                            })

                        })
                    })
                })
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
                function getSubmarketIds(subMrkIds, land_Ids) {
                    const lstsMrkId = [];
                    let mrk;
                    const submarkets = DnbVxStore.getters.getSubMarkets()
                    const lstLandId = DnbVxStore.getters.getLands(land_Ids).map(x => x.Id)
                    const isAllSubmrk = subMrkIds.includes(0)
                    for (let ii = 0; ii < submarkets.length; ii++) {
                        const sMkr = submarkets[ii]
                        if (!isAllSubmrk && !subMrkIds.includes(sMkr.Id)) continue

                        if (!mrk || sMkr.MarketId != mrk.Id) {
                            mrk = DnbVxStore.getters.getMktSegment(sMkr.MarketId)
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
                function setAppMsg(lstPath, sumActv) {
                    if (!lstPath.length) this.AppMsg = 'No results'
                    else {
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
                        this.AppMsg = `Land > Region / Product group / Product / Goals (${cGoal}) / Activties (${sumActv})`
                    }
                    this.$nextTick(() => {
                        document.body.classList.remove('dnb-app-loading_')
                    })
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
                function addGoalToList(lstGoal, activities) {
                    const item = this
                    let countAct = 0, pGrp, idProducts, goals, product, goal, lstSmkPrdId
                    for (let pp = 0; pp < item.PGroups.length; pp++) {
                        pGrp = item.PGroups[pp]
                        idProducts = pGrp.Products.map(x => x.Data.Id)
                        goals = lstGoal.getGoalsBy(item.IdSubmarkets, idProducts)
                        for (let pd = 0; pd < pGrp.Products.length; pd++) {
                            product = pGrp.Products[pd]           // { Data }
                            product.ListGoal = []
                            for (let gg = 0; gg < goals.length; gg++) {
                                goal = goals[gg]
                                lstSmkPrdId = goal.SubmarketProductId.split('-')
                                const pId = parseInt(lstSmkPrdId[1])
                                if (pId == product.Data.Id) {
                                    const lstActivity = genListActivity(goal.Id, activities)
                                    product.ListGoal.push({ Item: goal, ListActivity: lstActivity })
                                    countAct += lstActivity.length
                                }
                            }
                        }
                    }
                    return countAct
                }
            },
            genListActivity() {
                const lsActivity = DnbVxStore.getters.getActivities()
                const a = this.AppMsg
                const iA = a.lastIndexOf(`(`)
                if (iA < 0) return
                const c = a.substring(iA);
                const sumAct = parseInt(c.replace(`(`, '').replace(`)`, ''))
                let smA = 0
                for (let pt = 0; pt < this.ListDataUI.length; pt++) {
                    const item = this.ListDataUI[pt]
                    for (let pp = 0; pp < item.PGroups.length; pp++) {
                        const pGrp = item.PGroups[pp]
                        for (let pd = 0; pd < pGrp.Products.length; pd++) {
                            const product = pGrp.Products[pd]           // { Data }
                            for (let gg = 0; gg < product.ListGoal.length; gg++) {
                                const gEntry = product.ListGoal[gg]
                                gEntry.ListActivity = genListActivity(gEntry.Item.Id, lsActivity)
                                smA += gEntry.ListActivity.length
                            }
                        }
                    }
                }
                console.log(sumAct, smA)
                if (sumAct != smA) {
                    this.AppMsg.replace(`Activties (${sumAct})`, `Activties (${smA})`)
                }
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
            PageTab(val, old) { return DnbVxStore.getters.getPageTab() },
        },
        watch: {
            PageTab(val) {
                switch (val) {
                    case 1: this.renderData()
                        break;
                    default: break;
                }
            },
        },
        // created() { },
        //updated() { },
    })
    DnbVxStore.getters.getMtFilter(0).setFilter = app.renderData
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
function newAppVueDasboard(app) {
    new Vue({
        el: '#dashboard',
        name: 'DnbAppDashboard',
        computed: {
            PageTab() { return DnbVxStore.getters.getPageTab() },
        },
        updated() {
            if (3 == this.PageTab) {
                document.querySelector(`#react-filter`).style.display = 'none'
            } else {
                document.querySelector(`#react-filter`).style.display = ''
            }
        },
        methods: {
            onChangeId(e, item, type) {
                const target = e.target
                const newVal = target.value
                const newId = parseInt(newVal)
                if (isNaN(newId)) return;
                switch (type) {
                    case 1: // Region
                        item.LandId = newId;
                        DnbVxStore.dispatch('runFncFilters', (f) => { f.setDataSource() })
                        return;
                    case 2: // Activity
                        item.GoalId = newId;
                        app.genListActivity()
                        return;
                }
            },
        },
    })
}
function anyIds(lstId1, lstId2) {
    for (let ii = 0; ii < lstId1.length; ii++) {
        if (lstId2.includes(lstId1[ii])) return true
    }
    return false
}
function genListActivity(goalId, lsActivity) {
    const lstA = []
    const lstI = new Array(lsActivity.length)
    for (let i = 0; i < lsActivity.length; i++) lstI.fill(i, i);
    let aa = -1, act
    for (let i = 0; i < lstI.length; i++) {
        aa = lstI[i]
        act = lsActivity[aa]
        if (goalId == act.GoalId) {
            lstA.push({ Data: act })
            lstI.splice(i, 1)
            i--
        }
    }
    return lstA
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