import { Component } from "react"
import {
    getDataGoalAction, getDataGoalActionWith,
    insertSub, deleteSubApi,
    insertMain, deleteMainApi
} from "../../service"
import { getExpC, getTrueC, getDateAfterDaysString } from "../../global"
import { FormEditGoal } from "./GoalItem"
import { GoalItem } from "./GoalItem"
import { Subgoal } from "./Subgoal"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from '../../styles/ga.module.scss'

export class ListMainProvider extends Component {
    constructor(props) {
        super(props)
        this.state = { ListMain: [], NewMain: false }
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
    onDeleteMain = (id) => {
        const lstMain = this.state.ListMain
        deleteMainApi(id).then(res => {
            const _i = lstMain.map(m => m.Id).indexOf(id)
            if (_i > -1) {
                lstMain.splice(_i, 1)       // remove
                this.setState({ ListMain: lstMain })
            }
        })
    }
    onCancelAddNewMain = () => {
        this.setState({ NewMain: false })
    }
    onInsertNewMain = (goal) => {
        if (goal.Start.trim() == '') delete goal.Start
        if (typeof goal.Description != 'string' || goal.Description.trim() == '') {
            delete goal.Description
        }
        if (goal.End.trim() == '') delete goal.End

        insertMain(goal).then(newId => {
            if (!newId.includes('invalid')) {
                goal.Id = newId
                const lstMain = this.state.ListMain
                lstMain.push(goal)
                this.setState({ ListMain: lstMain })
            }
            this.onCancelAddNewMain()
        })
    }
    render() {
        const { ListMain, NewMain } = this.state
        return (
            <>
                {
                    ListMain.map(main => {
                        return <Maingoal item={main} key={main.Id}
                            onDeleteMain={this.onDeleteMain}
                            updateDataGoals={this.updateDataGoals} />
                    })
                }
                <style jsx global>{`body {font-size: 16px;background-color:#eeeeeefa;} }`}</style>
                {
                    !NewMain ? <div className={style.dnb_add_main}>
                        <span className="bi bi-plus-circle-dotted"
                            onClick={() => this.setState({ NewMain: true })}
                            style={{ cursor: 'pointer' }} >&nbsp; New &#9673;</span>
                    </div> :
                        <div className={style.dnb_item_view}>
                            <FormEditGoal
                                Name={`Main goal ${Date.now()}`}
                                Start={getDateAfterDaysString(0)}
                                End={getDateAfterDaysString(1)}
                                Budget={0}
                                onCloseEditForm={this.onCancelAddNewMain}
                                onSaveGoal={this.onInsertNewMain}
                            />
                        </div>
                }
            </>
        )
    }
}
class Maingoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ListSub: [], IsExpand: true,
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
    onDeleteGoal = () => {
        const { item, onDeleteMain } = this.props
        onDeleteMain(item.Id)
    }
    onDeleteSub = (id) => {
        const lstSub = this.state.ListSub
        console.log(`on delete sub`, id)
        deleteSubApi(id).then(() => {
            const _i = lstSub.map(s => s.Id).indexOf(id)
            if (_i > -1) {
                lstSub.splice(_i, 1)    // remove
                this.setState({ ListSub: lstSub })
                const exp = getExpC(lstSub.map(s => s.ExpectCost))
                if (exp != this.state.ExpectCost) {
                    this.setState({ ExpectCost: exp })
                }
                const _true = getTrueC(lstSub.map(s => s.TrueCost))
                if (_true != this.state.TrueCost) {
                    this.setState({ TrueCost: _true })
                }
            }
        })
    }
    onDuplicateSubgoal = (sub) => {
        insertSub(sub).then(newId => {
            if (!newId.includes('invalid')) {
                sub.Id = newId
                const lstSub = this.state.ListSub
                lstSub.push(sub)
                this.setState({ ListSub: lstSub })
            }
        })
    }
    handleExpand = (isExpand) => {
        this.setState({ IsExpand: isExpand })
    }
    render() {
        const { NewSub, ListSub, ExpectCost, TrueCost, IsExpand } = this.state
        const { item } = this.props
        return (
            <div className={`${style.dnb_item_view} ${style.dnb_main_container}${!IsExpand ? ` ${style.dnb_main_collapse}` : ''}`}>
                <GoalItem
                    item={item}
                    ExpCost={ExpectCost} TrueCost={TrueCost}
                    handleExpand={this.handleExpand} isExpand={IsExpand}
                    updateGoalUI={this.updateGoalUI}
                    insertNewChild={this.handleAddNewSub}
                    onDeleteGoal={this.onDeleteGoal} />
                <div className={style.dnb_item_list_sub}>
                    {
                        !IsExpand || !NewSub ? <></> :
                            <div className={style.dnb_item_view}>
                                <FormEditGoal ParentId={item.Id}
                                    Name={`Subgoal ${Date.now()}`}
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
                                item={sub} isExpandMain={IsExpand}
                                updateDataSubs={this.updateDataSubs}
                                pushExpectCost={this.pushExpectCost}
                                onDeleteSub={this.onDeleteSub}
                                onDuplicateSubgoal={this.onDuplicateSubgoal}
                                pushTrueCost={this.pushTrueCost} />
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