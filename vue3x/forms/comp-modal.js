import { deepCopy } from '../common.js'
const MxModal = {
    mounted() {
        const $modal = $(this.$el)
        $modal.modal({
            closable: false
        })
        $modal.modal('show')
    },
}
export const CompModal = {
    template: `#tmp-comp-modal`,
    mixins: [MxModal],
    data() {
        const mit = deepCopy(this.$store.getters.moItem.data)
        return {
            MItem: mit,
        }
    },
    methods: {
        onExitClose() {
            $(this.$el).modal('hide')
            this.$store.commit('outModal', ['exit-close', deepCopy(this.MItem)])
        },
        onSaveClose() {
            $(this.$el).modal('hide')
            this.$store.commit('outModal', ['save-close', deepCopy(this.MItem)])
        },
        onChangeDes(e) {
            this.MItem.content.description = e.target.innerHTML
        },
    },
}
export const CompFormLand = {
    template: `#tmp-comp-form-land`,
    mixins: [MxModal],
    data() {
        const land = this.$store.getters.moItem.data
        return {
            item: land,
            name: land.Name,
            des: land.Description
        }
    },
    computed: {
        Title() { return this.$store.getters.moItem.title }
    },
    methods: {
        onExitClose() {
            this.item.Name = this.name
            this.item.Description = this.des
            $(this.$el).modal('hide')
            this.$store.commit('outModal', ['exit-close', this.item])
        },
        onSaveClose() {
            this.item.Name = this.name
            this.item.Description = this.des
            $(this.$el).modal('hide')
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
export const CompFormValuation = {
    template: `#tmp-comp-form-valuation`,
    mixins: [MxModal],
    data() {
        const valuation = this.$store.getters.moItem.data
        return {
            item: valuation,
            comment: valuation.Comment
        }
    },
    computed: {
        Weights() {
            const lst = []
            for (let ii = 10; -11 < ii; ii--) lst.push(ii);
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
                Name: this.$store.getters.txtLang.Criteria,
                Weight: 0, Value: 0

            })
        },
        editComment(e) { this.comment = e.target.innerHTML },
        toggleActive() { this.item.Active = !this.item.Active }
    },
    mounted() {
        $('#range-0').range({
            min: 0,
            max: 10,
            start: 5,
            labelType: 'letter'
        });
    },
}
export const CompMessNewLand = {
    template: `#tmp-comp-mess-newland`,
    mixins: [MxModal],
}