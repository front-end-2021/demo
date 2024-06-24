import { FTypeId, MsFilter, MsFilterMarket } from "./components/dFilter.js";
export const MarketPage = {
    template: `#tmp-comp-market`,
    components: {
        'comp-filter': MsFilter,
        'comp-filter-market': MsFilterMarket,
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