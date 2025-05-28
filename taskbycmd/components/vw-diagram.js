import { genKeyHex } from "../common.js";
import {
    getCommands, ptrnNewShedules, patternNewPlans,
    patternNewUser, patternEditUser
} from "../commands.js";
export const ViewCommands = {
    template: `#tmp-commands`,
    name: "View_Command",
    display: "View.Command",
    //inject: [''],
    // props: ['item'],
    data() {
        return {
            TxtCommand: `New schedule Daily meeting from 9:30am to 9:45am. Make meeting Planning start 2:00pm end 5:00pm
            create Timetable Retro meeting begin 10:00am end 12:00pm
            New user DaiNB. Assign user DaiNB to Daily meeting.
            Change man DaiNB to Dai Nguyen`,
            TxtGuideNew: `${ptrnNewShedules.join(', ')}. ${patternNewPlans.join(', ')}`,
            TxtGuideNewUser: `${patternNewUser.join(', ')}`,
            TxtGuideEditUser: `${patternEditUser.join(', ')}`,
            IsExpandGuide: true,
            IsExpandGeNewTask: true,
            IsExpandGeNewUser: true,
            IsExpandGeEditUser: true,
        }
    },
    methods: {
        processCompand(e) {
            let target = this.$el.querySelector('.txt-command[contenteditable]')// e.target
            const txt = target.innerText
            const root = this.$root
            let [allCommandIndex, mapNewSchedule, mapNewPlan, mapNewUser, mapEditUser, mapAssignUser] = getCommands(txt)
            let changeSch = false
            let sUser = new Set(root.LsUser)
            allCommandIndex.forEach(index => {
                if (mapNewSchedule.has(index)) {
                    let obj = mapNewSchedule.get(index)
                    setSchedules(root.LsSchedule, obj)
                    changeSch = true
                }
                if (mapNewPlan.has(index)) {
                    let obj = mapNewPlan.get(index)
                    setSchedules(root.LsSchedule, obj)
                    changeSch = true
                }
                if (mapNewUser.has(index)) {
                    let uName = mapNewUser.get(index)
                    sUser.add(uName)
                }
                if (mapEditUser.has(index)) {
                    let [oName, newName] = mapEditUser.get(index)
                    sUser.delete(oName)
                    sUser.add(newName)
                    let lsShedule = root.LsSchedule
                    for (let ss = 0, task; ss < lsShedule.length; ss++) {
                        task = lsShedule[ss]
                        if (task.Users.includes(oName)) {
                            let assign = new Set(task.Users)
                            assign.delete(oName)
                            assign.add(newName)
                            task.Users = Array.from(assign)
                        }
                    }
                }
                if (mapAssignUser.has(index)) {
                    let [uName, taskName] = mapAssignUser.get(index)
                    let lsShedule = root.LsSchedule
                    let task = lsShedule.find(x => x.Name == taskName)
                    if (task) {
                        let assign = new Set(task.Users)
                        assign.add(uName)
                        task.Users = Array.from(assign)
                    }
                }
            })
            if (changeSch) {
                root.LsSchedule.sort((a, b) => a.Begin.getTime() - b.Begin.getTime())
                root.computeAvailables()
            }
            if (0 < mapNewUser.size + mapEditUser.size) {
                root.LsUser = Array.from(sUser)
            }
            function compare(item, obj) {
                if (item.Name == obj.Name && isEqualDate(obj.Begin, item.Begin) && isEqualDate(obj.End, item.End)) return 0
                if (item.Name != obj.Name && isEqualDate(obj.Begin, item.Begin) && isEqualDate(obj.End, item.End)) return 1
                if (item.Name == obj.Name && !isEqualDate(obj.Begin, item.Begin) && isEqualDate(obj.End, item.End)) return 2
                if (item.Name == obj.Name && isEqualDate(obj.Begin, item.Begin) && !isEqualDate(obj.End, item.End)) return 3
                if (item.Name == obj.Name && !isEqualDate(obj.Begin, item.Begin) && !isEqualDate(obj.End, item.End)) return 4
                return -1
            }
            function isEqualDate(d1, d2) { return d1.toISOString() == d2.toISOString() }
            function setSchedules(lsShedule, obj) {
                let ii = lsShedule.findIndex(item => 0 < compare(item, obj))
                if (-1 < ii) {
                    let old = lsShedule[ii]
                    let users = new Set([...old.Users, ...obj.Users])
                    obj.Users = Array.from(users)
                    genKeyHex(obj)
                    lsShedule.splice(ii, 1, obj)
                } else {
                    ii = lsShedule.findIndex(item => 0 == compare(item, obj))
                    if (ii < 0) lsShedule.push(obj)
                }
            }
        },
        clearCompand(){
            let target = this.$el.querySelector('.txt-command[contenteditable]')
            target.innerHTML = ''
        },
        fillCompand(){
            let target = this.$el.querySelector('.txt-command[contenteditable]')
            target.innerHTML = this.TxtCommand
        },
    },
    computed: {

    },
    beforeUpdate() {

    },
    updated() {

    },
}
