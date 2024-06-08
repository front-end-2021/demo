const mxDashboard = {
    data() {
        return {
            ExpandIds: [],
            NewItems: [],
        }
    },
    provide() {
        return {
            onChange: this.onChange,
        }
    },
    methods: {
        toggleCollapse(id) {
            const ii = this.ExpandIds.indexOf(id)
            if (ii < 0) this.ExpandIds.push(id)
            else this.ExpandIds.splice(ii, 1)
        },
        showExpand(id) { return this.ExpandIds.includes(id) },
        onChange() {
            DnbVxStore.dispatch('runFncFilters', (f) => { f.setDataSource() })
        },
        onChangeId(e, item, type) { },
        newItem(ii) {
            const nItem = this.NewItems[ii]
            if (!nItem) return
            if (nItem.Name.trim() == '') return
            switch (ii) {
                case 0: {
                    DnbVxStore.dispatch('pushLand', Object.assign({}, nItem)).then(lands => {
                        updateNewItem(lands)
                    })
                    break;
                }
                case 1: {
                    DnbVxStore.dispatch('pushRegion', Object.assign({}, nItem)).then(regions => {
                        updateNewItem(regions)
                    })
                    break;
                }
            }
            DnbVxStore.dispatch('runFncFilters', (f) => { f.setDataSource() })
            function updateNewItem(arr) {
                nItem.Id = getMaxFrom(arr.map(x => x.Id)) + 1
                nItem.Name = ''
            }
        }
    },
}
Vue.component('full-dashboard', {
    template: '#temp-dashboard',
    mixins: [mxDashboard],
    computed: {
        Lands() { return DnbVxStore.getters.getLands([0]) },
        Regions() { return DnbVxStore.getters.getRegions([0]) },
        ProductGroups() { return DnbVxStore.getters.getPGroups() },
        Products() { return DnbVxStore.getters.getProducts() },
        SubProducts() { return DnbVxStore.getters.getSubPrdcts() },
        MarketSegments() { return DnbVxStore.getters.getMktSegments() },
        StakeholderGroups() { return DnbVxStore.getters.getSubMarkets() },
        Goals() { return DnbVxStore.getters.getGoals() },
        Activities() { return DnbVxStore.getters.getActivities() },
        MinLandId() {
            const ids = this.Lands.map(x => x.Id)
            return getMinFrom(ids)
        },
        MaxLandId() {
            const ids = this.Lands.map(x => x.Id)
            return getMaxFrom(ids)
        },
        MinGoalId() {
            const ids = this.Goals.map(x => x.Id)
            return getMinFrom(ids)
        },
        MaxGoalId() {
            const ids = this.Goals.map(x => x.Id)
            return getMaxFrom(ids)
        },
    },
    beforeMount() {
        const landIds = this.Lands.map(x => x.Id)
        let minId = getMinFrom(landIds)
        let maxId = getMaxFrom(landIds)
        this.NewItems.push({ Id: maxId + 1, Name: '' })    // Land

        maxId = getMaxFrom(this.Regions.map(x => x.Id))
        this.NewItems.push({ Id: maxId + 1, Name: '', LandId: minId })    // Region

        maxId = getMaxFrom(DnbVxStore.getters.getPGroups().map(x => x.Id))
        this.NewItems.push({ Id: maxId + 1, Name: '', RegionIds: [] })    // Product Group
    },
})
Vue.component('filter-dashboard', {
    template: '#temp-dashboard',
    mixins: [mxDashboard],
    computed: {
        Lands() {
            const filter = DnbVxStore.getters.getFilterIds(0)
            return DnbVxStore.getters.getLands(filter.LandIds)
        },
        Regions() {
            const filter = DnbVxStore.getters.getFilterIds(0)
            return DnbVxStore.getters.getRegions(filter.RegionIds)
        },
        ProductGroups() {
            return DnbVxStore.getters.getPGroups()
        },
        Products() {
            const filter = DnbVxStore.getters.getFilterIds(0)
            return DnbVxStore.getters.getProducts(filter.ProductIds)
        },
        SubProducts() { return DnbVxStore.getters.getSubPrdcts() },
        MarketSegments() {
            const filter = DnbVxStore.getters.getFilterIds(0)
            return DnbVxStore.getters.getMktSegments(filter.MarketIds)
        },
        StakeholderGroups() {
            const filter = DnbVxStore.getters.getFilterIds(0)
            return DnbVxStore.getters.getSubMarkets(filter.SubmarketIds)
        },
        Goals() { return DnbVxStore.getters.getGoalByFids(0) },
        Activities() {
            const isFull = DnbVxStore.getters.getGoals().length === this.Goals.length
            if (isFull) return DnbVxStore.getters.getActivities()
            return DnbVxStore.getters.getActivities(this.Goals.map(x => x.Id))
        },
        MinLandId() { return 0 },
        MaxLandId() { return 0 },
        MinGoalId() { return 0 },
        MaxGoalId() { return 0 },
    },
    methods: {
        onChangeId(e, item, type) {
            this.$root.onChangeId(e, item, type)
        },
    },
})
function getMaxFrom(arr) { return arr.reduce((a, b) => Math.max(a, b), -Infinity); }
function getMinFrom(arr) { return arr.reduce((a, b) => Math.min(a, b), Infinity); }