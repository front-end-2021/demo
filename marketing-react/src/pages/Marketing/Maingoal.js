import React, { Component } from "react"
import {
    getDataGoalActionWith, apiInsertSub, apiDeleteSub, apiDuplicateSub
} from "../../service"
import { getExpC, getTrueC, getDateAfterDaysString } from "../../global"
import { GoalItemView, GoalItemEdit } from "./GoalView"
import { SubgoalConnect } from "./Subgoal"

export const ItemContext = React.createContext()
export class Maingoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ListSub: null, NewSub: null,
            IsExpand: true, ExpectCost: 0, TrueCost: 0,
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
        if (sub.Start.trim() === '') delete sub.Start
        if (typeof sub.Description !== 'string' || sub.Description.trim() === '') {
            delete sub.Description
        }
        if (sub.End.trim() === '') delete sub.End

        apiInsertSub(sub).then(newId => {
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
        const sub = ListSub.find(s => s.Id === sId)
        if (sub) {
            sub.ExpectCost = expectC
            const exp = getExpC(ListSub.map(s => s.ExpectCost))
            if (exp !== ExpectCost) {
                this.setState({ ExpectCost: exp })
            }
        }
    }
    pushTrueCost = (trueC, sId) => {
        const { ListSub, TrueCost } = this.state
        const sub = ListSub.find(s => s.Id === sId)
        if (sub) {
            sub.TrueCost = trueC
            const _true = getTrueC(ListSub.map(s => s.TrueCost))
            if (_true !== TrueCost) {
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
    onDeleteSub = (item) => {
        const id = item.Id
        const lstSub = this.state.ListSub
        return apiDeleteSub(id).then(() => {
            const _i = lstSub.map(s => s.Id).indexOf(id)
            if (_i > -1) {
                lstSub.splice(_i, 1)    // remove
                this.setState({ ListSub: lstSub })
                const exp = getExpC(lstSub.map(s => s.ExpectCost))
                if (exp !== this.state.ExpectCost) {
                    this.setState({ ExpectCost: exp })
                }
                const _true = getTrueC(lstSub.map(s => s.TrueCost))
                if (_true !== this.state.TrueCost) {
                    this.setState({ TrueCost: _true })
                }
            }
            return [id, item.ParentId]
        })
    }
    onDuplicateSubgoal = (sub) => {
        const { setLoading } = this.props
        setLoading(true)
        apiDuplicateSub(sub.Id).then(newSub => {
            if (typeof newSub === 'object') {
                const lstSub = this.state.ListSub
                lstSub.push(newSub)
                this.setState({ ListSub: lstSub })
                setLoading(false)
            }
        })
    }
    onExpandMain = (isExpand) => {
        this.setState({ IsExpand: isExpand })
    }
    render() {
        const { NewSub, ListSub, ExpectCost, TrueCost, IsExpand } = this.state
        const { item, onDuplicateMain } = this.props
        const mainCxt = Object.assign({
            IsExpand: IsExpand,
            handleExpand: this.onExpandMain,
            handleDelete: this.onDeleteGoal,
            handleDuplicate: onDuplicateMain,
            TypeId: 1, ExpectCost: ExpectCost, TrueCost: TrueCost
        }, item)
        return (
            <div className={`dnb_item_view dnb_main_container${!IsExpand ? ` dnb_main_collapse` : ''}`}>
                <ItemContext.Provider value={mainCxt}>
                    <GoalItemView
                        updateGoalUI={this.updateGoalUI}
                        insertNewChild={this.handleAddNewSub} />
                </ItemContext.Provider>
                <div className='dnb_item_list_sub'>
                    {
                        !IsExpand || !NewSub ? <></> : <div className='dnb_item_view'>
                            <ItemContext.Provider value={{
                                Name: `Subgoal ${Date.now()}`, Start: getDateAfterDaysString(0),
                                End: getDateAfterDaysString(1), Budget: 0, ParentId: item.Id
                            }}>
                                <GoalItemEdit
                                    onCloseEditForm={this.onCancelAddNewSub}
                                    onSaveGoal={this.onInsertNewSub}
                                />
                            </ItemContext.Provider>
                        </div>
                    }
                    {
                        !Array.isArray(ListSub) ? <div className="dnb_item_list_sub">
                            <div className="dnb_item_view">
                                <div className="dnb_item_container fb-loading"></div>
                                <div className="dnb_item_list_action"></div>
                            </div>
                        </div> : <>{ListSub.map(sub => {
                            return <SubgoalConnect key={sub.Id}
                                item={sub} isExpandParent={IsExpand}
                                updateDataSubs={this.updateDataSubs}
                                pushExpectCost={this.pushExpectCost}
                                onDeleteSub={this.onDeleteSub}
                                onDuplicateSubgoal={this.onDuplicateSubgoal}
                                pushTrueCost={this.pushTrueCost} />
                        })}
                        </>
                    }
                </div>
            </div>
        )
    }
}

export function updateGoalUI(newGoal) {
    const lstChild = this
    const _goal_ = lstChild.find(g => g.Id === newGoal.Id)
    if (_goal_) {
        if (typeof newGoal.Name === 'string' &&
            newGoal.Name.trim() !== '' && newGoal.Name !== _goal_.Name) {
            _goal_.Name = newGoal.Name
        }
        if (typeof newGoal.Description === 'string' && newGoal.Description !== _goal_.Description) {
            _goal_.Description = newGoal.Description
        }
        if (typeof newGoal.IsDone === 'boolean' && newGoal.IsDone !== _goal_.IsDone) {
            _goal_.IsDone = newGoal.IsDone
        }
        if (typeof newGoal.Start === 'string' && newGoal.Start !== _goal_.Start) {
            _goal_.Start = newGoal.Start
        }
        if (typeof newGoal.End === 'string' && newGoal.End !== _goal_.End) {
            _goal_.End = newGoal.End
        }
        if (typeof newGoal.Budget === 'number' && newGoal.Budget !== _goal_.Budget) {
            _goal_.Budget = newGoal.Budget
        }
    }
}