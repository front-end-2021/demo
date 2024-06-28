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
            Regions: this.$store.getters.RegionByLands([0]),
            Markets: this.$store.getters.MarketsBy([0]),
        }
    },
    computed: {

    },
    methods: {
        setFilter([landIds, marketIds]) {
            this.Lands.splice(0)
            this.Lands = this.$store.getters.LandsBy(landIds)
            this.Regions.splice(0)
            this.Regions = this.$store.getters.RegionByLands(landIds)
            
            this.Markets.splice(0)
            this.Markets = this.$store.getters.MarketsBy(marketIds)
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
        getEvaluation(iMarket, iRegion){
            if(iMarket == 0 && iRegion == 0) return `Evaluatoin Market`
            
            if(iMarket == 2 && iRegion == 0) return `933px
                  <i class="circle help link icon" data-html="Maximum device width with two <code>1em</code> gutters and a <code>17px</code> scrollbar width. <div class='ui divider'></div> <code>768 - (14 * (1 * 2)) - 17</code>">
                </i>`
            if(iMarket == 1 && iRegion == 0) return `<div class="cell-evaluation">
                  <span class="text-center">8</span><i class="icon checkmark"></i></div>`
            return ``
        },
    }
}