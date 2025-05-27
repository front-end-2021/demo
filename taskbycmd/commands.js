export function getCommands(text) {
    const ptrnNewShedules = ['new Schedule', 'new Timetable', 'new Agenda', 'new Calendar', 'new Planner', 'new Roadmap',
        'create Schedule', 'create Timetable', 'create Agenda', 'create Calendar', 'create Planner', 'create Roadmap']
    const patternTimes = ['Start time', 'End time', 'Valid from', 'Valid until', 'Cut-off time']
    const patternSpecTimes = ['from', 'begin', 'start', 'at', 'end', 'to']
    const patternNewPlans = ['new Appointment', 'new Meeting', 'new Event', 'new Reservation', 'new Booking',
        'new Recurring event', 'new Single event', 'new Time slot', 'create Appointment', 'create Meeting', 'create Event',
        'create Reservation', 'create Booking', 'create Recurring event', 'create Single event', 'create Time slot']
    const patternNewUser = ['new user', 'create user', 'new person', 'create person', 'new man', 'create man',
        'new woman', 'create woman', 'new staff', 'create staff', 'new member', 'create member']
    const patternEditUser = ['edit user from', 'edit user', 'edit person from', 'edit person', 'edit man from',
        'edit man', 'edit woman from', 'edit woman', 'edit staff from', 'edit staff', 'edit member from', 'edit member',
        'change user from', 'change user', 'change person from', 'change person', 'change man from', 'change man',
        'change woman from', 'change woman', 'change staff from', 'change staff', 'change member from', 'change member']
    const ptrnAssignUser = ['add user', 'assign user', 'add person', 'assign person', 'add man', 'assign man',
        'add woman', 'assign woman', 'add lady', 'assign lady', 'add staff', 'assign staff', 'add member', 'assign member']

    let lsIndexNewShedule = KMPLsIndex(text, ptrnNewShedules)
    let lsIndexNewPlan = KMPLsIndex(text, patternNewPlans)
    let lsIndexNewUser = KMPLsIndex(text, patternNewUser)
    let lsIndexEditUser = KMPLsIndex(text, patternEditUser)
    let lsIndexAssignUser = KMPLsIndex(text, ptrnAssignUser)

    let allCommandIndex = new Set([...lsIndexNewShedule, ...lsIndexNewPlan, ...lsIndexNewUser, ...lsIndexEditUser, ...lsIndexAssignUser])
    allCommandIndex = Array.from(allCommandIndex)
    allCommandIndex.sort((a, b) => a - b)

    lsIndexNewShedule = mapLs(lsIndexNewShedule)
    let mapNewSchedule = new Map()
    for (let ii = 0, arr, txt; ii < lsIndexNewShedule.length; ii++) {
        arr = lsIndexNewShedule[ii]
        txt = arr[1]
        let arrTxt = getScheduleName(txt, ptrnNewShedules, patternSpecTimes)
        if (Array.isArray(arrTxt) && 2 < arrTxt.length) {
            let [name, strStart, strEnd] = arrTxt
            let start = parseTimeToDate(strStart)
            let end = parseTimeToDate(strEnd)
            let obj = getScheduleObject(name, start, end)
            if (obj) mapNewSchedule.set(arr[0], obj)
        }
    }

    lsIndexNewPlan = mapLs(lsIndexNewPlan)
    let mapNewPlan = new Map()
    for (let ii = 0, arr, txt; ii < lsIndexNewPlan.length; ii++) {
        arr = lsIndexNewPlan[ii]
        txt = arr[1]
        let arrTxt = getScheduleName(txt, patternNewPlans, patternSpecTimes)
        if (Array.isArray(arrTxt) && 2 < arrTxt.length) {
            let [name, strStart, strEnd] = arrTxt
            let start = parseTimeToDate(strStart)
            let end = parseTimeToDate(strEnd)
            let obj = getScheduleObject(name, start, end)
            if (obj) mapNewPlan.set(arr[0], obj)
        }
    }

    lsIndexNewUser = mapLs(lsIndexNewUser)
    let mapNewUser = new Map()
    for (let ii = 0, arr, txt; ii < lsIndexNewUser.length; ii++) {
        arr = lsIndexNewUser[ii]
        txt = arr[1]
        let uName = getUserNames(txt, patternNewUser)
        if (uName.length) mapNewUser.set(arr[0], uName)
    }

    lsIndexEditUser = mapLs(lsIndexEditUser)
    let mapEditUser = new Map()
    for (let ii = 0, arr, txt; ii < lsIndexEditUser.length; ii++) {
        arr = lsIndexEditUser[ii]
        txt = arr[1]
        let lsStr = splitByKeywords(txt, [...patternEditUser, 'to'])
        if (2 == lsStr.length) {
            lsStr = lsStr.map(str => str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]$/, "") /* Xóa dấu câu nếu xuất hiện cuối chuỗi*/ )
            mapEditUser.set(arr[0], lsStr)
        }
    }

    lsIndexAssignUser = mapLs(lsIndexAssignUser)
    let mapAssignUser = new Map()
    for (let ii = 0, arr, txt; ii < lsIndexAssignUser.length; ii++) {
        arr = lsIndexAssignUser[ii]
        txt = arr[1]
        let lsStr = splitByKeywords(txt, [...ptrnAssignUser, 'to'])
        if (2 == lsStr.length) {
            lsStr = lsStr.map(str => str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]$/, "") /* Xóa dấu câu nếu xuất hiện cuối chuỗi*/ )
            mapAssignUser.set(arr[0], lsStr)
        }
    }

    console.group('list index command')
    console.log('new schedule ', lsIndexNewShedule)
    console.log('new plan ', lsIndexNewPlan)
    console.log('new user ', lsIndexNewUser)
    console.log('edit user ', lsIndexEditUser)
    console.log('assign user ', lsIndexAssignUser)
    console.log('all index ', allCommandIndex)
    console.log('ls new schedule ', mapNewSchedule)
    console.log('ls new plan ', mapNewPlan)
    console.log('ls new user ', mapNewUser)
    console.log('ls edit user ', mapEditUser)
    console.log('ls assign user ', mapAssignUser)
    console.groupEnd()

    return [allCommandIndex, mapNewSchedule, mapNewPlan, mapNewUser, mapEditUser, mapAssignUser]
    function mapLs(listI) {
        return listI.map(i0 => {
            let ij = allCommandIndex.indexOf(i0)
            let i1 = allCommandIndex[ij + 1]
            if (typeof i1 != 'number') i1 = text.length
            let subTxt = text.slice(i0, i1);
            return [i0, subTxt.trim()]
        })
    }
    function isDate(d) { return d instanceof Date }
}
function computeLPSArray(pattern) {
    let lps = Array(pattern.length).fill(0);
    let len = 0, i = 1;
    while (i < pattern.length) {
        if (equalLow(pattern[i], pattern[len])) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) len = lps[len - 1];
            else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}
function KMPsearch(text, pattern) {
    let indexes = [];
    let m = pattern.length, n = text.length;
    let lps = computeLPSArray(pattern);
    let i = 0, j = 0;
    while (i < n) {
        if (equalLow(pattern[j], text[i])) {
            i++;
            j++;
        }
        if (j === m) {
            indexes.push(i - j);
            j = lps[j - 1];
        } else if (i < n && !equalLow(pattern[j], text[i])) {
            if (j !== 0) j = lps[j - 1];
            else i++;
        }
    }
    return indexes;
}
function equalLow(txt1, txt2) { return txt1.toLowerCase() === txt2.toLowerCase() }
function KMPLsIndex(text, patterns) {
    let sIndex = new Set()
    for (let pattern of patterns) {
        let indexes = KMPsearch(text, pattern)
        sIndex = new Set([...sIndex, ...indexes]);
    }
    let lsIndex = Array.from(sIndex)
    lsIndex.sort((a, b) => a - b)
    return lsIndex
}
function getUserNames(txt, patterns) {
    if (typeof txt != 'string') return ''
    let arrStr = splitByKeywords(txt, patterns)
    if (!arrStr.length) return ''
    let uName = arrStr[0]
    return uName.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]$/, "")   // Xóa dấu câu nếu xuất hiện cuối chuỗi
}
function parseTimeToDate(timeStr) {
    timeStr = timeStr.replace(/(\d+)([ap]m)/i, "$1 $2"); // Chuẩn hóa định dạng (thêm dấu cách giữa giờ và AM/PM nếu chưa có)
    const date = new Date();        // Chuyển đổi thành đối tượng Date sử dụng new Date()
    let [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period) {
        // Chuyển đổi sang định dạng 24 giờ
        period = period.toLowerCase()
        if (period === "pm" && hours !== 12) hours += 12;
        else if (period === "am" && hours === 12) hours = 0;
    }
    // Đặt giờ và phút vào đối tượng Date
    date.setHours(hours, minutes, 0, 0);
    return date;
}
function getScheduleName(text, sPatterns, ePatterns) {
    let uName = text, regex
    sPatterns.forEach(t => {
        regex = new RegExp(t, "gi");
        uName = uName.replace(regex, "");
    })
    let arrStr = splitByKeywords(uName, ePatterns)
    return arrStr
}
function getScheduleObject(name, start, end) {
    if (typeof name != 'string' || name.length < 3) return null
    if (start instanceof Date && end instanceof Date) {
        let obj = { Name: name, Users: [] }
        if (start.getTime() < end.getTime()) {
            obj.Begin = start
            obj.End = end
        } else {
            obj.Begin = end
            obj.End = start
        }
        return obj
    }
    return null
}
function splitByKeywords(text, keywords) {
    // Chuyển danh sách cụm từ thành regex, không phân biệt hoa thường
    const escapedKeywords = keywords.map(word => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const rex = new RegExp(escapedKeywords.join('|'), 'gi'); // Tạo regex với flag 'gi'
    // Dùng split() để tách chuỗi
    return text.split(rex).map(str => str.trim()).filter(str => str);
}
