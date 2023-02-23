import {
    StrictMode,
    Component, useState,
    createContext, useContext
} from "react"
import { getDataGoalAction } from "../../service"
import { ActionItem, FormEditItem } from "../action"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from './style.module.scss'

export const ListDataContext = createContext({
    ListMain: [], ListSub: [], ListAction: []
})
export class Marketing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ListMain: [], ListSub: [], ListAction: []
        }
    }
    render() {
        return (
            <ListDataContext.Provider value={this.state}>
                <MainGoal />
            </ListDataContext.Provider>)
    }
}
class MainGoal extends Component {
    static contextType = ListDataContext
    constructor(props) {
        super(props)
        this.state = { ListMainDone: [], ListSubDone: [], ListActionDone: [] }
    }
    componentDidMount = () => {
        const { ListMain, ListSub, ListAction } = this.context
        getDataGoalAction('mains').then(mains => {
            mains.forEach(m => ListMain.push(m))
            const lstMainIdDone = mains.filter(m => !!m.IsDone).map(m => m.Id)
            this.setState({ ListMainDone: lstMainIdDone })
        })
        getDataGoalAction('subs').then(subs => {
            subs.forEach(s => ListSub.push(s))
            const lstSubIdDone = subs.filter(s => !!s.IsDone).map(s => s.Id)
            this.setState({ ListSubDone: lstSubIdDone })
        })
        getDataGoalAction('actions').then(actions => {
            actions.forEach(a => ListAction.push(a))
            const lstAcIdDone = actions.filter(a => !!a.IsDone).map(a => a.Id)
            this.setState({ ListActionDone: lstAcIdDone })
        })
    }
    getExpC(lstExp) {
        return lstExp.reduce((acu, crt) => acu + crt, 0)
    }
    getExpectedCost = (listSub) => {
        const { ListAction } = this.context
        const lstExp = listSub.map(s => ListAction.filter(a => a.ParentId == s.Id).map(a => a.ExpectCost))[0]
        return Array.isArray(lstExp) ? this.getExpC(lstExp) : 0
    }
    getTrueC(lstTrue) {
        return lstTrue.reduce((acu, crt) => acu + crt, 0)
    }
    getTrueCost = (listSub) => {
        const { ListAction } = this.context
        const lstTrue = listSub.map(s => ListAction.filter(a => a.ParentId == s.Id).map(a => a.TrueCost))[0]
        return Array.isArray(lstTrue) ? this.getTrueC(lstTrue) : 0
    }
    setGoalDone = (goal, isMain) => {  // {Id, IsDone}
        if (isMain) {
            const lstMainDone = this.state.ListMainDone
            const i = lstMainDone.indexOf(goal.Id)
            if (goal.IsDone) {
                if (i < 0) {
                    lstMainDone.push(goal.Id)
                    this.setState({ ListMainDone: lstMainDone })
                }
            } else {
                if (i > -1) {
                    lstMainDone.splice(i, 1)
                    this.setState({ ListMainDone: lstMainDone })
                }
            }
        } else {
            const lstSubDone = this.state.ListSubDone
            const i = lstSubDone.indexOf(goal.Id)
            if (goal.IsDone) {
                if (i < 0) {
                    lstSubDone.push(goal.Id)
                    this.setState({ ListSubDone: lstSubDone })
                }
            } else {
                if (i > -1) {
                    lstSubDone.splice(i, 1)
                    this.setState({ ListSubDone: lstSubDone })
                }
            }
        }
    }
    setActionDone = (actionId, isDone) => {
        const lstActionDone = this.state.ListActionDone
        const i = lstActionDone.indexOf(actionId)
        if (isDone) {
            if (i < 0) {
                lstActionDone.push(actionId)
                this.setState({ ListActionDone: lstActionDone })
            }
        } else {
            if (i > -1) {
                lstActionDone.splice(i, 1)
                this.setState({ ListActionDone: lstActionDone })
            }
        }
    }
    getDateString(dateStr) {
        if (!dateStr) return ''
        const d = new Date(dateStr)
        if (!(d instanceof Date)) return ''
        return d.toDateString().slice(4)
    }
    getListSub = (mId) => {
        const { ListSub } = this.context
        return ListSub.filter(s => s.ParentId == mId)
    }
    getListAction = (sId) => {
        const { ListAction } = this.context
        return ListAction.filter(a => a.ParentId == sId)
    }
    render() {
        const { ListMainDone, ListSubDone, ListActionDone } = this.state
        return (
            <ListDataContext.Consumer>{context =>
                <StrictMode>
                    {
                        context.ListMain.map((main, _im) => {
                            const { Id, Name, Description, Budget, Start, End } = main
                            const isMainDone = ListMainDone.includes(Id)
                            return <div className={style.dnb_item_view} key={`dnb-key-wrap-main${_im}`}>
                                <GoalItem key={Id}
                                    Id={Id} Name={Name} Description={Description}
                                    IsDone={isMainDone}
                                    Budget={Budget}
                                    ExpCost={this.getExpectedCost(this.getListSub(Id))}
                                    TrueCost={this.getTrueCost(this.getListSub(Id))}
                                    Start={this.getDateString(Start)} End={this.getDateString(End)}
                                    setGoalDone={this.setGoalDone} />
                                <div className={style.dnb_item_list_sub}>
                                    <div className={style.dnb_item_view}>
                                        {
                                            this.getListSub(Id).map((sub, _i_) => {
                                                const { Id, ParentId, Name, Description, Budget, Start, End } = sub
                                                const isSubDone = ListMainDone.includes(ParentId) || ListSubDone.includes(Id)
                                                return <>
                                                    <GoalItem key={Id}
                                                        ParentId={ParentId}
                                                        Id={Id} Name={Name} Description={Description}
                                                        IsDone={isSubDone}
                                                        Budget={Budget}
                                                        ExpCost={this.getExpC(this.getListAction(Id).map(a => a.ExpectCost))}
                                                        TrueCost={this.getTrueC(this.getListAction(Id).map(a => a.TrueCost))}
                                                        Start={this.getDateString(Start)} End={this.getDateString(End)}
                                                        setGoalDone={this.setGoalDone} />
                                                    <div className={style.dnb_item_list_action} key={`dnb-key-wrapact-sub${_i_}`}>
                                                        {
                                                            this.getListAction(Id).map(action => {
                                                                const { Id, Name, Description, Start, End, ExpectCost, TrueCost, ParentId } = action
                                                                const isActnDone = ListMainDone.includes(main.Id) || ListSubDone.includes(ParentId) || ListActionDone.includes(Id)
                                                                return <ActionItem key={Id}
                                                                    ParentId={ParentId}
                                                                    Id={Id} Name={Name} Description={Description}
                                                                    ExpCost={ExpectCost} TrueCost={TrueCost}
                                                                    IsDone={isActnDone}
                                                                    Start={this.getDateString(Start)} End={this.getDateString(End)}
                                                                    setActionDone={this.setActionDone} />
                                                            })
                                                        }
                                                    </div>
                                                </>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        })
                    }
                    <style key={`dnb-style`} jsx global>{`
            body {
                font-size: 16px;
              }
              .bi-layout-sidebar::before {
                transform: rotate(-90deg);
              }}`}</style>
                </StrictMode>}
            </ListDataContext.Consumer>
        )
    }
}

function GoalItem({ Name, Description, Budget, ExpCost, TrueCost,
    Start, End, IsDone, ParentId, setGoalDone, Id }) {
    const [isEditView, setEditView] = useState(false)
    const [isShowMenu, setShowMenu] = useState(false)
    function getOpenCost() {
        return Budget - ExpCost
    }
    function getValueOpenCost() {
        const oCost = getOpenCost()
        if (oCost < 0) return `-$${Math.abs(oCost)}`
        return `$${oCost}`
    }
    function getClsCostNegative() {
        if (getOpenCost() < 0)
            return ` ${style.dnb_ocost_negative}`
        return ''
    }
    function onToggleDone(e) {
        const is_done = !IsDone
        setGoalDone({ Id: Id, IsDone: is_done }, !ParentId)
    }
    function onToggleMenu(e) {
        setShowMenu(!isShowMenu)
    }
    function getClsDone() {
        if (IsDone) return `bi bi-check-circle-fill`
        return `bi bi-check-circle`
    }
    function getStartOverDate() {
        const start = new Date(Start)
        const now = new Date(new Date().toDateString())
        if (start.getTime() < now.getTime()) {
            return ' ' + style.dnb_past_date
        }
        return ''
    }
    function onShowEditForm(e) {
        setEditView(true)
    }
    function onCloseEditForm() {
        setEditView(false)
    }
    return (
        <>
            {
                !isEditView ?
                    <div className={style.dnb_item_container + `${IsDone ? ` ${style.dnb_item_done}` : ''}`}>
                        <div className="dnb-item-title">{!ParentId ? <>&#9673;</> : <>&#9670;</>} {Name}</div>
                        <p className={style.o_81 + "dnb-item-description"}>{Description}</p>
                        <div className={style.dnb_item_cost}>
                            <span className={style.dnb_icost + " dnb-budget-cost"}>B:
                                <span className={style.dnb_icost_value}>${Budget}</span>
                            </span>
                            <span className={style.dnb_icost + " dnb-open-cost" + getClsCostNegative()}>o:
                                <span className={style.dnb_icost_value}>{getValueOpenCost()}</span>
                            </span>
                            <span className={style.dnb_icost + " dnb-expect-cost"}>P:
                                <span className={style.dnb_icost_value}>${ExpCost}</span>
                            </span>
                            <span className={style.dnb_icost + " dnb-true-cost"}>C:
                                <span className={style.dnb_icost_value}>${TrueCost}</span>
                            </span>
                        </div>
                        <div className={style.dnb_item_date}>
                            <span className={`bi bi-calendar2-week${getStartOverDate()}`} />
                            <span className={style.dnb_past_date + ` dnb-d-start${getStartOverDate()}`}>&nbsp;{Start}</span>
                            {
                                End ? <>
                                    <span className={style.dnb_d_div}>&minus;</span>
                                    <span className="dnb-d-end">{End}</span>
                                </> : <></>
                            }
                        </div>
                        <div className={style.dnb_i_options}
                            onClick={onToggleMenu}>
                            <span className="bi bi-layout-sidebar">&nbsp; Menu &nbsp;</span>
                            <span className={`bi bi-chevron-${isShowMenu ? 'down' : 'right'}`}></span>
                        </div>
                        {
                            isShowMenu ? <div className={style.dnb_i_menu}>
                                <i className="bi bi-pencil-square"
                                    onClick={onShowEditForm}>&nbsp; Edit</i>
                                <i className="bi bi-files">&nbsp; Duplicate</i>
                                <span className="bi bi-trash">&nbsp; Delete</span>
                                <span>
                                    <span className={getClsDone()}
                                        onClick={onToggleDone}>&nbsp; Finish</span>
                                </span>
                                <span className="bi bi-plus-circle-dotted">&nbsp; New {ParentId ? <>&#9632;</> : <>&#9670;</>}</span>
                            </div> : <></>
                        }
                    </div> :
                    <FormEditGoal ParentId={ParentId}
                        Id={Id} Name={Name} Description={Description}
                        Budget={Budget}
                        ExpCost={ExpCost}
                        TrueCost={TrueCost}
                        Start={Start} End={End}
                        onCloseEditForm={onCloseEditForm}
                    />
            }
        </>
    )
}
function FormEditGoal({ Id, ParentId,
    Name, Description, Budget,
    ExpCost, TrueCost, Start, End, onCloseEditForm }) {
    const [budget, setBudget] = useState(Budget)
    function onHandleChangeBudget(e) {
        const newB = e.target.value
        setBudget(newB)
    }
    const { ListMain, ListSub } = useContext(ListDataContext)
    function onSaveData(goal) {
        let item;
        if (!ParentId) {
            item = ListMain.find(m => m.Id == Id)
        } else {
            item = ListSub.find(m => m.Id == Id)
        }
        if (item) {
            item.Name = goal.Name
            item.Description = goal.Description
            item.Start = goal.Start
            item.End = goal.End
        }
        onCloseEditForm()
        console.log(`onSaveData Goal`, goal, item)
    }
    return (
        <FormEditItem
            typeid={!ParentId ? 1 : 2} onSaveData={onSaveData}
            Id={Id} ParentId={ParentId}
            Name={Name} Description={Description}
            ExpCost={ExpCost} TrueCost={TrueCost}
            Start={Start} End={End}
            onCloseEditForm={onCloseEditForm} >
            <span className={style.dnb_icost + " dnb-budget-cost"}>B:
                <span className={style.dnb_icost_value}>$
                    <input type="number" value={budget} style={{ width: '80px' }}
                        onChange={onHandleChangeBudget} />
                </span>
            </span>
            <span className={style.dnb_icost + " dnb-open-cost"}>o:
                <span className={style.dnb_icost_value}></span>
            </span>
            <span className={style.dnb_icost + " dnb-expect-cost"}>P:
                <span className={style.dnb_icost_value}>${ExpCost}</span>
            </span>
            <span className={style.dnb_icost + " dnb-true-cost"}>C:
                <span className={style.dnb_icost_value}>${TrueCost}</span>
            </span>
        </FormEditItem>
    )
}