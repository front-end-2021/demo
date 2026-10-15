/**
 * Xoá comment và dòng trống thừa khỏi mã nguồn trước khi phân tích,
 * để tên hàm / class nằm trong comment không bị tính là lời gọi. *
 * - Hiểu chuỗi ký tự: "http://a.b" hay '/* x *\/' trong chuỗi được giữ nguyên.
 * - Dòng chỉ chứa comment bị xoá hẳn; nhiều dòng trống liên tiếp gộp lại còn 1.
 * - Python: docstring ("""…""" đứng riêng một câu lệnh) cũng được coi là comment.
 * - Đổi CRLF → LF (dòng trống kiểu CRLF làm sai việc xác định khối theo thụt lề của Python).
 */

const C_LIKE = { line: '//', block: [['/*', '*/']], quotes: ['"', "'"] }

const SYNTAX = {
    //cs: { ...C_LIKE, triple: ['"""'], verbatim: true }, // @"…", $@"…", raw string """…"""
    cs: { ...C_LIKE, triple: ['"""'], verbatim: true, rawRun: true }, // raw string """…""" có thể dùng 4+ dấu nháy
    java: { ...C_LIKE, triple: ['"""'] }, // text block """…"""
    //js: { ...C_LIKE, quotes: ['"', "'", '`'] },
    js: { ...C_LIKE, quotes: ['"', "'", '`'], regex: true }, // nhận diện regex literal
    py: { line: '#', block: [], quotes: ['"', "'"], triple: ['"""', "'''"], docstring: true },
    css: { line: null, block: [['/*', '*/']], quotes: ['"', "'"] }, // CSS không có // (url(http://…) phải giữ nguyên)
    html: { line: null, block: [['<!--', '-->']], quotes: [] }, // giữ nguyên giá trị thuộc tính
}
const REGEX_PREV = '(,=:[!&|?{};+-*%<>~^'
const REGEX_KW = /(?:^|[^\w$.])(?:return|typeof|case|do|else|in|of|void|delete|throw|new|yield|await)$/

/** Dấu / ở đây có phải mở đầu regex literal (chứ không phải phép chia) không? */
function regexAllowed(line, lastSig) {
    const t = line.trimEnd()
    if (!t) return !lastSig || REGEX_PREV.includes(lastSig) // đầu dòng: dựa vào ký tự cuối của dòng trước
    if (t.endsWith('++') || t.endsWith('--')) return false
    return REGEX_PREV.includes(t[t.length - 1]) || REGEX_KW.test(t)
}

/** Vị trí dấu / đóng của regex bắt đầu ở i; -1 nếu không phải regex hợp lệ trên một dòng. */
function regexEnd(src, i) {
    let inClass = false
    for (let j = i + 1; j < src.length; j++) {
        const ch = src[j]
        if (ch === '\n') return -1
        if (ch === '\\') {
            if (src[j + 1] === '\n') return -1
            j++
            continue
        }
        if (inClass) {
            if (ch === ']') inClass = false
        } else if (ch === '[') inClass = true
        else if (ch === '/') return j
    }
    return -1
}

for (const ext of ['mjs', 'jsx', 'ts', 'tsx']) SYNTAX[ext] = SYNTAX.js

/** Bộ quét chung theo trạng thái: NORMAL → LINE_COMMENT / BLOCK_COMMENT / STRING. */
function strip(src, syn) {
    const triples = syn.triple || []
    let out = ''
    let line = ''
    let hasCode = false
    let hadComment = false
    let state = 'code'
    let endToken = ''
    let multiline = false
    let verbatim = false
    let lastSig = ''      // ký tự mã có nghĩa gần nhất (để đoán / là chia hay regex)
    let lastBlank = true  // dòng vừa ghi ra là dòng trống? (true từ đầu → bỏ dòng trống đầu file)

    const newline = () => {
        if (state === 'string') {
            // đang trong chuỗi nhiều dòng: giữ nguyên từng ký tự, không cắt khoảng trắng, không gộp dòng trống
            out += line + '\n'
            lastBlank = false
        } else if (hasCode) {
            out += line.replace(/[ \t]+$/, '') + '\n'
            lastBlank = false
        } else if (!hadComment && !lastBlank) {
            out += '\n' // gộp dòng trống ngay tại đây, không cần regex ở cuối
            lastBlank = true
        }
        line = ''
        hasCode = state === 'string'
        hadComment = state === 'block'
    }
    for (let i = 0; i < src.length; i++) {
        const c = src[i]
        if (c === '\n') {
            if (state === 'line') state = 'code'
            if (state === 'string' && !multiline) state = 'code'
            newline()
            continue
        }

        if (state === 'line') continue

        if (state === 'block') {
            if (src.startsWith(endToken, i)) {
                state = 'code'
                i += endToken.length - 1
                if (!line || /[ \t]$/.test(line)) {
                    while (src[i + 1] === ' ' || src[i + 1] === '\t') i++ // đã có khoảng trắng phía trước → bỏ khoảng trắng thừa phía sau
                } else if (!/\s/.test(src[i + 1] ?? '\n')) {
                    line += ' ' // a/**/b → "a b"
                }
            }
            continue
        }

        if (state === 'string') {
            line += c
            if (verbatim) {
                if (c === '"' && src[i + 1] === '"') { line += '"'; i++ } else if (c === '"') state = 'code'
            } else if (c === '\\' && endToken.length === 1) {
                if (src[i + 1] !== '\n') { line += src[i + 1] ?? ''; i++ }
            } else if (src.startsWith(endToken, i)) {
                line += endToken.slice(1)
                i += endToken.length - 1
                state = 'code'
            }
            continue
        }

        // ---- state === 'code' ----
        if (syn.line && src.startsWith(syn.line, i)) {
            state = 'line'
            hadComment = true
            continue
        }
        const block = syn.block.find(([open]) => src.startsWith(open, i))
        if (block) {
            state = 'block'
            endToken = block[1]
            hadComment = true
            i += block[0].length - 1
            continue
        }

        // regex literal của JS: giữ nguyên, không để // hay quote bên trong làm hỏng việc quét
        if (syn.regex && c === '/' && regexAllowed(line, lastSig)) {
            const end = regexEnd(src, i)
            if (end !== -1) {
                line += src.slice(i, end + 1)
                hasCode = true
                lastSig = ')'
                i = end
                continue
            }
        }

        let triple = triples.find((t) => src.startsWith(t, i))
        if (triple && syn.rawRun) {
            // C# 11: raw string có thể mở bằng 3, 4, 5… dấu nháy và phải đóng bằng đúng chừng đó
            let n = triple.length
            while (src[i + n] === triple[0]) n++
            triple = triple[0].repeat(n)
        }
        if (triple) {
            if (syn.docstring && /^[ \t]*[rRuUbBfF]{0,2}$/.test(line)) {
                line = line.replace(/[rRuUbBfF]+$/, '')
                hasCode = false
                state = 'block'
                endToken = triple
                hadComment = true
                i += triple.length - 1
                continue
            }
            state = 'string'
            endToken = triple
            multiline = true
            verbatim = false
            line += triple
            hasCode = true
            lastSig = '"'
            i += triple.length - 1
            continue
        }
        if (syn.verbatim && (src.startsWith('@"', i) || src.startsWith('$@"', i) || src.startsWith('@$"', i))) {
            const prefix = src[i + 1] === '"' ? '@"' : src.slice(i, i + 3)
            state = 'string'
            verbatim = true
            multiline = true
            line += prefix
            hasCode = true
            lastSig = '"'
            i += prefix.length - 1
            continue
        }
        if (syn.quotes.includes(c)) {
            state = 'string'
            endToken = c
            multiline = c === '`'
            verbatim = false
            line += c
            hasCode = true
            lastSig = c
            continue
        }

        line += c
        if (c !== ' ' && c !== '\t' && c !== '\r') {
            hasCode = true
            lastSig = c
        }
    }
    newline()
    return out.replace(/\n+$/, '\n') // việc gộp dòng trống và bỏ dòng trống đầu file đã làm trong newline()
}
// function strip(src, syn) {
//     const triples = syn.triple || []
//     let out = ''
//     let line = '' // dòng đang dựng
//     let hasCode = false // dòng hiện tại có mã thật (không chỉ khoảng trắng / comment)
//     let hadComment = false // dòng hiện tại có comment bị xoá
//     let state = 'code'
//     let endToken = '' // ký hiệu kết thúc của comment khối / chuỗi
//     let multiline = false // chuỗi được phép kéo qua nhiều dòng (` hoặc """)
//     let verbatim = false // chuỗi @"…" của C#: "" là dấu nháy, \ không phải ký tự thoát

//     const newline = () => {
//         if (hasCode) out += line.replace(/[ \t]+$/, '') + '\n'
//         else if (!hadComment) out += '\n' // dòng trống gốc: giữ lại, gộp ở bước cuối
//         line = ''
//         hasCode = state === 'string' // đang ở giữa chuỗi nhiều dòng thì dòng sau vẫn là mã
//         hadComment = state === 'block'
//     }

//     for (let i = 0; i < src.length; i++) {
//         const c = src[i]
//         if (c === '\n') {
//             if (state === 'line') state = 'code'
//             if (state === 'string' && !multiline) state = 'code' // chuỗi 1 dòng chưa đóng (thường do regex literal) → dừng tại cuối dòng
//             newline()
//             continue
//         }

//         if (state === 'line') continue

//         if (state === 'block') {
//             if (src.startsWith(endToken, i)) {
//                 state = 'code'
//                 i += endToken.length - 1
//                 line += ' ' // tránh dính 2 token: a/**/b → "a b"
//             }
//             continue
//         }

//         if (state === 'string') {
//             line += c
//             if (verbatim) {
//                 if (c === '"' && src[i + 1] === '"') { line += '"'; i++ } else if (c === '"') state = 'code'
//             } else if (c === '\\' && endToken.length === 1) {
//                 if (src[i + 1] !== '\n') { line += src[i + 1] ?? ''; i++ }
//             } else if (src.startsWith(endToken, i)) {
//                 line += endToken.slice(1)
//                 i += endToken.length - 1
//                 state = 'code'
//             }
//             continue
//         }

//         // ---- state === 'code' ----
//         if (syn.line && src.startsWith(syn.line, i)) {
//             state = 'line'
//             hadComment = true
//             continue
//         }
//         const block = syn.block.find(([open]) => src.startsWith(open, i))
//         if (block) {
//             state = 'block'
//             endToken = block[1]
//             hadComment = true
//             i += block[0].length - 1
//             continue
//         }
//         const triple = triples.find((t) => src.startsWith(t, i))
//         if (triple) {
//             // Docstring Python: chuỗi """…""" đứng đầu câu lệnh (trước nó chỉ có khoảng trắng / tiền tố r, u, b, f)
//             if (syn.docstring && /^[ \t]*[rRuUbBfF]{0,2}$/.test(line)) {
//                 line = line.replace(/[rRuUbBfF]+$/, '')
//                 hasCode = false
//                 state = 'block'
//                 endToken = triple
//                 hadComment = true
//                 i += 2
//                 continue
//             }
//             state = 'string'
//             endToken = triple
//             multiline = true
//             verbatim = false
//             line += triple
//             hasCode = true
//             i += 2
//             continue
//         }
//         if (syn.verbatim && (src.startsWith('@"', i) || src.startsWith('$@"', i) || src.startsWith('@$"', i))) {
//             const prefix = src[i + 1] === '"' ? '@"' : src.slice(i, i + 3)
//             state = 'string'
//             verbatim = true
//             multiline = true
//             line += prefix
//             hasCode = true
//             i += prefix.length - 1
//             continue
//         }
//         if (syn.quotes.includes(c)) {
//             state = 'string'
//             endToken = c
//             multiline = c === '`'
//             verbatim = false
//             line += c
//             hasCode = true
//             continue
//         }

//         line += c
//         if (c !== ' ' && c !== '\t' && c !== '\r') hasCode = true
//     }
//     newline()

//     return out
//         .replace(/\n{3,}/g, '\n\n') // nhiều dòng trống liên tiếp → 1 dòng trống
//         .replace(/^\n+/, '') // bỏ dòng trống ở đầu file
//         .replace(/\n+$/, '\n') // và ở cuối file
// }

/**
 * Xử lý riêng từng khối <tag …>…</tag> bằng `fn`, phần còn lại giữ nguyên.
 * Quét tuyến tính bằng indexOf (regex [\s\S]*? sẽ thành O(n²) khi file có nhiều thẻ mở mà không có thẻ đóng).
 */
function mapBlocks(src, tag, fn) {
    const lower = src.toLowerCase()
    const open = `<${tag}`
    const close = `</${tag}>`
    let out = ''
    let pos = 0
    for (; ;) {
        const start = lower.indexOf(open, pos)
        if (start === -1) break
        const bodyStart = lower.indexOf('>', start)
        if (bodyStart === -1) break
        const end = lower.indexOf(close, bodyStart)
        if (end === -1) break // thẻ không đóng → coi phần còn lại là HTML thường
        out += src.slice(pos, bodyStart + 1) + '\n' + fn(src.slice(bodyStart + 1, end))
        pos = end
    }
    return out + src.slice(pos)
}

/** Vue / HTML: xử lý riêng khối <script> (JS/TS) và <style> (CSS), phần template chỉ xoá <!-- -->. */
function stripVue(src) {
    const js = mapBlocks(src, 'script', (body) => strip(body, SYNTAX.js))
    return strip(mapBlocks(js, 'style', (body) => strip(body, SYNTAX.css)), SYNTAX.html)
}

/** Làm sạch mã nguồn theo đuôi file. Đuôi không hỗ trợ: chỉ chuẩn hoá xuống dòng. */
export function stripComments(content, ext) {
    const src = content.replace(/\r\n?/g, '\n')
    if (ext === 'vue') return stripVue(src)
    if (ext === 'html') return stripVue(src) // HTML cũng có thể chứa <script> / <style> nội tuyến
    const syn = SYNTAX[ext]
    return syn ? strip(src, syn) : src
}