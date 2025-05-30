import { genKeyHex, MonthsShort, getValidDays } from "../common.js";
import {
    getCommands, ptrnNewShedules, patternNewPlans,
    patternNewUser, patternEditUser, patternSearch
} from "../commands.js";
export const ViewSchedule = {
    template: `#tmp-schedule`,
    name: "View_Schedule",
    display: "View.Schedule",
    props: ['item'],
    data() {
        return {

        }
    },
    computed: {
        TxtTimes() {
            const item = this.item
            const tConfix = { hour: '2-digit', minute: '2-digit', hour12: true }
            let beginTime = item.Begin.toLocaleTimeString('en-US', tConfix);
            let endTime = item.End.toLocaleTimeString('en-US', tConfix);
            return [beginTime, endTime]
        },
        TxtDays() {
            const item = this.item
            return this.getTxtDays(item.Begin, item.End)
        },
    },
    methods: {
        getTxtDays(begin, end) {
            const tConfix = { day: '2-digit', month: 'short', year: 'numeric' }
            let beginDate = begin.toLocaleDateString('en-US', tConfix);
            let endDate = end.toLocaleDateString('en-US', tConfix);
            if (beginDate == endDate) return [beginDate]
            return [beginDate, endDate]
        },
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
            let oBeginT = item.Begin.getTime()
            let oEndT = item.End.getTime()
            let oBegin = new Date(oBeginT)
            let oEnd = new Date(oEndT)

            if (0 == ii) oBegin.setMonth(iMonth)
            else oEnd.setMonth(iMonth)
            // #region verify day
            let tDay = arr[1].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]$/, "") /* Xóa dấu câu nếu xuất hiện cuối chuỗi*/
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

            let strBegin = item.Begin.toLocaleString()
            let strEnd = item.End.toLocaleString()
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
            if (oBegin.toLocaleString() != strBegin) item.Begin = oBegin
            if (oEnd.toLocaleString() != strEnd) item.End = oEnd
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
    },
}
export const ViewCommands = {
    template: `#tmp-commands`,
    name: "View_Command",
    display: "View.Command",
    //inject: [''],
    data() {
        return {
            TxtCommand: `Make schedule Daily meeting from 9:30am to 9:45am, make meeting Planning start 2:00pm end 5:00pm
    Make Timetable Retro meeting begin 10:00am end 12:00pm,
make schedule Morning Briefing - Overview of the day’s agenda and key announcements from 08:00 to 08:30,
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
make schedule Evening Social Event	Dinner or entertainment to unwind  from 19:30 to 21:00
    New user DaiNB. Assign user DaiNB to Daily meeting, change man DaiNB to Dai Nguyen. 
    New man Bill Gate. Assign man Bill Gate to Daily meeting
    New man Elon Musk, assign man Elon Musk to Planning.
new person James, new person Michael, new person William, new person Benjamin, new person Alexander.
new person Christopher, new person Matthew, new person Nathaniel, new person Jonathan, new person Daniel.
new person Samuel, new person Henry, new person Nicholas, new person Thomas, new person Ryan, new person Charles.
new person Joseph, new person David, new person Andrew, new person Patrick, new person Brandon, new person Ethan.
new person Adam, new person Zachary, new person Lucas, new person Elizabeth, new person Olivia, new person Sophia.
new person Emily, new person Charlotte, new person Isabella, new person Amelia, new person Abigail, new person Victoria.
new person Grace, new person Natalie, new person Hannah, new person Samantha, new person Madison, new person Jessica.
new person Katherine, new person Lauren, new person Rachel, new person Rebecca, new person Sarah, new person Evelyn.
new person Julia, new person Caroline, new person Molly, new person Audrey`,
            TxtGuideNew: `${ptrnNewShedules.join(', ')}. ${patternNewPlans.join(', ')}`,
            TxtGuideNewUser: `${patternNewUser.join(', ')}`,
            TxtGuideEditUser: `${patternEditUser.join(', ')}`,
            TxtGuideSearch: `${patternSearch.join(', ')}`,
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
                if (item.Name == obj.Name && isEqualTime(obj.Begin, item.Begin) && isEqualTime(obj.End, item.End)) return 0
                if (item.Name != obj.Name && isEqualTime(obj.Begin, item.Begin) && isEqualTime(obj.End, item.End)) return 1
                if (item.Name == obj.Name && !isEqualTime(obj.Begin, item.Begin) && isEqualTime(obj.End, item.End)) return 2
                if (item.Name == obj.Name && isEqualTime(obj.Begin, item.Begin) && !isEqualTime(obj.End, item.End)) return 3
                if (item.Name == obj.Name && !isEqualTime(obj.Begin, item.Begin) && !isEqualTime(obj.End, item.End)) return 4
                return -1
            }
            function isEqualTime(d1, d2) {
                let t1 = d1.getHours()
                let t2 = d2.getHours()
                if (t1 != t2) return false
                t1 = d1.getMinutes()
                t2 = d2.getMinutes()
                if (t1 != t2) return false
                return true
            }
            //function isEqualDate(d1, d2) { return d1.toISOString() == d2.toISOString() }
            function setSchedules(lsShedule, obj) {
                let ii = lsShedule.findIndex(item => 0 < compare(item, obj))
                if (-1 < ii) {
                    let old = lsShedule[ii]
                    let users = new Set([...old.Users, ...obj.Users])
                    obj.Users = Array.from(users)
                    obj.Begin.setFullYear(old.Begin.getFullYear())
                    obj.End.setFullYear(old.End.getFullYear())
                    obj.Begin.setMonth(old.Begin.getMonth())
                    obj.End.setMonth(old.End.getMonth())
                    obj.Begin.setDate(old.Begin.getDate())
                    obj.End.setDate(old.End.getDate())
                    genKeyHex(obj)
                    lsShedule.splice(ii, 1, obj)
                } else {
                    ii = lsShedule.findIndex(item => 0 == compare(item, obj))
                    if (ii < 0) lsShedule.push(obj)
                }
            }
        },
        clearCompand() {
            let target = this.$el.querySelector('.txt-command[contenteditable]')
            target.innerHTML = ''
        },
        fillCompand() {
            let target = this.$el.querySelector('.txt-command[contenteditable]')
            target.innerHTML = this.TxtCommand
        },
    },
    beforeUpdate() {

    },
    updated() {

    },
}
