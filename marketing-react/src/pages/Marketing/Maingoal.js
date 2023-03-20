import React, { Component } from "react"
import {
    getDataGoalActionWith, apiInsertSub, apiDeleteSub, apiDuplicateSub
} from "../../service"
import { getExpC, getTrueC, getDateAfterDaysString } from "../../global"
import { GoalItemView, GoalItemEdit } from "./GoalView"
import { SubgoalConnect } from "./Subgoal"
import { connect } from "react-redux"
import { showEdit, setItems } from "../../global/ReduxStore"
import { removeSubs, addSubs, addMains } from "../../global/ReduxStore/DataItem"
import { logItem } from "../../global/GlobalLog"

export const ItemContext = React.createContext()
export class Maingoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            NewSub: null,
            IsExpand: true, ExpectCost: 0, TrueCost: 0,
        }
    }
    componentDidMount = () => {
        const { item, addSubs } = this.props
        getDataGoalActionWith('subs', { mainid: item.Id }).then(subs => {
            const lstSub = []
            subs.forEach(s => {
                s.IsDone = !!s.IsDone
                lstSub.push(s)
            })
            addSubs({mainId: item.Id, lstSub})
            this.setState({
                ExpectCost: getExpC([0]),
                TrueCost: getTrueC([0])
            })
        })
    }
    updateGoalUI = (newGoal) => {
        const { addMains } = this.props
        addMains(newGoal)
    }
    handleAddNewSub = () => {
        const dateNow = Date.now()
        this.props.showEdit(dateNow)
        this.setState({ NewSub: dateNow })
    }
    onInsertNewSub = (sub) => {
        if (sub.Start.trim() === '') delete sub.Start
        if (typeof sub.Description !== 'string' || sub.Description.trim() === '') {
            delete sub.Description
        }
        if (sub.End.trim() === '') delete sub.End

        const { setItems, item, addSubs } = this.props
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
                addSubs({mainId: item.Id, lstSub: [sub]})
            }
        })
    }
    pushExpectCost = (expectC, sId) => {
        const { item, MapMain, addSubs } = this.props
        const lstSub = MapMain[item.Id].map(s => {
            return { ExpectCost: s.ExpectCost, Id: s.Id }
        })
        const { ExpectCost } = this.state
        const sub = lstSub.find(s => s.Id === sId)
        if (sub) {
            const exp = getExpC(lstSub.map(s => s.ExpectCost))
            if (exp !== ExpectCost) {
                this.setState({ ExpectCost: exp })

                sub.ExpectCost = expectC
                addSubs({mainId: item.Id, lstSub: [sub]})
            }
        }
    }
    pushTrueCost = (trueC, sId) => {
        const { item, MapMain, addSubs } = this.props
        const lstSub = MapMain[item.Id].map(s => {
            return { TrueCost: s.TrueCost, Id: s.Id }
        })
        const { TrueCost } = this.state
        const sub = lstSub.find(s => s.Id === sId)
        if (sub) {
            const _true = getTrueC(lstSub.map(s => s.TrueCost))
            if (_true !== TrueCost) {
                this.setState({ TrueCost: _true })

                sub.TrueCost = trueC
                addSubs({mainId: item.Id, lstSub: [sub]})
            }
        }
    }
    updateDataSubs = (newGoal) => {
        const { item, addSubs } = this.props
        addSubs({mainId: item.Id, lstSub: [newGoal]})
    }
    onDeleteGoal = () => {
        const { item, onDeleteMain } = this.props
        onDeleteMain(item.Id)
    }
    onDeleteSub = (sub) => {
        const id = sub.Id
        const { MapMain, removeSubs, item } = this.props
        return apiDeleteSub(id).then(() => {
            const lstSub = MapMain[item.Id].map(s => {
                return { Id: s.Id, TrueCost: s.TrueCost, ExpectCost: s.ExpectCost }
            })
            const _i = lstSub.map(s => s.Id).indexOf(id)
            if (_i > -1) {
                lstSub.splice(_i, 1)    // remove
                const exp = getExpC(lstSub.map(s => s.ExpectCost))
                if (exp !== this.state.ExpectCost) {
                    this.setState({ ExpectCost: exp })
                }
                const _true = getTrueC(lstSub.map(s => s.TrueCost))
                if (_true !== this.state.TrueCost) {
                    this.setState({ TrueCost: _true })
                }
                removeSubs([id])
            }
            return [id, item.Id]
        })
    }
    onDuplicateSubgoal = (sub) => {
        const { item, setLoading, addSubs } = this.props
        setLoading(true)
        apiDuplicateSub(sub.Id).then(newSub => {
            if (typeof newSub === 'object') {
                addSubs({mainId: item.Id, lstSub: [newSub]})
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
        return <div className='dnb_add_sub'>
            <div>
                <span className="bi bi-plus-circle-dotted"
                    onClick={this.handleAddNewSub}
                    style={{ cursor: 'pointer' }} >&nbsp; New &#9670;</span>
            </div>
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
        const { ExpectCost, TrueCost, IsExpand } = this.state
        const { MapMain, item, onDuplicateMain } = this.props
        const listSub = MapMain[item.Id] || []
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
            <section className={`dnb_item_view dnb_main_container${!IsExpand ? ` dnb_main_collapse` : ''}`}>
                <ItemContext.Provider value={mainCxt}>
                    <GoalItemView updateGoalUI={this.updateGoalUI} />
                </ItemContext.Provider>
                <div className='dnb_item_list_sub'>
                    {
                        !listSub.length ? <div className="dnb_item_list_sub">
                            <div className="dnb_item_view">
                                <div className="dnb_item_container fb-loading"></div>
                                <div className="dnb_item_list_action"></div>
                            </div>
                        </div> : <>{listSub.map(sub => {
                            return <SubgoalConnect key={sub.Id}
                                keyUpdate={sub.IsDone}
                                item={sub}
                                isExpandMain={IsExpand}
                                isDoneMain={item.IsDone}
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
            </section>
        )
    }
}

const mapState = (state) => ({
    EditId: state.focus.EditId,
    LoadingItems: state.loading.Items,
    MapMain: state.dmap.MapMain
})
const mapDispatch = {
    showEdit, setItems, 
    addMains, addSubs, removeSubs
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