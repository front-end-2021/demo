import { FTypeId, commSelectTypeId, MxFCriterial } from "../components/dFilter.js";
import { overrideItem } from "../mock-data.js";
const FCriterialSmk = {
    template: `#tmp-comp-criterial-smarket`,
    computed: {
        ItemPleaseSelect() {
            return {
                Id: FTypeId.PleaseSelect, // -12
                Name: this.$store.getters.txtFilter(FTypeId.PleaseSelect)
            }
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
    },
    methods: {
        selectTypeId(index) {
            const fId = commSelectTypeId(this, index)
            switch (fId) {
                case FTypeId.Land_Region:
                    this.ids.push(FTypeId.PleaseSelect)
                    break;

                default: break;
            }
        },
        getSrcId() {
            let ignIds
            switch (this.filterType) {
                case FTypeId.Land_Region:
                    return [this.ItemSelectLand, ...this.$store.getters.SortedItems([1, [], []])]
                case FTypeId.Land_Region:
                    return [this.ItemSelectRegion, ...this.$store.getters.SortedItems([3, [], []])]
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
    beforeCreate() {
        const rootCrs = this.$root.SubMarketCrites
        if (!rootCrs.length) {
            rootCrs.push([FTypeId.Land_Region, [FTypeId.PleaseSelect, FTypeId.PleaseSelect]])
        }
    },
    data() {
        return {
            Criterials: JSON.parse(JSON.stringify(this.$root.SubMarketCrites)),    // [Type, Ids]
        }
    },
    methods: {


    },
}
export default {
    template: `#tmp-comp-submarket`,
    components: {
        'comp-filter-smarket': MsFilterSubMarket,
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
    },
}