
export const DropSelect = {
    template: `#tmp-comp-drop-select`,
    props: {
        items: Array,
        index: Number,
        fId: Number,
        name: String,
    },
    emits: ['set:index'],
    mounted() {
        const changeDrp = (value, text, $selectedItem) => {
            this.$emit('set:index', value)
        }
        $(this.$el).dropdown({
            onChange: changeDrp
        })
    },
    // computed: { },
    methods: {
        isActive(ii) {
            if (typeof this.name == 'string') {
                return -1 < this.items.indexOf(this.name);
            }
            if (typeof this.index == 'number') {
                return ii == this.index
            }
            if (typeof this.fId == 'number') {
                return this.items[ii].Id == this.fId
            }
        },
        itemName(ii) {
            if (typeof this.name == 'string') {
                return this.items[ii]
            }
            if (typeof this.index == 'number') {
                return this.items[ii].Name
            }
            if (typeof this.fId == 'number') {
                return this.items[ii].Name
            }
        },
    },

}
export const SRange = {
    template: `#tmp-comp-s-range`,
    props: {
        min: {
            type: Number,
            default: -10
        },
        max: {
            type: Number,
            default: 10
        },
        start: Number,
        labelType: {
            type: String,
            default: 'number'//'letter
        },
        step: {
            type: Number,
            default: 1
        },
        style: {
            type: Object,
            default: { width: '120px' }
        }
    },
    emits: ['set:value'],
    //methods: {},
    mounted() {
        const min = this.min,
            max = this.max,
            start = this.start;
        let labelType = this.labelType
        const onChange = (value) => {
            this.$emit('set:value', value)
        }
        this.$nextTick(function () {
            $(this.$el).range({
                min, max, start, labelType,
                onChange
            });
        })
    },
    //beforeUnmount() { },
}