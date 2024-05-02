new Vue({
    el: '#tfs-app',
    name: 'tfs-app',
    data: {
        EditItem: null,
        CollapseIds: [],
        Backlogs: [{ Id: -Date.now(), Name: 'item 1', User: TfsStore.getters.getUsers()[0].Name }],
        MenuSelect: null,
        AssignedTo: TfsStore.getters.getAssignsTo(),
        States: TfsStore.getters.getStates(),

    },
    computed: {
        IsShowFilter() {
            return !Object.is(TfsStore.getters.getFilter(), null)
        },
    },
    provide() {
        return {
            getCollapseIds: () => { return this.CollapseIds },
        }
    },
    methods: {
        removeAllEditable() {
            this.$el.querySelectorAll(`.dnbTxtEditable[contenteditable="true"]`).forEach(b => {
                b.classList.remove('dnbTxtEditable')
                b.removeAttribute('contenteditable')
            })
            this.$el.querySelectorAll(`.dnbChangeUser`).forEach(b => {
                b.classList.remove('dnbChangeUser')
            })
            this.$el.querySelectorAll(`.dnbShowMenuFilter`).forEach(b => {
                b.classList.remove('dnbShowMenuFilter')
            })
        },
        setFloatOver(type, val){
            switch(type) {
                case 1:     // Edit Item
                    this.EditItem = val
                    this.MenuSelect = null
                break;
                case 2:     // MenuSelect
                    this.MenuSelect = val
                    this.EditItem = null
                break;
            }
        },
    },    
    //watch: { },
    created() {

    },
    mounted() {
        const onClickWindow = (e) => {
            console.log(e.target.tagName);
            if (!Object.is(this.MenuSelect, null)) {
                this.$el.querySelectorAll(`.dnbShowMenuFilter`).forEach(b => {
                    b.classList.remove('dnbShowMenuFilter')
                })
                this.MenuSelect = null;
            }
            if (!Object.is(this.EditItem, null)) {
                this.removeAllEditable()
                if (typeof this.EditItem.endChange == 'function') this.EditItem.endChange()
                this.EditItem = null;
            }
        }
        window.addEventListener("click", onClickWindow);
    },
    updated() {

    },
})