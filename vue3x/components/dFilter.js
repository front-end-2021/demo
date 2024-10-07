
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
    SelectRegion: -30,
}
const KeyOperator = {
    FilterBy: -1,
    And: 0,
    Or: 1
}
export const commSelectTypeId = (comp, index) => {
    index = parseInt(index)
    let item = comp.SrcTypes[index]
    if (!item) return
    const fId = item.Id
    comp.$emit('set:typef', fId)
    comp.ids.splice(0)
    return fId
}
export const MxFCriterial = {
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
            let lName = this.$store.state.ContextLang.PleaseSelect
            lst.push({ Id: FTypeId.PleaseSelect, Name: lName })
            lName = `${this.$store.state.ContextLang.Land}/`
            lName += `${this.$store.state.ContextLang.Region}`
            lst.push({ Id: FTypeId.Land_Region, Name: lName })
            lName = this.$store.state.ContextLang.Marketsegments
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
                    return [this.ItemSelectLand, ...this.$store.getters.SortedItems([1, [0], []])]
                case FTypeId.MarketSegments:
                    return [this.ItemSelectMarket, ...this.$store.getters.SortedItems([2, [0], []])]
                case FTypeId.Region:
                    return [this.ItemSelectMarket, ...this.$store.getters.SortedItems([2, [0], []])]
                default: break;
            }
            return []
        },
    },
}

export const getLandMarketIds = (lstC, outputType) => {
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
    switch (outputType) {
        case 'land': return landIds;
        case 'market': return marketIds;
        default: break;
    }
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
            if (this.index < 1) return [this.$store.state.ContextLang.FilterBy]
            return [
                this.$store.state.ContextLang.And,
                this.$store.state.ContextLang.Or,
            ]
        },
        clssOperator() {
            if (this.index < 1) return 'grp-dropdown-min disabled'
            return 'grp-dropdown-min'
        },
        SrcTypes() {
            const lst = []
            let lName = this.$store.state.ContextLang.PleaseSelect
            lst.push({ Id: FTypeId.PleaseSelect, Name: lName })
            lName = `${this.$store.state.ContextLang.Land}/`
            lName += `${this.$store.state.ContextLang.Region}`
            lst.push({ Id: FTypeId.Land_Region, Name: lName })
            lName = `${this.$store.state.ContextLang.ProductGroups}/`
            lName += `${this.$store.state.ContextLang.Product}`
            lst.push({ Id: FTypeId.ProductGroups_Product, Name: lName })
            lName = `${this.$store.state.ContextLang.Submarkets}/`
            lName += `${this.$store.state.ContextLang.ContactPerson}`
            lst.push({ Id: FTypeId.Submarkets_ContactPerson, Name: lName })
            lName = `${this.$store.state.ContextLang.Marketsegments}/`
            lName += `${this.$store.state.ContextLang.Submarkets}`
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
            const fId = commSelectTypeId(this, index)
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
                    if (0 == ii) return [...lst, ...this.$store.getters.SortedItems([1, [0], []])]
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