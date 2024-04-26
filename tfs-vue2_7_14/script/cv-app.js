const cvApp = new Vue({
    el: '#tfs-app',
    name: 'tfs-app',
    data: {
        CollapseIds: [],
        Backlogs: [{Id: -Date.now(), Name: 'item 1', User: 'DaiNB'}],
        Menu: null,

    },
    computed: {
        IsShowFilter(){
            return TfsStore.getters.getFilter() != null;
        },
    },
    provide() {
        return {
            getCollapseIds: () => { return this.CollapseIds },
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