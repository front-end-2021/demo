// import { ref } from 'vue'
// export default {
//     setup() {
//         const count = ref(0)
//         return { count }
//     },
//     template: `#tmp-comp-nav`,
// }
const { ref } = Vue
const { createStore } = Vuex
const store = createStore({
    state: {
        count: -1,
        message: 'Hello world'
    },

    getters: {
        cCount(state) { return state.count }
    },
    mutations: {
        increment(state) {
            state.count++
        }
    }
});
const CompNav = {
    computed: {
        count() { return store.getters.cCount }
    },
    template: `#tmp-comp-nav`,
    methods: {
        upCount() { store.commit('increment') },
    },
}