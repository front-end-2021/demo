import React, { Component } from "react"
import {
    getSubsActionsBy, apiAddAction, apiSetCollapse,
    apiDeleteSub, apiCopySub, apiSetIndexAction
} from "../../service"
import { getSumCost, getDateAfterDaysString } from "../../global"
import { ItemProvider, LoadingContext } from "../../global/Context"
import {
    addActions, deleteSubs, addSubs,
} from "../../global/ReduxStore/DataItem"
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
    createSortAction = () => {
        const elItems = this.rfActions.current
        this.sortAction = Sortable.create(elItems, {
            group: {
                name: 'actions',
            //    pull: 'clone', // To clone: set pull to 'clone'
                revertClone: true,
            },
            draggable: ".dnb-dnd-item",
            ghostClass: "dnb-dnd-item-ghost",
            dragClass: "dnb-dnd-item-drag",
            //removeCloneOnHide: false,
            onStart: (evt) => {
                const lstFrom = []
                evt.from.querySelectorAll(".dnb-dnd-item").forEach((n) => {
                    lstFrom.push(n.getAttribute("id"));
                })
                this.LstDnD = lstFrom
                this.SrcSubId = evt.from.getAttribute('idgrpdnd')
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
                    const DesSubId = evt.to.getAttribute('idgrpdnd')
                    const itemId = evt.item.getAttribute("id")

                    processList.call(this, {
                        SubId: this.SrcSubId
                    }, {
                        SubId: DesSubId, Ids: lstTo
                    }, {
                        Id: itemId
                    })

                    delete this.LstDnD
                    delete this.SrcSubId
                }
            },
            onMove: (evt, originalEvt) => {
                const _itRlt = evt.related
                if (_itRlt.classList.contains('dnb-dnd-item')) {
                    _itRlt.classList.add('dnb-dnditem-relate')
                }
            },
        });

        function processList(src, des, dragSub) {
            const this_ = this
            const { deleteSubs, addSubs } = this_.props
            const { setLoading } = this_.context
            const SrcSubId = src.SubId
            const DesSubId = des.SubId
            const DesIds = des.Ids

            setLoading(true)

            apiSetIndexAction({
                src: { SubId: SrcSubId },
                des: { SubId: DesSubId, Ids: DesIds },
                item: dragSub
            }).then(res => {
                const { desSubs } = res
                if (SrcSubId !== DesSubId) {    // khac sub
                    this_.destroySortAction()

                    document.querySelectorAll(`.dnb-dnd-item[id="${dragSub.Id}"]`).forEach(n => {
                        n.remove()
                    })

                    deleteSubs([SrcSubId, DesSubId])
                    this_.context.cbDnDActionSubs = function () {
                        addSubs(desSubs);
                    }
                } else addSubs(desSubs)

                setLoading(false)
            })
        }
    }
    destroySortAction = () => {
        if(typeof this.sortAction === 'object') {
            this.sortAction.destroy()
            delete this.sortAction;
        }
    }
    componentDidMount = () => {
        const { setLoading } = this.context
        const { item, addActions, CanDragDrop } = this.props
        setLoading(true)
        if (!Array.isArray(item.Actions)) {
            getSubsActionsBy('actions', { subid: item.Id }).then(actions => {
                const lstAction = []
                actions.forEach(a => {
                    a.IsDone = !!a.IsDone
                    lstAction.push(a)
                })
                addActions({
                    subid: item.Id,
                    actions: lstAction
                })
                setLoading(false)

                if (lstAction.length && CanDragDrop) {
                    this.createSortAction()
                }
            })
        } else {
            if (item.Actions.length && CanDragDrop) {
                this.createSortAction()
            }
            setLoading(false)
        }
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

        apiAddAction(_item).then(newId => {
            showEdit(dateNow)           // hide form
            this.setState({ NewAction: null })
            isAdd = false
            setItems({ ids, isAdd })

            if (!newId.includes('invalid')) {
                _item.Id = newId
                _item.IsExpand = true

                addActions({
                    subid: item.Id,
                    actions: [_item]
                })
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
        apiCopySub(sub.Id).then(newSub => {
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
        const {item, isExpandMain} = this.props
        if (!isExpandMain) return
        this.setState({ IsExpand: isExpand })
        apiSetCollapse([item.Id], isExpand)
    }
    render() {
        const { item, isExpandMain, isDoneMain, CanDragDrop } = this.props
        const { IsExpand } = this.state
        const listAction = Array.isArray(item.Actions) ? item.Actions : []
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
    CanDragDrop: state.filter.CanDrgDrp
})
const mapDispatch = {
    showEdit, setItems,
    addActions,
    deleteSubs, addSubs
}
export const SubgoalConnect = connect(
    mapState, mapDispatch
)(Subgoal)