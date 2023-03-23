import React, { Component, useState } from "react"
import { setUnit, TypeUnit } from "../../global/ReduxStore/Filter"
import { useDispatch, useSelector } from "react-redux"
import '../../styles/navigation.scss'
export class NavigationView extends Component {

    render() {
        return (
            <nav className='dnb-navbar'>
                <Filter />
                <Settings />
            </nav>
        )
    }
}
class Filter extends Component {

    render() {
        return (
            <div className='dnb-filter_container'>
                filter
            </div>
        )
    }
}
function Settings() {
    const unit = useSelector(state => state.filter.Unit)
    const dispatch = useDispatch()
    const onSelect = (event) => {
        const newVal = event.target.value
        dispatch(setUnit(newVal))
    }
    return (
        <div className='dnb-settings_container'>
            <strong className='dnb-lbl-unit'>Unit</strong>
            <select onChange={onSelect} name="unit" defaultValue={unit}>
                {
                    TypeUnit.map(unit => {
                        return <option key={unit.Name}
                            value={unit.Name}>{unit.Name}</option>
                    })
                }
            </select>
        </div>
    )
}