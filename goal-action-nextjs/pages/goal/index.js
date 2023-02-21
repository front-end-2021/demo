import { Component, useState } from "react"
import { getDataGoalAction } from "../../service"
import { ActionItem } from "../action"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from './style.module.scss'

export class MainGoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ListMain: [], ListSub: [], ListAction: [],
            ListMainDone: [], ListSubDone: [], ListActionDone: []
        }
    }
    componentDidMount = () => {
        getDataGoalAction('mains').then(mains => {
            this.setState({ ListMain: mains })
            const lstMainIdDone = mains.filter(m => !!m.IsDone).map(m => m.Id)
            this.setState({ ListMainDone: lstMainIdDone })
        })
        getDataGoalAction('subs').then(subs => {
            this.setState({ ListSub: subs })
            const lstSubIdDone = subs.filter(s => !!s.IsDone).map(s => s.Id)
            this.setState({ ListSubDone: lstSubIdDone })
        })
        getDataGoalAction('actions').then(actions => {
            this.setState({ ListAction: actions })
            const lstAcIdDone = actions.filter(a => !!a.IsDone).map(a => a.Id)
            this.setState({ ListActionDone: lstAcIdDone })
        })
    }
    getExpC(lstExp) {
        return lstExp.reduce((acu, crt) => acu + crt, 0)
    }
    getExpectedCost = (listSub) => {
        const { ListAction } = this.state
        const lstExp = listSub.map(s => ListAction.filter(a => a.ParentId == s.Id).map(a => a.ExpectCost))[0]
        return Array.isArray(lstExp) ? this.getExpC(lstExp) : 0
    }
    getTrueC(lstTrue) {
        return lstTrue.reduce((acu, crt) => acu + crt, 0)
    }
    getTrueCost = (listSub) => {
        const { ListAction } = this.state
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
    render() {
        const { ListMain, ListSub, ListAction,
            ListMainDone, ListSubDone, ListActionDone } = this.state
        return (
            <div>
                {
                    ListMain.map(main => {
                        const { Id, Name, Description, Budget, Start, End } = main
                        const isMainDone = ListMainDone.includes(Id)
                        return <div className={style.dnb_item_view}>
                            <GoalItem key={Id}
                                Id={Id} Name={Name} Description={Description}
                                IsDone={isMainDone}
                                Budget={Budget}
                                ExpCost={this.getExpectedCost(ListSub.filter(s => s.ParentId == Id))}
                                TrueCost={this.getTrueCost(ListSub.filter(s => s.ParentId == Id))}
                                Start={Start} End={End}
                                setGoalDone={this.setGoalDone} />
                            <div className={style.dnb_item_list_sub}>
                                <div className={style.dnb_item_view}>
                                    {
                                        ListSub.filter(s => s.ParentId == Id).map(sub => {
                                            const { Id, ParentId, Name, Description, Budget, Start, End } = sub
                                            const isSubDone = ListMainDone.includes(ParentId) || ListSubDone.includes(Id)
                                            return <>
                                                <GoalItem key={Id}
                                                    ParentId={ParentId}
                                                    Id={Id} Name={Name} Description={Description}
                                                    IsDone={isSubDone}
                                                    Budget={Budget}
                                                    ExpCost={this.getExpC(ListAction.filter(a => a.ParentId == Id).map(a => a.ExpectCost))}
                                                    TrueCost={this.getTrueC(ListAction.filter(a => a.ParentId == Id).map(a => a.TrueCost))}
                                                    Start={Start} End={End}
                                                    setGoalDone={this.setGoalDone} />
                                                <div className={style.dnb_item_list_action}>
                                                    {
                                                        ListAction.filter(a => a.ParentId == Id).map(action => {
                                                            const { Id, Name, Description, Start, End, ExpectCost, TrueCost, ParentId } = action
                                                            const isActnDone = ListMainDone.includes(main.Id) || ListSubDone.includes(ParentId) || ListActionDone.includes(Id)
                                                            return <ActionItem key={Id}
                                                                Id={Id} Name={Name} Description={Description}
                                                                ExpCost={ExpectCost} TrueCost={TrueCost}
                                                                IsDone={isActnDone}
                                                                Start={Start} End={End}
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

                <style jsx global>{`
            body {
                font-size: 16px;
              }
              .bi-layout-sidebar::before {
                transform: rotate(-90deg);
              }}`}</style>
            </div>
        )
    }
}

function GoalItem({ Name, Description, Budget, ExpCost, TrueCost,
    Start, End, IsDone, ParentId, setGoalDone, Id }) {
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
    return (
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
                <span className={style.dnb_past_date + " dnb-d-start " + style.o_50}>{Start}</span>
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
                    <i className="bi bi-pencil-square">&nbsp; Edit</i>
                    <i className="bi bi-files">&nbsp; Duplicate</i>
                    <span className="bi bi-trash">&nbsp; Delete</span>
                    <span>
                        <span className={getClsDone()}
                            onClick={onToggleDone}>&nbsp; Finish</span>
                    </span>
                    <span className="bi bi-plus-circle-dotted">&nbsp; New {ParentId ? <>&#9632;</> : <>&#9670;</>}</span>
                </div> : <></>
            }
        </div>
    )
}