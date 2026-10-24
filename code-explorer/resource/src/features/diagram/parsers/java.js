// parsers/java.js — Parser Java (regex + đếm ngoặc, không dùng thư viện) cho sơ đồ class.
//
// parseJavaFiles([{ path, text }]) → { types, relations } — cùng mô hình dữ liệu với csharp.js (xem mô tả ở đó).
//   namespace = package (kiểu lồng nhau: package.Outer), id = namespace.Tên.
//   Bao phủ: class / interface / enum / record / @interface, generic, extends / implements, kiểu lồng nhau, enum có thân,
//   thành viên (trường, phương thức, constructor), annotation, nhiều khai báo trên một dòng (`int a, b;`).
//   Không bao phủ: lớp cục bộ và lớp ẩn danh trong thân phương thức (cố ý bỏ qua).

import { balanced, makeLineLookup, maskSource, skipLeading, splitTop, stripAnnotations } from './common.js'
import { buildRelations } from './relations.js'

const SYNTAX = { line: '//', block: ['/*', '*/'], quotes: ['"', "'"], triple: ['"""'] }
const MODS = new Set(['public', 'protected', 'private', 'static', 'final', 'abstract', 'synchronized', 'native', 'default', 'transient', 'volatile', 'strictfp', 'sealed', 'non-sealed'])
const COLLECTION = /\b(List|ArrayList|LinkedList|Set|HashSet|LinkedHashSet|TreeSet|SortedSet|Collection|Iterable|Queue|Deque|ArrayDeque|Stack|Vector|Map|HashMap|LinkedHashMap|TreeMap|ConcurrentMap|ConcurrentHashMap|Stream)\b|\[\]|\.\.\./
const TYPE_RE = /(?:^|[\s)])(class|interface|enum|record|@interface)\s+([A-Za-z_$][\w$]*)/

/** Cắt `text[from, to)` thành các đoạn thành viên: kết thúc ở `;` hoặc sau khối `{…}` (trừ khi đang ở vế phải của `=`). */
function splitMembers(text, from, to) {
  const chunks = []
  let start = from
  let paren = 0
  let assigned = false
  const push = (end) => {
    if (text.slice(start, end).trim()) chunks.push({ start, end })
    start = end
    assigned = false
  }
  for (let i = from; i < to; i++) {
    const c = text[i]
    if (c === '(' || c === '[') paren++
    else if (c === ')' || c === ']') paren = Math.max(0, paren - 1)
    else if (paren === 0) {
      if (c === '=') {
        if (text[i + 1] === '=') i++
        else if (!'!<>='.includes(text[i - 1] ?? ' ')) assigned = true
      } else if (c === ';') push(i + 1)
      else if (c === '{') {
        const e = balanced(text, i, '{', '}')
        i = e - 1
        if (!assigned) push(e)
      }
    }
  }
  push(to)
  return chunks
}

/** Vị trí kết thúc phần khai báo (trước thân `{` hoặc giá trị khởi tạo `=`). */
function headerEnd(s) {
  let paren = 0
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '(' || c === '[') paren++
    else if (c === ')' || c === ']') paren--
    else if (paren === 0) {
      if (c === '{') return i
      if (c === '=' && s[i + 1] !== '=' && !'!<>='.includes(s[i - 1] ?? ' ')) return i
    }
  }
  return s.length
}

const visOf = (mods, inInterface) => (mods.has('public') ? '+' : mods.has('protected') ? '#' : mods.has('private') ? '-' : inInterface ? '+' : '~')

function normalizeParams(raw) {
  return splitTop(raw, ',')
    .map((p) => p.replace(/\bfinal\b/g, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(', ')
}

/** Tên có `[]` sau tên biến (`int a[]`) → chuyển `[]` sang kiểu. */
function splitDeclarator(decl) {
  const clean = decl.replace(/\s*=[\s\S]*$/, '').trim()
  const m = /^([\s\S]*?)((?:\s*\[\s*\])*)$/.exec(clean)
  const dims = (m[2] ?? '').replace(/\s+/g, '')
  const toks = splitTop(m[1], ' ')
  return { name: toks[toks.length - 1] ?? '', rest: toks.slice(0, -1).join(' '), dims }
}

function parseMember(chunk, owner) {
  const s = stripAnnotations(chunk).trim().replace(/;\s*$/, '').trim()
  if (!s) return []
  const end = headerEnd(s)
  const hasBody = s[end] === '{'
  const header = s.slice(0, end).trim().replace(/\bthrows\s[\s\S]*$/, '').trim()
  const toks = splitTop(header, ' ')
  const mods = new Set()
  while (toks.length && MODS.has(toks[0])) mods.add(toks.shift())
  if (toks[0]?.startsWith('<')) toks.shift() // tham số kiểu của phương thức generic
  if (!toks.length) return []
  const inInterface = owner.kind === 'interface'

  const pi = toks.findIndex((t) => /^[^(\s]+\(/.test(t))
  if (pi >= 0) {
    const tok = toks[pi]
    const open = tok.indexOf('(')
    const name = tok.slice(0, open)
    const params = normalizeParams(tok.slice(open + 1, tok.lastIndexOf(')')))
    const ret = toks.slice(0, pi).join(' ')
    return [{
      kind: ret === '' ? 'ctor' : 'method',
      vis: visOf(mods, inInterface),
      static: mods.has('static'),
      abstract: mods.has('abstract') || (inInterface && !hasBody && !mods.has('default') && !mods.has('static')),
      name, ret, params,
      text: (ret ? `${ret} ` : '') + `${name}(${params})`,
    }]
  }

  // Trường: `Type a = 1, b;`
  const parts = splitTop(s, ',')
  const first = splitDeclarator(parts[0].replace(/^(?:(?:public|protected|private|static|final|transient|volatile)\s+)+/, ''))
  if (!first.name || !first.rest) return []
  const out = [{ name: first.name, type: first.rest + first.dims }]
  for (const p of parts.slice(1)) {
    const d = splitDeclarator(p)
    if (d.name) out.push({ name: d.name, type: first.rest + d.dims })
  }
  return out.map((f) => ({
    kind: 'field',
    vis: visOf(mods, inInterface),
    static: mods.has('static') || inInterface,
    abstract: false,
    name: f.name,
    type: f.type,
    text: `${f.name}: ${f.type}`,
  }))
}

function parseJavaFile(source, path) {
  const text = maskSource(source, SYNTAX)
  const lineAt = makeLineLookup(source)
  const pkg = /\bpackage\s+([\w.]+)\s*;/.exec(text)?.[1] ?? ''
  const usings = []
  for (const m of text.matchAll(/\bimport\s+(static\s+)?([\w.]+?)(\.\*)?\s*;/g)) {
    if (m[1]) continue
    const ns = m[3] ? m[2] : m[2].slice(0, Math.max(0, m[2].lastIndexOf('.')))
    if (ns && !usings.includes(ns)) usings.push(ns)
  }
  const decls = []

  /** Một đoạn có phải khai báo kiểu không? → decl (kèm vị trí thân) hoặc null. */
  function readType(chunk, namespace) {
    const s = text.slice(chunk.start, chunk.end)
    const m = TYPE_RE.exec(s)
    if (!m) return null
    const kw = m[1]
    const kwAt = m.index + m[0].indexOf(kw)
    const mods = new Set(stripAnnotations(s.slice(0, kwAt)).split(/\s+/).filter(Boolean))
    if ([...mods].some((x) => !MODS.has(x))) return null // có chữ lạ trước từ khoá → đây là một câu lệnh / phương thức, không phải khai báo kiểu
    const name = m[2]
    const p = s.indexOf(name, kwAt + kw.length) + name.length // ngay sau tên kiểu
    // tìm `{` đầu tiên ngoài ngoặc đơn = mở thân
    let paren = 0
    let open = -1
    for (let i = p; i < s.length; i++) {
      if (s[i] === '(') paren++
      else if (s[i] === ')') paren--
      else if (s[i] === '{' && paren === 0) {
        open = i
        break
      }
    }
    if (open < 0) return null
    let header = s.slice(p, open)
    let generics = ''
    if (header.trimStart().startsWith('<')) {
      const at = header.indexOf('<')
      const e = balanced(header, at, '<', '>')
      generics = header.slice(at, e)
      header = header.slice(e)
    }
    let primary = ''
    if (kw === 'record' && header.trimStart().startsWith('(')) {
      const at = header.indexOf('(')
      const e = balanced(header, at, '(', ')')
      primary = header.slice(at + 1, e - 1)
      header = header.slice(e)
    }
    const baseRefs = []
    const bases = []
    const baseKinds = []
    const take = (re, role) => {
      const r = re.exec(header)
      if (!r) return
      for (const b of splitTop(r[1], ',')) {
        bases.push(b.replace(/\s+/g, ' '))
        baseRefs.push(b.replace(/<[\s\S]*$/, '').trim())
        baseKinds.push(role)
      }
    }
    take(/\bextends\s+([\s\S]*?)(?=\bimplements\b|\bpermits\b|$)/, kw === 'interface' || kw === '@interface' ? undefined : 'extends')
    take(/\bimplements\s+([\s\S]*?)(?=\bextends\b|\bpermits\b|$)/, 'implements')
    const bodyStart = chunk.start + open + 1
    const bodyEnd = balanced(text, chunk.start + open, '{', '}') - 1
    return {
      kind: kw === '@interface' ? 'interface' : kw,
      name, generics, mods, primary, bases, baseRefs, baseKinds, namespace, bodyStart, bodyEnd,
      line: lineAt(chunk.start + skipLeading(s)),
    }
  }

  function walk(from, to, namespace) {
    for (const chunk of splitMembers(text, from, to)) {
      const d = readType(chunk, namespace)
      if (d) readTypeBody(d)
    }
  }

  function readTypeBody(d) {
    const t = {
      id: d.namespace ? `${d.namespace}.${d.name}` : d.name,
      name: d.name,
      namespace: d.namespace,
      display: d.name + d.generics.replace(/\s+/g, ' '),
      kind: d.kind,
      abstract: d.mods.has('abstract'),
      static: false,
      bases: d.bases, baseRefs: d.baseRefs, baseKinds: d.baseKinds,
      usings,
      path, line: d.line, locations: [{ path, line: d.line }],
      fields: [], methods: [], values: [],
    }
    decls.push(t)
    const withLoc = (m, line) => ({ ...m, path, line })
    let membersFrom = d.bodyStart

    if (d.kind === 'record' && d.primary.trim()) {
      for (const p of splitTop(d.primary, ',')) {
        const toks = splitTop(stripAnnotations(p).replace(/\bfinal\b/g, '').trim(), ' ')
        if (toks.length < 2) continue
        const name = toks[toks.length - 1]
        const type = toks.slice(0, -1).join(' ')
        t.fields.push(withLoc({ kind: 'property', vis: '+', static: false, abstract: false, name, type, text: `${name}: ${type}` }, d.line))
      }
    }

    if (d.kind === 'enum') {
      // hằng số: phần trước dấu `;` ngoài cùng (hoặc cả thân nếu không có `;`)
      let semi = d.bodyEnd
      for (let i = d.bodyStart; i < d.bodyEnd; i++) {
        const c = text[i]
        if (c === '(' || c === '{') {
          i = balanced(text, i, c, c === '(' ? ')' : '}') - 1 // bỏ qua tham số / thân của từng hằng số
        } else if (c === ';') {
          semi = i
          break
        }
      }
      const consts = text.slice(d.bodyStart, semi)
      let offset = 0
      for (const part of consts.split(/,(?![^(){}]*[)}])/)) {
        const m = /([A-Za-z_$][\w$]*)/.exec(stripAnnotations(part))
        if (m) {
          const at = d.bodyStart + offset + part.indexOf(m[1])
          t.values.push(withLoc({ kind: 'value', vis: '+', static: false, abstract: false, name: m[1], text: m[1] }, lineAt(at)))
        }
        offset += part.length + 1
      }
      membersFrom = Math.min(semi + 1, d.bodyEnd)
    }

    for (const chunk of splitMembers(text, membersFrom, d.bodyEnd)) {
      const nested = readType(chunk, d.namespace ? `${d.namespace}.${d.name}` : d.name)
      if (nested) {
        readTypeBody(nested)
        continue
      }
      const s = text.slice(chunk.start, chunk.end)
      const line = lineAt(chunk.start + skipLeading(s))
      try {
        for (const m of parseMember(s, t)) (m.kind === 'method' || m.kind === 'ctor' ? t.methods : t.fields).push(withLoc(m, line))
      } catch {
        /* bỏ qua thành viên không đọc được */
      }
    }
  }

  walk(0, text.length, pkg)
  return decls
}

export function parseJavaFiles(files) {
  const merged = new Map()
  for (const f of files ?? []) {
    let decls = []
    try {
      decls = parseJavaFile(String(f?.text ?? ''), f?.path ?? '')
    } catch {
      /* bỏ qua file không đọc được */
    }
    for (const d of decls) {
      const prev = merged.get(d.id)
      if (!prev) merged.set(d.id, d)
      else {
        prev.locations.push(...d.locations) // cùng tên đầy đủ ở nhiều file (hiếm): gộp
        for (const u of d.usings) if (!prev.usings.includes(u)) prev.usings.push(u)
      }
    }
  }
  const types = [...merged.values()]
  return { types, relations: buildRelations(types, { collection: COLLECTION }) }
}

export const parseJava = (source) => parseJavaFiles([{ path: '', text: source }])
