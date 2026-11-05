// parsers/common.js — Tiện ích quét mã dùng chung cho các parser Java / Kotlin / Python.
// (Parser C# có bản sao riêng của vài hàm này vì nó được đối chiếu từng chữ với parser gốc của class-diagram.)
//
// maskSource() là nền tảng: trả về văn bản CÙNG ĐỘ DÀI, trong đó comment và nội dung chuỗi/ký tự đã bị thay bằng
// khoảng trắng (dấu xuống dòng được giữ). Nhờ vậy chỉ cần đếm dấu ngoặc / tìm từ khoá trên văn bản đã che, mà
// vị trí và số dòng vẫn khớp tuyệt đối với file gốc (không cần bản đồ vị trí).

/** Dòng (từ 1) của một vị trí trong văn bản. */
export function makeLineLookup(src) {
  const starts = [0]
  for (let i = 0; i < src.length; i++) if (src.charCodeAt(i) === 10) starts.push(i + 1)
  return (idx) => {
    let lo = 0
    let hi = starts.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (starts[mid] <= idx) lo = mid
      else hi = mid - 1
    }
    return lo + 1
  }
}

/** Vị trí ngay SAU dấu đóng tương ứng với dấu mở tại `i` (hoặc hết chuỗi nếu không đóng). Chỉ dùng trên văn bản đã che. */
export function balanced(src, i, open, close) {
  let depth = 0
  for (let k = i; k < src.length; k++) {
    const c = src[k]
    if (c === open) depth++
    else if (c === close && --depth === 0) return k + 1
  }
  return src.length
}

/** Như splitTop nhưng trả về các khoảng [from, to) (chưa cắt khoảng trắng) — để cắt song song văn bản đã che và văn bản gốc. */
export function splitTopRanges(s, sep) {
  const out = []
  let depth = 0
  let start = 0
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if ('([{<'.includes(c)) depth++
    else if (')]}'.includes(c)) depth = Math.max(0, depth - 1)
    else if (c === '>') {
      if (s[i - 1] !== '-' && s[i - 1] !== '=') depth = Math.max(0, depth - 1) // `->` / `=>` không phải dấu đóng generic
    } else if (depth === 0 && (sep === ' ' ? /\s/.test(c) : c === sep)) {
      out.push({ from: start, to: i })
      start = i + 1
    }
  }
  out.push({ from: start, to: s.length })
  return out
}

/** Tách theo `sep` ở mức ngoài cùng (bỏ qua nội dung trong () [] {} <>); `sep` là ký tự hoặc ' ' (mọi khoảng trắng). */
export function splitTop(s, sep) {
  return splitTopRanges(s, sep).map(({ from, to }) => s.slice(from, to).trim()).filter(Boolean)
}

/** Bỏ mọi annotation `@Name`, `@a.b.Name(...)`, `@get:Name` (trừ `@interface` của Java). */
export function stripAnnotations(s) {
  let out = ''
  let i = 0
  while (i < s.length) {
    if (s[i] === '@' && !/^@interface\b/.test(s.slice(i, i + 11))) {
      const m = /^@[A-Za-z_][\w.:]*/.exec(s.slice(i, i + 200))
      if (m) {
        i += m[0].length
        let j = i
        while (/\s/.test(s[j] ?? '')) j++
        if (s[j] === '(') i = balanced(s, j, '(', ')')
        continue
      }
    }
    out += s[i++]
  }
  return out
}

/** Độ dài phần đầu gồm khoảng trắng và annotation (để lấy dòng của chữ đầu tiên thật sự của khai báo). */
export function skipLeading(s) {
  let i = 0
  for (;;) {
    while (/\s/.test(s[i] ?? '')) i++
    if (s[i] === '@' && !/^@interface\b/.test(s.slice(i, i + 11))) {
      const m = /^@[A-Za-z_][\w.:]*/.exec(s.slice(i, i + 200))
      if (!m) return i
      i += m[0].length
      let j = i
      while (/\s/.test(s[j] ?? '')) j++
      if (s[j] === '(') i = balanced(s, j, '(', ')')
      continue
    }
    return i
  }
}

// ---------------------------------------------------------------------------
// maskSource
// ---------------------------------------------------------------------------

/**
 * @typedef {object} Syntax
 * @property {string|null} [line]        mở comment một dòng: '//' hoặc '#'
 * @property {[string,string]|null} [block]  comment khối: ['/*', '*​/']
 * @property {boolean} [nested]          comment khối lồng nhau (Kotlin)
 * @property {string[]} [quotes]         ký tự mở/đóng chuỗi một dòng: ['"', "'"]
 * @property {string[]} [triple]         chuỗi nhiều dòng: ['"""'] hoặc ["'''", '"""']
 * @property {boolean} [rawTriple]        chuỗi nhiều dòng KHÔNG có escape (Kotlin raw string: `"""C:\dir\"""` hợp lệ)
 * @property {boolean} [templates]       chuỗi có `${…}` lồng biểu thức (Kotlin)
 */

/** Vị trí của dấu đóng chuỗi bắt đầu tại `i` (src[i] là dấu mở); bỏ qua escape và (nếu bật) `${…}`. */
function endOfString(src, i, syn) {
  const q = src[i]
  let j = i + 1
  while (j < src.length) {
    const c = src[j]
    if (c === '\\') j += 2
    else if (c === q) return j
    else if (c === '\n') return j - 1 // chuỗi một dòng không đóng: dừng ở hết dòng
    else if (syn.templates && q === '"' && c === '$' && src[j + 1] === '{') j = endOfTemplate(src, j + 1, syn)
    else j++
  }
  return src.length
}

/** Vị trí ngay sau `}` đóng biểu thức mẫu `${ … }` mở tại `i` (chuỗi lồng bên trong được bỏ qua đúng). */
function endOfTemplate(src, i, syn) {
  let depth = 0
  let j = i
  while (j < src.length) {
    const c = src[j]
    if (c === '{') depth++
    else if (c === '}' && --depth === 0) return j + 1
    else if (c === '"' || c === "'") j = endOfString(src, j, syn)
    j++
  }
  return src.length
}

/** @param {string} src @param {Syntax} syn @returns {string} văn bản cùng độ dài, comment và nội dung chuỗi bị che bằng khoảng trắng */
export function maskSource(src, syn) {
  const n = src.length
  const out = src.split('')
  const blank = (from, to) => {
    for (let k = from; k < to && k < n; k++) if (out[k] !== '\n') out[k] = ' '
  }
  const quotes = syn.quotes ?? []
  const triples = syn.triple ?? []
  let i = 0
  scan: while (i < n) {
    const c = src[i]
    if (syn.line && src.startsWith(syn.line, i)) {
      const e = src.indexOf('\n', i)
      const end = e < 0 ? n : e
      blank(i, end)
      i = end
      continue
    }
    if (syn.block && src.startsWith(syn.block[0], i)) {
      let j = i + syn.block[0].length
      let depth = 1
      while (j < n && depth > 0) {
        if (src.startsWith(syn.block[1], j)) {
          depth--
          j += syn.block[1].length
        } else if (syn.nested && src.startsWith(syn.block[0], j)) {
          depth++
          j += syn.block[0].length
        } else j++
      }
      blank(i, j)
      i = j
      continue
    }
    for (const t of triples) {
      if (!src.startsWith(t, i)) continue
      let j = i + t.length
      while (j < n && !src.startsWith(t, j)) j += !syn.rawTriple && src[j] === '\\' ? 2 : 1
      blank(i + t.length, j)
      i = Math.min(n, j + t.length)
      continue scan
    }
    if (quotes.includes(c)) {
      const e = endOfString(src, i, syn)
      blank(i + 1, e)
      i = e + 1
      continue
    }
    i++
  }
  return out.join('')
}
