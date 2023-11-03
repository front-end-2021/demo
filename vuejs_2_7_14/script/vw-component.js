Vue.component('vw-overview', {
    props: ['subs'],
    data() {
        return {
            IdActionsDone: [],
            IdSubsCollapse: [],
            IdSubsSync: [],
        }
    },
    computed: {
        MinStart() { return this.getMinS(this.subs) },
        MaxEnd() { return this.getMaxE(this.subs) },
        ListMonth() {
            const subs = this.subs

            const dNow = new Date()
            const mNow = dNow.getMonth() + 1
            const yNow = dNow.getFullYear()

            const minS = this.getMinS(subs)
            const maxE = this.getMaxE(subs)

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
            const subs = this.subs

            const dtNow = new Date()
            const mNow = dtNow.getMonth() + 1
            const yNow = dtNow.getFullYear()
            const dNow = dtNow.getDate()

            const minS = this.getMinS(subs)
            const maxE = this.getMaxE(subs)

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
    },
    provide() {
        return {
            getMinStart: () => { return this.getMinS(this.subs) },
            getMaxEnd: () => { return this.getMaxE(this.subs) },
            toggleDone: (aId, isDone) => {
                const ids = this.IdActionsDone
                const i = ids.indexOf(aId)
                if (i > -1) {
                    if (!isDone) ids.splice(i, 1)
                } else if (isDone) ids.push(aId)
            },
            aIsDone: this.aIsDone,
            toggleExpand: (sId) => {
                const ii = this.IdSubsCollapse.indexOf(sId)
                if (ii > -1) this.IdSubsCollapse.splice(ii, 1)
                else this.IdSubsCollapse.push(sId)
            },
            isExpand: this.isExpand,
            sIsSync: this.sIsSync,
            syncSubToCloud: (sId) => {
                const ii = this.IdSubsSync.indexOf(sId)
                if (ii > -1) {
                    const sub = this.subs.find(x => x.Id == sId)
                    const subCopy = JSON.parse(JSON.stringify(sub))
                    console.log('sync sub to server', subCopy)
                    this.IdSubsSync.splice(ii, 1)
                }
            },
        }
    },
    methods: {
        getMinS(subs) {
            let minS = Number.MAX_SAFE_INTEGER
            for (let isb = 0; isb < subs.length; isb++) {
                const sub = subs[isb]
                for (let ia = 0; ia < sub.Actions.length; ia++) {
                    const act = sub.Actions[ia]
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
        getMaxE(subs) {
            let maxE = 0
            for (let isb = 0; isb < subs.length; isb++) {
                const sub = subs[isb]
                for (let ia = 0; ia < sub.Actions.length; ia++) {
                    const act = sub.Actions[ia]
                    setMaxE(act.End)
                }
            }
            const maxS = this.getMaxS(subs)
            if (maxE < 1) {
                const minS = this.getMinS(subs)
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
        getMaxS(subs) {
            let maxS = 0
            for (let isb = 0; isb < subs.length; isb++) {
                const sub = subs[isb]
                for (let ia = 0; ia < sub.Actions.length; ia++) {
                    const act = sub.Actions[ia]
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
        aIsDone(aId) { return this.IdActionsDone.includes(aId) },
        isExpand(sId) { return !this.IdSubsCollapse.includes(sId) },
        sIsSync(sId) { return this.IdSubsSync.includes(sId) },
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
        processDnd.call(this)

        function processScroll() {
            if (typeof window.fncQueuScrollToDateNow == 'function') {
                window.fncQueuScrollToDateNow()
            }
            delete window.fncQueuScrollToDateNow
        }
        function processDnd() {
            const srcSubId = window.SrcSubId
            const desSubId = window.DesSubId
            if (typeof srcSubId != 'number' || typeof desSubId != 'number') {
                delete window.SrcSubId
                delete window.DesSubId
                return
            }
            if (srcSubId === desSubId) {
                if (!this.IdSubsSync.includes(srcSubId)) this.IdSubsSync.push(srcSubId)
            } else {
                if (!this.IdSubsSync.includes(srcSubId)) this.IdSubsSync.push(srcSubId)
                if (!this.IdSubsSync.includes(desSubId)) this.IdSubsSync.push(desSubId)
            }
            delete window.SrcSubId
            delete window.DesSubId
        }
    },
});

Vue.component('vw-inventory', {
    inject: ['getNavIndex' ],
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
    props: ['mains'],
    data() {
        return {
            MCount: 2
        }
    },
    provide() {
        return {
            getMCount: () => { return this.MCount },
            getDndOptions: this.getDndOptions,
        }
    },
    methods: {
        getDndOptions(type) {
            const option = {
                swap: true,
                handle: ".item-name",
            }
            switch(type) {
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
        setMCount() {
            const sViewA = this.$el.querySelector('.sub-viewaction')
            if (!sViewA) return

            const itemWidth = 288
            this.MCount = Math.floor(sViewA.offsetWidth / itemWidth)
        },
        onResize() {
            this.setMCount()
        },
        isShowSub(sub){
            let isShow = this.$root.isInSearch(sub)
            if(isShow) return true
            for(let aa = 0; aa < sub.Actions.length; aa++) {
                const action = sub.Actions[aa]
                isShow = this.$root.isInSearch(action)
                if(isShow) return true
            }
            return false
        },
    },
    mounted() {
        this.setMCount()
        window.addEventListener('resize', this.onResize)
    },
    updated() {
        this.setMCount()
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
})