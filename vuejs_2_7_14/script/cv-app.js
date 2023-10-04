new Vue({
    el: '#cv-app',
    name: 'cv-app',
    data: {
        NavBar: {
            Index: 0,
            NavPages: ['Overview', 'Inventory', 'Customers', 'Products'],
            UserMenus: [
                { id: 1, url: '#new-project', title: 'New project...' },
                { id: 2, url: '#setting', title: 'Settings' },
                { id: 3, url: '#profile', title: 'Profile' },
            ],
            SearchText: '',
            User: { name: 'Dainb', email: 'dainb8x@gmail.com' }
        },
        Mains: [],
        ListModal: [],  // [{Type, Title, Body}]
    },
    computed: {
        Subs() {
            const subs = []
            for (let mi = 0; mi < this.Mains.length; mi++) {
                const main = this.Mains[mi]
                for (let si = 0; si < main.Subs.length; si++) {
                    const sub = main.Subs[si]
                    subs.push(sub)
                }
            }
            return subs
        },
    },
    provide() {
        return {
            setNavIndex: this.setNavIndex,
            getNavIndex: () => { return this.NavBar.Index },
            pushModal: (object) => {
                const lstModal = this.ListModal
                const oType = object.Type

                const index = lstModal.findIndex(x => oType == x.Type)

                if (index < 0) lstModal.push(object)
                else lstModal.splice(index, 1, object)  // replace

            },
            getModalData: () => {
                const lstModal = this.ListModal
                const len = lstModal.length
                if (!len) return null

                const obj = lstModal[len - 1]
                return obj
            },
            closeModal: this.closeModal,
            saveModal: (data) => {
                const oType = data.Type
                switch (oType) {
                    case 'UserInfo':
                        const lstMenu = this.NavBar.UserMenus
                        const item = lstMenu.find(x => x.id === data.id)
                        if (item) {
                            if (data.title.trim() !== '') item.title = data.title
                            if (data.url.trim() !== '') item.url = data.url
                        }
                        break;
                    case 'SignOut':

                        break;
                }
                this.closeModal()
            },
            setSearchText: (txt) => { this.SearchText = txt },
            newGuid: this.newGuid,
        }
    },
    methods: {
        setNavIndex(index) { this.NavBar.Index = index },
        closeModal() { this.ListModal.pop() },
        newGuid() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            )
        },
    },
    mounted() {
        this.Mains = getDataMains()
    },
})
function getDataMains() {
    const Mains = []
    let mLen = getRandomInt(1, 21)
    let sId = getRandomInt(6, 9),
        aId = getRandomInt(69, 96)
    for (let Id = 1; Id <= mLen; Id++) {
        const mName = `main goal ${Id}`
        const mStart = getRandStart()
        const mEnd = getRandomEnd(mStart)

        const sLen = getRandomInt(1, 9)
        const Subs = []
        for (let si = 1; si <= sLen; si++) {
            const sName = `subG ${si} from ${mName}`
            const sStart = getRandStart(mStart)
            const sEnd = getRandomEnd(sStart)

            const Actions = []
            const aLen = getRandomInt(1, 6)
            for (let ai = 1; ai <= aLen; ai++) {
                const Name = `Action ${ai} (${sName})`
                const Start = getRandStart(sStart)
                const End = getRandomEnd(Start)
                Actions.push({ Id: aId++, Name, Start, End })
            }
            Actions.sort(sortDate);
            Subs.push({
                Id: sId++, Name: sName,
                Start: sStart, End: sEnd, Actions
            })
        }
        Subs.sort(sortDate);
        Mains.push({
            Id, Name: mName,
            Start: mStart, End: mEnd, Subs
        })
        Mains.sort(sortDate);
    }

    return Mains
}
function sortDate(d1, d2) {
    if (!d1.Start) return 1
    if (!d2.Start) return -1
    return d1.Start.getTime() - d2.Start.getTime()
}
function getRandomInt(min, max) {   // min <= x < max
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}
function getRandStart(bStart) {
    if (bStart) {
        const dayPlus = getRandomInt(0, 15)
        const dTime = dayPlus * 3600 * 24000    // milisec
        return new Date(bStart.getTime() + dTime)
    }
    if (Math.random() < 0.6) return null
    const year = getRandomInt(2021, 2024)
    const month = getRandomInt(1, 13)
    const day = getRandomInt(1, 28)
    return new Date(year, month - 1, day)
}
function getRandomEnd(start) {
    if (!start) return null
    if (Math.random() < 0.5) return null
    const timeE = start.getTime()           // mili sec
    const delDay = getRandomInt(29, 90)        // day
    return new Date(timeE + delDay * 3600 * 24000)
}