import React, { Component } from "react"
import {
    getDataGoalActionWith, apiInsertAction, apiDeleteAction
} from "../../service"
import { getExpC, getTrueC, getDateAfterDaysString } from "../../global"
import { GoalItemView } from "./GoalView"
import { ActionView, ActionViewEdit } from "./Action"
import { ItemContext } from "./Maingoal"
import { connect } from "react-redux"
import { showEdit, setItems } from "../../global/ReduxStore"

class Subgoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ListAction: null, NewAction: null,
            IsExpand: true, ExpectCost: 0, TrueCost: 0,
        }
    }
    componentDidMount = () => {
        const { item } = this.props
        getDataGoalActionWith('actions', { subid: item.Id }).then(actions => {
            const lstAction = []
            actions.forEach(a => {
                a.IsDone = !!a.IsDone
                lstAction.push(a)
            })
            const expC = getExpC(lstAction.map(s => s.ExpectCost))
            const trueC = getTrueC(lstAction.map(s => s.TrueCost))
            this.setState({
                ListAction: lstAction,
                ExpectCost: expC, TrueCost: trueC
            })
            const { pushTrueCost, pushExpectCost, item } = this.props
            pushExpectCost(expC, item.Id)
            pushTrueCost(trueC, item.Id)
        })
    }
    updateGoalUI = (newGoal) => {
        const { updateDataSubs } = this.props
        updateDataSubs(newGoal)
    }
    addNewAction = (dateNow) => {
        const { showEdit } = this.props
        showEdit(dateNow)
        this.setState({ NewAction: dateNow })
    }
    pushUpdateAction = ({ isChangeExpect, isChangeTrue }) => {
        const lstAction = this.state.ListAction
        if (isChangeExpect) {
            const exp = getExpC(lstAction.map(s => s.ExpectCost))
            this.setState({ ExpectCost: exp })
            const { pushExpectCost, item } = this.props
            pushExpectCost(exp, item.Id)
        }
        if (isChangeTrue) {
            const trueC = getTrueC(lstAction.map(s => s.TrueCost))
            this.setState({ TrueCost: trueC })
            const { pushTrueCost, item } = this.props
            pushTrueCost(trueC, item.Id)
        }
    }
    onInsertNewAction = (_item) => {
        const { setItems, showEdit, item } = this.props
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

        apiInsertAction(_item).then(newId => {
            showEdit(dateNow)
            this.setState({ NewAction: null })
            isAdd = false
            setItems({ ids, isAdd })

            if (!newId.includes('invalid')) {
                _item.Id = newId
                const lstAction = this.state.ListAction
                lstAction.push(_item)
                this.onChangeState(lstAction, _item.ExpectCost > 0, _item.TrueCost > 0)
            }
        })
    }
    onChangeState = (lstAction, isChangeExpect, isChangeTrue) => {
        this.setState({ ListAction: lstAction })
        this.pushUpdateAction({ isChangeExpect, isChangeTrue })
    }
    onDeleteGoal = () => {
        const { item, onDeleteSub } = this.props
        onDeleteSub(item.Id)
    }
    onDeleteAction = (action) => {
        const lstAction = this.state.ListAction
        const _i = lstAction.map(a => a.Id).indexOf(action.Id)
        if (_i > -1) {
            apiDeleteAction(action.Id)
            lstAction.splice(_i, 1) // remove
            this.onChangeState(lstAction, action.ExpectCost > 0, action.TrueCost > 0)
        }
    }
    onDuplicateAction = (item) => {
        const { setItems } = this.props
        const ids = [item.Id, item.ParentId]
        const isAdd = false
        apiInsertAction(item).then(newId => {
            setItems({ ids, isAdd })
            if (!newId.includes('invalid')) {
                item.Id = newId
                const lstAction = this.state.ListAction
                lstAction.push(item)
                this.onChangeState(lstAction, item.ExpectCost > 0, item.TrueCost > 0)
            }
        })
    }
    handlerDuplicate = () => {
        const { item, onDuplicateSubgoal } = this.props
        const _item = JSON.parse(JSON.stringify(item))  // copy
        _item.Name = `${_item.Name} (1)`
        onDuplicateSubgoal(_item)
    }
    getFormActionAddEdit = () => {
        const { isExpandParent, EditId, LoadingItems } = this.props
        if (!isExpandParent) return <></>
        const { NewAction, IsExpand } = this.state
        if (!IsExpand) return <></>
        const isAddNew = NewAction && EditId === NewAction
        const clsLoading = isAddNew && LoadingItems.includes(NewAction) ? 'fb-loading' : ''
        return <>{
            isAddNew ?
                <div className='dnb_item_view' >
                    <ItemContext.Provider value={{
                        Id: NewAction,
                        Name: `Action ${Date.now()}`, Start: getDateAfterDaysString(0),
                        End: getDateAfterDaysString(1), ExpectCost: 0, TrueCost: 0
                    }}>
                        <ActionViewEdit className={clsLoading}
                            onSaveAction={this.onInsertNewAction} />
                    </ItemContext.Provider>
                </div>
                :
                <div className='dnb_add_action'>
                    <div onClick={() => this.addNewAction(Date.now())}>
                        <span className="bi bi-plus-circle-dotted"
                            style={{ cursor: 'pointer' }}>&nbsp; New &#9632;</span>
                    </div>
                </div>
        }</>
    }
    onExpandSub = (isExpand) => {
        if (!this.props.isExpandParent) return
        this.setState({ IsExpand: isExpand })
    }
    render() {
        const { item, isExpandParent } = this.props
        const { ListAction, ExpectCost, TrueCost, IsExpand } = this.state
        const valContext = Object.assign({
            IsExpand: isExpandParent && IsExpand,
            handleExpand: this.onExpandSub,
            handleDelete: this.onDeleteGoal,
            handleDuplicate: this.handlerDuplicate,
            TypeId: 2, ExpectCost: ExpectCost, TrueCost: TrueCost
        }, item)
        return (
            <div className={`dnb_item_view${!IsExpand ? ' dnb_sub_collapse' : ''}`}>
                <ItemContext.Provider value={valContext}>
                    <GoalItemView
                        updateGoalUI={this.updateGoalUI}
                        insertNewChild={() => this.addNewAction(Date.now())} />
                </ItemContext.Provider>
                <div className='dnb_item_list_action'>{
                    !Array.isArray(ListAction) ? <span className="fb-loading"></span>
                        : <>{
                            ListAction.map(action => {
                                return <ActionView key={action.Id}
                                    item={action} isExpandParent={isExpandParent && IsExpand}
                                    onDeleteAction={this.onDeleteAction}
                                    onDuplicateAction={this.onDuplicateAction}
                                    pushUpdateAction={this.pushUpdateAction} />
                            })
                        }
                            {this.getFormActionAddEdit()}</>
                }
                </div>
            </div>
        )
    }
}
const mapState = (state) => ({
    EditId: state.focus.EditId,
    LoadingItems: state.loading.Items
})
const mapDispatch = {
    showEdit, setItems
}
export const SubgoalConnect = connect(
    mapState, mapDispatch
)(Subgoal)