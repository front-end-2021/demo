import { configureStore, createSlice } from "@reduxjs/toolkit"
import { Provider } from "react-redux"

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
            setGoals.call(state.Mains, lstMain)
        },
        setSubs: (state, action) => {
            const lstSub = action.payload
            setGoals.call(state.Subs, lstSub)
        },
    }
})
export const { setMains, setSubs } = DataList.actions

function setGoals(lstGoal) {
    const goals = this
    lstGoal.forEach(_g => {
        let _i = -1
        let goal = goals.find((x, i) => {
            if (x.Id === _g.Id) {
                _i = i
                return true
            }
            return false
        })
        if (!goal) {
            goals.push(_g)
        } else {
            const goalU = Object.assign(goal, _g)
            goals.splice(_i, 1, goalU)
        }
    })
}