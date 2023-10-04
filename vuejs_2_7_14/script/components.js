const TimePxUnit = 10       // 1day = 10px
function dateToString(date1) {
    const opt = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const dtFormat = new Intl.DateTimeFormat('en-GB', opt);
    return dtFormat.format(date1) // Expected output: "Friday, 1 June 2012"
}
Vue.component('nav-bar', {
    props: ['view-index'],
    inject: ['setNavIndex', 'pushModal', 'setSearchText'],
    data() {
        return {
            TextSearch: this.$root.SearchText,
        }
    },
    computed: {
        NavMenus() { return this.$root.NavBar.NavPages },
        UserMenus() { return this.$root.NavBar.UserMenus },
        User() { return this.$root.NavBar.User },
    },
    watch: {
        TextSearch(txt) { this.setSearchText(txt) },
    },
    methods: {
        onSearch() {
            console.log('keyup Enter onSearch', this.TextSearch)
        },
        openModal(mItem, index) {
            const obj = Object.assign({ Type: 'UserInfo' }, mItem)
            this.pushModal(obj)
        },
        signOut(user) {
            const obj = Object.assign({ Type: 'SignOut' }, user)
            this.pushModal(obj)
        },
    },
});
const itemGA = {
    props: ['item'],
    data() {
        return {
            IsInView: true,
            IsEditName: false,
            Name: this.item.Name,
        }
    },
    computed: {
        ShowDate() {
            if (!this.IsInView) return false
            if (this.item.Start) return true
            if (this.item.End) return true
            return false
        },
        ToStart() {
            const s = this.item.Start
            if (!s) return
            return dateToString(s)
        },
        ToEnd() {
            const e = this.item.End
            if (!e) return
            return dateToString(e)
        },
    },
    mounted() {

        window.addEventListener('scroll', this.onWindowScroll)
    },
    beforeUpdate() {
        heightWrapInVisible.call(this)

        function heightWrapInVisible() {
            if (this.IsInView) {
                this.$el.style.height = ''
                return
            }
            const height = this.$el.offsetHeight
            this.$el.style.height = `${height}px`
        }
    },
    updated() {
        focusEditName.call(this)

        function focusEditName() {
            if (!this.IsEditName) return
            this.$el.querySelector('input.ieName').focus()

            const html = document.querySelector('html')
            if (html.scrollLeft !== window.DainbCacheScrollLeft) {
                window.DnbIsChangeScrollLeft = true
            }
            html.scrollLeft = window.DainbCacheScrollLeft
            delete window.DainbCacheScrollLeft
        }
    },
    methods: {
        onObsVisible(isVisible, entry) {
            this.IsInView = isVisible
        },
        ondblclickName() {
            window.DainbCacheScrollLeft = document.querySelector('html').scrollLeft
            this.IsEditName = true
        },
        onCancelSetName() {
            this.IsEditName = false
            this.Name = this.item.Name
        },
        onWindowScroll(e) {
            if (typeof window.DnbIsChangeScrollLeft == 'undefined') {
                this.onCancelSetName()
            } else delete window.DnbIsChangeScrollLeft
        },
    },
    beforeDestroy() {

        window.removeEventListener('scroll', this.onWindowScroll)
    },
}
Vue.component('item-action', {
    mixins: [itemGA],
    props: ['mid', 'sid', 'index', 'actions'],
    inject: ['getMinStart', 'getMaxEnd'],
    computed: {
        domId() { return `m_${this.mid}-s_${this.sid}-a_${this.item.Id}` },
    },
    methods: {
        onSaveName() {
            this.IsEditName = false
            if (this.Name.trim() == '') {
                this.Name = this.item.Name
                return
            }
            this.item.Name = this.Name
        },
        styleWidth() {
            const item = this.item
            const s = item.Start
            if (!s) return
            const sTime = s.getTime()
            const e = item.End
            if (!item.End) {
                const itemPrev = this.actions[this.index - 1]
                if (!itemPrev) return
                if (!itemPrev.End) return

                const eTimePrev = itemPrev.End.getTime()
                const dTime = sTime - eTimePrev
                if (0 < dTime) {
                    const maxE = this.getMaxEnd()
                    const dTimeMax = maxE - sTime
                    if (0 < dTimeMax) {
                        const padding = 24
                        return {
                            width: `${TimePxUnit * dTimeMax / (3600 * 24000) - padding}px`
                        }
                    }
                }
                return
            }
            const dTime = e.getTime() - sTime
            return { width: `${TimePxUnit * dTime / (3600 * 24000)}px` }
        },
        styleInline() {
            const item = this.item
            if (!item.Start) return
            const sTime = item.Start.getTime()
            const itemPrev = this.actions[this.index - 1]
            if (!item.End) {
                if (!itemPrev) {
                    return { overflow: 'hidden' }
                }
                if (!itemPrev.End) return { overflow: 'hidden' }

                const eTimePrev = itemPrev.End.getTime()
                const dTime = sTime - eTimePrev
                if (0 < dTime) {
                    return {
                        display: 'inline-block', overflow: 'hidden'
                    }
                }
                return
            }
            const eTime = item.End.getTime()
            const itemNext = this.actions[this.index + 1]
            if (itemNext) {
                if (!itemNext.Start) {
                    if (!itemPrev) return
                    if (!itemPrev.End) return
                    const eTimePrev = itemPrev.End.getTime()
                    const dTime = sTime - eTimePrev
                    if (0 < dTime) {
                        return {
                            display: 'inline-block', overflow: 'hidden'
                        }
                    }
                    return
                }

                const sTimeNext = itemNext.Start.getTime()
                const dTime = sTimeNext - eTime
                if (dTime < 0) return
            }

            return {
                display: 'inline-block', overflow: 'hidden'
            }
        },
        styleMrgLeft() {        // margin-left, inline-block
            const item = this.item
            if (!item.Start) return
            const sTime = item.Start.getTime()
            const sTime0 = this.getMinStart()
            if (this.index == 0) {
                const dTime = sTime - sTime0
                if (0 < dTime) return { marginLeft: `${TimePxUnit * dTime / (3600 * 24000)}px` }
                return
            }

            const itemPrev = this.actions[this.index - 1]
            if (!itemPrev) return

            if (!itemPrev.End) {
                const dTime0 = sTime - sTime0
                if (dTime0 < 0) return
                return { marginLeft: `${TimePxUnit * dTime0 / (3600 * 24000)}px` }
            }

            const eTimePrev = itemPrev.End.getTime()
            const dTime = sTime - eTimePrev
            if (dTime < 0) {
                const dTime0 = sTime - sTime0
                if (dTime0 < 0) return

                return { marginLeft: `${TimePxUnit * dTime0 / (3600 * 24000)}px` }
            }

            return { marginLeft: `${TimePxUnit * dTime / (3600 * 24000)}px` }
        },
    },
});

const itemGoal = {
    props: ['type'],
    methods: {
        onSaveName() {
            this.IsEditName = false
            if (this.Name.trim() == '') {
                this.Name = this.item.Name
                return
            }
            this.item.Name = this.Name
        },
    }
}
Vue.component('item-subgoal', {
    template: '#goal-item-temp',
    mixins: [itemGA, itemGoal],
    props: ['mid'],
    inject: ['getMinStart'],
    computed: {
        domId() { return `m_${this.mid}-s_${this.item.Id}` },
    },
    provide() {
        return {
            getMinStart: () => {
                if (this.item.Start) {
                    return this.item.Start.getTime()
                }
                return this.getMinStart()
            }
        }
    },
});

Vue.component('item-mgoal', {
    template: '#goal-item-temp',
    mixins: [itemGA, itemGoal],
    computed: {
        domId() { return `m_${this.item.Id}` },
    },
});
const MixActionOvw = {
    props: ['item'],
    inject: ['aIsDone'],
    computed: {
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
    },
}
Vue.component('action-view', {
    mixins: [MixActionOvw],
    inject: ['toggleDone'],
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

                return this.getDDMM(new Date(tStart + 24000 * 3600))
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
        IsDoneDisable(){
            const item = this.item
            if(item.End) {
                const dNow = new Date()
                dNow.setHours(0, 0, 0, 0)
                const tNow = dNow.getTime()
                const tEnd = item.End.getTime()
                if(tEnd < tNow) {
                    return true
                }
            }
            return false
        },
    },
    methods: {
        getDDMM(date) {
            if (!date) return '-'
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
            if (!item.End) return

            this.scrollToX(-513, true)
        },
        checkToggleDone(isDone) {
            const item = this.item
            this.toggleDone(item.Id, isDone)
        },
    },
});

Vue.component('sub-view', {
    props: ['item'],
    inject: ['getKeyAction'],
});
const DayPxUnit = 20       // 1day = 20px
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

Vue.component('modal-pop', {
    inject: ['getModalData', 'closeModal', 'saveModal'],
    computed: {
        title() {
            const data = this.getModalData()
            if (data == null) return null
            switch (data.Type) {
                case 'UserInfo': return 'Account Info'
                case 'SignOut': return 'Login'
                default: return null
            }
        },
        data() {
            const data = this.getModalData()
            if (data == null) return {}
            return data
        },
        message() {
            const data = this.getModalData()
            if (data == null) return null
            switch (data.Type) {
                case 'UserInfo': return 'Save'
                case 'SignOut': return 'Sign in'
                default: return null
            }
        }
    },
    methods: {
        saveAndClose(data) {
            switch (data.Type) {
                case 'UserInfo':
                    this.saveModal(data)
                    break
                case 'SignOut':
                    this.saveModal(data)
                    break;
                default:
            }
        }
    },
});