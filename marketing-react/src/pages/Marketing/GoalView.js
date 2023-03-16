import { useState, useContext } from "react"
import { updateGoalWithId } from "../../service"
import { ItemViewExpand, ItemViewEdit } from "./ItemView"
import { getDateString } from "../../global"
import { ItemContext } from "./Maingoal"
import { useDispatch, useSelector } from "react-redux"
import { showEdit } from "../../global/ReduxStore"

export function GoalItemView({ updateGoalUI }) {
    const item = useContext(ItemContext)
    const EditId = useSelector(state => state.focus.EditId)
    const dispatch = useDispatch()
    function onToggleDone(e) {
        const is_done = !item.IsDone
        const entry = { IsDone: is_done }
        if (item.ParentId) entry.ParentId = item.ParentId
        updateNewGoalUI(entry)
        updateGoalWithId(item.Id, entry)    // api put
    }
    function updateNewGoalUI(p) {
        const newGoal = { Id: item.Id }
        if (item.ParentId) newGoal.ParentId = item.ParentId
        updateGoalUI(Object.assign(newGoal, p))
    }
    function onSaveGoal(newGoal) {
        const entry = {}
        if (item.ParentId) entry.ParentId = item.ParentId
        if (typeof newGoal.Name === 'string' && newGoal.Name.trim() !== ''
            && newGoal.Name !== item.Name) {
            item.Name = newGoal.Name
            entry.Name = newGoal.Name
        }
        if (typeof newGoal.Description === 'string' &&
            newGoal.Description !== item.Description) {
            item.Description = newGoal.Description
            entry.Description = newGoal.Description
        }
        if (typeof newGoal.Start === 'string' &&
            getDateString(item.Start) !== getDateString(newGoal.Start)) {
            item.Start = newGoal.Start
            entry.Start = getDateString(newGoal.Start)
        }
        if (typeof newGoal.End === 'string' &&
            getDateString(item.End) !== getDateString(newGoal.End)) {
            item.End = newGoal.End
            entry.End = getDateString(newGoal.End)
        }
        if (typeof newGoal.Budget === 'number' && newGoal.Budget !== item.Budget) {
            item.Budget = newGoal.Budget
            entry.Budget = newGoal.Budget
        }
        updateNewGoalUI(newGoal)
        dispatch(showEdit(item.Id)) // false
        updateGoalWithId(item.Id, entry)    // api put
    }
    return (
        <>{
            EditId !== item.Id ? <ItemViewExpand onToggleDone={onToggleDone} >
                <span title="Budget Cost"
                    className={`dnb_icost dnb-budget-cost`}>B:
                    <span className={`dnb_icost_value`}>${item.Budget}</span>
                </span>
                <span className={`dnb_icost dnb-open-cost ${getClsCostNegative(item.Budget, item.ExpectCost)}`}
                    title="Open Cost">o:
                    <span className={`dnb_icost_value`}>{getValueOpenCost(item.Budget, item.ExpectCost)}</span>
                </span>
                <span title="Sum(Actions) Expected Cost"
                    className={`dnb_icost dnb-expect-cost`}>P:
                    <span className={`dnb_icost_value`}>${item.ExpectCost}</span>
                </span>
                <span title="Sum(Actions) True Cost"
                    className={`dnb_icost dnb-true-cost`}>C:
                    <span className={`dnb_icost_value`}>${item.TrueCost}</span>
                </span>
            </ItemViewExpand> : <GoalItemEdit onSaveGoal={onSaveGoal} />
        }</>
    )
}
export function GoalItemEdit({ onSaveGoal }) {
    const { ParentId, Budget, ExpectCost, TrueCost, } = useContext(ItemContext)
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
        if (!ExpectCost) return <></>
        return <>
            <span className={`dnb_icost dnb-open-cost ${getClsCostNegative(budget, ExpectCost)}`}>o:
                <span className={`dnb_icost_value`}>{getValueOpenCost(budget, ExpectCost)}</span>
            </span>
            <span className={`dnb_icost dnb-expect-cost o_50`}>P:
                <span className={`dnb_icost_value`}>${ExpectCost}</span>
            </span>
        </>
    }
    function getTrueCostTag() {
        if (!TrueCost) return <></>
        return <span className={`dnb_icost dnb-true-cost o_50`}>C:
            <span className={`dnb_icost_value`}>${TrueCost}</span>
        </span>
    }
    return (
        <ItemViewEdit
            isExpectLessTrue={ExpectCost < TrueCost}
            onSaveData={onSaveData} >
            <span className={`dnb_icost dnb-budget-cost`}>B:
                <span className={`dnb_icost_value`}>$
                    <input type="number" value={budget} style={{ width: '80px' }}
                        onChange={onHandleChangeBudget} />
                </span>
            </span>
            {getExpectCostTags()}
            {getTrueCostTag()}
        </ItemViewEdit>
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