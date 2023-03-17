import { useState, useContext } from "react"
import { getDateString } from "../../global"
import { ItemViewExpand, ItemViewEdit } from "./ItemView"
import { apiUpdateAction } from "../../service"
import { ItemContext } from "./Maingoal"
import { useDispatch, useSelector } from "react-redux"
import { setItems, showEdit } from "../../global/ReduxStore"
import { logItem } from "../../global/GlobalLog"

export function ActionView({ item, isExpandSub,
    pushUpdateAction, onDeleteAction, onDuplicateAction }) {
    const EditId = useSelector(state => state.focus.EditId)
    const dispatch = useDispatch()
    function onToggleDone(e) {
        const is_done = !item.IsDone
        const entry = JSON.parse(JSON.stringify(item))
        entry.IsDone = is_done
        delete entry.IsExpand
        apiUpdateAction(item.Id, entry)      // api put
        pushUpdateAction({ entry })
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
        pushUpdateAction({ entry: Object.assign(item, entry) })
        dispatch(showEdit(item.Id))
        addLoadingItems(true)
        apiUpdateAction(item.Id, entry)  // api put
            .then(res => { addLoadingItems(false) })
    }
    function addLoadingItems(isAdd) {
        const ids = [item.Id, item.ParentId]
        dispatch(setItems({ ids, isAdd }))
    }
    function handlerDuplicate(_item) {
        _item.Name = `COPY ${_item.Name}`
        onDuplicateAction(_item)
        addLoadingItems(true)
    }
    function onExpandAction(isExpd) {
        if (!isExpandSub) return
        const entry = JSON.parse(JSON.stringify(item))
        entry.IsExpand = isExpd
        pushUpdateAction({ entry })
    }
    return (
        <ItemContext.Provider value={Object.assign(
            JSON.parse(JSON.stringify(item)),
            {
                IsExpand: isExpandSub && item.IsExpand,
                TypeId: 3,
                handleExpand: onExpandAction,
                handleDelete: () => onDeleteAction(item),
                handleDuplicate: handlerDuplicate,
            })}>
            {
                EditId !== item.Id ?
                    <ItemViewExpand onToggleDone={onToggleDone}>
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
                    <ActionViewEdit onSaveAction={onSaveAction} />
            }
        </ItemContext.Provider>
    )
}

export function ActionViewEdit({ onSaveAction, className }) {
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
            isExpectLessTrue={expectCost < trueCost}
            onSaveData={onSaveData} >
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
