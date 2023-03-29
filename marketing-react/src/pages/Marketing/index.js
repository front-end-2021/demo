import React, { Component } from "react"
import {
    apiGetMains, apiAddMain
} from "../../service"
import { getDateAfterDaysString, getIcon } from "../../global"
import { GoalItemEdit } from "./GoalView"
import { MaingoalConnect } from "./Maingoal"
import { ProcessingProvider, LoadingContext } from "../../global/Context"
import { MReduxProvider, showEdit } from "../../global/ReduxStore"
import { ItemProvider } from "../../global/Context"
import { addMains } from "../../global/ReduxStore/DataItem"
import { NavigationView } from "./NavBar"
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
        const { addMains } = this.props
        apiGetMains('mains').then(mains => {
            const lstMain = []
            mains.forEach(m => {
                m.IsDone = !!m.IsDone
                lstMain.push(m)
            })
            addMains(lstMain)
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

        apiAddMain(goal).then(newId => {
            if (!newId.includes('invalid')) {
                goal.Id = newId
                const { addMains } = this.props
                addMains([goal])
            }
            setLoading(false)
        })
    }
    render() {
        const { EditId, showEdit, ListMain } = this.props
        const { NewMain } = this.state
        const isAddNew = NewMain && EditId === NewMain
        return (
            <>{
                !ListMain.length ? <></> : <>{ListMain.map(main => {
                    return <MaingoalConnect
                        item={main} key={main.Id}
                        keyUpdate={main.IsDone} />
                })}</>
            }
                {!isAddNew ? <div className='dnb_add_main dnb-btnadd'>
                    <span className="bi bi-plus-circle-dotted"
                        onClick={() => {
                            const dateNow = Date.now()
                            showEdit(dateNow)
                            this.setState({ NewMain: dateNow })
                        }}
                        style={{ cursor: 'pointer' }} >&nbsp; New {getIcon(1)}</span>
                </div>
                    : <div className='dnb_item_view'>
                        <ItemProvider
                            item={{
                                Name: `Main goal ${Date.now()}`,
                                Start: getDateAfterDaysString(0),
                                End: getDateAfterDaysString(1), Budget: 0
                            }}
                            handler={{
                                onSaveGoal: this.onInsertNewMain,
                                onCloseEditForm: this.onCancelAddNewMain
                            }}>
                            <GoalItemEdit />
                        </ItemProvider>
                    </div>
                }
            </>
        )
    }
}

const mapState = (state) => ({
    EditId: state.focus.EditId,
    ListMain: state.dlist.Mains
})
const mapDispatch = { showEdit, addMains }
export const ListMainConnect = connect(
    mapState, mapDispatch
)(ListMainView)

export function Marketing() {
    return (
        <ProcessingProvider>
            <MReduxProvider>
                <NavigationView />
                <ListMainConnect />
            </MReduxProvider>
        </ProcessingProvider>
    )
}
