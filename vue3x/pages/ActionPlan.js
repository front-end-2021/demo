import { VueDraggableNext } from 'vue-draggable-next'
import { groupBy } from '../common.js'
const ViewGoal = {
    template: `#tmp-comp-vw-goal`,
    components: {
        draggable: VueDraggableNext,
    },
    props: ['item'],
    data() {
        return {

        }
    },
}
export default {
    template: `#tmp-comp-action-plan`,
    components: {
        'comp-vw-goal': ViewGoal,
        draggable: VueDraggableNext,
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
                    lstPr = lstPrdXy(prg.Id, lstPrd, lstSubMxy)
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
                    lstSmk = lstSubmarket(mk.Id, lstSubM, lstPrd)
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
                        const lstSmk = lstSubMarketXy(pr.Id, lstSubMkXy)
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
                        const lstGoal = groupedGoals.get(smPrId)
                        lstGoal.sort((a, b) => a.ASort - b.ASort)
                        const item = {
                            Entry: subMk,
                            SubmarketProductId: smPrId,
                            Goals: lstGoal
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
                        const lstPrd = lstProducts(smk.Id, products)
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
                        const lstGoal = groupedGoals.get(smPrId)
                        lstGoal.sort((a, b) => a.ASort - b.ASort)
                        const item = {
                            Entry: prd,
                            SubmarketProductId: smPrId,
                            Goals: lstGoal
                        }
                        lst.push(item)
                    }
                }
                return lst;
            }
        },
        onStartDndGoal(evt) {

        },
        onEndDndGoal(evt) {
            const desGoalIds = []           // new ordered id
            evt.to.querySelectorAll(`[goalid]`).forEach(gl => {
                const gId = gl.getAttribute('goalid')
                desGoalIds.push(parseInt(gId))
            })
            if (desGoalIds.length < 1) return;

            const srcSmPrId = evt.from.getAttribute('smprid')
            const desSmPrId = evt.to.getAttribute('smprid')
            const srcGols = this.$store.getters.sortedItemsBy([9, [srcSmPrId]])
            if (srcSmPrId == desSmPrId) {
                // drag drop same sub-market product
                let oldIds = srcGols.map(x => x.Id)
                if (oldIds.join(',') != desGoalIds.join(',')) {
                    this.$store.dispatch('updateAsort', [9, oldIds, desGoalIds]).then(items => {
                        for (let ll = 0, itm, nItm; ll < srcGols.length; ll++) {
                            itm = srcGols[ll]
                            nItm = items.find(ld => ld.Id == itm.Id)
                            itm.ASort = nItm.ASort
                        }
                    })
                }
            } else if (srcSmPrId != desSmPrId) {
                // drag drop diff sub-market product 
                let desGoals = this.$store.getters.sortedItemsBy([9, [desSmPrId]])
                let srcGoal
                // #region remove drag goal from src
                for (let oo = srcGols.length - 1; -1 < oo; oo--) {
                    srcGoal = srcGols[oo]
                    if (desGoalIds.includes(srcGoal.Id)) {
                        break;
                    }
                }
                // #endregion
                srcGoal.SubmPrdId = desSmPrId
                if (1 == desGoalIds.length) {
                    srcGoal.ASort = 1
                } else {
                    let iiDes = desGoals.findIndex(x => desGoalIds[0] === x.Id)
                    if (iiDes < 0) {
                        // src id = desGoalIds[0]
                        let ii1 = desGoals.findIndex(x => desGoalIds[1] === x.Id)
                        if (ii1 < 0) return;
                        let index = desGoals[ii1].ASort     // m-index des
                        srcGoal.ASort = index               // src = des
                        desGoals.splice(ii1, 0, srcGoal)       // insert at
                        for (let ii = ii1 + 1, desG; ii < desGoals.length; ii++) {
                            desG = desGoals[ii]
                            if (desG.ASort < ++index) {
                                desG.ASort = index
                            } else break;
                        }
                    } else {
                        let ii1 = iiDes
                        let ii = 1
                        for (; ii < desGoalIds.length; ii++) {
                            const jDes = desGoals.findIndex(x => desGoalIds[ii] === x.Id)
                            if (jDes < 0) break
                            ii1 = jDes
                        }
                        let index = desGoals[ii1].ASort     // m-index des
                        srcGoal.ASort = ++index               // src = des + 1
                        desGoals.splice(ii1 + 1, 0, srcGoal)       // insert at
                        for (ii = ii1 + 2; ii < desGoals.length; ii++) {
                            const desG = desGoals[ii]
                            if (desG.ASort < ++index) {
                                desG.ASort = index
                            } else break;
                        }
                    }
                }
            }
            console.group('on end dnd ', evt)
            console.log('source ', srcSmPrId)
            console.log('destination ', desSmPrId, desGoalIds)
            console.groupEnd()
        },
    },
    created() {
        this.buildData([0], [0])
    },
    computed: {
        DndOptions() {
            return {
                animation: 200,
                disabled: false,
                ghostClass: "ghost",
                direction: 'vertical',
                group: "goal",
            }
        },
    },

}