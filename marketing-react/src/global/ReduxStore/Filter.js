import { configureStore, createSlice } from "@reduxjs/toolkit"
import { Provider } from "react-redux"

export const TypeUnit = [
    { Name: 'USD', View: '$' },
    { Name: 'Hour', View: 'H' },
    { Name: 'Day', View: 'D' },
]
export const filter = createSlice({
    name: 'filter',
    initialState: { Unit: TypeUnit[0] },
    reducers: {
        setUnit: (state, action) => {
            const name = action.payload
            const _u = TypeUnit.find(x => x.Name === name)
            if (_u) {
                state.Unit = _u
            }
        }
    }
})

export const { setUnit } = filter.actions