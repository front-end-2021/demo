import { useState } from "react"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from '../goal/style.module.scss'

export function ActionItem({ Name, Description, ExpCost,
    TrueCost, Start, End, IsDone, Id, setActionDone }) {
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
    return (
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
                <span className="bi bi-calendar-range">&nbsp;</span>
                <span className={`dnb-d-start${getStartOverDate()}`}>{Start}</span>
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
                    <i className="bi bi-pencil-square">&nbsp; Edit</i>
                    <i className="bi bi-files">&nbsp; Duplicate</i>
                    <span className="bi bi-trash">&nbsp; Delete</span>
                    <span>
                        <span className={getClsDone()}
                            onClick={onToggleDone}>&nbsp; Done</span>
                    </span>
                </div> : <></>
            }
        </div>
    )
}