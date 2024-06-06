const mxCard = {
    props: ['item'],
    inject: ['getColState'],
    computed: {
        IsShow() {
            const lstAssign = TfsStore.getters.getAssignsTo()
            let txt = TfsStore.getters.getSearch()
            let onShowAssign = false
            if (lstAssign.length) {
                let user = this.item.User
                for (let ii = 0; ii < lstAssign.length; ii++) {
                    const assgn = lstAssign[ii]
                    if (!user && assgn == 'Unassigned') {
                        onShowAssign = true
                        break
                    }
                    if (user == assgn) {
                        onShowAssign = true
                        break
                    }
                }
            } else onShowAssign = true
            const lstStates = TfsStore.getters.getFStates()
            let onShowState = false
            if (lstStates.length) {
                switch (this.getColState()) {
                    case 1:
                        if (lstStates.includes('To Do')) onShowState = true
                        break;
                    case 2:
                        if (lstStates.includes('New')) onShowState = true
                        break;
                    case 4:
                        if (lstStates.includes('In Progress')) onShowState = true
                        break;
                    case 6:
                        if (lstStates.includes('Done')) onShowState = true
                        break;
                    default: onShowState = true
                        break;
                }
            } else onShowState = true
            let onShowSearch = false
            if (txt.length) {
                onShowSearch = TfsStore.getters.inSearch(this.item.Name)
            } else onShowSearch = true
            return onShowSearch && onShowState && onShowAssign
        },
    }
}
function getNum(txt) {
    let num = parseFloat(txt)
    if (isNaN(num)) num = 0
    if (txt.includes('.')) {
        num = num.toFixed(2)
        num = parseFloat(num)
    }
    return num
}
const mxEditable = {
    methods: {
        onChangeUser(e, type) {
            if (e.target.classList.contains('dnbChangeUser')) return;
            this.$root.removeAllEditable()
            e.target.classList.add('dnbChangeUser');
            this.$root.setFloatOver(1, {
                Data: this.item,
                Type: type
            })
            switch (type) {
                case 3:
                    this.$root.EditItem.Users = [{ Name: 'Unassigned' },
                    ...TfsStore.getters.getUsersIgnore(this.item.User)];
                    const eOffs = e.target.offset();
                    this.$root.EditItem.top = `${eOffs.top + 23}px`
                    this.$root.EditItem.left = `${eOffs.left}px`
                    this.$root.EditItem.onSelect = (name) => {
                        this.$root.EditItem.Data.User = name
                        this.$root.EditItem = null
                        e.target.removeAttribute('contenteditable')
                        e.target.classList.remove('dnbTxtEditable')
                        this.$root.removeAllEditable()
                    }
                    break;
                default: break;
            }
        },
        onStartEdit(e, type) {
            if (e.target.hasAttribute('contenteditable')) return;
            this.$root.removeAllEditable()
            e.target.setAttribute('contenteditable', true);
            e.target.classList.add('dnbTxtEditable');
            const endChange = () => {
                let val = e.target.innerText
                switch (type) {
                    case 1:
                        this.$root.EditItem.Data.Name = val
                        break;
                    case 2:
                        val = getNum(val)
                        this.$root.EditItem.Data.RemainingWork = val
                        break;
                    case 3: // user

                        break;
                    default: break;
                }
            }
            this.$root.setFloatOver(1, {
                Data: this.item,
                Type: type,
                endChange
            })
        },
        preventEnter(e) { if (e.key === "Enter") e.preventDefault() },
        onStartChange(e, type) {
            this.preventEnter(e)
        },
        onEndChange(e, type) {
            if (e.key === "Enter") {
                this.$root.removeAllEditable()
                this.$root.EditItem.endChange()
                this.$root.EditItem = null;
            }
         //   console.log(e)
          //  console.log(e.target)

        },
    },
}
Vue.component('bi-editable', {
    template: '#temp-item-edit',
    mixins: [mxCard, mxEditable],
    props: ['is-show'], // isShow

})
Vue.component('b-task-done', {
    template: '#temp-task-done',
    mixins: [mxCard],
    props: ['is-show'], // isShow
})
Vue.component('b-task', {
    template: '#temp-task',
    mixins: [mxCard, mxEditable],
    data() {
        return {

        }
    },
    watch: {
    },
    methods: {
        onStartChange(e, type) {
            if (e.key == 'ArrowRight' || e.key == 'ArrowLeft'
                || e.key == 'End' || e.key == 'Home') return
            if (e.key == '.' || e.key == 'Backspace') return
            let num = parseFloat(e.key)
            if (isNaN(num)) {
                e.preventDefault();
                return;
            }
         //   console.log(e)
            this.preventEnter(e)
        },
    },
})
Vue.component('b-item', {
    template: '#temp-item',
    mixins: [mxCard],
    props: ['rwork'],
    inject: ['getTaskNames'],
    computed: {
        IsShow() {
            let txt = TfsStore.getters.getSearch()
            if (!txt.length) return true
            let name = this.item.Name
            let hasName = TfsStore.getters.inSearch(name)
            if (hasName) return true;
            const taskNames = this.getTaskNames()
            return taskNames.filter(t => TfsStore.getters.inSearch(t)).length
        },
    }
})

const mxState = {
    props: ['items', 'state'],
    data() {
        return {
            Items: this.items
        }
    },
    provide() {
        return {
            getColState: () => { return this.state },
        }
    },
}
const mxDndSort = {
    computed: {
        DnDOptions() {
            return {
                sort: true
            }
        },
    }
}
Vue.component('b-state-todo', {
    template: '#temp-state',
    mixins: [mxState, mxDndSort],
    computed: {
        ClassWrap() { return 'dnb-col-todo' },
        IsShowBtnNwTask() {
            let lst = TfsStore.getters.getFStates()
            if (!lst.length) return true
            if (lst.includes('To Do')) return true
            return false
        },
    },
    methods: {
        onClkNewTask(e) {
            const n = this.Items.length + 1
            this.Items.push({
                Id: -Date.now(), Name: `Todo (${n})`,
                User: TfsStore.getters.getUsers()[0].Name, RemainingWork: 1
            })
        }
    },
})
Vue.component('b-state-new', {
    template: '#temp-state',
    mixins: [mxState, mxDndSort],
    computed: {
        ClassWrap() { return 'dnb-col-new' },
    }
})
Vue.component('b-state-approve', {
    template: '#temp-state',
    mixins: [mxState, mxDndSort],
    computed: {
        ClassWrap() { return 'dnb-col-approve' },
    }
})
Vue.component('b-state-inprogress', {
    template: '#temp-state',
    mixins: [mxState, mxDndSort],
    computed: {
        ClassWrap() { return 'dnb-col-inprgress' },
    }
})
const mxDndNotSort = {
    computed: {
        DnDOptions() {
            return {
                sort: false
            }
        },
    }
}
Vue.component('b-state-commit', {
    template: '#temp-state',
    mixins: [mxState, mxDndNotSort],
    computed: {
        ClassWrap() { return 'dnb-col-commit' },
    }
})
Vue.component('b-state-done', {
    template: '#temp-state',
    mixins: [mxState, mxDndNotSort],
    computed: {
        ClassWrap() { return 'dnb-col-done' },
    }
})