import {
    StrictMode,
    Component, useState,
    createContext, useContext
} from "react"
import { getDataGoalAction } from "../../service"
import { FormEditItem, getClassOverDate } from "../action/ActionItem"
import {
    getExpC, getTrueC, getTrueCost,
    getExpectedCost, getDateString
} from "../../global"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from './style.module.scss'

export function GoalItem({ item, ExpCost, TrueCost, updateGoal }) {
    const [isEditView, setEditView] = useState(false)
    const [isShowMenu, setShowMenu] = useState(false)
    const [name, setName] = useState(item.Name)
    const [des, setDes] = useState(item.Description)
    const [isDone, setDone] = useState(item.IsDone)
    const [start, setStart] = useState(item.Start)
    const [end, setEnd] = useState(item.End)
    const [budget, setBudget] = useState(item.Budget)
   
    function getValueOpenCost() {
        const oCost = budget - ExpCost
        if (oCost < 0) return `-$${Math.abs(oCost)}`
        return `$${oCost}`
    }
    function getClsCostNegative() {
        if (budget - ExpCost < 0)
            return ` ${style.dnb_ocost_negative}`
        return ''
    }
    function onToggleDone(e) {
        const is_done = !isDone
        updateNewGoal({ IsDone: is_done })
        setDone(is_done)
    }
    function updateNewGoal(p) {
        const newGoal = { Id: item.Id }
        if (item.ParentId) newGoal.ParentId = item.ParentId
        updateGoal(Object.assign(newGoal, p))
    }
    function getClsDone() {
        if (isDone) return `bi bi-check-circle-fill`
        return `bi bi-check-circle`
    }
    function getClsItemDone() {
        if (!isDone) return ''
        return ` ${style.dnb_item_done}`
    }
    function onCloseEditForm() {
        setEditView(false)
    }
    function onSaveGoal(newGoal) {
        if (typeof newGoal.Name == 'string' && newGoal.Name) {
            setName(newGoal.Name)
        }
        if (typeof newGoal.Description == 'string' && newGoal.Description) {
            setDes(newGoal.Description)
        }
        if (typeof newGoal.IsDone == 'boolean' && newGoal.IsDone) {
            setDone(newGoal.IsDone)
        }
        if (typeof newGoal.Start == 'string') {
            setStart(newGoal.Start)
        }
        if (typeof newGoal.End == 'string') {
            setEnd(newGoal.End)
        }
        if (typeof newGoal.Budget == 'number' && newGoal.Budget) {
            setBudget(newGoal.Budget)
        }
        updateNewGoal(newGoal)
        setEditView(false)
    }
    function getStartTag() {
        if (!start) return <></>
        return <>
            <span className={`bi bi-calendar2-week${getClassOverDate(start)}`} />
            <span className={style.dnb_past_date + ` dnb-d-start${getClassOverDate(start)}`}>&nbsp;{getDateString(start)}</span>
        </>
    }
    function getEndTag() {
        if (!end) return <></>
        return <>
            <span className={style.dnb_d_div}>&minus;</span>
            <span className="dnb-d-end">{getDateString(end)}</span>
        </>
    }
    function getMenuTag() {
        if (!isShowMenu) return <></>
        return <>
            <div className={style.dnb_i_menu}>
                <i className="bi bi-pencil-square"
                    onClick={() => setEditView(true)}>&nbsp; Edit</i>
                <i className="bi bi-files">&nbsp; Duplicate</i>
                <span className="bi bi-trash">&nbsp; Delete</span>
                <span>
                    <span className={getClsDone()}
                        onClick={onToggleDone}>&nbsp; Finish</span>
                </span>
                <span className="bi bi-plus-circle-dotted">&nbsp; New {
                    item.ParentId ? <>&#9632;</> : <>&#9670;</>}</span>
            </div>
        </>
    }
    return (
        <>
            {
                !isEditView ?
                    <div className={style.dnb_item_container + `${getClsItemDone()}`}>
                        <div className="dnb-item-title">{!item.ParentId ? <>&#9673;</> : <>&#9670;</>} {name}</div>
                        <p className={style.o_81 + "dnb-item-description"}>{des}</p>
                        <div className={style.dnb_item_cost}>
                            <span className={style.dnb_icost + " dnb-budget-cost"}>B:
                                <span className={style.dnb_icost_value}>${budget}</span>
                            </span>
                            <span className={style.dnb_icost + " dnb-open-cost" + getClsCostNegative()}>o:
                                <span className={style.dnb_icost_value}>{getValueOpenCost()}</span>
                            </span>
                            <span className={style.dnb_icost + " dnb-expect-cost"}>P:
                                <span className={style.dnb_icost_value}>${ExpCost}</span>
                            </span>
                            <span className={style.dnb_icost + " dnb-true-cost"}>C:
                                <span className={style.dnb_icost_value}>${TrueCost}</span>
                            </span>
                        </div>
                        <div className={style.dnb_item_date + getClassOverDate(end)}>
                            {getStartTag()}
                            {getEndTag()}
                        </div>
                        <div className={style.dnb_i_options}
                            onClick={() => setShowMenu(!isShowMenu)}>
                            <span className="bi bi-layout-sidebar">&nbsp; Menu &nbsp;</span>
                            <span className={`bi bi-chevron-${isShowMenu ? 'down' : 'right'}`}></span>
                        </div>
                        {getMenuTag()}
                    </div> :
                    <FormEditGoal ParentId={item.ParentId}
                        Name={item.Name} Description={item.Description} Start={item.Start} End={item.End}
                        Budget={item.Budget} ExpCost={ExpCost} TrueCost={TrueCost}
                        onCloseEditForm={onCloseEditForm} onSaveGoal={onSaveGoal}
                    />
            }
        </>
    )
}
function FormEditGoal({ ParentId,
    Name, Description, Start, End,
    Budget, ExpCost, TrueCost,
    onCloseEditForm, onSaveGoal }) {
    const [budget, setBudget] = useState(Budget)
    function onHandleChangeBudget(e) {
        const newB = e.target.value
        setBudget(newB)
    }
    function onSaveData(goal) {
        goal.Budget = +btget
        if (!!ParentId) goal.ParentId = ParentId
        onSaveGoal(goal)
    }
    return (
        <FormEditItem
            Name={Name} Description={Description} Start={Start} End={End}
            typeid={!ParentId ? 1 : 2} onSaveData={onSaveData}
            onCloseEditForm={onCloseEditForm} >
            <span className={style.dnb_icost + " dnb-budget-cost"}>B:
                <span className={style.dnb_icost_value}>$
                    <input type="number" value={budget} style={{ width: '80px' }}
                        onChange={onHandleChangeBudget} />
                </span>
            </span>
            <span className={style.dnb_icost + " dnb-open-cost"}>o:
                <span className={style.dnb_icost_value}></span>
            </span>
            <span className={style.dnb_icost + " dnb-expect-cost"}>P:
                <span className={style.dnb_icost_value}>${ExpCost}</span>
            </span>
            <span className={style.dnb_icost + " dnb-true-cost"}>C:
                <span className={style.dnb_icost_value}>${TrueCost}</span>
            </span>
        </FormEditItem>
    )
}