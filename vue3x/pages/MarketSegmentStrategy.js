import { MsFilterMarket } from "../components/dFilter.js";
export default {
    template: `#tmp-comp-market`,
    components: {
        'comp-filter-market': MsFilterMarket,
    },
    data() {
        return {
            Lands: [],
            Regions: [],
            Markets: [],

            MenuValuation: [],
        }
    },
    computed: {

    },
    methods: {
        setFilter([landIds, marketIds]) {
            const rootLandIds = this.$root.LandIds
            rootLandIds.splice(0)
            landIds.forEach(id => rootLandIds.push(id))

            this.Lands.splice(0)
            this.Lands = this.$store.getters.LandsBy(landIds)
            this.Regions.splice(0)
            this.Regions = this.$store.getters.RegionByLands(landIds)

            const rootMarketIds = this.$root.MarketIds
            rootMarketIds.splice(0)
            marketIds.forEach(id => rootMarketIds.push(id))

            this.Markets.splice(0)
            this.Markets = this.$store.getters.MarketsBy(marketIds)
        },
        setLandRegionMarket() {
            const landIds = this.$root.LandIds
            this.Lands = this.$store.getters.LandsBy(landIds)
            this.Regions = this.$store.getters.RegionByLands(landIds)

            const marketIds = this.$root.MarketIds
            this.Markets = this.$store.getters.MarketsBy(marketIds)
        },
        activeLand(land){ this.$root.ActiveLandId = land.Id },
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
                title: `Edit Land`,
                data: JSON.parse(JSON.stringify(land)),
                type: `comp-form-land`
            }
            this.$store.commit('setModal', [item, saveClose, xClose])
        },
        newLand() {
            const land = {
                Id: this.$store.getters.newId(1),
                Name: '', IsNew: false, Description: '',
                ASort: this.$store.getters.newASort(1)
            }
            const saveClose = (mLand) => {
                mLand = JSON.parse(JSON.stringify(mLand))
                for (const [key, value] of Object.entries(mLand)) {
                    land[key] = value
                }
                this.$store.state.Lands.push(land)
                this.setLandRegionMarket()
            }
            const xClose = (mLand) => {
                if (typeof mLand.Name != 'string') return
                if (!mLand.Name.length) return

                let mess = `Do you want to save?`
                if (confirm(mess)) {
                    saveClose(mLand)
                }
            }
            const item = {
                title: `New Land`,
                data: JSON.parse(JSON.stringify(land)),
                type: `comp-form-land`
            }
            this.$store.commit('setModal', [item, saveClose, xClose])
        },
        getValuation(mId, rId, item) {
            if (!item) item = this.$store.getters.MarketRegionBy([mId, rId])
            if (!item) return;
            return getTotal(item.Criterias)
            function getTotal(items) {
                if (!items.length) return
                const lstCrt = items.map(x => x.Value * x.Weight)
                const sum = lstCrt.reduce((a, b) => a + b, 0)
                return Math.round(sum / lstCrt.length)
            }
        },
        getBackgroundColor(mId, rId) {
            const item = this.$store.getters.MarketRegionBy([mId, rId])
            if (!item) return
            if (!item.Active) return { backgroundColor: `#eaeaea`, color: `#fff` }

            const total = this.getValuation(mId, rId, item)
            if (0 == total) return { backgroundColor: `#f0de4f`, color: `#fff` }

            if (-11 < total && total < 0) return { backgroundColor: `#f9bb51`, color: `#fff` }
            if (-21 < total && total < -10) return { backgroundColor: `#f2ad4d`, color: `#fff` }
            if (-31 < total && total < -20) return { backgroundColor: `#e99c49`, color: `#fff` }
            if (-41 < total && total < -30) return { backgroundColor: `#df8a44`, color: `#fff` }
            if (-51 < total && total < -40) return { backgroundColor: `#d5773f`, color: `#fff` }
            if (-61 < total && total < -50) return { backgroundColor: `#cb633a`, color: `#fff` }
            if (-71 < total && total < -60) return { backgroundColor: `#e2a696`, color: `#000` }
            if (-81 < total && total < -70) return { backgroundColor: `#e4a399`, color: `#000` }
            if (-91 < total && total < -80) return { backgroundColor: `#e59d99`, color: `#000` }
            if (-101 < total && total < -90) return { backgroundColor: `#e59494`, color: `#000` }
            if (0 < total && total < 11) return { backgroundColor: `#c0d02e`, color: `#fff` }
            if (10 < total && total < 21) return { backgroundColor: `#b8c92e`, color: `#fff` }
            if (20 < total && total < 31) return { backgroundColor: `#adc02c`, color: `#fff` }
            if (30 < total && total < 41) return { backgroundColor: `#a1b42b`, color: `#fff` }
            if (40 < total && total < 51) return { backgroundColor: `#93a82a`, color: `#fff` }
            if (50 < total && total < 61) return { backgroundColor: `#adc02c`, color: `#fff` }
            if (60 < total && total < 71) return { backgroundColor: `#839b27`, color: `#fff` }
            if (70 < total && total < 81) return { backgroundColor: `#668125`, color: `#fff` }
            if (80 < total && total < 91) return { backgroundColor: `#597623`, color: `#fff` }
            if (90 < total && total < 101) return { backgroundColor: `#4e6d22`, color: `#fff` }
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
            const item = this.$store.getters.MarketRegionBy([MarketId, RegionId])
            //  this.MenuValuation.splice(0)
            if (!item) {
                this.$store.state.MarketRegions.push({
                    MarketId, RegionId,
                    Criterias: [], Active: true,
                    Comment: ``
                })
                return
            }
            item.Active = !item.Active
        },
        clssCheckMark(mId, rId) {
            const item = this.$store.getters.MarketRegionBy([mId, rId])
            if (!item) return
            if (item.Active) return `checkmark`
        },
        classSquare(mId, rId) {
            const item = this.$store.getters.MarketRegionBy([mId, rId])
            if (!item) return `bi-square`
            if (item.Active) return `bi-check2-square`
            return `bi-square`
        },
        dblclOpenFormValue(market, region) {
            const mId = market.Id
            const rId = region.Id;
            const item = this.$store.getters.MarketRegionBy([mId, rId])
            if (!item) return
            this.openFormValuation(market, region)
        },
        openFormValuation(market, region) {
            const landId = region.LandId
            let land = this.Lands.find(l => landId == l.Id)
            if (land) {
                land = land.Name + (land.IsNew ? ' *' : '')
            } else land = 'LAND'

            this.MenuValuation.splice(0)
            this.$store.dispatch('openFormValue',
                [market.Id, region.Id]).then(([ii, itemCopy]) => {
                    if (ii < 0) return;
                    const saveClose = (mItem) => {
                        itemCopy = Object.assign(itemCopy, mItem)
                        this.$store.state.MarketRegions.splice(ii, 1, itemCopy)
                    }
                    this.$store.commit('setModal', [{
                        data: itemCopy,
                        path: `${market.Name} / ${land} / ${region.Name}`,
                        type: `comp-form-valuation`
                    }, saveClose, () => { }])
                })

        },
        onClickTab(e) {
            //console.log('on click tab', e.target, e)
            this.MenuValuation.splice(0)
        },
        newMarket() {
            const market = {
                Id: this.$store.getters.newId(3),
                Name: '', Description: '', LandId: -12,
                ASort: this.$store.getters.newASort(3)
            }
            const saveClose = (mMarket) => {

            }
            const xClose = (mMarket) => {

            }

            this.$store.commit('setModal', [market, saveClose, xClose])
        },
    },
    created() {
        this.setLandRegionMarket()
    },
    mounted() {

    },
}