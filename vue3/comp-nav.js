// import { ref } from 'vue'
// export default {
//     setup() {
//         const count = ref(0)
//         return { count }
//     },
//     template: `#tmp-comp-nav`,
// }
const { createStore } = Vuex
const store = createStore({
    state: {
        count: -1,
        message: 'Hello world'
    },

    getters: {
        count(state) { return state.count },
        message(state) { return state.message },
    },
    mutations: {
        increment(state) {
            state.count++
        }
    }
});
const CompNav = {
    computed: {
        count() { return store.getters.count }
    },
    template: `#tmp-comp-nav`,
    methods: {
        upCount() { store.commit('increment') },
    },
}