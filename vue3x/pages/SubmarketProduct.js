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
            indexType: 0,
            indexIds: [],
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
                if (this.indexType < 1) return []
                const itmSelctAll = {
                    Id: FTypeId.SelectAll, // 0
                    Name: this.$store.getters.txtFilter(FTypeId.SelectAll)
                }
                switch (this.indexType) {
                    case 1: // ProductGroups/Product:
                        ignIds = this.ignoreIds(FTypeId.ProductGroups_Product, 0, this.index)
                        lst1 = this.$store.getters.SortedItems([5, [0], ignIds])
                        lst1.unshift(itmSelctAll)

                        ignIds = this.ignoreIds(FTypeId.ProductGroups_Product, 1, this.index)
                        lst2 = this.$store.getters.SortedItems([8, [0], ignIds])
                        lst2.unshift(itmSelctAll)
                        return [lst1, lst2]
                    case 2:  //MarketSegments/Submarket:
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
        selectTypeId(index) {
            if (0 == this.index) return;
            this.indexType = index
            switch (index) {
                case 0: this.indexIds = []
                    break;
                default: this.indexIds = [0, 0]
                    break;
            }
            let ids = []
            if (index < 1) {
                this.$emit('set:typeids', this.index, [FTypeId.PleaseSelect, ids])
                return;
            }
            ids = [FTypeId.SelectAll, FTypeId.SelectAll]
            this.$emit('set:typeids', this.index, [this.SrcTypes[index].Id, ids])
        },
        selectId(index, ii) {
            this.indexIds[ii] = index
            const item = this.SrcIds[ii][index]
            if (!item) return;
            console.log('select id ', item, index, ii)
            const lstId = this.typeIds[1]
            lstId[ii] = item.Id
            this.$emit('set:typeids', this.index, [this.SrcTypes[this.indexType].Id, lstId])
        },
    },
    beforeMount() {
        this.indexType = this.SrcTypes.findIndex(x => x.Id == this.typeIds[0])
        const ids = this.typeIds[1]
        for (let ii = 0, index; ii < ids.length; ii++) {
            index = this.SrcIds[ii]
            if (!index) break;
            const id = ids[ii]
            index = index.findIndex(x => x.Id == id)
            if (-1 < index) {
                this.indexIds.push(index)
            }
        }
    },
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
                for(let iii = ipos - 1, cri; 0 < iii; iii--) {
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
        setTypeIds(iic, typeIds) { 
          //  this.Criterials.splice(iic, 1, typeIds) 
        },
        removeCriterial() { },
        setFilter() {
            const rCrites = this.$root.SubMarketCrites
            const cCrites = this.Criterials
            if (!isChange.call(this)) return;
            this.$root.SubMarketCrites = JSON.parse(JSON.stringify(cCrites))
            //this.$emit('set:filter', [landIds, marketIds])
            console.log('set filter')
            function isChange() {
                if (rCrites.length != cCrites.length) return true;
                for (let cc = 0, lstR, rLstR; cc < cCrites.length; cc++) {
                    lstR = cCrites[cc]
                    rLstR = rCrites[cc]
                    if (lstR.length != rLstR.length) return true;
                    for (let rr = 0, itm, rItm; rr < lstR.length; rr++) {
                        rItm = rLstR[rr]; itm = lstR[rr]
                        if (itm.toString() != rItm.toString()) return true;
                    }
                }
                return false;
            }
        },
        resetFilter() { },
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
        setFilter() {

        },
    },
}