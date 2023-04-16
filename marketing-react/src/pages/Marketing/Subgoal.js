import React, { Component } from "react"
import {
    getSubsActionsBy, apiAddAction, apiSetCollapse,
    apiDeleteSub, apiCopySub
} from "../../service"
import { getSumCost, getDateAfterDaysString, getIcon } from "../../global"
import { ItemProvider, LoadingContext } from "../../global/Context"
import {
    addActions, deleteSubs, addSubs,
} from "../../global/ReduxStore/DataItem"
import { GoalItemView } from "./GoalView"
import { ActionViewEdit } from "./Action"
import { connect } from "react-redux"
import { showEdit, setItems } from "../../global/ReduxStore"
import { IsView } from "../../service/demoData"
import { DnDAction } from "../common/DnDAction"
import { logItem } from "../../global/GlobalLog"
import '../../styles/dragdrop.scss'

class Subgoal extends Component {
    static contextType = LoadingContext
    constructor(props) {
        super(props)
        this.state = {
            NewAction: null,
            IsExpand: true
        }
    }
    componentDidMount = () => {
        const { setLoading } = this.context
        const { item, addActions } = this.props
        setLoading(true)
        if (!Array.isArray(item.Actions)) {
            getSubsActionsBy('actions', { subid: item.Id }).then(actions => {
                const lstAction = []
                actions.forEach(a => {
                    a.IsDone = !!a.IsDone
                    lstAction.push(a)
                })
                addActions({
                    subid: item.Id,
                    actions: lstAction
                })
                setLoading(false)
            })
        } else {
            setLoading(false)
        }
    }

    addNewAction = () => {
        if (IsView) return
        const dateNow = Date.now()
        const { showEdit } = this.props
        showEdit(dateNow)
        this.setState({ NewAction: dateNow })
    }
    onInsertNewAction = (_item) => {
        const { setItems, showEdit, item, addActions } = this.props
        const dateNow = this.state.NewAction
        const subId = item.Id
        const ids = [dateNow, subId]
        let isAdd = true
        setItems({ ids, isAdd })
        _item.ParentId = subId

        delete _item.Id
        if (_item.Start && _item.Start.trim() === '') delete _item.Start
        if (typeof _item.Description !== 'string' ||
            _item.Description.trim() === '') {
            delete _item.Description
        }
        if (_item.End && _item.End.trim() === '') delete _item.End

        apiAddAction(_item).then(newId => {
            showEdit(dateNow)           // hide form
            this.setState({ NewAction: null })
            isAdd = false
            setItems({ ids, isAdd })

            if (!newId.includes('invalid')) {
                _item.Id = newId
                _item.IsExpand = true

                addActions({
                    subid: item.Id,
                    actions: [_item]
                })
            }
        })
    }
    onDeleteGoal = () => {
        const { item, setItems, deleteSubs } = this.props
        const id = item.Id
        const ids = [id, item.ParentId]
        setItems({ ids, isAdd: true })
        apiDeleteSub(id).then(() => {
            deleteSubs([id])
            setItems({ ids, isAdd: false })
        })
    }
    onCopySub = () => {
        const { item } = this.props
        const sub = JSON.parse(JSON.stringify(item))  // copy
        sub.Name = `${sub.Name} (1)`
        const { setLoading } = this.context;
        const { addSubs } = this.props
        setLoading(true)
        apiCopySub(sub.Id).then(newSub => {
            if (typeof newSub === 'object') {
                addSubs([newSub])
                setLoading(false)
            }
        })
    }
    getFormActionAddEdit = () => {
        const { isExpandMain } = this.props
        if (!isExpandMain) return <></>
        const { NewAction, IsExpand } = this.state
        if (!IsExpand) return <></>
        const { EditId, LoadingItems, item } = this.props
        const isAddNew = NewAction && EditId === NewAction
        const clsLoading = isAddNew && LoadingItems.includes(NewAction) ? 'fb-loading' : ''
        return <>{
            isAddNew ?
                <div className='dnb_item_view' >
                    <ItemProvider item={{
                        Id: NewAction, ParentId: item.Id,
                        Name: `Action ${Date.now()}`,
                        Start: getDateAfterDaysString(0), End: getDateAfterDaysString(1),
                        ExpectCost: 0, TrueCost: 0
                    }}>
                        <ActionViewEdit className={clsLoading} onSaveAction={this.onInsertNewAction} />
                    </ItemProvider>
                </div>
                :
                <div className='dnb_add_action dnb-btnadd' style={{ opacity: IsView ? '0.36' : undefined }}>
                    <div onClick={() => this.addNewAction()}>
                        <span className="bi bi-plus-circle-dotted"
                            style={{ cursor: 'pointer' }}>&nbsp; New {getIcon(3)}</span>
                    </div>
                </div>
        }</>
    }
    onExpandSub = (isExpand) => {
        const { item, isExpandMain } = this.props
        if (!isExpandMain) return
        this.setState({ IsExpand: isExpand })
        apiSetCollapse([item.Id], isExpand)
    }
    render() {
        const { item, isExpandMain, isDoneMain, index } = this.props
        const { IsExpand } = this.state
        const listAction = Array.isArray(item.Actions) ? item.Actions : []
        const isDoneSub = isDoneMain || item.IsDone;
        const isExpandSub = isExpandMain && IsExpand
        const contextSub = Object.assign(
            JSON.parse(JSON.stringify(item)),
            {
                TypeId: 2, IsExpand: isExpandSub,
                isDoneSub: isDoneSub,
                ExpectCost: getSumCost(listAction.map(a => a.ExpectCost)),
                TrueCost: getSumCost(listAction.map(a => a.TrueCost))
            })
        const handleCxt = {
            handleExpand: this.onExpandSub,
            handleDelete: this.onDeleteGoal,
            handleDuplicate: this.onCopySub,
            handleAddNewChild: this.addNewAction,
        }
        return (
            <div className={`dnb_item_view${!IsExpand ? ' dnb_sub_collapse' : ''}`}>
                <ItemProvider item={contextSub} handler={handleCxt}>
                    <GoalItemView />
                    <DnDAction index={index}
                        isExpand={isExpandSub}
                        isDoneMain={isDoneMain}>
                        {this.getFormActionAddEdit()}
                    </DnDAction>
                </ItemProvider>
            </div>
        )
    }
}
const mapState = (state) => ({
    EditId: state.focus.EditId,
    LoadingItems: state.loading.Items,
})
const mapDispatch = {
    showEdit, setItems,
    addActions,
    deleteSubs, addSubs
}
export const SubgoalConnect = connect(
    mapState, mapDispatch
)(Subgoal)