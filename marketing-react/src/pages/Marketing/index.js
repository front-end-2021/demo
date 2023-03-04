import React, { Component } from "react"
import {
    getDataGoalAction, 
    insertMain, deleteMainApi
} from "../../service"
import { getDateAfterDaysString } from "../../global"
import { FormEditGoal } from "./GoalView"
import { Maingoal, updateGoalUI } from "./Maingoal"
import '../../../node_modules/bootstrap-icons/font/bootstrap-icons.css'
import '../../styles/ga.scss'

export class ListMain extends Component {
    constructor(props) {
        super(props)
        this.state = { ListMain: [], NewMain: false }
    }
    componentDidMount = () => {
        getDataGoalAction('mains').then(mains => {
            const lstMain = []
            mains.forEach(m => {
                m.IsDone = !!m.IsDone
                lstMain.push(m)
            })
            this.setState({ ListMain: lstMain })
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
                    ListMain.map(main => {
                        return <Maingoal item={main} key={main.Id}
                            onDeleteMain={this.onDeleteMain}
                            updateDataGoals={this.updateDataGoals} />
                    })
                }
                {
                    !NewMain ? <div className='dnb_add_main'>
                        <span className="bi bi-plus-circle-dotted"
                            onClick={() => this.setState({ NewMain: true })}
                            style={{ cursor: 'pointer' }} >&nbsp; New &#9673;</span>
                    </div> :
                        <div className='dnb_item_view'>
                            <FormEditGoal
                                Name={`Main goal ${Date.now()}`}
                                Start={getDateAfterDaysString(0)}
                                End={getDateAfterDaysString(1)}
                                Budget={0}
                                onCloseEditForm={this.onCancelAddNewMain}
                                onSaveGoal={this.onInsertNewMain}
                            />
                        </div>
                }
            </>
        )
    }
}
