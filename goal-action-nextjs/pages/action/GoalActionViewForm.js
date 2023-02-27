import { useState } from "react"
import { getDateString, getDateCalendarValue } from "../../global"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from '../goal/style.module.scss'

export function GoalActionView({ typeid, children,
    name, des, isDone, start, end,
    addNewChild,
    handleDelete, handlerDuplicate,
    setEditView, onToggleDone }) {
    const [isShowMenu, setShowMenu] = useState(false)

    function getStartTag() {
        if (!start) return <></>
        return <>
            <span className={`bi bi-calendar2-week${getClassOverDate(start)}`} />
            <span className={`dnb-d-start${getClassOverDate(start)}`}>&nbsp;{getDateString(start)}</span>
        </>
    }
    function getEndTag() {
        if (!end) return <></>
        return <>
            <span className={style.dnb_d_div}>&minus;</span>
            <span className="dnb-d-end">{getDateString(end)}</span>
        </>
    }
    function getClsDone() {
        if (isDone) return `bi bi-check-circle-fill`
        return `bi bi-check-circle`
    }
    function getMenuTag() {
        if (!isShowMenu) return <></>
        return <>
            <div className={style.dnb_i_menu}>
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
    return (
        <div className={style.dnb_item_container + `${isDone ? ` ${style.dnb_item_done}` : ''}`}>
            <div className="dnb-item-title">{getIcon(typeid)} {name}</div>
            <p className={style.dnb_item_description + ' ' + style.o_81}>{des}</p>
            <div className={style.dnb_item_cost}>
                {children}
            </div>
            <div className={style.dnb_item_date + getClassOverDate(end)}>
                {getStartTag()}
                {getEndTag()}
            </div>
            <div className={style.dnb_i_options}>
                <span onClick={() => setShowMenu(!isShowMenu)}
                    className="bi bi-layout-sidebar">&nbsp; {isShowMenu ? 'Close' : 'Menu'} &nbsp;</span>
                <span className={`bi bi-chevron-${isShowMenu ? 'down' : 'right'}`}
                    onClick={() => setShowMenu(!isShowMenu)} />
            </div>
            {getMenuTag()}
            <style jsx>{`.bi-layout-sidebar {cursor: pointer}
            .bi-layout-sidebar::before {transform: rotate(-90deg);}`}</style>
        </div>
    )
}
export function FormEditItem({ Name, Description, Start, End,
    children, typeid,
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
        if (newName.trim() == '') setName(Name)
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
    return (
        <div className={style.dnb_item_container + ' ' + style.dnb_item_edit}>
            <div className="dnb-item-title">{getIcon(typeid)} <input value={name} maxLength="150"
                className={style.dnb_edit_name} type="text" onChange={handleChangeName}
                onMouseOut={handleMouseOutChangeName} />
            </div>
            <textarea className={style.dnb_edit_des} style={{ height: getHeightDesArea() }}
                onChange={handleChangeDes} defaultValue={des} />
            <div className={style.dnb_item_cost}>
                {children}
            </div>
            <div className={style.dnb_item_date}>
                <span className="bi bi-calendar2-week" style={{ marginRight: '3px' }}></span>
                <span className={style.dnb_past_date + " dnb-d-start"}>
                    <input type="date" value={start} max={end} className={style.dnb_edit_start}
                        style={styleColorDate(start)} onChange={handleChangeStart} />
                </span>
                <span className={style.dnb_d_div}>&minus;</span>
                <span className="dnb-d-end">
                    <input type="date" value={end} min={start} className={style.dnb_edit_end}
                        style={styleColorDate(end)} onChange={handleChangeEnd} />
                </span>
            </div>
            <div className={style.dnb_i_menu}>
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
    if (!start_end) return ''
    const _date = new Date(start_end)
    const now = new Date(new Date().toDateString())
    if (_date.getTime() < now.getTime()) {
        return ' ' + style.dnb_past_date
    }
    return ''
}
function getIcon(typeid) {
    if (typeid == 1) return <>&#9673;</>
    if (typeid == 2) return <>&#9670;</>
    return <>&#9632;</>
}