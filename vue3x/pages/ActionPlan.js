
export default {
    template: `#tmp-comp-action-plan`,
    // components: {

    // },
    data() {
        return {

        }
    },
    methods: {
        setUserAssign(valIndex) {
            valIndex = parseInt(valIndex)
            this.$root.UserAssign = this.$root.Users[valIndex]
        },

    }
}