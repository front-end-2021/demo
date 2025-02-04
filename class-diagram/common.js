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
export function isAbstract(type) {
    if (typeof type != 'string' || !type.length) return false
    if (type.includes('abstract')) return true
    return false
}
export function isClass(type) {
    if (typeof type != 'string' || !type.length) return false
    if (type.includes('class')) return true
    return false
}
export function isInterface(type) {
    if (typeof type != 'string' || !type.length) return false
    if (type.includes('interface')) return true
    return false
}
export function isEnum(type) {
    if (typeof type != 'string' || !type.length) return false
    if (type.includes('enum')) return true;
    return false
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
    if (symb.includes('+')) symb = symb.replace('+', '  public')
    if (symb.includes('-')) symb = symb.replace('-', '  private')
    if (symb.includes('#')) symb = symb.replace('#', '  protected')
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
    ['init', 'Constructor', 'Constructor']
]
export const ListKeyword = [
    'int', 'float', 'double', 'char',
    'if', 'else', 'switch', 'case',
    'for', 'while', 'do', 'break', 'continue',
    'return', 'void', 'static',
    'try', 'catch', 'finally', 'throw',
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
export const PropName = 'ProperName()'
export function objNewCls(nCls, id, top, left) {
    const fNm = 'fieldName'
    const cNm = 'ClassName'
    if (!nCls) {
        return {
            id, type: 'instant class', Name: cNm, toIds: [],
            top, left, width: 220, height: 100,
            Fields: [
                { AcModify: '#', Name: fNm, Type: 'String' },
            ],
            Properties: [
                ['+', PropName, 'String', 'get'],
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
    for (let ii = 0, field, txt; ii < cItem.Fields.length; ii++) {
        field = cItem.Fields[ii]
        txt = field.AcModify
        txt = convertSymb(txt, isView)
        field.AcModify = txt.trim()
    }
    for (let ii = 0, prp, txt; ii < cItem.Properties.length; ii++) {
        prp = cItem.Properties[ii]
        txt = prp[0]
        txt = convertSymb(txt, isView)
        prp[0] = txt.trim()
        prp[3] = convertAccessors(prp[3], il)
    }
}
export function inOverview(item, items) {
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