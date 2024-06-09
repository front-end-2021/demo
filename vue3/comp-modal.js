import dnbStore from './main-store.js'
const { onUpdated } = Vue
export default {
    template: `#tmp-app-modal`,
    computed: {
        MItem() { return this.$root.MItem },
    },
    methods: {
        onExitClose() {
            $(this.$el).modal('hide')
            this.$root.onExitClose()
        },
        onSaveClose() {
            $(this.$el).modal('hide')
            this.$root.onSaveClose()
        },
    },
    mounted() {
        $(this.$el).modal('show')
    },
}