
import { isDateLessNow,getIcon,getDateString } from "../../global"
import '../../../node_modules/bootstrap-icons/font/bootstrap-icons.css'
import '../../styles/ga.scss'

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
            <span className={`dnb_d_div`}>&minus;</span>
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
                className={`dnb_item_title d_exp_less_true`}
                onClick={() => handleExpand()}>{getIcon(typeid)} {name}</div>
        }
        return <div className={`dnb_item_title`}
            onClick={() => handleExpand()}>{getIcon(typeid)} {name}</div>
    }
    function getClsWrap() {
        return `dnb_item_container d_item_collapse${isDone ? ` dnb_item_done` : ''}`
    }
    return (
        <div className={getClsWrap()}>
            {getNameTag()}
            <div className={`dnb_item_cost`}>
                {children}
            </div>
            <div className={`dnb_item_date ${getClassOverDate(end)}`}>
                {getStartTag()}
                {getEndTag()}
            </div>
        </div>
    )
}
function getClassOverDate(start_end) {
    if (isDateLessNow(start_end)) {
        return ` dnb_past_date`
    }
    return ''
}