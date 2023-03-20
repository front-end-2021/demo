import { configureStore, createSlice } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import { DataMap } from "./DataItem"

const loading = createSlice({
    name: 'loading',
    initialState: { Items: [] },
    reducers: {
        setItems: (state, action) => {
            const { ids, isAdd } = action.payload
            ids.forEach(id => {
                const _i = state.Items.indexOf(id)
                if (isAdd && _i < 0) {
                    state.Items.push(id)
                }
                if (!isAdd && _i > -1) {
                    state.Items.splice(_i, 1)
                }
            })
        },
    }
})
export const { setItems } = loading.actions

const focusitem = createSlice({
    name: 'focusitem',
    initialState: {
        MenuId: null,
        EditId: null
    },
    reducers: {
        showMenu: (state, action) => {
            state.EditId = null
            const id = action.payload
            if (state.MenuId !== id) state.MenuId = id
            else state.MenuId = null
        },
        showEdit: (state, action) => {
            state.MenuId = null
            const id = action.payload

            if (state.EditId !== id) state.EditId = id
            else state.EditId = null
        },
    }
})
export const { showMenu, showEdit } = focusitem.actions

export const MarketingStore = configureStore({
    reducer: {
        loading: loading.reducer,
        focus: focusitem.reducer,
        dmap: DataMap.reducer
    }
})

export function MReduxProvider({ children }) {
    return (
        <Provider store={MarketingStore}>
            {children}
        </Provider>
    )
}