import { createSlice } from "@reduxjs/toolkit"

function removeItems(ids) {     // Mains/Subs/Actions
    const items = this
    for (let i = items.length - 1; i > -1; i--) {
        const item = items[i]
        if (ids.includes(item.Id)) {
            items.splice(i, 1)
        }
    }
}
function addItems(lstItem) {
    const items = this
    lstItem.forEach(item => {
        let _i = -1
        let _item = items.find((x, i) => {
            if (x.Id === item.Id) {
                _i = i; return true
            }
            return false
        })
        if (!_item) {
            items.push(item)
        } else {
            items.splice(_i, 1, Object.assign(_item, item))
        }
    })
}
function deleteItemsBy(parentIds) {
    if (!Array.isArray(parentIds) || !parentIds.length) return
    const goals = this
    const ids = []
    for (let i = goals.length - 1; i > -1; i--) {
        const goal = goals[i]
        const parentId = goal.ParentId
        if (parentIds.includes(parentId)) {
            goals.splice(i, 1)  // remove
            ids.includes(goal.Id) && ids.push(goal.Id)
        }
    }
    return ids
}
export const DataList = createSlice({
    name: 'datalist',
    initialState: {
        Mains: [],
        Subs: [],
        Actions: []
    },
    reducers: {
        addMains: (state, action) => {
            const lstMain = action.payload
            addItems.call(state.Mains, lstMain)
        },
        addSubs: (state, action) => {
            const lstSub = action.payload
            addItems.call(state.Subs, lstSub)
        },
        addActions: (state, action) => {
            const lstAction = action.payload
            addItems.call(state.Actions, lstAction)
        },
        deleteMains: (state, action) => {
            const ids = action.payload
            const mains = state.Mains
            const subs = state.Subs
            const actions = state.Actions
            removeItems.call(mains, ids)
            const subIds = deleteItemsBy.call(subs, ids)
            deleteItemsBy.call(actions, subIds)
        },
        deleteSubs: (state, action) => {
            const ids = action.payload
            const subs = state.Subs
            const actions = state.Actions
            removeItems.call(subs, ids)
            deleteItemsBy.call(actions, ids)
        },
        deleteActions: (state, action) => {
            const ids = action.payload
            const actions = state.Actions
            removeItems.call(actions, ids)
        },
    }
})
export const {
    addMains, addSubs, addActions,
    deleteMains, deleteSubs, deleteActions
} = DataList.actions
