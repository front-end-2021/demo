import React, { Component } from "react"
import {
    getDataGoalActionWith, apiInsertAction,
    apiDeleteSub, apiDuplicateSub
} from "../../service"
import { getSumCost, getDateAfterDaysString } from "../../global"
import { ItemProvider, LoadingContext } from "../../global/Context"
import { addActions, deleteSubs, addSubs } from "../../global/ReduxStore/DataItem"
import { GoalItemView } from "./GoalView"
import { ActionView, ActionViewEdit } from "./Action"
import { connect } from "react-redux"
import { showEdit, setItems } from "../../global/ReduxStore"
import Sortable from "sortablejs"
import { logItem } from "../../global/GlobalLog"
import '../../styles/dragdrop.scss'

class Subgoal extends Component {
    static contextType = LoadingContext
    constructor(props) {
        super(props)
        this.state = {
            NewAction: null,
            IsExpand: true
        }
        this.rfActions = React.createRef();
    }
    componentDidMount = () => {
        const { setLoading } = this.context
        const { item, addActions, CanDragDrop } = this.props
        setLoading(true)
        getDataGoalActionWith('actions', { subid: item.Id }).then(actions => {
            const lstAction = []
            actions.forEach(a => {
                a.IsExpand = true
                a.IsDone = !!a.IsDone
                lstAction.push(a)
            })
            addActions(lstAction)       // add to ReduxStore
            setLoading(false)

            if (lstAction.length && CanDragDrop) {
                this.createSortAction()
            }
        })
    }
    createSortAction = () => {
        const elItems = this.rfActions.current
        this.sortAction = Sortable.create(elItems, {
            draggable: ".dnb-dnd-item",
            ghostClass: "dnb-dnd-item-ghost",
            dragClass: "dnb-dnd-item-drag",
            onStart: (evt) => {
                const lstFrom = []
                evt.from.querySelectorAll(".dnb-dnd-item").forEach((n) => {
                    lstFrom.push(n.getAttribute("id"));
                })
                this.LstDnD = lstFrom
            },
            onEnd: (evt) => {
                document.querySelectorAll(`.dnb-dnditem-relate`).forEach(n => {
                    n.classList.remove('dnb-dnditem-relate')
                })

                const lstTo = [];
                evt.to.querySelectorAll(".dnb-dnd-item").forEach((n) => {
                    lstTo.push(n.getAttribute("id"));
                })
                if (lstTo.join('') !== this.LstDnD.join('')) {
                    console.log("drag item", evt.item.getAttribute("id"));
                    console.log(lstTo);

                    delete this.LstDnD
                }
            },
            onMove: (evt, originalEvent) => {
                const _itRlt = evt.related
                if (_itRlt.classList.contains('dnb-dnd-item')) {
                    _itRlt.classList.add('dnb-dnditem-relate')
                }
            },
        });
    }
    destroySortAction = () => {
        this.sortAction.destroy()
    }
    componentDidUpdate = (prevProps) => {
        if (!prevProps.CanDragDrop && this.props.CanDragDrop) {
            this.createSortAction()
        }
        if (prevProps.CanDragDrop && !this.props.CanDragDrop) {
            this.destroySortAction()
        }
    }
    addNewAction = () => {
        const dateNow = Date.now()
        const { showEdit } = this.props
        showEdit(dateNow)
        this.setState({ NewAction: dateNow })
    }
    onInsertNewAction = (_item) => {
        const { setItems, showEdit, item, addActions } = this.props
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
                addActions([_item])
            }
        })
    }
    onDeleteGoal = () => {
        const { item, setItems, deleteSubs } = this.props
        const id = item.Id
        const ids = [id, item.ParentId]
        setItems({ ids, isAdd: true })
        apiDeleteSub(id).then(() => {
            deleteSubs([id])
            setItems({ ids, isAdd: false })
        })
    }
    onCopySub = () => {
        const { item } = this.props
        const sub = JSON.parse(JSON.stringify(item))  // copy
        sub.Name = `${sub.Name} (1)`
        const { setLoading } = this.context;
        const { addSubs } = this.props
        setLoading(true)
        apiDuplicateSub(sub.Id).then(newSub => {
            if (typeof newSub === 'object') {
                addSubs([newSub])
                setLoading(false)
            }
        })
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
                    <ItemProvider item={{
                        Id: NewAction, ParentId: item.Id,
                        Name: `Action ${Date.now()}`,
                        Start: getDateAfterDaysString(0), End: getDateAfterDaysString(1),
                        ExpectCost: 0, TrueCost: 0
                    }}>
                        <ActionViewEdit className={clsLoading} onSaveAction={this.onInsertNewAction} />
                    </ItemProvider>
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
        const { item, Actions, isExpandMain, isDoneMain, CanDragDrop } = this.props
        const { IsExpand } = this.state
        const listAction = Actions.filter(x => x.ParentId === item.Id)
        const isDoneSub = isDoneMain || item.IsDone;
        const isExpandSub = isExpandMain && IsExpand
        const contextSub = Object.assign(
            JSON.parse(JSON.stringify(item)),
            {
                TypeId: 2, IsExpand: isExpandSub,
                isDoneSub: isDoneSub,
                ExpectCost: getSumCost(listAction.map(a => a.ExpectCost)),
                TrueCost: getSumCost(listAction.map(a => a.TrueCost))
            })
        const handleCxt = {
            handleExpand: this.onExpandSub,
            handleDelete: this.onDeleteGoal,
            handleDuplicate: this.onCopySub,
            handleAddNewChild: this.addNewAction,
        }
        const clssGrpA = `dnb_item_list_action${CanDragDrop ? ' dnb-dnd-items' : ''}`
        return (
            <div className={`dnb_item_view${!IsExpand ? ' dnb_sub_collapse' : ''}`}>
                <ItemProvider item={contextSub} handler={handleCxt}>
                    <GoalItemView />
                </ItemProvider>
                <div idgrpdnd={CanDragDrop ? item.Id : undefined}
                    className={clssGrpA} ref={this.rfActions}>{
                        !listAction.length && !listAction.length ?
                            <>{this.getFormActionAddEdit()}</>
                            : <>{
                                listAction.map(_a => {
                                    const _keyUpdate = `${_a.IsDone}.${_a.ExpectCost}.${_a.TrueCost}${_a.IsExpand}`
                                    return <ActionView key={_a.Id}
                                        keyUpdate={_keyUpdate}
                                        item={_a}
                                        isExpandSub={isExpandSub}
                                        isDoneSub={isDoneSub} />
                                })}
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
    Actions: state.dlist.Actions,
    CanDragDrop: state.filter.CanDrgDrp
})
const mapDispatch = {
    showEdit, setItems, addActions,
    deleteSubs, addSubs
}
export const SubgoalConnect = connect(
    mapState, mapDispatch
)(Subgoal)