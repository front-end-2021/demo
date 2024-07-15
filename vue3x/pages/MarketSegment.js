import { MsFilterMarket, getLandMarketIds } from "../components/dFilter.js";
import { FTypeId } from "../components/dFilter.js";

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
    watch: {
        '$root.ActiveLandIds'(ids) {
            let lstC = this.$root.MarketCriterias
            const [landIds] = getLandMarketIds(lstC)
            
            let mergeIdLands = ids
            if (!landIds.includes(0)) {
                mergeIdLands = ids.filter(id => landIds.includes(id))
            }
            this.Regions = this.$store.getters.RegionByLands(mergeIdLands)
        },
        '$root.IndexProject'(iPrj) {
            let lstC = this.$root.MarketCriterias
            const [landIds, marketIds] = getLandMarketIds(lstC)
            //   console.log('watch Index Project', iPrj, landIds, marketIds)
            this.setFilter([landIds, marketIds])
        },
    },
    methods: {
        setFilter([landIds, marketIds]) {
            
            this.Lands = this.$store.getters.LandsMarketsBy([1, landIds])

            let mergeIdLands = this.$root.ActiveLandIds
            if (!landIds.includes(0)) {
                mergeIdLands = mergeIdLands.filter(id => landIds.includes(id))
            }
            this.Regions = this.$store.getters.RegionByLands(mergeIdLands)

            const rootIdMarkets = this.$root.MarketIds
            rootIdMarkets.splice(0)                         // not watch
            marketIds.forEach(id => rootIdMarkets.push(id)) // not watch

            this.Markets = this.$store.getters.LandsMarketsBy([2, marketIds])
        },
        setLandRegionMarket() {
            let lstC = this.$root.MarketCriterias
            const [landIds] = getLandMarketIds(lstC)
            
            this.Lands = this.$store.getters.LandsMarketsBy([1, landIds])

            let mergeIdLands = this.$root.ActiveLandIds
            if (!landIds.includes(0)) {
                mergeIdLands = mergeIdLands.filter(id => landIds.includes(id))
            }
            this.Regions = this.$store.getters.RegionByLands(mergeIdLands)

            const marketIds = this.$root.MarketIds
            this.Markets = this.$store.getters.MarketsBy([2, marketIds])
        },
        activeLand(land) {
            const rootActiveIdLands = this.$root.ActiveLandIds.map(id => id)
            const ii = rootActiveIdLands.indexOf(land.Id)
            if (ii < 0) rootActiveIdLands.push(land.Id)
            else rootActiveIdLands.splice(ii, 1)
            this.$root.ActiveLandIds = rootActiveIdLands
        },
        openFormLand(land) {
            const iProject = this.$root.IndexProject
            if (!land) {        // add new
                land = {
                    Id: this.$store.getters.newId(1),
                    Name: '', IsNew: false, Description: '',
                    ASort: this.$store.getters.newASort(1)
                }
                const saveClose = (mLand) => {
                    overrideItem.call(land, mLand)
                    this.$store.commit('addUpdateLocal', [1, land, iProject])
                    
                    let lstC = this.$root.MarketCriterias
                    const [landIds, marketIds] = getLandMarketIds(lstC)
                    if (landIds.includes(0)) this.setLandRegionMarket()
                    else {
                        let mess = `New Land has not in filter result. Do you want?`
                        // reset filter or add new land in filter criterial
                        const resetLands = () => {
                            lstC = JSON.parse(JSON.stringify(lstC))
                            if (lstC.filter(x => x[0] === FTypeId.Land_Region).length) {
                                for (let cc = lstC.length - 1; -1 < cc; cc--) {
                                    const crites = lstC[cc]
                                    if (crites[0] === FTypeId.Land_Region) {
                                        const id = crites[1][0]
                                        if (0 < id) lstC.splice(cc, 1)      // remove at cc
                                    }
                                }
                                if (!lstC.length) {
                                    lstC.push([FTypeId.Land_Region, [0]])
                                }
                                this.$root.MarketCriterias = lstC
                            }

                        }
                        const filterContainNewLand = () => {
                            lstC = JSON.parse(JSON.stringify(lstC));
                            lstC.push([FTypeId.Land_Region, [land.Id]])
                            this.$root.MarketCriterias = lstC
                        }
                        let item = {
                            type: 'comp-mess-newland',
                            title: mess,
                            data: null
                        }
                        this.$store.commit('setModal', [item, filterContainNewLand, resetLands])
                    }
                }
                const xClose = (mLand) => {
                    if (typeof mLand.Name != 'string') return
                    if (!mLand.Name.length) return
                    let mess = `Do you want to save?`
                    if (confirm(mess)) saveClose(mLand)
                }
                const item = {
                    title: `New Land`,
                    data: land,
                    type: `comp-form-land`
                }
                this.$store.commit('setModal', [item, saveClose, xClose])
                return
            }
            // #region edit Land
            const saveClose = (mLand) => {
                overrideItem.call(land, mLand)
                this.$store.commit('addUpdateLocal', [1, land, iProject])
            }
            const xClose = (mLand) => {
                let mess = getMessCompare(land, mLand)
                if (mess && confirm(mess)) saveClose(mLand)
            }
            const item = {
                title: `Edit Land`,
                data: JSON.parse(JSON.stringify(land)),
                type: `comp-form-land`
            }
            // #endregion
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
            if (item.Active) return `bi-check`
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
                [market.Id, region.Id]).then(([ii, item]) => {
                    if (ii < 0) return;
                    const saveClose = (mItem) => {
                        const itemCopy = Object.assign(item, mItem)
                        this.$store.state.MarketRegions.splice(ii, 1, itemCopy)
                    }
                    this.$store.commit('setModal', [{
                        data: item,
                        path: `${market.Name} / ${land} / ${region.Name}`,
                        type: `comp-form-valuation`
                    }, saveClose, () => { }])
                })

        },
        onClickTab(e) {
            //console.log('on click tab', e.target, e)
            this.MenuValuation.splice(0)
        },
        openFormNewMarket() {
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
        openFormRegion(region) {
            const iProject = this.$root.IndexProject
            if (!region) {
                // add new
                region = {
                    Id: this.$store.getters.newId(2),
                    Name: '', Description: '',
                    LandId: 0,
                    ASort: this.$store.getters.newASort(2)
                }
                const saveClose = (mRegion) => {

                }
                const xClose = (mRegion) => {
                    if (typeof mRegion.Name != 'string') return
                    if (!mRegion.Name.length) return
                    let mess = `Do you want to save?`
                    if (confirm(mess)) saveClose(mRegion)
                }
                const item = {
                    title: `New REgion`,
                    data: region,
                    type: `comp-form-region`
                }
                this.$store.commit('setModal', [item, saveClose, xClose])
                return
            }
            // #region edit
            const saveClose = (mRegion) => {
                overrideItem.call(region, mRegion)
                this.$store.commit('addUpdateLocal', [2, region, iProject])
            }
            const xClose = (mRegion) => {
                let mess = getMessCompare(region, mRegion)
                if (mess && confirm(mess)) saveClose(mRegion)
            }
            const item = {
                title: `Edit Region`,
                data: JSON.parse(JSON.stringify(region)),
                type: `comp-form-region`
            }
            // #endregion
            this.$store.commit('setModal', [item, saveClose, xClose])
        },
    },
    created() {
        this.setLandRegionMarket()
    },
    mounted() {

    },
}
function getMessCompare(item, mItem) {
    let mess = ''
    let ii = 1
    mItem = JSON.parse(JSON.stringify(mItem))
    item = JSON.parse(JSON.stringify(item))
    for (const [key, value] of Object.entries(mItem)) {
        if (value !== item[key]) {
            mess += `${ii++}. ${key}: ${item[key]} => ${value} \n`
        }
    }
    if (!mess) return
    return `Somethings deferences \n${mess}`
}
function overrideItem(mItem) {
    const item = this
    mItem = JSON.parse(JSON.stringify(mItem))
    for (const [key, value] of Object.entries(mItem)) {
        item[key] = value
    }
}
