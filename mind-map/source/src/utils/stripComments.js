/**
 * Xoá comment và dòng trống thừa khỏi mã nguồn trước khi phân tích,
 * để tên hàm / class nằm trong comment không bị tính là lời gọi.
 *
 * - Hiểu chuỗi ký tự: "http://a.b" hay '/* x *\/' trong chuỗi được giữ nguyên.
 * - Dòng chỉ chứa comment bị xoá hẳn; nhiều dòng trống liên tiếp gộp lại còn 1.
 * - Python: docstring ("""…""" đứng riêng một câu lệnh) cũng được coi là comment.
 * - Đổi CRLF → LF (dòng trống kiểu CRLF làm sai việc xác định khối theo thụt lề của Python).
 */

const C_LIKE = { line: '//', block: [['/*', '*/']], quotes: ['"', "'"] }

const SYNTAX = {
  cs: { ...C_LIKE, triple: ['"""'], verbatim: true }, // @"…", $@"…", raw string """…"""
  java: { ...C_LIKE, triple: ['"""'] }, // text block """…"""
  js: { ...C_LIKE, quotes: ['"', "'", '`'] },
  py: { line: '#', block: [], quotes: ['"', "'"], triple: ['"""', "'''"], docstring: true },
  css: { line: null, block: [['/*', '*/']], quotes: ['"', "'"] }, // CSS không có // (url(http://…) phải giữ nguyên)
  html: { line: null, block: [['<!--', '-->']], quotes: [] }, // giữ nguyên giá trị thuộc tính
}
for (const ext of ['mjs', 'jsx', 'ts', 'tsx']) SYNTAX[ext] = SYNTAX.js

/** Bộ quét chung theo trạng thái: NORMAL → LINE_COMMENT / BLOCK_COMMENT / STRING. */
function strip(src, syn) {
  const triples = syn.triple || []
  let out = ''
  let line = '' // dòng đang dựng
  let hasCode = false // dòng hiện tại có mã thật (không chỉ khoảng trắng / comment)
  let hadComment = false // dòng hiện tại có comment bị xoá
  let state = 'code'
  let endToken = '' // ký hiệu kết thúc của comment khối / chuỗi
  let multiline = false // chuỗi được phép kéo qua nhiều dòng (` hoặc """)
  let verbatim = false // chuỗi @"…" của C#: "" là dấu nháy, \ không phải ký tự thoát

  const newline = () => {
    if (hasCode) out += line.replace(/[ \t]+$/, '') + '\n'
    else if (!hadComment) out += '\n' // dòng trống gốc: giữ lại, gộp ở bước cuối
    line = ''
    hasCode = state === 'string' // đang ở giữa chuỗi nhiều dòng thì dòng sau vẫn là mã
    hadComment = state === 'block'
  }

  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (c === '\n') {
      if (state === 'line') state = 'code'
      if (state === 'string' && !multiline) state = 'code' // chuỗi 1 dòng chưa đóng (thường do regex literal) → dừng tại cuối dòng
      newline()
      continue
    }

    if (state === 'line') continue

    if (state === 'block') {
      if (src.startsWith(endToken, i)) {
        state = 'code'
        i += endToken.length - 1
        line += ' ' // tránh dính 2 token: a/**/b → "a b"
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
    const triple = triples.find((t) => src.startsWith(t, i))
    if (triple) {
      // Docstring Python: chuỗi """…""" đứng đầu câu lệnh (trước nó chỉ có khoảng trắng / tiền tố r, u, b, f)
      if (syn.docstring && /^[ \t]*[rRuUbBfF]{0,2}$/.test(line)) {
        line = line.replace(/[rRuUbBfF]+$/, '')
        hasCode = false
        state = 'block'
        endToken = triple
        hadComment = true
        i += 2
        continue
      }
      state = 'string'
      endToken = triple
      multiline = true
      verbatim = false
      line += triple
      hasCode = true
      i += 2
      continue
    }
    if (syn.verbatim && (src.startsWith('@"', i) || src.startsWith('$@"', i) || src.startsWith('@$"', i))) {
      const prefix = src[i + 1] === '"' ? '@"' : src.slice(i, i + 3)
      state = 'string'
      verbatim = true
      multiline = true
      line += prefix
      hasCode = true
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
      continue
    }

    line += c
    if (c !== ' ' && c !== '\t' && c !== '\r') hasCode = true
  }
  newline()

  return out
    .replace(/\n{3,}/g, '\n\n') // nhiều dòng trống liên tiếp → 1 dòng trống
    .replace(/^\n+/, '') // bỏ dòng trống ở đầu file
    .replace(/\n+$/, '\n') // và ở cuối file
}

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
  for (;;) {
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
