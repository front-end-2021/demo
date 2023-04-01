import { createSlice } from "@reduxjs/toolkit"

export const TypeUnit = [
    { Name: 'USD ($)', View: '$' },
    { Name: 'Hour (H)', View: 'H ' },
    { Name: 'Day (D)', View: 'D ' },
    { Name: 'Month (M)', View: 'M ' },
    { Name: 'Hide', View: '' },
]
export const NavView = [
    'Detail', 'Simple', 'Collapse', 'Roadmap', 'Document'
]
export const Navbar = createSlice({
    name: 'navbar',
    initialState: {
        Unit: TypeUnit[0],
        CanDrgDrp: false,
        TextSearch: '',
        ViewType: 0,
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
            if(!isDnD) state.ViewType = 1
        },
        setTextSearch: (state, action) => {
            const txt = action.payload
            state.TextSearch = txt
            if (txt.trim() !== '') {
                state.CanDrgDrp = false
                state.ViewType = 0
            }
        },
        setView: (state, action) => {
            const index = action.payload
            state.ViewType = index
            if(index !== 1) state.CanDrgDrp = false
        },
    }
})

export const { setUnit, toggleDragDrop,
    setTextSearch, setView } = Navbar.actions