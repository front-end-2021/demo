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
                mLand = JSON.parse(JSON.stringify(mLand))
                for (const [key, value] of Object.entries(mLand)) {
                    land[key] = value
                }
            }
            const xClose = (mLand) => {
                let mess = ''
                let ii = 1
                mLand = JSON.parse(JSON.stringify(mLand))
                for (const [key, value] of Object.entries(mLand)) {
                    if (value !== land[key]) {
                        mess += `${ii++}. ${key}: ${land[key]} => ${value} \n`
                    }
                }
                if (mess) {
                    mess = `Somethings deferences \n` + mess
                    if (confirm(mess)) {
                        for (const [key, value] of Object.entries(mLand)) {
                            land[key] = value
                        }
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