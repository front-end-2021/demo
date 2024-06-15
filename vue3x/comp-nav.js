
export default {
    template: `#tmp-comp-nav`,
    computed: {
        count() { return this.$store.getters.count }
    },
    methods: {
        upCount() {
            this.$store.dispatch('increment').then(a => {
                //  console.log(a)
            })
        },
        resetCount() { this.$store.dispatch('resetCount') },
    },
}