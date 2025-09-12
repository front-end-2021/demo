// #region import
import { Snowflake, insertHTMLAtCursor } from './common.js'
import { createApp } from 'vue'
import {
    ViewCommands, RowSchedule, FormSchedule, FloatBtn, FormUser,
} from './components/vw-diagram.js'
import { ViewOne } from './components/view-one.js'
// #endregion
const VwDemoCommands = {
    template: `#tmp-demo-commands`,
    name: "View_Demo_Command",
    display: "View.Demo.Command",
    props: ['entry'],
}
const VwGuideCommands = {
    template: `#tmp-guide-commands`,
    name: "View_Guide_Command",
    display: "View.Guide.Command",
    props: ['entry'],
}
Promise.all([
    includeHTML(`./components/view-one.html`),
    includeHTML(`./components/vw-diagram.html`),
]).then((values) => {
    const app = createApp({
        name: `app-main`,
        components: {
            'view-commands': ViewCommands,
            'view-schedule': RowSchedule,
            'view-one': ViewOne,
            'form-schedule': FormSchedule,
            'view-demo-commands': VwDemoCommands,
            'view-guide-commands': VwGuideCommands,
            'button-float-cmd': FloatBtn,
            'form-user': FormUser,
        },
        data() {
            let start = new Date();
            start.setHours(8, 0, 0, 0);
            let end = new Date();
            end.setHours(17, 0, 0, 0);
            return {
                LsSchedule: [], // Id, Name, Begin, End, Users, KeyMD5
                LsTask: [],     // Id, Name, End, Note, ParentId
                IdDones: [],
                LsAvailable: [],
                TimeLogStart: start,
                TimeLogEnd: end,
                LsUser: [],     // Id, Name, Pwd
                Search: {
                    Name: null, LowerCase: false,
                    User: null, HasContext: false,
                    Ids: new Set(),
                    HideIds: new Set(),
                },
                LsEdit: [],
                LisLog: [],
                IsExpandCmd: true,
                Account: null,
                OverviewType: 1, // 1 = view1, 
                RefView: null,
            }
        },
        computed: {
            IdGenerator() { return new Snowflake(42n) },
            ItemDones() { return new Set(this.IdDones) },
            ScheduleIds() { return new Set(this.LsSchedule.map(x => x.Id)) },
            TaskIds() { return new Set(this.LsTask.map(x => x.Id)) },
        },
        // watch: {
        //     'Search.Name'(txt) { console.log('watch search name ', txt) },
        //     'Search.User'(txt) { console.log('watch search user ', txt) },
        //       'Search.Ids'(ids) { console.log('watch set visible Id ', ids) },
        //     'Search.HideIds'(ids) { console.log('watch set invisible Id ', ids) },
        // },
        methods: {
            computeAvailables(lsShedule) {
                let listSch = lsShedule.map(x => [new Date(x.Begin), new Date(x.End)])
                let start = this.TimeLogStart
                let end = this.TimeLogEnd

                this.LsAvailable = findFreeTimeSlots(listSch, start, end)

                function findFreeTimeSlots(timeSlots, startOfDay, endOfDay) {
                    const timeToMinutes = time => {
                        let hours = time.getHours()
                        let minutes = time.getMinutes()
                        return hours * 60 + minutes
                    }
                    timeSlots.sort((a, b) => timeToMinutes(a[0]) - timeToMinutes(b[0]))   // Sắp xếp danh sách theo giờ bắt đầu

                    const freeSlots = [];
                    let currentTime = timeToMinutes(startOfDay);

                    // Kiểm tra khoảng trống trước khoảng đầu tiên
                    if (currentTime < timeToMinutes(timeSlots[0][0])) {
                        freeSlots.push({ Begin: startOfDay, End: timeSlots[0][0] });
                    }

                    // Tìm khoảng trống giữa các khoảng thời gian
                    for (let i = 0; i < timeSlots.length - 1; i++) {
                        let endCurrent = timeToMinutes(timeSlots[i][1]);
                        let startNext = timeToMinutes(timeSlots[i + 1][0]);
                        if (endCurrent < startNext) {
                            freeSlots.push({ Begin: timeSlots[i][1], End: timeSlots[i + 1][0] });
                        }
                    }

                    // Kiểm tra khoảng trống cuối ngày
                    let lastEndTime = timeToMinutes(timeSlots[timeSlots.length - 1][1]);
                    if (lastEndTime < timeToMinutes(endOfDay)) {
                        freeSlots.push({ Begin: timeSlots[timeSlots.length - 1][1], End: endOfDay });
                    }

                    return freeSlots;
                }
            },
            fillLogCommand(txt) {
                let target = document.body.querySelector('.txt-command[contenteditable]')
                target.innerHTML = txt
            },
            toggFinish(id, e) {
                let setDone = new Set(this.IdDones)
                if (setDone.has(id)) setDone.delete(id)
                else setDone.add(id)
                this.setFinish(setDone)
            },
            setFinish(setDone) { this.IdDones = Array.from(setDone) },
            isFinish(id) { return this.ItemDones.has(id) },
            setSearch(txt, type) {
                if (!hasText(txt)) txt = null   // verify
                let sObject = this.Search
                const lsShl = this.LsSchedule
                const lsTsk = this.LsTask
                let isLowerCase = sObject.LowerCase
                let hasContext = sObject.HasContext
                let setId = new Set([...lsShl.map(x => x.Id), ...lsTsk.map(x => x.Id)])
                let txtName = null, txtUser = null
                if (hasText(sObject.Name)) txtName = sObject.Name
                if (hasText(sObject.User)) txtUser = sObject.User
                if (txtName || txtUser) { setId = sObject.Ids }
                switch (type) {
                    case 'name':
                        if (txtName !== txt) {
                            sObject.Name = txt
                            txtName = txt
                            setId = new Set(setId)
                        }
                        break;
                    case 'user':
                        if (txtUser !== txt) {
                            sObject.User = txt
                            txtUser = txt
                            setId = new Set(setId)
                        }
                        break;
                    default: break;
                }
                this.buildSearchData(txtName, txtUser, lsShl, lsTsk, isLowerCase, hasContext, setId)
                function hasText(str) {
                    if (typeof str != 'string') return false
                    if (!str.trim().length) return false
                    return true
                }
            },
            buildSearchData(txtName, txtUser, lsShl, lsTsk, isLowerCase, hasContext, setId) {
                const oSearch = this.Search
                let setHide = oSearch.HideIds
                if (txtName || txtUser) {
                    if (!setId) setId = oSearch.Ids
                    let avaiNames = new Set(lsShl.map(x => x.Id))
                    if (txtName) {
                        let avaiShls = lsShl.filter(x => x.Name == txtName || x.Name.includes(txtName))
                        let avaiTsks = lsTsk.filter(x => x.Name == txtName || x.Name.includes(txtName))
                        if (isLowerCase) {
                            txtName = txtName.toLowerCase()
                            avaiShls = lsShl.filter(x => x.Name.toLowerCase() == txtName || x.Name.toLowerCase().includes(txtName))
                            avaiTsks = lsTsk.filter(x => x.Name.toLowerCase() == txtName || x.Name.toLowerCase().includes(txtName))
                        }
                        if (!hasContext) {
                            setHide = avaiNames.difference(new Set(avaiShls.map(x => x.Id)))
                        }
                        avaiNames = new Set([...avaiShls.map(x => x.Id), ...avaiTsks.map(x => x.Id), ...avaiTsks.map(x => x.ParentId)])
                    }
                    let lUser = this.LsUser
                    let avaiUsers = new Set(lsShl.map(x => x.Id))
                    if (txtUser) {
                        if (isLowerCase) {
                            txtUser = txtUser.toLowerCase()
                            lUser = lUser.filter(u => u.Name.toLowerCase() == txtUser || u.Name.toLowerCase().includes(txtUser))
                        } else {
                            lUser = lUser.filter(u => u.Name == txtUser || u.Name.includes(txtUser))
                        }
                        lUser = new Set(lUser.map(u => u.Name))
                        avaiUsers = new Set(lsShl.filter(x => x.Users.some(t => lUser.has(t))).map(x => x.Id))
                    }
                    setId = avaiNames.intersection(avaiUsers)
                } else {
                    if (!setId) setId = new Set([...lsShl.map(x => x.Id), ...lsTsk.map(x => x.Id)])
                }
                if (!txtName && setHide.size) setHide = new Set()
                oSearch.HideIds = setHide
                oSearch.Ids = setId
            },
            cleanHTML(e) {
                e.preventDefault()
                const html = e.clipboardData.getData('text/html') || ''
                const text = e.clipboardData.getData('text/plain') || ''
                // Làm sạch HTML nếu có, fallback sang plain text
                const clean = DOMPurify.sanitize(html || text)
                insertHTMLAtCursor(clean); // Chèn nội dung sạch vào vị trí con trỏ
            },
            setListSchedule(listSch) {
                if (!Object.is(this.LsSchedule, listSch)) {
                    listSch.sort((a, b) => {
                        let ab = new Date(a.Begin)
                        let bb = new Date(b.Begin)
                        return ab.getTime() - bb.getTime()
                    })
                    this.LsSchedule = listSch
                    this.computeAvailables(listSch)
                }
            },
            checkNewArray(type, lst) {
                const root = this
                switch (type) {
                    case 1: if (Object.is(lst, root.LsSchedule)) return [...lst]  // copy => new ref
                        break;
                    case 2: if (Object.is(lst, root.LsTask)) return [...lst]  // copy => new ref
                        break;
                    default: break;
                }
                return lst
            },
            handleBeforeUnload(e) {
                // const root = this
                // const Schedules = root.LsSchedule
                // if (Schedules.length) localStorage.setItem('Schedules', JSON.stringify(Schedules))
                // const Tasks = root.LsTask
                // if (Tasks.length) localStorage.setItem('Tasks', JSON.stringify(Tasks))
                // const Users = root.LsUser
                // if (Users.length) localStorage.setItem('Users', JSON.stringify(Users))
                // const Dones = root.IdDones
                // if (Dones.length) localStorage.setItem('Dones', JSON.stringify(Dones))
            },
            clickLogin() {
                const root = this
                const entry = {
                    ComponentName: 'form-user',
                }
                const users = root.LsUser
                if (users.length) {
                    entry.item = { Name: '', Id: 0, Pwd: '' }   // login
                } else {
                    entry.item = { Name: '', Id: -1, Pwd: '' }  // sign up
                }
                root.LsEdit = [entry]
            },
            // equalHas(txt1, txt2) {
            //     let hash1 = CryptoJS.SHA256(txt1), hash2 = CryptoJS.SHA256(txt2)
            //     return hash1.toString(CryptoJS.enc.Hex) == hash2.toString(CryptoJS.enc.Hex)
            // },
        },
        //beforeCreate() { },
        created() {
            const root = this
            let lst = localStorage.getItem('Schedules')
            if (lst) {
                lst = JSON.parse(lst)
                root.LsSchedule = lst   // on create-d
            }
            lst = localStorage.getItem('Tasks')
            if (lst) {
                lst = JSON.parse(lst)
                root.LsTask = lst       // on create-d
            }
            lst = localStorage.getItem('Users')
            if (lst) {
                lst = JSON.parse(lst)
                root.LsUser = lst
            }
            lst = localStorage.getItem('Dones')
            if (lst) {
                lst = JSON.parse(lst)
                root.IdDones = lst
            }
        },
        //beforeMount() { },
        mounted() {
            values.forEach((path, ii) => {
                let pDom = document.body.querySelector(`.dnb-imp-html[dnbpath="${path}"]`)
                if (pDom) pDom.remove();
            })
            window.addEventListener('beforeunload', this.handleBeforeUnload)
            // const message = "123456";
            // const hash = CryptoJS.SHA256(message);//CryptoJS.MD5(message);
            // console.log(hash.toString(CryptoJS.enc.Hex));
            // console.log(hash.toString(CryptoJS.enc.Base64));// speed > Hex

        },
        beforeUpdate() { },
        updated() { },
    })
    app.mount('#m-app')
}).catch(errStatus => { console.log('Woop!', errStatus) })

function includeHTML(path) {
    const items = document.body.getElementsByClassName("dnb-imp-html");
    path = path.trim()
    for (let i = 0; i < items.length; i++) {
        const elmnt = items[i];   /*search for elements with a certain atrribute:*/
        const file = elmnt.getAttribute("dnbpath");
        if (!file) continue
        if (file.trim() !== path) continue

        const xhr = new XMLHttpRequest(); /* Make an HTTP request using the attribute value as the file name: */
        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 0 || (200 <= xhr.status && xhr.status < 400)) {
                        // The request has been completed successfully
                        document.body.innerHTML += `\n ${xhr.responseText}`
                        resolve(path, xhr.responseText)
                    } else {
                        reject(xhr.status) // There has been an error with the request!
                    }
                    elmnt.removeAttribute("dnbpath"); /* Remove the attribute, and call xhr function once more: */
                }
            }
            xhr.open("GET", file, true);
            xhr.send();
        })
    }
}