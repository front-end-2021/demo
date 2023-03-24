import React, { Component } from "react"
import { setUnit, TypeUnit, switchDragDrop } from "../../global/ReduxStore/Filter"
import { useDispatch, useSelector } from "react-redux"
import Select from 'react-select'
import '../../styles/navigation.scss'
export class NavigationView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            LastScrollY: 0
        };
        this.navRef = React.createRef();
    }
    componentDidMount = () => {
        document.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount = () => {
        document.removeEventListener('scroll', this.handleScroll);
    }
    handleScroll = (evt) => {
        const scrlTop = window.scrollY
        if (scrlTop < 1) {
            this.navRef.current.classList.remove('dnNavFadeDwn')
            this.navRef.current.classList.remove('dnNavHideUp')
            document.querySelectorAll(`.dnb-wrap-2-sticky`).forEach(t => {
                t.classList.remove('dnGoalFadeDwn')
                t.classList.remove('dnGoalHideUp')
            })
            document.querySelectorAll(`.dnb_editview`).forEach(t => {
                t.classList.remove('dnGoalFadeDwn')
                t.classList.remove('dnGoalHideUp')
            })
        } else if (scrlTop > this.state.LastScrollY) {  //console.log('scroll down')
            this.navRef.current.classList.remove('dnNavFadeDwn')
            this.navRef.current.classList.add('dnNavHideUp')
            document.querySelectorAll(`.dnb-wrap-2-sticky`).forEach(t => {
                t.classList.remove('dnGoalFadeDwn')
                t.classList.add('dnGoalHideUp')
            })
            document.querySelectorAll(`.dnb_editview`).forEach(t => {
                t.classList.remove('dnGoalFadeDwn')
                t.classList.add('dnGoalHideUp')
            })
        } else {        //console.log('scroll up')
            this.navRef.current.classList.add('dnNavFadeDwn')
            this.navRef.current.classList.remove('dnNavHideUp')
            document.querySelectorAll(`.dnb-wrap-2-sticky`).forEach(t => {
                t.classList.add('dnGoalFadeDwn')
                t.classList.remove('dnGoalHideUp')
            })
            document.querySelectorAll(`.dnb_editview`).forEach(t => {
                t.classList.add('dnGoalFadeDwn')
                t.classList.remove('dnGoalHideUp')
            })
        }
        this.setState({ LastScrollY: scrlTop })
    }

    render() {
        return (
            <nav className='dnb-navbar' ref={this.navRef}>
                <ViewFilter />
                <ViewSettings />
            </nav>
        )
    }
}
function ViewFilter() {
    let canDnD = useSelector(state => state.filter.CanDrgDrp)
    const dispatch = useDispatch()

    const toggleDnD = () => {
        dispatch(switchDragDrop())
    }
    const getLabel = () => {
        if (canDnD) return <strong>Drag & Drop</strong>
        return <strong style={{
            textDecoration: 'line-through',
            color: `#cccccc`
        }} >Drag & Drop</strong>
    }
    return (
        <div className='dnb-filter_container'>
            <div className="dnb-toggle-dnd">
                {getLabel()}
                <label className="dnb-switch">
                    <input type="checkbox"
                        defaultChecked={canDnD} onClick={toggleDnD} />
                    <span className="dnb-slider dn-round"></span>
                </label>
            </div>
        </div>
    )

}
const options = TypeUnit.map(x => {
    return {
        label: x.Name, value: x.View
    }
})
function ViewSettings() {
    let unit = useSelector(state => state.filter.Unit)
    const dispatch = useDispatch()
    const setSelectedOption = (option) => {
        dispatch(setUnit(option.label))
    }
    return (
        <div className='dnb-settings_container'>
            <strong className='dnb-lbl-unit'>Unit</strong>
            <Select
                options={options}
                onChange={setSelectedOption}
                defaultValue={options.find(x => x.value === unit.View)} />
        </div>
    )
}