import React, { Component, useEffect } from "react"
import {
    setUnit, TypeUnit, toggleDragDrop,
    setTextSearch, NavView, setView
} from "../../global/ReduxStore/Navigator"
import { useDispatch, useSelector, connect } from "react-redux"
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
    onSelectTab = (index) => {
        this.props.setView(index)
    }
    render() {
        const { ViewIndex } = this.props
        return (
            <nav className='dnb-navbar' ref={this.navRef}>
                <div className="page_inline" >
                    {NavView.map((lbl, i) => {
                        const currentI = i === ViewIndex ? `current-tab` : ''
                        return <strong className={currentI} key={`nav-tab_${i}`}
                            onClick={() => this.onSelectTab(i)}>{lbl}</strong>
                    }
                    )}
                </div>
                {ViewIndex < 4 && <Search />}
                {ViewIndex < 4 && <ViewFilter />}
                {ViewIndex < 4 && <ViewSettings />}
            </nav>
        )
    }
}
const mapState = (state) => ({
    ViewIndex: state.navbar.ViewType
})
const mapDispatch = {
    setView,
}
export const NavigationConn = connect(mapState, mapDispatch)(NavigationView)
function ViewFilter() {
    let canDnD = useSelector(state => state.navbar.CanDrgDrp)
    let textS = useSelector(state => state.navbar.TextSearch)
    const dispatch = useDispatch()
    function canSetDnD() {
        if (textS.trim() !== '') return false
        return true
    }
    const toggleDnD = () => {
        if (!canSetDnD()) {
            return
        }
        dispatch(toggleDragDrop())
    }
    const getLabel = () => {
        if (canDnD) return <strong>Drag & Drop</strong>
        return <strong style={{
            textDecoration: 'line-through',
            color: `#6c6c6c`
        }} >Drag & Drop</strong>
    }
    return (
        <div className='dnb-filter_container'>
            <div className="dnb-toggle-dnd">
                {getLabel()}
                <label className="dnb-switch">
                    {canSetDnD() && <input type='checkbox'
                        defaultChecked={canDnD} onClick={toggleDnD} />}
                    {!canSetDnD() && <input type='checkbox' disabled />}
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
    let unit = useSelector(state => state.navbar.Unit)
    const dispatch = useDispatch()
    const setSelectedOption = (option) => {
        dispatch(setUnit(option.label))
    }
    return (
        <div className='dnb-settings_container'>
            <strong className='dnb-lbl-unit'>Unit</strong>
            <Select
                className="dr-select-cont"
                classNamePrefix="dr-select"
                options={options}
                onChange={setSelectedOption}
                defaultValue={options.find(x => x.value === unit.View)} />
        </div>
    )
}
function Search() {
    let textS = useSelector(state => state.navbar.TextSearch)
    const dispatch = useDispatch()
    function setText(e) {
        const txt = e.target.value
        dispatch(setTextSearch(txt))
    }
    useEffect(() => {
        document.querySelectorAll('.dnb-btnadd').forEach(btn => {
            if (textS !== '')
                btn.style.visibility = 'hidden'
            else btn.style.visibility = ''
        })
    }, [textS])
    return (
        <form className="dform-search">
            <input className="din_search" placeholder="Search" type="search"
                name="q" autoComplete="off" aria-label="Search"
                defaultValue={textS} onChange={setText} />
            <button className="d-btn_search" type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 15 15" version="1.1">
                    <title>Search</title>
                    <desc>Created with Sketch.</desc>
                    <defs />
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g transform="translate(-2036.000000, -701.000000)" fill="#666666">
                            <path d="M2045.48325,711.885961 L2048.91249,715.315207 C2049.29876,715.701476 2049.9232,715.703302 2050.31325,715.313252 C2050.7006,714.925903 2050.69681,714.294096 2050.31521,713.912491 L2046.88596,710.483246 C2047.58733,709.501192 2048,708.298788 2048,707 C2048,703.686292 2045.31371,701 2042,701 C2038.68629,701 2036,703.686292 2036,707 C2036,710.313708 2038.68629,713 2042,713 C2043.29879,713 2044.50119,712.587332 2045.48325,711.885961 L2045.48325,711.885961 Z M2038,707 C2038,704.790861 2039.79086,703 2042,703 C2044.20914,703 2046,704.790861 2046,707 C2046,709.209139 2044.20914,711 2042,711 C2039.79086,711 2038,709.209139 2038,707 Z" />
                        </g>
                    </g>
                </svg>
            </button>
        </form>
    )
}