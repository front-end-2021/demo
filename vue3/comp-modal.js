import dnbStore from './main-store.js'
const { onUpdated } = Vue
export default {
    template: `#tmp-app-modal`,
    data(){
        return {
            MItem: JSON.parse(JSON.stringify(this.$root.OriginItem))
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