import React, { useState, useContext, useEffect, useMemo } from "react"
import {
    getDateCalendarValue, getDateString,
    getIcon, isDateLessNow, editorOpts,
    encodeHtml, getTextTitle
} from "../../global"
import { useDispatch, useSelector } from "react-redux"
import { HandleContext, ItemContext } from "../../global/Context"
import { showMenu, showEdit } from "../../global/ReduxStore"
import { useDialog, ConfirmType, ViewContext } from "../../global/Context"
import MediumEditor from "medium-editor"
import '../../../node_modules/medium-editor/dist/css/medium-editor.css'
import '../../../node_modules/medium-editor/dist/css/themes/default.css'
import { logItem } from "../../global/GlobalLog"

export function ItemViewExpand({ children, className, onToggleDone, id }) {
    const item = useContext(ItemContext)
    const handle = useContext(HandleContext)
    const LoadingItems = useSelector(state => state.loading.Items)
    const MenuId = useSelector(state => state.focus.MenuId)
    const canDnD = useSelector(state => state.navbar.CanDrgDrp)
    let textS = useSelector(state => state.navbar.TextSearch)
    let viewType = useSelector(state => state.navbar.ViewType)
    const dialog = useDialog()
    const view = useContext(ViewContext)
    const dispatch = useDispatch()
    function getStartTag() {
        return <span title={isDateLessNow(item.Start) ? 'Start Date is in the past from Current Date' : null}
            className={`dnb-d-start${getClassOverDate(item.Start)}`} >&nbsp;{getDateString(item.Start)}</span>
    }
    function getEndTag() {
        return <>
            <span className='dnb_d_div'>&minus;</span>
            {
                !isDateLessNow(item.End) ? <span className="dnb-d-end"
                >{getDateString(item.End)}</span> :
                    <span title="End Date is in the past from Current Date"
                        className="dnb-d-end">{getDateString(item.End)}</span>
            }
        </>
    }
    function getMenuTag() {
        if (viewType === 2) return <></>
        if (MenuId !== item.Id || canDnD) return <></>
        return <>
            <div className='dnb_i_menu'>
                <span className="di_btn">{getDuplicateTag()}</span>
                <span className="di_btn">{getEditTag()}</span>
                <span className="di_btn">{getDeleteTag()}</span>
                {getExpandTag()}
                <span className="dnb-btnadd di_btn">{getAddNewTag()}</span>
            </div>
        </>
    }
    function showConfirmDelete() {
        dialog.setDialog({
            type: ConfirmType.default,
            html_: <div>Do You want to delete?<br />
                <i>{item.Name}</i>
            </div>,
            ok: () => handle.handleDelete()
        })
    }
    function getDeleteTag() {
        return <span className="bi bi-trash" style={{ cursor: 'pointer' }}
            onClick={showConfirmDelete}>&nbsp; Delete</span>
    }
    function getEditTag() {
        return <span className="bi bi-pencil-square" style={{ cursor: 'pointer' }}
            onClick={() => dispatch(showEdit(item.Id))}>&nbsp; Edit</span>
    }
    function showConfirmDuplicate() {
        const _item = JSON.parse(JSON.stringify(item))
        if (item.TypeId < 3) {
            dialog.setDialog({
                type: ConfirmType.default,
                title: 'Confirm Copy',
                html_: <i>{item.Name}</i>,
                ok: () => {
                    dispatch(showMenu(_item.Id))
                    handle.handleDuplicate(_item)
                }
            })
            return
        }
        dialog.setDialog({
            type: ConfirmType.ConfirmWithDate,
            Start: _item.Start,
            End: _item.End,
            html_: <div>{_item.Name}</div>,
            ok: (start, end) => {
                dispatch(showMenu(_item.Id))
                _item.Start = getDateString(start)
                _item.End = getDateString(end)
                handle.handleDuplicate(_item)
            }
        })
    }
    function getDuplicateTag() {
        return <span className="bi bi-files" style={{ cursor: 'pointer' }}
            onClick={showConfirmDuplicate}>&nbsp; Duplicate</span>
    }
    function getExpandTag() {
        return <>
            <span onClick={() => {
                view.setViewLevel(getView(view.viewLevel))
            }} className='bi bi-arrows-expand di_btn'>&nbsp; Expand ({view.viewLevel - 1})</span>
            {item.TypeId < 3 ? <span></span> : ''}
        </>
    }
    function getAddNewTag() {
        if (item.TypeId > 2) return <></>
        return <span className="bi bi-plus-circle-dotted"
            style={{ cursor: 'pointer' }}
            onClick={handle.handleAddNewChild}
        >&nbsp; New {getIcon(item.TypeId + 1)}</span>
    }
    function getDescriptionTag() {
        if (viewType > 0) return
        let desText = item.Description
        if (typeof desText !== 'string') return <p
            className='dnb_item_description o_30'>
            <i className="bi bi-code"></i>Description<i className="bi bi-code-slash"></i>
        </p>
        const txtLink = `<a href="`
        desText = desText.replaceAll(txtLink, `<a target="_blank" href="`)
        const _des = { __html: encodeHtml(desText) }
        return <p dangerouslySetInnerHTML={_des}
            className='dnb_item_description o_81' />
    }
    function getNameTag() {
        const isLess = item.ExpectCost < item.TrueCost
        return <div title={isLess ? 'Expected Cost is less then True Cost' : null}
            className={`dnb_item_title${isLess ? ' d_exp_less_true' : ''}`}
            onClick={() => { handle.handleExpand(false) }}
        >{getIcon(item.TypeId)} {item.Name}</div>
    }
    function getClassWrap() {
        let _r = `dnb_item_container dnb_view_${view.viewLevel}`
        if (viewType === 2) _r += ' d_item_collapse'
        if (typeof className == 'string' && className.trim() !== '')
            _r += ` ${className}`
        if (item.IsDone) _r += ` dnb_item_done`
        if (LoadingItems.includes(item.Id)) {
            _r += ` fb-loading`
        }
        return _r
    }
    function toggleViewMenu() { dispatch(showMenu(item.Id)) }
    function getDoneTag(text) {
        let clsDone = `dnb_check_done bi`
        if (item.IsDone) clsDone += ` bi-check-circle-fill`
        else clsDone += ` bi-check-circle`
        return <span className={clsDone} style={{ cursor: 'pointer' }}
            onClick={() => {
                if (MenuId === item.Id) dispatch(showMenu(item.Id))
                onToggleDone()
            }}>&nbsp; {text}</span>
    }
    function renderBodyExpand() {
        return <>
            {getNameTag()}
            {item.IsExpand && getDescriptionTag()}
            <div className='dnb_item_cost'>
                {children}
            </div>
            <div className={`dnb_item_date${getClassOverDate(item.End)}`}>
                {(item.Start || item.End) && <span className={`bi bi-clock${getClassOverDate(item.Start)}`} />}
                {item.Start && getStartTag()}
                {item.IsExpand ? item.End && getEndTag() : <></>}
            </div>
            {item.IsExpand && !canDnD && <div className='dnb_i_options'>
                <span style={{ cursor: 'initial' }}>
                    {getDoneTag('Finish')}
                </span>
                {item.isDoneSub || item.IsDone ? getExpandTag() :
                    <div>
                        <span onClick={toggleViewMenu} className="bi bi-layout-sidebar"
                        >&nbsp; Menu &nbsp;</span>
                        <span onClick={toggleViewMenu}
                            className={`bi bi-chevron-${MenuId === item.Id ? 'down' : 'right'}`} />
                    </div>}
            </div>}
            {getMenuTag()}
        </>
    }

    function styleMapSearch() {
        const isShow = isShowMapSearch.call(item, textS)
        if (item.TypeId !== 2) return getStyleMapSearch.call(item, isShow)
        if (!isShow && !hasChildShowInSearch.call(item, textS)) {
            return { 'display': 'none' }
        }
        return getStyleMapSearch.call(item, isShow)
    }
    return (
        <>{
            item.IsExpand && viewType !== 2 ? <div className={getClassWrap()} id={id}
                style={styleMapSearch()}>
                {item.TypeId > 2 ? renderBodyExpand()
                    :
                    <div className="dnb-wrap-2-sticky">
                        {renderBodyExpand()}
                    </div>
                }
            </div> : <ItemViewCollapse getDoneTag={getDoneTag}>
                {children}
            </ItemViewCollapse>
        }</>
    )
}
function getView(level) {
    let _vLv = level
    _vLv += 1
    if (_vLv > 2) {
        _vLv = 1
    }
    return _vLv
}
export function ItemViewEdit({ children, className, isExpectLessTrue, onSaveData }) {
    const rfDescription = React.createRef();
    useEffect(() => {
        const targetNode = rfDescription.current
        if(window.dnbEditor === undefined) {
            window.dnbEditor = new MediumEditor(targetNode, editorOpts)
        } else {
            window.dnbEditor.setup()
            window.dnbEditor.init(targetNode)
        }
        
        autoScrollY()

        return function onUnmount() {
            window.dnbEditor.removeElements(targetNode);
            window.dnbEditor.destroy();
        };
        function autoScrollY() {
            const vCont = document.querySelector('.dItemEdt')
            const html = document.querySelector('html')
            if (vCont && html) {
                const offTop = vCont.offsetTop
                const cH = vCont.querySelector('.dEdtView')
                const offHeih = cH ? cH.offsetHeight : vCont.offsetHeight
                const sclTop = html.scrollTop
                if (offTop - sclTop > offHeih) {
                    html.scrollTo({
                        top: offTop - offHeih,
                        behavior: "smooth",
                    })
                }
            }
        }
    });
    const view = useContext(ViewContext)
    const [viewLevel, setViewLevel] = useState(view ? view.viewLevel : 1)
    const dispatch = useDispatch()

    const item = useContext(ItemContext)
    const [name, setName] = useState(item.Name)
    function handleChangeName(e) {
        const newName = e.target.value
        setName(newName)
    }
    function handleMouseOutChangeName(e) {
        const newName = e.target.value
        if (newName.trim() === '') setName(item.Name)
    }

    const [desDisplay] = useState(item.Description)

    const [start, setStart] = useState(getDateCalendarValue(item.Start))
    const [end, setEnd] = useState(getDateCalendarValue(item.End))
    function handleChangeStart(e) {
        const newD = e.target.value
        setStart(newD)
    }
    function handleChangeEnd(e) {
        const newD = e.target.value
        setEnd(newD)
    }
    function onSaveDataItem() {
        const s = getDateString(start)
        const e = getDateString(end)
        const newDes = window.dnbEditor.origElements.innerHTML
        let _des = newDes
        if (_des === '<p><br></p>') _des = undefined
        if (_des === '<br>') _des = undefined
        if (_des === '<p>&nbsp;</p>') _des = undefined
        onSaveData({
            Id: item.Id, ParentId: item.ParentId,
            Name: name, Description: _des, Start: s, End: e,
        })
    }
    function styleColorDate(dStr) {
        var d = new Date(dStr)
        const now = new Date(new Date().toDateString())
        if (d.getTime() < now.getTime()) return { color: 'red' }
    }
    const heightDes = () => {
        const t = desDisplay || ''
        const l = t.length
        if (l < 141) return
        return `${Math.ceil(l * 33 / 42)}px`
    }
    const clsExpLess = useMemo(
        () => isExpectLessTrue ? ` d_exp_less_true` : '',
        [isExpectLessTrue]
    )
    const clsItem = useMemo(
        () => {
            let _r = `dnb_item_container dnb_item_edit dItemEdt`
            _r += ` dnb_view_${viewLevel}`
            if (typeof className === 'string' && className.trim() !== '')
                _r += ` fb-loading`
            return _r
        },
        [viewLevel, className]
    )
    function renderBodyEdit() {
        return <>
            <div className={clsExpLess}>{getIcon(item.TypeId)} <input
                value={name} maxLength="150"
                className={`dnb_edit_name ${clsExpLess}`}
                type="text" onChange={handleChangeName}
                onMouseOut={handleMouseOutChangeName} />
            </div>
            <div className='dnb_edit_des' ref={rfDescription}
                style={{ height: heightDes() }} dangerouslySetInnerHTML={{ __html: desDisplay }} />
            <div className='dnb_item_cost'>
                {children}
            </div>
            <div className='dnb_item_date'>
                <span className="bi bi-clock" style={{ marginRight: '3px' }}></span>
                <span className='dnb_past_date dnb-d-start'>
                    <input type="date" value={start} max={end} className='dnb_edit_start'
                        style={styleColorDate(start)} onChange={handleChangeStart} />
                </span>
                <span className='dnb_d_div'>&minus;</span>
                <span className="dnb-d-end">
                    <input type="date" value={end} min={start} className='dnb_edit_end'
                        style={styleColorDate(end)} onChange={handleChangeEnd} />
                </span>
            </div>
            <div className='dnb_i_menu'>
                <span className="di_btn">
                    <span className="bi bi-x-circle"
                        onClick={() => dispatch(showEdit(item.Id))}
                        style={{ cursor: 'pointer' }}>&nbsp; Cancel &nbsp;</span>
                </span>
                <span className="di_btn">
                    <span className="bi bi-database-up"
                        onClick={onSaveDataItem}
                        style={{ cursor: 'pointer' }}>&nbsp; Save &nbsp;</span>
                </span>
                <span></span>
                <span onClick={() => { changeView(getView(viewLevel)) }}
                    className='bi bi-arrows-expand di_btn'>&nbsp; Expand ({viewLevel - 1})</span>
            </div>
        </>
    }
    function changeView(level) {
        setViewLevel(level)
        view && view.setViewLevel(level)
    }

    return (
        <div className={clsItem}>
            <div className="dnb_editview dEdtView">{
                item.TypeId > 2 ? renderBodyEdit()
                    : <div className="dnb-wrap-2-sticky">{renderBodyEdit()}</div>
            }</div>
        </div>
    )
}
function getClassOverDate(start_end) {
    if (isDateLessNow(start_end)) {
        return ` dnb_past_date`
    }
    return ''
}
function hasChildShowInSearch(textS) {
    const item = this
    const txtS = textS.toLowerCase()
    if (item.TypeId === 2) {
        const lstA = item.Actions || []
        const lstFilterA = lstA.filter(a => {
            if (a.Name.toLowerCase().includes(txtS)) return true
            let _des = a.Description
            if (typeof _des === 'string') {
                if (_des === '') return true
                _des = _des.toLowerCase()
                if (_des.includes(txtS)) return true
            }
            return false
        })
        if (lstFilterA.length) return true
        return false
    }
}
function isShowMapSearch(textS) {
    const item = this
    if (textS.trim() === '') return true
    let name = item.Name
    name = name.toLowerCase()
    const txtS = textS.toLowerCase()
    if (name.includes(txtS)) return true
    if (typeof item.Description === 'string') {
        let des = item.Description
        des = des.toLowerCase()
        if (des.trim() === '') return true
        if (des.includes(txtS)) return true
    }
    return false
}
function getStyleMapSearch(isShow) {
    if (isShow) return
    const item = this
    if (item.TypeId > 2) return { 'display': 'none' }
    return { 'opacity': '0.069', pointerEvents: 'none' }
}
function ItemViewCollapse({ getDoneTag, children }) {
    const item = useContext(ItemContext)
    const canDnD = useSelector(state => state.navbar.CanDrgDrp)
    const unit = useSelector(state => state.navbar.Unit)
    let textS = useSelector(state => state.navbar.TextSearch)
    const handle = useContext(HandleContext)
    function getStartTag() {
        return <span title={isDateLessNow(item.Start) ? 'Start Date is in the past from Current Date' : null}
            className={`dnb-d-start${getClassOverDate(item.Start)}`} >&nbsp;{getDateString(item.Start)}</span>
    }
    function getEndTag() {
        if (!item.End) return <></>
        return <>
            <span className={`dnb_d_div`}>&minus;</span>
            {
                !isDateLessNow(item.End) ? <span className="dnb-d-end"
                >{getDateString(item.End)}</span> :
                    <span title="End Date is in the past from Current Date"
                        className="dnb-d-end">{getDateString(item.End)}</span>
            }
        </>
    }
    function getNameTag() {
        const isLess = item.ExpectCost < item.TrueCost
        const desText = item.Description
        let tlt = isLess && !desText ? 'Expected Cost is less then True Cost' : getTextTitle(desText)
        return <div
            className={`dnb_item_title${isLess ? ' d_exp_less_true' : ''}`} >
            <span title={tlt}
                onClick={() => handle.handleExpand(true)}>{getIcon(item.TypeId)} {item.Name}</span>
        </div>
    }
    function getClsWrap() {
        let cls = `dnb_item_container d_item_collapse`
        if (item.IsDone) {
            cls += ` dnb_item_done`
        } else cls += canDnD ? ` dnb-dnd-item dnbDndItem` : ''
        return cls
    }
    function getStyle() {
        return getStyleMapSearch.call(item, isShowMapSearch.call(item, textS))
    }
    return (
        <div className={getClsWrap()} id={!item.IsDone && canDnD ? item.Id : undefined}
            style={getStyle()}>
            <div className='dnb-head-collapse'>
                {getDoneTag()}
                {getNameTag()}
            </div>
            {!!unit.View.length && <div className={`dnb_item_cost`}>
                {children}
            </div>}
            <div className={`dnb_item_date${getClassOverDate(item.End)}`}>
                {(item.Start || item.End) && <span className={`bi bi-clock${getClassOverDate(item.Start)}`} />}
                {getStartTag()}
                {getEndTag()}
            </div>
        </div>
    )
}
