Vue.component('b-filter', {
    //props: [],
    //inject: [],
    data() {
        return {
            Keyword: TfsStore.getters.getSearch(),
        }
    },
    computed: {
        PlaceholderKeyWord() { return `Filter by keyword` },
        LblAssigned() {
            const lst = TfsStore.getters.getAssignsTo()
            if (!lst.length) return 'Assigned to';
            if (lst.length < 2) return lst[0]
            return `${lst[0]} (+1)`
        },
        LblStates() {
            const lst = TfsStore.getters.getFStates()
            if (!lst.length) return 'States'
            if (lst.length < 2) return lst[0]
            return `${lst[0]} (+1)`
        },
    },
    watch: {
        Keyword(val) {
            TfsStore.dispatch('setFilterSearch', val)
        },
    },
    methods: {
        filterByMenu(e, type) {
            if (e.target.classList.contains('dnbShowMenuFilter')) return;
            this.$root.removeAllEditable()
            e.target.classList.add('dnbShowMenuFilter');
            const eOffs = e.target.offset();
            this.$root.setFloatOver(2, {
                Type: type,
                top: `${eOffs.top + 33}px`,
                left: `${eOffs.left}px`
            })
            switch (type) {
                case 2: // assigned to
                    this.$root.MenuSelect.Items = [
                        { Name: 'Unassigned' },
                        ...TfsStore.getters.getUsers()];
                    break;
                case 3:     // states
                    this.$root.MenuSelect.Items = [
                        { Name: 'Done' },
                        { Name: 'In Progress' },
                        { Name: 'New' },
                        { Name: 'To Do' }
                    ]
                    break;
                default:
                    break;
            }
            this.$root.MenuSelect.onSelect = (name) => {
                TfsStore.dispatch('setFilterChecks', { name, type })
            }
            this.$root.MenuSelect.clearChecks = (type) => {
                TfsStore.dispatch('clearFilterChecks', type)
            }
        },
        onRmFilter() {
            this.$root.IsShowFilter = false
            TfsStore.dispatch('switchFilter', false)
        },
    },
})

Vue.component('b-backlog', {
    props: ['item'],
    //inject: [],
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
            getColState: () => { return 0 },
        }
    },
})
