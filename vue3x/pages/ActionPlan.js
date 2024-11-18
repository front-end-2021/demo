import { VueDraggableNext } from 'vue-draggable-next'
import { groupBy, isDragDrop } from '../common.js'
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
const ViewGoal = {
    template: `#tmp-comp-vw-goal`,
    name: "ViewWrapGoal",
    display: "ViewWrapGoal",
    mixins: [MxDndGolSub],
    components: {
        draggable: VueDraggableNext,
    },
    props: ['item'],
    data() {
        return {
            ListSub: this.$store.getters.sortedItemsBy([10, [this.item.Id]])
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
            // console.group('watch list sub ', subs.map(x => {
            //     return {
            //         Id: x.Id, ASort: x.ASort, GoalId: x.GoalId
            //     }
            // }))
            // console.log('old subs ', oSubs.map(x => {
            //     return {
            //         Id: x.Id, ASort: x.ASort, GoalId: x.GoalId
            //     }
            // }))
            // console.groupEnd()
            if (subs.length == oSubs.length) {
                this.sortSameParent(subs, oSubs)
                // if (subs.length < 2) return;
                // const nIds = subs.map(x => x.Id); const oIds = oSubs.map(x => x.Id)
                // if (isDragDrop(oIds, nIds)) {
                //     const mSorts = oSubs.map(x => x.ASort)
                //     console.log('list a-sort ', mSorts)
                //     for (let ii = 0; ii < subs.length; ii++) {
                //         subs[ii].ASort = mSorts[ii]
                //     }
                // }
            } else if (oSubs.length < subs.length) {
                const goalId = this.item.Id
                this.sortDiffParent(subs, 10, ['GoalId', goalId])
                // if (1 == subs.length && goalId != subs[0].GoalId) {
                //     subs[0].GoalId = goalId
                //     return
                // }
                // // 2 <= subs.length
                // const ii = getIiDnd(goalId)
                // if (-1 < ii) {
                //     const fulSubs = this.$store.getters.sortedItemsBy([10, [goalId]])
                //     const srcSub = subs[ii]
                //     srcSub.GoalId = goalId
                //     if (0 == ii) {
                //         let ii1 = fulSubs.findIndex(s => s.Id == subs[ii + 1].Id)
                //         fulSubs.splice(ii1, 0, srcSub)       // insert
                //         let index = 1
                //         for (let ss = 0; ss < fulSubs.length; ss++) {
                //             fulSubs[ss].ASort = index++
                //         }
                //     } else {            // 1 <= ii
                //         let ii1 = fulSubs.findIndex(s => s.Id == subs[ii - 1].Id)
                //         fulSubs.splice(ii1 + 1, 0, srcSub)       // insert
                //         let index = 1
                //         for (let ss = 0; ss < fulSubs.length; ss++) {
                //             fulSubs[ss].ASort = index++
                //         }
                //     }
                // }
                // function getIiDnd(gId) {
                //     for (let ii = 0; ii < subs.length; ii++) {
                //         if (gId != subs[ii].GoalId) return ii
                //     }
                //     return -1
                // }
            }
        },
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
            ListGoal: this.$store.getters.sortedItemsBy([9, [this.smpdid]])
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
                // if (gols.length < 2) return;
                // const nIds = gols.map(x => x.Id); const oIds = oGols.map(x => x.Id)
                // if (isDragDrop(oIds, nIds)) {
                //     const mSorts = oGols.map(x => x.ASort)
                //     for (let ii = 0; ii < gols.length; ii++) {
                //         gols[ii].ASort = mSorts[ii]
                //     }
                // }
            } else if (oGols.length < gols.length) {
                const smpId = this.smpdid
                this.sortDiffParent(gols, 9, ['SubmPrdId', smpId])
                // if (1 == gols.length && smpId != gols[0].SubmPrdId) {
                //     gols[0].SubmPrdId = smpId
                //     return
                // }
                // 2 <= gols.length
                // const ii = getIiDnd(smpId)
                // if (-1 < ii) {
                //     const fulGols = this.$store.getters.sortedItemsBy([9, [smpId]])
                //     const srcGol = gols[ii]
                //     srcGol.SubmPrdId = smpId
                //     if (0 == ii) {
                //         let ii1 = fulGols.findIndex(s => s.Id == gols[ii + 1].Id)
                //         fulGols.splice(ii1, 0, srcGol)       // insert
                //         let index = 1
                //         for (let ss = 0; ss < fulGols.length; ss++) {
                //             fulGols[ss].ASort = index++
                //         }
                //     } else {            // 1 <= ii
                //         let ii1 = fulGols.findIndex(s => s.Id == gols[ii - 1].Id)
                //         fulGols.splice(ii1 + 1, 0, srcGol)       // insert
                //         let index = 1
                //         for (let ss = 0; ss < fulGols.length; ss++) {
                //             fulGols[ss].ASort = index++
                //         }
                //     }
                // }
                // function getIiDnd(pId) {
                //     for (let ii = 0; ii < gols.length; ii++) {
                //         if (pId != gols[ii].SubmPrdId) return ii
                //     }
                //     return -1
                // }
            }
        },
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

}