import React, { useContext, useState, useEffect } from 'react'
import { getDateCalendarValue, enableScroll, disableScroll } from '.'
import '../styles/animation.scss'

export const LoadingContext = React.createContext()
export const ViewContext = React.createContext()

export const DialogContext = React.createContext()
export const useDialog = () => useContext(DialogContext)

export const ConfirmType = {
    default: 0,
    ConfirmWithDate: 1
}
export function ProcessingProvider({ children }) {
    const [loading, setLoading] = useState(true)
    const [dialog, setDialog] = useState(null)
    function getConfirtView() {
        switch (dialog.type) {
            case ConfirmType.ConfirmWithDate:
                return <ConfirmViewWithDate context={dialog} />
            default:
                return <ConfirmView context={dialog} />
        }
    }
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
                {dialog && getConfirtView()}
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
function ConfirmView({ context, children }) {
    useEffect(() => {
        disableScroll()
        return enableScroll
    }, []);
    const { html_, ok, title } = context
    const dialog = useDialog()
    function confirmOk() {
        if (typeof ok === 'function') ok()
        onCloseView()
    }
    function onCloseView() {
        dialog.setDialog(null)
    }
    return <BackgroundProcessing>
        <div className='dnb-pos-center dnb-dialog animated bounceInDown'>
            <div className='dnb-dialog-head'>
                <strong>{title ? title : 'Confirm'}</strong>
            </div>
            <div className='dnb-dialog-body'>
                {html_}
                {children}
            </div>
            <div className='dnb-dialog-buttons'>
                <span onClick={onCloseView}>Cancel</span>
                <span onClick={confirmOk}>Ok</span>
            </div>
        </div>
    </BackgroundProcessing>
}
function ConfirmViewWithDate({ context }) {
    useEffect(() => {
        disableScroll()
        return enableScroll
    }, []);
    const dialog = useDialog()
    const { html_, ok, Start, End } = context
    const [start, setStart] = useState(getDateCalendarValue(Start))
    const [end, setEnd] = useState(getDateCalendarValue(End))
    function onCloseView() { dialog.setDialog(null) }
    function handleChangeStart(e) {
        const newD = e.target.value
        setStart(newD)
    }
    function handleChangeEnd(e) {
        const newD = e.target.value
        setEnd(newD)
    }
    function confirmOk() {
        if (typeof ok === 'function') ok(start, end)
        onCloseView()
    }
    return (
        <BackgroundProcessing>
            <div className='dnb-pos-center dnb-dialog animated bounceInDown'>
                <div className='dnb-dialog-head'>
                    <strong>Confirm Copy</strong>
                </div>
                <div className='dnb-dialog-body'>
                    {html_}
                    <div style={{ padding: '15px', textAlign: 'center' }}>
                        <span className='dnb-d-start'>
                            <strong>Start: </strong>
                            <input type="date" value={start}
                                className='dnb_edit_start' max={end}
                                onChange={handleChangeStart} />
                        </span>
                        &nbsp;<span className='dnb_d_div'>&minus;</span>&nbsp;
                        <span className='dnb-d-end'>
                            <strong>End: </strong>
                            <input type="date" value={end}
                                className='dnb_edit_start' min={end}
                                onChange={handleChangeEnd} />
                        </span>
                    </div>
                </div>
                <div className='dnb-dialog-buttons'>
                    <span onClick={onCloseView}>Cancel</span>
                    <span onClick={confirmOk}>Ok</span>
                </div>
            </div>
        </BackgroundProcessing>
    )
}

export const ItemContext = React.createContext()
export const HandleContext = React.createContext()
export function ItemProvider({ children, item, handler }) {
    if (typeof handler === 'object' && typeof item === 'object')
        return <ItemContext.Provider value={item}>
            <HandleContext.Provider value={handler}>
                {children}
            </HandleContext.Provider>
        </ItemContext.Provider>
    if (typeof handler === 'object')
        return <HandleContext.Provider value={handler}>
            {children}
        </HandleContext.Provider>
    return <ItemContext.Provider value={item}>
            {children}
        </ItemContext.Provider>
}