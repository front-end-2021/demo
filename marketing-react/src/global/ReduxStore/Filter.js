import { createSlice } from "@reduxjs/toolkit"

export const TypeUnit = [
    { Name: 'USD ($)', View: '$' },
    { Name: 'Hour (H)', View: 'H ' },
    { Name: 'Day (D)', View: 'D ' },
    { Name: 'Month (M)', View: 'M ' },
    { Name: 'Hide', View: '' },
]
export const Filter = createSlice({
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

export const { setUnit } = Filter.actions