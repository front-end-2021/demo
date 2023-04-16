import React, { Component } from "react"
import {
    getSubsActionsBy,
    apiCopyMain, apiDeleteMain,
    apiAddSub, apiSetCollapse
} from "../../service"
import { getSumCost, getDateAfterDaysString, getIcon } from "../../global"
import { GoalItemView, GoalItemEdit } from "./GoalView"
import { SubgoalConnect } from "./Subgoal"
import { connect } from "react-redux"
import { showEdit, setItems } from "../../global/ReduxStore"
import { addSubs, addMains, deleteMains } from "../../global/ReduxStore/DataItem"
import { ItemProvider, LoadingContext } from "../../global/Context"
import { IsView } from "../../service/demoData"
import { logItem } from "../../global/GlobalLog"

export class Maingoal extends Component {
    static contextType = LoadingContext
    constructor(props) {
        super(props)
        this.state = {
            NewSub: null,
            IsExpand: true,
        }
    }
    componentDidMount = () => {
        const { item, addSubs } = this.props
        getSubsActionsBy('subs', { mainid: item.Id }).then(subs => {
            const lstSub = []
            subs.forEach(s => {
                s.IsDone = !!s.IsDone
                lstSub.push(s)
            })
            addSubs(lstSub) // add to ReduxStore
        })
    }
    
    handleAddNewSub = () => {
        if (IsView) return;
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

        apiAddSub(sub).then(newId => {
            isAdd = false
            setItems({ ids, isAdd })
            if (!newId.includes('invalid')) {
                sub.Id = newId
                addSubs([sub])
            }
        })
    }
    onDeleteGoal = () => {
        const { setLoading } = this.context;
        const { item, deleteMains } = this.props
        const id = item.Id
        setLoading(true)
        apiDeleteMain(id).then(res => {
            deleteMains([id])
            setLoading(false)
        })
    }
    onExpandMain = (isExpand) => {
        const { item } = this.props
        this.setState({ IsExpand: isExpand })
        apiSetCollapse([item.Id], isExpand)
    }
    getButtonAddSub = () => {
        const { IsExpand } = this.state
        const { IsDnD, ViewIndex } = this.props
        if (!IsExpand || (IsDnD && ViewIndex === 1)) return <></>
        return <div className='dnb_add_sub dnb-btnadd'
            style={{ alignItems: 'initial' }}>
            <div style={{ opacity: IsView ? '0.69' : undefined }}>
                <span className="bi bi-plus-circle-dotted"
                    onClick={this.handleAddNewSub}
                    style={{ cursor: 'pointer' }} >&nbsp; New {getIcon(2)}</span>
            </div>
        </div>
    }
    getViewNewSub = () => {
        const { NewSub, IsExpand } = this.state
        if (!IsExpand || !NewSub) return this.getButtonAddSub()
        const { EditId } = this.props
        const isAddNew = NewSub && EditId === NewSub
        if (!isAddNew) return this.getButtonAddSub()

        const { item } = this.props
        return <div className='dnb_item_view'>
            <ItemProvider item={{
                TypeId: 2, Id: NewSub, ParentId: item.Id,
                Name: `Subgoal ${Date.now()}`, Start: getDateAfterDaysString(0),
                End: getDateAfterDaysString(1), Budget: 0,
            }}
                handler={{ onSaveGoal: this.onInsertNewSub }}>
                <GoalItemEdit />
            </ItemProvider>
        </div>
    }
    onCopyMain = (main) => {
        const { setLoading } = this.context;
        setLoading(true)
        const { addMains } = this.props
        apiCopyMain(main.Id).then(newMain => {
            if (typeof newMain === 'object') {
                addMains([newMain])
                setLoading(false)
            }
        })
    }
    getExpectCost = (listSub) => {
        let lstA = []
        listSub.forEach(s => {
            if (Array.isArray(s.Actions)) lstA = lstA.concat(s.Actions)
        })
        return getSumCost(lstA.map(a => a.ExpectCost));
    }
    getTrueCost = (listSub) => {
        let lstA = []
        listSub.forEach(s => {
            if (Array.isArray(s.Actions)) lstA = lstA.concat(s.Actions)
        })
        return getSumCost(lstA.map(a => a.TrueCost || 0));
    }
    isLoadingSub = (listSub) => {
        let lstA = []
        listSub.forEach(s => {
            if (Array.isArray(s.Actions)) lstA = lstA.concat(s.Actions)
        })
        if (!listSub.length && !lstA.length) return true
        return false
    }
    render() {
        const { IsExpand } = this.state
        const { ListSub, item, ViewIndex } = this.props
        let idx = -1
        const listSub = ListSub.filter((x, i) => {
            if(!x) return false
            if(!x.ParentId) return false
            if (x.ParentId === item.Id) {
                if (idx < 0) idx = i
                return true
            }
            return false
        })
        const mainCxt = Object.assign(JSON.parse(JSON.stringify(item)),
            {
                TypeId: 1, IsExpand: IsExpand,
                ExpectCost: this.getExpectCost(listSub),
                TrueCost: this.getTrueCost(listSub)
            })
        const handleCxt = {
            handleExpand: this.onExpandMain,
            handleDelete: this.onDeleteGoal,
            handleAddNewChild: this.handleAddNewSub,
            handleDuplicate: this.onCopyMain,
        }
        const clsCollp = !IsExpand || ViewIndex === 2 ? ` dnb_main_collapse` : ''
        return (
            <section className={`dnb_item_view dnb_main_container${clsCollp}`}>
                <ItemProvider item={mainCxt} handler={handleCxt}>
                    <GoalItemView />
                </ItemProvider>
                <div className='dnb_item_list_sub'>
                    {
                        !listSub.length ? <div className="dnb_item_view">
                            <div className="dnb_item_container"
                                style={{ backgroundColor: 'transparent' }}></div>
                            <div className="dnb_item_list_action"></div>
                        </div> : <>{
                            listSub.map(sub => {
                                return <SubgoalConnect
                                    key={sub.Id}
                                    index={idx++}
                                    keyUpdate={sub.IsDone}
                                    item={sub}
                                    isExpandMain={IsExpand}
                                    isDoneMain={item.IsDone} />
                            })
                        }</>
                    }
                    {ViewIndex !== 2 && this.getViewNewSub()}
                </div>
            </section>
        )
    }
}

const mapState = (state) => ({
    EditId: state.focus.EditId,
    LoadingItems: state.loading.Items,
    ListSub: state.dlist.Subs,
    ViewIndex: state.navbar.ViewType,
    IsDnD: state.navbar.CanDrgDrp
})
const mapDispatch = {
    showEdit, setItems,
    addMains, deleteMains,
    addSubs
}

export const MaingoalConnect = connect(
    mapState, mapDispatch
)(Maingoal)
