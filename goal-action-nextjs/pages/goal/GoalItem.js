import {
    StrictMode,
    Component, useState,
    createContext, useContext
} from "react"
import { getDataGoalAction } from "../../service"
import { FormEditItem, getClassOverDate, GoalActionView } from "../action/ActionItem"
import {
    getExpC, getTrueC, getTrueCost,
    getExpectedCost, getDateString
} from "../../global"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from './style.module.scss'

export function GoalItem({ item, ExpCost, TrueCost, updateGoal }) {
    const [isEditView, setEditView] = useState(false)
    const [name, setName] = useState(item.Name)
    const [des, setDes] = useState(item.Description)
    const [isDone, setDone] = useState(item.IsDone)
    const [start, setStart] = useState(item.Start)
    const [end, setEnd] = useState(item.End)
    const [budget, setBudget] = useState(item.Budget)


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
    return (
        <>{
            !isEditView ?
                <GoalActionView
                    typeid={!item.ParentId ? 1 : 2}
                    name={name} des={des} isDone={isDone} start={start} end={end}
                    setEditView={setEditView} onToggleDone={onToggleDone} >
                    <span className={style.dnb_icost + " dnb-budget-cost"}>B:
                        <span className={style.dnb_icost_value}>${budget}</span>
                    </span>
                    <span className={style.dnb_icost + " dnb-open-cost" + getClsCostNegative(budget, ExpCost)}>o:
                        <span className={style.dnb_icost_value}>{getValueOpenCost(budget, ExpCost)}</span>
                    </span>
                    <span className={style.dnb_icost + " dnb-expect-cost"}>P:
                        <span className={style.dnb_icost_value}>${ExpCost}</span>
                    </span>
                    <span className={style.dnb_icost + " dnb-true-cost"}>C:
                        <span className={style.dnb_icost_value}>${TrueCost}</span>
                    </span>
                </GoalActionView> :
                <FormEditGoal ParentId={item.ParentId}
                    Name={name} Description={des} Start={start} End={end}
                    Budget={budget} ExpCost={ExpCost} TrueCost={TrueCost}
                    onCloseEditForm={onCloseEditForm} onSaveGoal={onSaveGoal}
                />
        }</>
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
        goal.Budget = +budget
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
            <span className={style.dnb_icost + " dnb-open-cost" + getClsCostNegative(budget, ExpCost)}>o:
                <span className={style.dnb_icost_value}>{getValueOpenCost(budget, ExpCost)}</span>
            </span>
            <span className={style.dnb_icost + " dnb-expect-cost " + style.o_50}>P:
                <span className={style.dnb_icost_value}>${ExpCost}</span>
            </span>
            <span className={style.dnb_icost + " dnb-true-cost " + style.o_50}>C:
                <span className={style.dnb_icost_value}>${TrueCost}</span>
            </span>
        </FormEditItem>
    )
}
function getClsCostNegative(budget, ExpCost) {
    if (budget - ExpCost < 0)
        return ` ${style.dnb_ocost_negative}`
    return ''
}
function getValueOpenCost(budget, ExpCost) {
    const oCost = budget - ExpCost
    if (oCost < 0) return `-$${Math.abs(oCost)}`
    return `$${oCost}`
}