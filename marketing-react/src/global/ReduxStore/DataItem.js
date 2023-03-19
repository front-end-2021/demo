import { createSlice } from "@reduxjs/toolkit"

export const DataList = createSlice({
    name: 'datalist',
    initialState: {
        Mains: [],
        Subs: [],
        Actions: []
    },
    reducers: {
        setMains: (state, action) => {
            const lstMain = action.payload
            setItems(state.Mains, lstMain)
        },
        deleteMains: (state, action) => {
            const ids = action.payload
            removeItems.call(state.Mains, ids)
            const subDeleteIds = removeSubs.call(state.Subs, ids)
            removeActions.call(state.Actions, subDeleteIds)
        },
        setSubs: (state, action) => {
            const lstSub = action.payload
            setItems(state.Subs, lstSub)
        },
        deleteSubs: (state, action) => {
            const ids = action.payload
            removeItems.call(state.Subs, ids)
            removeActions.call(state.Actions, ids)
        },
        setActions: (state, action) => {
            const items = action.payload
            setItems(state.Actions, items)
        },
        deleteActions: (state, action) => {
            const ids = action.payload
            removeItems.call(state.Actions, ids)
        },
    }
})
export const { 
    setActions, deleteActions,
    setSubs, deleteSubs,
    setMains, deleteMains } = DataList.actions

function setItems(items, lstItem) {
    if(!Array.isArray(items)) return []
    lstItem.forEach(item => {
        let _i = -1
        let _item = items.find((x, i) => {
            if (x.Id === item.Id) {
                _i = i
                return true
            }
            return false
        })
        if (!_item) {
            items.push(item)
        } else {
            const newI = Object.assign(_item, item)
            items.splice(_i, 1, newI)
        }
    })
}
function removeItems(ids) {     // Mains/Subs/Actions
    const items = this
    for (let i = items.length - 1; i > -1; i--) {
        const item = items[i]
        if (ids.includes(item.Id)) {
            items.splice(i, 1)
        }
    }
}
function removeSubs(mainIds) {
    const subs = this
    const subRemoveIds = []
    for (let i = subs.length - 1; i > -1; i--) {
        const item = subs[i]
        if (mainIds.includes(item.ParentId)) {
            subs.splice(i, 1)
            subRemoveIds.push(item.Id)
        }
    }
    return subRemoveIds
}
function removeActions(subIds) {
    const actions = this
    for (let i = actions.length - 1; i > -1; i--) {
        const item = actions[i]
        if (subIds.includes(item.ParentId)) {
            actions.splice(i, 1)
        }
    }
}