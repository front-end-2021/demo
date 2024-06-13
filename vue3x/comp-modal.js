import dnbStore from './main-store.js'

const CompModal = {
    template: `#tmp-app-modal`,
    data() {
        return {
            MItem: JSON.parse(JSON.stringify(dnbStore.getters.modal))
        }
    },
    methods: {
        onExitClose() {
            $(this.$el).modal('hide')
            const onCancel = () => {
                console.log('on cancel')
            }
            this.$root.onCloseModal(null, onCancel)
        },
        onSaveClose() {
            $(this.$el).modal('hide')
            const onOk = () => {
                console.log('on ok')
            }
            this.$root.onCloseModal(onOk)
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
        OriginItem() { return dnbStore.getters.modal },
    },
    methods: {
        onCloseModal(fncOk, fncCancel) {
            if (typeof fncOk == 'function') {
                fncOk(this.OriginItem)
            }
            if (typeof fncCancel == 'function') {
                fncCancel(this.OriginItem)
            }
            dnbStore.commit('setModal', null)
        },
    },
}