import { v4 as uuidv4 } from 'uuid';

const _keyListMain = 'ListMain'
const _keyListSub = 'ListSub'
const _keyListAction = 'ListAction'

export function saveListMain(mains) {
    setData(_keyListMain, mains)
}
export function getListMain() {
    return new Promise(res => {
        res(getValue(_keyListMain) || [])
    })
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
    return new Promise(res => {
        switch (apiPath) {
            case 'subs':
                res(getListSub(mainid))
                break;
            case 'actions':
                res(getListAction(subid))
                break;
            default:
                break;
        }
    })
}
export function saveAction(id, item) {
    const lstAction = getValue(_keyListAction) || []
    const action = lstAction.find(a => a.Id === id)
    return new Promise(res => {
        if (action) {
            if (item.Name) action.Name = item.Name
            if (item.Description) action.Description = item.Description
            if (item.Start) action.Start = item.Start
            if (item.End) action.End = item.End
            if (item.IsDone) action.IsDone = item.IsDone
            if (item.ExpectCost) action.ExpectCost = item.ExpectCost
            if (item.TrueCost) action.ExpectCost = item.TrueCost
            setData(_keyListAction, lstAction)
            res(action)
        }
    })
}
export function saveGoal(id, item) {
    const lstGoal = !item.ParentId ? (getValue(_keyListMain) || []) :
        (getValue(_keyListSub) || [])
    const goal = lstGoal.find(a => a.Id === id)
    return new Promise(res => {
        if (goal) {
            if (item.Name) goal.Name = item.Name
            if (item.Description) goal.Description = item.Description
            if (item.Start) goal.Start = item.Start
            if (item.End) goal.End = item.End
            if (item.IsDone) goal.IsDone = item.IsDone
            if (item.Budget) goal.Budget = item.Budget
            !item.ParentId && setData(_keyListMain, lstGoal)
            item.ParentId && setData(_keyListSub, lstGoal)
            res(goal)
        }
    })
}
export function insertMain(item) {
    const lstMain = getValue(_keyListMain) || []
    item.Id = uuidv4()
    lstMain.push(item)
    setData(_keyListMain, lstMain)
    return Promise.resolve(item.Id)
}
export function insertSub(item) {
    const lstSub = getValue(_keyListSub) || []
    item.Id = uuidv4()
    lstSub.push(item)
    setData(_keyListSub, lstSub)
    return Promise.resolve(item.Id)
}
export function insertAction(item) {
    const lstAction = getValue(_keyListAction) || []
    item.Id = uuidv4()
    lstAction.push(item)
    setData(_keyListAction, lstAction)
    return Promise.resolve(item.Id)
}
export function deleteAction(id) {
    const lstAction = getValue(_keyListAction) || []
    const _i_ = lstAction.map(a => a.Id).indexOf(id)
    return new Promise(res => {
        if (_i_ > -1) {
            res()
            lstAction.splice(_i_, 1)
            setData(_keyListAction, lstAction)
        }
    })
}
function getValue(key) {
    const dtaText = localStorage.getItem(key)
    if (dtaText) return JSON.parse(dtaText)
    return
}
function setData(key, data) {
    const dtaText = JSON.stringify(data)
    localStorage.setItem(key, dtaText)
}
export function deleteSub(id) {
    const lstSub = getValue(_keyListSub) || []
    const _i_ = lstSub.map(s => s.Id).indexOf(id)
    return new Promise(res => {
        if (_i_ > -1) {
            res()
            lstSub.splice(_i_, 1)
            setData(_keyListSub)
        }
    })
}
export function deleteMain(id) {
    const lstMain = getValue(_keyListMain) || []
    const _i_ = lstMain.map(m => m.Id).indexOf(id)
    return new Promise(res => {
        if (_i_ > -1) {
            res()
            lstMain.splice(_i_, 1)
            setData(_keyListMain)
        }
    })
}
export function duplicateSub(id) {
    const lstSub = getValue(_keyListSub) || []
    const sub = lstSub.find(s => s.Id === id)
    return new Promise(res => {
        if(sub) {
            const newSub = JSON.parse(JSON.stringify(sub))
            newSub.Id = uuidv4()
            lstSub.push(newSub)
            setData(_keyListSub, lstSub)
            res(newSub)
        }
    })
}
export function duplicateMain(id) {
    const lstMain = getValue(_keyListMain) || []
    const item = lstMain.find(s => s.Id === id)
    return new Promise(res => {
        if(item) {
            const newMain = JSON.parse(JSON.stringify(item))
            newMain.Id = uuidv4()
            lstMain.push(newMain)
            setData(_keyListMain, lstMain)
            res(newMain)
        }
    })
}