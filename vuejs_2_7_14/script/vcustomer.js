
Vue.component('vitem-wrap', {
    template: '#vitem-wrap-temp',
    props: ['itemid', 'itype'],
    inject: ['setMarginTopActions', 'isExpandGa', 'setExpandGa'],
    computed: {
        item() {
            const gaId = this.itemid
            switch (this.itype) {
                case 1:
                    const lstGoal = this.$root.DataGoals
                    return lstGoal.find(x => gaId == x.Id)
                case 3:
                    const actions = this.$root.DataActions
                    return actions.find(x => gaId == x.Id)
            }
        },
        FormatRange() {
            const data = this.item
            if (!data) return
            const dt1 = data.Start
            const dt2 = data.End
            return dateTimeFormatRange('wek, dd MM YYYY', dt1, dt2)
        },
        IsExpand() {
            const gaId = this.itemid
            const type = this.itype
            return this.isExpandGa(gaId, type)
        },
    },
    methods: {
        styleHeight(offset) {
            const thisEl = this.$el
            const children = thisEl.children
            if (!children) return
            let height = 0
            for (let i = 0; i < children.length; i++) {
                const child = children[i]
                height += child.offsetHeight
            }
            offset = offset ? offset : 0
            thisEl.style.height = `${height + offset + 21}px`
        },
        onToggleExpand() {
            const gaId = this.itemid
            const type = this.itype
            this.setExpandGa(gaId, type)
        },

    },
    mounted() {
        this.styleHeight()
    },
    updated() {
        if (this.IsExpand) {
            this.styleHeight(60)
            this.setMarginTopActions()
        } else {
            this.styleHeight()
            this.setMarginTopActions()
        }

    },
})

Vue.component('vcustom-goal', {
    props: ['itemid'],
    inject: ['getDndOptions'],
    data() {
        const goalId = this.itemid
        const mapsGa = this.$root.ListMapGoalAction
        const goal = mapsGa.find(x => x.GoalId == goalId)
        let ListActionId = []
        if (goal) {
            ListActionId = goal.ActionIds
        }

        return {
            ListActionId
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
            const goalId = this.itemid
            const mapsGa = this.$root.ListMapGoalAction
            const goal = mapsGa.find(x => x.GoalId == goalId)
            if (!goal) return

            goal.ActionIds = this.ListActionId
        },
        onEditGa(gaId, type) {
            let entry, item
            switch (type) {
                case 1:
                    const lstGoal = this.$root.ListGoal
                    item = lstGoal.find(x => gaId == x.Id)
                    entry = Object.assign({ Type: 'EditGoal' }, item)
                    break;
                case 3:
                    const actions = this.$root.ListAction
                    item = actions.find(x => gaId == x.Id)
                    entry = Object.assign({ Type: 'EditAction' }, item)
                    break;
            }
            if (item)
                this.$root.pushModal(entry)
        },
        onDeleteGa(gaId, type) {
            const lstMapGa = this.$root.ListMapGoalAction
            const lstA = this.$root.ListAction
            let iA = -1
            switch (type) {
                case 1:
                    const lstG = this.$root.ListGoal
                    iA = lstG.findIndex(g => g.Id == gaId)
                    if (iA > -1) lstG.splice(iA, 1)

                    iA = lstMapGa.findIndex(m => m.GoalId == gaId)
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
                    const goalId = this.itemid
                    iA = lstA.findIndex(x => x.Id == gaId)
                    if (iA > -1) lstA.splice(iA, 1)

                    for (let ii = 0; ii < lstMapGa.length; ii++) {
                        const entry = lstMapGa[ii]
                        if (entry.GoalId != goalId) continue

                        iA = entry.ActionIds.indexOf(gaId)
                        if (iA > -1) entry.ActionIds.splice(iA, 1)   // remove at iA
                    }
                    for (let ii = 0; ii < lstMapGa.length; ii++) {
                        const entry = lstMapGa[ii]
                        if (entry.GoalId == goalId) continue

                        iA = entry.ActionIds.indexOf(gaId)
                        if (iA > -1) return
                    }
                    iA = lstA.findIndex(x => x.Id == gaId)
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