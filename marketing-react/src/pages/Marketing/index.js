import React, { Component } from "react"
import {
    getDataGoalAction, apiDuplicateMain,
    apiInsertMain, apiDeleteMain
} from "../../service"
import { getDateAfterDaysString } from "../../global"
import { GoalItemEdit } from "./GoalView"
import { MaingoalConnect, ItemContext } from "./Maingoal"
import { ProcessingProvider, LoadingContext } from "../../global/Context"
import { MReduxProvider, showEdit } from "../../global/ReduxStore"
import { setMains, deleteMains } from "../../global/ReduxStore/DataItem"
import { connect } from "react-redux"
import '../../../node_modules/bootstrap-icons/font/bootstrap-icons.css'
import '../../styles/ga.scss'

class ListMainView extends Component {
    static contextType = LoadingContext
    constructor(props) {
        super(props)
        this.state = { NewMain: null }
    }
    componentDidMount = () => {
        const { setLoading } = this.context;
        const { setMains } = this.props
        getDataGoalAction('mains').then(mains => {
            const lstMain = []
            mains.forEach(m => {
                m.IsDone = !!m.IsDone
                lstMain.push(m)
            })
            setMains(lstMain)
            setLoading(false)
        })
    }
    onDeleteMain = (id) => {
        const { setLoading } = this.context;
        setLoading(true)
        const { deleteMains } = this.props
        apiDeleteMain(id).then(res => {
            deleteMains([id])
            setLoading(false)
        })
    }
    onCancelAddNewMain = () => {
        const dateNow = this.state.NewMain
        this.props.showEdit(dateNow)
        this.setState({ NewMain: null })
    }
    onInsertNewMain = (goal) => {
        const { setLoading } = this.context;
        setLoading(true)
        if (goal.Start.trim() === '') delete goal.Start
        if (typeof goal.Description !== 'string' || goal.Description.trim() === '') {
            delete goal.Description
        }
        if (goal.End.trim() === '') delete goal.End

        this.onCancelAddNewMain()

        apiInsertMain(goal).then(newId => {
            if (!newId.includes('invalid')) {
                goal.Id = newId
                const { setMains } = this.props
                setMains([goal])
            }
            setLoading(false)
        })
    }
    onDuplicateMain = (main) => {
        const { setLoading } = this.context;
        setLoading(true)
        const { setMains } = this.props
        apiDuplicateMain(main.Id).then(newMain => {
            if (typeof newMain === 'object') {
                setMains([newMain])
                setLoading(false)
            }
        })
    }
    render() {
        const { EditId, showEdit, ListMain } = this.props
        const { NewMain } = this.state
        const { setLoading } = this.context;
        const isAddNew = NewMain && EditId === NewMain
        return (
            <>{
                !ListMain.length ? <></> : <>{ListMain.map(main => {
                    return <MaingoalConnect item={main} key={main.Id}
                        keyUpdate={main.IsDone}
                        setLoading={setLoading}
                        onDuplicateMain={this.onDuplicateMain}
                        onDeleteMain={this.onDeleteMain} />
                })}</>
            }
                {!isAddNew ? <div className='dnb_add_main'>
                    <span className="bi bi-plus-circle-dotted"
                        onClick={() => {
                            const dateNow = Date.now()
                            showEdit(dateNow)
                            this.setState({ NewMain: dateNow })
                        }}
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

const mapState = (state) => ({
    EditId: state.focus.EditId,
    ListMain: state.data.Mains
})
const mapDispatch = { showEdit, setMains, deleteMains }
export const ListMainConnect = connect(
    mapState, mapDispatch
)(ListMainView)

export function Marketing() {
    return (
        <ProcessingProvider>
            <MReduxProvider>
                <ListMainConnect />
            </MReduxProvider>
        </ProcessingProvider>
    )
}