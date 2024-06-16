import { FTypeId } from "./common.js";
import { MsFilter } from "./comp-global.js";
export const MarketPage = {
    template: `#tmp-comp-market`,
    components: {
        'comp-filter': MsFilter
    },
    data() {
        return {
            IndexLand: 0,
        }
    },
    computed: {
        ListLand() {
            const lst = [{ 
                Id: FTypeId.PleaseSelect, 
                Name: this.$store.getters.txtLang.PleaseSelect }]
            return [...lst, ...this.$store.state.Lands]
        }
    },
    methods: {
        setIndexLand(value) { this.IndexLand = parseInt(value) },
    }
}