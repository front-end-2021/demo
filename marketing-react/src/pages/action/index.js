import { useState } from "react"
import { getDateString } from "../../global"
import { FormEditItem, GoalActionView } from "./GoalActionViewForm"
import { updateActionWithId } from "../../service"
import '../../../node_modules/bootstrap-icons/font/bootstrap-icons.css'
import '../../styles/ga.scss'

export function Action({ item, updateAction, onDeleteAction, onDuplicateAction }) {
    const [isEditView, setEditView] = useState(false)
    const [name, setName] = useState(item.Name)
    const [des, setDes] = useState(item.Description)
    const [isDone, setDone] = useState(item.IsDone)
    const [start, setStart] = useState(item.Start)
    const [end, setEnd] = useState(item.End)
    const [expectCost, setExpectCost] = useState(item.ExpectCost)
    const [trueCost, setTrueCost] = useState(item.TrueCost)
    const [isExpand, setExpand] = useState(true)

    function onToggleDone(e) {
        const is_done = !isDone
        const entry = { IsDone: is_done }
        updateNewAction(entry)
        setDone(is_done)
        updateActionWithId(item.Id, entry)      // api put
    }
    function updateNewAction(p) {
        const newAction = { Id: item.Id, ParentId: item.ParentId }
        updateAction(Object.assign(newAction, p))
    }
    function onCloseEditForm() {
        setEditView(false)
    }
    function onSaveAction(newAction) {
        const entry = {}
        if (typeof newAction.Name == 'string' && newAction.Name.trim() != ''
            && newAction.Name != name) {
            setName(newAction.Name)
            entry.Name = newAction.Name
        }
        if (typeof newAction.Description == 'string' && newAction.Description != des) {
            setDes(newAction.Description)
            entry.Description = newAction.Description
        }
        if (typeof newAction.IsDone == 'boolean' && newAction.IsDone != isDone) {
            setDone(newAction.IsDone)
            entry.IsDone = newAction.IsDone
        }
        if (typeof newAction.Start == 'string' &&
            getDateString(start) != getDateString(newAction.Start)) {
            setStart(newAction.Start)
            entry.Start = getDateString(newAction.Start)
        }
        if (typeof newAction.End == 'string' &&
            getDateString(end) != getDateString(newAction.End)) {
            setEnd(newAction.End)
            entry.End = getDateString(newAction.End)
        }
        if (typeof newAction.ExpectCost == 'number' && newAction.ExpectCost != expectCost) {
            setExpectCost(newAction.ExpectCost)
            entry.ExpectCost = newAction.ExpectCost
        }
        if (typeof newAction.TrueCost == 'number' && newAction.TrueCost != trueCost) {
            setTrueCost(newAction.TrueCost)
            entry.TrueCost = newAction.TrueCost
        }
        updateNewAction(newAction)
        setEditView(false)
        updateActionWithId(item.Id, entry)  // api put
    }
    function handleDelete() {
        onDeleteAction(item.Id)
    }
    function handlerDuplicate() {
        const _item = JSON.parse(JSON.stringify(item))  // copy
        delete _item.Id
        _item.Name = `${_item.Name} (1)`
        onDuplicateAction(_item)
    }
    function handleExpand(isExpd) {
        setExpand(isExpd)
    }
    return (
        <>
            {
                !isEditView ?
                    <GoalActionView
                        typeid={3} lessC={expectCost - trueCost}
                        isExpand={isExpand} handleExpand={handleExpand}
                        name={name} des={des} isDone={isDone} start={start} end={end}
                        setEditView={setEditView} onToggleDone={onToggleDone}
                        handleDelete={handleDelete} handlerDuplicate={handlerDuplicate}>
                        <span title="Expected Cost"
                            className='dnb_icost dnb-expect-cost'>P:
                            <span className='dnb_icost_value'>${expectCost}</span>
                        </span>
                        <span title="True Cost"
                            className='dnb_icost dnb-true-cost'>C:
                            <span className='dnb_icost_value'>${trueCost}</span>
                        </span>
                    </GoalActionView> :
                    <FormEditAction
                        Name={name} Description={des} Start={start} End={end}
                        ExpCost={expectCost} TrueCost={trueCost}
                        onSaveAction={onSaveAction}
                        onCloseEditForm={onCloseEditForm}
                    />
            }
        </>
    )
}

export function FormEditAction({ Name, Description, Start, End,
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
            typeid={3} lessC={expectCost - trueCost}
            onSaveData={onSaveData}
            onCloseEditForm={onCloseEditForm} >
            <span className='dnb_icost dnb-expect-cost'>P:
                <span className='dnb_icost_value'>$
                    <input type="number" value={expectCost}
                        style={{ width: '80px' }}
                        onChange={handleChangeExpectCost} />
                </span>
            </span>
            <span className='dnb_icost dnb-true-cost'>C:
                <span className='dnb_icost_value'>$
                    <input type="number" value={trueCost}
                        style={{ width: '80px' }}
                        onChange={handleChangeTrueCost} />
                </span>
            </span>
        </FormEditItem>
    )
}
