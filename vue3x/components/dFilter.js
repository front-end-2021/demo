
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
            let lName
            switch (this.$root.IndexPage) {
                case 0:
                    lName = this.$store.getters.txtLang.PleaseSelect
                    lst.push({ Id: FTypeId.PleaseSelect, Name: lName })
                    lName = `${this.$store.getters.txtLang.Land}/`
                    lName += `${this.$store.getters.txtLang.Region}`
                    lst.push({ Id: FTypeId.Land_Region, Name: lName })
                    lName = this.$store.getters.txtLang.Marketsegments
                    lst.push({ Id: FTypeId.MarketSegments, Name: lName })
                    break;
            }
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
                    return [this.ItemSelectLand, ...this.$store.state.Lands]
                case FTypeId.MarketSegments:
                    return [this.ItemSelectMarket, ...this.$store.state.Markets]
                default: break;
            }
            return []
        },
    },
}
const FCriterialMarket = {
    template: `#tmp-comp-criterial-market`,
    mixins: [MxFCriterial],
    computed: {
        SrcTypes() {
            const lst = []
            let lName
            switch (this.$root.IndexPage) {
                case 0:
                    lName = this.$store.getters.txtLang.PleaseSelect
                    lst.push({ Id: FTypeId.PleaseSelect, Name: lName })
                    lName = `${this.$store.getters.txtLang.Land}/`
                    lName += `${this.$store.getters.txtLang.Region}`
                    lst.push({ Id: FTypeId.Land_Region, Name: lName })
                    lName = this.$store.getters.txtLang.Marketsegments
                    lst.push({ Id: FTypeId.MarketSegments, Name: lName })
                    break;
            }
            return lst
        },
        ItemSelectLand() {
            return {
                Id: FTypeId.SelectLand,
                Name: this.$store.getters.txtFilter(FTypeId.SelectLand)
            }
        },
        ItemSelectMarket() {
            return {
                Id: FTypeId.SelectMarketSegments,
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
            switch (this.filterType) {
                case FTypeId.Land_Region:
                    return [this.ItemSelectLand, ...this.$store.state.Lands]
                case FTypeId.MarketSegments:
                    return [this.ItemSelectMarket, ...this.$store.state.Markets]
                default: break;
            }
            return []
        },
    },
}
export const MsFilterMarket = {
    template: `#tmp-comp-filter-market`,
    components: {
        'comp-criterial-market': FCriterialMarket,
    },
    data() {
        return {
            Criterials: [
                [FTypeId.PleaseSelect, []],    // [Type, Ids]
            ],
        }
    },
    methods: {
        setTypeF(ii, val) {
            const crts = this.Criterials[ii]
            crts[0] = val
        },
        setIds(ii, ids) {
            const crts = this.Criterials[ii]
            crts.splice(1, 1, ids)
        },
        addFilter(e) { this.Criterials.push([FTypeId.PleaseSelect, []]) },
    },
}
const FCriterial = {
    template: `#tmp-comp-criterial`,
    mixins: [MxFCriterial],
    //inject: [''],
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
            let lName
            switch (this.$root.IndexPage) {
                case 0:
                    lName = this.$store.getters.txtLang.PleaseSelect
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
                    break;
            }
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
                    if (0 == ii) return [...lst, ...this.$store.state.Lands]
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
        setIds(ii, ids) {
            const crts = this.Criterials[ii]
            crts.splice(2, 1, ids)
        },
    },
    provide() {
        return {


        }
    },
}