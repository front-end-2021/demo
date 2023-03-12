import React, {
    useContext, useState,
} from 'react'
import '../styles/animation.scss'

export const LoadingContext = React.createContext()
// export const useLoading = () => useContext(LoadingContext)

export const DialogContext = React.createContext()
export const useDialog = () => useContext(DialogContext)

export function ProcessingProvider({ children }) {
    const [loading, setLoading] = useState(true)
    const [dialog, setDialog] = useState(null)
    return (
        <LoadingContext.Provider
            value={{
                loading: loading,
                setLoading: (isLoading) => setLoading(!!isLoading),
            }}>
            <DialogContext.Provider
                value={{
                    dialog: dialog,
                    setDialog: (context) => setDialog(context)
                }}>
                {children}
                {dialog && <ConfirmView context={dialog} />}
            </DialogContext.Provider>
            {loading && <Loading />}
        </LoadingContext.Provider>
    )
}
function Loading() {
    return <BackgroundProcessing>
        <div className="dnb-pos-center d-loading">
            <span className="d-pulse d-pulse-1"></span>
            <span className="d-pulse d-pulse-2"></span>
            <span className="d-pulse d-pulse-3"></span>
        </div>
    </BackgroundProcessing>;
}
function BackgroundProcessing({ children }) {
    return <div className='dnb-bg-processing'>
        <div className='dnb-bg-process-overlay'></div>
        {children}
    </div>
}
function ConfirmView({ context }) {
    const { children, ok, cancel } = context
    const dialog = useDialog()
    function confirmOk() {
        if (typeof ok === 'function') ok()
        onCloseView()
    }
    function onCloseView() {
        dialog.setDialog(null)
    }
    function confirmCancel() {
        if (typeof cancel === 'function') cancel()
        onCloseView()
    }
    return <BackgroundProcessing>
        <div className='dnb-pos-center dnb-dialog animated bounceInDown'>
            <div className='dnb-dialog-head'>
                <strong>Confirm</strong>
            </div>
            <div className='dnb-dialog-body'>{children}</div>
            <div className='dnb-dialog-buttons'>
                <span onClick={confirmCancel}>Cancel</span>
                <span onClick={confirmOk}>Ok</span>
            </div>
        </div>
    </BackgroundProcessing>
}