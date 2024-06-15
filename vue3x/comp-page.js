export const MarketPage = {
    template: `#tmp-comp-market`,
    data() {
        return {
            IndexLand: 0,
        }
    },
    computed: {
        TxtLang(){ return this.$root.TxtLang },
        ListLand() {
            const lst = [{ Id: -1, Name: this.TxtLang.PleaseSelect }]
            return [...lst, ...this.$store.getters.lands]
        }
    },
    methods: {
        setIndexLand(value) { this.IndexLand = parseInt(value) },
    }
}