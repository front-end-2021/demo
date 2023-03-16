import { v4 as uuidv4 } from 'uuid';

const _keyListMain = 'ListMain'
const _keyListSub = 'ListSub'
const _keyListAction = 'ListAction'

export function saveListMain(mains) {
    setData(_keyListMain, mains)
}
export function getListMain() {
    return getValue(_keyListMain) || [];
}
function getListSub(mainid) {
    const lstSub = getValue(_keyListSub) || []
    return lstSub.filter(s => s.ParentId === mainid)
}
function getListAction(subid) {
    const lstAction = getValue(_keyListAction) || []
    return lstAction.filter(a => a.ParentId === subid)
}
export function getListSubActionWith(apiPath, params) {
    const { mainid, subid } = params
    switch (apiPath) {
        case 'subs':
            return getListSub(mainid)
        case 'actions':
            return getListAction(subid)
        default:
            return []
    }
}
export function saveAction(id, item) {
    const lstAction = getValue(_keyListAction) || []
    const action = lstAction.find(a => a.Id === id)
    if (action) {
        if (item.Name) action.Name = item.Name
        if (item.Description) action.Description = item.Description
        if (item.Start) action.Start = item.Start
        if (item.End) action.End = item.End
        if (typeof item.IsDone === 'boolean') action.IsDone = item.IsDone
        if (item.ExpectCost) action.ExpectCost = item.ExpectCost
        if (item.TrueCost) action.ExpectCost = item.TrueCost
        setData(_keyListAction, lstAction)
        return action
    }
    return null
}
export function saveGoal(id, item) {
    const lstGoal = !item.ParentId ? (getValue(_keyListMain) || []) :
        (getValue(_keyListSub) || [])
    const goal = lstGoal.find(a => a.Id === id)
    if (goal) {
        if (item.Name) goal.Name = item.Name
        if (item.Description) goal.Description = item.Description
        if (item.Start) goal.Start = item.Start
        if (item.End) goal.End = item.End
        if (typeof item.IsDone === 'boolean') goal.IsDone = item.IsDone
        if (item.Budget) goal.Budget = item.Budget

        if (!item.ParentId) setData(_keyListMain, lstGoal)
        else setData(_keyListSub, lstGoal)
        return goal
    }
    return null
}
export function insertMain(item) {
    const lstMain = getValue(_keyListMain) || []
    item.Id = uuidv4()
    lstMain.push(item)
    setData(_keyListMain, lstMain)
    return item.Id
}
export function insertSub(item) {
    const lstSub = getValue(_keyListSub) || []
    item.Id = uuidv4()
    lstSub.push(item)
    setData(_keyListSub, lstSub)
    return item.Id
}
export function insertAction(item) {
    const lstAction = getValue(_keyListAction) || []
    item.Id = uuidv4()
    lstAction.push(item)
    setData(_keyListAction, lstAction)
    return item.Id
}
export function deleteAction(id) {
    const lstAction = getValue(_keyListAction) || []
    const _i_ = lstAction.map(a => a.Id).indexOf(id)
    if (_i_ > -1) {
        lstAction.splice(_i_, 1)
        setData(_keyListAction, lstAction)
    }
    return id
}
function getValue(key) {
    const dtaText = localStorage.getItem(key)
    if (dtaText) return JSON.parse(dtaText)
    return
}
function setData(key, data) {
    if (typeof data === 'undefined') return;
    if (data === 'undefined') return;
    const dtaText = JSON.stringify(data)
    localStorage.setItem(key, dtaText)
}
export function deleteSub(id) {
    const lstSub = getValue(_keyListSub) || []
    const _i_ = lstSub.map(s => s.Id).indexOf(id)
    if (_i_ > -1) {
        const lstAction = getValue(_keyListAction) || []
        for (let i = lstAction.length - 1; i > -1; i--) {
            if (lstAction[i].ParentId === id) {
                lstAction.splice(i, 1)
            }
        }
        setData(_keyListAction, lstAction)

        lstSub.splice(_i_, 1)
        setData(_keyListSub, lstSub)
    }
    return id
}
export function deleteMain(id) {
    const lstMain = getValue(_keyListMain) || []
    const _i_ = lstMain.map(m => m.Id).indexOf(id)
    if (_i_ > -1) {
        deleteActionFrom(id)
        deleteSubFrom(id)
        lstMain.splice(_i_, 1)
        setData(_keyListMain, lstMain)
    }
    return id
}
function deleteSubFrom(mainid) {
    const lstSub = getValue(_keyListSub) || []
    for (let i = lstSub.length - 1; i > -1; i--) {
        if (lstSub[i].ParentId === mainid) {
            lstSub.splice(i, 1)
        }
    }
    setData(_keyListSub, lstSub)
}
function deleteActionFrom(mainid) {
    const lstSub = getValue(_keyListSub) || []
    const ids = lstSub.filter(s => s.ParentId === mainid).map(s => s.Id)
    const lstAction = getValue(_keyListAction) || []
    for (let i = lstAction.length - 1; i > -1; i--) {
        if (ids.includes(lstAction[i].ParentId)) {
            lstAction.splice(i, 1)
        }
    }
    setData(_keyListAction, lstAction)
}
export function duplicateSub(id) {
    const lstSub = getValue(_keyListSub) || []
    const sub = lstSub.find(s => s.Id === id)
    if (sub) {
        const newSub = JSON.parse(JSON.stringify(sub))
        newSub.Id = uuidv4()
        newSub.Name = `COPY ${sub.Name}`
        lstSub.push(newSub)
        setData(_keyListSub, lstSub)

        const lstA = getValue(_keyListAction) || []
        for (let j = lstA.length - 1; j > -1; j--) {
            const _a = lstA[j]
            if (_a.ParentId === id) {
                const newA = JSON.parse(JSON.stringify(_a))
                newA.Id = uuidv4()
                newA.ParentId = newSub.Id
                newA.Name = `${_a.Name} (1)`
                lstA.push(newA)
            }
        }
        setData(_keyListAction, lstA)

        return newSub
    }
    return null
}
export function duplicateMain(id) {
    const lstMain = getValue(_keyListMain) || []
    const item = lstMain.find(s => s.Id === id)
    if (item) {
        const newMain = JSON.parse(JSON.stringify(item))
        newMain.Id = uuidv4()
        newMain.Name = `COPY ${item.Name}`
        lstMain.push(newMain)
        setData(_keyListMain, lstMain)

        const mainid = id;
        const newMainId = newMain.Id
        const lstSub = getValue(_keyListSub) || []
        const lstA = getValue(_keyListAction) || []

        for (let i = lstSub.length - 1; i > -1; i--) {
            const sub = lstSub[i]
            if (sub.ParentId === mainid) {
                const newSub = JSON.parse(JSON.stringify(sub))
                newSub.Id = uuidv4()
                newSub.ParentId = newMainId
                newSub.Name = `${sub.Name} (1)`
                lstSub.push(newSub)

                for (let j = lstA.length - 1; j > -1; j--) {
                    const _a = lstA[j]
                    if (_a.ParentId === sub.Id) {
                        const newA = JSON.parse(JSON.stringify(_a))
                        newA.Id = uuidv4()
                        newA.ParentId = newSub.Id
                        newA.Name = `${_a.Name} (1)`
                        lstA.push(newA)
                    }
                }
            }
        }
        setData(_keyListSub, lstSub)
        setData(_keyListAction, lstA)

        return newMain
    }
}