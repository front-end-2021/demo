import { v4 as uuidv4 } from 'uuid';
import { logItem } from '../global/GlobalLog';

const _keyListMain = 'ListMain'
const _keyListSub = 'ListSub'
const _keyListAction = 'ListAction'
const _keyListIndex = 'ListIndex'

export function saveListMain(mains) {
    if (!Array.isArray(mains) || !mains.length) return
    mains.forEach(item => {
        delete item.Index
    })
    setData(_keyListMain, mains)
}
export function getListMain() {
    const mains = getValue(_keyListMain) || [];
    return mapIndex(mains)
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
function getListSub(mainid) {
    const lstSub = getValue(_keyListSub) || []
    const items = lstSub.filter(s => s.ParentId === mainid)
    mapExpand.call(items)
    return mapIndex(items)
}
export function getSubsBy(ids) {
    const lstSub = getValue(_keyListSub) || []
    const subs = lstSub.filter(x => ids.includes(x.Id))
    subs.forEach(sub => {
        const lstAction = getActions()
        const items = lstAction.filter(a => sub.Id === a.ParentId)
        mapExpand.call(items)
        sub.Actions = mapIndex(items)
    })
    mapExpand.call(subs)
    return mapIndex(subs)
}
function getListAction(subid) {
    const lstAction = getActions()
    const items = lstAction.filter(a => subid === a.ParentId)
    mapExpand.call(items)
    return mapIndex(items)
}
function getActions() {
    return getValue(_keyListAction) || []
}
export function saveAction(id, item) {
    delete item.Index
    const lstAction = getActions()
    const action = lstAction.find(a => a.Id === id)
    if (action) {
        if (item.Name) action.Name = item.Name
        if (item.Description) action.Description = item.Description
        if (item.Start) action.Start = item.Start
        if (item.End) action.End = item.End
        if (typeof item.IsDone === 'boolean') action.IsDone = item.IsDone
        if (typeof item.ExpectCost === 'number' && action.ExpectCost !== item.ExpectCost)
            action.ExpectCost = item.ExpectCost
        if (typeof item.TrueCost === 'number' && action.TrueCost !== item.TrueCost)
            action.TrueCost = item.TrueCost
        setData(_keyListAction, lstAction)
        return action
    }
    return null
}
export function saveGoal(id, item) {
    delete item.Index
    const lstGoal = !item.ParentId ? (getValue(_keyListMain) || []) :
        (getValue(_keyListSub) || [])
    const goal = lstGoal.find(a => a.Id === id)
    if (goal) {
        if (item.Name) goal.Name = item.Name
        if (item.Description) goal.Description = item.Description
        if (item.Start) goal.Start = item.Start
        if (item.End) goal.End = item.End
        if (typeof item.IsDone === 'boolean') goal.IsDone = item.IsDone
        if (typeof item.Budget === 'number' && goal.Budget !== item.Budget)
            goal.Budget = item.Budget

        if (!item.ParentId) setData(_keyListMain, lstGoal)
        else setData(_keyListSub, lstGoal)
        return goal
    }
    return null
}
export function insertMain(item) {
    delete item.Index
    const lstMain = getValue(_keyListMain) || []
    item.Id = uuidv4()
    lstMain.push(item)
    setData(_keyListMain, lstMain)
    return item.Id
}
export function insertSub(item) {
    delete item.Index
    const lstSub = getValue(_keyListSub) || []
    item.Id = uuidv4()
    lstSub.push(item)
    setData(_keyListSub, lstSub)
    return item.Id
}
export function insertAction(item) {
    delete item.Index
    const lstAction = getActions()
    const newid = uuidv4()
    item.Id = newid
    lstAction.push(item)
    setData(_keyListAction, lstAction)
    return newid
}
export function deleteAction(id) {
    const lstAction = getActions()
    const _i_ = lstAction.map(a => a.Id).indexOf(id)
    if (_i_ > -1) {
        lstAction.splice(_i_, 1)
        setData(_keyListAction, lstAction)
    }
    return id
}
export function deleteSub(id) {
    const lstSub = getValue(_keyListSub) || []
    const _i_ = lstSub.map(s => s.Id).indexOf(id)
    if (_i_ > -1) {
        const lstAction = getActions()
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
        const lstAction = getActions()
        for (let i = lstAction.length - 1; i > -1; i--) {
            if (ids.includes(lstAction[i].ParentId)) {
                lstAction.splice(i, 1)
            }
        }
        setData(_keyListAction, lstAction)
    }
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

        const lstA = getActions()
        for (let j = 0, len = lstA.length; j < len; j++) {
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
        const lstA = getActions()

        for (let i = 0, len = lstSub.length; i < len; i++) {
            const sub = lstSub[i]
            if (sub.ParentId === mainid) {
                const newSub = JSON.parse(JSON.stringify(sub))
                newSub.Id = uuidv4()
                newSub.ParentId = newMainId
                newSub.Name = `${sub.Name} (1)`
                lstSub.push(newSub)

                for (let j = 0, _l = lstA.length; j < _l; j++) {
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
export function saveIndexAction(lstIndex, item) {
    if (item) {
        const lstAction = getActions()
        const action = lstAction.find(a => a.Id === item.Id)
        if (action) {
            action.ParentId = item.ParentId
            setData(_keyListAction, lstAction)
        }
    }
    saveIndexes(lstIndex)
}
function saveIndexes(lstIndex) { // [{Id, Index}]
    if (!Array.isArray(lstIndex) || !lstIndex.length) return
    const indexes = getListIndex()   // get localStorage
    lstIndex.forEach(newIdx => {
        let _i = -1
        const indx = indexes.find((x, i) => {
            if (x.Id === newIdx.Id) {
                _i = i
                return true
            }
            return false
        })
        if (indx) {
            indexes.splice(_i, 1, newIdx)   // replace
        } else {
            indexes.push(newIdx)
        }
    })
    setData(_keyListIndex, indexes)     // save localStorage
}
export function getListIndex() {
    return getValue(_keyListIndex) || []    // [{Id, Index}]
}
function mapIndex(items) {
    if (!Array.isArray(items) || !items.length) return items
    const lstIndex = getListIndex()
    items.forEach((item, i) => {
        const idx = lstIndex.find(x => x.Id === item.Id)
        if (idx) {
            item.Index = idx.Index
        } else {
            item.Index = i
        }
    })
    return items.sort((a, b) => a.Index - b.Index)
}
function mapExpand() {
    const items = this
    if (!Array.isArray(items) || !items.length) return
    items.forEach(item => {
        item.IsExpand = true
    })
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
