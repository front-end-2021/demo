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

Vue.component('b-backlog', {
    props: ['f-data', 'item'], // this.fData {Search, }
    //inject: ['onChangeFilterByWord'],
    data() {
        let dNow = Date.now()
        return {
            Todo: [ {Id: -dNow, Name: 'Todo 1', User: 'DaiNB', RemainingWork: 1}
                ],
            New: [{Id: -(++dNow), Name: 'New 1', User: 'DaiNB', RemainingWork: 0}],
            Approved: [{Id: -(++dNow), Name: 'Appr 1', User: 'DaiNB', RemainingWork: 0}],
            InProgess: [{Id: -(++dNow), Name: 'InPrg 1', User: 'DaiNB', RemainingWork: 0}],
            Commited: [{Id: -(++dNow), Name: 'Cmt 1', User: 'DaiNB', RemainingWork: 0}],
            Done: [{Id: -(++dNow), Name: 'Done 1', User: 'DaiNB', RemainingWork: 0}],
        }
    },
    computed: {
        Time() {
            const rTodo = this.Todo.map(x => x.RemainingWork);
            let rWork = rTodo.reduce((a, b) => a + b, 0);
            const rNew = this.New.map(x => x.RemainingWork);
            rWork += rNew.reduce((a, b) => a + b, 0);
            const rApp = this.Approved.map(x => x.RemainingWork);
            rWork += rApp.reduce((a, b) => a + b, 0);
            const rIng = this.InProgess.map(x => x.RemainingWork);
            rWork += rIng.reduce((a, b) => a + b, 0);
            const rCmt = this.Commited.map(x => x.RemainingWork);
            rWork += rCmt.reduce((a, b) => a + b, 0);
            return rWork
        },
    },
    watch: {
        'item.Todo'(lst){
            
        },
    },
    methods: {

    },
})
