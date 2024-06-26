const cvApp = new Vue({
    el: '#cv-app',
    name: 'cv-app',
    data: {
        NavBar: {
            Index: 0,
            NavPages: ['Overview', 'Inventory', 'Customers'],
            UserMenus: [
                { id: 1, url: '#new-project', title: 'New project...' },
                { id: 2, url: '#setting', title: 'Settings' },
                { id: 3, url: '#profile', title: 'Profile' },
            ],
            User: { name: 'Dainb', email: 'dainb8x@gmail.com' }
        },
        SearchText: '',
        ListGoal: [],           // { Id: int, Name, Status, Start, End }
        ListAction: [],         // { Id: int, Name, Status, Start, End }
        ListUser: [],           // { Id: int, Name, LastName, Email }
        ListMapGoalAction: [],  // { GoalId: int, ActionIds: [int] }
        ListDoneActionId: [],   // [int]
        ListDoneGoalId: [],     // [int]

        Mains: [],
        ListModal: [],  // [{Type, Title, Body}]
    },
    computed: {
        ListMains() {
            const txtSearch = this.SearchText
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
                    let is_View = false
                    for (let aa = 0; aa < sub.Actions.length; aa++) {
                        const action = sub.Actions[aa]
                        if (action.Name.includes(txtSearch)) {
                            lstMain.push(main)
                            is_View = true
                            break
                        }
                    }
                    if (is_View) break
                }
            }
            return lstMain
        },
        ProxyGoals(){
            const lstGoal = []
            const goals = this.ListGoal
            const actions = this.ListAction
            const mapGactions = this.ListMapGoalAction
            for(let gg = 0; gg < goals.length; gg++) {
                const goal = goals[gg]
                const mGoal = mapGactions.find(x => x.GoalId == goal.Id)
                if(!mGoal) continue
                const lstA = []
                const aIds = mGoal.ActionIds
                for(let aa = 0; aa < actions.length; aa++) {
                    const act = actions[aa]
                    if(!aIds.includes(act.Id)) continue
                    lstA.push(act)
                }
                const handler1 = { 
                    get(target, prop, receiver) {
                        switch(prop){
                            case 'Actions': return lstA
                        }    
                        return Reflect.get(...arguments);
                    },
                }
                const pGoal = new Proxy(goal, handler1)
                lstGoal.push(pGoal)
            }
            return lstGoal
        },
        DataGoals(){
            const txtSearch = this.SearchText
            if (txtSearch == '') return this.ListGoal
            const lstG = []
            for(let gg = 0; gg < this.ListGoal.length; gg++) {
                const goal = this.ListGoal[gg]
                if (goal.Name.includes(txtSearch)) {
                    lstG.push(goal)
                }
            }
            const tt = Date.now()
            console.log('computed DataGoals', tt - window.DnbTimer)
            return lstG
        },
        DataActions(){
            let txtSearch = this.SearchText
            if (txtSearch == '') return this.ListAction
            txtSearch = txtSearch.toLowerCase()
            const lstA = []
            for(let gg = 0; gg < this.ListAction.length; gg++) {
                const goal = this.ListAction[gg]
                if (goal.Name.toLowerCase().includes(txtSearch)) {
                    lstA.push(goal)
                }
            }
            const tt = Date.now()
            console.log('computed DataActions', tt - window.DnbTimer)
            return lstA
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
                            goal.Start = entry.Start
                            goal.End = entry.End
                        }
                        break;
                    case 'EditAction':
                        const action = this.ListAction.find(x => x.Guid == entry.Guid)
                        if(action) {
                            action.Name = entry.Name
                            action.Start = entry.Start
                            action.End = entry.End
                        }
                        break;
                }
            },
        }
    },
    methods: {
        setNavIndex(index) { this.NavBar.Index = index },
        closeModal() { this.ListModal.pop() },
        setSearchText(txt) { this.SearchText = txt.trim() },
        pushModal(object) {
            const lstModal = this.ListModal
            const oType = object.Type

            const index = lstModal.findIndex(x => oType == x.Type)

            if (index < 0) lstModal.push(object)
            else lstModal.splice(index, 1, object)  // replace

        },
    },
    created() {
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
            }
            setTimeout(() => { res(goals) }, 123)
        })
        const pListAction = new Promise((res) => {
            const actions = getListAction()
            for (let ii = 0; ii < actions.length; ii++) {
                const action = actions[ii]
                action.Guid = newGuid()
            }
            setTimeout(() => { res(actions) }, 345)
        })
        const pListUser = new Promise((res) => {
            const users = getListUser()
            setTimeout(() => { res(users) }, 456)
        })

        Promise.all([pListGoal, pListAction, pListUser]).then((values) => {
            const goals = values[0]
            const actions = values[1]
            const users = values[2]            
            this.ListGoal = goals
            this.ListAction = actions
            this.ListUser = users

            this.ListMapGoalAction = getMapsGoalAction(goals, actions) 
            window.DnbTimer = Date.now()
        })
    },
    //mounted(){ },
    updated(){        
        const tt = Date.now()
        console.group('app updated')
        console.log('time', tt - window.DnbTimer)
        window.DnbTimer = Date.now()
        console.groupEnd()
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