export function getExpC(lstExp) {
    return lstExp.reduce((acu, crt) => acu + crt, 0)
}
export function getTrueC(lstTrue) {
    return lstTrue.reduce((acu, crt) => acu + crt, 0)
}
export function getDateString(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (!(d instanceof Date)) return ''
    return d.toDateString().slice(4)
}
export function getDateCalendarValue(dateStr) {
    if (!dateStr) return ''
    const d0 = new Date(dateStr)
    const d = new Date(d0.getTime() + 24000 * 3600)
    return d.toISOString().split('T')[0]
}
export function getDateAfterDaysString(dayAfter) {
    const dN = Date.now() + dayAfter * 24000 * 3600
    const d = new Date(dN)
    return d.toDateString().slice(4)
}
export function getIcon(typeid) {
    if (typeid < 2) return <>&#9673;</>
    if (typeid < 3) return <>&#9830;</>
    return <>&#11205;</>
}
export function isDateLessNow(start_end) {
    if (!start_end) return false
    const _date = new Date(start_end)
    const now = new Date(new Date().toDateString())
    return _date.getTime() < now.getTime()
}
export function isEqualObject(item1, item2) {
    if (typeof item1 != 'object') return false
    if (typeof item2 != 'object') return false
    if (Array.isArray(item1)) return false
    if (Array.isArray(item2)) return false

    const arr1 = Object.keys(item1).map((key) => { return { key, value: item1[key] } });
    const arr2 = Object.keys(item2).map((key) => { return { key, value: item2[key] } });

    arr1.sort((a, b) => a.key - b.key)
    arr2.sort((a, b) => a.key - b.key)

    const ar1 = arr1.map(x => x.key + x.value)
    const ar2 = arr2.map(x => x.key + x.value)

    return ar1.join('') === ar2.join('')
}
// #region //https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
// left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
function preventDefault(e) {
    e.preventDefault();
}
function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}
// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () {
            supportsPassive = true; return true
        }
    }));
} catch (e) { }
const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
// call this to Disable
export function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}
// call this to Enable
export function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}
// #endregion