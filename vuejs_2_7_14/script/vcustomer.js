
Vue.component('vcustom-goal', {
    props: ['item'],
    inject: ['getDndOptions' ],
    data(){
        const item = this.item
        const mapsGa = this.$root.ListMapGoalAction
        const goal = mapsGa.find(x => x.GoalId == item.Id)
        let ListAction = []
        if(goal) {
            const aIds = goal.ActionIds
            const actions = this.$root.ListAction
            for(let aa = 0; aa < actions.length; aa++) {
                const action = actions[aa]
                if(!aIds.includes(action.Id)) continue

                ListAction.push(action)
            }
        }

        return {
            ListAction
        }
    },
    updated() {
        this.updateListMap()
    },
    methods: {
        updateListMap(){
            const item = this.item
            const mapsGa = this.$root.ListMapGoalAction
            const goal = mapsGa.find(x => x.GoalId == item.Id)
            if(!goal) return

            const newActions = this.ListAction
            const newIds = newActions.map(x => x.Id)
            goal.ActionIds = newIds
        },
        onEditAction(action){
            const entry = Object.assign({ Type: 'EditAction' }, action)
            this.$root.pushModal(entry)
        },
        onEditGoal(main){
            const goal = Object.assign({ Type: 'EditGoal' }, main)
            this.$root.pushModal(goal)
        },
    },
});