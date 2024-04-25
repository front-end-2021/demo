Vue.component('b-filter', {
    props: ['f-data'],      // this.fData {Search, }
    //inject: ['onChangeFilterByWord'],
    data() {
        return {
            Keyword: this.fData.Search,
        }
    },
    computed: {
        PlaceholderKeyWord() { return `Filter by keyword` },
    },
    //watch: {},
    methods: {

    },
})
Vue.component('b-task', {
    template: '#b-task-temp',
    props: ['item'],

})
Vue.component('b-backlog', {
    props: ['f-data', 'item'], // this.fData {Search, }
    //inject: ['onChangeFilterByWord'],
    data() {
        return {
            Todo: [{Name: 'Todo 1', User: 'DaiNB'},
            {Name: 'Todo 2', User: 'DaiNB'}],
            New: [{Name: 'New 1', User: 'DaiNB'}],
            Approved: [],
            InProgess: [],
            Commited: [],
            Done: [],
        }
    },
    computed: {
        Time() {
            const rTodo = this.Todo.map(x => x.RemainingWork);
            const tTodo = rTodo.reduce((a, b) => a + b, 0);
            const rNew = this.New.map(x => x.RemainingWork);
            const tNew = rNew.reduce((a, b) => a + b, 0);
            return tTodo + tNew
        },
    },
    watch: {
        'item.Todo'(lst){
            
        },
    },
    methods: {

    },
})
