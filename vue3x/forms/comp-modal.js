import { deepCopy } from '../common.js'
const MxModal = {
    mounted() {
        $(this.$el).modal('show')
    },
}
const CompModal = {
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
const CompFormLand = {
    template: `#tmp-comp-form-land`,
    mixins: [MxModal],
    data() {
        return {
            item: this.$store.getters.moItem.data
        }
    },
    methods: {
        onExitClose() {
            // $(this.$el).modal('hide')
            // this.$store.commit('outModal', ['exit-close', deepCopy(this.MItem)])
        },
        onSaveClose() {
            // $(this.$el).modal('hide')
            // this.$store.commit('outModal', ['save-close', deepCopy(this.MItem)])
        },
        onChangeDes(e) {
            this.item.Description = e.target.innerHTML
        },
    },
}
export const AppModal = {
    name: `app-modal`,
    components: {
        'comp-modal': CompModal,
        'comp-form-land': CompFormLand
    },
    computed: {
        // #region trace dev
        OItem() { return this.$store.getters.moItem },
        // #endregion
    },
    methods: {

    },
}