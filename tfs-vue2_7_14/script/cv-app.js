const cvApp = new Vue({
    el: '#cv-app',
    name: 'cv-app',
    data: {
        Filter: {Search: ''},
        CollapseIds: [],
        Backlogs: [{Name: 'item 1', User: 'DaiNB'}],
        Menu: null,

    },
    computed: {
        
    },
    provide() {
        return {
            getNavIndex: () => { return this.NavBar.Index },
        }
    },
    methods: {
        
    },
    created() {
        
    },
    //mounted(){ },
    updated(){        
        
    },
})