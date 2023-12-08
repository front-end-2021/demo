
Vue.component('vcustom-goal', {
    props: ['item'],
    inject: ['getDndOptions'],
    data() {
        const item = this.item
        const mapsGa = this.$root.ListMapGoalAction
        const goal = mapsGa.find(x => x.GoalId == item.Id)
        let ListAction = []
        if (goal) {
            const aIds = goal.ActionIds
            const actions = this.$root.ListAction
            for (let aa = 0; aa < actions.length; aa++) {
                const action = actions[aa]
                if (!aIds.includes(action.Id)) continue

                ListAction.push(action)
            }
        }

        return {
            ListAction
        }
    },
    provide() {
        return {
            setMarginTopActions: this.setMarginTopActions
        }
    },
    updated() {
        this.updateListMap()
        console.log('update')
    },
    methods: {
        updateListMap() {
            const item = this.item
            const mapsGa = this.$root.ListMapGoalAction
            const goal = mapsGa.find(x => x.GoalId == item.Id)
            if (!goal) return

            const newActions = this.ListAction
            const newIds = newActions.map(x => x.Id)
            goal.ActionIds = newIds
        },
        onEditGa(ga, type) {
            let entry
            switch (type) {
                case 1:
                    entry = Object.assign({ Type: 'EditGoal' }, ga)
                    break;
                case 3:
                    entry = Object.assign({ Type: 'EditAction' }, ga)
                    break;
            }
            this.$root.pushModal(entry)
        },
        onDeleteGa(ga, type) {
            const lstMapGa = this.$root.ListMapGoalAction
            const lstA = this.$root.ListAction
            let iA = -1
            switch (type) {
                case 1:
                    const lstG = this.$root.ListGoal
                    iA = lstG.findIndex(g => g.Id == ga.Id)
                    if (iA > -1) lstG.splice(iA, 1)

                    iA = lstMapGa.findIndex(m => m.GoalId == ga.Id)
                    if (iA > -1) {
                        const idsA = lstMapGa[iA].ActionIds
                        lstMapGa.splice(iA, 1)
                        for (let ii = 0; ii < idsA.length; ii++) {
                            const aId = idsA[ii]
                            iA = lstA.findIndex(a => a.Id == aId)
                            if (iA > -1) lstA.splice(iA, 1)
                        }
                    }
                    return;
                case 3:
                    const goal = this.item
                    iA = this.ListAction.findIndex(x => x.Id == ga.Id)
                    if (iA > -1) this.ListAction.splice(iA, 1)

                    for (let ii = 0; ii < lstMapGa.length; ii++) {
                        const entry = lstMapGa[ii]
                        if (entry.GoalId != goal.Id) continue

                        iA = entry.ActionIds.indexOf(ga.Id)
                        if (iA > -1) entry.ActionIds.splice(iA, 1)   // remove at iA
                    }
                    for (let ii = 0; ii < lstMapGa.length; ii++) {
                        const entry = lstMapGa[ii]
                        if (entry.GoalId == goal.Id) continue

                        iA = entry.ActionIds.indexOf(ga.Id)
                        if (iA > -1) return
                    }
                    iA = lstA.findIndex(x => x.Id == ga.Id)
                    if (iA > -1) lstA.splice(iA, 1)      // remove at iA
                    return;
            }
        },
        setMarginTopActions() {
            this.$el.querySelectorAll(`.action-wrap`).forEach(a => a.style.marginTop = '')
            this.$el.querySelectorAll('.vlist-action').forEach(temp1 => {
                const lstE = []
                temp1.querySelectorAll(`.action-wrap`).forEach(a => lstE.push(a))
                for (let ii = 0; ii < lstE.length; ii++) {
                    const itemI = lstE[ii]
                    const offsetI = itemI.offset()

                    for (let jj = ii + 1; jj < lstE.length; jj++) {
                        const itemJ = lstE[jj]
                        const offsetJ = itemJ.offset()
                        if (offsetI.left != offsetJ.left) continue

                        const dY = offsetI.top + itemI.offsetHeight + 12 - offsetJ.top      // paddingTop = 12
                        itemJ.style.marginTop = `${dY}px`
                        break
                    }
                }
            })

        }
    },
});