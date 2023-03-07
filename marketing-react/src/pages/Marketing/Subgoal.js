import React, { Component } from "react"
import {
    getDataGoalActionWith, insertAction, deleteAction
} from "../../service"
import { getExpC, getTrueC, getDateAfterDaysString } from "../../global"
import { GoalItemView } from "./GoalView"
import { ActionView, ActionViewEdit } from "./Action"
import { ItemContext } from "./Maingoal"

export class Subgoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ListAction: null,
            IsExpand: true, ExpectCost: 0, TrueCost: 0,
            NewAction: null
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
            this.setState({
                ListAction: lstAction,
                ExpectCost: getExpC(lstAction.map(s => s.ExpectCost)),
                TrueCost: getTrueC(lstAction.map(s => s.TrueCost))
            })
        })
    }
    componentDidUpdate = () => {
        const { ExpectCost, TrueCost } = this.state
        const { pushExpectCost, pushTrueCost, item } = this.props
        pushExpectCost(ExpectCost, item.Id)
        pushTrueCost(TrueCost, item.Id)
    }
    updateGoalUI = (newGoal) => {
        const { updateDataSubs } = this.props
        updateDataSubs(newGoal)
    }
    addNewAction = (sId) => {
        this.setState({ NewAction: { ParentId: sId } })
    }
    updateAction = (newAction) => {
        const lstAction = this.state.ListAction
        this.setState({ ExpectCost: getExpC(lstAction.map(s => s.ExpectCost)) })
        this.setState({ TrueCost: getTrueC(lstAction.map(s => s.TrueCost)) })
    }
    onCancelAddNewAction = (sId) => {
        this.setState({ NewAction: null })
    }
    onInsertNewAction = (item) => {
        if (item.Start.trim() === '') delete item.Start
        if (typeof item.Description !== 'string' || item.Description.trim() === '') {
            delete item.Description
        }
        if (item.End.trim() === '') delete item.End
        item.ParentId = this.props.item.Id
        insertAction(item).then(newId => {
            if (!newId.includes('invalid')) {
                item.Id = newId
                const lstAction = this.state.ListAction
                lstAction.push(item)
                this.setStateRelative(lstAction)
            }
            this.onCancelAddNewAction()
        })
    }
    onDeleteGoal = () => {
        const { item, onDeleteSub } = this.props
        onDeleteSub(item.Id)
    }
    onDeleteAction = (id) => {
        const lstAction = this.state.ListAction
        const _i = lstAction.map(a => a.Id).indexOf(id)
        if (_i > -1) {
            lstAction.splice(_i, 1) // remove
            this.setStateRelative(lstAction)
            deleteAction(id)
        }
    }
    setStateRelative = (lstAction) => {
        this.setState({ ListAction: lstAction })
        this.setState({ ExpectCost: getExpC(lstAction.map(s => s.ExpectCost)) })
        this.setState({ TrueCost: getTrueC(lstAction.map(s => s.TrueCost)) })
    }
    onDuplicateAction = (item) => {
        insertAction(item).then(newId => {
            if (!newId.includes('invalid')) {
                item.Id = newId
                const lstAction = this.state.ListAction
                lstAction.push(item)
                this.setStateRelative(lstAction)
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
        const { item, isExpandParent } = this.props
        if (!isExpandParent) return <></>
        const { NewAction, IsExpand } = this.state
        if (!IsExpand) return <></>
        return <>{!NewAction ? <div className='dnb_add_action'>
            <div onClick={() => this.addNewAction(item.Id)}>
                <span className="bi bi-plus-circle-dotted"
                    style={{ cursor: 'pointer' }}>&nbsp; New &#9632;</span>
            </div></div> :
            <div className='dnb_item_view'>
                <ItemContext.Provider value={{
                    Name: `Action ${Date.now()}`, Start: getDateAfterDaysString(0),
                    End: getDateAfterDaysString(1), ExpectCost: 0, TrueCost: 0
                }}>
                    <ActionViewEdit
                        onCloseEditForm={this.onCancelAddNewAction}
                        onSaveAction={this.onInsertNewAction}
                    />
                </ItemContext.Provider>
            </div>}</>
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
            TypeId: 2, ExpectCost: ExpectCost, TrueCost: TrueCost
        }, item)
        return (
            <div className={`dnb_item_view${!IsExpand ? ' dnb_sub_collapse' : ''}`}>
                <ItemContext.Provider value={valContext}>
                    <GoalItemView
                        updateGoalUI={this.updateGoalUI}
                        insertNewChild={this.addNewAction}
                        handlerDuplicate={this.handlerDuplicate} />
                </ItemContext.Provider>
                <div className='dnb_item_list_action'>{
                    !Array.isArray(ListAction) ? <span className="fb-loading"></span>
                        : <>{
                            ListAction.map(action => {
                                return <ActionView key={action.Id}
                                    item={action} isExpandParent={isExpandParent && IsExpand}
                                    onDeleteAction={this.onDeleteAction}
                                    onDuplicateAction={this.onDuplicateAction}
                                    updateAction={this.updateAction} />
                            })
                        }
                            {this.getFormActionAddEdit()}</>
                }
                </div>
            </div>
        )
    }
}
