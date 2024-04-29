Vue.component('b-filter', {
    //props: [],
    //inject: ['onChangeFilterByWord'],
    data() {
        return {
            Keyword: TfsStore.getters.getSearch(),
        }
    },
    computed: {
        PlaceholderKeyWord() { return `Filter by keyword` },
    },
    watch: {
        Keyword(val) {
            TfsStore.dispatch('setFilterSearch', val)
        },
    },
    methods: {

    },
})

Vue.component('b-backlog', {
    props: ['item'],
    //inject: ['onChangeFilterByWord'],
    data() {
        let dNow = Date.now();
        const user = TfsStore.getters.getUsers()[0]
        return {
            Todo: [{ Id: -dNow, Name: 'Todo 1', User: user.Name, RemainingWork: 1 }
            ],
            New: [{ Id: -(++dNow), Name: 'New 1', User: user.Name, RemainingWork: 0 }],
            Approved: [{ Id: -(++dNow), Name: 'Appr 1', User: user.Name, RemainingWork: 0 }],
            InProgess: [{ Id: -(++dNow), Name: 'InPrg 1', User: user.Name, RemainingWork: 0 }],
            Commited: [{ Id: -(++dNow), Name: 'Cmt 1', User: user.Name, RemainingWork: 0 }],
            Done: [{ Id: -(++dNow), Name: 'Done 1', User: user.Name, RemainingWork: 0 }],
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
        'item.Todo'(lst) {

        },
    },
    methods: {

    },
    provide() {
        return {
            getTaskNames: () => {
                const rTodo = this.Todo.map(x => x.Name);
                const rNew = this.New.map(x => x.Name);
                const rApp = this.Approved.map(x => x.Name);
                const rIng = this.InProgess.map(x => x.Name);
                const rCmt = this.Commited.map(x => x.Name);
                const rDone = this.Done.map(x => x.Name);
                return [...rTodo, ...rNew, ...rApp, ...rIng, ...rCmt, ...rDone]
            },
        }
    },
})
