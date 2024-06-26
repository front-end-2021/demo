Vue.component('vw-overview', {
    props: ['mgactions'],
    data() {
        const lstGoalId = []
        for (let mm = 0; mm < this.$root.Mains.length; mm++) {
            const main = this.$root.Mains[mm]
            for (let ss = 0; ss < main.Subs.length; ss++) {
                const sub = main.Subs[ss]
                lstGoalId.push({
                    GoalId: sub.Id,
                    ActionIds: sub.Actions.map(x => x.Id)
                })
            }
        }

        let aIds = []
        for (let ii = 0; ii < this.mgactions.length; ii++) {
            const goal = this.mgactions[ii]
            aIds = [...aIds, ...goal.ActionIds]
        }
        const aIdsDone = this.$root.ListDoneActionId

        return {
            IdActionsDone: aIdsDone.filter(id => aIds.includes(id)),
            IdSubsCollapse: [],
            List_GoalMini: lstGoalId
        }
    },
    computed: {
        MinStart() { return this.getMinS(this.mgactions) },
        MaxEnd() { return this.getMaxE(this.mgactions) },
        ListMonth() {
            const dNow = new Date()
            const mNow = dNow.getMonth() + 1
            const yNow = dNow.getFullYear()

            const minS = this.getMinS(this.mgactions)
            const maxE = this.getMaxE(this.mgactions)

            const minD = new Date(minS)
            const maxD = new Date(maxE)

            const minY = minD.getFullYear()
            const maxY = maxD.getFullYear()
            const minM = minD.getMonth() + 1
            const maxM = maxD.getMonth() + 1
            const minDay = minD.getDate()
            const maxDay = maxD.getDate()
            const lstMMYYY = []
            let mthTxt
            if (minY == maxY) {
                const days = this.daysInMonth(minM, minY)
                const lenDay = days - minDay
                mthTxt = minM < 10 ? `0${minM}` : minM
                if (minM == mNow && minY == yNow) {
                    lstMMYYY.push({
                        colspan: lenDay, MM: mthTxt, YYYY: minY,
                        IsNow: true
                    })
                } else {
                    lstMMYYY.push({ colspan: lenDay, MM: mthTxt, YYYY: minY })
                }
                for (let mth = minM + 1; mth < maxM; mth++) {
                    const mthTxt = mth < 10 ? `0${mth}` : mth
                    const days = this.daysInMonth(mth, minY)
                    if (mNow == mth && yNow == minY) {
                        lstMMYYY.push({
                            colspan: days, MM: mthTxt, YYYY: minY,
                            IsNow: true
                        })
                    } else
                        lstMMYYY.push({ colspan: days, MM: mthTxt, YYYY: minY })
                }
                mthTxt = maxM < 10 ? `0${maxM}` : maxM
                if (mNow == maxM && yNow == maxY) {
                    lstMMYYY.push({
                        colspan: maxDay, MM: mthTxt, YYYY: minY,
                        IsNow: true
                    })
                } else
                    lstMMYYY.push({ colspan: maxDay, MM: mthTxt, YYYY: minY })
                return lstMMYYY
            }
            mthTxt = minM < 10 ? `0${minM}` : minM
            const days = this.daysInMonth(minM, minY)
            if (mNow == minM && yNow == minY) {
                lstMMYYY.push({
                    colspan: days - minDay + 1, MM: mthTxt, YYYY: minY,
                    IsNow: true
                })
            } else
                lstMMYYY.push({
                    colspan: days - minDay + 1, MM: mthTxt, YYYY: minY
                })
            for (let mth = minM + 1; mth < 13; mth++) {
                mthTxt = mth < 10 ? `0${mth}` : mth
                const days = this.daysInMonth(mth, minY)
                if (mNow == mth && yNow == minY) {
                    lstMMYYY.push({
                        colspan: days, MM: mthTxt, YYYY: minY,
                        IsNow: true
                    })
                } else
                    lstMMYYY.push({ colspan: days, MM: mthTxt, YYYY: minY })
            }
            for (let yyyy = minY + 1; yyyy < maxY; yyyy++) {
                for (let mth = 1; mth < 13; mth++) {
                    mthTxt = mth < 10 ? `0${mth}` : mth
                    const days = this.daysInMonth(mth, yyyy)
                    if (mNow == mth && yNow == yyyy) {
                        lstMMYYY.push({
                            colspan: days, MM: mthTxt, YYYY: yyyy,
                            IsNow: true
                        })
                    } else
                        lstMMYYY.push({ colspan: days, MM: mthTxt, YYYY: yyyy })
                }
            }
            for (let mth = 1; mth < maxM; mth++) {
                const mthTxt = mth < 10 ? `0${mth}` : mth
                const days = this.daysInMonth(mth, maxY)
                if (mNow == mth && yNow == maxY) {
                    lstMMYYY.push({
                        colspan: days, MM: mthTxt, YYYY: maxY,
                        IsNow: true
                    })
                } else lstMMYYY.push({ colspan: days, MM: mthTxt, YYYY: maxY })
            }
            mthTxt = maxM < 10 ? `0${maxM}` : maxM
            if (mNow == maxM && yNow == maxY) {
                lstMMYYY.push({
                    colspan: maxDay, MM: mthTxt, YYYY: maxY,
                    IsNow: true
                })
            } else lstMMYYY.push({ colspan: maxDay, MM: mthTxt, YYYY: maxY })
            return lstMMYYY
        },
        ListDay() {
            const dtNow = new Date()
            const mNow = dtNow.getMonth() + 1
            const yNow = dtNow.getFullYear()
            const dNow = dtNow.getDate()

            const minS = this.getMinS(this.mgactions)
            const maxE = this.getMaxE(this.mgactions)

            const minD = new Date(minS)
            const maxD = new Date(maxE)

            const minY = minD.getFullYear()
            const maxY = maxD.getFullYear()
            const minM = minD.getMonth() + 1
            const maxM = maxD.getMonth() + 1
            const minDay = minD.getDate()
            const maxDay = maxD.getDate()
            const lstDays = []
            let dTxt
            if (minY == maxY) {
                const days = this.daysInMonth(minM, minY)
                for (let dd = minDay; dd <= days; dd++) {
                    dTxt = dd < 10 ? `0${dd}` : `${dd}`
                    if (minY == yNow && minM == mNow && dNow == dd) {
                        lstDays.push({ day: dTxt, IsNow: true })
                    } else lstDays.push({ day: dTxt })
                }
                for (let mth = minM + 1; mth < maxM; mth++) {
                    const days = this.daysInMonth(mth, minY)
                    for (let dd = 1; dd <= days; dd++) {
                        dTxt = dd < 10 ? `0${dd}` : `${dd}`
                        if (yNow == minY && mNow == mth && dNow == dd) {
                            lstDays.push({ day: dTxt, IsNow: true })
                        } else lstDays.push({ day: dTxt })
                    }
                }
                for (let dd = 1; dd <= maxDay; dd++) {
                    dTxt = dd < 10 ? `0${dd}` : `${dd}`
                    if (yNow == maxY && mNow == maxM && dNow == dd) {
                        lstDays.push({ day: dTxt, IsNow: true })
                    } else lstDays.push({ day: dTxt })
                }
                return lstDays
            }
            const days = this.daysInMonth(minM, minY)
            for (let dd = minDay; dd <= days; dd++) {
                dTxt = dd < 10 ? `0${dd}` : `${dd}`
                if (yNow == minY && mNow == minM && dNow == dd) {
                    lstDays.push({ day: dTxt, IsNow: true })
                } else lstDays.push({ day: dTxt })
            }
            for (let mth = minM + 1; mth < 13; mth++) {
                const days = this.daysInMonth(mth, minY)
                for (let dd = 1; dd <= days; dd++) {
                    dTxt = dd < 10 ? `0${dd}` : `${dd}`
                    if (yNow == minY && mNow == mth && dNow == dd) {
                        lstDays.push({ day: dTxt, IsNow: true })
                    } else lstDays.push({ day: dTxt })
                }
            }
            for (let yyyy = minY + 1; yyyy < maxY; yyyy++) {
                for (let mth = 1; mth < 13; mth++) {
                    const days = this.daysInMonth(mth, yyyy)
                    for (let dd = 1; dd <= days; dd++) {
                        dTxt = dd < 10 ? `0${dd}` : `${dd}`
                        if (yNow == yyyy && mNow == mth && dNow == dd) {
                            lstDays.push({ day: dTxt, IsNow: true })
                        } else lstDays.push({ day: dTxt })
                    }
                }
            }
            for (let mth = 1; mth < maxM; mth++) {
                const days = this.daysInMonth(mth, maxY)
                for (let dd = 1; dd <= days; dd++) {
                    dTxt = dd < 10 ? `0${dd}` : `${dd}`
                    if (yNow == maxY && mNow == mth && dNow == dd) {
                        lstDays.push({ day: dTxt, IsNow: true })
                    } else lstDays.push({ day: dTxt })
                }
            }
            for (let dd = 1; dd <= maxDay; dd++) {
                dTxt = dd < 10 ? `0${dd}` : `${dd}`
                if (yNow == maxY && mNow == maxM && dNow == dd) {
                    lstDays.push({ day: dTxt, IsNow: true })
                } else lstDays.push({ day: dTxt })
            }
            return lstDays
        },
        DndGoalOptions() {
            return {
                handle: ".view-sub",
                group: 'goal'
            }
        },
        DragActionOptions() {
            return {
                group: 'action',
                swap: true,
                handle: ".dnb-act-time"
            }
        },
    },
    provide() {
        return {
            getMinStart: () => { return this.getMinS(this.mgactions) },
            getMaxEnd: () => { return this.getMaxE(this.mgactions) },
            toggleExpand: (sId) => {
                const ii = this.IdSubsCollapse.indexOf(sId)
                if (ii > -1) this.IdSubsCollapse.splice(ii, 1)
                else this.IdSubsCollapse.push(sId)
            },
            isExpand: this.isExpand,
            syncGoalCloud: (goal) => {
                //const goalId = goal.GoalId
                const aIds = goal.ActionIds
                const lstIdDone = this.IdActionsDone
                const aIdsDone = this.$root.ListDoneActionId
                for (let kk = 0; kk < aIds.length; kk++) {
                    const aId = aIds[kk]
                    let ik = lstIdDone.indexOf(aId)
                    if (ik < 0) continue

                    lstIdDone.splice(ik, 1)
                    ik = aIdsDone.indexOf(aId)
                    if (ik < 0) {
                        aIdsDone.push(aId)
                    }
                }
            },
            aIsDone: (aId) => {
                let isDone = this.$root.ListDoneActionId.includes(aId)
                return isDone || this.IdActionsDone.includes(aId)
            },
            toggleDone: (aId, isDone) => {
                const doneIds = this.IdActionsDone
                const i = doneIds.indexOf(aId)
                if (i > -1) {
                    if (!isDone) doneIds.splice(i, 1)
                } else if (isDone) doneIds.push(aId)
            },
            getActIdsDone: this.getActIdsDone,
        }
    },
    methods: {
        getMinS(mapGsa) {
            let minS = Number.MAX_SAFE_INTEGER
            for (let isb = 0; isb < mapGsa.length; isb++) {
                const ga = mapGsa[isb]
                const lstA = this.$root.ListAction.filter(x => ga.ActionIds.includes(x.Id))
                for (let ia = 0; ia < lstA.length; ia++) {
                    const act = lstA[ia]
                    setMinS(act.Start)
                }
            }
            if (minS === Number.MAX_SAFE_INTEGER) {
                return this.get1stDateNow()
            }
            const dNow = new Date()
            dNow.setHours(0, 0, 0, 0)
            const tNow = dNow.getTime()
            if (tNow < minS) {
                return tNow - 3 * 24000 * 3600
            }
            return minS
            function setMinS(start) {
                if (!start) return
                const mStart = start.getTime()
                if (mStart < minS) minS = mStart
            }
        },
        getMaxE(mapGsa) {
            let maxE = 0
            for (let isb = 0; isb < mapGsa.length; isb++) {
                const ga = mapGsa[isb]
                const lstA = this.$root.ListAction.filter(x => ga.ActionIds.includes(x.Id))
                for (let ia = 0; ia < lstA.length; ia++) {
                    const act = lstA[ia]
                    setMaxE(act.End)
                }
            }
            const maxS = this.getMaxS(mapGsa)
            if (maxE < 1) {
                const minS = this.getMinS(mapGsa)
                if (minS < maxS) return maxS + 6 * 24000 * 3600
                return minS + 69 * 24000 * 3600
            }
            if (maxE < maxS) {
                maxE = maxS + 24000 * 3600
            }
            const dNow = new Date()
            dNow.setHours(0, 0, 0, 0)
            const tNow = dNow.getTime()
            if (maxE < tNow) {
                return tNow + 3 * 24000 * 3600
            }
            return maxE + 6 * 24000 * 3600
            function setMaxE(end) {
                if (!end) return
                const eStart = end.getTime()
                if (maxE < eStart) maxE = eStart
            }
        },
        getMaxS(mapGsa) {
            let maxS = 0
            for (let isb = 0; isb < mapGsa.length; isb++) {
                const ga = mapGsa[isb]
                const lstA = this.$root.ListAction.filter(x => ga.ActionIds.includes(x.Id))
                for (let ia = 0; ia < lstA.length; ia++) {
                    const act = lstA[ia]
                    setMaxS(act.Start)
                }
            }
            return maxS
            function setMaxS(start) {
                if (!start) return
                const eStart = start.getTime()
                if (maxS < eStart) maxS = eStart
            }
        },
        daysInMonth(month, year) {  // month: 1-12
            return new Date(year, month, 0).getDate();
        },
        onScroll() {
            const el = this.$el
            const listLeft = el.querySelector('.list-left')
            if (!listLeft) return

            if (el.scrollLeft > 0) {
                listLeft.style.left = `${el.scrollLeft}px`
            } else {
                listLeft.style.left = ''
            }
            const table = el.querySelector('.vwCalendar')
            if (!table) return
            if (el.scrollTop > 0) {
                table.style.position = 'sticky'
                table.style.top = '0'
                listLeft.style.zIndex = '1'
            } else {
                table.style.position = ''
                table.style.top = ''
                listLeft.style.zIndex = ''
            }
        },
        stlWidthVwRight(isReset) {
            const vwRight = this.$el.querySelector('.view-right')
            if (!vwRight) return
            if (isReset) {
                vwRight.style.width = ''
                return
            }
            const table = vwRight.querySelector('.vwCalendar')
            if (!table) return
            vwRight.style.width = `${table.offsetWidth}px`
        },
        get1stDateNow() {
            const dNow = new Date()
            const yy = dNow.getFullYear()
            const mth = dNow.getMonth()
            return new Date(yy, mth, 1)
        },
        isExpand(sId) { return !this.IdSubsCollapse.includes(sId) },
        getActIdsDone(aIds) {
            const doneIds = this.IdActionsDone
            return doneIds.filter(id => aIds.includes(id))
        },
    },
    mounted() {
        this.stlWidthVwRight()

        const elm = this.$el
        window.fncQueuScrollToDateNow = () => {
            const spnNow = elm.querySelector(`.vwCalendar td > span.text-primary`)
            if (spnNow) {
                const _left = spnNow.offset().left
                elm.scroll({
                    top: 0,
                    left: _left - 666,
                    behavior: "smooth",
                });
            }

        }
    },
    beforeUpdate() { this.stlWidthVwRight(true) },
    updated() {
        this.stlWidthVwRight()

        processScroll()

        function processScroll() {
            if (typeof window.fncQueuScrollToDateNow == 'function') {
                window.fncQueuScrollToDateNow()
            }
            delete window.fncQueuScrollToDateNow
        }
        // function processDnd() {
        //     const srcSubId = window.SrcSubId
        //     const desSubId = window.DesSubId
        //     if (typeof srcSubId != 'number' || typeof desSubId != 'number') {
        //         delete window.SrcSubId
        //         delete window.DesSubId
        //         return
        //     }
        //     delete window.SrcSubId
        //     delete window.DesSubId
        // }
    },
});

Vue.component('vw-inventory', {
    inject: ['getNavIndex'],
    props: ['mains'],
    computed: {
        Index() { return this.getNavIndex() },
        ListMain() { return this.mains },
        RangeTime() {
            const mains = this.mains
            let minS = Number.MAX_SAFE_INTEGER,
                maxE = 0
            for (let im = 0; im < mains.length; im++) {
                const main = mains[im]
                setMinS(main.Start)
                setMaxE(main.End)
                for (let isb = 0; isb < main.Subs.length; isb++) {
                    const sub = main.Subs[isb]
                    setMinS(sub.Start)
                    setMaxE(sub.End)
                    for (let ia = 0; ia < sub.Actions.length; ia++) {
                        const act = sub.Actions[ia]
                        setMinS(act.Start)
                        setMaxE(act.End)
                    }
                }
            }
            return { MinTimeStart: minS, MaxTimeEnd: maxE }

            function setMinS(start) {
                if (!start) return
                const mStart = start.getTime()
                if (mStart < minS) minS = mStart
            }
            function setMaxE(end) {
                if (!end) return
                const eStart = end.getTime()
                if (maxE < eStart) maxE = eStart
            }
        },
        WidthCtx() {
            const rangeTime = this.RangeTime
            const minS = rangeTime.MinTimeStart
            const maxE = rangeTime.MaxTimeEnd
            const dTime = maxE - minS
            if (dTime < 1) return ''
            return `${TimePxUnit * dTime / (3600 * 24000)}px`

        },
    },
    provide() {
        return {
            getMinStart: () => {
                const rangeTime = this.RangeTime
                return rangeTime.MinTimeStart
            },
            getMaxEnd: () => {
                const rangeTime = this.RangeTime
                return rangeTime.MaxTimeEnd
            },
        }
    },

});
Vue.component('vw-customer', {
    props: ['mgactions'],
    data() {
        return {
            IdExpand: '',
        }
    },
    provide() {
        return {
            getDndOptions: this.getDndOptions,
            setExpandGa: (gaId, type) => {
                const tt = `${type}_${gaId}`
                if (this.IdExpand == tt) {
                    this.IdExpand = ''
                } else {
                    this.IdExpand = tt
                }
            },
            isExpandGa: (gaId, type) => { return this.IdExpand == `${type}_${gaId}` }
        }
    },
    methods: {
        getDndOptions(type) {
            const option = {
                handle: ".item-name",
            }
            switch (type) {
                case 1: // main
                    option.group = 'main'
                    break;
                case 2: // sub
                    option.group = 'sub'
                    option.handle = '.sub-wrap .item-name'
                    break;
                case 3: // action
                    option.group = 'action'
                    break;
            }
            return option
        },
    },
    //mounted() { },
    //updated() { },
    //beforeDestroy() { },
})