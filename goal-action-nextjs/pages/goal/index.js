import { Component } from "react"
import { getDataGoalAction, getDataGoalActionWith } from "../../service"
import { getExpC, getTrueC } from "../../global"
import { GoalItem } from "./GoalItem"
import { ListAction } from "./ListAction"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from './style.module.scss'

export class ListMainProvider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ListMain: [],
            ListExpectCost: [], ListTrueCost: []    // [{Id, Value}]
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
    getExpectCost = (cost) => {
        if (!cost) return 0
        return typeof cost.Value == 'number' ? cost.Value : 0
    }
    getTrueCost = (cost) => {
        if (!cost) return 0
        return typeof cost.Value == 'number' ? cost.Value : 0
    }
    setExpectCostMain = (lstExp, id) => {
        setExpectCostState.call(this, lstExp, id)
    }
    setTrueCostMain = (lstTrue, id) => {
        setTrueCostState.call(this, lstTrue, id)
    }
    updateGoalUI = (newGoal) => {

    }
    render() {
        const { ListMain, ListExpectCost, ListTrueCost } = this.state
        return (
            <>
                {
                    ListMain.map(main => {
                        const { Id } = main
                        return <div className={style.dnb_item_view}>
                            <GoalItem key={Id}
                                item={main}
                                ExpCost={this.getExpectCost(ListExpectCost.find(l => l.Id == Id))}
                                TrueCost={this.getTrueCost(ListTrueCost.find(l => l.Id == Id))}
                                updateGoalUI={this.updateGoalUI} />
                            <ListSubgoal ParentId={Id}
                                setExpectCostMain={this.setExpectCostMain}
                                setTrueCostMain={this.setTrueCostMain} />
                        </div>
                    })
                }
                <style jsx global>{`body {font-size: 16px;} }`}</style>
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
        const { ParentId, setExpectCostMain, setTrueCostMain } = this.props
        getDataGoalActionWith('subs', { mainid: ParentId }).then(subs => {
            const lstSub = []
            subs.forEach(s => {
                s.IsDone = !!s.IsDone
                lstSub.push(s)
            })
            this.setState({ ListSub: lstSub })
            setExpectCostMain(lstSub.map(s => s.ExpectCost), ParentId)
            setTrueCostMain(lstSub.map(s => s.TrueCost), ParentId)
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
        const listExpectCost = setExpectCostState.call(this, lstExp, sId)
        const { ParentId, setExpectCostMain } = this.props
        setExpectCostMain(listExpectCost.map(s => s.Value), ParentId)
    }
    setTrueCostSub = (lstTrue, sId) => {
        const listTrueCost = setTrueCostState.call(this, lstTrue, sId)
        const { ParentId, setTrueCostMain } = this.props
        setTrueCostMain(listTrueCost.map(s => s.Value), ParentId)
    }
    updateGoalUI = (newGoal) => {
        const { ListSub } = this.state
        const _sub = ListSub.find(s => s.Id == newGoal.Id)
        if (_sub) {
            if (typeof newGoal.Name == 'string' &&
                newGoal.Name.trim() != '' && newGoal.Name != _sub.Name) {
                _sub.Name = newGoal.Name
            }
            if (typeof newGoal.Description == 'string' && newGoal.Description != _sub.Description) {
                _sub.Description = newGoal.Description
            }
            if (typeof newGoal.IsDone == 'boolean' && newGoal.IsDone != _sub.IsDone) {
                _sub.IsDone = newGoal.IsDone
            }
            if (typeof newGoal.Start == 'string' && newGoal.Start != _sub.Start) {
                _sub.Start = newGoal.Start
            }
            if (typeof newGoal.End == 'string' && newGoal.End != _sub.End) {
                _sub.End = newGoal.End
            }
            if (typeof newGoal.Budget == 'number' && newGoal.Budget != _sub.Budget) {
                _sub.Budget = newGoal.Budget
            }
        }

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
                                        updateGoalUI={this.updateGoalUI} />
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

function setExpectCostState(lstExp, id) {
    const listExpectCost = this.state.ListExpectCost
    const expC = getExpC(lstExp)
    const _i = listExpectCost.map(c => c.Id).indexOf(id)
    if (_i > -1) listExpectCost.splice(_i, 1)          // remove
    listExpectCost.push({ Id: id, Value: expC })   // add
    this.setState({ ListExpectCost: listExpectCost })
    return listExpectCost
}
function setTrueCostState(lstTrue, id) {
    const listTrueCost = this.state.ListTrueCost
    const trueC = getTrueC(lstTrue)
    const _i = listTrueCost.map(c => c.Id).indexOf(id)
    if (_i > -1) listTrueCost.splice(_i, 1)          // remove
    listTrueCost.push({ Id: id, Value: trueC })    // add
    this.setState({ ListTrueCost: listTrueCost })
    return listTrueCost
}