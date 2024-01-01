const TimePxUnit = 10       // 1day = 10px

Vue.component('nav-bar', {
    props: ['view-index'],
    inject: ['setNavIndex'],
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
        TextSearch(txt) { this.$root.setSearchText(txt) },
    },
    methods: {
        onSearch() {
            console.log('keyup Enter onSearch', this.TextSearch)
        },
        openPopInfoUser(mItem) {
            const obj = Object.assign({ Type: 'UserInfo' }, mItem)  // {id, url, title}
            this.$root.pushModal(obj)
        },
        openPopSignOut() {
            const user = this.$root.NavBar.User
            const obj = Object.assign({ Type: 'SignOut' }, user)
            this.$root.pushModal(obj)
        },
    },
});
const itemObsev = {
    data() {
        return {
            IsInView: true,
        }
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
    methods: {
        onObsVisible(isVisible, entry) {
            if (window.CustomerDndSrcId) return

            this.IsInView = isVisible
        },
    },
}
const itemGA = {
    props: ['item'],
    computed: {
        ShowDate() {
            if (this.item.Start) return true
            if (this.item.End) return true
            return false
        },
        ToStart() {
            const s = this.item.Start
            if (!s) return
            return s.stringFormat('wek, dd MM YYYY')
        },
        ToEnd() {
            const e = this.item.End
            if (!e) return
            return e.stringFormat('wek, dd MM YYYY')
        },
    },
}
const itemEditable = {
    data() {
        return {
            IsEditName: false,
            Name: this.item.Name,
        }
    },
    mounted() {
        window.addEventListener('scroll', this.onWindowScroll)
    },
    methods: {
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
    beforeDestroy() {

        window.removeEventListener('scroll', this.onWindowScroll)
    },
}
Vue.component('item-action', {
    mixins: [itemObsev, itemGA, itemEditable],
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
    mixins: [itemObsev, itemGA, itemEditable, itemGoal],
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
    mixins: [itemObsev, itemGA, itemEditable, itemGoal],
    computed: {
        domId() { return `m_${this.item.Id}` },
    },
});

Vue.component('modal-pop', {
    inject: ['closeModal', 'saveModal'],
    data() {
        return {
            entry: {},
            isModified: false
        }
    },
    computed: {
        lblHead() {
            const lstM = this.$root.ListModal
            const data = lstM[lstM.length - 1]
            if (data == null) return null
            if (data == undefined) return null
            switch (data.Type) {
                case 'UserInfo': return 'Account Info'
                case 'SignOut': return 'Login'
                case 'EditGoal': return 'Edit Goal'
                case 'EditAction': return 'Edit Action'
                default: return null
            }
        },
        data() {
            const lstM = this.$root.ListModal
            const data = lstM[lstM.length - 1]
            if (data == undefined) return {}
            if (data == null) return {}
            if (data.Type == 'EditGoal' || data.Type == 'EditAction') {
                this.entry.Guid = data.Guid
                this.entry.Name = data.Name
                this.entry.StartMin = '2023-09-01'
                this.entry.EndMax = '2169-12-31'

                this.entry.StartStr = this.getYYYYMMdd(data.Start)

                this.entry.EndStr = this.getYYYYMMdd(data.End)
            }
            return data
        },
        lblSaveAndClose() {
            const lstM = this.$root.ListModal
            const data = lstM[lstM.length - 1]
            if (data == null) return null
            switch (data.Type) {
                case 'EditGoal':
                case 'EditAction':
                case 'UserInfo': return 'Save'
                case 'SignOut': return 'Sign in'
                default: return null
            }
        }
    },
    methods: {
        saveAndClose() {
            const data = this.data
            switch (data.Type) {
                case 'UserInfo':
                    this.saveModal(data)
                    break;
                case 'SignOut':
                    this.saveModal(data)
                    break;
                case 'EditGoal':
                case 'EditAction':
                    this.saveModal(data, this.entry)
                    break;
                default:
                    break;
            }
            this.entry = {}
            this.closeModal()
        },
        closePop() {
            const data = this.data
            switch (data.Type) {
                case 'UserInfo':
                case 'SignOut':
                    this.entry = {}
                    this.closeModal()
                    break;
                case 'EditGoal':
                case 'EditAction':
                    if (isChange.call(this)) {
                        if (confirm('on Data change') == true) {
                            this.saveAndClose()
                        } else {
                            this.entry = {}
                            this.closeModal()
                        }
                    }
                    function isChange() {
                        const entry = this.entry
                        if (entry.Name != data.Name) return true

                        const oldStart = this.getYYYYMMdd(data.Start)
                        if (entry.StartStr != oldStart) return true

                        const oldEnd = this.getYYYYMMdd(data.End)
                        if (entry.EndStr != oldEnd) return true

                        return false
                    }
                    break;
                default:
                    this.entry = {}
                    this.closeModal()
                    break;
            }
        },
        onChangeInput(type, e) {
            switch (type) {
                case 'start': {
                    const val = e.target.value
                    this.$el.querySelector(`[name="goal-end"]`).setAttribute('min', val)
                    break;
                }
                case 'end': {
                    const val = e.target.value
                    this.$el.querySelector(`[name="goal-start"]`).setAttribute('max', val)
                    break;
                }
            }
        },
        getYYYYMMdd(dt) {
            if (dt instanceof Date) {
                let date = dt.getDate()
                if (date < 10) date = `0${date}`
                let month = dt.getMonth() + 1
                if (month < 10) month = `0${month}`
                return `${dt.getFullYear()}-${month}-${date}`

            }
        },
    },
});