import { useState, useContext } from "react"
import { getDateString } from "../../global"
import { ItemViewExpand, ItemViewEdit } from "./ItemView"
import { updateActionWithId } from "../../service"
import { ItemContext } from "./Maingoal"
import { useDispatch } from "react-redux"
import { setItems } from "../../global/ReduxStore"

export function ActionView({ item, isExpandParent,
    pushUpdateAction, onDeleteAction, onDuplicateAction }) {
    const [isExpand, setExpand] = useState(true)
    const [isEditView, setEditView] = useState(false)
    function onToggleDone(e) {
        const is_done = !item.IsDone
        const entry = { IsDone: !!is_done }
        item.IsDone = !!is_done
        updateActionWithId(item.Id, entry)      // api put
    }
    function onCloseEditForm() {
        setEditView(false)
    }
    const dispatch = useDispatch()
    function onSaveAction(entry) {
        const isChangeExpect = typeof entry.ExpectCost === 'number'
        if (isChangeExpect) {
            item.ExpectCost = entry.ExpectCost
        }
        const isChangeTrue = typeof entry.TrueCost === 'number'
        if (isChangeTrue) {
            item.TrueCost = entry.TrueCost
        }
        if (typeof entry.Name == 'string' && entry.Name.trim() !== '') {
            item.Name = entry.Name
        }
        if (typeof entry.Description === 'string') {
            item.Description = entry.Description
        }
        entry.IsDone = item.IsDone
        if (typeof entry.Start === 'string') {
            item.Start = entry.Start
            entry.Start = getDateString(entry.Start)
        }
        if (typeof entry.End === 'string') {
            item.End = entry.End
            entry.End = getDateString(entry.End)
        }
        pushUpdateAction({ isChangeExpect, isChangeTrue })
        setEditView(false)
        const ids = [item.Id, item.ParentId]
        let isAdd = true
        dispatch(setItems({ ids, isAdd }))
        updateActionWithId(item.Id, entry)  // api put
            .then(res => {
                isAdd = false
                dispatch(setItems({ ids, isAdd }))
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
                    <ItemViewExpand
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
    function onSaveData(_item) {
        const nExp = +expectCost
        if (item.ExpectCost !== nExp) {
            _item.ExpectCost = +expectCost
        }
        const nTrue = +trueCost
        if (item.TrueCost !== nTrue) {
            _item.TrueCost = +trueCost
        }
        if (item.Name === _item.Name.trim()) {
            delete _item.Name
        }
        if (item.Description === _item.Description) {
            delete _item.Description
        }
        if (getDateString(item.Start) === getDateString(_item.Start)) {
            delete _item.Start
        }
        if (getDateString(item.End) === getDateString(_item.End)) {
            delete _item.End
        }
        onSaveAction(_item)
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
