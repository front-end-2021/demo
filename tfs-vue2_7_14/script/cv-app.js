new Vue({
    el: '#tfs-app',
    name: 'tfs-app',
    data: {
        EditItem: null,
        CollapseIds: [],
        Backlogs: [{ Id: -Date.now(), Name: 'item 1', User: TfsStore.getters.getUsers()[0].Name }],
        AssignedTo: TfsStore.getters.getAssignsTo(),
        MenuSelect: null,

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
        },
    },
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