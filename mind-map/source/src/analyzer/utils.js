// utils.js — Tiện ích dùng chung cho toàn bộ pipeline phân tích.

// ---------------------------------------------------------------------------
// Đường dẫn
// ---------------------------------------------------------------------------
export function normalizePath(p) {
  const parts = []
  for (const seg of String(p ?? '').replace(/\\/g, '/').split('/')) {
    if (!seg || seg === '.') continue
    if (seg === '..') parts.pop()
    else parts.push(seg)
  }
  return parts.join('/')
}
export const dirname = (p) => { const i = p.lastIndexOf('/'); return i < 0 ? '' : p.slice(0, i) }
export const basename = (p) => { const i = p.lastIndexOf('/'); return i < 0 ? p : p.slice(i + 1) }
export function extname(p) {
  const b = basename(p)
  const i = b.lastIndexOf('.')
  return i <= 0 ? '' : b.slice(i).toLowerCase()
}
export function stripExt(name) {
  const i = name.lastIndexOf('.')
  return i <= 0 ? name : name.slice(0, i)
}
export const joinPath = (...parts) => normalizePath(parts.filter((x) => x != null && x !== '').join('/'))
export function joinUrl(...parts) {
  const segs = parts
    .filter((p) => p != null && p !== '')
    .map((p) => String(p).replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
  return '/' + segs.join('/')
}

// ---------------------------------------------------------------------------
// Id của node trong đồ thị
// ---------------------------------------------------------------------------
export const fileId = (path) => `file:${path}`
export const endpointId = (method, urlPattern) => `endpoint:${method} ${urlPattern}`
export const routeId = (path) => `route:${path}`
export const externalId = (pkg) => `ext:${pkg}`

// ---------------------------------------------------------------------------
// Tên
// ---------------------------------------------------------------------------
export const toPascal = (name) => String(name ?? '').replace(/(^|[-_.\s]+)(\w)/g, (_, __, c) => c.toUpperCase())
export const toKebab = (name) =>
  String(name ?? '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[_\s]+/g, '-').toLowerCase()
// Vue tự chuyển đổi kebab-case <-> camelCase cho tên sự kiện
export const sameEventName = (a, b) => toKebab(a) === toKebab(b)

// Chuẩn hoá URL để so khớp front-end <-> back-end:
// '${id}', '{id}', '{id:int}', ':id', '<int:id>', '[id]' đều thành '{*}'
export function normalizeUrlPattern(url) {
  let u = String(url ?? '').trim()
  u = u.replace(/^[a-z][a-z0-9+.-]*:\/\/[^/]+/i, '').split(/[?#]/)[0]
  const segs = u
    .split('/')
    .filter(Boolean)
    .map((seg) =>
      seg.includes('{*}') ||
      /^\{[^}]*\}$/.test(seg) ||
      /^:\w+\??$/.test(seg) ||
      /^<[^>]+>$/.test(seg) ||
      /^\[[^\]]+\]$/.test(seg)
        ? '{*}'
        : seg.toLowerCase(),
    )
  return '/' + segs.join('/')
}

// ---------------------------------------------------------------------------
// Unit: kết quả phân tích một file (symbol định nghĩa + tham chiếu chưa giải quyết)
// ---------------------------------------------------------------------------
export function createUnit(sf, adapterId, lang) {
  return { path: sf.path, adapterId, lang, symbols: [], refs: [], facts: {}, roles: new Set(), errors: [] }
}

export function addSymbol(unit, kind, name, line, meta = {}) {
  const sym = { kind, name, path: unit.path, line: line ?? null, meta }
  unit.symbols.push(sym)
  return sym
}

export function addRef(unit, kind, target, line, opts = {}) {
  unit.refs.push({
    kind,
    target,
    from: opts.from ?? fileId(unit.path),
    path: unit.path,
    line: line ?? null,
    confidence: opts.confidence ?? 'certain',
    meta: opts.meta ?? {},
  })
}

// ---------------------------------------------------------------------------
// Văn bản
// ---------------------------------------------------------------------------
// Trả về hàm: vị trí ký tự -> số dòng (bắt đầu từ 1)
export function makeLineLookup(text) {
  const starts = [0]
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) starts.push(i + 1)
  return (index) => {
    let lo = 0
    let hi = starts.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (starts[mid] <= index) lo = mid
      else hi = mid - 1
    }
    return lo + 1
  }
}

// Che comment (và tuỳ chọn nội dung chuỗi) bằng khoảng trắng.
// GIỮ NGUYÊN độ dài và ký tự xuống dòng => vị trí/số dòng không bị lệch.
// Chỉ dùng nội bộ cho các parser dựa trên regex; văn bản gốc không bị thay đổi.
export function maskComments(text, { style = 'c', maskStrings = false } = {}) {
  const out = text.split('')
  const n = text.length
  const blank = (from, to) => {
    for (let k = Math.max(0, from); k < Math.min(to, n); k++) if (out[k] !== '\n') out[k] = ' '
  }
  let i = 0
  while (i < n) {
    const c = text[i]
    if (style === 'python') {
      if ((c === '"' || c === "'") && text.startsWith(c + c + c, i)) {
        const end = text.indexOf(c + c + c, i + 3)
        const stop = end < 0 ? n : end + 3
        blank(i, stop) // docstring luôn bị che
        i = stop
        continue
      }
      if (c === '#') {
        const end = text.indexOf('\n', i)
        const stop = end < 0 ? n : end
        blank(i, stop)
        i = stop
        continue
      }
    } else {
      if (c === '/' && text[i + 1] === '/') {
        const end = text.indexOf('\n', i)
        const stop = end < 0 ? n : end
        blank(i, stop)
        i = stop
        continue
      }
      if (c === '/' && text[i + 1] === '*') {
        const end = text.indexOf('*/', i + 2)
        const stop = end < 0 ? n : end + 2
        blank(i, stop)
        i = stop
        continue
      }
      if (c === '"' && text.startsWith('"""', i)) {
        const end = text.indexOf('"""', i + 3)
        const stop = end < 0 ? n : end + 3
        if (maskStrings) blank(i + 3, stop - 3)
        i = stop
        continue
      }
    }
    if (c === '"' || c === "'" || (c === '`' && style !== 'python')) {
      const stop = skipString(text, i, c)
      if (maskStrings) blank(i + 1, stop - 1)
      i = stop
      continue
    }
    i++
  }
  return out.join('')
}

function skipString(text, i, q) {
  let j = i + 1
  while (j < text.length) {
    const ch = text[j]
    if (ch === '\\') { j += 2; continue }
    if (ch === q) return j + 1
    if (ch === '\n' && q !== '`') return j // chuỗi một dòng chưa đóng
    j++
  }
  return text.length
}

export function firstStringLiteral(s) {
  const m = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/.exec(s ?? '')
  return m ? (m[1] ?? m[2]) : null
}

export const capitalizedIdents = (s) => [...new Set(String(s ?? '').match(/\b[A-Z][A-Za-z0-9_]*\b/g) ?? [])]

// Bỏ tham số generic: Repository<User, List<Long>> -> Repository
export function stripGenerics(s) {
  let prev
  s = String(s ?? '')
  do {
    prev = s
    s = s.replace(/<[^<>]*>/g, '')
  } while (s !== prev)
  return s
}

// Tách theo dấu phân cách nhưng bỏ qua phần nằm trong (), <>, [], {}
export function splitTopLevel(s, sep = ',') {
  const out = []
  let depth = 0
  let cur = ''
  for (const ch of String(s ?? '')) {
    if ('(<[{'.includes(ch)) depth++
    else if (')>]}'.includes(ch)) depth = Math.max(0, depth - 1)
    if (ch === sep && depth === 0) {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  if (cur.trim()) out.push(cur)
  return out
}

export function matchClose(s, i, open, close) {
  let d = 0
  for (let k = i; k < s.length; k++) {
    if (s[k] === open) d++
    else if (s[k] === close && --d === 0) return k
  }
  return s.length - 1
}
