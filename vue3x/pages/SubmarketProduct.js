import { FTypeId, commSelectTypeId, MxFCriterial } from "../components/dFilter.js";
import { overrideItem } from "../mock-data.js";
import { VueDraggableNext } from 'vue-draggable-next'

const FCriterialSmk = {
    template: `#tmp-comp-criterial-smarket`,
    mixins: [MxFCriterial],
    emits: ['remove:item'],
    inject: ['ignoreIds'],
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
        idSelectName(id, ii) {
            let item = this.getSrcId(ii).find(x => id == x.Id)
            if (item) return item.Name
            return this.SrcTypes[0].Name
        },
        selectTypeId(index) {
            this.ids.splice(0)
            if (0 == this.index) {
                this.ids.push(FTypeId.SelectLand)
                this.ids.push(FTypeId.SelectRegion)
                return
            }
            const fId = commSelectTypeId(this, index)
            if(fId == FTypeId.PleaseSelect) return;
            this.ids.push(FTypeId.SelectAll)
            this.ids.push(FTypeId.SelectAll)
        },
        getSrcId(iii) {
            if (0 == this.index) {
                if (0 == iii) return [this.ItemSelectLand, ...this.$store.getters.SortedItems([1, [0], []])]
                if (1 == iii) return [this.ItemSelectRegion, ...this.$store.getters.SortedItems([3, [0], []])]
                return []
            }
            let ignIds = this.ignoreIds(this.filterType, iii)
            console.log('get src ids ', ignIds, this.filterType)
            switch (this.filterType) {
                case FTypeId.PleaseSelect: return []
                case FTypeId.ProductGroups_Product:
                    if (0 == iii) return [this.ItemSelectAll, ...this.$store.getters.SortedItems([5, [0], ignIds])]
                    if (1 == iii) return [this.ItemSelectAll, ...this.$store.getters.SortedItems([8, [0], ignIds])]
                    return []
                case FTypeId.MarketSegments_Submarket:
                    if (0 == iii) return [this.ItemSelectAll, ...this.$store.getters.SortedItems([2, [0], ignIds])]
                    if (1 == iii) return [this.ItemSelectAll, ...this.$store.getters.SortedItems([4, [0], ignIds])]
                    return []
                default: break;
            }
            return []
        },

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
            ignoreIds: (type, iii) => {
                let lstCrit = this.Criterials.filter(xxs => xxs[0] == type)
                if (!lstCrit.length) return []
                lstCrit = lstCrit.map(xxs => { return xxs[1][iii] })
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
        setTypeF(ii, val) {
            const crts = this.Criterials[ii]
            crts[0] = val
        },
        setIds(ii, ids) { this.Criterials[ii].splice(1, 1, ids) },
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