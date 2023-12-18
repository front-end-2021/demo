const cvApp = new Vue({
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
        ListGoal: [],           // { Id: int, Name, Status, Start, End }
        ListAction: [],         // { Id: int, Name, Status, Start, End }
        ListUser: [],           // { Id: int, Name, LastName, Email }
        ListMapGoalAction: [],  // { GoalId: int, ActionIds: [int] }

        Mains: [],
        ListModal: [],  // [{Type, Title, Body}]
    },
    computed: {
        ListMains() {
            const txtSearch = this.NavBar.SearchText
            if (txtSearch == '') return this.Mains
            const lstMain = []
            for (let mm = 0; mm < this.Mains.length; mm++) {
                const main = this.Mains[mm]
                if (main.Name.includes(txtSearch)) {
                    lstMain.push(main)
                    continue
                }
                for (let ss = 0; ss < main.Subs.length; ss++) {
                    const sub = main.Subs[ss]
                    if (sub.Name.includes(txtSearch)) {
                        lstMain.push(main)
                        break
                    }
                    let isInSearch = false
                    for (let aa = 0; aa < sub.Actions.length; aa++) {
                        const action = sub.Actions[aa]
                        if (action.Name.includes(txtSearch)) {
                            lstMain.push(main)
                            isInSearch = true
                            break
                        }
                    }
                    if (isInSearch) break
                }
            }
            return lstMain
        },
    },
    provide() {
        return {
            setNavIndex: this.setNavIndex,
            getNavIndex: () => { return this.NavBar.Index },
            closeModal: this.closeModal,
            saveModal: (data, entry) => {
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
                    case 'EditGoal':
                        const goal = this.ListGoal.find(x => x.Guid == entry.Guid)
                        if(goal) {
                            goal.Name = entry.Name
                            goal.Start = new Date(entry.StartStr)
                            goal.End = new Date(entry.EndStr)
                        }
                        break;
                    case 'EditAction':
                        const action = this.ListAction.find(x => x.Guid == entry.Guid)
                        if(action) {
                            action.Name = entry.Name
                            action.Start = new Date(entry.StartStr)
                            action.End = new Date(entry.EndStr)
                        }
                        break;
                }
            },
        }
    },
    methods: {
        setNavIndex(index) { this.NavBar.Index = index },
        closeModal() { this.ListModal.pop() },
        setSearchText(txt) { this.NavBar.SearchText = txt.trim() },
        isInSearch(item) {
            const txtSearch = this.NavBar.SearchText
            if (txtSearch == '') return true
            if (item.Name.includes(txtSearch)) return true
            return false
        },
        pushModal(object) {
            const lstModal = this.ListModal
            const oType = object.Type

            const index = lstModal.findIndex(x => oType == x.Type)

            if (index < 0) lstModal.push(object)
            else lstModal.splice(index, 1, object)  // replace

        },
    },
    beforeMount() {
        this.Mains = getDataMains() 
        for (let mm = 0; mm < this.Mains.length; mm++) {
            const main = this.Mains[mm]
            main.Guid = newGuid()
            for (let ss = 0; ss < main.Subs.length; ss++) {
                const sub = main.Subs[ss]
                sub.Guid = newGuid()
                for (let aa = 0; aa < sub.Actions.length; aa++) {
                    const action = sub.Actions[aa]
                    action.Guid = newGuid()
                }
            }
        }

        const pListGoal = new Promise((res) => {
            const goals = getListGoal()
            for (let ii = 0; ii < goals.length; ii++) {
                const goal = goals[ii]
                goal.Guid = newGuid()
                this.ListGoal.push(goal)
            }
            setTimeout(() => { res(goals) }, getRandomInt(300, 600))
        })
        const pListAction = new Promise((res) => {
            const actions = getListAction()
            for (let ii = 0; ii < actions.length; ii++) {
                const action = actions[ii]
                action.Guid = newGuid()
                this.ListAction.push(action)
            }
            setTimeout(() => { res(actions) }, getRandomInt(300, 600))
        })
        const pListUser = new Promise((res) => {
            const users = getListUser()
            this.ListUser = users
            setTimeout(() => { res(users) }, getRandomInt(300, 600))
        })

        Promise.all([pListGoal, pListAction, pListUser]).then((values) => {
            const goals = values[0]
            const actions = values[1]
            this.ListMapGoalAction = getMapsGoalAction(goals, actions)
//            return values
        })
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