import { Component } from "react"
import {
    getDataGoalAction, getDataGoalActionWith,
    insertSub, insertAction
} from "../../service"
import { getExpC, getTrueC, getDateAfterDaysString } from "../../global"
import { FormEditGoal } from "./GoalItem"
import { GoalItem } from "./GoalItem"
import { Action, FormEditAction } from "../action"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from './style.module.scss'

export class ListMainProvider extends Component {
    constructor(props) {
        super(props)
        this.state = { ListMain: [] }
    }
    componentDidMount = () => {
        getDataGoalAction('mains').then(mains => {
            const lstMain = []
            mains.forEach(m => {
                m.IsDone = !!m.IsDone
                lstMain.push(m)
            })
            this.setState({ ListMain: lstMain })
        })
    }
    updateDataGoals = (newGoal) => {
        updateGoalUI.call(this.state.ListMain, newGoal)
    }
    render() {
        const { ListMain } = this.state
        return (
            <>
                {
                    ListMain.map(main => {
                        return <Maingoal item={main} key={main.Id}
                            updateDataGoals={this.updateDataGoals} />
                    })
                }
                <style jsx global>{`body {font-size: 16px;} }`}</style>
            </>
        )
    }
}
class Maingoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ListSub: [],
            ExpectCost: 0, TrueCost: 0,
            NewSub: null
        }
    }
    componentDidMount = () => {
        const { item } = this.props
        getDataGoalActionWith('subs', { mainid: item.Id }).then(subs => {
            const lstSub = []
            subs.forEach(s => {
                s.IsDone = !!s.IsDone
                lstSub.push(s)
            })
            this.setState({
                ListSub: lstSub,
                ExpectCost: getExpC([0]),
                TrueCost: getTrueC([0])
            })
        })
    }
    updateGoalUI = (newGoal) => {
        const { updateDataGoals } = this.props
        updateDataGoals(newGoal)
    }
    handleAddNewSub = (mId) => {
        this.setState({ NewSub: { ParentId: mId } })
    }
    onCancelAddNewSub = (mId) => {
        this.setState({ NewSub: null })
    }
    onInsertNewSub = (sub) => {
        if (sub.Start.trim() == '') delete sub.Start
        if (typeof sub.Description != 'string' || sub.Description.trim() == '') {
            delete sub.Description
        }
        if (sub.End.trim() == '') delete sub.End

        insertSub(sub).then(newId => {
            if (!newId.includes('invalid')) {
                sub.Id = newId
                const lstSub = this.state.ListSub
                lstSub.push(sub)
                this.setState({ ListSub: lstSub })
            }
            this.onCancelAddNewSub()
        })
    }
    pushExpectCost = (expectC, sId) => {
        const { ListSub, ExpectCost } = this.state
        const sub = ListSub.find(s => s.Id == sId)
        if (sub) {
            sub.ExpectCost = expectC
            const exp = getExpC(ListSub.map(s => s.ExpectCost))
            if (exp != ExpectCost) {
                this.setState({ ExpectCost: exp })
            }
        }
    }
    pushTrueCost = (trueC, sId) => {
        const { ListSub, TrueCost } = this.state
        const sub = ListSub.find(s => s.Id == sId)
        if (sub) {
            sub.TrueCost = trueC
            const _true = getTrueC(ListSub.map(s => s.TrueCost))
            if (_true != TrueCost) {
                this.setState({ TrueCost: _true })
            }
        }
    }
    updateDataSubs = (newGoal) => {
        updateGoalUI.call(this.state.ListSub, newGoal)
    }
    render() {
        const { NewSub, ListSub, ExpectCost, TrueCost } = this.state
        const { item } = this.props
        return (
            <div className={style.dnb_item_view}>
                <GoalItem
                    item={item}
                    ExpCost={ExpectCost}
                    TrueCost={TrueCost}
                    updateGoalUI={this.updateGoalUI}
                    addNewSub={this.handleAddNewSub} />
                <div className={style.dnb_item_list_sub}>
                    {
                        !NewSub ? <></> :
                            <div className={style.dnb_item_view}>
                                <FormEditGoal ParentId={item.Id}
                                    Name={`New Subgoal ${Date.now()}`}
                                    Start={getDateAfterDaysString(0)}
                                    End={getDateAfterDaysString(1)}
                                    Budget={0}
                                    onCloseEditForm={this.onCancelAddNewSub}
                                    onSaveGoal={this.onInsertNewSub}
                                />
                            </div>
                    }
                    {
                        ListSub.map(sub => {
                            return <Subgoal key={sub.Id}
                                item={sub}
                                updateDataSubs={this.updateDataSubs}
                                pushExpectCost={this.pushExpectCost}
                                pushTrueCost={this.pushTrueCost} />
                        })
                    }
                </div>
            </div>
        )
    }
}
class Subgoal extends Component {
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
            console.log(newId)
            if (!newId.includes('invalid')) {
                item.Id = newId
                const lstAction = this.state.ListAction
                lstAction.push(item)
                this.setState({ ListAction: lstAction })
            }
            this.onCancelAddNewAction()
        })
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
                    addNewAction={this.addNewAction} />
                <div className={style.dnb_item_list_action}>
                    {
                        !NewAction ? <></> :
                            <div className={style.dnb_item_view}>
                                <FormEditAction
                                    Name={`New Action ${Date.now()}`}
                                    Start={getDateAfterDaysString(0)}
                                    End={getDateAfterDaysString(1)}
                                    ExpCost={0} TrueCost={0}
                                    onCloseEditForm={this.onCancelAddNewAction}
                                    onSaveAction={this.onInsertNewAction}
                                />
                            </div>
                    }
                    {
                        ListAction.map(action => {
                            return <Action key={action.Id}
                                item={action}
                                updateAction={this.updateAction} />
                        })
                    }
                </div>
            </div>
        )
    }
}

function updateGoalUI(newGoal) {
    const listMainSub = this
    const _goal_ = listMainSub.find(g => g.Id == newGoal.Id)
    if (_goal_) {
        if (typeof newGoal.Name == 'string' &&
            newGoal.Name.trim() != '' && newGoal.Name != _goal_.Name) {
            _goal_.Name = newGoal.Name
        }
        if (typeof newGoal.Description == 'string' && newGoal.Description != _goal_.Description) {
            _goal_.Description = newGoal.Description
        }
        if (typeof newGoal.IsDone == 'boolean' && newGoal.IsDone != _goal_.IsDone) {
            _goal_.IsDone = newGoal.IsDone
        }
        if (typeof newGoal.Start == 'string' && newGoal.Start != _goal_.Start) {
            _goal_.Start = newGoal.Start
        }
        if (typeof newGoal.End == 'string' && newGoal.End != _goal_.End) {
            _goal_.End = newGoal.End
        }
        if (typeof newGoal.Budget == 'number' && newGoal.Budget != _goal_.Budget) {
            _goal_.Budget = newGoal.Budget
        }
    }
}