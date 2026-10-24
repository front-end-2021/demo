/**
 * Bộ đọc mã nguồn C# nhẹ (không phải compiler): lấy ra class / interface / struct / record / enum, các thành viên (field, property, method, constructor) và quan hệ giữa chúng.
 * Không bao giờ ném lỗi — gặp đoạn không hiểu thì bỏ qua.
 *
 * parseCSharpFiles([{ path, text }]) → { types: Type[], relations: Relation[] }     (nhiều file: class partial được gộp)
 * parseCSharp(source)                → như trên, cho MỘT đoạn mã (không có đường dẫn)
 *
 * Type     { id, name, namespace, display, kind, abstract, static, bases[], baseRefs[], path, line, locations[], fields[], methods[], values[] }
 *          id = tên đầy đủ có namespace (Demo.Animal) nên hai class cùng tên ở hai namespace không bị trộn.
 * Member   { kind, vis, name, type?, ret?, params?, static, abstract, text, path, line }
 * Relation { from, to, kind: 'generalization'|'realization'|'association'|'aggregation', label, many }   (from / to là id)
 *
 * line = dòng (từ 1) trong file GỐC. Tham chiếu tới kiểu được nối theo thứ tự: tên có qualifier → cùng namespace →
 * namespace được `using` → duy nhất trong tập; còn mơ hồ thì bỏ qua (không vẽ quan hệ sai).
 */

const TYPE_KW = new Set(['class', 'interface', 'struct', 'enum', 'record'])
const TYPE_MODS = new Set(['public', 'private', 'protected', 'internal', 'static', 'abstract', 'sealed', 'partial', 'unsafe', 'new', 'readonly', 'file', 'ref'])
const MEMBER_MODS = new Set([
  'public', 'private', 'protected', 'internal', 'static', 'abstract', 'virtual', 'override', 'sealed', 'readonly',
  'const', 'async', 'extern', 'unsafe', 'new', 'partial', 'required', 'volatile', 'event', 'implicit', 'explicit',
])
const COLLECTION = /\b(List|IList|IEnumerable|ICollection|IReadOnlyList|IReadOnlyCollection|HashSet|ISet|Queue|Stack|LinkedList|ObservableCollection|Collection|Array|Dictionary|IDictionary|SortedSet|SortedList|ImmutableList|ImmutableArray)\b|\[\s*,*\s*\]/

import { buildRelations } from './relations.js'

// ---------------------------------------------------------------------------
// 1. Làm sạch: bỏ comment, #region, rút gọn chuỗi / ký tự để dấu { } trong chuỗi không gây nhiễu
//    Văn bản sau khi làm sạch NGẮN HƠN bản gốc nên đi kèm `map`: map[i] = vị trí trong bản gốc của ký tự i
//    (để biết khai báo nằm ở dòng nào của file thật). Nội dung văn bản đã làm sạch giữ nguyên như bản gốc.
// ---------------------------------------------------------------------------
function cleanWithMap(src) {
  const n = src.length
  const map = new Int32Array(n + 1)
  let out = ''
  let o = 0
  const put = (s, at) => {
    out += s
    for (let k = 0; k < s.length; k++) map[o++] = at
  }
  let i = 0
  while (i < n) {
    const c = src[i]
    const d = src[i + 1]
    if (c === '/' && d === '/') {
      while (i < n && src[i] !== '\n') i++
      continue
    }
    if (c === '/' && d === '*') {
      const at = i
      const end = src.indexOf('*/', i + 2)
      i = end < 0 ? n : end + 2
      put(' ', at)
      continue
    }
    const isString = c === '"' || ((c === '@' || c === '$') && (d === '"' || ((d === '@' || d === '$') && src[i + 2] === '"')))
    if (isString) {
      const at = i
      let j = i
      let verbatim = false
      while (src[j] === '@' || src[j] === '$') {
        if (src[j] === '@') verbatim = true
        j++
      }
      j++ // dấu " mở
      while (j < n) {
        if (verbatim) {
          if (src[j] === '"') {
            if (src[j + 1] === '"') {
              j += 2
              continue
            }
            break
          }
        } else {
          if (src[j] === '\\') {
            j += 2
            continue
          }
          if (src[j] === '"' || src[j] === '\n') break
        }
        j++
      }
      put('""', at)
      i = j + 1
      continue
    }
    if (c === "'") {
      const at = i
      let j = i + 1
      if (src[j] === '\\') j += 2
      else j++
      while (j < n && src[j] !== "'" && src[j] !== '\n') j++
      put("''", at)
      i = j + 1
      continue
    }
    put(c, i)
    i++
  }

  // Bỏ dòng tiền xử lý (#region, #if…) — cắt cả văn bản lẫn bản đồ cho khớp nhau
  const re = /^[ \t]*#.*$/gm
  let text = ''
  const map2 = new Int32Array(out.length + 1)
  let w = 0
  let last = 0
  const copy = (from, to) => {
    text += out.slice(from, to)
    for (let k = from; k < to; k++) map2[w++] = map[k]
  }
  for (const m of out.matchAll(re)) {
    copy(last, m.index)
    last = m.index + m[0].length
  }
  copy(last, out.length)
  return { text, map: map2.subarray(0, w) }
}

/** Dòng (từ 1) của một vị trí trong văn bản gốc. */
function makeLineLookup(src) {
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

// ---------------------------------------------------------------------------
// 2. Tiện ích quét ký tự
// ---------------------------------------------------------------------------
const isSpace = (ch) => ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r'

function skipWs(s, p) {
  while (p < s.length && isSpace(s[p])) p++
  return p
}

/** Trả về vị trí ngay SAU ký tự đóng tương ứng với ký tự mở ở s[pos]. */
function balanced(s, pos, open, close) {
  let depth = 0
  for (let i = pos; i < s.length; i++) {
    if (s[i] === open) depth++
    else if (s[i] === close && --depth === 0) return i + 1
  }
  return s.length
}

/** Tách chuỗi theo `sep` ở độ sâu 0 của () [] {} <>. */
function splitTop(str, sep) {
  const parts = []
  let depth = 0
  let cur = ''
  for (const ch of str) {
    if ('([{<'.includes(ch)) depth++
    else if (')]}>'.includes(ch)) depth = Math.max(0, depth - 1)
    if (depth === 0 && (sep === ' ' ? isSpace(ch) : ch === sep)) {
      if (cur.trim()) parts.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  if (cur.trim()) parts.push(cur.trim())
  return parts
}

function stripAttributes(s) {
  s = s.trimStart()
  while (s[0] === '[') s = s.slice(balanced(s, 0, '[', ']')).trimStart()
  return s
}

/** Bỏ namespace và generic: `System.Collections.List<int>` → `List` */
const simpleId = (name) => name.replace(/<[\s\S]*$/, '').replace(/\?$/, '').split('.').pop().trim()

// ---------------------------------------------------------------------------
// 3. Tìm khai báo kiểu (kể cả kiểu lồng nhau)
// ---------------------------------------------------------------------------
function findTypeDecls(src) {
  const decls = []
  const re = /\b(class|interface|struct|enum|record)\b/g
  let m
  while ((m = re.exec(src))) {
    // phần chữ nằm giữa dấu phân cách gần nhất và từ khoá phải toàn là modifier
    let k = m.index - 1
    while (k >= 0 && !';{}]'.includes(src[k])) k--
    const words = src.slice(k + 1, m.index).split(/\s+/).filter(Boolean)
    if (!words.every((w) => TYPE_MODS.has(w))) continue

    let kind = m[1]
    const isRecord = kind === 'record'
    let p = skipWs(src, m.index + m[0].length)
    if (kind === 'record') {
      const rs = /^(struct|class)\b/.exec(src.slice(p, p + 8))
      if (rs) {
        p = skipWs(src, p + rs[0].length)
        if (rs[1] === 'struct') kind = 'struct'
      }
    }
    const nm = /^[A-Za-z_]\w*/.exec(src.slice(p, p + 80))
    if (!nm || nm[0] === 'where') continue
    const name = nm[0]
    p += name.length

    let generics = ''
    if (src[p] === '<') {
      const e = balanced(src, p, '<', '>')
      generics = src.slice(p, e)
      p = e
    }
    p = skipWs(src, p)

    let primary = ''
    if (src[p] === '(') {
      const e = balanced(src, p, '(', ')')
      primary = src.slice(p + 1, e - 1)
      p = skipWs(src, e)
    }

    let bases = []
    if (src[p] === ':') {
      let q = p + 1
      let depth = 0
      let text = ''
      while (q < src.length) {
        const ch = src[q]
        if (ch === '<' || ch === '(') depth++
        else if (ch === '>' || ch === ')') depth--
        if (depth <= 0 && (ch === '{' || ch === ';')) break
        if (depth <= 0 && /^where\b/.test(src.slice(q, q + 6)) && isSpace(src[q - 1] ?? ' ')) break
        text += ch
        q++
      }
      bases = splitTop(text, ',')
      p = q
    }
    // ràng buộc generic: where T : class, new()
    if (/^where\b/.test(src.slice(p, p + 6))) {
      let q = p
      let depth = 0
      while (q < src.length) {
        const ch = src[q]
        if (ch === '<' || ch === '(') depth++
        else if (ch === '>' || ch === ')') depth--
        if (depth <= 0 && (ch === '{' || ch === ';')) break
        q++
      }
      p = q
    }

    let body = ''
    let bodyStart = -1
    if (src[p] === '{') {
      const e = balanced(src, p, '{', '}')
      body = src.slice(p + 1, e - 1)
      bodyStart = p + 1
    } else if (src[p] !== ';') continue // không phải khai báo thật

    decls.push({ kind, isRecord, name, generics, primary, bases, body, bodyStart, pos: m.index, mods: new Set(words) })
    re.lastIndex = p // vẫn quét tiếp bên trong để thấy kiểu lồng nhau
  }
  return decls
}

/** Các khối namespace: `namespace A.B { … }` hoặc `namespace A.B;` (phạm vi file, kéo tới hết file). */
function findNamespaces(src) {
  const out = []
  const re = /\bnamespace\s+([A-Za-z_][\w.]*)\s*([{;])/g
  for (let m; (m = re.exec(src)); ) {
    const end = m[2] === '{' ? balanced(src, m.index + m[0].length - 1, '{', '}') : src.length
    out.push({ name: m[1], start: m.index, end })
  }
  return out
}

/** Namespace đầy đủ tại một vị trí (namespace lồng nhau nối bằng dấu chấm). */
const namespaceAt = (nss, pos) => nss.filter((n) => n.start <= pos && pos < n.end).sort((a, b) => a.start - b.start).map((n) => n.name).join('.')

/** `using A.B;` (bỏ `using static`, bí danh `using X = …` và câu lệnh `using (…)` / `using var`). */
function findUsings(src) {
  const out = []
  for (const m of src.matchAll(/\b(?:global\s+)?using\s+(?!static\b|var\b)([A-Za-z_][\w.]*)\s*;/g)) out.push(m[1])
  return out
}

// ---------------------------------------------------------------------------
// 4. Thành viên
// ---------------------------------------------------------------------------
function splitMembers(body) {
  const chunks = []
  const push = (s, at) => {
    if (s.trim()) chunks.push({ text: s, offset: at })
  }
  let start = 0
  let paren = 0
  let brack = 0
  let brace = 0
  let assigned = false
  for (let i = 0; i < body.length; i++) {
    const c = body[i]
    if (c === '(') paren++
    else if (c === ')') paren--
    else if (c === '[') brack++
    else if (c === ']') brack--
    else if (c === '{') brace++
    else if (c === '}') {
      brace--
      if (brace === 0 && paren === 0 && brack === 0 && !assigned) {
        let j = i + 1
        while (j < body.length && isSpace(body[j])) j++
        if (body[j] !== '=') {
          push(body.slice(start, i + 1), start)
          start = i + 1
        } else assigned = true // property có giá trị khởi tạo: { get; set; } = ...;
      }
    } else if (c === ';' && paren === 0 && brack === 0 && brace === 0) {
      push(body.slice(start, i), start)
      start = i + 1
      assigned = false
    } else if (c === '=' && paren === 0 && brack === 0 && brace === 0) {
      if (body[i + 1] === '=') i++
      else if (!'!<>='.includes(body[i - 1] ?? ' ')) assigned = true
    }
    if (brace === 0 && start === i + 1) assigned = false
  }
  push(body.slice(start), start)
  return chunks
}

/** Vị trí kết thúc phần khai báo (trước thân `{`, `=>` hoặc giá trị khởi tạo `=`). */
function headerEnd(s) {
  let paren = 0
  let brack = 0
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '(') paren++
    else if (c === ')') paren--
    else if (c === '[') brack++
    else if (c === ']') brack--
    else if (paren === 0 && brack === 0) {
      if (c === '{') return i
      if (c === '=') {
        if (s[i + 1] === '>') return i
        if (s[i + 1] === '=') {
          i++
          continue
        }
        if (!'!<>='.includes(s[i - 1] ?? ' ')) return i
      }
    }
  }
  return s.length
}

function visibilityOf(mods, ownerKind) {
  if (mods.has('public')) return '+'
  if (mods.has('protected')) return '#'
  if (mods.has('private')) return '-'
  if (mods.has('internal')) return '~'
  return ownerKind === 'interface' ? '+' : '-'
}

function normalizeParams(raw) {
  return splitTop(raw, ',')
    .map((p) =>
      stripAttributes(p)
        .replace(/\s*=[\s\S]*$/, '') // bỏ giá trị mặc định
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean)
    .join(', ')
}

function parseMember(chunk, owner) {
  const s = stripAttributes(chunk).trim()
  if (!s) return []
  const end = headerEnd(s)
  const hasBody = end < s.length
  let header = s
    .slice(0, end)
    .trim()
    .replace(/\)\s*:\s*(?:base|this)\s*\([\s\S]*$/, ')') // ctor initializer
    .replace(/\s+where\s[\s\S]*$/, '') // ràng buộc generic của method
  const toks = splitTop(header, ' ')
  const mods = new Set()
  while (toks.length && MEMBER_MODS.has(toks[0])) mods.add(toks.shift())
  if (!toks.length) return []
  if (TYPE_KW.has(toks[0]) || ['delegate', 'namespace', 'using'].includes(toks[0])) return []

  const base = {
    vis: visibilityOf(mods, owner.kind),
    static: mods.has('static') || mods.has('const'),
    abstract: mods.has('abstract'),
  }

  // --- method / constructor / operator ---
  const pi = toks.findIndex((t) => /^[^(\s]+\(/.test(t))
  if (pi >= 0) {
    const tok = toks[pi]
    const open = tok.indexOf('(')
    let name = tok.slice(0, open)
    const params = normalizeParams(tok.slice(open + 1, tok.lastIndexOf(')')))
    let ret = toks.slice(0, pi).join(' ')
    if (toks[pi - 1] === 'operator') {
      name = 'operator ' + name
      ret = toks.slice(0, pi - 1).join(' ')
      if (mods.has('implicit') || mods.has('explicit')) ret = tok.slice(0, open)
    }
    const ctor = ret === ''
    const text = (ret ? ret + ' ' : '') + `${name}(${params})`
    return [{ ...base, kind: ctor ? 'ctor' : 'method', name, ret, params, text }]
  }

  // --- field / property / event / indexer ---
  if (toks.length < 2) return []
  const type = toks[0]
  const names = toks.slice(1).join(' ').split(',').map((x) => x.trim()).filter(Boolean)
  const isProp = hasBody && /^(\{|=>)/.test(s.slice(end).trimStart())
  return names.map((name) => ({
    ...base,
    kind: isProp ? 'property' : 'field',
    name,
    type,
    text: `${name}: ${type}`,
  }))
}

function parseEnumValues(body) {
  return splitTop(body, ',')
    .map((v) => stripAttributes(v).replace(/\s*=[\s\S]*$/, '').trim())
    .filter((v) => /^[A-Za-z_]\w*$/.test(v))
    .map((name) => ({ kind: 'value', vis: '+', name, text: name, static: false, abstract: false }))
}

function positionalMembers(primary, kind, ownerName) {
  if (!primary.trim()) return { props: [], ctor: null }
  const params = normalizeParams(primary)
  if (kind === 'record') {
    const props = splitTop(primary, ',')
      .map((p) => stripAttributes(p).replace(/\s*=[\s\S]*$/, '').replace(/\s+/g, ' ').trim())
      .map((p) => {
        const sp = splitTop(p, ' ')
        if (sp.length < 2) return null
        const name = sp[sp.length - 1]
        const type = sp.slice(0, -1).join(' ')
        return { kind: 'property', vis: '+', name, type, text: `${name}: ${type}`, static: false, abstract: false }
      })
      .filter(Boolean)
    return { props, ctor: null }
  }
  return {
    props: [],
    ctor: { kind: 'ctor', vis: '+', name: ownerName, ret: '', params, text: `${ownerName}(${params})`, static: false, abstract: false },
  }
}

// ---------------------------------------------------------------------------
// 5. Quan hệ
// ---------------------------------------------------------------------------
// Giữ nguyên tên có qualifier (B.User) — nếu tách ra thì mất thông tin namespace cần để nối đúng kiểu
const identsOf = (typeStr) => (typeStr.match(/[A-Za-z_]\w*(?:\s*\.\s*[A-Za-z_]\w*)*/g) ?? []).map((s) => s.replace(/\s+/g, ''))

/** Các khai báo kiểu của MỘT file, kèm đường dẫn, dòng, namespace, using và các đoạn thành viên (có dòng). */
function declsOfFile(source, path) {
  const { text, map } = cleanWithMap(source)
  const lineOfOriginal = makeLineLookup(source)
  const lineAt = (pos) => lineOfOriginal(map.length ? map[Math.min(Math.max(pos, 0), map.length - 1)] : 0)
  const nss = findNamespaces(text)
  const usings = findUsings(text)
  return findTypeDecls(text).map((d) => ({
    ...d,
    path,
    usings,
    namespace: namespaceAt(nss, d.pos),
    line: lineAt(d.pos),
    chunks: d.kind === 'enum' ? [] : splitMembers(d.body).map((c) => ({
      text: c.text,
      // dòng của chữ đầu tiên SAU các attribute ([HttpGet]…) — đúng dòng khai báo thành viên
      line: lineAt(d.bodyStart + c.offset + (c.text.length - stripAttributes(c.text).length)),
    })),
  }))
}

export function parseCSharpFiles(files) {
  const decls = []
  for (const f of files ?? []) {
    try {
      decls.push(...declsOfFile(String(f?.text ?? ''), f?.path ?? ''))
    } catch {
      /* bỏ qua file không đọc được */
    }
  }

  const byId = new Map()
  for (const d of decls) {
    const id = d.namespace ? `${d.namespace}.${d.name}` : d.name
    let t = byId.get(id)
    if (!t) {
      t = {
        id,
        name: d.name,
        namespace: d.namespace,
        display: d.name + d.generics.replace(/\s+/g, ' '),
        kind: d.kind,
        abstract: d.mods.has('abstract'),
        static: d.mods.has('static'),
        bases: [],
        baseRefs: [],
        usings: [],
        path: d.path,
        line: d.line,
        locations: [],
        fields: [],
        methods: [],
        values: [],
      }
      byId.set(id, t)
    }
    t.locations.push({ path: d.path, line: d.line }) // class partial: nhiều vị trí
    for (const u of d.usings) if (!t.usings.includes(u)) t.usings.push(u)
    if (d.kind !== 'enum') {
      for (const b of d.bases) {
        const shown = b.replace(/\s+/g, ' ')
        if (!t.bases.includes(shown)) {
          t.bases.push(shown)
          t.baseRefs.push(b.replace(/<[\s\S]*$/, '').replace(/\?$/, '').trim())
        }
      }
    }

    if (d.kind === 'enum') {
      t.values.push(...parseEnumValues(d.body).filter((v) => !t.values.some((x) => x.name === v.name)).map((v) => ({ ...v, path: d.path, line: d.line })))
      continue
    }
    const { props, ctor } = positionalMembers(d.primary, d.isRecord ? 'record' : d.kind, d.name)
    const members = [...props, ...(ctor ? [ctor] : [])].map((m) => ({ ...m, path: d.path, line: d.line }))
    for (const chunk of d.chunks) {
      try {
        members.push(...parseMember(chunk.text, t).map((m) => ({ ...m, path: d.path, line: chunk.line })))
      } catch {
        /* bỏ qua thành viên không đọc được */
      }
    }
    for (const m of members) {
      const list = m.kind === 'method' || m.kind === 'ctor' ? t.methods : t.fields
      if (!list.some((x) => x.text === m.text && x.vis === m.vis)) list.push(m)
    }
  }

  const types = [...byId.values()]
  return { types, relations: buildRelations(types, { collection: COLLECTION, idents: identsOf }) }
}

/** Một đoạn mã đơn lẻ (không có đường dẫn). */
export const parseCSharp = (source) => parseCSharpFiles([{ path: '', text: source }])
