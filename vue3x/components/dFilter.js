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
export const MsFilter = {
    template: `#tmp-comp-filter`,
    components: {
        'comp-criterial': MsCriterial
    },
    props: {
        pageType: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            indexType: 0
        }
    },
    computed: {
        ListType() {
            const lst = []
            switch (this.pageType) {
                case 1:
                    let lName = this.$store.getters.txtLang.PleaseSelect
                    lst.push({ Id: FTypeId.PleaseSelect, Name: lName })
                    lName = `${this.$store.getters.txtLang.Land}/`
                    lName += `${this.$store.getters.txtLang.Region}`
                    lst.push({ Id: FTypeId.Land_Region, Name: lName })
                    lName = this.$store.getters.txtLang.Marketsegments
                    lst.push({ Id: FTypeId.MarketSegments, Name: lName })
                    break;
                default: break;
            }
            return lst
        },
    },
    methods: {
        selectLand(id) {

        },
        selectType(index) { this.indexType = parseInt(index) },
    },
}