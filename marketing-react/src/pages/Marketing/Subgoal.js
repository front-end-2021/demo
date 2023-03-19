import React, { Component } from "react"
import {
    getDataGoalActionWith, apiInsertAction
} from "../../service"
import { getExpC, getTrueC, getDateAfterDaysString } from "../../global"
import { GoalItemView } from "./GoalView"
import { ActionView, ActionViewEdit } from "./Action"
import { ItemContext } from "./Maingoal"
import { connect } from "react-redux"
import { showEdit, setItems } from "../../global/ReduxStore"
import { setActions } from "../../global/ReduxStore/DataItem"
import { logItem } from "../../global/GlobalLog"

class Subgoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            NewAction: null,
            IsExpand: true, ExpectCost: 0, TrueCost: 0,
        }
    }
    componentDidMount = () => {
        const { item, setActions } = this.props
        getDataGoalActionWith('actions', { subid: item.Id }).then(actions => {
            const lstAction = []
            actions.forEach(a => {
                a.IsExpand = true
                a.IsDone = !!a.IsDone
                lstAction.push(a)
            })
            const expC = getExpC(lstAction.map(s => s.ExpectCost))
            const trueC = getTrueC(lstAction.map(s => s.TrueCost))
            this.setState({ ExpectCost: expC, TrueCost: trueC })

            setActions(lstAction)

            const { pushTrueCost, pushExpectCost, item } = this.props
            pushExpectCost(expC, item.Id)
            pushTrueCost(trueC, item.Id)
        })
    }
    updateGoalUI = (newGoal) => {
        const { updateDataSubs } = this.props
        updateDataSubs(newGoal)
    }
    addNewAction = () => {
        const dateNow = Date.now()
        const { showEdit } = this.props
        showEdit(dateNow)
        this.setState({ NewAction: dateNow })
    }
    pushUpdateAction = ({ entry }) => {
        const { setActions, ListAction, item } = this.props
        const lstAction = ListAction.filter(a => a.ParentId === item.Id)
        let action = lstAction.find(a => a.Id === entry.Id)
        function getCase() {
            if (!entry) return 0 // default dont do anymore
            if (typeof entry.IsExpand === 'boolean' &&
                entry.IsExpand !== action.IsExpand) return 1    // set expand -> Action
            return 2;
        }
        if (!action) return
        const _keyCase = getCase()
        switch (_keyCase) {
            case 1:
                setActions([entry])
                break
            case 2:
                setActions([entry])

                const exp = getExpC(lstAction.map(s => s.ExpectCost))
                this.setState({ ExpectCost: exp })
                const { pushExpectCost, item } = this.props
                pushExpectCost(exp, item.Id)

                const trueC = getTrueC(lstAction.map(s => s.TrueCost))
                this.setState({ TrueCost: trueC })
                const { pushTrueCost } = this.props
                pushTrueCost(trueC, item.Id)
                break;
            default:

                break;
        }
    }
    onInsertNewAction = (_item) => {
        const { setItems, showEdit, item, setActions, ListAction } = this.props
        const dateNow = this.state.NewAction
        const subId = item.Id
        const ids = [dateNow, subId]
        let isAdd = true
        setItems({ ids, isAdd })
        _item.ParentId = subId

        delete _item.Id
        if (_item.Start && _item.Start.trim() === '') delete _item.Start
        if (typeof _item.Description !== 'string' ||
            _item.Description.trim() === '') {
            delete _item.Description
        }
        if (_item.End && _item.End.trim() === '') delete _item.End

        apiInsertAction(_item).then(newId => {
            showEdit(dateNow)           // hide form
            this.setState({ NewAction: null })
            isAdd = false
            setItems({ ids, isAdd })

            if (!newId.includes('invalid')) {
                _item.Id = newId
                _item.IsExpand = true
                setActions([_item])

                const lstAction = ListAction.filter(a => a.ParentId === item.Id).map(_a => {
                    return { Id: _a.Id, ExpectCost: _a.ExpectCost, TrueCost: _a.TrueCost }
                })
                lstAction.push(_item)
                this.onChangeState(lstAction, _item.ExpectCost > 0, _item.TrueCost > 0)
            }
        })
    }
    onChangeState = (lstAction, isChangeExpect, isChangeTrue) => {
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
    onDeleteGoal = () => {
        const { item, onDeleteSub, setItems } = this.props
        const ids = [item.Id, item.ParentId]
        setItems({ ids, isAdd: true })
        onDeleteSub(item).then(() => {
            setItems({ ids, isAdd: false })
        })
    }
    componentDidUpdate = () => {
        const {ListAction, item} = this.props
        const lstAction = ListAction.filter(a => a.ParentId === item.Id)
        const exp = getExpC(lstAction.map(s => s.ExpectCost))

        const {ExpectCost, TrueCost } = this.state
        if(exp !== ExpectCost) this.setState({ ExpectCost: exp })

        const trueC = getTrueC(lstAction.map(s => s.TrueCost))
        if(trueC !== TrueCost) this.setState({ TrueCost: trueC })
    }
    onDuplicateAction = (item) => {
        const { setItems, ListAction, setActions } = this.props
        const ids = [item.Id, item.ParentId]
        const isAdd = false
        apiInsertAction(item).then(newId => {
            setItems({ ids, isAdd })
            if (!newId.includes('invalid')) {
                item.Id = newId
                const subid = this.props.item.Id
                const lstAction = ListAction.filter(a => a.ParentId === subid).map(_a => {
                    return { Id: _a.Id, ExpectCost: _a.ExpectCost, TrueCost: _a.TrueCost }
                })

                setActions([item])

                lstAction.push(item)
                this.onChangeState(lstAction, item.ExpectCost > 0, item.TrueCost > 0)
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
        const { isExpandMain } = this.props
        if (!isExpandMain) return <></>
        const { NewAction, IsExpand } = this.state
        if (!IsExpand) return <></>
        const { EditId, LoadingItems, item } = this.props
        const isAddNew = NewAction && EditId === NewAction
        const clsLoading = isAddNew && LoadingItems.includes(NewAction) ? 'fb-loading' : ''
        return <>{
            isAddNew ?
                <div className='dnb_item_view' >
                    <ItemContext.Provider value={{
                        Id: NewAction, ParentId: item.Id,
                        Name: `Action ${Date.now()}`,
                        Start: getDateAfterDaysString(0), End: getDateAfterDaysString(1),
                        ExpectCost: 0, TrueCost: 0
                    }}>
                        <ActionViewEdit className={clsLoading} onSaveAction={this.onInsertNewAction} />
                    </ItemContext.Provider>
                </div>
                :
                <div className='dnb_add_action'>
                    <div onClick={() => this.addNewAction()}>
                        <span className="bi bi-plus-circle-dotted"
                            style={{ cursor: 'pointer' }}>&nbsp; New &#9632;</span>
                    </div>
                </div>
        }</>
    }
    onExpandSub = (isExpand) => {
        if (!this.props.isExpandMain) return
        this.setState({ IsExpand: isExpand })
    }
    render() {
        const { item, ListAction, isExpandMain, isDoneMain } = this.props
        const { ExpectCost, TrueCost, IsExpand } = this.state
        const listAction = ListAction.filter(a => a.ParentId === item.Id)
        const isDoneSub = isDoneMain || item.IsDone;
        const isExpandSub = isExpandMain && IsExpand
        const contextSub = Object.assign(
            JSON.parse(JSON.stringify(item)),
            {
                IsExpand: isExpandSub,
                isDoneSub: isDoneSub,
                handleExpand: this.onExpandSub,
                handleDelete: this.onDeleteGoal,
                handleDuplicate: this.handlerDuplicate,
                handleAddNewChild: this.addNewAction,
                TypeId: 2,
                ExpectCost: ExpectCost, TrueCost: TrueCost
            })
        return (
            <div className={`dnb_item_view${!IsExpand ? ' dnb_sub_collapse' : ''}`}>
                <ItemContext.Provider value={contextSub}>
                    <GoalItemView updateGoalUI={this.updateGoalUI} />
                </ItemContext.Provider>
                <div className='dnb_item_list_action'>{
                    !ListAction.length && !listAction.length ? <span className="fb-loading"></span>
                        : <>{
                            listAction.map(_a => {
                                const _keyUpdate = `${_a.IsDone}.${_a.ExpectCost}.${_a.TrueCost}${_a.IsExpand}`
                                return <ActionView key={_a.Id}
                                    keyUpdate={_keyUpdate}
                                    item={_a}
                                    isExpandSub={isExpandSub}
                                    isDoneSub={isDoneSub}
                                    onDuplicateAction={this.onDuplicateAction}
                                    pushUpdateAction={this.pushUpdateAction} />
                            })
                        }
                            {this.getFormActionAddEdit()}
                        </>
                }
                </div>
            </div>
        )
    }
}
const mapState = (state) => ({
    EditId: state.focus.EditId,
    LoadingItems: state.loading.Items,
    ListAction: state.data.Actions
})
const mapDispatch = {
    showEdit, setItems, setActions
}
export const SubgoalConnect = connect(
    mapState, mapDispatch
)(Subgoal)