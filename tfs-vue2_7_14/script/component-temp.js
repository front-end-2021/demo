Vue.component('b-task-done', {
    template: '#b-task-done-temp',
    props: ['item'],

})
Vue.component('b-task', {
    template: '#b-task-temp',
    props: ['item'],
    data(){
        return {
            RemainingWork: this.item.RemainingWork
        }
    },
    watch: {
        RemainingWork(val){
            let num = parseFloat(val)
            if(isNaN(num)) num = 0
            if(val.includes('.')) {
                num = num.toFixed(2)
                num = parseFloat(num)
            }
            this.item.RemainingWork = num
        }
    },
})
Vue.component('b-item', {
    template: '#b-item-temp',
    props: ['item', 'rwork'],

})
const mxState = {
    props: ['items'],
    data() {
        return {
            Items: this.items
        }
    },
    computed: {
        State(){ return 1}, 
    }
}
Vue.component('b-state-todo', {
    template: '#b-state-temp',
    mixins: [mxState],
    computed: {
        ClassWrap(){ return 'dnb-col-todo'}, 
    }
})
Vue.component('b-state-new', {
    template: '#b-state-temp',
    mixins: [mxState],
    computed: {
        ClassWrap(){ return 'dnb-col-new'}, 
    }
})
Vue.component('b-state-approve', {
    template: '#b-state-temp',
    mixins: [mxState],
    computed: {
        ClassWrap(){ return 'dnb-col-approve'}, 
    }
})
Vue.component('b-state-inprogress', {
    template: '#b-state-temp',
    mixins: [mxState],
    computed: {
        ClassWrap(){ return 'dnb-col-inprgress'}, 
    }
})
Vue.component('b-state-commit', {
    template: '#b-state-temp',
    mixins: [mxState],
    computed: {
        ClassWrap(){ return 'dnb-col-commit'}, 
    }
})
Vue.component('b-state-done', {
    template: '#b-state-temp',
    mixins: [mxState],
    computed: {
        ClassWrap(){ return 'dnb-col-done'},
        State(){ return 6}, 
    }
})