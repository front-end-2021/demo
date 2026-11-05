// parsers/kotlin.js — Parser Kotlin cho sơ đồ class. KHÔNG phải Java đổi đuôi file: cú pháp khác hẳn.
//
// parseKotlinFiles([{ path, text }]) → { types, relations } — cùng mô hình dữ liệu với csharp.js (xem mô tả ở đó).
//   Khác Java: kiểu viết SAU tên (`val a: Int`), `fun` / `val` / `var`, constructor chính nằm ngay trong khai báo và
//   `val`/`var` trong đó TỰ TẠO thuộc tính, kế thừa bằng `:`, hầu như không có `;` (nên thành viên được cắt theo dòng).
//   Bao phủ: class / interface / object / enum class / data class / sealed / abstract / annotation class / fun interface,
//   companion object (thành viên thành static của lớp ngoài), kiểu lồng nhau, generic, `by` delegation, `where`.
//   Không bao phủ: hàm / thuộc tính mức file (không thuộc class nào), lớp cục bộ và `object :` ẩn danh.

import { balanced, makeLineLookup, maskSource, skipLeading, splitTop, stripAnnotations } from './common.js'
import { buildRelations } from './relations.js'

const SYNTAX = { line: '//', block: ['/*', '*/'], nested: true, quotes: ['"', "'"], triple: ['"""'], rawTriple: true, templates: true }
const COLLECTION = /\b(List|MutableList|ArrayList|LinkedList|Set|MutableSet|HashSet|LinkedHashSet|TreeSet|Collection|MutableCollection|Iterable|Sequence|Array|IntArray|LongArray|Queue|Deque|Map|MutableMap|HashMap|LinkedHashMap|TreeMap|Flow|StateFlow|Stream)\b/
const MODS = 'public|private|protected|internal|abstract|open|final|override|lateinit|const|inline|infix|operator|tailrec|suspend|data|sealed|inner|enum|annotation|companion|external|expect|actual|value'
const DECL_START = new RegExp(`^(?:(?:${MODS})\\s+)*(?:fun\\s+(?=interface\\b))?(fun|val|var|class|interface|object|constructor|init|typealias)\\b`)
const MEMBER_RE = new RegExp(`^((?:(?:${MODS})\\s+)*)(fun|val|var|constructor)\\b`)
const TYPE_RE = new RegExp(`^\\s*((?:(?:${MODS})\\s+)*)(?:fun\\s+(?=interface\\b))?(class|interface|object)\\b\\s*([A-Za-z_]\\w*)?`)

/** Cắt thân thành các thành viên THEO DÒNG: một thành viên mới bắt đầu ở dòng (ngoài mọi ngoặc) mở đầu bằng từ khoá khai báo. */
function splitMembers(text, from, to) {
  const starts = []
  let depth = 0
  let pendingAnno = false // đoạn trước chỉ có annotation → khai báo kế tiếp thuộc cùng thành viên
  for (let i = from; i < to; ) {
    // một "đoạn" kết thúc ở hết dòng hoặc ở dấu `;` nằm ngoài mọi ngoặc (`val a = 1; fun f() {}` trên một dòng)
    const depthAtStart = depth
    let j = i
    while (j < to && text[j] !== '\n') {
      const ch = text[j]
      if ('([{'.includes(ch)) depth++
      else if (')]}'.includes(ch)) depth = Math.max(0, depth - 1)
      else if (ch === ';' && depth === 0) break
      j++
    }
    const seg = text.slice(i, j)
    if (depthAtStart === 0 && /\S/.test(seg)) {
      const rest = stripAnnotations(seg).trim()
      if (rest === '') {
        if (!pendingAnno) starts.push(i)
        pendingAnno = true
      } else {
        if (DECL_START.test(rest) && !pendingAnno) starts.push(i)
        pendingAnno = false
      }
    }
    i = j + 1
  }
  return starts.map((st, k) => ({ start: st, end: starts[k + 1] ?? to }))
}

const visOf = (mods) => (mods.has('private') ? '-' : mods.has('protected') ? '#' : mods.has('internal') ? '~' : '+')

/** `a: Int = 1, vararg b: String` → `a: Int, b: String` */
function normalizeParams(raw) {
  return splitTop(raw, ',')
    .map((p) => stripAnnotations(p).replace(/\b(vararg|noinline|crossinline)\s+/g, '').replace(/^\s*(?:(?:public|private|protected|internal|override|open|final|lateinit)\s+)*(?:val|var)\s+/, '').replace(/\s*=[\s\S]*$/, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(', ')
}

function parseMember(chunk, owner, forceStatic) {
  const a = stripAnnotations(chunk).replace(/[;\s]+$/, '').trim() // đoạn bị cắt ở `;` vẫn mang dấu đó
  const m = MEMBER_RE.exec(a)
  if (!m) return []
  const mods = new Set(m[1].split(/\s+/).filter(Boolean))
  const kw = m[2]
  let rest = a.slice(m[0].length)
  const inInterface = owner.kind === 'interface'
  const base = { vis: inInterface ? '+' : visOf(mods), static: forceStatic || mods.has('const'), abstract: mods.has('abstract') }

  if (rest.trimStart().startsWith('<')) {
    const at = rest.indexOf('<')
    rest = rest.slice(balanced(rest, at, '<', '>'))
  }

  if (kw === 'constructor') {
    const open = rest.indexOf('(')
    if (open < 0) return []
    const params = normalizeParams(rest.slice(open + 1, balanced(rest, open, '(', ')') - 1))
    return [{ ...base, kind: 'ctor', name: owner.name, ret: '', params, text: `${owner.name}(${params})` }]
  }

  if (kw === 'fun') {
    // tên (có thể kèm kiểu nhận: `String.shout`) = phần trước dấu `(` đầu tiên nằm ngoài <>
    let angle = 0
    let open = -1
    for (let i = 0; i < rest.length; i++) {
      if (rest[i] === '<') angle++
      else if (rest[i] === '>' && rest[i - 1] !== '-') angle--
      else if (rest[i] === '(' && angle === 0) {
        open = i
        break
      }
    }
    if (open < 0) return []
    const name = rest.slice(0, open).replace(/<[^<>]*(?:<[^<>]*>[^<>]*)*>/g, '').trim()
    if (!name) return []
    const close = balanced(rest, open, '(', ')')
    const params = normalizeParams(rest.slice(open + 1, close - 1))
    const after = rest.slice(close)
    const rm = /^\s*:\s*([^{=]*)/.exec(after)
    const ret = rm ? rm[1].replace(/\swhere\s[\s\S]*$/, '').replace(/\s+/g, ' ').trim() : ''
    const hasBody = /^\s*(?::[^{=]*)?[{=]/.test(after)
    return [{
      ...base, abstract: base.abstract || (inInterface && !hasBody),
      kind: 'method', name, ret, params,
      text: `${name}(${params})` + (ret && ret !== 'Unit' ? `: ${ret}` : ''),
    }]
  }

  // val / var
  const cut = rest.search(/\s*=(?!=)|\sby\s|\s(?:get|set)\b|\n/)
  const decl = cut < 0 ? rest : rest.slice(0, cut)
  const init = cut < 0 ? '' : rest.slice(cut).replace(/^\s*(=|by)\s*/, '')
  const factory = /^(mutableListOf|listOf|arrayListOf|setOf|mutableSetOf|hashSetOf|mapOf|mutableMapOf|hashMapOf)\s*<([^()]*)>\s*\(/.exec(init)
  const [namePart, ...typeParts] = splitTop(decl, ':')
  if (!namePart || namePart.startsWith('(')) return [] // khai báo phân rã: val (a, b) = …
  const name = namePart.replace(/<[^<>]*>/g, '').trim()
  let type = typeParts.join(':').replace(/\s+/g, ' ').trim()
  // Không ghi kiểu: suy ra từ `Foo(...)` hoặc `mutableListOf<Foo>()`
  if (!type && factory) type = `${/map/i.test(factory[1]) ? 'Map' : /set/i.test(factory[1]) ? 'Set' : 'List'}<${factory[2].trim()}>`
  if (!type) type = /^([A-Z]\w*(?:\.[A-Z]\w*)*)\s*(?:<[^()]*>)?\s*\(/.exec(init)?.[1] ?? ''
  return [{ ...base, abstract: base.abstract || (inInterface && !init && !/\n\s*(get|set)\b/.test(rest)), kind: 'property', name, type, text: type ? `${name}: ${type}` : name }]
}

/** Tham số constructor chính → các thuộc tính (chỉ param có val / var) và chính constructor. */
function primaryMembers(raw, ownerName) {
  const props = []
  for (const p of splitTop(raw, ',')) {
    const m = /^((?:(?:public|private|protected|internal|override|open|final|lateinit)\s+)*)(val|var)\s+([A-Za-z_]\w*)\s*:\s*([\s\S]*?)(?:\s*=[\s\S]*)?$/.exec(stripAnnotations(p).replace(/\s+/g, ' ').trim())
    if (!m) continue
    const mods = new Set(m[1].split(/\s+/).filter(Boolean))
    props.push({ kind: 'property', vis: visOf(mods), static: false, abstract: false, name: m[3], type: m[4].trim(), text: `${m[3]}: ${m[4].trim()}` })
  }
  const params = normalizeParams(raw)
  const ctor = params ? { kind: 'ctor', vis: '+', static: false, abstract: false, name: ownerName, ret: '', params, text: `${ownerName}(${params})` } : null
  return { props, ctor }
}

function parseKotlinFile(source, path) {
  const text = maskSource(source, SYNTAX)
  const lineAt = makeLineLookup(source)
  const pkg = /^[ \t]*package\s+([\w.]+)/m.exec(text)?.[1] ?? ''
  const usings = []
  for (const m of text.matchAll(/^[ \t]*import\s+([\w.]+?)(\.\*)?(?:\s+as\s+\w+)?[ \t]*$/gm)) {
    const ns = m[2] ? m[1] : m[1].slice(0, Math.max(0, m[1].lastIndexOf('.')))
    if (ns && !usings.includes(ns)) usings.push(ns)
  }
  const decls = []

  function readType(chunk, namespace) {
    const s = text.slice(chunk.start, chunk.end)
    const m = TYPE_RE.exec(stripAnnotations(s))
    if (!m) return null
    const mods = new Set(m[1].split(/\s+/).filter(Boolean))
    const kw = m[2]
    const name = m[3] ?? ''
    if (kw === 'object' && !name && !mods.has('companion')) return null // `object : Foo()` ẩn danh
    const lead = skipLeading(s)
    const km = new RegExp(`\\b${kw}\\b\\s*${name}`).exec(s.slice(lead))
    if (!km) return null
    const afterName = lead + km.index + km[0].length
    let depth = 0
    let open = -1
    for (let i = afterName; i < s.length; i++) {
      if (s[i] === '(' || s[i] === '[') depth++
      else if (s[i] === ')' || s[i] === ']') depth--
      else if (s[i] === '{' && depth === 0) {
        open = i
        break
      }
    }
    let hdr = stripAnnotations(s.slice(afterName, open < 0 ? s.length : open))
    let generics = ''
    if (hdr.trimStart().startsWith('<')) {
      const at = hdr.indexOf('<')
      const e = balanced(hdr, at, '<', '>')
      generics = hdr.slice(at, e)
      hdr = hdr.slice(e)
    }
    let primary = ''
    const cm = /^\s*(?:(?:public|private|protected|internal)\s+)?(?:constructor\s*)?(?=\()/.exec(hdr)
    if (cm) {
      const at = cm[0].length
      const e = balanced(hdr, at, '(', ')')
      primary = hdr.slice(at + 1, e - 1)
      hdr = hdr.slice(e)
    }
    const bases = []
    const baseRefs = []
    const baseKinds = []
    const sm = /^\s*:\s*([\s\S]*?)(?:\swhere\s[\s\S]*)?$/.exec(hdr)
    if (sm) {
      for (const b0 of splitTop(sm[1], ',')) {
        const b = b0.replace(/\s+by\s[\s\S]*$/, '').trim()
        if (!b) continue
        bases.push(b.replace(/\([\s\S]*$/, '').replace(/\s+/g, ' ').trim())
        baseRefs.push(b.replace(/\([\s\S]*$/, '').replace(/<[\s\S]*$/, '').replace(/\?$/, '').trim())
        baseKinds.push(b.includes('(') ? 'extends' : undefined) // có `(…)` = gọi constructor lớp cha
      }
    }
    return {
      kw, name, mods, generics, primary, bases, baseRefs, baseKinds, namespace,
      companion: mods.has('companion'),
      bodyStart: open < 0 ? chunk.end : chunk.start + open + 1,
      bodyEnd: open < 0 ? chunk.end : balanced(text, chunk.start + open, '{', '}') - 1,
      line: lineAt(chunk.start + lead),
    }
  }

  function walk(from, to, namespace) {
    for (const chunk of splitMembers(text, from, to)) {
      const d = readType(chunk, namespace)
      if (d && !d.companion) readTypeBody(d)
    }
  }

  function readTypeBody(d) {
    const kind = d.kw === 'interface' || d.mods.has('annotation') ? 'interface' : d.mods.has('enum') ? 'enum' : d.mods.has('data') ? 'record' : 'class'
    const t = {
      id: d.namespace ? `${d.namespace}.${d.name}` : d.name,
      name: d.name, namespace: d.namespace,
      display: d.name + d.generics.replace(/\s+/g, ' '),
      kind,
      abstract: d.mods.has('abstract') || (d.mods.has('sealed') && kind === 'class'),
      static: d.kw === 'object', // object = singleton
      bases: d.bases, baseRefs: d.baseRefs, baseKinds: d.baseKinds,
      usings,
      path, line: d.line, locations: [{ path, line: d.line }],
      fields: [], methods: [], values: [],
    }
    decls.push(t)
    const withLoc = (mm, line) => ({ ...mm, path, line })

    const { props, ctor } = primaryMembers(d.primary, d.name)
    for (const p of props) t.fields.push(withLoc(p, d.line))
    if (ctor && kind !== 'interface') t.methods.push(withLoc(ctor, d.line))

    let membersFrom = d.bodyStart
    if (kind === 'enum') {
      let semi = d.bodyEnd
      for (let i = d.bodyStart; i < d.bodyEnd; i++) {
        const c = text[i]
        if (c === '(' || c === '{') i = balanced(text, i, c, c === '(' ? ')' : '}') - 1
        else if (c === ';') {
          semi = i
          break
        }
      }
      let offset = 0
      for (const part of text.slice(d.bodyStart, semi).split(/,(?![^(){}]*[)}])/)) {
        const m = /([A-Za-z_]\w*)/.exec(stripAnnotations(part))
        if (m) t.values.push(withLoc({ kind: 'value', vis: '+', static: false, abstract: false, name: m[1], text: m[1] }, lineAt(d.bodyStart + offset + part.indexOf(m[1]))))
        offset += part.length + 1
      }
      membersFrom = Math.min(semi + 1, d.bodyEnd)
    }

    const ns = d.namespace ? `${d.namespace}.${d.name}` : d.name
    const addMembers = (chunk, forceStatic) => {
      const s = text.slice(chunk.start, chunk.end)
      const line = lineAt(chunk.start + skipLeading(s))
      try {
        for (const mm of parseMember(s, t, forceStatic)) (mm.kind === 'method' || mm.kind === 'ctor' ? t.methods : t.fields).push(withLoc(mm, line))
      } catch {
        /* bỏ qua thành viên không đọc được */
      }
    }
    for (const chunk of splitMembers(text, membersFrom, d.bodyEnd)) {
      const nested = readType(chunk, ns)
      if (!nested) {
        addMembers(chunk, false)
        continue
      }
      if (nested.companion) {
        for (const c of splitMembers(text, nested.bodyStart, nested.bodyEnd)) addMembers(c, true) // companion object: thành viên là static của lớp ngoài
      } else readTypeBody(nested)
    }
  }

  walk(0, text.length, pkg)
  return decls
}

export function parseKotlinFiles(files) {
  const merged = new Map()
  for (const f of files ?? []) {
    let decls = []
    try {
      decls = parseKotlinFile(String(f?.text ?? ''), f?.path ?? '')
    } catch {
      /* bỏ qua file không đọc được */
    }
    for (const d of decls) {
      const prev = merged.get(d.id)
      if (!prev) merged.set(d.id, d)
      else {
        prev.locations.push(...d.locations)
        for (const u of d.usings) if (!prev.usings.includes(u)) prev.usings.push(u)
      }
    }
  }
  const types = [...merged.values()]
  return { types, relations: buildRelations(types, { collection: COLLECTION }) }
}

export const parseKotlin = (source) => parseKotlinFiles([{ path: '', text: source }])
