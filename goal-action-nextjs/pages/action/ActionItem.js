import { useState, useContext } from "react"
import { getDateString, getDateCalendarValue } from "../../global"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from '../goal/style.module.scss'

export function Action({ item, updateAction }) {
    const [isEditView, setEditView] = useState(false)
    const [isShowMenu, setShowMenu] = useState(false)
    const [name, setName] = useState(item.Name)
    const [des, setDes] = useState(item.Description)
    const [isDone, setDone] = useState(item.IsDone)
    const [start, setStart] = useState(item.Start)
    const [end, setEnd] = useState(item.End)
    const [expectCost, setExpectCost] = useState(item.ExpectCost)
    const [trueCost, setTrueCost] = useState(item.TrueCost)

    function onToggleDone(e) {
        const is_done = !isDone
        updateNewAction({ IsDone: is_done })
        setDone(is_done)
        // call api put
    }
    function updateNewAction(p) {
        const newAction = { Id: item.Id, ParentId: item.ParentId }
        updateAction(Object.assign(newAction, p))
    }
    function onToggleMenu(e) {
        setShowMenu(!isShowMenu)
    }
    function getClsDone() {
        if (isDone) return `bi bi-check-circle-fill`
        return `bi bi-check-circle`
    }
    function onCloseEditForm() {
        setEditView(false)
    }
    function onSaveAction(newAction) {
        if (typeof newAction.Name == 'string' && newAction.Name) {
            setName(newAction.Name)
        }
        if (typeof newAction.Description == 'string' && newAction.Description) {
            setDes(newAction.Description)
        }
        if (typeof newAction.IsDone == 'boolean' && newAction.IsDone) {
            setDone(newAction.IsDone)
        }
        if (typeof newAction.Start == 'string') {
            setStart(newAction.Start)
        }
        if (typeof newAction.End == 'string') {
            setEnd(newAction.End)
        }
        if (typeof newAction.ExpectCost == 'number' && newAction.ExpectCost) {
            setExpectCost(newAction.ExpectCost)
        }
        if (typeof newAction.TrueCost == 'number' && newAction.TrueCost) {
            setTrueCost(newAction.TrueCost)
        }
        updateNewAction(newAction)
        setEditView(false)
    }
    function getEndTag() {
        if (!end) return <></>
        return <>
            <span className={style.dnb_d_div}>&minus;</span>
            <span className="dnb-d-end">{getDateString(end)}</span>
        </>
    }
    function getStartTag() {
        if (!start) return <></>
        return <>
            <span className={`bi bi-calendar2-week${getClassOverDate(start)}`} />
            <span className={`dnb-d-start${getClassOverDate(start)}`}>&nbsp;{getDateString(start)}</span>
        </>
    }
    return (
        <>
            {
                !isEditView ?
                    <div className={style.dnb_item_container + `${isDone ? ` ${style.dnb_item_done}` : ''}`}>
                        <div className="dnb-item-title">&#9632; {name}</div>
                        <p className={"dnb-item-description " + style.o_81}>{des}</p>
                        <div className={style.dnb_item_cost}>
                            <span className={style.dnb_icost + ' dnb-expect-cost'}>P:
                                <span className={style.dnb_icost_value}>${expectCost}</span>
                            </span>
                            <span className={style.dnb_icost + " dnb-true-cost"}>C:
                                <span className={style.dnb_icost_value}>${trueCost}</span>
                            </span>
                        </div>
                        <div className={style.dnb_item_date + getClassOverDate(end)}>
                            {getStartTag()}
                            {getEndTag()}
                        </div>
                        <div className={style.dnb_i_options}
                            onClick={onToggleMenu}>
                            <span className="bi bi-layout-sidebar">&nbsp; Menu &nbsp; </span>
                            <span className={`bi bi-chevron-${isShowMenu ? 'down' : 'right'}`}></span>
                        </div>
                        {
                            isShowMenu ? <div className={style.dnb_i_menu}>
                                <i className="bi bi-pencil-square"
                                    onClick={() => setEditView(true)}>&nbsp; Edit</i>
                                <i className="bi bi-files">&nbsp; Duplicate</i>
                                <span className="bi bi-trash">&nbsp; Delete</span>
                                <span>
                                    <span className={getClsDone()}
                                        onClick={onToggleDone}>&nbsp; Done</span>
                                </span>
                            </div> : <></>
                        }
                    </div> :
                    <FormEditAction Id={item.Id} ParentId={item.ParentId}
                        Name={name} Description={des}
                        ExpCost={expectCost}
                        TrueCost={trueCost}
                        Start={start} End={end}
                        onSaveAction={onSaveAction}
                        onCloseEditForm={onCloseEditForm}
                    />
            }
        </>

    )
}

function FormEditAction({ Name, Description, Start, End,
    ExpCost, TrueCost,
    onCloseEditForm, onSaveAction }) {
    const [expectCost, setExpectCost] = useState(ExpCost)
    const [trueCost, setTrueCost] = useState(TrueCost)
    function handleChangeExpectCost(e) {
        const newExp = e.target.value
        setExpectCost(newExp)
    }
    function handleChangeTrueCost(e) {
        const newTrue = e.target.value
        setTrueCost(newTrue)
    }

    function onSaveData(item) {
        item.ExpectCost = +expectCost
        item.TrueCost = +trueCost
        onSaveAction(item)
    }
    return (
        <FormEditItem
            Name={Name} Description={Description} Start={Start} End={End}
            onSaveData={onSaveData}
            onCloseEditForm={onCloseEditForm} >
            <span className={style.dnb_icost + " dnb-expect-cost"}>P:
                <span className={style.dnb_icost_value}>$
                    <input type="number" value={expectCost} style={{ width: '80px' }}
                        onChange={handleChangeExpectCost} />
                </span>
            </span>
            <span className={style.dnb_icost + " dnb-true-cost"}>C:
                <span className={style.dnb_icost_value}>$
                    <input type="number" value={trueCost} style={{ width: '80px' }}
                        onChange={handleChangeTrueCost} />
                </span>
            </span>
        </FormEditItem>
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
    function getIcon() {
        if (typeid == 1) return <>&#9673;</>
        if (typeid == 2) return <>&#9670;</>
        return <>&#9632;</>
    }
    function onSaveDataItem() {
        const s = getDateString(start)
        const e = getDateString(end)
        onSaveData({
            Name: name, Description: des, Start: s, End: e,
        })
    }
    return (
        <div className={style.dnb_item_container}>
            <div className="dnb-item-title">{getIcon()} <input style={{ width: 'calc(100% - 24px)' }}
                type="text" value={name} onChange={handleChangeName} maxLength="150"
                onMouseOut={handleMouseOutChangeName} />
            </div>
            <textarea style={{
                width: 'calc(100% - 24px)', resize: 'none', height: '81px',
                marginLeft: '18px', marginTop: '6px'
            }} onChange={handleChangeDes} defaultValue={des} />
            <div className={style.dnb_item_cost}>
                {children}
            </div>
            <div className={style.dnb_item_date}>
                <span className={style.dnb_past_date + " dnb-d-start"}>
                    <input type="date" value={start} onChange={handleChangeStart} />
                </span>
                <span className={style.dnb_d_div}>&minus;</span>
                <span className="dnb-d-end">
                    <input type="date" value={end} min={start}
                        onChange={handleChangeEnd} />
                </span>
            </div>
            <div className={style.dnb_i_menu}>
                <span className="bi bi-database-up"
                    onClick={onSaveDataItem}>&nbsp; Save &nbsp;</span>
                <span className="bi bi-x-circle"
                    onClick={onCloseEditForm}>&nbsp; Cancel &nbsp;</span>
            </div>
        </div>
    )
}
export function getClassOverDate(start_end) {
    if (!start_end) return ''
    const _date = new Date(start_end)
    const now = new Date(new Date().toDateString())
    if (_date.getTime() < now.getTime()) {
        return ' ' + style.dnb_past_date
    }
    return ''
}