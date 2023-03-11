import { configureStore, createSlice } from "@reduxjs/toolkit"
import { Provider } from "react-redux"

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
const MarketingStore = configureStore({
    reducer: {
        loading: loading.reducer
    }
})

export function MReduxProvider({ children }) {
    return (
        <Provider store={MarketingStore}>
            {children}
        </Provider>
    )
}