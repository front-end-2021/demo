import { VueDraggableNext } from 'vue-draggable-next'
import { groupBy, isDragDrop } from '../common.js'
import { getCopyItem } from '../mock-data.js'

const MxItemDate = {
    computed: {
        ViewStartEnd() { return this.getHtmlStartEnd(this.item) },
    },
    methods: {
        getHtmlStartEnd(item) {
            let arrS = item.Start.split(' ')
            let arrE = item.End.split(' ')
            let txtYs = arrS[3]
            let txtYe = arrE[3]
            if (txtYs == txtYe) {
                txtYe = `${arrE[0]} ${arrE[1]} ${arrE[2]} ${txtYe}`
                txtYs = `${arrS[0]} ${arrS[1]} ${arrS[2]}`
                return `${txtYs} &mdash; ${txtYe}`
            }
            return `${item.Start} &mdash; ${item.End}`
        },
    },
}
const MxDndGolSub = {
    methods: {
        sortSameParent(gols, oGols) {
            if (gols.length < 2) return;
            const nIds = gols.map(x => x.Id)
            const oIds = oGols.map(x => x.Id)
            if (isDragDrop(oIds, nIds)) {
                const mSorts = oGols.map(x => x.ASort)
                for (let ii = 0; ii < gols.length; ii++) {
                    gols[ii].ASort = mSorts[ii]
                }
            }
        },
        sortDiffParent(gols, type, [key, pId]) {   // ['SubmPrdId', id] | ['GoalId', id]
            if (1 == gols.length && pId != gols[0][key]) {
                gols[0][key] = pId
                return
            }
            // 2 <= gols.length
            const ii = getIiDnd(pId)
            if (-1 < ii) {
                const fulGols = this.$store.getters.sortedItemsBy([type, [pId]])
                const srcGol = gols[ii]
                srcGol[key] = pId
                if (0 == ii) {
                    let ii1 = fulGols.findIndex(s => s.Id == gols[ii + 1].Id)
                    fulGols.splice(ii1, 0, srcGol)       // insert
                    let index = 1
                    for (let ss = 0; ss < fulGols.length; ss++) {
                        fulGols[ss].ASort = index++
                    }
                } else {            // 1 <= ii
                    let ii1 = fulGols.findIndex(s => s.Id == gols[ii - 1].Id)
                    fulGols.splice(ii1 + 1, 0, srcGol)       // insert
                    let index = 1
                    for (let ss = 0; ss < fulGols.length; ss++) {
                        fulGols[ss].ASort = index++
                    }
                }
            }
            function getIiDnd(pId) {
                for (let ii = 0; ii < gols.length; ii++) {
                    if (pId != gols[ii][key]) return ii
                }
                return -1
            }
        },
    },
}
const MxMenuEdit = {
    methods: {
        showMenuEdit(type, e) {
            const popMenu = this.$root.Popup_UI
            const golSub = this.item
            if (!Object.is(popMenu, null) && type == popMenu.type && golSub.Id == popMenu.Entry.Id) {
                this.$root.Popup_UI = null
                return;
            }
            let offTarget = e.target.getBoundingClientRect()
            const editItem = (item, type) => {
                console.log('edit item ', type)
                let compType = `comp-form-goal`
                let formTlt = `Edit`
                if(9 == type) formTlt += ` goal (${item.Id})`
                if(10 == type) formTlt += ` sub (${item.Id})`
                if(11 == type) formTlt += ` task (${item.Id})`
                let saveClose = (mItem) => {
                    console.log('save close ', type)
                }
                let xClose = (mItem) => {
                    console.log('x close ', type)
                }
                let eItem = {
                    title: formTlt,
                    data: getCopyItem.call(this, item),
                    type: compType
                }
                this.$store.commit('setModal', [eItem, saveClose, xClose])
                this.$root.Popup_UI = null
            }
            const deleteItem = (item, type) => {
                this.removeItem(item.Id, type)
                this.$root.Popup_UI = null
            }
            const copyItem = (item, type) => {
                this.pCopyItem(item, type)
                this.$root.Popup_UI = null
            }
            const ppMenu = {
                type: type,    // menu goal, sub, task
                Entry: golSub,
                Style: { left: `${offTarget.left - 135}px`,
                    top: `${offTarget.top + offTarget.height}px`,
                },
                editItem, copyItem, deleteItem,
            }
            switch (type) {
                case 9:
                case 10:
                    ppMenu.newChild = function (e) {
                        const parent = this.Entry
                        console.log('new child', this.type, parent)
                    }
                    break;
                default: break;
            }

            this.$root.Popup_UI = ppMenu       // type 9, 10, 11
        },
    }
}
const ViewTask = {
    template: `#tmp-comp-vw-task`,
    name: "ViewWrapTask",
    display: "ViewWrapTask",
    inject: ['removeItem', 'pCopyItem'],
    mixins: [MxItemDate, MxMenuEdit],
    props: ['item'],
}
const ViewSub = {
    template: `#tmp-comp-vw-sub`,
    name: "ViewWrapSub",
    display: "ViewWrapSub",
    inject: ['removeItem', 'pCopyItem'],
    mixins: [MxDndGolSub, MxItemDate, MxMenuEdit],
    components: {
        'comp-vw-task': ViewTask,
        draggable: VueDraggableNext,
    },
    props: ['item'],
    data() {
        return {
            ListTask: this.$store.getters.sortedInRange([11, [this.item.Id], 0, 90])
        }
    },
    computed: {
        DndTaskOptions() {
            return {
                animation: 200,
                disabled: false,
                ghostClass: "ghost",
                group: "task",
            }
        },
    },
    watch: {
        ListTask(tasks, oTasks) {
            if (tasks.length == oTasks.length) {
                this.sortSameParent(tasks, oTasks)

            } else if (oTasks.length < tasks.length) {
                const subId = this.item.Id
                this.sortDiffParent(tasks, 11, ['SubId', subId])

            }
        },
    }, 
    provide() {
        return {
            removeItem: (gId, type) => {        // view goal
                if (type != 11) return;
                const lstG = this.ListTask
                for (let gg = lstG.length - 1, gol; -1 < gg; gg--) {
                    gol = lstG[gg]
                    if (gol.Id == gId) lstG.splice(gg, 1)
                }
                this.$store.commit('remove', [gId, 11])
            },
            pCopyItem: (item, type) => {
                if (type != 11) return;
                const lstG = this.ListTask
                let ii = lstG.findIndex(x => x.Id == item.Id)
                this.$store.dispatch('copyItem', [item, 11]).then(cpyItm => {
                    lstG.splice(ii + 1, 0, cpyItm)
                })
            },
        }
    },
}
const ViewGoal = {
    template: `#tmp-comp-vw-goal`,
    name: "ViewWrapGoal",
    display: "ViewWrapGoal",
    inject: ['removeItem', 'pCopyItem'],
    mixins: [MxDndGolSub, MxItemDate, MxMenuEdit],
    components: {
        'comp-vw-sub': ViewSub,
        draggable: VueDraggableNext,
    },
    props: ['item'],
    data() {
        return {
            ListSub: this.$store.getters.sortedInRange([10, [this.item.Id], 0, 20])
        }
    },
    computed: {
        DndSubOptions() {
            return {
                animation: 200,
                disabled: false,
                ghostClass: "ghost",
                direction: 'vertical',
                group: "sub",
            }
        },
    },
    watch: {
        ListSub(subs, oSubs) {
            // console.group('watch list sub ', subs.map(x => { return { Id: x.Id, ASort: x.ASort, GoalId: x.GoalId } }))
            // console.log('old subs ', oSubs.map(x => { return { Id: x.Id, ASort: x.ASort, GoalId: x.GoalId } }))
            // console.groupEnd()
            if (subs.length == oSubs.length) {
                this.sortSameParent(subs, oSubs)

            } else if (oSubs.length < subs.length) {
                const goalId = this.item.Id
                this.sortDiffParent(subs, 10, ['GoalId', goalId])

            }
        },
    },
    provide() {
        return {
            removeItem: (gId, type) => {        // view goal
                if (type != 10) return;
                const lstG = this.ListSub
                for (let gg = lstG.length - 1, gol; -1 < gg; gg--) {
                    gol = lstG[gg]
                    if (gol.Id == gId) lstG.splice(gg, 1)
                }
                this.$store.commit('remove', [gId, 10])
            },
            pCopyItem: (item, type) => {
                if (type != 10) return;
                const lstG = this.ListSub
                let ii = lstG.findIndex(x => x.Id == item.Id)
                this.$store.dispatch('copyItem', [item, 10]).then(cpyItm => {
                    lstG.splice(ii + 1, 0, cpyItm)
                })
            },
        }
    },
}
const ViewProduct = {
    template: `#tmp-comp-vw-prd`,
    name: "ViewWrapPrd",
    display: "ViewWrapPrd",
    mixins: [MxDndGolSub],
    components: {
        'comp-vw-goal': ViewGoal,
        draggable: VueDraggableNext,
    },
    props: ['item', 'smpdid'],
    data() {
        return {
            IsVisible: true,
            ListGoal: this.$store.getters.sortedInRange([9, [this.smpdid], 0, 12])
        }
    },
    computed: {
        DndGoalOptions() {
            return {
                animation: 200,
                disabled: false,
                ghostClass: "ghost",
                direction: 'vertical',
                group: "goal",
            }
        },
    },
    watch: {
        ListGoal(gols, oGols) {
            if (gols.length == oGols.length) {
                this.sortSameParent(gols, oGols)

            } else if (oGols.length < gols.length) {
                const smpId = this.smpdid
                this.sortDiffParent(gols, 9, ['SubmPrdId', smpId])

            }
        },
    },
    methods: {
        visibilityChanged(isVisible, entry) {
            if (this.IsVisible && !isVisible) {      // true -> false
                let cStyle = window.getComputedStyle(this.$el)
                const height = cStyle.height
                this.$el.style.minHeight = height
                this.$el.style.maxHeight = height
            }
            if (!this.IsVisible && isVisible) {      // false -> true
                this.$el.style.minHeight = ''
                this.$el.style.maxHeight = ''
            }
            this.IsVisible = isVisible
            //console.log(entry.target)
        },
    },
    provide() {
        return {
            removeItem: (gId, type) => {
                if (type != 9) return;
                const lstG = this.ListGoal
                for (let gg = lstG.length - 1, gol; -1 < gg; gg--) {
                    gol = lstG[gg]
                    if (gol.Id == gId) lstG.splice(gg, 1)
                }
                this.$store.commit('remove', [gId, 9])
            },
            pCopyItem: (item, type) => {
                if (type != 9) return;
                const lstG = this.ListGoal
                let ii = lstG.findIndex(x => x.Id == item.Id)
                this.$store.dispatch('copyItem', [item, 9]).then(cpyItm => {
                    lstG.splice(ii + 1, 0, cpyItm)
                })
            },
        }
    },
}
export default {
    template: `#tmp-comp-action-plan`,
    components: {
        'comp-vw-prd': ViewProduct,
    },
    data() {
        return {
            ListMarket: [],
            ProductGroups: [],
        }
    },
    methods: {
        setUserAssign(valIndex) {
            valIndex = parseInt(valIndex)
            this.$root.UserAssign = this.$root.Users[valIndex]
        },
        buildData(submkIds, prdIds) {
            let ddd = Date.now()
            console.log('action plan begin build data ', ddd)
            // #region validate
            if (!Array.isArray(submkIds) || !submkIds.length) submkIds = [0]
            if (!Array.isArray(prdIds) || !prdIds.length) prdIds = [0]
            // #endregion
            // #region begin data
            const lstSubM = this.$store.getters.UnsortItems([4, submkIds, []])
            const lstPrd = this.$store.getters.UnsortItems([8, prdIds, []])
            // #endregion
            const groupedGoals = groupBy(this.$store.state.ListGoal, 'SubmPrdId')
            const lstSubMxy = []
            for (let ss = 0, smk; ss < lstSubM.length; ss++) {
                smk = lstSubM[ss]
                if (smk.IsXY) {
                    lstSubMxy.push(smk)
                    lstSubM.splice(ss, 1)
                    ss -= 1
                }
            }
            if (lstSubMxy.length) {
                // #region Product group
                const prgIds = []
                for (let pp = 0, pr; pp < lstPrd.length; pp++) {
                    pr = lstPrd[pp]
                    if (prgIds.includes(pr.PrdGroupId)) continue;
                    prgIds.push(pr.PrdGroupId)
                }
                const lstPrg = this.$store.getters.SortedItems([5, prgIds, []])
                // #endregion
                const prdGroups = []
                for (let pg = 0, prg, lstPr; pg < lstPrg.length; pg++) {
                    prg = lstPrg[pg]
                    lstPr = lstPrdXy.call(this, prg.Id, lstPrd, lstSubMxy)
                    if (!lstPr.length) continue;
                    prdGroups.push({
                        Entry: prg,
                        ListProduct: lstPr
                    })
                }
                this.ProductGroups = prdGroups;
                //console.log('list product group ', prdGroups)
            } else this.ProductGroups = [];
            if (lstSubM.length) {
                // #region market
                const marketIds = []
                for (let ss = 0, smk; ss < lstSubM.length; ss++) {
                    smk = lstSubM[ss]
                    if (marketIds.includes(smk.MarketId)) continue;
                    marketIds.push(smk.MarketId)
                }
                const lstMrk = this.$store.getters.SortedItems([2, marketIds, []])
                // #endregion
                const lstMarkt = []
                for (let mm = 0, mk, lstSmk; mm < lstMrk.length; mm++) {
                    mk = lstMrk[mm]
                    lstSmk = lstSubmarket.call(this, mk.Id, lstSubM, lstPrd)
                    if (!lstSmk.length) continue;
                    lstMarkt.push({
                        Entry: mk,
                        SubMarkets: lstSmk
                    })
                }
                this.ListMarket = lstMarkt
                //console.log('list market ', lstMarkt)
            } else this.ListMarket = []
            groupedGoals.clear()

            console.log('action plan finish build data ', Date.now() - ddd, 'mili second')

            function lstPrdXy(prgId, products, lstSubMkXy) {
                const lst = []
                for (let pp = 0, pr; pp < products.length; pp++) {
                    pr = products[pp]
                    if (prgId == pr.PrdGroupId) {
                        const lstSmk = lstSubMarketXy.call(this, pr.Id, lstSubMkXy)
                        if (!lstSmk.length) continue;
                        lstSmk.sort((a, b) => a.Entry.ASort - b.Entry.ASort)
                        lst.push({
                            Entry: pr,
                            SubMarkets: lstSmk
                        })
                    }
                }
                lst.sort((a, b) => a.Entry.ASort - b.Entry.ASort)
                return lst
            }
            function lstSubMarketXy(prId, lstSubMkXy) {
                const lstSmk = []
                for (let ss = 0, subMk, smPrId; ss < lstSubMkXy.length; ss++) {
                    subMk = lstSubMkXy[ss]
                    smPrId = `${subMk.Id}-${prId}`
                    if (groupedGoals.has(smPrId)) {
                        const item = {
                            Entry: subMk,
                            SubmarketProductId: smPrId,
                        }
                        lstSmk.push(item)
                    }
                }
                return lstSmk
            }
            function lstSubmarket(mkId, lstSubmk, products) {
                const lst = []
                for (let ss = 0, smk; ss < lstSubmk.length; ss++) {
                    smk = lstSubmk[ss]
                    if (smk.MarketId == mkId) {
                        const lstPrd = lstProducts.call(this, smk.Id, products)
                        if (!lstPrd.length) continue;
                        lstPrd.sort((a, b) => a.Entry.ASort - b.Entry.ASort)
                        lst.push({
                            Entry: smk,
                            Products: lstPrd
                        })
                    }
                }
                lst.sort((a, b) => a.Entry.ASort - b.Entry.ASort)
                return lst;
            }
            function lstProducts(smId, products) {
                const lst = []
                for (let pp = 0, prd, smPrId; pp < products.length; pp++) {
                    prd = products[pp]
                    smPrId = `${smId}-${prd.Id}`
                    if (groupedGoals.has(smPrId)) {
                        const item = {
                            Entry: prd,
                            SubmarketProductId: smPrId,
                        }
                        lst.push(item)
                    }
                }
                return lst;
            }
        },

    },
    created() {
        this.buildData([0], [0])
    },
    computed: {
        MenuAcPlan() {
            const popMenu = this.$root.Popup_UI
            if (Object.is(popMenu, null)) return null
            if (9 == popMenu.type) return popMenu
            if (10 == popMenu.type) return popMenu
            if (11 == popMenu.type) return popMenu
            return null
        },
    },
}