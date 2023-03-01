import { useState } from "react"
import { getDateCalendarValue, getDateString, getIcon, isDateLessNow } from "../../global"
import { GoalActionCollapse } from "../goal/GoalCollapse"
import '../../../node_modules/bootstrap-icons/font/bootstrap-icons.css'
import '../../styles/ga.scss'

export function GoalActionView({ typeid, children, lessC,
    name, des, isDone, start, end,
    isExpand, handleExpand,
    addNewChild,
    handleDelete, handlerDuplicate,
    setEditView, onToggleDone }) {
    const [isShowMenu, setShowMenu] = useState(false)

    function getStartTag() {
        if (!start) return <></>
        return <>
            <span className={`bi bi-calendar2-week${getClassOverDate(start)}`} />
            {
                !isDateLessNow(start) ? <span className={`dnb-d-start`}>&nbsp;{getDateString(start)}</span> :
                    <span title="Start Date is in the past from Current Date"
                        className={`dnb-d-start${getClassOverDate(start)}`}>&nbsp;{getDateString(start)}</span>
            }
        </>
    }
    function getEndTag() {
        if (!end) return <></>
        return <>
            <span className='dnb_d_div'>&minus;</span>
            {
                !isDateLessNow(end) ? <span className="dnb-d-end">{getDateString(end)}</span> :
                    <span title="End Date is in the past from Current Date"
                        className="dnb-d-end">{getDateString(end)}</span>
            }
        </>
    }
    function getClsDone() {
        if (isDone) return `bi bi-check-circle-fill`
        return `bi bi-check-circle`
    }
    function getMenuTag() {
        if (!isShowMenu) return <></>
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
    function getDeleteTag() {
        if (isDone) return <i className="bi bi-trash">&nbsp; Delete</i>
        return <span className="bi bi-trash" style={{ cursor: 'pointer' }}
            onClick={() => handleDelete()}>&nbsp; Delete</span>
    }
    function getEditTag() {
        if (isDone) return <i className="bi bi-pencil-square" >&nbsp; Edit</i>
        return <span className="bi bi-pencil-square" style={{ cursor: 'pointer' }}
            onClick={() => setEditView(true)}>&nbsp; Edit</span>
    }
    function getDuplicateTag() {
        if (isDone) return <i className="bi bi-files">&nbsp; Duplicate</i>
        return <span className="bi bi-files" style={{ cursor: 'pointer' }}
            onClick={() => handlerDuplicate()}>&nbsp; Duplicate</span>
    }
    function getAddNewTag() {
        if (typeid > 2) return <></>
        if (isDone) return <span className="bi bi-plus-circle-dotted">&nbsp; New {getIcon(typeid + 1)}</span>
        return <span className="bi bi-plus-circle-dotted" style={{ cursor: 'pointer' }}
            onClick={() => addNewChild(typeid + 1)}>&nbsp; New {getIcon(typeid + 1)}</span>
    }
    function getDesTag() {
        const _des = { __html: des }
        return <p dangerouslySetInnerHTML={_des}
            className='dnb_item_description o_81' />
    }
    function getNameTag() {
        if (lessC < 0) {
            return <div title="Expected Cost is less then True Cost"
                className={`dnb_item_title d_exp_less_true`}
                onClick={() => handleExpand(false)}>{getIcon(typeid)} {name}</div>
        }
        return <div className='dnb_item_title'
            onClick={() => handleExpand(false)}>{getIcon(typeid)} {name}</div>
    }
    function onExpand() {
        handleExpand(true)
    }
    return (
        <>{
            isExpand ? <div className={`dnb_item_container${isDone ? ` dnb_item_done` : ''}`}>
                {getNameTag()}
                {getDesTag()}
                <div className='dnb_item_cost'>
                    {children}
                </div>
                <div className={`dnb_item_date${getClassOverDate(end)}`}>
                    {getStartTag()}
                    {isExpand ? getEndTag() : <></>}
                </div>
                {
                    !isExpand ? <></> : <div className='dnb_i_options'>
                        <span onClick={() => setShowMenu(!isShowMenu)}
                            className="bi bi-layout-sidebar">&nbsp; {isShowMenu ? 'Collapse' : 'Menu'} &nbsp;</span>
                        <span className={`bi bi-chevron-${isShowMenu ? 'down' : 'right'}`}
                            onClick={() => setShowMenu(!isShowMenu)} />
                    </div>
                }
                {getMenuTag()}
            </div> : <GoalActionCollapse typeid={typeid} lessC={lessC}
                name={name} isDone={isDone} start={start} end={end}
                handleExpand={onExpand}>
                {children}
            </GoalActionCollapse>
        }</>
    )
}
export function FormEditItem({ Name, Description, Start, End,
    children, typeid, lessC,
    onSaveData, onCloseEditForm }) {
    const [name, setName] = useState(Name)
    const [des, setDes] = useState(Description)
    const [start, setStart] = useState(getDateCalendarValue(Start))
    const [end, setEnd] = useState(getDateCalendarValue(End))

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
        if (newName.trim() === '') setName(Name)
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
        return lessC < 0 ? ` d_exp_less_true` : ''
    }
    return (
        <div className={`dnb_item_container dnb_item_edit`}>
            <div className={getClsExpLess()}>{getIcon(typeid)} <input
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