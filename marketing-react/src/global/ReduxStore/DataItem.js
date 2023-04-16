import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiSetIndexAction } from "../../service"

function removeItems(ids) {     // Mains/Subs/Actions
    const items = this
    for (let i = items.length - 1; i > -1; i--) {
        const item = items[i]
        if (ids.includes(item.Id)) {
            items.splice(i, 1) // remove at i
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
    for (let i = goals.length - 1; i > -1; i--) {
        const goal = goals[i]
        const parentId = goal.ParentId
        if (parentIds.includes(parentId)) {
            goals.splice(i, 1)  // remove
        }
    }
}

export const setIndexActions = createAsyncThunk(
    'post/setIndexActions',
    async ({ src, des, item }, thunkAPI) => {
        const actions = await apiSetIndexAction({ src, des, item })
        const srcSubId = src.SubId
        const desSubId = des.SubId
        const subids = srcSubId !== desSubId ? [srcSubId, desSubId] : [srcSubId]
        return { subids, actions }
    }
)
export const DataList = createSlice({
    name: 'datalist',
    initialState: {
        Mains: [],
        Subs: [],           // [{ParentId, Id, ..., Actions: [{ParentId, Id, ...}]}]
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
            const { subid, actions } = action.payload
            const sub = state.Subs.find(x => x.Id === subid)
            if (sub) {
                const lstA = sub.Actions || []
                actions.forEach(_a => {
                    let i_ = -1
                    const a_ = lstA.find((x, i) => {
                        if (x.Id === _a.Id) {
                            i_ = i
                            return true
                        }
                        return false
                    })
                    if (a_) {
                        const act = Object.assign(a_, _a)
                        lstA.splice(i_, 1, act)
                    } else {
                        lstA.push(_a)
                    }
                })
                if (!Array.isArray(sub.Actions)) {
                    sub.Actions = lstA
                }
            }
        },
        deleteMains: (state, action) => {
            const ids = action.payload
            const mains = state.Mains
            const subs = state.Subs
            removeItems.call(mains, ids)
            deleteItemsBy.call(subs, ids)
        },
        deleteSubs: (state, action) => {
            const ids = action.payload
            const subs = state.Subs
            removeItems.call(subs, ids)
        },
        deleteActions: (state, action) => {
            const { subid, ids } = action.payload
            const sub = state.Subs.find(x => x.Id === subid)
            if (sub) {
                removeItems.call(sub.Actions, ids)
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setIndexActions.fulfilled, (state, action) => {
            const { subids, actions } = action.payload
            state.Subs.forEach(sub => {
                if (subids.includes(sub.Id)) {
                    const acts = actions.filter(a => a.ParentId === sub.Id)
                    const lstA = sub.Actions || []
                    lstA.splice(0)  // remore all
                    sub.Actions = acts
                }
            })
        })
    },
})
export const {
    addMains, addSubs,
    addActions,
    deleteMains, deleteSubs, deleteActions
} = DataList.actions
