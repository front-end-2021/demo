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
    if (typeof symb != 'string') return
    if (isStr) {
        symb = symb.toLowerCase()
        if (symb.includes('public')) return symb.replace('public', '+')
        if (symb.includes('private')) return symb.replace('private', '-')
        if (symb.includes('protected')) return symb.replace('protected', '#')
        return
    }
    if (symb.includes('+')) return symb.replace('+', 'public')
    if (symb.includes('-')) return symb.replace('-', 'private')
    if (symb.includes('#')) return symb.replace('#', 'protected')
}
export const StructTypes = [
    ['interface', 'interface', 'interface'],
    ['abstract class', 'abstract class', 'abstract class'],
    ['instant class', 'class', 'class'],
    ['enum', 'enum', 'enum'],
    ['struct', 'struct', 'struct'],
]
export const AccessInit = [
    ['get', 'get'],
    ['set', 'set'],
    ['init', 'Constructor']
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
        if (acs.includes(AccessInit[2][0])) txt = AccessInit[2][il]
        return txt
    }
    if (acs.includes(AccessInit[2][1])) txt = AccessInit[2][0]
    return txt
}
export function clearSpace(str, nm) {
    if (typeof str != 'string') return nm
    str = str.trim()
    return str.replaceAll(' ', '')
}
export function objNewCls(nCls, id, top, left) {
    const fNm = 'fieldName'
    const cNm = 'ClassName'
    const gFn = 'GetFunction()'
    const sFn = 'SetFunction()'
    if (!nCls) {
        return {
            id, type: 'instant class', Name: cNm, toIds: [],
            top, left, width: 220, height: 100,
            Fields: [
                { AcModify: '#', Name: fNm, Type: 'String' },
            ],
            Properties: [
                ['+', cNm, '', 'init'],
                ['+', gFn, 'String', 'get'],
                ['+', sFn, 'void', 'set'],
            ]
        }
    }
    if (typeof nCls.Name != 'string') return null
    nCls.Name = nCls.Name.trim()
    if (cNm == nCls.Name) return null
    let lst = nCls.Fields
    nCls.Fields = lst.filter(x => x.Name != fNm)
    lst = nCls.Properties
    nCls.Properties = lst.filter(x => x[1] != cNm && x[1] != gFn && x[1] != sFn)
    if (nCls.type.includes('struct')) {
        delete nCls.toIds
    } else if (isEnum(nCls.type)) {
        nCls.Fields = nCls.Fields.map(x => { return { Name: x.Name } })
        nCls.Properties = []
        delete nCls.toIds
    } else if (isInterface(nCls.type)) {
        nCls.Fields = []
    }
}