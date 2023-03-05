import { useState, useContext } from "react"
import { getDateString } from "../../global"
import { GoalActionView, FormEditItem } from "./ItemView"
import { updateActionWithId } from "../../service"
import { ItemContext } from "./Maingoal"

export function Action({ item, isExpandParent,
    updateAction, onDeleteAction, onDuplicateAction }) {
    const [isExpand, setExpand] = useState(true)
    const [isEditView, setEditView] = useState(false)
    function onToggleDone(e) {
        const is_done = !item.IsDone
        const entry = { IsDone: !!is_done }
        onUpdateAction(entry)
        item.IsDone = !!is_done
        updateActionWithId(item.Id, entry)      // api put
    }
    function onUpdateAction(p) {
        updateAction(Object.assign(item, p))
    }
    function onCloseEditForm() {
        setEditView(false)
    }
    function onSaveAction(newAction) {
        const entry = {}
        if (typeof newAction.Name == 'string' && newAction.Name.trim() !== ''
            && newAction.Name !== item.Name) {
            item.Name = newAction.Name
            entry.Name = newAction.Name
        }
        if (typeof newAction.Description == 'string' &&
            newAction.Description !== item.Description) {
            item.Description = newAction.Description
            entry.Description = newAction.Description
        }
        if (typeof newAction.IsDone == 'boolean' && newAction.IsDone !== item.IsDone) {
            item.IsDone = newAction.IsDone
            entry.IsDone = newAction.IsDone
        }
        if (typeof newAction.Start == 'string' &&
            getDateString(item.Start) !== getDateString(newAction.Start)) {
            item.Start = newAction.Start
            entry.Start = getDateString(newAction.Start)
        }
        if (typeof newAction.End == 'string' &&
            getDateString(item.End) !== getDateString(newAction.End)) {
            item.End = newAction.End
            entry.End = getDateString(newAction.End)
        }
        if (typeof newAction.ExpectCost == 'number' &&
            newAction.ExpectCost !== item.ExpectCost) {
            item.ExpectCost = newAction.ExpectCost
            entry.ExpectCost = newAction.ExpectCost
        }
        if (typeof newAction.TrueCost == 'number' && newAction.TrueCost !== item.TrueCost) {
            item.TrueCost = newAction.TrueCost
            entry.TrueCost = newAction.TrueCost
        }
        onUpdateAction(newAction)
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
        if (!isExpandParent) return
        setExpand(isExpd)
    }
    return (
        <ItemContext.Provider value={Object.assign({
            IsExpand: isExpandParent && isExpand, TypeId: 3
        }, item)}>
            {
                !isEditView ?
                    <GoalActionView handleExpand={handleExpand}
                        setEditView={setEditView} onToggleDone={onToggleDone}
                        handleDelete={handleDelete} handlerDuplicate={handlerDuplicate}>
                        <span title="Expected Cost"
                            className='dnb_icost dnb-expect-cost'>P:
                            <span className='dnb_icost_value'>${item.ExpectCost}</span>
                        </span>
                        <span title="True Cost"
                            className='dnb_icost dnb-true-cost'>C:
                            <span className='dnb_icost_value'>${item.TrueCost}</span>
                        </span>
                    </GoalActionView>
                    :
                    <FormEditAction
                        onSaveAction={onSaveAction}
                        onCloseEditForm={onCloseEditForm} />
            }
        </ItemContext.Provider>
    )
}

export function FormEditAction({ onCloseEditForm, onSaveAction }) {
    const item = useContext(ItemContext)
    const [expectCost, setExpectCost] = useState(item.ExpectCost)
    const [trueCost, setTrueCost] = useState(item.TrueCost)
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
