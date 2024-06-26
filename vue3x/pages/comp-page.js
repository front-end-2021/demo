import { MsFilter, MsFilterMarket } from "../components/dFilter.js";
export const MarketPage = {
    template: `#tmp-comp-market`,
    components: {
        'comp-filter-market': MsFilterMarket,
        //'comp-filter': MsFilter,
    },
    data() {
        return {
            Lands: this.$store.getters.LandsBy([0]),
        }
    },
    computed: {

    },
    methods: {
        setFilter([landIds, marketIds]) {
            this.Lands.splice(0)
            this.Lands = this.$store.getters.LandsBy(landIds)
        },
        editLand(land) {
            const saveClose = (mLand) => {
                console.log('on save close land', mLand)
            }
            const xClose = (mLand) => {
                let mess = `Somethings deferences \n`
                let ii = 1
                for (const [key, value] of Object.entries(mLand)) {
                    if (value === land[key]) {
                        mess += `${ii++}. ${key} \n`
                    }
                }
                console.log('on x close land', mLand)
                if (confirm(mess)) {
                    for (const [key, value] of Object.entries(mLand)) {
                        land[key] = value
                    }
                }
            }
            const item = {
                data: JSON.parse(JSON.stringify(land)),
                type: `comp-form-land`
            }
            this.$store.commit('setModal', [item, saveClose, xClose])
        },
    }
}