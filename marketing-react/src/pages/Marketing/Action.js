import { useState, useContext } from "react"
import { getDateString } from "../../global"
import { ItemViewExpand, ItemViewEdit } from "./ItemView"
import { updateActionWithId } from "../../service"
import { ItemContext } from "./Maingoal"

export function ActionView({ item, isExpandParent,
    pushUpdateAction, onDeleteAction, onDuplicateAction }) {
    const [isExpand, setExpand] = useState(true)
    const [isEditView, setEditView] = useState(false)
    const [isloading, setLoading] = useState(false)
    function onToggleDone(e) {
        const is_done = !item.IsDone
        const entry = { IsDone: !!is_done }
        item.IsDone = !!is_done
        updateActionWithId(item.Id, entry)      // api put
    }
    function onCloseEditForm() {
        setEditView(false)
    }
    function onSaveAction(newAction) {
        setLoading(true)
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
        if (typeof newAction.IsDone == 'boolean' &&
            newAction.IsDone !== item.IsDone) {
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
        let isChangeExpect = false
        if (typeof newAction.ExpectCost == 'number' &&
            newAction.ExpectCost !== item.ExpectCost) {
            item.ExpectCost = newAction.ExpectCost
            entry.ExpectCost = newAction.ExpectCost
            isChangeExpect = true
        }
        let isChangeTrue = false
        if (typeof newAction.TrueCost == 'number' &&
            newAction.TrueCost !== item.TrueCost) {
            item.TrueCost = newAction.TrueCost
            entry.TrueCost = newAction.TrueCost
            isChangeTrue = false
        }
        pushUpdateAction({ isChangeExpect, isChangeTrue })
        setEditView(false)
        updateActionWithId(item.Id, entry)  // api put
            .then(res => {
                setLoading(false)
            })
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
    function onExpand(isExpd) {
        if (!isExpandParent) return
        setExpand(isExpd)
    }
    return (
        <ItemContext.Provider value={Object.assign({
            IsExpand: isExpandParent && isExpand,
            TypeId: 3,
            handleExpand: onExpand,
            handleDelete: handleDelete,
            handleDuplicate: handlerDuplicate,
        }, item)}>
            {
                !isEditView ?
                    <ItemViewExpand className={isloading ? 'fb-loading' : ''}
                        setEditView={setEditView}
                        onToggleDone={onToggleDone}>
                        <span title="Expected Cost"
                            className='dnb_icost dnb-expect-cost'>P:
                            <span className='dnb_icost_value'>${item.ExpectCost}</span>
                        </span>
                        <span title="True Cost"
                            className='dnb_icost dnb-true-cost'>C:
                            <span className='dnb_icost_value'>${item.TrueCost}</span>
                        </span>
                    </ItemViewExpand>
                    :
                    <ActionViewEdit
                        onSaveAction={onSaveAction}
                        onCloseEditForm={onCloseEditForm} />
            }
        </ItemContext.Provider>
    )
}

export function ActionViewEdit({ onCloseEditForm, onSaveAction }) {
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
        <ItemViewEdit
            isExpectLessTrue={expectCost < trueCost}
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
        </ItemViewEdit>
    )
}
