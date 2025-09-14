export function getCmdTask(text, IdGenerator, cmdNewTask = ['make Task']) {
    let lsIndexTask = KMPLsIndex(text, cmdNewTask.map(x => `${x} `))
    let allCommandIndex = new Set(lsIndexTask)
    allCommandIndex = Array.from(allCommandIndex)
    allCommandIndex.sort((a, b) => a - b)

    lsIndexTask = mapLs(lsIndexTask, allCommandIndex, text)
    let mapTasks = new Map()
    for (let ii = 0, arr, txt; ii < lsIndexTask.length; ii++) {
        arr = lsIndexTask[ii]
        txt = arr[1]
        let arrTxt = getTaskName(txt, cmdNewTask.map(x => `${x} `), [' due '])
        //console.log(arrTxt)
        if (Array.isArray(arrTxt) && 1 < arrTxt.length) {
            let [name, strDue] = arrTxt
            let due = parseTimeToDate(strDue)
            let obj = getTaskObject(name, due)
            if (obj) mapTasks.set(arr[0], obj)
        }
    }
    return [allCommandIndex, mapTasks]
    function getTaskObject(name, due) {
        if (typeof name != 'string' || name.length < 3) return null
        if (isDate(due)) {
            due = due.toISOString()
            return {
                Name: name, End: due, Note: '',
                Id: IdGenerator.generate().toString()
            }
        }
        return null
    }
    function getTaskName(text, sPatterns, ePatterns) {
        let uName = text, regex
        sPatterns.forEach(t => {
            regex = new RegExp(t, "gi");
            uName = uName.replace(regex, "");
        })
        let arrStr = splitByKeywords(uName, ePatterns)
        if (2 < arrStr.length) {
            let due = arrStr.pop()
            let name = arrStr.join(' ')
            return [name, due]
        }
        return arrStr
    }
}
export function getCmdAssignUser(text, lsIndexAssignUser, allCommandIndex, cmdAssignUser) {
    let lsIndex = mapLs(lsIndexAssignUser, allCommandIndex, text)
    let mapAssign = new Map()
    for (let ii = 0, arr, txt; ii < lsIndex.length; ii++) {
        arr = lsIndex[ii]
        txt = arr[1]
        let lsStr = splitByKeywords(txt, [...cmdAssignUser, ' to '])
        if (2 == lsStr.length) {
            lsStr = lsStr.map(str => rmLastPunctuation(str))
            mapAssign.set(arr[0], lsStr)
        }
    }
    return [mapAssign, lsIndex]
}
export function getCmdSchedule(text, lsIndexNewShedule, allCommandIndex, lsPattern, IdGenerator) {
    const patternSpecTimes = [' from ', ' begin ', ' start ', ' at ', ' end ', ' to ']
    let lsIndex = mapLs(lsIndexNewShedule, allCommandIndex, text)
    let mapNewSchedule = new Map()
    for (const arr of lsIndex) {
        let txt = arr[1]
        let arrTxt = getScheduleName(txt, lsPattern.map(x => `${x} `), patternSpecTimes)
        if (Array.isArray(arrTxt) && 2 < arrTxt.length) {
            let [name, strStart, strEnd] = arrTxt
            let start = parseTimeToDate(strStart)
            let end = parseTimeToDate(strEnd)
            let obj = getScheduleObject(name, start, end)
            if (obj) mapNewSchedule.set(arr[0], obj)
        }
    }
    return [mapNewSchedule, lsIndex]
    function getScheduleName(text, sPatterns, ePatterns) {
        let uName = text, regex
        sPatterns.forEach(t => {
            regex = new RegExp(t, "gi");
            uName = uName.replace(regex, "");
        })
        let arrStr = splitByKeywords(uName, ePatterns)
        if (3 < arrStr.length) {
            let end = arrStr.pop()
            let start = arrStr.pop()
            let name = arrStr.join(' ')
            return [name, start, end]
        }
        return arrStr
    }
    function getScheduleObject(name, start, end) {
        if (typeof name != 'string' || name.length < 3) return null
        if (isDate(start) && isDate(end)) {
            let obj = {
                Name: name, Users: [],
                Id: IdGenerator.generate().toString()
            }
            if (start.getTime() < end.getTime()) {
                obj.Begin = start
                obj.End = end
            } else {
                obj.Begin = end
                obj.End = start
            }
            obj.Begin = obj.Begin.toISOString()
            obj.End = obj.End.toISOString()
            return obj
        }
        return null
    }
}
export function getCommands(text, IdGenerator, objCmd = {}) {
    const cmdNewShedules = objCmd.CmdNewShedules || ['Make Schedule']
    const cmdNewPlans = objCmd.CmdNewPlans || ['Make Appointment']
    const cmdNewUser = objCmd.CmdNewUser || ['New Member']
    const cmdEditUser = objCmd.CmdEditUser || ['Edit User']
    const cmdSearch = objCmd.CmdSearch || ['go search']
    const cmdAssignUser = objCmd.CmdAssignUser || ['add user']
    const cmdDeletes = objCmd.CmdDeletes || ['delete item']

    const lsPttnSearchN = [...cmdSearch.map(x => `${x} name `)]
    const lsPttnSearchU = [...cmdSearch.map(x => `${x} person `), ...cmdSearch.map(x => `${x} user `), ...cmdSearch.map(x => `${x} member `)]
    let lsIISearchName = KMPLsIndex(text, lsPttnSearchN)
    let lsIISearchUser = KMPLsIndex(text, lsPttnSearchU)
    let lsIndexNewShedule = KMPLsIndex(text, cmdNewShedules.map(x => `${x} `))
    let lsIndexDelItem = KMPLsIndex(text, cmdDeletes.map(x => `${x} `))
    let lsIndexNewPlan = KMPLsIndex(text, cmdNewPlans.map(x => `${x} `))
    let lsIndexNewUser = KMPLsIndex(text, cmdNewUser)
    let lsIndexEditUser = KMPLsIndex(text, cmdEditUser)
    let lsIndexAssignUser = KMPLsIndex(text, cmdAssignUser)

    let allCommandIndex = new Set([...lsIISearchName, ...lsIISearchUser, ...lsIndexNewShedule,
    ...lsIndexNewPlan, ...lsIndexNewUser, ...lsIndexEditUser, ...lsIndexAssignUser, ...lsIndexDelItem])
    allCommandIndex = Array.from(allCommandIndex)
    allCommandIndex.sort((a, b) => a - b)

    if (1 < lsIISearchName.length) lsIISearchName.length = 1
    lsIISearchName = mapLs(lsIISearchName, allCommandIndex, text)
    let mapGoSearchN = new Map()
    addMapSearch(mapGoSearchN, lsIISearchName, lsPttnSearchN)

    if (1 < lsIISearchUser.length) lsIISearchUser.length = 1
    lsIISearchUser = mapLs(lsIISearchUser, allCommandIndex, text)
    let mapGoSearchU = new Map()
    addMapSearch(mapGoSearchU, lsIISearchUser, lsPttnSearchU)

    let prcs = getCmdSchedule(text, lsIndexNewShedule, allCommandIndex, cmdNewShedules, IdGenerator)
    let mapNewSchedule = prcs[0]
    lsIndexNewShedule = prcs[1]

    prcs = getCmdSchedule(text, lsIndexNewPlan, allCommandIndex, cmdNewPlans, IdGenerator)
    let mapNewPlan = prcs[0]
    lsIndexNewPlan = prcs[1]

    lsIndexNewUser = mapLs(lsIndexNewUser, allCommandIndex, text)
    let mapNewUser = new Map()
    for (const arr of lsIndexNewUser) {
        let txt = arr[1]
        let uName = getUserNames(txt, cmdNewUser)
        if (uName.length) mapNewUser.set(arr[0], uName)
    }
    lsIndexEditUser = mapLs(lsIndexEditUser, allCommandIndex, text)
    let mapEditUser = new Map()
    for (const arr of lsIndexEditUser) {
        let txt = arr[1]
        let lsStr = splitByKeywords(txt, [...cmdEditUser, ' to '])
        if (2 == lsStr.length) {
            lsStr = lsStr.map(str => rmLastPunctuation(str))
            mapEditUser.set(arr[0], lsStr)
        }
    }
    prcs = getCmdAssignUser(text, lsIndexAssignUser, allCommandIndex, cmdAssignUser)
    let mapAssignUser = prcs[0]
    lsIndexAssignUser = prcs[1]
    lsIndexDelItem = mapLs(lsIndexDelItem, allCommandIndex, text)
    let mapDelItem = new Map()
    for (const arr of lsIndexDelItem) {
        let txt = arr[1]
        let lsStr = splitByKeywords(txt, cmdDeletes)
        txt = rmLastPunctuation(lsStr[0])
        if (0 < lsStr.length) mapDelItem.set(arr[0], txt)
    }
    return [allCommandIndex, mapNewSchedule, mapNewPlan, mapNewUser,
        mapEditUser, mapAssignUser, mapGoSearchN, mapGoSearchU, mapDelItem]
    function addMapSearch(mapSearch, lsIndex, lsPttn) {
        if (0 < lsIndex.length) {
            const lsTrim = lsPttn.map(x => x.trim())
            for (let ii = 0, arr, txt; ii < lsIndex.length; ii++) {
                arr = lsIndex[ii]
                txt = arr[1]
                let lsStr = splitByKeywords(txt, lsPttn)
                if (lsStr.length) {
                    lsStr = lsStr.map(str => rmLastPunctuation(str))
                    for (let ll = lsStr.length - 1, str; -1 < ll; ll--) {
                        str = lsStr[ll]
                        if (lsTrim.includes(str)) lsStr.splice(ll, 1)
                    }
                    if (lsStr.length) {
                        let str = lsStr[0]
                        if (typeof str == 'string') mapSearch.set(arr[0], str)
                    }
                }
            }
        }
    }

}
function mapLs(listI, allCommandIndex, text) {
    return listI.map(i0 => {
        let ij = allCommandIndex.indexOf(i0)
        let i1 = allCommandIndex[ij + 1]
        if (typeof i1 != 'number') i1 = text.length
        let subTxt = text.slice(i0, i1);
        return [i0, subTxt.trim()]
    })
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
    return rmLastPunctuation(uName)
}
function parseTimeToDate(timeStr) {
    timeStr = rmLastPunctuation(timeStr)
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
function isDate(d) { return d instanceof Date }
function splitByKeywords(text, keywords) {
    // Chuyển danh sách cụm từ thành regex, không phân biệt hoa thường
    const escapedKeywords = keywords.map(word => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const rex = new RegExp(escapedKeywords.join('|'), 'gi'); // Tạo regex với flag 'gi'
    return text.split(rex).map(str => str.trim()).filter(str => str);
}
export function rmLastPunctuation(str) { return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]$/, "") /* Xóa dấu câu nếu xuất hiện cuối chuỗi*/ }
export function setUsers(name, nName, IdGenerator) {
    let listUser = this
    let ii = listUser.findIndex(u => u.Name == name)
    let pswd = 'abc'
    let hash1 = CryptoJS.SHA256(pswd)
    hash1.toString(CryptoJS.enc.Hex)
    if (ii < 0) {
        listUser = [...listUser]    // copy change ref
        listUser.push({
            Name: name,
            Id: IdGenerator.generate().toString(),
            Pwd: hash1.toString(CryptoJS.enc.Hex)
        })
        return listUser
    }
    if (typeof nName == 'string') {
        listUser = [...listUser]    // copy change ref
        listUser[ii].Name = nName
        return listUser
    }
    return this
}