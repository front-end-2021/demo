import { useState, useContext, useEffect } from "react"
import {
    getDateCalendarValue, getDateString,
    getIcon, isDateLessNow, editorOpts,
    encodeHtml, decodeHtml, getTextTitle
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
    const canDnD = useSelector(state => state.filter.CanDrgDrp)
    let textS = useSelector(state => state.filter.TextSearch)
    const dialog = useDialog()
    const view = useContext(ViewContext)
    const dispatch = useDispatch()
    function getStartTag() {
        return <>
            <span className={`bi bi-calendar2-week${getClassOverDate(item.Start)}`} />
            {
                !isDateLessNow(item.Start) ? <span className={`dnb-d-start`}
                >&nbsp;{getDateString(item.Start)}</span> :
                    <span title="Start Date is in the past from Current Date"
                        className={`dnb-d-start${getClassOverDate(item.Start)}`}
                    >&nbsp;{getDateString(item.Start)}</span>
            }
        </>
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
        if (MenuId !== item.Id || canDnD) return <></>
        return <>
            <div className='dnb_i_menu'>
                <span>{getDuplicateTag()}</span>
                <span>{getEditTag()}</span>
                <span>{getDeleteTag()}</span>
                {getExpandTag()}
                <span>{getAddNewTag()}</span>
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
            }} className='bi bi-arrows-expand'>&nbsp; Expand ({view.viewLevel - 1})</span>
            {item.TypeId < 3 ? <span></span> : ''}
        </>
    }
    function getAddNewTag() {
        if (item.TypeId > 2) return <></>
        return <span className="bi bi-plus-circle-dotted" style={{ cursor: 'pointer' }}
            onClick={handle.handleAddNewChild}
        >&nbsp; New {getIcon(item.TypeId + 1)}</span>
    }
    function getDescriptionTag() {
        let desText = item.Description
        if (typeof desText !== 'string') return <p
            className='dnb_item_description o_30'>
            <i className="bi bi-code"></i>Description<i className="bi bi-code-slash"></i>
        </p>
        const _des = { __html: encodeHtml(desText) }
        return <p dangerouslySetInnerHTML={_des}
            className='dnb_item_description o_81' />
    }
    function getNameTag() {
        const isLess = item.ExpectCost < item.TrueCost
        return <div title={isLess ? 'Expected Cost is less then True Cost' : null}
            className={`dnb_item_title${isLess ? ' d_exp_less_true' : ''}`}
            onClick={() => handle.handleExpand(false)}
        >{getIcon(item.TypeId)} {item.Name}</div>
    }
    function getClassWrap() {
        let _r = `dnb_item_container dnb_view_${view.viewLevel}`
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
                {item.Start && getStartTag()}
                {item.IsExpand ? item.End && getEndTag() : <></>}
            </div>
            {
                item.IsExpand && !canDnD && <div className='dnb_i_options'>
                    <span style={{ cursor: 'initial' }}>
                        {getDoneTag('Finish')}
                    </span>
                    {
                        item.isDoneSub || item.IsDone ? getExpandTag() :
                            <div>
                                <span onClick={toggleViewMenu} className="bi bi-layout-sidebar"
                                >&nbsp; Menu &nbsp;</span>
                                <span onClick={toggleViewMenu}
                                    className={`bi bi-chevron-${MenuId === item.Id ? 'down' : 'right'}`} />
                            </div>
                    }
                </div>
            }
            {getMenuTag()}
        </>
    }
    useEffect(() => {
        document.querySelectorAll('.dnb_add_action').forEach(btn => {
            if (textS !== '' && !isShowMapSearch())
                btn.style.visibility = 'hidden'
            else btn.style.visibility = ''
        })
        document.querySelectorAll('.dnb_add_sub').forEach(btn => {
            if (textS !== '' && !isShowMapSearch())
                btn.style.visibility = 'hidden'
            else btn.style.visibility = ''
        })
        document.querySelectorAll('.dnb_add_main').forEach(btn => {
            if (textS !== '' && !isShowMapSearch())
                btn.style.visibility = 'hidden'
            else btn.style.visibility = ''
        })
    }, [textS])
    function isShowMapSearch() {
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
    function styleMapSearch() {
        if (isShowMapSearch()) return
        return { 'opacity': '0.069', 'pointer-events': 'none' }
    }
    return (
        <>{
            item.IsExpand ? <div className={getClassWrap()} id={id}
                style={styleMapSearch()}>
                {item.TypeId > 2 ? renderBodyExpand()
                    :
                    <div className="dnb-wrap-2-sticky">
                        {renderBodyExpand()}
                    </div>
                }
            </div> : <ItemViewCollapse getDoneTag={getDoneTag}
                isShowMapSearch={isShowMapSearch()}>
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
    const item = useContext(ItemContext)
    const [name, setName] = useState(item.Name)
    const [des, setDes] = useState(getDesRaw())
    const [start, setStart] = useState(getDateCalendarValue(item.Start))
    const [end, setEnd] = useState(getDateCalendarValue(item.End))
    const dispatch = useDispatch()
    const view = useContext(ViewContext)
    const [viewLevel, setViewLevel] = useState(view ? view.viewLevel : 1)
    function getDesRaw() {
        let desText = item.Description
        if (typeof desText !== 'string') return desText
        return decodeHtml(desText)
    }
    function handleChangeStart(e) {
        const newD = e.target.value
        setStart(newD)
    }
    function handleChangeEnd(e) {
        const newD = e.target.value
        setEnd(newD)
    }
    function handleChangeName(e) {
        const newName = e.target.value
        setName(newName)
    }
    function handleMouseOutChangeName(e) {
        const newName = e.target.value
        if (newName.trim() === '') setName(item.Name)
    }
    function onSaveDataItem() {
        const s = getDateString(start)
        const e = getDateString(end)
        let _des = des
        if (des === '<p><br></p>') _des = undefined
        if (des === '<p>&nbsp;</p>') _des = undefined
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
    function getHeightDesArea() {
        const t = des || ''
        const l = t.length
        if (l < 141) return
        return `${Math.ceil(l * 30 / 51)}px`
    }
    function getClsExpLess() {
        return isExpectLessTrue ? ` d_exp_less_true` : ''
    }
    function changeView(level) {
        setViewLevel(level)
        view && view.setViewLevel(level)
    }
    function getClsItem() {
        let _r = `dnb_item_container dnb_item_edit dItemEdt`
        _r += ` dnb_view_${viewLevel}`
        if (typeof className === 'string' && className.trim() !== '')
            _r += ` fb-loading`
        return _r
    }
    function renderBodyEdit() {
        return <>
            <div className={getClsExpLess()}>{getIcon(item.TypeId)} <input
                value={name} maxLength="150"
                className={`dnb_edit_name ${getClsExpLess()}`}
                type="text" onChange={handleChangeName}
                onMouseOut={handleMouseOutChangeName} />
            </div>
            <textarea className='dnb_edit_des dEditable'
                style={{ height: getHeightDesArea() }} defaultValue={des} />
            <div className='dnb_item_cost'>
                {children}
            </div>
            <div className='dnb_item_date'>
                <span className="bi bi-calendar2-week" style={{ marginRight: '3px' }}></span>
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
                <span >
                    <span className="bi bi-x-circle"
                        onClick={() => dispatch(showEdit(item.Id))}
                        style={{ cursor: 'pointer' }}>&nbsp; Cancel &nbsp;</span>
                </span>
                <span >
                    <span className="bi bi-database-up"
                        onClick={onSaveDataItem}
                        style={{ cursor: 'pointer' }}>&nbsp; Save &nbsp;</span>
                </span>
                <span></span>
                <span onClick={() => { changeView(getView(viewLevel)) }}
                    className='bi bi-arrows-expand'>&nbsp; Expand ({viewLevel - 1})</span>
            </div>
        </>
    }
    useEffect(() => {
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
        let targetNode = document.querySelector('.dEditable');
        const editor = new MediumEditor(targetNode, editorOpts);
        targetNode = document.querySelector('.dEditable');
        const config = { attributes: true, childList: true, subtree: true };

        const callback = (mutationList, observer) => {
            const mutation = mutationList[0]
            const txt = mutation.target.innerHTML
            setDes(txt)
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        return function onUnmount() {
            observer.disconnect();
            editor.destroy();
        };
    }, []);

    return (
        <div className={getClsItem()}>
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
function ItemViewCollapse({ getDoneTag, children, isShowMapSearch }) {
    const item = useContext(ItemContext)
    const canDnD = useSelector(state => state.filter.CanDrgDrp)
    const handle = useContext(HandleContext)
    function getStartTag() {
        if (!item.Start) return <></>
        return <>
            <span className={`bi bi-calendar2-week${getClassOverDate(item.Start)}`} />
            {
                !isDateLessNow(item.Start) ? <span
                    className={`dnb-d-start`}>&nbsp;{getDateString(item.Start)}</span> :
                    <span title="Start Date is in the past from Current Date"
                        className={`dnb-d-start${getClassOverDate(item.Start)}`}
                    >&nbsp;{getDateString(item.Start)}</span>
            }
        </>
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
    return (
        isShowMapSearch ? <div className={getClsWrap()} id={!item.IsDone && canDnD ? item.Id : undefined}>
            <div className='dnb-head-collapse'>
                {getDoneTag()}
                {getNameTag()}
            </div>
            <div className={`dnb_item_cost`}>
                {children}
            </div>
            <div className={`dnb_item_date ${getClassOverDate(item.End)}`}>
                {getStartTag()}
                {getEndTag()}
            </div>
        </div> : <></>
    )
}
