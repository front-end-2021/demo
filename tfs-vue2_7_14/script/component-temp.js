const mxCard = {
    props: ['item'],
}
Vue.component('b-task-done', {
    template: '#b-task-done-temp',
    mixins: [mxCard],

})
Vue.component('b-task', {
    template: '#b-task-temp',
    mixins: [mxCard],
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
    mixins: [mxCard],
    props: ['rwork'],

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
const mxDndSort = {
    computed: {
        DnDOptions(){
            return {
                sort: true
            }
        },
    }
}
Vue.component('b-state-todo', {
    template: '#b-state-temp',
    mixins: [mxState, mxDndSort],
    computed: {
        ClassWrap(){ return 'dnb-col-todo'}, 
    }
})
Vue.component('b-state-new', {
    template: '#b-state-temp',
    mixins: [mxState, mxDndSort],
    computed: {
        ClassWrap(){ return 'dnb-col-new'}, 
    }
})
Vue.component('b-state-approve', {
    template: '#b-state-temp',
    mixins: [mxState, mxDndSort],
    computed: {
        ClassWrap(){ return 'dnb-col-approve'}, 
    }
})
Vue.component('b-state-inprogress', {
    template: '#b-state-temp',
    mixins: [mxState, mxDndSort],
    computed: {
        ClassWrap(){ return 'dnb-col-inprgress'}, 
    }
})
const mxDndNotSort = {
    computed: {
        DnDOptions(){
            return {
                sort: false
            }
        },
    }
}
Vue.component('b-state-commit', {
    template: '#b-state-temp',
    mixins: [mxState, mxDndNotSort],
    computed: {
        ClassWrap(){ return 'dnb-col-commit'}, 
    }
})
Vue.component('b-state-done', {
    template: '#b-state-temp',
    mixins: [mxState, mxDndNotSort],
    computed: {
        ClassWrap(){ return 'dnb-col-done'},
        State(){ return 6},
    }
})