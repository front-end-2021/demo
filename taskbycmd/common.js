export const MonthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function getValidDays(month, year) {
    let lastDay = new Date(year, month, 0).getDate(); // Lấy ngày cuối cùng của tháng
    let days = Array.from({ length: lastDay }, (_, i) => i + 1); // Tạo danh sách ngày từ 1 đến lastDay
    return days;
}
export function genKeyHex(item) {
    let message = `${item.Name}${item.Begin}${item.End}`
    const hash = CryptoJS.MD5(message);
    item.KeyMD5 = hash.toString(CryptoJS.enc.Hex)
}
export function getArrTime(item) {
    const tConfix = { hour: '2-digit', minute: '2-digit', hour12: true }
    let beginTime = new Date(item.Begin)
    beginTime = getTimeDigit(beginTime, tConfix)
    let endTime = new Date(item.End)
    endTime = getTimeDigit(endTime, tConfix)
    return [beginTime, endTime]
}
export function getTimeDigit(date, tConfix) {
    let lang = navigator.language || 'en-US'
    if (!tConfix) {
        tConfix = {
            hour: '2-digit', minute: '2-digit', hour12: true,
            day: '2-digit', month: 'short', year: 'numeric'
        }
        return date.toLocaleString(lang, tConfix)
    }
    return date.toLocaleTimeString(lang, tConfix)
}
export function randomInt(min, max) {
    const minC = Math.ceil(min);
    const maxF = Math.floor(max);
    return Math.floor(Math.random() * (maxF - minC) + minC); // The maximum is exclusive and the minimum is inclusive
}
export function isEqualTime(d1, d2) {
    d1 = new Date(d1)
    d2 = new Date(d2)
    let t1 = d1.getHours()
    let t2 = d2.getHours()
    if (t1 != t2) return false
    t1 = d1.getMinutes()
    t2 = d2.getMinutes()
    if (t1 != t2) return false
    return true
}
export function convertDic(array, map, key) {
    return array.reduce((acc, obj) => {
        acc.set(obj[key], obj);
        return acc;
    }, map)
}
export function getLsChild(items, paId) {
    const ls = []
    for (let ii = 0, item; ii < items.length; ii++) {
        item = items[ii]
        if (item.ParentId == paId) ls.push(item)
    }
    return ls
}
export function insertHTMLAtCursor(html) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    range.deleteContents();

    const fragment = range.createContextualFragment(html);
    range.insertNode(fragment);

    // Đặt lại con trỏ sau nội dung vừa chèn
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
}
export function convertSet(array, set, key) {
    if (typeof key == 'string' && key.length) {
        return array.reduce((acc, obj) => {
            acc.add(obj[key]);
            return acc;
        }, set)
    }
    return array.reduce((acc, obj) => {
        acc.add(obj);
        return acc;
    }, set)
}
export function hasText(str) {
    if (typeof str != 'string') return false
    if (!str.trim().length) return false
    return true
}
export function filterToLsTruncate(items, fnc) {
    let ls = []
    if (items instanceof Map) {
        for (const [key, item] of items) {
            if (fnc(item, key)) {
                ls.push(item)
                items.delete(key)
            }
        }
    } else if (items instanceof Set) {
        for (const item of items) {
            if (fnc(item)) ls.push(item)
            items.delete(item)
        }
    } else if (items instanceof Array) {
        for (let ii = 0, item; ii < items.length; ii++) {
            item = items[ii]
            if (fnc(item)) {
                ls.push(item)
                items.splice(ii, 1)
                ii--
            }
        }
    }
    return ls
}
export class Snowflake {
    #lastTimestamp
    #sequence
    constructor(machineId = 1n) {
        this.epoch = BigInt(1609459200000n); // Epoch của Twitter Snowflake (2021-01-01)
        this.machineId = BigInt(machineId); // Machine ID (0-1023)
        this.#sequence = 0n; // Sequence number
        this.#lastTimestamp = 0n; // Last generated timestamp
    }
    currentTimestamp() { return BigInt(Date.now()) }  // Get the current timestamp in milliseconds

    // Wait until the next millisecond if timestamps are the same
    waitNextMillis(lastTimestamp) {
        let timestamp = this.currentTimestamp();
        while (timestamp <= lastTimestamp) { timestamp = this.currentTimestamp() }
        return timestamp;
    }

    generate() {        // Generate a unique Snowflake ID
        let timestamp = this.currentTimestamp();
        if (timestamp === this.#lastTimestamp) {
            this.#sequence = (this.#sequence + 1n) & 4095n; // Sequence mask (12 bits)
            if (this.#sequence === 0n) { timestamp = this.waitNextMillis(this.#lastTimestamp) }
        } else { this.#sequence = 0n }

        this.#lastTimestamp = timestamp;

        // Construct the Snowflake ID (64 bits)
        return (
            ((timestamp - this.epoch) << 22n) | // Timestamp (41 bits)
            (this.machineId << 12n) | // Machine ID (10 bits)
            this.#sequence // Sequence (12 bits)
        )
    }
    decode(snowflakeId) {
        const timestamp = (BigInt(snowflakeId) >> 22n) + this.epoch;
        const machineId = (BigInt(snowflakeId) >> 12n) & 0x3FFn; // 10 bit cho máy chủ
        const sequence = BigInt(snowflakeId) & 0xFFFn; // 12 bit cho số thứ tự
        return {
            timestamp: new Date(Number(timestamp)),
            machineId: Number(machineId),
            sequence: Number(sequence)
        }
    }
}
// let snowflake = new Snowflake(42n); // Custom epoch and machine ID
// console.log(snowflake.generate().toString()); // Generate a unique ID
export function groupByYear(objects, oMap = new Map()) {
    return objects.reduce((map, obj) => {
        const year = new Date(obj.Begin).getFullYear(); // Lấy năm từ chuỗi ngày
        const lst = map.get(year) || []; // Lấy danh sách hiện tại cho năm này, hoặc tạo mới nếu chưa có
        lst.push(obj); // Thêm object vào danh sách
        map.set(year, lst); // Cập nhật Map với danh sách mới
        return map;
    }, oMap);
}
export function groupByMonth(objects, oMap = new Map()) {
    return objects.reduce((map, obj) => {
        let month = new Date(obj.Begin).getMonth();
        month += 1
        const lst = map.get(month) || [];
        lst.push(obj);
        map.set(month, lst);
        return map;
    }, oMap);
}
export function groupByDate(objects, oMap = new Map()) {
    return objects.reduce((map, obj) => {
        const date = new Date(obj.Begin).getDate();
        const lst = map.get(date) || [];
        lst.push(obj);
        map.set(date, lst);
        return map;
    }, oMap);
}
export function sortMapByKey(map) {
    // Sắp xếp các cặp [key, value] theo key tăng dần
    const sortedEntries = [...map.entries()].sort((a, b) => a[0] - b[0]);
    return new Map(sortedEntries); // Tạo Map mới từ các cặp đã sắp xếp
}
function insertPlainText(text) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));

    // Đặt lại con trỏ sau đoạn vừa chèn
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
}
function countEnter(txt) {
    if (typeof txt != 'string') return 0
    //https://charactercounter.com/count-characters-in-javascript
    let regex = /\n/g;
    let mTx = txt.match(regex)
    if (!mTx) return 0
    return mTx.length
}
function clearSpace(str, nm) {
    if (typeof str != 'string') return nm
    str = str.trim()
    return str.replaceAll(' ', '')
}
function addStrFirst(txt, str) {
    let lines = txt.split('\n')
    for (let ll = lines.length - 1, txLn; -1 < ll; ll--) {
        txLn = lines[ll]
        lines[ll] = `${str}${txLn}`
    }
    return lines.join('\n')
}
function removeExtraSpaces(str) {
    if (typeof str != 'string') return str
    // Sử dụng regex để thay thế nhiều khoảng trắng liên tiếp bằng một khoảng trắng duy nhất
    return str.replace(/\s+/g, ' ').trim();
}
function removeSpecialChar(str) {
    if (typeof str != 'string') return str
    let regex = /[^a-zA-Z0-9+\-*/\()\s]/g;
    return str.replace(regex, '')
}
function getStringBetween(str, startChar, endChar) {
    // Tạo regex để khớp với chuỗi giữa hai ký tự cụ thể
    const regex = new RegExp(`${startChar}(.*?)${endChar}`);
    const match = str.match(regex);
    return match ? match[1] : '';
}
function numberToWords(n) {
    if (n === 0) return "zero";
    const belowTwenty = ["", "one", "two", "three", "four", "five", "six",
        "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen",
        "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty",
        "sixty", "seventy", "eighty", "ninety"];
    const thousands = ["", "thousand", "million", "billion"];
    function threeDigitToWords(num) {
        let str = "";
        if (num >= 100) {
            str += belowTwenty[Math.floor(num / 100)] + " hundred";
            num %= 100;
            if (num) str += " ";
        }
        if (num >= 20) {
            str += tens[Math.floor(num / 10)];
            if (num % 10) str += "-" + belowTwenty[num % 10];
        } else if (num > 0) {
            str += belowTwenty[num];
        }
        return str;
    }
    let result = "";
    let i = 0;
    while (n > 0) {
        const chunk = n % 1000;
        if (chunk !== 0) {
            const words = threeDigitToWords(chunk);
            result = words + (thousands[i] ? " " + thousands[i] : "") + (result ? " " + result : "");
        }
        n = Math.floor(n / 1000);
        i++;
    }
    return result.trim();
}