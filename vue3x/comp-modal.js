import dnbStore from './main-store.js'
import { deepCopy } from './common.js'

const CompModal = {
    template: `#tmp-comp-modal`,
    data() {
        const mit = deepCopy(dnbStore.getters.moItem)
        return {
            MItem: mit,
        }
    },
    methods: {
        onExitClose() {
            $(this.$el).modal('hide')
            dnbStore.commit('outModal', ['exit-close', deepCopy(this.MItem)])
        },
        onSaveClose() {
            $(this.$el).modal('hide')
            dnbStore.commit('outModal', ['save-close', deepCopy(this.MItem)])
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
        OItem() { return dnbStore.getters.moItem },
    },
    methods: {

    },
}