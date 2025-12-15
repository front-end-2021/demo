function countEnter(txt) {
    if (typeof txt != 'string') return 0
    //https://charactercounter.com/count-characters-in-javascript
    let regex = /\n/g;
    let mTx = txt.match(regex)
    if (!mTx) return 0
    return mTx.length
}
export function setHeight(textarea, txt) {
    let cEnt = countEnter(txt)
    if (6 <= cEnt) {
        if (cEnt <= 9) textarea.style.height = `${cEnt * 18}px`
        else textarea.style.height = `${cEnt * 16}px`
    } else textarea.style.height = ''
}
export function processLines(txt) {
    if (typeof txt != 'string') return txt
    let txTrim = txt.trim()
    if (!txTrim.length) return ''
    const arrLn = txt.split('\n')
    if (arrLn.length < 1) return txt
    if (arrLn.length < 2) {
        let str1 = arrLn[0]
        txTrim = str1.trim()
        return txTrim.replace(/  +/g, ' ')
    }
    for (let ln = 0, line; ln < arrLn.length; ln++) {
        line = arrLn[ln]
        let i0 = 0, chr     // i0 = index char != ''
        for (const len = line.length; i0 < len; i0++) {
            chr = line[i0]
            if (chr != ' ') break;
        }
        if (0 < i0) {
            const str0 = line.slice(0, i0)
            let str1 = line.slice(i0)
            txTrim = str1.trim()
            arrLn[ln] = `${str0}${txTrim.replace(/  +/g, ' ')}`
            continue        // for ln
        } else {
            txTrim = line.trim()
            arrLn[ln] = txTrim.replace(/  +/g, ' ')
        }
    }
    return arrLn.join('\n')
}
export function convertSymb(symb, isStr) {
    if (typeof symb != 'string') return symb
    symb = symb.trim()
    if (isStr) {
        symb = symb.toLowerCase()
        if (symb.includes('public')) symb = symb.replace('public', '+')
        if (symb.includes('private')) symb = symb.replace('private', '-')
        if (symb.includes('protected')) symb = symb.replace('protected', '#')
        return symb
    }
    if (symb.includes('+')) symb = symb.replace('+', 'public')
    if (symb.includes('-')) symb = symb.replace('-', 'private')
    if (symb.includes('#')) symb = symb.replace('#', 'protected')
    return symb
}
export const StructTypes = [
    ['interface', 'interface', 'interface'],
    ['abstract class', 'abstract class', 'abstract class'],
    ['instant class', 'class', 'class'],
    ['enum', 'enum', 'enum'],
    ['struct', 'struct', 'struct'],
]
export const AccessInit = [
    ['get', 'get', 'get'],
    ['set', 'set', 'set'],
    ['init', 'constructor', 'constructor']
]
export function convertAccessors(acs, il) {
    let txt = acs
    if (typeof il == 'number') {
        if (acs.includes(AccessInit[2][0])) {
            txt = AccessInit[2][il]
            return txt
        }
        if (acs.includes(AccessInit[2][il])) txt = AccessInit[2][0]
        return txt
    }
    return ''
}
export function clearSpace(str, nm) {
    if (typeof str != 'string') return nm
    str = str.trim()
    return str.replaceAll(' ', '')
}
export const cellSize = 10
export const cellEmpty = 'E'
export const cellBlock = 'B'
export function getRows(height) { return height / cellSize }
export function getCols(width) { return width / cellSize }
export function genBoards(rows, cols) {
    let brd = [], i, j, row
    for (i = 0; i < rows; i++) {
        row = [];
        for (j = 0; j < cols; j++) row.push(cellEmpty);
        brd.push(row);
    }
    return brd
}
export function setCell(board, ix, iy, value) { board[ix][iy] = value }
export function doInRange([ix0, iy0, ix1, iy1], fnc) {
    for (let ix = ix0; ix < ix1; ix++) {
        for (let iy = iy0; iy < iy1; iy++) fnc(ix, iy)
    }
}
function build_iXiY(x, y) {
    let ix = Math.floor(x / cellSize)
    let iy = Math.floor(y / cellSize)
    return [ix, iy]
}
export function build_xy(ix, iy) {
    let x = ix * cellSize
    let y = iy * cellSize
    return [x, y]
}
export function getArea(cls) {
    let [ix0, iy0] = build_iXiY(cls.left, cls.top)
    let [ix1, iy1] = build_iXiY(cls.left + cls.width, cls.top + cls.height)
    return [ix0, iy0, ix1, iy1]
}
export const PropName = 'ProperName'
export function objNewCls(nCls, id, top, left) {
    const fNm = 'fieldName'
    const cNm = 'ClassName'
    if (!nCls) {
        let type = StructTypes[2][0]    //'instant class'
        return {
            id, type, Name: cNm, toIds: [],
            top, left, width: 220, height: 100,
            Fields: [
                { Visible: '#', Name: fNm, Type: 'String' },
            ],
            Methods: [
                ['+', PropName, '', 'void', AccessInit[1][0]],
            ]
        }
    }
    if (typeof nCls.Name != 'string') return null
    nCls.Name = nCls.Name.trim()
    if (cNm == nCls.Name) return null
    let lst = nCls.Fields
    nCls.Fields = lst.filter(x => x.Name != fNm)
    lst = nCls.Properties
    nCls.Properties = lst.filter(x => x[1] != cNm && x[1] != PropName)
    if (nCls.type.includes('struct')) {
        delete nCls.toIds
        return nCls
    }
    if (isEnum(nCls.type)) {
        nCls.Fields = nCls.Fields.map(x => { return { Name: x.Name } })
        nCls.Properties = []
        delete nCls.toIds
        return nCls
    }
    if (isInterface(nCls.type)) {
        nCls.Fields = []
    }
    return nCls
}
export function verifySave(cItem, il, isView) {

}
export function isOverlap(item, items) {
    const lstArea = areaBlocks(item.id)
    let x = item.left,
        y = item.top,
        w = item.width,
        h = item.height

    for (let ii = 0; ii < lstArea.length; ii++) {
        const [x0, y0, w0, h0] = lstArea[ii]
        if (x + w < x0 - 30 || x0 + w0 < x - 30) continue
        if (y + h < y0 - 30 || y0 + h0 < y - 30) continue
        return true
    }
    return false

    function areaBlocks(id) {
        const lst = []
        for (let ii = 0, item; ii < items.length; ii++) {
            item = items[ii]
            if (item.id === id) continue
            let x = item.left
            let y = item.top
            let w = item.width
            let h = item.height
            lst.push([x, y, w, h])
        }
        return lst
    }
}
export function truncateIds(oList) {
    const nList = JSON.parse(JSON.stringify(oList))     // copy
    const mpIds = []
    for (let ii = 0, item; ii < oList.length; ii++) {
        item = oList[ii]
        mpIds.push([item.id, ii + 1])       // [oldId, newId]
    }
    if (!mpIds.filter(x => x[0] != x[1]).length) return nList

    for (let ii = 0, item; ii < mpIds.length; ii++) {
        item = mpIds[ii]

        updateToIds(item[0], item[1])       // 1st update others

        if (item[0] === item[1]) continue;  // old = new

        let nItem = nList[ii]
        nItem.id = item[1]                  // 2nd
    }
    return nList

    function updateToIds(oId, nId) {
        for (let ii = 0, item; ii < nList.length; ii++) {
            item = nList[ii]
            if (!item.toIds || !item.toIds.length) continue;
            if (item.id === oId) continue;           // itself
            let ij = item.toIds.indexOf(oId)
            if (ij < 0) continue
            item.toIds.splice(ij, 1, nId)   // replace
        }
    }
}
export function hasnMethod(item) {
    if (!item.Properties || !item.Properties.length) return true
    return false
}
export function verifyName(name, lstNo) {
    let vName = name
    let nms = lstNo.filter(x => vName === x)
    if (nms.length < 2) return vName
    let index = 1
    vName = `${name}${index}`
    while (lstNo.includes(vName)) {
        index += 1
        vName = `${name}${index}`
    }
    return vName

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
export function verifyExportTxt(str) {
    let txt = removeSpecialChar(str)
    return removeExtraSpaces(txt)
}
export function getLstExt(lsMthd, items) {
    const lst = []
    for (let ii = 0, item; ii < items.length; ii++) {
        item = items[ii]
        for (let jj = 0, prp, oPrp; jj < item.Properties.length; jj++) {
            prp = item.Properties[jj]
            oPrp = lsMthd.find(xx => getPropKey(prp, prp.Name) == getPropKey(xx, xx.Name))
            if (!oPrp) lst.push(prp)
        }
    }
    return lst
}
export function getPropKey(prp, name = '') { return `${name}(${prp.params.map(x => x[1] + ' ' + x[0]).join(', ')})` }
export function initPoint(rItem, lsImpl, lsExtn, lsComp, lsAsso, lsAggr) {
    return {
        item: rItem,
        Implements: lsImpl,     // List<item>
        Extends: lsExtn,        // List<item>
        Compositions: lsComp,   // List<[item, lsTxt]>
        Aggregations: lsAggr,   // List<[item, lsTxt]>
        Associations: lsAsso,   // List<item>
    }
}
export function getStringBetween(str, startChar, endChar) {
    // Tạo regex để khớp với chuỗi giữa hai ký tự cụ thể
    const regex = new RegExp(`${startChar}(.*?)${endChar}`);
    const match = str.match(regex);
    return match ? match[1] : '';
}