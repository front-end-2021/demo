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

        window.addEventListener('scroll', this.onCancelSetName)
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

            const html = document.getElementsByTagName('html')[0]
            html.scrollLeft = window.DainbCacheScrollLeft
            delete window.DainbCacheScrollLeft
        }
    },
    methods: {
        onObsVisible(isVisible, entry) {
            this.IsInView = isVisible
        },
        ondblclickName() {
            window.DainbCacheScrollLeft = document.getElementsByTagName('html')[0].scrollLeft
            this.IsEditName = true
        },
        onCancelSetName() {
            this.IsEditName = false
            this.Name = this.item.Name
        },
    },
    beforeDestroy() {

        window.removeEventListener('scroll', this.onCancelSetName)
    },
}
Vue.component('item-action', {
    mixins: [itemGA],
    props: ['mid', 'sid', 'index', 'actions'],
    inject: ['getMinStart', 'getMaxEnd'],
    computed: {
        domId() { return `m_${this.mid}-s_${this.sid}-a_${this.item.Id}` },
    },
    //watch: { },
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
    // watch: { },
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
    computed: {
        ClssStatus() {
            const item = this.item
            if (!item.End) return 'bg-primary'
            const dNow = new Date()
            const end = item.End
            const dY = dNow.getFullYear()
            const eY = end.getFullYear()
            if (dY < eY) return 'bg-primary'
            if (dY > eY) return 'bg-success'
            const dM = dNow.getMonth()
            const eM = end.getMonth()
            if (dM < eM) return 'bg-primary'
            if (dM > eM) return 'bg-success'
            const dD = dNow.getDate()
            const eD = end.getDate()
            if (dD < eD) return 'bg-primary'
            return 'bg-success'
        },
    },
}
Vue.component('action-view', {
    mixins: [MixActionOvw],
    computed: {
        Start() {
            const item = this.item
            return this.getDDMM(item.Start)
        },
        End() {
            const item = this.item
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
            if (!item.End) return 'Cong'
            const dNow = new Date()
            const end = item.End
            const dY = dNow.getFullYear()
            const eY = end.getFullYear()
            if (dY < eY) return 'Cong'
            if (dY > eY) return 'Done'
            const dM = dNow.getMonth()
            const eM = end.getMonth()
            if (dM < eM) return 'Cong'
            if (dM > eM) return 'Done'
            const dD = dNow.getDate()
            const eD = end.getDate()
            if (dD < eD) return 'Cong'
            return 'Done'
        },
    },
    provide() {
        return {
        }
    },
    methods: {
        getDDMM(date) {
            if (!date) return '-'
            const dd = date.getDate()
            const mm = date.getMonth()
            return `${dd}/${mm + 1}`
        },
        onClickScrollTo() {
            const overview = document.querySelector('.dnbOverview')
            if (!overview) return

            const id = this.item.Id
            const actTime = document.querySelector(`[atime-id="${id}"]`)
            if (!actTime) return
            const _left = overview.scrollLeft + actTime.offset().left
            overview.scroll({
                left: _left - 666 + 180,
                behavior: "smooth",
            });
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
                const maxE = this.getMaxEnd()
                const minS = this.getMinStart()
                dTime = maxE - minS + 24000 * 3600
                return `${DayPxUnit * dTime / 24000 / 3600}px`
            }
            const start = item.Start.getTime()
            if (!item.End) {
                const maxE = this.getMaxEnd()
                dTime = maxE - start + 24000 * 3600
                return `${DayPxUnit * dTime / 24000 / 3600}px`
            }
            const end = item.End.getTime()
            dTime = end - start + 24000 * 3600
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
            if (!item.Start && !item.End)
                return
            if (item.Start && item.End)
                return { borderRadius: '0.25rem' }
            if (item.Start)
                return {
                    borderTopLeftRadius: '0.25rem',
                    borderBottomLeftRadius: '0.25rem',
                }
            if (item.End)
                return {
                    borderTopRightRadius: '0.25rem',
                    borderBottomRightRadius: '0.25rem',
                }
        },
    },

})

Vue.component('modal-pop', {
    template: '#modal-pop-temp',
    inject: ['getModalData', 'closeModal', 'saveModal'],
    data() {
        return {}
    },
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
    watch: {},
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