import { deepCopy } from './common.js'

const CompModal = {
    template: `#tmp-comp-modal`,
    data() {
        const mit = deepCopy(this.$store.getters.moItem)
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
    mounted() {
        $(this.$el).modal('show')
    },
}
export const AppModal = {
    name: `app-modal`,
    components: {
        'comp-modal': CompModal
    },
    computed: {
        // #region trace dev
        OItem() { return this.$store.getters.moItem },
       // #endregion
    },
    methods: {

    },
}