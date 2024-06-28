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
            isActive: true,
        }
    },
    methods: {
        onSaveClose() {
            $(this.$el).modal('hide')
            this.$store.commit('outModal', ['save-close', this.item])
        },

    },
}