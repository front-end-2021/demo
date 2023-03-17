import React, { Component } from "react"
import {
    getDataGoalActionWith, apiInsertSub, apiDeleteSub, apiDuplicateSub
} from "../../service"
import { getExpC, getTrueC, getDateAfterDaysString } from "../../global"
import { GoalItemView, GoalItemEdit } from "./GoalView"
import { SubgoalConnect } from "./Subgoal"
import { connect } from "react-redux"
import { showEdit, setItems } from "../../global/ReduxStore"
import { logItem } from "../../global/GlobalLog"

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
    handleAddNewSub = () => {
        const dateNow = Date.now()
        const { showEdit } = this.props
        showEdit(dateNow)
        this.setState({ NewSub: dateNow })
    }
    onInsertNewSub = (sub) => {
        if (sub.Start.trim() === '') delete sub.Start
        if (typeof sub.Description !== 'string' || sub.Description.trim() === '') {
            delete sub.Description
        }
        if (sub.End.trim() === '') delete sub.End

        const { setItems, item } = this.props
        const dateNow = this.state.NewSub
        const mainId = item.Id
        const ids = [dateNow, mainId]
        let isAdd = true
        setItems({ ids, isAdd })
        this.setState({ NewSub: null })

        apiInsertSub(sub).then(newId => {
            isAdd = false
            setItems({ ids, isAdd })
            if (!newId.includes('invalid')) {
                sub.Id = newId
                const lstSub = this.state.ListSub
                lstSub.push(sub)
                this.setState({ ListSub: lstSub })
            }
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
        const lstSub = this.state.ListSub
        updateGoalUI.call(lstSub, newGoal)
        this.setState({ ListSub: lstSub })
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
    getButtonAddSub = () => {
        const { IsExpand } = this.state
        if (!IsExpand) return <></>
        return <div className='dnb_add_main'>
            <span className="bi bi-plus-circle-dotted"
                onClick={this.handleAddNewSub}
                style={{ cursor: 'pointer' }} >&nbsp; New &#9670;</span>
        </div>
    }
    getNewSubView = () => {
        const { NewSub, IsExpand } = this.state
        if (!IsExpand || !NewSub) return this.getButtonAddSub()
        const { EditId } = this.props
        const isAddNew = NewSub && EditId === NewSub
        if (!isAddNew) return this.getButtonAddSub()

        const { item } = this.props
        return <div className='dnb_item_view'>
            <ItemContext.Provider value={{
                TypeId: 2, Id: NewSub, ParentId: item.Id,
                Name: `Subgoal ${Date.now()}`, Start: getDateAfterDaysString(0),
                End: getDateAfterDaysString(1), Budget: 0,
            }}>
                <GoalItemEdit onSaveGoal={this.onInsertNewSub} />
            </ItemContext.Provider>
        </div>
    }
    render() {
        const { ListSub, ExpectCost, TrueCost, IsExpand } = this.state
        const { item, onDuplicateMain } = this.props
        const mainCxt = Object.assign(
            JSON.parse(JSON.stringify(item)),
            {
                IsExpand: IsExpand,
                handleExpand: this.onExpandMain,
                handleDelete: this.onDeleteGoal,
                handleAddNewChild: this.handleAddNewSub,
                handleDuplicate: onDuplicateMain,
                TypeId: 1, ExpectCost: ExpectCost, TrueCost: TrueCost
            })
        return (
            <div className={`dnb_item_view dnb_main_container${!IsExpand ? ` dnb_main_collapse` : ''}`}>
                <ItemContext.Provider value={mainCxt}>
                    <GoalItemView updateGoalUI={this.updateGoalUI} />
                </ItemContext.Provider>
                <div className='dnb_item_list_sub'>
                    {
                        !Array.isArray(ListSub) ? <div className="dnb_item_list_sub">
                            <div className="dnb_item_view">
                                <div className="dnb_item_container fb-loading"></div>
                                <div className="dnb_item_list_action"></div>
                            </div>
                        </div> : <>{ListSub.map(sub => {
                            return <SubgoalConnect key={sub.Id}
                                keyUpdate={sub.IsDone}
                                item={sub} isExpandMain={IsExpand}
                                updateDataSubs={this.updateDataSubs}
                                pushExpectCost={this.pushExpectCost}
                                onDeleteSub={this.onDeleteSub}
                                onDuplicateSubgoal={this.onDuplicateSubgoal}
                                pushTrueCost={this.pushTrueCost} />
                        })}
                        </>
                    }
                    {this.getNewSubView()}
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
export const MaingoalConnect = connect(
    mapState, mapDispatch
)(Maingoal)
export function updateGoalUI(newGoal) {
    const lstChild = this
    const _goal_ = lstChild.find(g => g.Id === newGoal.Id)
    if (_goal_) {
        if (typeof newGoal.Name === 'string' &&
            newGoal.Name.trim() !== '' && newGoal.Name !== _goal_.Name) {
            _goal_.Name = newGoal.Name
        }
        if (typeof newGoal.Description === 'string' &&
            newGoal.Description !== _goal_.Description) {
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