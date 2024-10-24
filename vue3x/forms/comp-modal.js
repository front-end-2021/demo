import { deepCopy } from '../common.js'
import { MxDropSelect } from '../components/comp-global.js'
const MxModal = {
    props: {
        moItem: Object
    },
    mounted() {
        const $modal = $(this.$el)
        $modal.modal({
            closable: false
        })
        $modal.modal('show')
    },
    methods: {
        hideModal() { $(this.$el).modal('hide') },
    },
}
export const CompModal = {
    template: `#tmp-comp-modal`,
    mixins: [MxModal],
    data() {
        const mit = deepCopy(this.moItem.data)
        return {
            item: mit,
        }
    },
    methods: {
        onExitClose() {
            this.hideModal()
            this.$store.commit('outModal', ['exit-close', deepCopy(this.item)])
        },
        onSaveClose() {
            this.hideModal()
            this.$store.commit('outModal', ['save-close', deepCopy(this.item)])
        },
        onChangeDes(e) {
            this.item.content.description = e.target.innerHTML
        },
    },
}
const MxFormLandRegion = {
    data() {
        const oItem = this.moItem.data
        return {
            item: oItem,
            name: oItem.Name,
            des: oItem.Description,
        }
    },
    computed: {
        Title() { return this.moItem.title }
    },
    methods: {
        setNameAndDes() {
            this.item.Name = this.name.trim()
            let des = this.des.replaceAll(`&nbsp;`, ' ')
            des = des.replaceAll(`<br>`, `\n`)
            this.item.Description = des.trim()
        },
        onExitClose() {
            this.setNameAndDes()
            this.hideModal()
            this.$store.commit('outModal', ['exit-close', this.item])
        },
        onSaveClose() {
            this.setNameAndDes()
            this.hideModal()
            this.$store.commit('outModal', ['save-close', this.item])
        },
        onChangeName(e) { this.name = e.target.innerText },
        onKeyPressName(e) {
            if (e.which === 13) {
                e.preventDefault(); // prevent enter
            }
        },
        onChangeDes(e) { this.des = e.target.innerHTML },
    },
}
export const CompFormLand = {
    template: `#tmp-comp-form-land`,
    mixins: [MxModal, MxFormLandRegion]
}
export const CompFormValuation = {
    template: `#tmp-comp-form-valuation`,
    mixins: [MxModal],
    data() {
        const valuation = this.moItem.data
        return {
            item: valuation,
            comment: valuation.Comment
        }
    },
    computed: {
        Weights() {
            const lst = []
            for (let ii = 10; -1 < ii; ii--) lst.push(ii);
            return lst;
        },
        TotalValue() {
            if (!this.item.Criterias.length) return
            const lstCrt = this.item.Criterias.map(x => x.Value * x.Weight)
            const sum = lstCrt.reduce((a, b) => a + b, 0)
            return Math.round(sum / lstCrt.length)
        },
    },
    methods: {
        onSaveClose() {
            $(this.$el).modal('hide')
            const regex = /<br>/g;
            this.item.Comment = this.comment.replace(regex, '\n')
            this.$store.commit('outModal', ['save-close', this.item])
        },
        deleteCriteria(ii) { this.item.Criterias.splice(ii, 1) },
        setWeight(item, index) {
            const val = this.Weights[index]
            item.Weight = val
        },
        setValue(item, value) { item.Value = parseInt(value) },
        newCriteria() {
            this.item.Criterias.push({
                Name: this.$store.state.ContextLang.Criteria,
                Weight: 0, Value: 0

            })
        },
        editComment(e) { this.comment = e.target.innerHTML },
        toggleActive() { this.item.Active = !this.item.Active }
    },
    //mounted() { },
}
export const CompMessNewLand = {
    template: `#tmp-comp-mess-newland`,
    mixins: [MxModal],
    methods: {
        onExitClose() {
            $(this.$el).modal('hide')
            this.$store.commit('outModal', ['exit-close', undefined])
        },
        onSaveClose() {
            $(this.$el).modal('hide')
            this.$store.commit('outModal', ['save-close', undefined])
        },
    },
}
const MxMarketRegion = {
    computed: {
        LandActives() {
            let landIds = this.moItem.landActiveIds
            return this.$store.getters.SortedItems([1, landIds, []])
        },
        LandActiveName() {
            const id = this.moItem.data.LandId
            const land = this.LandActives.find(x => x.Id == id)
            if (land) return land.Name
            return `Please Select`
        },
    },
    methods: {
        setLandInActive(ii) {
            ii = parseInt(ii)
            let land = this.LandActives[ii]
            if (!land) land = this.LandActives[0]
            this.moItem.data.LandId = land.Id
        },
        forcusName(){
            this.$el.querySelector(`.dnbRegionName`).focus()
        },
    },
    mounted() {
        console.log('mounted form region ,mix')
        this.$nextTick(() => {
            const drp = this.$el.querySelectorAll(`.ui.selection.dropdown.grp-dropdown-min.active.visible`)
            console.log('next tick mounted form region', drp)
           // this.$el.querySelector(`.dnbRegionName`).focus()

        })
    },
    updated() {
      //  console.log('upated')
    },
}
export const CompFormMarket = {
    template: `#tmp-comp-form-region`,
    mixins: [MxModal, MxFormLandRegion, MxMarketRegion],
    methods: {
        onExitClose() {
            this.setNameAndDes()
            this.$store.dispatch('outConfirmModal', ['exit-close', deepCopy(this.item),
                this.$el.querySelector('.dnbRegionName')
            ]).then(state => {
                if (typeof state == 'boolean') return;
                if (typeof state != 'object') return;
                state.Modals.pop()
                this.hideModal()
            })
        },
        onSaveClose() {
            this.setNameAndDes()
            this.$store.dispatch('outConfirmModal', ['save-close', deepCopy(this.item),
                this.$el.querySelector('.dnbRegionName')
            ]).then(state => {
                if (typeof state == 'boolean') return;
                if (typeof state != 'object') return;
                state.Modals.pop()
                this.hideModal()
            })
        },
    },
}
const DropRgn = {
    template: `#tmp-comp-drop-select`,
    mixins: [MxDropSelect],
    inject: ['setListDrp' ],
    mounted() {
        const onChange = (value, text, $selectedItem) => {
            this.$emit('set:index', value)
        }
        const onShow = () => {
            console.log(' onshow')
        }
        $(this.$el).dropdown({
            onChange,
            onShow
        })
        this.setListDrp(this)
    },
}
export const CompFormRegion = {
    template: `#tmp-comp-form-region`,
    mixins: [MxModal, MxFormLandRegion, MxMarketRegion],
    components: {
        'drop-rselect': DropRgn,
    },
    data(){
        return {
            ListDrp: []
        }
    },
    computed: {
        Currencies() {
            return ['CHF', 'USD', 'VND']
        },
    },
    methods: {
        setCurrency(value) {
            this.moItem.data.Currency = this.Currencies[value]
        },
    },
    provide(){
        return {
            setListDrp: (drpCmp) => {
                let ii = this.ListDrp.findIndex(x => Object.is(x, drpCmp))
                if(ii < 0) this.ListDrp.push(drpCmp)
                else {
                    
                }
                if(2 == this.ListDrp.length) {
                    this.$nextTick(() => {
                        this.$el.querySelector(`.dnbRegionName`).focus()
                        console.log('set list drop ')
                    })
                }
            },
        }
    },
    mounted() {
        console.log('mounted form region')
        
    },
}