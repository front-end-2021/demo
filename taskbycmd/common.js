export const MonthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function getValidDays(month, year) {
    let lastDay = new Date(year, month, 0).getDate(); // Lấy ngày cuối cùng của tháng
    let days = Array.from({ length: lastDay }, (_, i) => i + 1); // Tạo danh sách ngày từ 1 đến lastDay
    return days;
}
export function genKeyHex(item) {
    let message = `${item.Name}${item.Begin}${item.End}`
    const hash = CryptoJS.MD5(message);
    item.Id = hash.toString(CryptoJS.enc.Hex)
}
export function getArrTime(item) {
    const tConfix = { hour: '2-digit', minute: '2-digit', hour12: true }
    let beginTime = getTimeDigit(item.Begin, tConfix);
    let endTime = getTimeDigit(item.End, tConfix);
    return [beginTime, endTime]
}
export function getTimeDigit(date, tConfix) { return date.toLocaleTimeString('en-US', tConfix) }
export function randomInt(min, max) {
    const minC = Math.ceil(min);
    const maxF = Math.floor(max);
    return Math.floor(Math.random() * (maxF - minC) + minC); // The maximum is exclusive and the minimum is inclusive
}
export function isEqualTime(d1, d2) {
    let t1 = d1.getHours()
    let t2 = d2.getHours()
    if (t1 != t2) return false
    t1 = d1.getMinutes()
    t2 = d2.getMinutes()
    if (t1 != t2) return false
    return true
}
function countEnter(txt) {
    if (typeof txt != 'string') return 0
    //https://charactercounter.com/count-characters-in-javascript
    let regex = /\n/g;
    let mTx = txt.match(regex)
    if (!mTx) return 0
    return mTx.length
}
export function clearSpace(str, nm) {
    if (typeof str != 'string') return nm
    str = str.trim()
    return str.replaceAll(' ', '')
}
export function addStrFirst(txt, str) {
    let lines = txt.split('\n')
    for (let ll = lines.length - 1, txLn; -1 < ll; ll--) {
        txLn = lines[ll]
        lines[ll] = `${str}${txLn}`
    }
    return lines.join('\n')
}
export function removeExtraSpaces(str) {
    if (typeof str != 'string') return str
    // Sử dụng regex để thay thế nhiều khoảng trắng liên tiếp bằng một khoảng trắng duy nhất
    return str.replace(/\s+/g, ' ').trim();
}
function removeSpecialChar(str) {
    if (typeof str != 'string') return str
    let regex = /[^a-zA-Z0-9+\-*/\()\s]/g;
    return str.replace(regex, '')
}
export function getStringBetween(str, startChar, endChar) {
    // Tạo regex để khớp với chuỗi giữa hai ký tự cụ thể
    const regex = new RegExp(`${startChar}(.*?)${endChar}`);
    const match = str.match(regex);
    return match ? match[1] : '';
}