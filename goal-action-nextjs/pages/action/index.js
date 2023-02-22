import { useState } from "react"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from '../goal/style.module.scss'

export function ActionItem({ Name, Description, ExpCost, ParentId,
    TrueCost, Start, End, IsDone, Id, setActionDone }) {
    const [isEditView, setEditView] = useState(false)
    const [isShowMenu, setShowMenu] = useState(false)

    function getClassOverDate() {
        if (!End) return ''
        const end = new Date(End)
        const now = new Date(new Date().toDateString())
        if (end.getTime() < now.getTime()) {
            return ' ' + style.dnb_past_date
        }
        return ''
    }
    function getStartOverDate() {
        const start = new Date(Start)
        const now = new Date(new Date().toDateString())
        if (start.getTime() < now.getTime()) {
            return ' ' + style.dnb_past_date
        }
        return ''
    }
    function onToggleDone(e) {
        const is_done = !IsDone
        setActionDone(Id, is_done)
    }
    function onToggleMenu(e) {
        setShowMenu(!isShowMenu)
    }
    function getClsDone() {
        if (IsDone) return `bi bi-check-circle-fill`
        return `bi bi-check-circle`
    }
    function onShowEditForm(e) {
        setEditView(true)
    }
    function onCancelEditForm() {
        setEditView(false)
    }
    return (
        <>
            {
                !isEditView ?
                    <div className={style.dnb_item_container + `${IsDone ? ` ${style.dnb_item_done}` : ''}`}>
                        <div className="dnb-item-title">&#9632; {Name}</div>
                        <p className={"dnb-item-description " + style.o_81}>{Description}</p>
                        <div className={style.dnb_item_cost}>
                            <span className={style.dnb_icost + ' dnb-expect-cost'}>P:
                                <span className={style.dnb_icost_value}>${ExpCost}</span>
                            </span>
                            <span className={style.dnb_icost + " dnb-true-cost"}>C:
                                <span className={style.dnb_icost_value}>${TrueCost}</span>
                            </span>
                        </div>
                        <div className={style.dnb_item_date + getClassOverDate()}>
                            <span className={`bi bi-calendar2-week${getStartOverDate()}`} />
                            <span className={`dnb-d-start${getStartOverDate()}`}>&nbsp;{Start}</span>
                            {
                                End ? <>
                                    <span className={style.dnb_d_div}>&minus;</span>
                                    <span className="dnb-d-end">{End}</span>
                                </> : <></>
                            }
                        </div>
                        <div className={style.dnb_i_options}
                            onClick={onToggleMenu}>
                            <span className="bi bi-layout-sidebar">&nbsp; Menu &nbsp; </span>
                            <span className={`bi bi-chevron-${isShowMenu ? 'down' : 'right'}`}></span>
                        </div>
                        {
                            isShowMenu ? <div className={style.dnb_i_menu}>
                                <i className="bi bi-pencil-square"
                                    onClick={onShowEditForm}>&nbsp; Edit</i>
                                <i className="bi bi-files">&nbsp; Duplicate</i>
                                <span className="bi bi-trash">&nbsp; Delete</span>
                                <span>
                                    <span className={getClsDone()}
                                        onClick={onToggleDone}>&nbsp; Done</span>
                                </span>
                            </div> : <></>
                        }
                    </div> :
                    <FormEditAction ParentId={ParentId}
                        Id={Id} Name={Name} Description={Description}
                        ExpCost={ExpCost}
                        TrueCost={TrueCost}
                        Start={Start} End={End}
                        onCancelEditForm={onCancelEditForm}
                    />
            }
        </>

    )
}

function FormEditAction({ Id, Name, Description, ExpCost, TrueCost, Start, End, ParentId, onCancelEditForm }) {
    const [name, setName] = useState(Name)
    const [des, setDes] = useState(Description)
    const [expectCost, setExpectCost] = useState(ExpCost)
    const [trueCost, setTrueCost] = useState(TrueCost)
    const [start, setStart] = useState(getStartValue())
    const [end, setEnd] = useState(getEndValue())
    function getStartValue() {
        const s0 = new Date(Start)
        const s = new Date(s0.getTime() + 24000 * 3600)
        return s.toISOString().split('T')[0]
    }
    function getEndValue() {
        if (!End) return ''
        const e0 = new Date(End)
        const e = new Date(e0.getTime() + 24000 * 3600)
        return e.toISOString().split('T')[0]
    }
    function handleChangeStart(e) {
        const newD = e.target.value
        setStart(newD)
    }
    function handleChangeEnd(e) {
        const newD = e.target.value
        setEnd(newD)
    }
    function handlerChangeName(e) {
        const newName = e.target.value
        setName(newName)
    }
    function handlerMouseOutChangeName(e) {
        const newName = e.target.value
        if (newName.trim() == '') setName(Name)
    }
    function onSaveData(e) {

    }
    return (
        <div className={style.dnb_item_container}>
            <div className="dnb-item-title">&#9632; <input style={{ width: 'calc(100% - 24px)' }}
                type="text" value={name} onChange={handlerChangeName}  maxLength="150"
                onMouseOut={handlerMouseOutChangeName}/>
            </div>
            <textarea style={{
                width: 'calc(100% - 24px)', resize: 'none', height: '81px',
                marginLeft: '18px', marginTop: '6px'
            }}>{des}</textarea>
            <div className={style.dnb_item_cost}>
                <span className={style.dnb_icost + " dnb-expect-cost"}>P:
                    <span className={style.dnb_icost_value}>$
                        <input type="number" value={expectCost} style={{ width: '80px' }} />
                    </span>
                </span>
                <span className={style.dnb_icost + " dnb-true-cost"}>C:
                    <span className={style.dnb_icost_value}>$
                        <input type="number" value={trueCost} style={{ width: '80px' }} />
                    </span>
                </span>
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
                    onClick={onSaveData}>&nbsp; Save &nbsp;</span>
                <span className="bi bi-x-circle"
                    onClick={onCancelEditForm}>&nbsp; Cancel &nbsp;</span>
            </div>
        </div>
    )
}