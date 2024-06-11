
export const DropSelect = {
    template: `#tmp-comp-drop-select`,
    props: ['items', 'index', 'type'],
    inject: ['setIndex'],
    mounted() {
        const onChangeUser = (value, text, $selectedItem) => {
            let newVal = value
            switch (this.type) {
                case '1': newVal = parseInt(value);
                    break;
                default: break;
            }
            this.setIndex(newVal, this.type)
        }
        $(this.$el).dropdown({
            onChange: onChangeUser
        })
    },
}
