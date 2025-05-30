// #region import
import { createApp } from 'vue'
import { ViewCommands, ViewSchedule } from './components/vw-diagram.js'

// #endregion
Promise.all([
    includeHTML(`./components/vw-diagram.html`),
]).then((values) => {
    createApp({
        name: `app-main`,
        components: {
            'view-commands': ViewCommands,
            'view-schedule': ViewSchedule,
        },
        data() {
            let start = new Date();
            start.setHours(8, 0, 0, 0);
            let end = new Date();
            end.setHours(17, 0, 0, 0);
            return {
                LsSchedule: [],
                LsAvailable: [],
                TimeLogStart: start,
                TimeLogEnd: end,
                LsUser: [],
                TxtSearchName: '',
                TxtDemoNewShedule: `Make schedule Daily meeting from 9:30am to 9:45am, make meeting Planning start 2:00pm end 5:00pm
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
                make schedule Evening Social Event	Dinner or entertainment to unwind  from 19:30 to 21:00`,
                TxtDemoNewUser: `New user DaiNB. New man Bill Gate. New man Elon Musk, 
                new person James, new person Michael, new person William, new person Benjamin, new person Alexander.
                new person Christopher, new person Matthew, new person Nathaniel, new person Jonathan, new person Daniel.
                new person Samuel, new person Henry, new person Nicholas, new person Thomas, new person Ryan, new person Charles.
                new person Joseph, new person David, new person Andrew, new person Patrick, new person Brandon, new person Ethan.
                new person Adam, new person Zachary, new person Lucas, new person Elizabeth, new person Olivia, new person Sophia.
                new person Emily, new person Charlotte, new person Isabella, new person Amelia, new person Abigail, new person Victoria.
                new person Grace, new person Natalie, new person Hannah, new person Samantha, new person Madison, new person Jessica.
                new person Katherine, new person Lauren, new person Rachel, new person Rebecca, new person Sarah, new person Evelyn.
                new person Julia, new person Caroline, new person Molly, new person Audrey`,
                TxtDemoAssignUser: `Assign user DaiNB to Daily meeting, assign man Bill Gate to Daily meeting, assign man Elon Musk to Planning.`,
                TxtDemoEditUser: `change man DaiNB to Dai Nguyen. `,
            }
        },
        // computed: { },
        // watch: { },
        methods: {
            computeAvailables() {
                let lsShedule = this.LsSchedule.map(x => [x.Begin, x.End])
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
        updated() { },
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