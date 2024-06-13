import dnbStore from './main-store.js'
export default {
    template: `#tmp-comp-nav`,
    computed: {
        count() { return dnbStore.getters.count }
    },
    methods: {
        upCount() {
            dnbStore.dispatch('increment').then(a => {
                //  console.log(a)
            })
        },
        resetCount() { dnbStore.dispatch('resetCount') },
    },
}