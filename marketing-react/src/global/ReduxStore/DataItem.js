import { createSlice } from "@reduxjs/toolkit"

function setItems(items, lstItem) {
    if (!Array.isArray(items)) return []
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
export const DataMap = createSlice({
    name: 'datamap',
    initialState: {
        Mains: [],
        MapMain: {}, // {mainid: [ListSub]}
        MapSub: {},  // {subid: [ListAction]}
    },
    reducers: {
        addMains: (state, action) => {
            const lstMain = action.payload
            setItems(state.Mains, lstMain)
        },
        removeMains: (state, action) => {
            const ids = action.payload
            removeItems.call(state.Mains, ids)
            const mapMain = state.MapMain
            let subIds = []
            ids.forEach(id => {
                const _sIds = deleteChilds.call(mapMain, id)// delete subs
                subIds = subIds.concat(_sIds)
            });
            const mapSub = state.MapSub
            subIds.forEach(id => {
                deleteChilds.call(mapSub, id)   // delete actions
            })
        },
        addSubs: (state, action) => {
            const { mainId, lstSub } = action.payload
            const mapMain = state.MapMain
            if (Array.isArray(mapMain[mainId])) {
                const subs = mapMain[mainId]
                setChilds.call(subs, lstSub)
            } else {
                mapMain[mainId] = lstSub
            }
        },
        removeSubs: (state, action) => {
            const ids = action.payload
            const mapMain = state.MapMain
            deleteItems.call(mapMain, ids)
            const mapSub = state.MapSub
            ids.forEach(subid => {
                deleteChilds.call(mapSub, subid)
            })
        },
        addActions: (state, action) => {
            const { subId, items } = action.payload
            const mapSub = state.MapSub
            if (Array.isArray(mapSub[subId])) {
                const actions = mapSub[subId]
                setChilds.call(actions, items)
            } else {
                mapSub[subId] = items
            }
        },
        removeActions: (state, action) => {
            const ids = action.payload
            const mapSub = state.MapSub
            deleteItems.call(mapSub, ids)
        },
    }
})
export const {
    addActions, removeActions,
    addSubs, removeSubs,
    addMains, removeMains } = DataMap.actions
function setChilds(lstChild) {
    const items = this
    if (!Array.isArray(items)) return
    lstChild.forEach(item => {
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
function deleteChilds(key) {
    const _map = this
    if (Array.isArray(_map[key])) {
        const ids = _map[key].map(x => x.Id)
        delete _map[key]
        return ids
    }
    return []
}
function deleteItems(ids) {
    const mapGoal = this
    for (const parentId in mapGoal) {
        const lstChild = mapGoal[parentId]
        const childIds = lstChild.map(s => s.Id)
        if (childIds.find(id => ids.includes(id))) {
            ids.forEach(id => {
                for (let _i = lstChild.length - 1; _i > -1; _i--) {
                    const sub = lstChild[_i]
                    if (sub.Id === id) {
                        lstChild.splice(_i, 1)    // remove
                    }
                }
            })
            return parentId
        }
    }
}