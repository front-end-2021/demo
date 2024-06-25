
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
    // computed: {
       
    // },
    methods: {
        isActive(ii){
            if(typeof this.name == 'string'){
                return -1 < this.items.indexOf(this.name);
            }
            if(typeof this.index == 'number') {
                return ii == this.index
            }
            if(typeof this.fId == 'number') {
                return this.items[ii].Id == this.fId
            }
        },
        itemName(ii){
            if(typeof this.name == 'string'){
                return this.items[ii]
            }
            if(typeof this.index == 'number') {
                return this.items[ii].Name
            }
            if(typeof this.fId == 'number') {
                return this.items[ii].Name
            }
        },
    },
    //watch: {
        // index(val) { },
    //},
}