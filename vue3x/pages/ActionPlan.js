import { groupBy } from "../common.js"
export default {
    template: `#tmp-comp-action-plan`,
    // components: {

    // },
    data() {
        return {
            ListMarket: [],
            ProductGroups: [],
            GroupGoals: null,
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
            let listGoal = this.$store.getters.SortedItems([9, [0], []])
            const lstSubM = this.$store.getters.SortedItems([4, submkIds, []])
            const lstPrd = this.$store.getters.SortedItems([8, prdIds, []])
            // #endregion

            // #region goal
            if (!submkIds.includes(0) || !prdIds.includes(0)) {
                const submIds = lstSubM.map(x => x.Id)
                const prIds = lstPrd.map(x => x.Id)
                for (let gg = listGoal.length - 1, goal; -1 < gg; gg--) {
                    goal = listGoal[gg]
                    let [tSmId, tPrId] = goal.SubmPrdId.split('-')
                    let smId = parseInt(tSmId)
                    let prId = parseInt(tPrId)
                    if (submIds.includes(smId) && prIds.includes(prId)) {
                        continue;
                    }
                    listGoal.splice(gg, 1)      // remove at gg
                }
            }
            // #endregion
            const groupedGoals = groupBy(listGoal, 'SubmPrdId')

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
            this.GroupGoals = groupedGoals
            console.log('action plan finish build data ', Date.now() - ddd)
           // console.log('list goal ', listGoal)
           // console.log('grouped goals ', groupedGoals)
            function lstPrdXy(prgId, products, lstSubMkXy) {
                const lst = []
                for (let pp = 0, pr; pp < products.length; pp++) {
                    pr = products[pp]
                    if (prgId == pr.PrdGroupId) {
                        const lstSmk = lstSubMarketXy(pr.Id, lstSubMkXy)
                        if (!lstSmk.length) continue;
                        lst.push({
                            Entry: pr,
                            Submarkets: lstSmk
                        })
                    }
                }
                return lst
            }
            function lstSubMarketXy(prId, lstSubMkXy) {
                const lstSmk = []
                for (let ss = 0, subMk, smPrId; ss < lstSubMkXy.length; ss++) {
                    subMk = lstSubMkXy[ss]
                    smPrId = `${subMk.Id}-${prId}`
                    if (groupedGoals.has(smPrId)) {
                        lstSmk.push({
                            Entry: subMk,
                            SubmarketProductId: smPrId
                        })
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
                        lst.push({
                            Entry: smk,
                            Products: lstPrd
                        })
                    }
                }
                return lst;
            }
            function lstProducts(smId, products) {
                const lst = []
                for (let pp = 0, prd, smPrId; pp < products.length; pp++) {
                    prd = products[pp]
                    smPrId = `${smId}-${prd.Id}`
                    if (groupedGoals.has(smPrId)) {
                        lst.push({
                            Entry: prd,
                            SubmarketProductId: smPrId
                        })
                    }
                }
                return lst;
            }
        },
    },
    created() {
        this.buildData([0], [0])
    }
}