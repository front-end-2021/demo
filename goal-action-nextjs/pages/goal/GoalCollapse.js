import { Component } from "react"
import {
    getDataGoalAction, getDataGoalActionWith,
    insertSub, deleteSubApi,
    insertMain, deleteMainApi
} from "../../service"
import {
    getExpC, getTrueC, getDateAfterDaysString
    , getDateString, getIcon, isDateLessNow
} from "../../global"
import { FormEditGoal } from "./GoalItem"
import { GoalItem } from "./GoalItem"
import { Subgoal } from "./Subgoal"
import 'bootstrap-icons/font/bootstrap-icons.css'
import style from '../../styles/ga.module.scss'

export function GoalActionCollapse({
    typeid, lessC, children,
    name, isDone, start, end,
    handleExpand }) {
    function getStartTag() {
        if (!start) return <></>
        return <>
            <span className={`bi bi-calendar2-week${getClassOverDate(start)}`} />
            {
                !isDateLessNow(start) ? <span
                    className={`dnb-d-start`}>&nbsp;{getDateString(start)}</span> :
                    <span title="Start Date is in the past from Current Date"
                        className={`dnb-d-start${getClassOverDate(start)}`}>&nbsp;{getDateString(start)}</span>
            }
        </>
    }
    function getEndTag() {
        if (!end) return <></>
        return <>
            <span className={style.dnb_d_div}>&minus;</span>
            {
                !isDateLessNow(end) ? <span className="dnb-d-end">{getDateString(end)}</span> :
                    <span title="End Date is in the past from Current Date"
                        className="dnb-d-end">{getDateString(end)}</span>
            }
        </>
    }
    function getNameTag() {
        if (lessC < 0) {
            return <div title="Expected Cost is less then True Cost"
                className={`${style.dnb_item_title} ${style.d_exp_less_true}`}
                onClick={() => handleExpand()}>{getIcon(typeid)} {name}</div>
        }
        return <div className={style.dnb_item_title}
            onClick={() => handleExpand()}>{getIcon(typeid)} {name}</div>
    }
    function getClsWrap(){
        return `${style.dnb_item_container} ${style.d_item_collapse}${isDone ? ` ${style.dnb_item_done}` : ''}`
    }
    return (
        <div className={getClsWrap()}>
            {getNameTag()}
            <div className={style.dnb_item_cost}>
                {children}
            </div>
            <div className={style.dnb_item_date + getClassOverDate(end)}>
                {getStartTag()}
                {getEndTag()}
            </div>
            <style jsx>{`.bi-layout-sidebar {cursor: pointer}
            .bi-layout-sidebar::before {transform: rotate(-90deg);}`}</style>
        </div>
    )
}
function getClassOverDate(start_end) {
    if (isDateLessNow(start_end)) {
        return ` ${style.dnb_past_date}`
    }
    return ''
}