import { Component, useState } from "react"
import axios from 'axios'
import { ActionItem } from "../action"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from './style.module.scss'

export class MainGoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ListMain: [], ListSub: [], ListAction: []
        }
    }
    componentDidMount = () => {
        const config = {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
        }
        axios.get(`http://localhost:8001/api/mains`, config)
            .then(res => { return res.data })
            .then(data => { return data.data })
            .then(mains => {
                this.setState({ ListMain: mains })
            })
        axios.get(`http://localhost:8001/api/subs`, config)
            .then(res => { return res.data })
            .then(data => { return data.data })
            .then(subs => {
                this.setState({ ListSub: subs })
            })
        axios.get(`http://localhost:8001/api/actions`, config)
            .then(res => { return res.data })
            .then(data => { return data.data })
            .then(actions => {
                this.setState({ ListAction: actions })
            })
    }
    render() {
        const { ListMain, ListSub, ListAction } = this.state
        return (
            <div>
                {
                    ListMain.map(main => {
                        const { Id, Name, Description, Budget, Start, End } = main
                        const lstExp = ListSub.filter(s => s.ParentId == Id).map(s => ListAction.filter(a => a.ParentId == s.Id).map(a => a.ExpectCost))[0]
                        const exp = Array.isArray(lstExp) ? lstExp.reduce((acu, crt) => acu + crt, 0) : 0
                        const lstTrue = ListSub.filter(s => s.ParentId == Id).map(s => ListAction.filter(a => a.ParentId == s.Id).map(a => a.TrueCost))[0]
                        const trueC = Array.isArray(lstTrue) ? lstTrue.reduce((acu, crt) => acu + crt, 0) : 0
                        return <div className={style.dnb_item_view} key={Id}>
                            <GoalItem
                                Name={Name} Id={Id}
                                Description={Description}
                                Budget={Budget} ExpCost={exp} TrueCost={trueC}
                                Start={Start} End={End} />
                            <div className={style.dnb_item_list_sub}>
                                <div className={style.dnb_item_view}>
                                    {
                                        ListSub.filter(s => s.ParentId == Id).map(sub => {
                                            const { Id, ParentId, Name, Description, Budget, Start, End } = sub
                                            const exp = ListAction.filter(a => a.ParentId == Id).map(a => a.ExpectCost).reduce((acu, crt) => acu + crt, 0)
                                            const trueC = ListAction.filter(a => a.ParentId == Id).map(a => a.TrueCost).reduce((acu, crt) => acu + crt, 0)
                                            return <>
                                                <GoalItem key={Id}
                                                    Id={Id} ParentId={ParentId}
                                                    Name={Name} Description={Description}
                                                    Budget={Budget} ExpCost={exp} TrueCost={trueC}
                                                    Start={Start} End={End} />
                                                <div className={style.dnb_item_list_action}>
                                                    {
                                                        ListAction.filter(a => a.ParentId == Id).map(action => {
                                                            const { Id, Name, Description, Start, End, ExpectCost, TrueCost } = action
                                                            return <ActionItem key={Id}
                                                                Name={Name} Description={Description}
                                                                ExpCost={ExpectCost} TrueCost={TrueCost}
                                                                Start={Start} End={End} />
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

function GoalItem({ Name, Description, Budget, ExpCost, TrueCost, Start, End, IsDone, ParentId, Id }) {
    const [isDone, setIsDone] = useState(IsDone)
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
    return (
        <div className={style.dnb_item_container + `${isDone ? ' dnb_item_done' : ''}`}>
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
            <div className={style.dnb_i_options}>
                <span className="bi bi-layout-sidebar">&nbsp; Menu &nbsp;</span>
                {
                    isShowMenu ? <span className="bi bi-chevron-down"></span> :
                        <span className="bi bi-chevron-right"></span>
                }
            </div>
            {
                isShowMenu ? <div className={style.dnb_i_menu}>
                    <i className="bi bi-pencil-square">&nbsp; Edit</i>
                    <i className="bi bi-files">&nbsp; Duplicate</i>
                    <span className="bi bi-trash">&nbsp; Delete</span>
                    <span className="bi bi-check-circle">&nbsp; Finish</span>
                    <span className="bi bi-plus-circle-dotted">&nbsp; New &#9670;</span>
                </div> : ''
            }
        </div>
    )
}