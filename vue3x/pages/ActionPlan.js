import { groupBy } from "../common.js"
export default {
    template: `#tmp-comp-action-plan`,
    // components: {

    // },
    data() {
        return {

        }
    },
    methods: {
        setUserAssign(valIndex) {
            valIndex = parseInt(valIndex)
            this.$root.UserAssign = this.$root.Users[valIndex]
        },
        buildData(submkIds, prdIds) {
            let listGoal = this.$store.getters.SortedItems([9, [0], []])
            if (!submkIds.includes(0) || !prdIds.includes(0)) {
                const lstSubM = this.$store.getters.SortedItems([4, submkIds, []])
                const lstPrd = this.$store.getters.SortedItems([8, prdIds, []])
                const lstSubmId = lstSubM.map(x => x.Id)
                const lstPrdId = lstPrd.map(x => x.Id)

                const submPrdIds = []
                for (let ss = 0; ss < lstSubmId.length; ss++) {
                    for (let pp = 0; pp < lstPrdId.length; pp++) {
                        submPrdIds.push(`${lstSubmId[ss]}-${lstPrdId[0]}`);
                    }
                }
                for (let gg = listGoal.length - 1, goal; -1 < gg; gg--) {
                    goal = listGoal[gg]
                    if (submPrdIds.includes(goal.SubmPrdId)) continue;
                    listGoal.splice(gg, 1)      // remove at gg
                }
            }
            let groupedGoals = groupBy(listGoal, 'SubmPrdId')
            console.log('list goal ', listGoal)
            console.log('grouped goals ', groupedGoals)
        },
    },
    created() {
        this.buildData([0], [0])
    }
}