import { useState } from "react"
import { updateGoalWithId } from "../../service"
import { FormEditItem, GoalActionView } from "../action/GoalActionViewForm"
import { getDateString } from "../../global"
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../../styles/ga.scss'

export function GoalItem({ item, ExpCost, TrueCost,
    isExpand, handleExpand,
    updateGoalUI, insertNewChild, onDeleteGoal, handlerDuplicate }) {
    const [isEditView, setEditView] = useState(false)
    const [name, setName] = useState(item.Name)
    const [des, setDes] = useState(item.Description)
    const [isDone, setDone] = useState(item.IsDone)
    const [start, setStart] = useState(item.Start)
    const [end, setEnd] = useState(item.End)
    const [budget, setBudget] = useState(item.Budget)

    function onToggleDone(e) {
        const is_done = !isDone
        const entry = { IsDone: is_done }
        if (item.ParentId) entry.ParentId = item.ParentId
        updateNewGoalUI(entry)
        setDone(is_done)
        updateGoalWithId(item.Id, entry)    // api put
    }
    function updateNewGoalUI(p) {
        const newGoal = { Id: item.Id }
        if (item.ParentId) newGoal.ParentId = item.ParentId
        updateGoalUI(Object.assign(newGoal, p))
    }
    function onCloseEditForm() {
        setEditView(false)
    }
    function onSaveGoal(newGoal) {
        const entry = {}
        if (item.ParentId) entry.ParentId = item.ParentId
        if (typeof newGoal.Name === 'string' && newGoal.Name.trim() !== ''
            && newGoal.Name !== name) {
            setName(newGoal.Name)
            entry.Name = newGoal.Name
        }
        if (typeof newGoal.Description === 'string' && newGoal.Description !== des) {
            setDes(newGoal.Description)
            entry.Description = newGoal.Description
        }
        if (typeof newGoal.Start === 'string' &&
            getDateString(start) !== getDateString(newGoal.Start)) {
            setStart(newGoal.Start)
            entry.Start = getDateString(newGoal.Start)
        }
        if (typeof newGoal.End === 'string' &&
            getDateString(end) !== getDateString(newGoal.End)) {
            setEnd(newGoal.End)
            entry.End = getDateString(newGoal.End)
        }
        if (typeof newGoal.Budget === 'number' && newGoal.Budget !== budget) {
            setBudget(newGoal.Budget)
            entry.Budget = newGoal.Budget
        }
        updateNewGoalUI(newGoal)
        setEditView(false)
        updateGoalWithId(item.Id, entry)    // api put
    }
    function addNewChild(typeid) {
        if (typeid === 2) insertNewChild(item.Id)
        if (typeid === 3) insertNewChild(item.Id)
    }
    return (
        <>{
            !isEditView ? <GoalActionView
                typeid={!item.ParentId ? 1 : 2} lessC={ExpCost - TrueCost}
                isExpand={isExpand} handleExpand={handleExpand}
                name={name} des={des} isDone={isDone} start={start} end={end}
                addNewChild={addNewChild}
                handleDelete={onDeleteGoal} handlerDuplicate={handlerDuplicate}
                setEditView={setEditView} onToggleDone={onToggleDone} >
                <span title="Budget Cost"
                    className={`dnb_icost dnb-budget-cost`}>B:
                    <span className={`dnb_icost_value`}>${budget}</span>
                </span>
                <span className={`dnb_icost dnb-open-cost ${getClsCostNegative(budget, ExpCost)}`}
                    title="Open Cost">o:
                    <span className={`dnb_icost_value`}>{getValueOpenCost(budget, ExpCost)}</span>
                </span>
                <span title="Sum(Actions) Expected Cost"
                    className={`dnb_icost dnb-expect-cost`}>P:
                    <span className={`dnb_icost_value`}>${ExpCost}</span>
                </span>
                <span title="Sum(Action) True Cost"
                    className={`dnb_icost dnb-true-cost`}>C:
                    <span className={`dnb_icost_value`}>${TrueCost}</span>
                </span>
            </GoalActionView> : <FormEditGoal ParentId={item.ParentId}
                Name={name} Description={des} Start={start} End={end}
                Budget={budget} ExpCost={ExpCost} TrueCost={TrueCost}
                onCloseEditForm={onCloseEditForm} onSaveGoal={onSaveGoal}
            />
        }</>
    )
}
export function FormEditGoal({ ParentId,
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
    function getExpectCostTags() {
        if (!ExpCost) return <></>
        return <>
            <span className={`dnb_icost dnb-open-cost ${getClsCostNegative(budget, ExpCost)}`}>o:
                <span className={`dnb_icost_value`}>{getValueOpenCost(budget, ExpCost)}</span>
            </span>
            <span className={`dnb_icost dnb-expect-cost o_50`}>P:
                <span className={`dnb_icost_value`}>${ExpCost}</span>
            </span>
        </>
    }
    function getTrueCostTag() {
        if (!TrueCost) return <></>
        return <span className={`dnb_icost dnb-true-cost o_50`}>C:
            <span className={`dnb_icost_value`}>${TrueCost}</span>
        </span>
    }
    function onCancelEditForm() {
        onCloseEditForm(ParentId)
    }
    return (
        <FormEditItem
            Name={Name} Description={Description} Start={Start} End={End}
            typeid={!ParentId ? 1 : 2} lessC={ExpCost - TrueCost}
            onSaveData={onSaveData}
            onCloseEditForm={onCancelEditForm} >
            <span className={`dnb_icost dnb-budget-cost`}>B:
                <span className={`dnb_icost_value`}>$
                    <input type="number" value={budget} style={{ width: '80px' }}
                        onChange={onHandleChangeBudget} />
                </span>
            </span>
            {getExpectCostTags()}
            {getTrueCostTag()}
        </FormEditItem>
    )
}
function getClsCostNegative(budget, ExpCost) {
    if (budget - ExpCost < 0)
        return ` dnb_ocost_negative`
    return ''
}
function getValueOpenCost(budget, ExpCost) {
    const oCost = budget - ExpCost
    if (oCost < 0) return `-$${Math.abs(oCost)}`
    return `$${oCost}`
}