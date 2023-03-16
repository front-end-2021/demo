import React, { Component } from "react"
import {
    getDataGoalAction, apiDuplicateMain,
    apiInsertMain, apiDeleteMain
} from "../../service"
import { getDateAfterDaysString } from "../../global"
import { GoalItemEdit } from "./GoalView"
import { MaingoalConnect, updateGoalUI, ItemContext } from "./Maingoal"
import { ProcessingProvider } from "../../global/Context"
import { LoadingContext } from "../../global/Context"
import { MReduxProvider } from "../../global/ReduxStore"
import '../../../node_modules/bootstrap-icons/font/bootstrap-icons.css'
import '../../styles/ga.scss'

class ListMain extends Component {
    static contextType = LoadingContext
    constructor(props) {
        super(props)
        this.state = { ListMain: null, NewMain: false }
    }
    componentDidMount = () => {
        const { setLoading } = this.context;
        getDataGoalAction('mains').then(mains => {
            const lstMain = []
            mains.forEach(m => {
                m.IsDone = !!m.IsDone
                lstMain.push(m)
            })
            this.setState({ ListMain: lstMain })
            setLoading(false)
        })
    }
    updateDataGoals = (newGoal) => {
        updateGoalUI.call(this.state.ListMain, newGoal)
    }
    onDeleteMain = (id) => {
        const { setLoading } = this.context;
        setLoading(true)
        const lstMain = this.state.ListMain
        apiDeleteMain(id).then(res => {
            const _i = lstMain.map(m => m.Id).indexOf(id)
            if (_i > -1) {
                lstMain.splice(_i, 1)       // remove
                this.setState({ ListMain: lstMain })
            }
            setLoading(false)
        })
    }
    onCancelAddNewMain = () => {
        this.setState({ NewMain: false })
    }
    onInsertNewMain = (goal) => {
        if (goal.Start.trim() === '') delete goal.Start
        if (typeof goal.Description !== 'string' || goal.Description.trim() === '') {
            delete goal.Description
        }
        if (goal.End.trim() === '') delete goal.End

        apiInsertMain(goal).then(newId => {
            if (!newId.includes('invalid')) {
                goal.Id = newId
                const lstMain = this.state.ListMain
                lstMain.push(goal)
                this.setState({ ListMain: lstMain })
            }
            this.onCancelAddNewMain()
        })
    }
    onDuplicateMain = (main) => {
        const { setLoading } = this.context;
        setLoading(true)
        const lstMain = this.state.ListMain
        apiDuplicateMain(main.Id).then(newMain => {
            if (typeof newMain === 'object') {
                lstMain.push(newMain)
                this.setState({ ListMain: lstMain })
                setLoading(false)
            }
        })
    }
    render() {
        const { ListMain, NewMain } = this.state
        const { setLoading } = this.context;
        return (
            <>
                {
                    !Array.isArray(ListMain) ? <></> : <>{ListMain.map(main => {
                        const keyUpdate = `${main.Id}${main.IsDone}`
                        return <MaingoalConnect item={main} key={keyUpdate}
                            setLoading={setLoading}
                            onDuplicateMain={this.onDuplicateMain}
                            onDeleteMain={this.onDeleteMain}
                            updateDataGoals={this.updateDataGoals} />
                    })}</>
                }
                {
                    !NewMain ? <div className='dnb_add_main'>
                        <span className="bi bi-plus-circle-dotted"
                            onClick={() => this.setState({ NewMain: true })}
                            style={{ cursor: 'pointer' }} >&nbsp; New &#9673;</span>
                    </div>
                        : <div className='dnb_item_view'>
                            <ItemContext.Provider value={{
                                Name: `Main goal ${Date.now()}`, Start: getDateAfterDaysString(0),
                                End: getDateAfterDaysString(1), Budget: 0
                            }}>
                                <GoalItemEdit
                                    onCloseEditForm={this.onCancelAddNewMain}
                                    onSaveGoal={this.onInsertNewMain}
                                />
                            </ItemContext.Provider>
                        </div>
                }
            </>
        )
    }
}
export function Marketing() {

    return (
        <ProcessingProvider>
            <MReduxProvider>
                <ListMain />
            </MReduxProvider>
        </ProcessingProvider>
    )
}