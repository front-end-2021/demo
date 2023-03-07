import React, { Component } from "react"
import {
    getDataGoalAction, insertMain, deleteMainApi
} from "../../service"
import { getDateAfterDaysString } from "../../global"
import { GoalItemEdit } from "./GoalView"
import { Maingoal, updateGoalUI } from "./Maingoal"
import { ItemContext } from "./Maingoal"
import { LoadingProvider } from "../../global/Context"
import { LoadingContext } from "../../global/Context"
import '../../../node_modules/bootstrap-icons/font/bootstrap-icons.css'
import '../../styles/ga.scss'

class ListMain extends Component {
    static contextType = LoadingContext
    constructor(props) {
        super(props)
        this.state = { ListMain: null, NewMain: false }
    }
    componentDidMount = () => {
        const { hide } = this.context;
        getDataGoalAction('mains').then(mains => {
            const lstMain = []
            mains.forEach(m => {
                m.IsDone = !!m.IsDone
                lstMain.push(m)
            })
            this.setState({ ListMain: lstMain })
            hide()
        })
    }
    updateDataGoals = (newGoal) => {
        updateGoalUI.call(this.state.ListMain, newGoal)
    }
    onDeleteMain = (id) => {
        const lstMain = this.state.ListMain
        deleteMainApi(id).then(res => {
            const _i = lstMain.map(m => m.Id).indexOf(id)
            if (_i > -1) {
                lstMain.splice(_i, 1)       // remove
                this.setState({ ListMain: lstMain })
            }
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

        insertMain(goal).then(newId => {
            if (!newId.includes('invalid')) {
                goal.Id = newId
                const lstMain = this.state.ListMain
                lstMain.push(goal)
                this.setState({ ListMain: lstMain })
            }
            this.onCancelAddNewMain()
        })
    }
    render() {
        const { ListMain, NewMain } = this.state
        return (
            <>
                {
                    !Array.isArray(ListMain) ? <></> : <>{ListMain.map(main => {
                        return <Maingoal item={main} key={main.Id}
                            onDeleteMain={this.onDeleteMain}
                            updateDataGoals={this.updateDataGoals} />
                    })}</>
                }
                {
                    !NewMain ? <div className='dnb_add_main'>
                        <span className="bi bi-plus-circle-dotted"
                            onClick={() => this.setState({ NewMain: true })}
                            style={{ cursor: 'pointer' }} >&nbsp; New &#9673;</span>
                    </div> :
                        <div className='dnb_item_view'>
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
        <LoadingProvider>
            <ListMain />
        </LoadingProvider>
    )
}