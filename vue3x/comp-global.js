
export const DropSelect = {
    template: `#tmp-comp-drop-select`,
    props: ['items', 'index'],
    emits: ['set:index'],
    mounted() {
        const changeDrp = (value, text, $selectedItem) => {
            this.$emit('set:index', value)
        }
        $(this.$el).dropdown({
            onChange: changeDrp
        })
    },
}