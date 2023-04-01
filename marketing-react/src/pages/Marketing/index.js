import React, { Component, useEffect } from "react"
import {
    apiGetMains, apiAddMain
} from "../../service"
import { getDateAfterDaysString, getIcon } from "../../global"
import { GoalItemEdit } from "./GoalView"
import { MaingoalConnect } from "./Maingoal"
import { ProcessingProvider, LoadingContext } from "../../global/Context"
import { MReduxProvider, showEdit } from "../../global/ReduxStore"
import { setView } from "../../global/ReduxStore/Navigator"
import { ItemProvider } from "../../global/Context"
import { addMains } from "../../global/ReduxStore/DataItem"
import { NavigationConn } from "./NavBar"
import { connect, useSelector, useDispatch } from "react-redux"
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
    getBtnNewMain = () => {
        const { showEdit, ViewIndex, IsDnD } = this.props
        if (ViewIndex === 2) return <></>
        if (IsDnD && ViewIndex === 1) return <></>
        return <div className='dnb_add_main dnb-btnadd'>
            <span className="bi bi-plus-circle-dotted"
                onClick={() => {
                    const dateNow = Date.now()
                    showEdit(dateNow)
                    this.setState({ NewMain: dateNow })
                }}
                style={{ cursor: 'pointer' }} >&nbsp; New {getIcon(1)}</span>
        </div>
    }
    render() {
        const { EditId, ListMain } = this.props
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
                {!isAddNew ? this.getBtnNewMain()
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
    ListMain: state.dlist.Mains,
    ViewIndex: state.navbar.ViewType,
    IsDnD: state.navbar.CanDrgDrp,
})
const mapDispatch = { showEdit, addMains }
const ListMainConnect = connect(
    mapState, mapDispatch
)(ListMainView)

function TabView() {
    let viewType = useSelector(state => state.navbar.ViewType)
    // const dispatch = useDispatch()
    // useEffect(() => {
    //     if (window.outerWidth < 669) {
    //         dispatch(setView(2))
    //     }
    // }, [])
    return (<div>
        {viewType < 4 ? <ListMainConnect /> :
            <article>
                <h1 className='title'>
                    Welcome to <a href="void(0)">Planning</a>
                </h1>

                <p className='description'>
                    Get started by click <code>+ New &#9673;</code>
                </p>

                <div className='grid'>
                    <a href="https://nextjs.org/docs" className='card'>
                        <h3>Documentation &rarr;</h3>
                        <p>Find in-depth information about Next.js features and API.</p>
                    </a>

                    <a href="https://nextjs.org/learn" className='card'>
                        <h3>Learn &rarr;</h3>
                        <p>Learn about Next.js in an interactive course with quizzes!</p>
                    </a>

                    <a
                        href="https://github.com/vercel/next.js/tree/master/examples"
                        className='card' >
                        <h3>Examples &rarr;</h3>
                        <p>Discover and deploy boilerplate example Next.js projects.</p>
                    </a>

                    <a
                        href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className='card' >
                        <h3>Deploy &rarr;</h3>
                        <p>
                            Instantly deploy your Next.js site to a public URL with Vercel.
                        </p>
                    </a>
                </div>
            </article>}
    </div>)
}
export function Marketing() {
    return (
        <ProcessingProvider>
            <MReduxProvider>
                <NavigationConn />
                <TabView />
            </MReduxProvider>
        </ProcessingProvider>
    )
}
