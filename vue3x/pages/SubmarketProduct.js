import { FTypeId, commSelectTypeId, MxFCriterial } from "../components/dFilter.js";
import { overrideItem } from "../mock-data.js";
import { DropSelection } from "../components/comp-global.js";
import { VueDraggableNext } from 'vue-draggable-next'

const FCriterialSmk = {
    template: `#tmp-comp-criterial-smarket`,
    components: {
        'drop-selection': DropSelection,
    },
    //mixins: [MxFCriterial],
    emits: ['remove:item', 'set:typeids'],
    inject: ['ignoreIds'],
    props: {
        index: Number,
        typeIds: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            typeId: -1,
            listId: [],
        }
    },
    computed: {
        SrcTypes() {
            const lst = []
            let lName = this.$store.state.ContextLang.PleaseSelect
            lst.push({ Id: FTypeId.PleaseSelect, Name: lName })
            lName = this.$store.getters.txtFilter(FTypeId.ProductGroups_Product)
            lst.push({ Id: FTypeId.ProductGroups_Product, Name: lName })
            lName = this.$store.getters.txtFilter(FTypeId.MarketSegments_Submarket)
            lst.push({ Id: FTypeId.MarketSegments_Submarket, Name: lName })
            return lst
        },
        SrcIds() {
            let ignIds = []
            let lst1 = [], lst2 = []
            if (0 == this.index) {
                lst1 = this.$store.getters.SortedItems([1, [0], ignIds])
                lst1.unshift({ Id: FTypeId.SelectLand, Name: this.$store.getters.txtFilter(FTypeId.SelectLand) })

                lst2 = this.$store.getters.SortedItems([3, [0], ignIds])
                lst2.unshift({ Id: FTypeId.SelectRegion, Name: this.$store.getters.txtFilter(FTypeId.SelectRegion) })
                return [lst1, lst2]
            } else {
                if (FTypeId.PleaseSelect == this.typeId) return []
                const itmSelctAll = {
                    Id: FTypeId.SelectAll, Name: this.$store.getters.txtFilter(FTypeId.SelectAll)
                }
                switch (this.typeId) {
                    case FTypeId.ProductGroups_Product:
                        ignIds = this.ignoreIds(FTypeId.ProductGroups_Product, 0, this.index)
                        lst1 = this.$store.getters.SortedItems([5, [0], ignIds])
                        lst1.unshift(itmSelctAll)

                        ignIds = this.ignoreIds(FTypeId.ProductGroups_Product, 1, this.index)
                        lst2 = this.$store.getters.SortedItems([8, [0], ignIds])
                        lst2.unshift(itmSelctAll)
                        return [lst1, lst2]
                    case FTypeId.MarketSegments_Submarket:
                        ignIds = this.ignoreIds(FTypeId.MarketSegments_Submarket, 0, this.index)
                        lst1 = this.$store.getters.SortedItems([2, [0], ignIds])
                        lst1.unshift(itmSelctAll)

                        ignIds = this.ignoreIds(FTypeId.MarketSegments_Submarket, 1, this.index)
                        lst2 = this.$store.getters.SortedItems([4, [0], ignIds])
                        lst2.unshift(itmSelctAll)
                        return [lst1, lst2]
                    default: break;
                }
            }
            return []
        },
        ItemSelectLand() {
            return {
                Id: FTypeId.SelectLand, // -29
                Name: this.$store.getters.txtFilter(FTypeId.SelectLand)
            }
        },
        ItemSelectRegion() {
            return {
                Id: FTypeId.SelectRegion, // -30
                Name: this.$store.getters.txtFilter(FTypeId.SelectRegion)
            }
        },
        ItemSelectAll() {
            return {
                Id: FTypeId.SelectAll, // 0
                Name: this.$store.getters.txtFilter(FTypeId.SelectAll)
            }
        },
    },
    methods: {
        selectTypeId(tId) {      // Number
            if (this.index < 1) return; // crites[0]
            this.typeId = tId
            switch (tId) {
                case FTypeId.PleaseSelect: this.listId = []
                    break;
                default: this.listId = [0, 0]
                    break;
            }
            this.$emit('set:typeids', [tId, this.listId])
        },
        selectId(id, ii) {
            this.listId[ii] = id
            this.$emit('set:typeids', [this.typeId, this.listId])
        },
    },
    beforeMount() {
        if(this.typeIds.length) this.typeId = this.typeIds[0]
        if(1 < this.typeIds.length) {
            if(Array.isArray(this.typeIds[1])) this.listId = this.typeIds[1]
        }
    }, 
    watch: {
        typeIds(nwLst, olLst) {
            const nTyp = nwLst[0]
            const oTyp = olLst[0]
            if(nTyp != oTyp) {
                this.typeId = nTyp
            }
        },
    },
    // beforeUnmount(){
    //     console.log('before unmouted', this.index)
    // },
}
const MsFilterSubMarket = {
    template: `#tmp-comp-filter-smarket`,
    components: {
        'comp-criterial-smarket': FCriterialSmk,
    },
    emits: ['set:filter'],
    beforeCreate() {
        const rootCrs = this.$root.SubMarketCrites
        if (!rootCrs.length) {
            rootCrs.push([FTypeId.PleaseSelect, [FTypeId.SelectLand, FTypeId.SelectRegion]])
        }
    },
    data() {
        return {
            Criterials: JSON.parse(JSON.stringify(this.$root.SubMarketCrites)),    // [Type, Ids]
        }
    },
    provide() {
        return {
            ignoreIds: (type, iid, ipos) => {
                if(ipos < 1) return []
                let lstCrit = []
                for(let iii = this.Criterials.length - 1, cri; 0 < iii; iii--) {
                    if(iii == ipos) continue;
                    cri = this.Criterials[iii]
                    if(type != cri[0]) continue;
                    lstCrit.push(cri[1][iid])
                }
                if (!lstCrit.length) return []
                lstCrit = lstCrit.filter(id => 0 <= id)
                if (!lstCrit.length) return []
                for (let ll = lstCrit.length - 1; -1 < ll; ll--) {
                    if (0 == lstCrit[ll]) lstCrit.splice(ll, 1)
                }
                return lstCrit
            },
        }
    },
    methods: {
        setTypeIds(iic, typeIds) { this.Criterials.splice(iic, 1, typeIds) },
        removeCriterial(iic) { this.Criterials.splice(iic, 1) },
        setFilter() {
            const rCrites = this.$root.SubMarketCrites
            const cCrites = this.Criterials
            if (!isChange.call(this)) return;
            this.$emit('set:filter', JSON.parse(JSON.stringify(cCrites)))
            function isChange() {
                if (rCrites.length != cCrites.length) return true;
                for (let cc = 0, lstR, rLstR; cc < cCrites.length; cc++) {
                    lstR = cCrites[cc]; rLstR = rCrites[cc];
                    if (lstR.length != rLstR.length) return true;
                    for (let rr = 0, itm, rItm; rr < lstR.length; rr++) {
                        rItm = rLstR[rr]; itm = lstR[rr];
                        if (itm.toString() != rItm.toString()) return true;
                    }
                }
                return false;
            }
        },
        resetFilter() { 
            const cCrites = this.Criterials
            for(let ii = cCrites.length - 1; 1 < ii; ii--) cCrites.splice(ii, 1)
            if(1 < cCrites.length) {
               // cCrites[1][1].splice(0)
                this.Criterials[1] = [FTypeId.PleaseSelect, []]
            }
            this.setFilter()
        },
        addFilter() { this.Criterials.push([FTypeId.ProductGroups_Product, [FTypeId.SelectAll, FTypeId.SelectAll]]) },
    },
}
export default {
    template: `#tmp-comp-submarket`,
    components: {
        'comp-filter-smarket': MsFilterSubMarket,
        'drop-selection': DropSelection,
        draggable: VueDraggableNext
    },
    data() {
        return {
            ProductGroups: [],

        }
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "productgroup",
                disabled: false,
                ghostClass: "ghost"
            }
        },
    },
    methods: {
        openFormSmp(type, eItem) {
            const iProject = this.$root.IndexProject
            if (!eItem) {     // add new
                let item, saveClose, xClose
                switch (type) {
                    case 5: // Product group
                        eItem = {
                            Id: this.$store.getters.newNumId(1),
                            Name: '', IsNew: false, Description: '',
                            ASort: this.$store.getters.newASort(1)
                        }
                        saveClose = (mItem) => {
                            overrideItem.call(eItem, mItem)
                            this.$store.commit('addUpdateLocal', [5, eItem, iProject])

                        }
                        xClose = (mItem) => {
                            if (typeof mItem.Name != 'string') return
                            if (!mItem.Name.length) return
                            let mess = `Do you want to save?`
                            if (confirm(mess)) saveClose(mItem)
                        }
                        item = {
                            title: `New ${this.$store.state.ContextLang.ProductGroups}`,
                            data: eItem,
                            type: `comp-form-land`
                        }
                        break;
                }
                this.$store.commit('setModal', [item, saveClose, xClose])
            } else {        // edit

            }

        },
        setFilter(cCrites) {
            this.$root.SubMarketCrites = cCrites
            const landId = cCrites[0][1][0]
            const regionId = cCrites[0][1][1]
            let prdGrpIds = cCrites.filter(x => x[0] == FTypeId.ProductGroups_Product)
            let productIds = prdGrpIds.map(x => x[1][1])
            prdGrpIds = prdGrpIds.map(x => x[1][0])
            let marketIds = cCrites.filter(x => x[0] == FTypeId.MarketSegments_Submarket)
            let subMarketIds = marketIds.map(x => x[1][1])
            marketIds = marketIds.map(x => x[1][0])
            checkRmv0(prdGrpIds)
            checkRmv0(productIds)
            checkRmv0(marketIds)
            checkRmv0(subMarketIds)
            console.group('set filter subMrk ', landId, regionId)
            console.log('product grp and product ', prdGrpIds, productIds)
            console.log('market and submarket ', marketIds, subMarketIds)
            console.groupEnd()
            function checkRmv0(lstId){
                if(lstId.length < 2) return lstId;
                if(!lstId.filter(x => 0 < x).length) return [0]
                for(let ii = lstId.length - 1; -1 < ii; ii--) {
                    if(lstId[ii] < 1) lstId.splice(ii, 1)
                }
                return lstId;
            }
        },
    },
}