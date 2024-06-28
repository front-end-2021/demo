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

            MarketRegions: [],
            MenuValuation: [],
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
        getValuation(mId, rId) {
            const item = this.MarketRegions.find(x => mId == x.MarketId && rId == x.RegionId);
            if (!item) return;
            return 1
        },
        mouseOverValuation(iMarket, iRegion) {
            //Criteria
        },
        toggleMenuValuation(imk, irg) {
            if (1 < this.MenuValuation.length) {
                if (imk == this.MenuValuation[0] && irg == this.MenuValuation[1]) {
                    this.MenuValuation.splice(0)
                    return
                }
            }
            this.MenuValuation.splice(0, 1, imk)
            this.MenuValuation.splice(1, 1, irg)
        },
        activeValuation(MarketId, RegionId) {
            const ii = this.MarketRegions.findIndex(x => MarketId == x.MarketId && RegionId == x.RegionId);
            this.MenuValuation.splice(0)
            if (ii < 0) {
                this.MarketRegions.push({
                    MarketId, RegionId,
                    Criteria: []
                })
                return
            }
            this.MarketRegions.splice(ii, 1)        // remove
        },
        clssCheckMark(mId, rId) {
            const item = this.MarketRegions.find(x => mId == x.MarketId && rId == x.RegionId);
            if (item) return `checkmark`
            return
        },
        classSquare(mId, rId) {
            const item = this.MarketRegions.find(x => mId == x.MarketId && rId == x.RegionId);
            if (item) return `bi-check2-square`
            return `bi-square`
        },
        openFormValuation(mId, rId) {
            this.MenuValuation.splice(0)
            const item = this.MarketRegions.find(x => mId == x.MarketId && rId == x.RegionId);
            if (!item) return;
            const saveClose = (mItem) => {
                console.log('save close', mItem)
            }
            this.$store.commit('setModal', [{
                data: JSON.parse(JSON.stringify(item)),
                type: `comp-form-valuation`
            }, saveClose, () => { }])
        },
    }
}