import { useState, useContext } from "react"
import { getDateString } from "../../global"
import { ItemViewExpand, ItemViewEdit } from "./ItemView"
import { apiUpdateAction, apiDeleteAction, 
    apiAddAction, apiSetCollapse } from "../../service"
import { ItemContext, ItemProvider } from "../../global/Context"
import { useDispatch, useSelector } from "react-redux"
import { setItems, showEdit } from "../../global/ReduxStore"
import { deleteActions, addActions } from "../../global/ReduxStore/DataItem"
import { ViewContext } from "../../global/Context"
import { logItem } from "../../global/GlobalLog"

export function ActionView({ item, isExpandSub, isDoneSub }) {
    const EditId = useSelector(state => state.focus.EditId)
    const unit = useSelector(state => state.filter.Unit)
    const canDnD = useSelector(state => state.filter.CanDrgDrp)
    const dispatch = useDispatch()
    function onToggleDone(e) {
        const is_done = !item.IsDone
        const entry = JSON.parse(JSON.stringify(item))
        entry.IsDone = is_done
        delete entry.IsExpand
        apiUpdateAction(item.Id, entry)      // api put
        dispatch(addActions({
            subid: item.ParentId,
            actions: [entry]
        }))
    }
    function onSaveAction(entry) {
        const isChngStart = typeof entry.Start === 'string'
        const isChngEnd = typeof entry.End === 'string'

        if (isChngStart) {
            entry.Start = getDateString(entry.Start)
        }
        if (isChngEnd) {
            entry.End = getDateString(entry.End)
        }
        const _item = JSON.parse(JSON.stringify(item))
        dispatch(showEdit(item.Id))
        addLoadingItems(true)
        apiUpdateAction(item.Id, entry)  // api put
            .then(res => {
                Object.assign(_item, entry)
                dispatch(addActions({
                    subid: item.ParentId,
                    actions: [_item]
                }))
                addLoadingItems(false)
            })
    }
    function addLoadingItems(isAdd) {
        const ids = [item.Id, item.ParentId]
        dispatch(setItems({ ids, isAdd }))
    }
    function onCopyAction(_item) {
        addLoadingItems(true)

        _item.Name = `COPY ${_item.Name}`

        apiAddAction(_item).then(newId => {
            addLoadingItems(false)

            if (!newId.includes('invalid')) {
                _item.Id = newId
                _item.IsExpand = true
                dispatch(addActions({
                    subid: item.ParentId,
                    actions: [_item]
                }))
            }
        })
    }
    function onExpandAction(isExpd) {
        if (!isExpandSub) return
        const entry = JSON.parse(JSON.stringify(item))
        entry.IsExpand = isExpd
        dispatch(addActions({
            subid: item.ParentId,    
            actions: [entry]
        }))
        apiSetCollapse([item.Id], isExpd)
    }
    function onDeleteA() {
        dispatch(deleteActions({
            subid: item.ParentId,
            ids: [item.Id]
        }))
        apiDeleteAction(item.Id)
    }
    const [viewLevel, setViewLevel] = useState(1)
    return (
        <ItemProvider item={Object.assign(
            JSON.parse(JSON.stringify(item)),
            {
                IsExpand: isExpandSub && item.IsExpand,
                TypeId: 3, isDoneSub: isDoneSub,
            })}
            handler={{
                handleExpand: onExpandAction,
                handleDelete: onDeleteA,
                handleDuplicate: onCopyAction,
            }}>
            <ViewContext.Provider value={{ viewLevel, setViewLevel }}>
                {EditId !== item.Id ?
                    <ItemViewExpand className={canDnD && 'dnb-dnd-item dnbDndItem'}
                        id={canDnD ? item.Id : undefined}
                        onToggleDone={onToggleDone}>
                        {!!unit.View.length && <>
                            <span title="Expected Cost"
                                className='dnb_icost dnb-expect-cost'>P:
                                <span className='dnb_icost_value'>{unit.View}{item.ExpectCost}</span>
                            </span>
                            <span title="True Cost"
                                className='dnb_icost dnb-true-cost'>C:
                                <span className='dnb_icost_value'>{unit.View}{item.TrueCost}</span>
                            </span>
                        </>}
                    </ItemViewExpand>
                    : <ActionViewEdit onSaveAction={onSaveAction} />
                }
            </ViewContext.Provider>

        </ItemProvider>
    )
}

export function ActionViewEdit({ onSaveAction, className }) {
    const unit = useSelector(state => state.filter.Unit)
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
        const nTrue = +trueCost
        const isEdit = typeof item.Id === 'string' && item.Id.includes('-')
        _item.ExpectCost = nExp
        _item.TrueCost = nTrue
        if (isEdit) {
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
        }
        onSaveAction(_item)
    }
    return (
        <ItemViewEdit className={className}
            isExpectLessTrue={expectCost < trueCost} onSaveData={onSaveData} >
            {!!unit.View.length && <>
                <span className='dnb_icost dnb-expect-cost'>P:
                    <span className='dnb_icost_value'>{unit.View}
                        <input type="number" value={expectCost}
                            style={{ width: '80px' }} onChange={handleChangeExpectCost} />
                    </span>
                </span>
                <span className='dnb_icost dnb-true-cost'>C:
                    <span className='dnb_icost_value'>{unit.View}
                        <input type="number" value={trueCost}
                            style={{ width: '80px' }} onChange={handleChangeTrueCost} />
                    </span>
                </span>
            </>}
        </ItemViewEdit>
    )
}
