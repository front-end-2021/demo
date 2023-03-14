import { useState, useContext } from "react"
import { getDateCalendarValue, getDateString, getIcon, isDateLessNow } from "../../global"
import { useDispatch, useSelector } from "react-redux"
import { ItemContext } from "./Maingoal"
import { showMenu, showEdit } from "../../global/ReduxStore"
import { useDialog, ConfirmType } from "../../global/Context"

export function ItemViewExpand({ children, className,
    addNewChild, onToggleDone }) {
    const item = useContext(ItemContext)
    const LoadingItems = useSelector(state => state.loading.Items)
    const MenuId = useSelector(state => state.focus.MenuId)
    const dialog = useDialog()
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
    function getClsDone() {
        if (item.IsDone) return `bi bi-check-circle-fill`
        return `bi bi-check-circle`
    }
    function getMenuTag() {
        if (MenuId !== item.Id) return <></>
        return <>
            <div className='dnb_i_menu'>
                <span>{getEditTag()}</span>
                <span>{getDuplicateTag()}</span>
                <span>{getDeleteTag()}</span>
                <span style={{ cursor: 'initial' }}>
                    <span className={getClsDone()} style={{ cursor: 'pointer' }}
                        onClick={onToggleDone}>&nbsp; Finish</span>
                </span>
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
            ok: () => item.handleDelete()
        })
    }
    function getDeleteTag() {
        if (item.IsDone) return <i className="bi bi-trash">&nbsp; Delete</i>
        return <span className="bi bi-trash" style={{ cursor: 'pointer' }}
            onClick={showConfirmDelete}>&nbsp; Delete</span>
    }
    const dispatch = useDispatch()
    function getEditTag() {
        if (item.IsDone) return <i className="bi bi-pencil-square" >&nbsp; Edit</i>
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
                    item.handleDuplicate(_item)
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
                item.handleDuplicate(_item)
            }
        })
    }
    function getDuplicateTag() {
        if (item.IsDone) return <i className="bi bi-files">&nbsp; Duplicate</i>
        return <span className="bi bi-files" style={{ cursor: 'pointer' }}
            onClick={showConfirmDuplicate}>&nbsp; Duplicate</span>
    }
    function getAddNewTag() {
        if (item.TypeId > 2) return <></>
        if (item.IsDone) return <span className="bi bi-plus-circle-dotted">&nbsp; New {getIcon(item.TypeId + 1)}</span>
        return <span className="bi bi-plus-circle-dotted" style={{ cursor: 'pointer' }}
            onClick={() => addNewChild(item.TypeId + 1)}>&nbsp; New {getIcon(item.TypeId + 1)}</span>
    }
    function getDesTag() {
        const _des = { __html: item.Description }
        return <p dangerouslySetInnerHTML={_des}
            className='dnb_item_description o_81' />
    }
    function getNameTag() {
        const isLess = item.ExpectCost < item.TrueCost
        return <div title={isLess ? 'Expected Cost is less then True Cost' : null}
            className={`dnb_item_title${isLess ? ' d_exp_less_true' : ''}`}
            onClick={() => item.handleExpand(false)}>{getIcon(item.TypeId)} {item.Name}</div>
    }
    function getClassWrap() {
        let _r = `dnb_item_container`
        if (typeof className == 'string' && className.trim() !== '')
            _r += ` ${className}`
        if (item.IsDone) _r += ` dnb_item_done`
        if (LoadingItems.includes(item.Id)) {
            _r += ` fb-loading`
        }
        return _r
    }
    return (
        <>{
            item.IsExpand ? <div className={getClassWrap()}>
                {getNameTag()}
                {getDesTag()}
                <div className='dnb_item_cost'>
                    {children}
                </div>
                <div className={`dnb_item_date${getClassOverDate(item.End)}`}>
                    {item.Start && getStartTag()}
                    {item.IsExpand ? item.End && getEndTag() : <></>}
                </div>
                {
                    !item.IsExpand ? <></> : <div className='dnb_i_options'>
                        <span onClick={() => dispatch(showMenu(item.Id))}
                            className="bi bi-layout-sidebar"
                        >&nbsp; {MenuId === item.Id ? 'Hide' : 'Menu'} &nbsp;</span>
                        <span onClick={() => dispatch(showMenu(item.Id))}
                            className={`bi bi-chevron-${MenuId === item.Id ? 'down' : 'right'}`} />
                    </div>
                }
                {getMenuTag()}
            </div> : <ItemViewCollapse>
                {children}
            </ItemViewCollapse>
        }</>
    )
}
export function ItemViewEdit({ children, className, isExpectLessTrue, onSaveData }) {
    const item = useContext(ItemContext)
    const [name, setName] = useState(item.Name)
    const [des, setDes] = useState(item.Description)
    const [start, setStart] = useState(getDateCalendarValue(item.Start))
    const [end, setEnd] = useState(getDateCalendarValue(item.End))
    const dispatch = useDispatch()
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
    function handleChangeDes(e) {
        const newDes = e.target.value
        setDes(newDes)
    }
    function onSaveDataItem() {
        const s = getDateString(start)
        const e = getDateString(end)
        onSaveData({
            Name: name, Description: des, Start: s, End: e,
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
    function getClsItem() {
        let _r = `dnb_item_container dnb_item_edit`
        if (typeof className === 'string' && className.trim() !== '')
            _r += ` fb-loading`
        return _r
    }
    return (
        <div className={getClsItem()}>
            <div className={getClsExpLess()}>{getIcon(item.TypeId)} <input
                value={name} maxLength="150"
                className={`dnb_edit_name ${getClsExpLess()}`}
                type="text" onChange={handleChangeName}
                onMouseOut={handleMouseOutChangeName} />
            </div>
            <textarea className='dnb_edit_des' style={{ height: getHeightDesArea() }}
                onChange={handleChangeDes} defaultValue={des} />
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
                    <span className="bi bi-database-up"
                        onClick={onSaveDataItem}
                        style={{ cursor: 'pointer' }}>&nbsp; Save &nbsp;</span>
                </span>
                <span >
                    <span className="bi bi-x-circle"
                        onClick={() => dispatch(showEdit(item.Id))}
                        style={{ cursor: 'pointer' }}>&nbsp; Cancel &nbsp;</span>
                </span>
            </div>
        </div>
    )
}
function getClassOverDate(start_end) {
    if (isDateLessNow(start_end)) {
        return ` dnb_past_date`
    }
    return ''
}
function ItemViewCollapse({ children }) {
    const item = useContext(ItemContext)
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
                !isDateLessNow(item.End) ? <span className="dnb-d-end">{getDateString(item.End)}</span> :
                    <span title="End Date is in the past from Current Date"
                        className="dnb-d-end">{getDateString(item.End)}</span>
            }
        </>
    }
    function getNameTag() {
        const isLess = item.ExpectCost < item.TrueCost
        return <div title={isLess ? 'Expected Cost is less then True Cost' : null}
            className={`dnb_item_title${isLess ? ' d_exp_less_true' : ''}`} >
            <span onClick={() => item.handleExpand(true)}
            >{getIcon(item.TypeId)} {item.Name}</span>
        </div>
    }
    function getClsWrap() {
        return `dnb_item_container d_item_collapse${item.IsDone ? ` dnb_item_done` : ''}`
    }
    return (
        <div className={getClsWrap()}>
            {getNameTag()}
            <div className={`dnb_item_cost`}>
                {children}
            </div>
            <div className={`dnb_item_date ${getClassOverDate(item.End)}`}>
                {getStartTag()}
                {getEndTag()}
            </div>
        </div>
    )
}