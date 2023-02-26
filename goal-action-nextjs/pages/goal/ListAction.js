import { Component } from "react"
import { getDataGoalActionWith } from "../../service"
import { Action } from "../action"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from './style.module.scss'

export class ListAction extends Component {
    constructor(props) {
        super(props)
        this.state = { ListAction: [], }
    }
    componentDidMount = () => {
        const { ParentId, setExpectCostSub, setTrueCostSub } = this.props
        getDataGoalActionWith('actions', { subid: ParentId }).then(actions => {
            const lstAction = []
            actions.forEach(a => {
                a.IsDone = !!a.IsDone
                lstAction.push(a)
            })
            this.setState({ ListAction: lstAction })
            setExpectCostSub(lstAction.map(a => a.ExpectCost), ParentId)
            setTrueCostSub(lstAction.map(a => a.TrueCost), ParentId)
        })
    }
    updateAction = (newAction) => {
        const { ListAction } = this.state
        const _action = ListAction.find(a => a.Id == newAction.Id)
        if (_action) {
            if (typeof newAction.Name == 'string' &&
                newAction.Name.trim() != '' && _action.Name != newAction.Name)
                _action.Name = newAction.Name
            if (typeof newAction.Description == 'string' && _action.Description != newAction.Description)
                _action.Description = newAction.Description
            if (typeof newAction.IsDone == 'boolean' && _action.IsDone != newAction.IsDone)
                _action.IsDone = newAction.IsDone
            if (typeof newAction.Start == 'string' && _action.Start != newAction.Start)
                _action.Start = newAction.Start
            if (typeof newAction.End == 'string' && _action.End != newAction.End)
                _action.End = newAction.End
            if (typeof newAction.ExpectCost == 'number' && _action.ExpectCost != newAction.ExpectCost)
                _action.ExpectCost = newAction.ExpectCost
            if (typeof newAction.TrueCost == 'number' && _action.TrueCost != newAction.TrueCost)
                _action.TrueCost = newAction.TrueCost

        }
        const { ParentId, setExpectCostSub, setTrueCostSub } = this.props
        setExpectCostSub(ListAction.map(a => a.ExpectCost), ParentId)
        setTrueCostSub(ListAction.map(a => a.TrueCost), ParentId)
    }
    setActionDone = (aId, isDone) => {
        const { ListAction } = this.state
        const _action = ListAction.find(a => a.Id == aId)
        if (_action) _action.IsDone = isDone
    }
    render() {
        const { ListAction } = this.state
        return (
            <div className={style.dnb_item_list_action}>
                {
                    ListAction.map(action => {
                        const { Id } = action
                        return <Action key={Id}
                            item={action}
                            updateAction={this.updateAction} />
                    })
                }
            </div>
        )
    }
}