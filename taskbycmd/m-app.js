// #region import
import { Snowflake, convertDic } from './common.js'
import { createApp } from 'vue'
import { ViewCommands, RowSchedule, FormSchedule } from './components/vw-diagram.js'
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
    includeHTML(`./components/vw-diagram.html`),
]).then((values) => {
    createApp({
        name: `app-main`,
        components: {
            'view-commands': ViewCommands,
            'view-schedule': RowSchedule,
            'form-schedule': FormSchedule,
            'view-demo-commands': VwDemoCommands,
            'view-guide-commands': VwGuideCommands,
        },
        data() {
            let start = new Date();
            start.setHours(8, 0, 0, 0);
            let end = new Date();
            end.setHours(17, 0, 0, 0);
            return {
                LsSchedule: [],
                LsTask: [],
                ItemDones: new Set(),
                LsAvailable: [],
                TimeLogStart: start,
                TimeLogEnd: end,
                LsUser: [],
                TxtSearchName: '',
                TxtSearchUser: '',
                LsEdit: [],
                LisLog: [],
                LsRef: {
                    Schedules: [],
                },
            }
        },
        computed: {
            IdGenerator() { return new Snowflake(42n) },
            MapIds() {
                let map = convertDic(this.LsSchedule, new Map(), 'Id')
                return convertDic(this.LsTask, map, 'Id')
            },
        },
        // watch: { },
        methods: {
            computeAvailables() {
                let lsShedule = this.LsSchedule.map(x => [new Date(x.Begin), new Date(x.End)])
                let start = this.TimeLogStart
                let end = this.TimeLogEnd

                this.LsAvailable = findFreeTimeSlots(lsShedule, start, end)

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
            setRefs(comp, type) {
                const oRef = this.LsRef
                let ls = []
                switch (type) {
                    case 'Schedules': ls = oRef.Schedules
                        break;
                    default: break;
                }
                let ii = ls.findIndex(x => Object.is(x, comp))
                if (ii < 0) ls.push(comp)
                else ls.splice(ii, 1)   // remove
            },
            fillLogCommand(txt) {
                let target = document.body.querySelector('.txt-command[contenteditable]')
                target.innerHTML = txt
            },
            toggFinish(id) {
                let setDone = new Set(this.ItemDones)
                if (setDone.has(id)) setDone.delete(id)
                else setDone.add(id)
                this.ItemDones = setDone
            },
            isFinish(id) { return this.ItemDones.has(id) },
            // equalHas(txt1, txt2) {
            //     let hash1 = CryptoJS.SHA256(txt1), hash2 = CryptoJS.SHA256(txt2)
            //     return hash1.toString(CryptoJS.enc.Hex) == hash2.toString(CryptoJS.enc.Hex)
            // },
        },
        //beforeCreate() { },
        //created() { },
        //beforeMount() { },
        mounted() {
            values.forEach((path, ii) => {
                let pDom = document.body.querySelector(`.dnb-imp-html[dnbpath="${path}"]`)
                if (pDom) pDom.remove();
            })

            // const message = "123456";
            // const hash = CryptoJS.SHA256(message);//CryptoJS.MD5(message);
            // console.log(hash.toString(CryptoJS.enc.Hex));
            // console.log(hash.toString(CryptoJS.enc.Base64));// speed > Hex


        },
        beforeUpdate() { },
        updated() {

        },
    }).mount('#m-app')

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