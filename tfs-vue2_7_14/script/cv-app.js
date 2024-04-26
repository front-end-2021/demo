const cvApp = new Vue({
    el: '#tfs-app',
    name: 'tfs-app',
    data: {
        EditItem: null,
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
        removeAllEditable(){
            this.$el.querySelectorAll(`.dnbTxtEditable[contenteditable="true"]`).forEach(b => {
                b.classList.remove('dnbTxtEditable')
                b.removeAttribute('contenteditable')
            })
        },
    },
    created() {
        
    },
    mounted(){
        const onClickWindow = (e) => {
            console.log(e.className);
            console.log(e.target);
            this.removeAllEditable()
            this.EditItem = null
        }
        window.addEventListener("click", onClickWindow);

    },
    updated(){        
        
    },
})