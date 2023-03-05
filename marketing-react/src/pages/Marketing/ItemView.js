import { useState, useContext } from "react"
import { getDateCalendarValue, getDateString, getIcon, isDateLessNow } from "../../global"
import { ItemContext } from "./Maingoal"

export function ItemViewExpand({ children,
    handleExpand, addNewChild,
    handleDelete, handlerDuplicate,
    setEditView, onToggleDone }) {
    const item = useContext(ItemContext)
    const [isShowMenu, setShowMenu] = useState(false)

    function getStartTag() {
        if (!item.Start) return <></>
        return <>
            <span className={`bi bi-calendar2-week${getClassOverDate(item.Start)}`} />
            {
                !isDateLessNow(item.Start) ? <span className={`dnb-d-start`}>&nbsp;{getDateString(item.Start)}</span> :
                    <span title="Start Date is in the past from Current Date"
                        className={`dnb-d-start${getClassOverDate(item.Start)}`}>&nbsp;{getDateString(item.Start)}</span>
            }
        </>
    }
    function getEndTag() {
        if (!item.End) return <></>
        return <>
            <span className='dnb_d_div'>&minus;</span>
            {
                !isDateLessNow(item.End) ? <span className="dnb-d-end">{getDateString(item.End)}</span> :
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
        if (!isShowMenu) return <></>
        return <>
            <div className='dnb_i_menu'>
                <span>{getEditTag()}</span>
                {
                    item.TypeId > 1 ? <span>{getDuplicateTag()}</span> : <></>
                }
                <span>{getDeleteTag()}</span>
                <span style={{ cursor: 'initial' }}>
                    <span className={getClsDone()} style={{ cursor: 'pointer' }}
                        onClick={onToggleDone}>&nbsp; Finish</span>
                </span>
                <span>{getAddNewTag()}</span>
            </div>
        </>
    }
    function getDeleteTag() {
        if (item.IsDone) return <i className="bi bi-trash">&nbsp; Delete</i>
        return <span className="bi bi-trash" style={{ cursor: 'pointer' }}
            onClick={() => handleDelete()}>&nbsp; Delete</span>
    }
    function getEditTag() {
        if (item.IsDone) return <i className="bi bi-pencil-square" >&nbsp; Edit</i>
        return <span className="bi bi-pencil-square" style={{ cursor: 'pointer' }}
            onClick={() => setEditView(true)}>&nbsp; Edit</span>
    }
    function getDuplicateTag() {
        if (item.IsDone) return <i className="bi bi-files">&nbsp; Duplicate</i>
        return <span className="bi bi-files" style={{ cursor: 'pointer' }}
            onClick={() => handlerDuplicate()}>&nbsp; Duplicate</span>
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
        if (item.ExpectCost < item.TrueCost) {
            return <div title="Expected Cost is less then True Cost"
                className={`dnb_item_title d_exp_less_true`}
                onClick={() => handleExpand(false)}>{getIcon(item.TypeId)} {item.Name}</div>
        }
        return <div className='dnb_item_title'
            onClick={() => handleExpand(false)}>{getIcon(item.TypeId)} {item.Name}</div>
    }
    function onExpand() {
        handleExpand(true)
    }
    return (
        <>{
            item.IsExpand ? <div className={`dnb_item_container${item.IsDone ? ` dnb_item_done` : ''}`}>
                {getNameTag()}
                {getDesTag()}
                <div className='dnb_item_cost'>
                    {children}
                </div>
                <div className={`dnb_item_date${getClassOverDate(item.End)}`}>
                    {getStartTag()}
                    {item.IsExpand ? getEndTag() : <></>}
                </div>
                {
                    !item.IsExpand ? <></> : <div className='dnb_i_options'>
                        <span onClick={() => setShowMenu(!isShowMenu)}
                            className="bi bi-layout-sidebar">&nbsp; {isShowMenu ? 'Hide' : 'Menu'} &nbsp;</span>
                        <span className={`bi bi-chevron-${isShowMenu ? 'down' : 'right'}`}
                            onClick={() => setShowMenu(!isShowMenu)} />
                    </div>
                }
                {getMenuTag()}
            </div> : <ItemViewCollapse handleExpand={onExpand}>
                {children}
            </ItemViewCollapse>
        }</>
    )
}
export function ItemViewEdit({ children, isExpectLessTrue, onSaveData, onCloseEditForm }) {
    const item = useContext(ItemContext)
    const [name, setName] = useState(item.Name)
    const [des, setDes] = useState(item.Description)
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
    return (
        <div className={`dnb_item_container dnb_item_edit`}>
            <div className={getClsExpLess()}>{getIcon(item.Typeid)} <input
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
                        onClick={onCloseEditForm}
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
function ItemViewCollapse({ children, handleExpand }) {
    const item = useContext(ItemContext)
    function getStartTag() {
        if (!item.Start) return <></>
        return <>
            <span className={`bi bi-calendar2-week${getClassOverDate(item.Start)}`} />
            {
                !isDateLessNow(item.Start) ? <span
                    className={`dnb-d-start`}>&nbsp;{getDateString(item.Start)}</span> :
                    <span title="Start Date is in the past from Current Date"
                        className={`dnb-d-start${getClassOverDate(item.Start)}`}>&nbsp;{getDateString(item.Start)}</span>
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
        if (item.ExpectCost < item.TrueCost) {
            return <div title="Expected Cost is less then True Cost"
                className={`dnb_item_title d_exp_less_true`}
                onClick={() => handleExpand()}>{getIcon(item.TypeId)} {item.Name}</div>
        }
        return <div className={`dnb_item_title`}
            onClick={() => handleExpand()}>{getIcon(item.TypeId)} {item.Name}</div>
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