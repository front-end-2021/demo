import React, { Component } from "react"
import {
    getDataGoalActionWith, apiInsertAction, apiDeleteAction
} from "../../service"
import { getExpC, getTrueC, getDateAfterDaysString } from "../../global"
import { GoalItemView } from "./GoalView"
import { ActionView, ActionViewEdit } from "./Action"
import { ItemContext } from "./Maingoal"

export class Subgoal extends Component {
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
    addNewAction = (sId) => {
        this.setState({ NewAction: { ParentId: sId } })
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
        apiInsertAction(item).then(newId => {
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
            apiDeleteAction(id)
        }
    }
    setStateRelative = (lstAction) => {
        this.setState({ ListAction: lstAction })
        this.setState({ ExpectCost: getExpC(lstAction.map(s => s.ExpectCost)) })
        this.setState({ TrueCost: getTrueC(lstAction.map(s => s.TrueCost)) })
    }
    onDuplicateAction = (item) => {
        apiInsertAction(item).then(newId => {
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
            handleDuplicate: this.handlerDuplicate,
            TypeId: 2, ExpectCost: ExpectCost, TrueCost: TrueCost
        }, item)
        return (
            <div className={`dnb_item_view${!IsExpand ? ' dnb_sub_collapse' : ''}`}>
                <ItemContext.Provider value={valContext}>
                    <GoalItemView
                        updateGoalUI={this.updateGoalUI}
                        insertNewChild={this.addNewAction} />
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
