import {
    genKeyHex, MonthsShort, getValidDays, getArrTime, randomInt,
    getTimeDigit, isEqualTime, getLsChild, convertDic,
} from "../common.js";
import {
    getCommands, ptrnNewShedules, patternNewPlans,
    patternNewUser, patternEditUser, patternSearch,
    rmLastPunctuation, ptrnNewTask, getCmdTask,
} from "../commands.js";
const mxDate = {
    computed: {
        TxtTimes() {
            const item = this.item
            return getArrTime(item)
        },
        TxtDays() {
            const item = this.item
            return this.getTxtDays(item.Begin, item.End)
        },
    },
    methods: {
        getTxtDays(b, e) {
            let begin = new Date(b)
            let end = new Date(e)
            let lang = navigator.language || 'en-US'
            const tConfix = { day: '2-digit', month: 'short', year: 'numeric' }
            let beginDate = begin.toLocaleDateString(lang, tConfix);
            let endDate = end.toLocaleDateString(lang, tConfix);
            if (beginDate == endDate) return [beginDate]
            return [beginDate, endDate]
        }
    },
}

export const FormSchedule = {
    template: `#tmp-form-schedule`,
    name: "Form_Schedule",
    display: "Form.Schedule",
    props: ['entry'],
    mixins: [mxDate],
    data() {
        const item = this.entry.item
        let copy = JSON.parse(JSON.stringify(item))
        let tasks = getLsChild(this.$root.LsTask, item.Id)
        return {
            item: copy,
            TxtCmdTask: `${ptrnNewTask[randomInt(0, ptrnNewTask.length)]} Document log due 15:00`,
            TaskEdit: null,
            Tasks: tasks,
        }
    },
    watch: {
        '$root.LsTask'(ls) { this.Tasks = getLsChild(ls, this.entry.item.Id) },
        'entry.item.Begin'(begin) { this.item.Begin = begin },
        'entry.item.End'(end) { this.item.End = end },
        'entry.item'(item) {
            let copy = JSON.parse(JSON.stringify(item))
            this.item = copy
        },
    },
    methods: {
        processCmdTask(e) {
            const root = this.$root
            let target = e.target
            const txt = target.innerText
            let [allCommandIndex, mapTasks] = getCmdTask(txt, root.IdGenerator)
            const item = this.item
            let tasks = root.LsTask
            if (0 < allCommandIndex.length + mapTasks.size) {
                tasks = [...tasks]  // copy => new ref
                allCommandIndex.forEach(index => {
                    if (mapTasks.has(index)) {
                        let obj = mapTasks.get(index)
                        obj.End = adjustDateOnly(obj.End, item.Begin, item.End)
                        obj.ParentId = item.Id
                        setTasks(obj)
                    }
                })
                root.LsTask = tasks
            }
            function compare(item, obj) {
                if (item.ParentId != obj.ParentId) return 3
                const equalTime = isEqualTime(obj.End, item.End)
                if (item.Name == obj.Name && equalTime) return 0
                if (item.Name != obj.Name && equalTime) return 1
                if (item.Name == obj.Name && !equalTime) return 2
                return -1
            }
            function setTasks(obj) {
                if (!tasks.length) {
                    tasks.push(obj)
                    return
                }
                for (let tt = tasks.length - 1, task; -1 < tt; tt--) {
                    task = tasks[tt]
                    switch (compare(task, obj)) {
                        case 1: task.Name = obj.Name  // edit name
                            return;
                        case 2: task.End = obj.End  // edit due
                            return;
                        case 0: return;
                        case 3:
                        default: break;
                    }
                }
                tasks.push(obj)
            }
            function adjustDateOnly(d, sD, eD) { // Điều chỉnh ngày, tháng, năm nếu cần
                let date = new Date(d)
                let startDate = new Date(sD)
                let endDate = new Date(eD)
                if (date < startDate) {
                    date.setFullYear(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                } else if (endDate < date) {
                    date.setFullYear(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                }
                return date.toISOString()
            }
        },
        openFormTask(task) {
            const edtTask = this.TaskEdit
            if (!edtTask) {
                this.TaskEdit = task;
                return
            }
            if (Object.is(task, edtTask)) {
                this.TaskEdit = null;
                return
            }
            this.TaskEdit = task;
        },
        blurTaskNote(e) {
            const edtTask = this.TaskEdit
            let target = e.target
            const txt = target.innerHTML
            edtTask.Note = txt
        },
        getTimeDig(task) {
            if (!task) return null
            let end = new Date(task.End)
            if (end instanceof Date) {
                let tConfix = { hour: '2-digit', minute: '2-digit', hour12: true }
                return getTimeDigit(end, tConfix)
            }
            return null
        },
    },
}
export const RowSchedule = {
    template: `#tmp-schedule`,
    name: "Row_Schedule",
    display: "Row.Schedule",
    props: ['item'],
    mixins: [mxDate],
    data() {
        const root = this.$root
        const item = this.item
        let txtSearch = root.TxtSearchName.trim()
        let view = 's'
        if (txtSearch.length && !item.Name.includes(txtSearch)) {
            view = 'h'
        }
        const tasks = getLsChild(root.LsTask, item.Id)
        return {
            ViewType: view,
            Tasks: tasks,
        }
    },
    methods: {
        changeDay(ii, e) {
            let target = e.target
            let txt = target.innerText
            txt = txt.trim().replace(/\s+/g, ' '); // Thay thế nhiều dấu cách bằng một dấu cách
            let arr = txt.split(' ')
            const lsTxtDay = this.TxtDays
            if (arr.length != 3) {
                target.innerHTML = lsTxtDay[ii]
                return
            }
            if (target.innerText == lsTxtDay[ii]) return
            // #region verify month
            let tMonth = arr[0]
            let iMonth = iMonthShort(tMonth)
            if (iMonth < 0) {
                let numMM = Number(tMonth)
                if (isNaN(numMM)) {
                    target.innerHTML = this.TxtDays[ii]
                    return
                }
                iMonth = parseInt(numMM)
                if (iMonth < 0 || 11 < iMonth) {
                    target.innerHTML = this.TxtDays[ii]
                    return
                }
            }
            // #endregion
            const item = this.item
            let oBeginT = item.Begin
            let oEndT = item.End
            let oBegin = new Date(oBeginT)
            let oEnd = new Date(oEndT)

            if (0 == ii) oBegin.setMonth(iMonth)
            else oEnd.setMonth(iMonth)
            // #region verify day
            let tDay = rmLastPunctuation(arr[1])
            let numDD = Number(tDay)
            if (isNaN(numDD)) {
                target.innerHTML = lsTxtDay[ii]
                return
            }
            numDD = parseInt(numDD)
            let lsValidD = getValidDays(iMonth, oBegin.getFullYear())
            if (0 < ii) lsValidD = getValidDays(iMonth, oEnd.getFullYear())
            if (!lsValidD.includes(numDD)) {
                target.innerHTML = lsTxtDay[ii]
                return
            }
            // #endregion
            if (0 == ii) oBegin.setDate(numDD)
            else oEnd.setDate(numDD)
            // #region vefiry year
            let tYear = arr[2].trim()
            if (tYear.length < 4 || tYear.includes('.')) {
                target.innerHTML = lsTxtDay[ii]
                return
            }
            let numYear = Number(tYear)
            if (isNaN(numYear)) {
                target.innerHTML = lsTxtDay[ii]
                return
            }
            // #endregion
            if (0 == ii) oBegin.setFullYear(numYear)
            else oEnd.setFullYear(numYear)

            let strBegin = getTimeDigit(new Date(oBeginT))
            let strEnd = getTimeDigit(new Date(oEndT))
            oBeginT = oBegin.getTime()
            oEndT = oEnd.getTime()
            if (diffDay(oBegin, oEnd) < 0) {
                if (1 < lsTxtDay.length) {
                    target.innerHTML = lsTxtDay[ii]
                    return
                }
                oBegin = new Date(oEndT)
                oEnd = new Date(oBeginT)
            }
            oBegin = getTimeDigit(oBegin)
            if (oBegin != strBegin) item.Begin = oBegin
            oEnd = getTimeDigit(oEnd)
            if (oEnd != strEnd) item.End = oEnd
            const newArr = this.getTxtDays(oBegin, oEnd)
            if (target.innerText != newArr[ii]) target.innerHTML = newArr[ii]
            if (newArr.length != lsTxtDay.length) {
                this.$nextTick(() => {
                    for (let nii = 0, newT; nii < newArr.length; nii++) {
                        newT = newArr[nii]
                        let span = this.$el.querySelector(`[iiday="${nii}"]`)
                        if (span.innerText != newT) span.innerHTML = newT
                    }
                })
            }
            target.blur()
            function iMonthShort(txt) {
                txt = txt.trim()
                if (txt.length < 3) return -1
                txt = txt.toLowerCase()
                let lsMonth = MonthsShort.map(t => t.toLowerCase())
                return lsMonth.indexOf(txt)
            }
            function diffDay(begin, end) {
                if (end.getFullYear() < begin.getFullYear()) return -1
                if (end.getFullYear() > begin.getFullYear()) return 1
                // == year
                if (end.getMonth() < begin.getMonth()) return -1
                if (end.getMonth() > begin.getMonth()) return 1
                // == month
                if (end.getDate() < begin.getDate()) return -1
                if (end.getDate() > begin.getDate()) return 1
                return 0
            }
        },
        toggleForm(e) {
            const root = this.$root
            const lisEdit = root.LsEdit
            const item = this.item
            const entry = {
                item, ComponentName: 'form-schedule',
            }
            if (!lisEdit.length) {
                lisEdit.push(entry)
            } else {
                let ii = lisEdit.findIndex(x => x.item.Name === item.Name)
                if (-1 < ii) {
                    lisEdit.splice(ii, 1)   // click it-self
                    return
                }
                lisEdit.splice(ii, 1, entry)
            }
        },
        setUiProcess() {
            let setDone = this.$root.ItemDones
            const tasks = this.Tasks
            const maxW = this.$el.offsetWidth
            const len = tasks.length
            let cWidth = 0
            if (!len) cWidth = 0
            else {
                let taskDone = tasks.filter(t => setDone.has(t.Id))
                cWidth = (taskDone.length / len) * maxW
            }
            let line = this.$el.querySelector('.progess-line')
            line.style.width = `${cWidth}px`
        },
        getTimeDig(task) {
            let lang = navigator.language || 'en-US'
            let tConfix = { hour: '2-digit', minute: '2-digit', hour12: true }
            let due = new Date(task.End)
            let time = due.toLocaleTimeString(lang, tConfix)
            tConfix = { day: '2-digit', month: 'short', year: 'numeric' }
            let date = due.toLocaleDateString(lang, tConfix)
            return `${time}<br>${date}`
        },
    },
    watch: {
        '$root.TxtSearchName'(txtSearch) {
            const vType = this.ViewType
            if (txtSearch.length) {
                if (!this.item.Name.includes(txtSearch)) this.ViewType = 'h'
                else this.ViewType = 's'
            } else if ('h' == vType) this.ViewType = 's'
        },
        '$root.TxtSearchUser'(txtSearch) {
            const vType = this.ViewType
            if (txtSearch.length) {
                const users = this.item.Users
                if (!users.length) {
                    if ('s' == vType) this.ViewType = 'h'
                    return
                }
                let txtU = users.join(', ').toLowerCase()
                if (!txtU.includes(txtSearch.trim())) this.ViewType = 'h'
                else this.ViewType = 's'
            } else if ('h' == vType) this.ViewType = 's'
        },
        '$root.LsTask'(ls) {
            this.Tasks = getLsChild(ls, this.item.Id)
            this.$nextTick(this.setUiProcess)
        },
        '$root.ItemDones'(set) {
            this.setUiProcess()
        },
        'item.End'(end) {
            let dE = new Date(end)
            let dNow = new Date()
            let setDone = this.$root.ItemDones
            if (dE < dNow) {
                if (!setDone.has(this.item.Id)) {
                    setDone = new Set(setDone)
                    setDone.add(this.item.Id)
                    this.$root.ItemDones = setDone
                }
            } else {
                if (setDone.has(this.item.Id)) {
                    setDone = new Set(setDone)
                    setDone.delete(this.item.Id)
                    this.$root.ItemDones = setDone
                }
            }
        },
    },
    computed: {
        TaskStatus() {
            let setDone = this.$root.ItemDones
            const tasks = this.Tasks
            const len = tasks.length
            if (!len) return '0/0'
            let taskDone = tasks.filter(t => setDone.has(t.Id))
            return `${taskDone.length}/${len}`
        },
    },
    beforeMount() { this.$root.setRefs(this, 'Schedules') },
    mounted() { this.setUiProcess() },
    beforeDestroy() { this.$root.setRefs(this, 'Schedules') },
}
export const ViewCommands = {
    template: `#tmp-commands`,
    name: "View_Command",
    display: "View.Command",
    //inject: [''],
    data() {
        const txtSchedule = `Make schedule Daily meeting from 9:30am to 9:45am, make Agenda Planning start 2:00pm end 5:00pm
    Make Agenda Retro meeting begin 10:00am end 12:00pm,
make Roadmap Morning Briefing - Overview of the day’s agenda and key announcements from 08:00 to 08:30,
make schedule Icebreaker & Warm-up [Fun activities to energize the team] from 08:30 to 09:30,
make schedule Workshop Session 1 (Focused training or skill development session) from 09:30 to 10:45,
make schedule Coffee Break - Time to relax and chat from 11:00 to 11:15,
make schedule Group Collaboration (Brainstorming and teamwork exercises) from 11:15 to 12:30,
make schedule Lunch Break - Social interaction and relaxation from 12:40 to 13:30,
make schedule Workshop Session 2 [Hands-on exercises or case studies] from 13:45 to 15:00,
make schedule Quick Break	Short refreshment before next session from 15:00 to 15:15,
make schedule Presentation Time	Teams present their ideas or progress from 15:15 to 16:30,
make schedule Networking & Discussion	Exchange contacts and share insights from 16:30 to 17:30,
make schedule Problem-Solving Challenge	Teams work on a real-world scenario from 17:30 to 18:00,
make schedule Creative Session	Art, music, or innovation-based activity from 18:00 to 19:00,
make schedule Closing Remarks	Summary of the day and reflections  from 19:00 to 19:30,
make schedule Evening Social Event	Dinner or entertainment to unwind  from 19:30 to 21:00`
        const txtNewUser = `New user DaiNB, new person Bill Gate. New person Elon Musk, new user James, new user Michael.
New user William, new user Benjamin, new user Alexander.
new user Christopher, new user Matthew, new user Nathaniel, new user Jonathan, new user Daniel.
new user Samuel, new user Henry, new user Nicholas, new user Thomas, new user Ryan, new user Charles.
new user Joseph, new user David, new user Andrew, new user Patrick, new user Brandon, new user Ethan.
new user Adam, new user Zachary, new user Lucas, new user Elizabeth, new user Olivia, new user Sophia.`
        const txtAssignU = `Assign user DaiNB to Daily meeting. Assign member Bill Gate to Daily meeting, assign member Elon Musk to Planning.`
        const txtEditU = `change user DaiNB to Dai Nguyen. `
        return {
            TxtCommand: `${txtSchedule}.\n${txtNewUser}\n${txtAssignU}\n${txtEditU}`,
            TxtDemo: {
                NewShedule: txtSchedule,
                NewUser: txtNewUser,
                AssignUser: txtAssignU,
                EditUser: txtEditU,
                Search: `Go search name Bre`
            },
        }
    },
    methods: {
        processCompand(e) {
            let target = e.target
            const txt = target.innerText
            const root = this.$root
            const lsLog = root.LisLog
            let [allCommandIndex, mapNewSchedule, mapNewPlan, mapNewUser,
                mapEditUser, mapAssignUser, mapGoSearchN, mapGoSearchU] = getCommands(txt, root.IdGenerator)
            if (!mapGoSearchN.size) root.TxtSearchName = ''
            if (!mapGoSearchU.size) root.TxtSearchUser = ''
            let listUser = root.LsUser
            let lsShedule = root.LsSchedule
            allCommandIndex.forEach(index => {
                if (mapGoSearchN.has(index)) {
                    let sTxt = mapGoSearchN.get(index)
                    if (patternSearch.map(x => `${x.toLowerCase()} name`).includes(sTxt.trim().toLowerCase())) sTxt = ''
                    root.TxtSearchName = sTxt
                    if (sTxt.length) {
                        let cmd_ = patternSearch[randomInt(0, patternSearch.length)]
                        lsLog.push(`${cmd_} name ${sTxt}`)
                    }
                } else root.TxtSearchName = ''

                if (mapGoSearchU.has(index)) {
                    const arrN = ['person', 'user', 'member']
                    const lsPttnSearchU = [...patternSearch.map(x => `${x.toLowerCase()} ${arrN[0]}`),
                    ...patternSearch.map(x => `${x.toLowerCase()} ${arrN[1]}`),
                    ...patternSearch.map(x => `${x.toLowerCase()} ${arrN[2]}`)]
                    let sTxt = mapGoSearchU.get(index).toLowerCase()
                    if (lsPttnSearchU.includes(sTxt.trim())) sTxt = ''
                    root.TxtSearchUser = sTxt
                    if (sTxt.length) {
                        let cmd_ = patternSearch[randomInt(0, patternSearch.length)]
                        lsLog.push(`${cmd_} ${arrN[randomInt(0, arrN.length)]} ${sTxt}`)
                    }
                } else root.TxtSearchUser = ''

                if (mapNewSchedule.has(index)) {
                    let obj = mapNewSchedule.get(index)
                    setSchedules.call(root, obj, lsLog)
                }
                if (mapNewPlan.has(index)) {
                    let obj = mapNewPlan.get(index)
                    setSchedules.call(root, obj, lsLog)
                }
            })
            if (!Object.is(root.LsSchedule, lsShedule)) {
                lsShedule.sort((a, b) => {
                    let ab = new Date(a.Begin)
                    let bb = new Date(b.Begin)
                    return ab.getTime() - bb.getTime()
                })
                root.LsSchedule = lsShedule
                root.computeAvailables()
            }
            allCommandIndex.forEach(index => {
                if (mapNewUser.has(index)) {
                    let uName = mapNewUser.get(index)
                    if (setUsers(uName)) {
                        let cmd_ = patternNewUser[randomInt(0, patternNewUser.length)]
                        lsLog.push(`${cmd_} ${uName}`)
                    }
                }
                if (mapEditUser.has(index)) {
                    let [oName, newName] = mapEditUser.get(index)
                    if (setUsers(oName, newName)) {
                        lsLog.push(`Change user ${oName} to ${newName}`)
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
                }
                if (mapAssignUser.has(index)) {
                    let [uName, taskName] = mapAssignUser.get(index)
                    let task = lsShedule.find(x => x.Name == taskName)
                    if (task) {
                        if (setUsers(uName)) {
                            let cmd_ = patternNewUser[randomInt(0, patternNewUser.length)]
                            lsLog.push(`${cmd_} ${uName}`)
                        }
                        let assign = new Set(task.Users)
                        assign.add(uName)
                        task.Users = Array.from(assign)
                    }
                    lsLog.push(`Assign user ${uName} to ${taskName}`)
                }
            })
            root.LsUser = listUser
            root.$nextTick(() => {
                let element = document.body.querySelector(`#vw-command-log`)
                element.scrollTo({
                    top: element.scrollHeight,
                    behavior: "smooth"
                });
            })
            function compare(item, obj) {
                const eqTimeB = isEqualTime(obj.Begin, item.Begin)
                const eqTimeE = isEqualTime(obj.End, item.End)
                if (item.Name == obj.Name && eqTimeB && eqTimeE) return 0
                if (item.Name != obj.Name && eqTimeB && eqTimeE) return 1
                if (item.Name == obj.Name && !eqTimeB && eqTimeE) return 2
                if (item.Name == obj.Name && eqTimeB && !eqTimeE) return 3
                if (item.Name == obj.Name && !eqTimeB && !eqTimeE) return 4
                return -1
            }
            function setSchedules(obj, lisLog) {
                genKeyHex(obj)
                let ii = lsShedule.findIndex(item => 0 < compare(item, obj))
                if (-1 < ii) {
                    lsShedule = [...lsShedule]  // copy => new ref
                    let old = lsShedule[ii]
                    keepProps(obj, old)
                    lsShedule.splice(ii, 1, obj)
                    const lisEdit = this.LsEdit
                    if (lisEdit.length) {
                        let eEntry = lisEdit.find(x => x.item.Id == old.Id)
                        if (eEntry) eEntry.item = obj
                    }
                } else {
                    ii = lsShedule.findIndex(item => 0 == compare(item, obj))
                    if (ii < 0) {
                        lsShedule = [...lsShedule]  // copy => new ref
                        lsShedule.push(obj)
                    }
                }
                let arrTime = getArrTime(obj)
                let cmd_ = ptrnNewShedules[randomInt(0, ptrnNewShedules.length)]
                lisLog.push(`${cmd_} ${obj.Name} from ${arrTime[0]} to ${arrTime[1]}`)
            }
            function keepProps(obj, old) {
                let users = new Set([...old.Users, ...obj.Users])
                obj.Users = Array.from(users)

                let oBegin = new Date(old.Begin)
                let oEnd = new Date(old.End)
                let nBegin = new Date(obj.Begin)
                let nEnd = new Date(obj.End)
                oBegin.setHours(nBegin.getHours())
                oBegin.setMinutes(nBegin.getMinutes())
                oEnd.setHours(nEnd.getHours())
                oEnd.setMinutes(nEnd.getMinutes())

                obj.Begin = oBegin.toISOString()
                obj.End = oEnd.toISOString()
                obj.Id = old.Id
            }
            function setUsers(name, nName) {
                let ii = listUser.findIndex(u => u.Name == name)
                if (ii < 0) {
                    listUser = [...listUser]    // copy change ref
                    listUser.push({ Name: name, Id: root.IdGenerator.generate().toString() })
                    return true
                }
                if (typeof nName == 'string') {
                    listUser = [...listUser]    // copy change ref
                    listUser[ii].Name = nName
                    return true
                }
            }
        },
        generateCommands() {
            let target = this.$el.querySelector('.txt-command[contenteditable]')
            this.processCompand({ target })
            target.innerHTML = ''
        },
        clearCompand() {
            let target = this.$el.querySelector('.txt-command[contenteditable]')
            target.innerHTML = ''
        },
        fillCompand() {
            let target = this.$el.querySelector('.txt-command[contenteditable]')
            target.innerHTML = this.TxtCommand
        },
        showDemoCommands() {
            const root = this.$root
            const nameComp = 'view-demo-commands'
            const item = this.TxtDemo
            let entry = {
                ComponentName: nameComp,
                Title: `Demo commands`, item,
            }
            root.LsEdit = [entry]
        },
        showGuide() {
            const root = this.$root
            const item = {
                NewShedule: `${ptrnNewShedules.join(', ')}. ${patternNewPlans.join(', ')}`,
                NewUser: `${patternNewUser.join(', ')}`,
                EditUser: `${patternEditUser.join(', ')}`,
                TxtSearch: `${patternSearch.join(', ')}`,
            }
            const nameComp = 'view-guide-commands'
            let entry = {
                ComponentName: nameComp,
                Title: `Guide`, item
            }
            root.LsEdit = [entry]
        },
    },
    beforeUpdate() {

    },
    updated() {

    },
}
