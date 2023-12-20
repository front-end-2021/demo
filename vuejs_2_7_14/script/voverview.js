
const DayPxUnit = 20       // 1day = 20px
const MixActionOvw = {
    props: ['itemid'],
    inject: ['aIsDone'],
    computed: {
        item() {
            const aId = this.itemid
            return this.getItem(aId)
        },
        ClssStatus() {
            const item = this.item
            const type = this.getCompareType(item)
            switch (type) {
                case 0:
                case 2:
                case 3:
                case 4: return 'bg-success';
                default:
                    if (this.aIsDone(item.Id)) return 'bg-success';
                    return 'bg-primary';
            }
        },
    },
    methods: {
        getCompareType(item) {
            const tEnd = this.getEndD(item)
            if (!tEnd) return -1
            const dNow = new Date()
            const dY = dNow.getFullYear()
            const eY = tEnd.getFullYear()
            if (dY < eY) return -2
            if (dY > eY) return 2
            const dM = dNow.getMonth()
            const eM = tEnd.getMonth()
            if (dM < eM) return -3
            if (dM > eM) return 3
            const dD = dNow.getDate()
            const eD = tEnd.getDate()
            if (dD < eD) return -4
            if (dD > eD) return 4
            return 0
        },
        getEndD(item) {
            if (!item.End) {
                if (this.aIsDone(item.Id)) {
                    const dNow = new Date()
                    dNow.setHours(0, 0, 0, 0)
                    return dNow
                }
                return item.End
            }
            return item.End
        },
        getItem(aId){
            return this.$root.ListAction.find(x => aId == x.Id)
        }
    },
}
Vue.component('action-time', {
    mixins: [MixActionOvw],
    inject: ['getMinStart', 'getMaxEnd'],
    computed: {
        Width() {
            const item = this.item
            let dTime = 86400000
            if (!item.Start) {
                const minS = this.getMinStart()
                const maxE = this.getMaxEnd()
                if (maxE < 1) {
                    dTime = minS + 69 * 24000 * 3600 + 24000 * 3600
                    return `${DayPxUnit * dTime / 24000 / 3600}px`
                }
                dTime = maxE - minS + 24000 * 3600
                return `${DayPxUnit * dTime / 24000 / 3600}px`
            }
            const start = item.Start.getTime()

            const tEnd = this.getEndTime(item)
            if (!tEnd) {
                const maxE = this.getMaxEnd()
                if (maxE < 1) {
                    dTime = start + 69 * 24000 * 3600 + 24000 * 3600
                    return `${DayPxUnit * dTime / 24000 / 3600}px`
                }
                dTime = maxE - start + 24000 * 3600
                return `${DayPxUnit * dTime / 24000 / 3600}px`
            }

            if (tEnd <= start) {
                return `${DayPxUnit}px`
            }
            dTime = tEnd - start + 24000 * 3600
            return `${DayPxUnit * dTime / 24000 / 3600}px`
        },
        Left() {
            const item = this.item
            if (!item.Start) return
            const minS = this.getMinStart()
            const start = item.Start.getTime()
            const dTime = start - minS
            return `${DayPxUnit * dTime / 24000 / 3600}px`
        },
        Border() {
            const item = this.item
            const tEnd = this.getEndTime(item)
            if (!item.Start && !tEnd)
                return
            if (item.Start && tEnd)
                return { borderRadius: '0.25rem' }
            if (item.Start)
                return {
                    borderTopLeftRadius: '0.25rem',
                    borderBottomLeftRadius: '0.25rem',
                }
            if (tEnd)
                return {
                    borderTopRightRadius: '0.25rem',
                    borderBottomRightRadius: '0.25rem',
                }
        },
    },
    methods: {
        getEndTime(item) {
            if (!item.End) {
                if (this.aIsDone(item.Id)) {
                    const dNow = new Date()
                    dNow.setHours(0, 0, 0, 0)
                    return dNow.getTime()
                }
                return item.End
            }
            return item.End.getTime()
        },
    },
})

Vue.component('action-view', {
    mixins: [MixActionOvw],
    props: ['goalsync'],
    inject: ['toggleDone'],
    data(){
        const aId = this.itemid
        return {
            IsDoneDisable: this.isDoneDisable(aId)
        }
    },
    computed: {
        Start() {
            const item = this.item
            return this.getDDMM(item.Start)
        },
        End() {
            const item = this.item
            if (!item.End && this.aIsDone(item.Id)) {
                if (!item.Start) {
                    return this.getDDMM(Date.now())
                }
                const dNow = new Date()
                dNow.setHours(0, 0, 0, 0)
                const tNow = dNow.getTime()
                const tStart = item.Start.getTime()
                if (tStart < tNow) return this.getDDMM(dNow)
                return this.getDDMM(item.Start)
                //return this.getDDMM(new Date(tStart + 24000 * 3600))
            }
            return this.getDDMM(item.End)
        },
        YearStart() {
            const item = this.item
            if (!item.Start) return
            return item.Start.getFullYear()
        },
        YearEnd() {
            const item = this.item
            if (!item.End) return ''
            return item.End.getFullYear()
        },
        Status() {
            const item = this.item
            const type = this.getCompareType(item)
            switch (type) {
                case 0:
                case 2:
                case 3:
                case 4: return 'Done';
                default:
                    if (this.aIsDone(item.Id)) return 'Done';
                    return 'Cong';
            }
        },
    },
    watch: {
        goalsync(){
            const aId = this.itemid
            this.IsDoneDisable = this.isDoneDisable(aId)
        },
    },
    methods: {
        getDDMM(date) {
            if (!date) return '-'
            if (typeof date == 'number') {
                date = new Date(date)
            }
            const dd = date.getDate()
            const mm = date.getMonth()
            return `${dd}/${mm + 1}`
        },
        onClickScrollToStart() {
            this.scrollToX(0)
        },
        onClickScrollTo() {
            this.scrollToX(-69)
        },
        scrollToX(left, isEnd) {
            const overview = document.querySelector('.dnbOverview')
            if (!overview) return

            const id = this.item.Id
            const actTime = document.querySelector(`[atime-id="${id}"]`)
            if (!actTime) return
            let _left = overview.scrollLeft + actTime.offset().left
            if (isEnd) _left += actTime.offsetWidth
            overview.scroll({
                left: _left - 666 + 180 + left,
                behavior: "smooth",
            });
        },
        onClickScrollToEnd() {
            const item = this.item
            if (!item.End) {
                if (this.End != '-') {
                    this.scrollToX(-513, true)
                }
                return
            }
            this.scrollToX(-513, true)
        },
        checkToggleDone(isDone) {
            const itemId = this.itemid
            this.toggleDone(itemId, isDone)
        },
        isDoneDisable(aId){
            const aIdsDone = this.$root.ListDoneActionId
            if(aIdsDone.includes(aId)) return true

            const item = this.getItem(aId)
            if(!item) return false
            if(!item.End) return false
            const dNow = new Date()
            dNow.setHours(0, 0, 0, 0)
            const tNow = dNow.getTime()
            const tEnd = item.End.getTime()
            if (tEnd < tNow) {
                return true
            }
            return false
        }
    },
});

Vue.component('sub-view', {
    props: ['item'],
    inject: ['toggleExpand', 'isExpand', 'syncGoalCloud', 'getActIdsDone'],
    computed: {
        GoalItem() {
            const goalId = this.item.GoalId
            return this.$root.ListGoal.find(x => goalId == x.Id)
        },
        IsExpand() { return this.isExpand(this.item.GoalId) },
        DragOptions() {
            return {
                group: 'action',
                swap: true,
                handle: "p.a-name",
            }
        },
        NeedSync(){
            const aIds = this.item.ActionIds            
            const aIdsDone = this.$root.ListDoneActionId
            const doneIds = aIdsDone.filter(id => aIds.includes(id))
            const lstIdDone = this.getActIdsDone(aIds)
            if(!lstIdDone.length) return false
            return doneIds.length != lstIdDone.length
        },
    },
    methods: {
        onToggleExpand() { this.toggleExpand(this.item.GoalId) },
        syncToCloud() { this.syncGoalCloud(this.item) },
        checkMove(evt) {
            const srcTarget = evt.dragged
            let srcE = evt.draggedContext
            srcE = srcE ? srcE.element : {}

            const desTarget = evt.related
            let desE = evt.relatedContext
            desE = desE ? desE.element : {}

            const srcSubId = parseInt(srcTarget.getAttribute('subid'))
            const desSubId = parseInt(desTarget.getAttribute('subid'))
            window.SrcSubId = srcSubId
            window.DesSubId = desSubId
        },
        onDndEnd(evt) {
            delete window.SrcSubId
            delete window.DesSubId
        }
    },
});