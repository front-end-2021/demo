const mxCard = {
    props: ['item'],
    //inject: [''],
    computed: {
        IsShow() {
            let txt = TfsStore.getters.getSearch()
            if (!txt.length) return true
            let name = this.item.Name
            return TfsStore.getters.inSearch(name)
        },
    }
}
Vue.component('bi-editable', {
    template: '#temp-item-edit',
    mixins: [mxCard],
    props: ['is-show'], // isShow
    methods: {
        onStartEdit(e, type) {
            if (e.target.hasAttribute('contenteditable')) return;
            this.$root.removeAllEditable()
            e.target.setAttribute('contenteditable', true);
            e.target.classList.add('dnbTxtEditable');
            this.$root.EditItem = {
                Data: this.item,
                Type: type
            }
        },
        onStartChange(e, type){
            if(e.key === "Enter") e.preventDefault()
        },
        onEndChange(e, type) {
            if (e.key === "Enter") {
                let newTxt = e.target.innerText
                switch (type) {
                    case 1:
                        this.$root.EditItem.Data.Name = newTxt
                        break;
                    default: break;
                }
            }
            console.log(e)
            console.log(e.target)

        },
    },
})
Vue.component('b-task-done', {
    template: '#temp-task-done',
    mixins: [mxCard],
    props: ['is-show'], // isShow
})
Vue.component('b-task', {
    template: '#temp-task',
    mixins: [mxCard],
    data() {
        return {
            RemainingWork: this.item.RemainingWork
        }
    },
    watch: {
        RemainingWork(val) {
            let num = parseFloat(val)
            if (isNaN(num)) num = 0
            if (val.includes('.')) {
                num = num.toFixed(2)
                num = parseFloat(num)
            }
            this.item.RemainingWork = num
        }
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
    props: ['items'],
    data() {
        return {
            Items: this.items
        }
    },
    computed: {
        State() { return 2 },
    }
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
        State() { return 1 },
    },
    methods: {
        onClkNewTask(e) {
            const n = this.Items.length + 1
            this.Items.push({ Id: -Date.now(), Name: `Todo (${n})`, User: '', RemainingWork: 1 })
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
        State() { return 6 },
    }
})