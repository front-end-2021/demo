import {
    StrictMode,
    Component, useState,
    createContext, useContext
} from "react"
import { ListDataContext } from "."
import { getDataGoalAction, getDataGoalActionWith } from "../../service"
import {
    getExpC, getTrueC, getTrueCost,
    getExpectedCost, getDateString
} from "../../global"
import { GoalItem } from "./GoalItem"
import { Action } from "../action/ActionItem"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from './style.module.scss'

export class ListMainProvider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ListMain: [], ListCost: []    // [{Id, ExpectC, TrueC}]
        }
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
    getExpectCost = (mId) => {
        const { ListCost } = this.state
        const cost = ListCost.find(c => c.Id == mId)
        if (!cost) return 0
        return typeof cost.ExpectC == 'number' ? cost.ExpectC : 0
    }
    getTrueCost = (mId) => {
        const { ListCost } = this.state
        const cost = ListCost.find(c => c.Id == mId)
        if (!cost) return 0
        return typeof cost.TrueC == 'number' ? cost.TrueC : 0
    }
    setGoalDone = ({ Id, IsDone }) => {
        const { ListMain } = this.state
        const m = ListMain.find(_m => _m.Id == Id)
        if (m) {
            m.IsDone = IsDone
            const i = ListMain.map(_m => _m.Id).indexOf(Id)
            ListMain.splice(i, 1, m)
        }
    }
    render() {
        const { ListMain } = this.state
        return (
            <>
                {
                    ListMain.map(main => {
                        const { Id } = main
                        return <div className={style.dnb_item_view}>
                            <GoalItem key={Id}
                                item={main}
                                ExpCost={this.getExpectCost(Id)}
                                TrueCost={this.getTrueCost(Id)}
                                setGoalDone={this.setGoalDone} />
                            <ListSubgoal ParentId={Id} />
                        </div>
                    })
                }
                <style jsx global>{`body {font-size: 16px;}
              .bi-layout-sidebar::before {transform: rotate(-90deg);}}`}</style>
            </>
        )
    }
}
class ListSubgoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ListSub: [],
            ListExpectCost: [], ListTrueCost: []    // [{Id, Value}]
        }
    }
    componentDidMount = () => {
        const { ParentId } = this.props
        getDataGoalActionWith('subs', { mainid: ParentId }).then(subs => {
            const lstSub = []
            subs.forEach(s => {
                s.IsDone = !!s.IsDone
                lstSub.push(s)
            })
            this.setState({ ListSub: lstSub })
        })
    }
    getExpectCost = (cost) => {
        if (!cost) return 0
        return typeof cost.Value == 'number' ? cost.Value : 0
    }
    getTrueCost = (cost) => {
        if (!cost) return 0
        return typeof cost.Value == 'number' ? cost.Value : 0
    }
    setExpectCostSub = (lstExp, sId) => {
        const listExpectCost = this.state.ListExpectCost
        const expC = getExpC(lstExp)
        const _i = listExpectCost.map(c => c.Id).indexOf(sId)
        if (_i > -1) listExpectCost.splice(_i, 1)          // remove
        listExpectCost.push({ Id: sId, Value: expC })   // add
        this.setState({ ListExpectCost: listExpectCost })
    }
    setTrueCostSub = (lstTrue, sId) => {
        const listTrueCost = this.state.ListTrueCost
        const trueC = getTrueC(lstTrue)
        const _i = listTrueCost.map(c => c.Id).indexOf(sId)
        if (_i > -1) listTrueCost.splice(_i, 1)          // remove
        listTrueCost.push({ Id: sId, Value: trueC })    // add
        this.setState({ ListTrueCost: listTrueCost })
    }
    updateGoal = (newGoal) => {

    }
    render() {
        const { ListSub, ListExpectCost, ListTrueCost } = this.state
        return (
            <>
                <div className={style.dnb_item_list_sub}>
                    <div className={style.dnb_item_view}>
                        {
                            ListSub.map(sub => {
                                const { Id } = sub
                                return <>
                                    <GoalItem key={Id}
                                        item={sub}
                                        ExpCost={this.getExpectCost(ListExpectCost.find(l => l.Id == Id))}
                                        TrueCost={this.getTrueCost(ListTrueCost.find(l => l.Id == Id))}
                                        updateGoal={this.updateGoal} />
                                    <ListAction ParentId={Id}
                                        setExpectCostSub={this.setExpectCostSub}
                                        setTrueCostSub={this.setTrueCostSub} />
                                </>
                            })
                        }
                    </div>
                </div>
            </>
        )
    }
}
class ListAction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ListAction: [],
            ListCost: []    // [{Id, ExpectC, TrueC}]
        }
    }
    componentDidMount = () => {
        const { ParentId, setExpectCostSub, setTrueCostSub } = this.props
        getDataGoalActionWith('actions', { subid: ParentId }).then(actions => {
            const lstAction = []
            actions.forEach(a => {
                a.IsDone = !!a.IsDone
                lstAction.push(a)
            })
            this.setState({ ListAction: lstAction })
            setExpectCostSub(lstAction.map(a => a.ExpectCost), ParentId)
            setTrueCostSub(lstAction.map(a => a.TrueCost), ParentId)
        })
    }
    updateAction = (newAction) => {
        const { ListAction } = this.state
        const _action = ListAction.find(a => a.Id == newAction.Id)
        if (_action) {
            if (typeof newAction.Name == 'string' && _action.Name != newAction.Name)
                _action.Name = newAction.Name
            if (typeof newAction.Description == 'string' && _action.Description != newAction.Description)
                _action.Description = newAction.Description
            if (typeof newAction.IsDone == 'boolean' && _action.IsDone != newAction.IsDone)
                _action.IsDone = newAction.IsDone
            if (typeof newAction.Start == 'string' && _action.Start != newAction.Start)
                _action.Start = newAction.Start
            if (typeof newAction.End == 'string' && _action.End != newAction.End)
                _action.End = newAction.End
            if (typeof newAction.ExpectCost == 'number' && _action.ExpectCost != newAction.ExpectCost)
                _action.ExpectCost = newAction.ExpectCost
            if (typeof newAction.TrueCost == 'number' && _action.TrueCost != newAction.TrueCost)
                _action.TrueCost = newAction.TrueCost

        }
        const { ParentId, setExpectCostSub, setTrueCostSub } = this.props
        setExpectCostSub(ListAction.map(a => a.ExpectCost), ParentId)
        setTrueCostSub(ListAction.map(a => a.TrueCost), ParentId)
    }
    setActionDone = (aId, isDone) => {
        const { ListAction } = this.state
        const _action = ListAction.find(a => a.Id == aId)
        if (_action) _action.IsDone = isDone
    }
    render() {
        const { ListAction } = this.state
        return (
            <div className={style.dnb_item_list_action}>
                {
                    ListAction.map(action => {
                        const { Id } = action
                        return <Action key={Id}
                            item={action}
                            updateAction={this.updateAction} />
                    })
                }
            </div>
        )
    }
}