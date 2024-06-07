import dnbStore from './main-store.js'
export default {
    computed: {
        count() { return dnbStore.getters.count }
    },
    template: `#tmp-comp-nav`,
    methods: {
        upCount() {
            dnbStore.dispatch('increment').then(a => {
                console.log(a)
            })
        },
        resetCount() { dnbStore.commit('resetCount') }
    },
}