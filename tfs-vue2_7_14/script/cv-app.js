const cvApp = new Vue({
    el: '#tfs-app',
    name: 'tfs-app',
    data: {
        Filter: {Search: ''},
        CollapseIds: [],
        Backlogs: [{Id: -Date.now(), Name: 'item 1', User: 'DaiNB'}],
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