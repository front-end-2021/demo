
const CriterialType = [
    'Please select',
    `Land/Region`,
    `Product groups/Product`,
    `Stakeholder groups/Contact Person`,
    `Customer Journey Group`,
    `Market segments/Stakeholder groups`,
    `Task`,
    `User`,
    `Status`,
    `Objective category`,
    `Measure category`,
    `Instruments`,
    `Advertising material/Advertiser`,
    `Superior objectives and measures`,
    `Master goals`,
    `Masterbudget`,
    `Fibu/Cost center`,
    `Department/Field`,
    `Subject/thema`,
    `Supplier`,
    `Hidden elements`,
]
export const FTypeId = {
    SelectAll: 0,
    ProductGroups: -1,
    Product: -2,
    Subproduct: -3,
    StakeholderGroups: -4,
    ContactPerson: -5,
    ContactSubPerson: -6,
    CustomerJourneyGroup: -7,
    CustomerJourney: -8,
    CustomerSubJourney: -9,
    SelectMarketSegments: -10,
    SelectStakeholderGroups: -11,
    PleaseSelect: -12,
    AllStatus: -13,
    AdvertisingMeterial: -14,
    Advertiser: -15,
    SuperiorThemes: -16,
    Themes: -17,
    SelectMasterMaingoals: -18,
    SelectMasterSubgoals: -19,
    ShowAll: -20,
    ShowOnlyHidden: -21,
    SelectLand_Region: -22,
    LastStatus: -23,
    Land_Region: -24,
    MarketSegments: -25,
    ProductGroups_Product: -26,
    Submarkets_ContactPerson: -27,
    MarketSegments_Submarket: -28,
    SelectLand: -29,
}
const KeyOperator = {
    FilterBy: -1,
    And: 0,
    Or: 1
}
function commSelectTypeId(index) {
    index = parseInt(index)
    let item = this.SrcTypes[index]
    if (!item) return
    const fId = item.Id
    this.$emit('set:typef', fId)
    this.ids.splice(0)
    return fId
}
const MxFCriterial = {
    emits: ['set:typef', 'set:ids'],
    props: {
        index: Number,
        filterType: Number,
        ids: {
            type: Array,
            default: []
        }
    },
    computed: {
        SrcTypes() {
            const lst = []
            let lName = this.$store.getters.txtLang.PleaseSelect
            lst.push({ Id: FTypeId.PleaseSelect, Name: lName })
            lName = `${this.$store.getters.txtLang.Land}/`
            lName += `${this.$store.getters.txtLang.Region}`
            lst.push({ Id: FTypeId.Land_Region, Name: lName })
            lName = this.$store.getters.txtLang.Marketsegments
            lst.push({ Id: FTypeId.MarketSegments, Name: lName })
            return lst
        },
        TypeSelectName() {
            let xt = this.SrcTypes.find(x => x.Id == this.filterType)
            if (xt) return xt.Name
            return ''
        },
    },
    methods: {
        selectId(ii, index) {
            index = parseInt(index)
            const item = this.getSrcId(ii)[index]
            if (!item) return;

            const id = item.Id
            const lstId = this.ids
            lstId.splice(ii, 1, id)
            this.$emit('set:ids', lstId)
        },
        idSelectName(ii) {
            const id = this.ids[ii]
            if (id < 1) return this.$store.getters.txtFilter(id);
            let item = this.getSrcId(ii).find(x => id == x.Id)
            if (item) return item.Name
            return ''
        },
        getSrcId() {
            switch (this.filterType) {
                case FTypeId.Land_Region:
                    return [this.ItemSelectLand, ...this.$store.getters.LandsBy([0])]
                case FTypeId.MarketSegments:
                    return [this.ItemSelectMarket, ...this.$store.getters.MarketsBy([0])]
                default: break;
            }
            return []
        },
    },
}
const FCriterialMarket = {
    template: `#tmp-comp-criterial-market`,
    mixins: [MxFCriterial],
    emits: ['remove:item'],
    inject: ['ignoreIds'],
    computed: {
        ItemSelectLand() {
            return {
                Id: FTypeId.SelectLand, // -29
                Name: this.$store.getters.txtFilter(FTypeId.SelectLand)
            }
        },
        ItemSelectMarket() {
            return {
                Id: FTypeId.SelectMarketSegments,   // -10
                Name: this.$store.getters.txtFilter(FTypeId.SelectMarketSegments)
            }
        }
    },
    methods: {
        selectTypeId(index) {
            const fId = commSelectTypeId.call(this, index)
            switch (fId) {
                case FTypeId.Land_Region:
                    this.ids.push(FTypeId.SelectLand)
                    break;
                case FTypeId.MarketSegments:
                    this.ids.push(FTypeId.SelectMarketSegments)
                    break;
                default: break;
            }
        },
        getSrcId() {
            let ignIds
            switch (this.filterType) {
                case FTypeId.Land_Region:
                    ignIds = this.ignoreIds(this.index, 1)
                    return [this.ItemSelectLand, ...this.$store.getters.LandsMarketsExept([1, ignIds])]
                case FTypeId.MarketSegments:
                    ignIds = this.ignoreIds(this.index, 2)
                    return [this.ItemSelectMarket, ...this.$store.getters.LandsMarketsExept([2, ignIds])]
                default: break;
            }
            return []
        },

    },
}
export const getLandMarketIds = (lstC) => {
    let landIds = []
    let marketIds = []
    const cLen = lstC.length
    const typeSelect = -2024
    for (let ii = 0; ii < cLen; ii++) {
        const crt = lstC[ii]
        const type = crt[0]
        const ids = crt[1]
        processType(type, ids[0])
    }
    let lndIds = landIds.filter(l => 0 < l);
    lndIds = lndIds.filter((v, i, self) => i == self.indexOf(v));// remove duplicate
    if (lndIds.length) landIds = lndIds;
    else landIds = [0];

    let mrkIds = marketIds.filter(l => 0 < l)
    mrkIds = mrkIds.filter((v, i, self) => i == self.indexOf(v));// remove duplicate
    if (mrkIds.length) marketIds = mrkIds;
    else marketIds = [0];
    return [landIds, marketIds]
    function processType(type, id) {
        switch (type) {
            case FTypeId.PleaseSelect:
                landIds.push(typeSelect);
                marketIds.push(typeSelect);
                break;
            case FTypeId.Land_Region:
                if (id == FTypeId.SelectLand)
                    landIds.push(0);
                else landIds.push(id)
                break;
            case FTypeId.MarketSegments:
                if (id == FTypeId.SelectMarketSegments)
                    marketIds.push(0);
                else marketIds.push(id)
                break;
        }
    }
}
export const MsFilterMarket = {
    template: `#tmp-comp-filter-market`,
    components: {
        'comp-criterial-market': FCriterialMarket,
    },
    emits: ['set:filter'],
    props: {
        // landIds: {
        //     type: Array,
        //     default: [0]
        // },
        marketIds: {
            type: Array,
            default: [0]
        },
    },
    beforeCreate() {
        const rootCrs = this.$root.MarketCriterias
        if (!rootCrs.length) {
            rootCrs.push([FTypeId.PleaseSelect, []])    // [Type, Ids]
        }
    },
    data() {
        return {
            Criterials: JSON.parse(JSON.stringify(this.$root.MarketCriterias))
        }
    },
    watch: {
        // '$root.LandIds'(ids, olds) {
        //     let isSetFt = false
        //     const lstC = this.Criterials
        //     if (ids.includes(0)) {
        //         // filter reset Lands (after add new Land)
        //         // if (lstC.filter(x => x[0] === FTypeId.Land_Region).length) {
        //         //     for (let cc = lstC.length - 1; -1 < cc; cc--) {
        //         //         const crites = lstC[cc]
        //         //         if (crites[0] === FTypeId.Land_Region) {
        //         //             const id = crites[1][0]
        //         //             if (0 < id) {
        //         //                 lstC.splice(cc, 1)      // remove
        //         //                 isSetFt = true
        //         //             }
        //         //         }
        //         //     }
        //         //     if (!lstC.length) {
        //         //         lstC.push([FTypeId.Land_Region, [0]])
        //         //     }
        //         //     if (isSetFt) this.setFilter()
        //         //     return
        //         // }
        //     }
        //     if (!ids.includes(0) && !olds.includes(0)) {
        //         // add new land in filter criterial
        //         // if (olds.length < ids.length) {
        //         //     for (let ll = 0; ll < ids.length; ll++) {
        //         //         const id = ids[ll]
        //         //         if (olds.includes(id)) continue;
        //         //         lstC.push([FTypeId.Land_Region, [id]])
        //         //         isSetFt = true
        //         //     }
        //         //     if (isSetFt) this.setFilter()
        //         //     return
        //         // }
        //     }
        // },
        '$root.MarketCriterias'(lstC) {
            this.Criterials = JSON.parse(JSON.stringify(lstC))
            this.setFilter()
        },
    },
    provide() {
        return {
            ignoreIds: (index, type) => {
                const lst = []
                switch (type) {
                    case 1: // Land
                        for (let ii = this.Criterials.length - 1; -1 < ii; ii--) {
                            if (ii == index) continue
                            const crite = this.Criterials[ii]
                            if (crite[0] == FTypeId.PleaseSelect) continue
                            if (crite[0] == FTypeId.MarketSegments) continue
                            const id = crite[1][0]
                            if (id < 1) continue
                            lst.push(id)
                        }
                        if (!lst.length) return [-1989]
                        return lst
                    case 2:         // Market
                        for (let ii = this.Criterials.length - 1; -1 < ii; ii--) {
                            if (ii == index) continue
                            const crite = this.Criterials[ii]
                            if (crite[0] == FTypeId.PleaseSelect) continue
                            if (crite[0] == FTypeId.Land_Region) continue
                            const id = crite[1][0]
                            if (id < 1) continue
                            lst.push(id)
                        }
                        if (!lst.length) return [-1989]
                        return lst;
                }
                return [-1989];
            },
        }
    },
    created() {
        const rootCrs = this.$root.MarketCriterias
        if (1 < rootCrs.length || rootCrs[0][0] != FTypeId.PleaseSelect) {
            this.setFilter()
        }
    },
    methods: {
        setTypeF(ii, val) {
            const crts = this.Criterials[ii]
            crts[0] = val
        },
        setIds(ii, ids) { this.Criterials[ii].splice(1, 1, ids) },
        addFilter(e) { this.Criterials.push([FTypeId.PleaseSelect, []]) },
        setFilter(e) {
            const lstC = this.Criterials
            const [landIds, marketIds] = getLandMarketIds(lstC)
            this.$emit('set:filter', [landIds, marketIds])
            //this.$root.MarketCriterias = JSON.parse(JSON.stringify(lstC))
            const rLstC = this.$root.MarketCriterias
            removeRootCrites.call(this)
            addToRootCrites.call(this)
            function removeRootCrites() {
                for (let ii = 0; ii < rLstC.length; ii++) {
                    const rCrite = rLstC[ii]
                    const crite = lstC[ii]
                    if (rCrite[0] != crite[0]) {
                        ii = removeAt(ii)
                        continue
                    }
                    const rIds = rCrite[1]
                    const ids = crite[1]
                    if (rIds.length != ids.length) {
                        ii = removeAt(ii)
                        continue
                    }
                    for (let jj = 0; jj < rIds.length; jj++) {
                        if (rIds[jj] != ids[jj]) {
                            ii = removeAt(ii)
                            break;
                        }
                    }
                }
                function removeAt(ii) {
                    rLstC.splice(ii, 1) // remove at ii
                    return --ii
                }
            }
            function addToRootCrites() {
                for (let ii = 0; ii < lstC.length; ii++) {
                    const rCrite = rLstC[ii]        // [type, ids]
                    const crite = lstC[ii]
                    if (!rCrite) {
                        rLstC.splice(ii, 0, crite);     // add at ii
                        continue
                    }
                    if (rCrite[0] != crite[0]) {
                        rLstC.splice(ii, 0, crite);     // add at ii
                        continue
                    }
                    const rIds = rCrite[1]
                    const ids = crite[1]
                    if (rIds.length != ids.length) {
                        rLstC.splice(ii, 0, crite);     // add at ii
                        continue
                    }
                    for (let jj = 0; jj < rIds.length; jj++) {
                        if (rIds[jj] != ids[jj]) {
                            rLstC.splice(ii, 0, crite);     // add at ii
                            break;
                        }
                    }
                }
            }
        },
        resetFilter(e) {
            const lstC = this.Criterials
            for (let cc = lstC.length - 1; 0 < cc; cc--) {
                const items = lstC[cc]
                items[1].splice(0)
                items.splice(0)
                lstC.splice(cc, 1)
            }
            lstC[0][1].splice(0)
            lstC[0].splice(0, 1, FTypeId.PleaseSelect)
            this.setFilter()
        },
        removeCriterial(iic) { this.Criterials.splice(iic, 1) },
    },
}

const FCriterial = {
    template: `#tmp-comp-criterial`,
    mixins: [MxFCriterial],
    emits: ['set:operator'],
    props: {
        operator: Number,
    },
    data() {
        return {
            iOperator: this.operator < 0 ? 0 : this.operator
        }
    },
    computed: {
        operators() {
            if (this.index < 1) return [this.$store.getters.txtLang.FilterBy]
            return [
                this.$store.getters.txtLang.And,
                this.$store.getters.txtLang.Or,
            ]
        },
        clssOperator() {
            if (this.index < 1) return 'grp-dropdown-min disabled'
            return 'grp-dropdown-min'
        },
        SrcTypes() {
            const lst = []
            let lName = this.$store.getters.txtLang.PleaseSelect
            lst.push({ Id: FTypeId.PleaseSelect, Name: lName })
            lName = `${this.$store.getters.txtLang.Land}/`
            lName += `${this.$store.getters.txtLang.Region}`
            lst.push({ Id: FTypeId.Land_Region, Name: lName })
            lName = `${this.$store.getters.txtLang.ProductGroups}/`
            lName += `${this.$store.getters.txtLang.Product}`
            lst.push({ Id: FTypeId.ProductGroups_Product, Name: lName })
            lName = `${this.$store.getters.txtLang.Submarkets}/`
            lName += `${this.$store.getters.txtLang.ContactPerson}`
            lst.push({ Id: FTypeId.Submarkets_ContactPerson, Name: lName })
            lName = `${this.$store.getters.txtLang.Marketsegments}/`
            lName += `${this.$store.getters.txtLang.Submarkets}`
            lst.push({ Id: FTypeId.MarketSegments_Submarket, Name: lName })
            return lst
        },
        ItemSelectAll() {
            return {
                Id: FTypeId.SelectAll,
                Name: this.$store.getters.txtFilter(FTypeId.SelectAll)
            }
        },
    },
    methods: {
        selectOperator(index) {
            index = parseInt(index)
            this.iOperator = index
            this.$emit('set:operator', index)
        },
        selectTypeId(index) {
            const fId = commSelectTypeId.call(this, index)
            switch (fId) {
                case FTypeId.Land_Region:
                    this.ids.push(FTypeId.SelectAll)
                    this.ids.push(FTypeId.SelectAll)
                    break;
                default: break;
            }
        },
        selectId(ii, index) {
            index = parseInt(index)
            const item = this.getSrcId(ii)[index]
            if (!item) return;

            const id = item.Id
            const lstId = this.ids
            lstId.splice(ii, 1, id)
            switch (this.filterType) {
                case FTypeId.Land_Region:
                    for (let j = ii + 1; j < lstId.length; j++) {
                        lstId.splice(j, 1, 0)
                    }
                    break;
                case FTypeId.PleaseSelect:
                    break;
            }
            this.$emit('set:ids', lstId)
        },
        getSrcId(ii) {
            let lst = []
            switch (this.filterType) {
                case FTypeId.Land_Region:
                    lst.push(this.ItemSelectAll)
                    if (0 == ii) return [...lst, ...this.$store.getters.LandsBy([0])]
                    if (1 == ii) {
                        const idLeft = this.ids[ii - 1]
                        if (idLeft < 0) return lst
                        const regions = this.$store.state.Regions
                        for (let rr = 0; rr < regions.length; rr++) {
                            const region = regions[rr]
                            if (0 == idLeft) {
                                lst.push(region)
                            }
                            else if (idLeft == region.LandId) {
                                lst.push(region)
                            }
                        }
                        return lst
                    }
                case FTypeId.MarketSegments:

                    break;
                default: break;
            }
            return []
        },
    },
}
export const MsFilter = {
    template: `#tmp-comp-filter`,
    components: {
        'comp-criterial': FCriterial,
    },
    props: {
        pageType: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            Criterials: [
                [KeyOperator.FilterBy, FTypeId.PleaseSelect, []],    // [Operator, Type, Ids]
            ],


        }
    },
    computed: {

    },
    methods: {
        addFilter(e) {
            this.Criterials.push([KeyOperator.And, FTypeId.PleaseSelect, []])
        },
        setOperator(ii, val) {
            const crts = this.Criterials[ii]
            crts[0] = val
        },
        setTypeF(ii, val) {
            const crts = this.Criterials[ii]
            crts[1] = val
        },
        setIds(ii, ids) { this.Criterials[ii].splice(2, 1, ids) },
    },
}