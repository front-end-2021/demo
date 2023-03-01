export function getExpC(lstExp) {
    return lstExp.reduce((acu, crt) => acu + crt, 0)
}
export function getTrueC(lstTrue) {
    return lstTrue.reduce((acu, crt) => acu + crt, 0)
}
export function getTrueCost(listSub) {
    const { ListAction } = this.context
    const lstTrue = listSub.map(s => ListAction.filter(a => a.ParentId === s.Id).map(a => a.TrueCost))[0]
    return Array.isArray(lstTrue) ? getTrueC(lstTrue) : 0
}
export function getDateString(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (!(d instanceof Date)) return ''
    return d.toDateString().slice(4)
}
export function getDateCalendarValue(dateStr){
    if(!dateStr ) return ''
    const d0 = new Date(dateStr)
    const d = new Date(d0.getTime() + 24000 * 3600)
    return d.toISOString().split('T')[0]
}
export function getDateAfterDaysString(dayAfter){
    const dN = Date.now() + dayAfter * 24000 * 3600
    const d = new Date(dN)
    return d.toDateString().slice(4)
}
export function getIcon(typeid) {
    if (typeid === 1) return <>&#9673;</>
    if (typeid === 2) return <>&#9670;</>
    return <>&#9632;</>
}
export function isDateLessNow(start_end) {
    if (!start_end) return false
    const _date = new Date(start_end)
    const now = new Date(new Date().toDateString())
    return _date.getTime() < now.getTime()
}