import React, { Component } from "react"
import {
    getDataGoalActionWith, apiInsertAction, apiDeleteAction
} from "../../service"
import { getExpC, getTrueC, getDateAfterDaysString } from "../../global"
import { GoalItemView } from "./GoalView"
import { ActionView, ActionViewEdit } from "./Action"
import { ItemContext } from "./Maingoal"
import { connect } from "react-redux"
import { showEdit, setItems } from "../../global/ReduxStore"
import { logItem } from "../../global/GlobalLog"

class Subgoal extends Component {
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
                a.IsExpand = true
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
    addNewAction = () => {
        const dateNow = Date.now()
        const { showEdit } = this.props
        showEdit(dateNow)
        this.setState({ NewAction: dateNow })
    }
    pushUpdateAction = ({ entry }) => {
        const lstAction = this.state.ListAction
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
                action.IsExpand = entry.IsExpand
                this.setState({ ListAction: lstAction })
                break
            case 2:
                Object.assign(action, entry)
                this.setState({ ListAction: lstAction })
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
        const { setItems, showEdit, item } = this.props
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
                const lstAction = this.state.ListAction
                lstAction.push(_item)
                this.onChangeState(lstAction, _item.ExpectCost > 0, _item.TrueCost > 0)
            }
        })
    }
    onChangeState = (lstAction, isChangeExpect, isChangeTrue) => {
        this.setState({ ListAction: lstAction })
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
    onDeleteAction = (action) => {
        const lstAction = this.state.ListAction
        const _i = lstAction.map(a => a.Id).indexOf(action.Id)
        if (_i > -1) {
            apiDeleteAction(action.Id)
            lstAction.splice(_i, 1) // remove
            this.onChangeState(lstAction, action.ExpectCost > 0, action.TrueCost > 0)
        }
    }
    onDuplicateAction = (item) => {
        const { setItems } = this.props
        const ids = [item.Id, item.ParentId]
        const isAdd = false
        apiInsertAction(item).then(newId => {
            setItems({ ids, isAdd })
            if (!newId.includes('invalid')) {
                item.Id = newId
                const lstAction = this.state.ListAction
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
        const { item, isExpandMain } = this.props
        const { ListAction, ExpectCost, TrueCost, IsExpand } = this.state
        const contextSub = Object.assign(
            JSON.parse(JSON.stringify(item)),
            {
                IsExpand: isExpandMain && IsExpand,
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
                    !Array.isArray(ListAction) ? <span className="fb-loading"></span>
                        : <>{
                            ListAction.map(_a => {
                                const isExpand = isExpandMain && IsExpand
                                const _keyUpdate = `${_a.IsDone}.${_a.ExpectCost}.${_a.TrueCost}${_a.IsExpand}`
                                return <ActionView key={_a.Id}
                                    keyUpdate={_keyUpdate}
                                    item={_a}
                                    isExpandSub={isExpand}
                                    onDeleteAction={this.onDeleteAction}
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
    LoadingItems: state.loading.Items
})
const mapDispatch = {
    showEdit, setItems
}
export const SubgoalConnect = connect(
    mapState, mapDispatch
)(Subgoal)