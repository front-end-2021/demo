
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
    MarketSegments: -25
}
const KeyOperator = {
    FilterBy: 0,
    And: 1,
    Or: 2
}
const MsCriterial = {
    template: `#tmp-comp-criterial`,
    props: {
        initView: {
            type: Array,
            default: [-1, 1, 0] // operator, type, ids
            // -1 (hide), 0 (hide/show), 1 (show), 2 (disable)
        },
        initOperator: {
            type: Object,
            default: {
                index: 0,
                items: []   // [name, name, ...]
            }
        },
        initType: {
            type: Object,
            default: {
                index: 0,
                items: []   // [name, name, ...]
            }
        },
        initIds: Array,
        sources: Array
    },
    emits: ['select:type'],
    computed: {
        IsShowIds() {
            if (0 < this.initView[2]) return true
            if (this.initView[2] < 0) return false
            return this.initView[2] < 0
        }
    },
    methods: {
        getIndex(id, iii) {
            return this.sources[iii].findIndex(x => id == x.Id)
        },
        selectOperator(index) { },
        selectId(id, iii) {
            // this.initIds[iii] = parseInt(id)
            // 
        },
    },
}
const FCriterial = {
    template: `#tmp-fcriterial`,
    props: {
        operator: Number,
        filterType: Number,
        ids: {
            type: Array,
            default: []
        }
    },
    data() {
        let iOperator = this.operator
        let typeId = this.filterType
        return {
            iOperator,
            typeId,
            listId: this.ids
        }
    },
    computed: {
        operators() {
            return [
                this.$store.getters.txtLang.FilterBy,
                this.$store.getters.txtLang.And,
                this.$store.getters.txtLang.Or,
            ]
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
                    lName = this.$store.getters.txtLang.Marketsegments
                    lst.push({ Id: FTypeId.MarketSegments, Name: lName })
                    break;
            }
            return lst
        },
        clssOperator() {
            if (this.operator < 1) return 'grp-dropdown-min disabled'
            return 'grp-dropdown-min'
        },
        TypeSelectName() {
            let xt = this.SrcTypes.find(x => x.Id == this.typeId)
            if (xt) return xt.Name
            return ''
        },

    },
    methods: {
        selectOperator(oVal) { this.iOperator = parseInt(oVal) },
        selectTypeId(type) {
            type = parseInt(type)
            this.typeId = type
            this.listId.splice(0)
            switch (type) {
                case FTypeId.Land_Region:
                    if (!this.listId.length) {
                        this.listId.push(FTypeId.SelectAll)
                        //if(0 == this.$root.IndexPage)
                            this.listId.push(FTypeId.SelectAll)
                    }
                    break;
                default: break;
            }
        },
        selectId(ii, id) {
            this.listId[ii] = parseInt(id)
            switch (this.typeId) {
                case FTypeId.Land_Region:
                    if(0 < ii) break;
                    if (this.listId.length - 1 === ii) {
                        this.listId.push(FTypeId.SelectAll)
                    }
                    break;
                case FTypeId.PleaseSelect:
                    break;
            }
        },
        idSelectName(ii) {
            let item = this.getSrcId(ii)
            if (item) item.Name
            return ''
        },
        getSrcId(ii) {
            let lst = []
            switch (this.typeId) {
                case FTypeId.Land_Region:
                    lst.push({
                        Id: FTypeId.SelectAll,
                        Name: this.$store.getters.txtLang.SelectAll
                    })
                    if (0 == ii) return [...lst, ...this.$store.state.Lands]
                    if (1 == ii) {
                        const idLeft = this.listId[ii - 1]
                        if (idLeft < 0) return lst
                        for (let rr = 0; rr < this.$store.state.Regions.length; rr++) {
                            const region = this.$store.state.Regions[rr]
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
        'comp-criterial': MsCriterial,
        'f-criterial': FCriterial
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

            indexType: 0
        }
    },
    computed: {

    },
    methods: {
        selectLand(id) {

        },
        selectType(index) { this.indexType = parseInt(index) },
    },
}