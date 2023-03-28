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
    initialState: {
        Unit: TypeUnit[0],
        CanDrgDrp: false,
        TextSearch: '',
    },
    reducers: {
        setUnit: (state, action) => {
            const name = action.payload
            const _u = TypeUnit.find(x => x.Name === name)
            if (_u) {
                state.Unit = _u
            }
        },
        toggleDragDrop: (state) => {
            const isDnD = state.CanDrgDrp
            state.CanDrgDrp = !isDnD
        },
        setTextSearch: (state, action) => {
            const txt = action.payload
            state.TextSearch = txt
            if (txt.trim() !== '') state.CanDrgDrp = false
        },
    }
})

export const { setUnit, toggleDragDrop, setTextSearch } = Filter.actions