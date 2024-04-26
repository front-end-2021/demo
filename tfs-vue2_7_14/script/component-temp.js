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
        onStartEdit(e, type) {
            if (e.target.hasAttribute('contenteditable')) return;
            this.$root.removeAllEditable()
            e.target.setAttribute('contenteditable', true);
            e.target.classList.add('dnbTxtEditable');
            this.$root.EditItem = {
                Data: this.item,
                Type: type
            }
            this.$root.EditItem.endChange = () => {
                let val = e.target.innerText
                switch (type) {
                    case 1:
                        this.$root.EditItem.Data.Name = val
                        break;
                    case 2:
                        val = getNum(val)
                        this.$root.EditItem.Data.RemainingWork = val
                        break;
                    default: break;
                }

            }
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
            console.log(e)
            console.log(e.target)

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
            console.log(e)
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