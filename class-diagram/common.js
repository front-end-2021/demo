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
export function isStruct(type) {
    if (typeof type != 'string' || !type.length) return false
    if (type.includes('struct')) return true;
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
                { Visible: '#', Name: fNm, Type: 'String' },
            ],
            Methods: [
                ['+', PropName, 'String', 'get'],
            ]
        }
    }
    if (typeof nCls.Name != 'string') return null
    nCls.Name = nCls.Name.trim()
    if (cNm == nCls.Name) return null
    let lst = nCls.Fields
    nCls.Fields = lst.filter(x => x.Name != fNm)
    lst = nCls.Methods
    nCls.Methods = lst.filter(x => x[1] != cNm && x[1] != PropName)
    if (nCls.type.includes('struct')) {
        delete nCls.toIds
        return nCls
    }
    if (isEnum(nCls.type)) {
        nCls.Fields = nCls.Fields.map(x => { return { Name: x.Name } })
        nCls.Methods = []
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
        txt = field.Visible
        if (typeof txt != 'string') continue;
        txt = convertSymb(txt, isView)
        field.Visible = txt.trim()
    }
    for (let ii = 0, prp, txt; ii < cItem.Methods.length; ii++) {
        prp = cItem.Methods[ii]
        txt = prp[0]
        if (typeof txt != 'string') continue;
        txt = convertSymb(txt, isView)
        prp[0] = txt.trim()
        prp[3] = convertAccessors(prp[3], il)
    }
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
    if (!item.Methods || !item.Methods.length) return true
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
// function extractEndDigits(str) {
//     // Sử dụng regex để tìm các chữ số ở cuối chuỗi
//     const match = str.match(/\d+$/);
//     return match ? match[0] : ''
// }
// function removeEndDigits(str) {
//     // Sử dụng regex để tìm và loại bỏ các chữ số ở cuối chuỗi
//     return str.replace(/\d+$/, '');
// }
// function removeNum(str) {
//     //str = "Đây là chuỗi chứa các số: 123, 456 và 789.";
//     return str.replace(/\d+/g, '');
//     //console.log(newStr); // Output: "Đây là chuỗi chứa các số: ,  và ."
// }
function buildExtends(lst, isDel) {
    let names = lst.map(x => x.Name)
    for (let ii = 0, item; ii < lst.length; ii++) {

    }
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
export function verifyExportTxt(str) {
    let txt = removeSpecialChar(str)
    return removeExtraSpaces(txt)
}
export function getLstExt(id, tIds, prps, lstCls, fnc) {
    const lst = []
    for (let ii = 0, xx, oPrp; ii < lstCls.length; ii++) {
        xx = lstCls[ii]
        if (xx.id == id) continue   // it-self
        if (fnc(xx.type)) continue
        if (hasnMethod(xx)) continue;
        if (!tIds.includes(xx.id)) continue
        for (let jj = 0, prp, name; jj < xx.Methods.length; jj++) {
            prp = xx.Methods[jj]
            name = prp[1]
            oPrp = prps.find(xx => name == xx[1])
            if (!oPrp) {
                lst.push(prp)
            }
        }
    }
    return lst
}

function indexesBoyerMoore(text, pattern) {
    const m = pattern.length;
    const n = text.length;
    const badChar = Array(256).fill(-1);

    // Tạo bảng bad character
    for (let i = 0; i < m; i++) {
        badChar[pattern.charCodeAt(i)] = i;
    }
    const lsI = []
    let s = 0; // s là vị trí dịch chuyển của mẫu so với văn bản
    let j = -1
    while (s <= (n - m)) {
        j = m - 1;

        // Giảm j khi các ký tự của mẫu và văn bản khớp nhau
        while (0 <= j && pattern[j] === text[s + j]) {
            j--;
        }

        // Nếu mẫu khớp hoàn toàn với văn bản
        if (j < 0) {
            //console.log("Pattern found at index " + s);
            lsI.push(s)
            s += (s + m < n) ? m - badChar[text.charCodeAt(s + m)] : 1;
        } else {
            s += Math.max(1, j - badChar[text.charCodeAt(s + j)]);
        }
    }
    return lsI
}
class AhoCorasick {
    constructor(patterns) {
        this.setPatterns(patterns)
    }
    buildTrie(patterns) {
        for (const pattern of patterns) {
            let node = this.trie;
            for (const char of pattern) {
                if (!node[char]) {
                    node[char] = {};
                }
                node = node[char];
            }
            node.isEnd = true;
        }
    }
    buildFailureLinks() {
        const queue = [];
        for (const char in this.trie) {
            this.trie[char].fail = this.trie;
            queue.push(this.trie[char]);
        }

        while (queue.length > 0) {
            const node = queue.shift();
            for (const char in node) {
                if (char === 'fail' || char === 'isEnd') continue;
                let fail = node.fail;
                while (fail && !fail[char]) {
                    fail = fail.fail;
                }
                node[char].fail = fail ? fail[char] : this.trie;
                queue.push(node[char]);
            }
        }
    }
    setPatterns(patterns) {
        this.trie = {};
        this.buildTrie(patterns);
        this.buildFailureLinks();
    }
    indexes(text) {
        let node = this.trie;
        const results = [];
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            while (node && !node[char]) {
                node = node.fail;
            }
            node = node ? node[char] : this.trie;
            if (node.isEnd) {
                results.push(i);
            }
        }
        return results;
    }
}
//// Ví dụ sử dụng
// let patterns = ["apple", "banana", "cherry"];
// const ac = new AhoCorasick(patterns);
// let text = `This function simply follows edges of Trie of all words in arr[]. It is cherry
//           represented as 2D array g[][] wherebanana
//           we store next state for current state I have an apple and a banana. and character`;
// let result = ac.indexes(text);
// console.log(result); // In ra các vị trí tìm thấy các mẫu