import { Component } from "react"
import {
    getDataGoalActionWith, insertAction, deleteAction
} from "../../service"
import { getExpC, getTrueC, getDateAfterDaysString } from "../../global"
import { GoalItem } from "./GoalItem"
import { Action, FormEditAction } from "../action"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from './style.module.scss'

export class Subgoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ListAction: [],
            ExpectCost: 0, TrueCost: 0,
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
        const _action = lstAction.find(a => a.Id == newAction.Id)
        if (_action) {
            let hasExpectCost = false, hasTrueCost = false
            if (typeof newAction.Name == 'string' &&
                newAction.Name.trim() != '' && _action.Name != newAction.Name) {
                _action.Name = newAction.Name
            }
            if (typeof newAction.Description == 'string' &&
                _action.Description != newAction.Description) {
                _action.Description = newAction.Description
            }
            if (typeof newAction.IsDone == 'boolean' && _action.IsDone != newAction.IsDone) {
                _action.IsDone = newAction.IsDone
            }
            if (typeof newAction.Start == 'string' && _action.Start != newAction.Start)
                _action.Start = newAction.Start
            if (typeof newAction.End == 'string' && _action.End != newAction.End) {
                _action.End = newAction.End
            }
            if (typeof newAction.ExpectCost == 'number' &&
                _action.ExpectCost != newAction.ExpectCost) {
                _action.ExpectCost = newAction.ExpectCost
                hasExpectCost = true
            }
            if (typeof newAction.TrueCost == 'number' && _action.TrueCost != newAction.TrueCost) {
                _action.TrueCost = newAction.TrueCost
                hasTrueCost = true
            }
            this.setState({ ListAction: lstAction })
            if (hasExpectCost) {
                this.setState({ ExpectCost: getExpC(lstAction.map(s => s.ExpectCost)) })
            }
            if (hasTrueCost) {
                this.setState({ TrueCost: getTrueC(lstAction.map(s => s.TrueCost)) })
            }
        }
    }
    onCancelAddNewAction = (sId) => {
        this.setState({ NewAction: null })
    }
    onInsertNewAction = (item) => {
        if (item.Start.trim() == '') delete item.Start
        if (typeof item.Description != 'string' || item.Description.trim() == '') {
            delete item.Description
        }
        if (item.End.trim() == '') delete item.End
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
        console.log(`on delete action`, id)
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
        delete _item.Id
        _item.Name = `${_item.Name} (1)`
        onDuplicateSubgoal(_item)
    }
    render() {
        const { item } = this.props
        const { ListAction, ExpectCost, TrueCost, NewAction } = this.state
        return (
            <div className={style.dnb_item_view}>
                <GoalItem
                    item={item}
                    ExpCost={ExpectCost}
                    TrueCost={TrueCost}
                    updateGoalUI={this.updateGoalUI}
                    insertNewChild={this.addNewAction}
                    onDeleteGoal={this.onDeleteGoal}
                    handlerDuplicate={this.handlerDuplicate} />
                <div className={style.dnb_item_list_action}>
                    {
                        ListAction.map(action => {
                            return <Action key={action.Id}
                                item={action}
                                onDeleteAction={this.onDeleteAction}
                                onDuplicateAction={this.onDuplicateAction}
                                updateAction={this.updateAction} />
                        })
                    }
                    {
                        !NewAction ? <div className={style.dnb_add_action}>
                            <div onClick={() => this.addNewAction(item.Id)}>
                                <span className="bi bi-plus-circle-dotted"
                                    style={{ cursor: 'pointer' }}>&nbsp; New &#9632;</span>
                            </div></div> :
                            <div className={style.dnb_item_view}>
                                <FormEditAction
                                    Name={`Action ${Date.now()}`}
                                    Start={getDateAfterDaysString(0)}
                                    End={getDateAfterDaysString(1)}
                                    ExpCost={0} TrueCost={0}
                                    onCloseEditForm={this.onCancelAddNewAction}
                                    onSaveAction={this.onInsertNewAction}
                                />
                            </div>
                    }
                </div>
            </div>
        )
    }
}