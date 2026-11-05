// parsers/python.js — Parser Python cho sơ đồ class. Khối được xác định bằng THỤT LỀ (không có dấu ngoặc nhọn).
//
// parsePythonFiles([{ path, text }]) → { types, relations } — cùng mô hình dữ liệu với csharp.js (xem mô tả ở đó).
//   namespace = module suy ra từ đường dẫn (pkg/mod.py → pkg.mod; __init__.py → pkg), id = namespace.Tên (lồng: module.Outer.Inner).
//   `import` / `from … import` (kể cả tương đối `from .x import Y`) được dùng để nối kiểu giữa các module.
//   Bao phủ: class, kiểu lồng nhau, kế thừa nhiều lớp, @dataclass (→ record), Enum (→ enum, giá trị là hằng số), Protocol (→ interface),
//   ABC / @abstractmethod, @property / @staticmethod / @classmethod, annotation (`x: int`, `-> Foo`, `'Foo'` forward ref),
//   thuộc tính khai báo trong __init__ (`self.x = …`; kiểu lấy từ annotation, tham số cùng tên hoặc `Foo(...)`).
//   Không bao phủ: lớp cục bộ trong hàm; thuộc tính gán ở method khác ngoài __init__ / __post_init__.

import { balanced, makeLineLookup, maskSource, splitTopRanges } from './common.js'
import { buildRelations } from './relations.js'

const SYNTAX = { line: '#', quotes: ['"', "'"], triple: ['"""', "'''"] }
const COLLECTION = /\b(List|list|Set|set|FrozenSet|frozenset|Sequence|MutableSequence|Iterable|Collection|Tuple|tuple|Deque|deque|Dict|dict|Mapping|MutableMapping|DefaultDict|defaultdict|OrderedDict)\b/
const ENUM_BASES = new Set(['Enum', 'IntEnum', 'StrEnum', 'Flag', 'IntFlag'])
const RECORD_BASES = new Set(['NamedTuple', 'TypedDict'])

const width = (ws) => [...ws].reduce((w, c) => w + (c === '\t' ? 4 : 1), 0)

/** pkg/sub/mod.py → pkg.sub.mod; pkg/__init__.py → pkg */
export function moduleOf(path) {
  const parts = String(path ?? '').replace(/\\/g, '/').replace(/\.pyi?$/, '').split('/').filter(Boolean)
  if (parts[parts.length - 1] === '__init__') parts.pop()
  return parts.join('.')
}

/**
 * `usings` của Python: 'module::Tên' cho `from module import Tên` và 'module' cho `from module import *`.
 * Tên chỉ nhìn thấy khi được import đích danh; module có thể nằm dưới thư mục gốc dự án (`src.app.models` khớp `app.models`).
 */
const nsMatches = (using, ns, name) => {
  const [mod, imported] = using.split('::')
  if (imported !== undefined && imported !== name) return false
  return ns === mod || ns.endsWith(`.${mod}`)
}

const cleanType = (o) => o.replace(/#[^\n]*/g, '').replace(/['"]/g, '').replace(/\s+/g, ' ').trim()

function parsePythonFile(source, path) {
  const text = maskSource(source, SYNTAX)
  const lineAt = makeLineLookup(source)
  const mod = moduleOf(path)
  const isInit = /(^|\/)__init__\.pyi?$/.test(String(path).replace(/\\/g, '/'))
  const pkg = isInit ? mod : mod.split('.').slice(0, -1).join('.')

  const L = []
  let off = 0
  for (const line of text.split('\n')) {
    L.push({ start: off, indent: width(/^[ \t]*/.exec(line)[0]), blank: !line.trim(), text: line })
    off += line.length + 1
  }
  const lineIdx = (offset) => lineAt(offset) - 1

  // ---------- import ----------
  const usings = []
  const addUsing = (u) => {
    if (u && !usings.includes(u)) usings.push(u)
  }
  for (const m of text.matchAll(/^[ \t]*from[ \t]+(\.*)([\w.]*)[ \t]+import[ \t]+(\([\s\S]*?\)|[^\n]*)/gm)) {
    const dots = m[1].length
    let base = m[2]
    if (dots) {
      const parts = pkg ? pkg.split('.') : []
      base = [...parts.slice(0, Math.max(0, parts.length - (dots - 1))), m[2]].filter(Boolean).join('.')
    }
    if (!base) continue // `from . import x`: x là module con, dùng dưới dạng `x.Tên` (đã xử lý bằng qualifier)
    for (const name of m[3].replace(/[()#]/g, '').split(',')) {
      const n = name.trim().split(/\s+as\s+/)[0]
      if (n === '*') addUsing(base)
      else if (/^\w+$/.test(n)) addUsing(`${base}::${n}`)
    }
  }
  // `import a.b` không cần ghi nhận: tên được dùng kèm qualifier `a.b.Tên`, bộ nối kiểu tự khớp theo namespace

  // ---------- tìm class ----------
  const classes = []
  for (let li = 0; li < L.length; li++) {
    const m = /^([ \t]*)class[ \t]+([A-Za-z_]\w*)[ \t]*([(:])/.exec(L[li].text)
    if (!m) continue
    const indent = width(m[1])
    let basesFrom = -1
    let basesTo = -1
    let colon
    if (m[3] === '(') {
      const open = L[li].start + m[0].length - 1
      const close = balanced(text, open, '(', ')')
      basesFrom = open + 1
      basesTo = close - 1
      colon = text.indexOf(':', close)
    } else colon = L[li].start + m[0].length - 1
    if (colon < 0) continue
    // class lồng trong hàm → bỏ qua (class ở thụt lề 0 không có dòng cha — khỏi quét ngược về đầu file cho mỗi class)
    if (indent > 0) {
      let p = li - 1
      while (p >= 0 && (L[p].blank || L[p].indent >= indent)) p--
      if (p >= 0 && /^\s*(?:async\s+)?def\b/.test(L[p].text)) continue
    }
    // phạm vi thân: các dòng sau header mà thụt vào sâu hơn (hoặc trống)
    const headerLine = lineIdx(colon)
    let to = headerLine + 1
    while (to < L.length && (L[to].blank || L[to].indent > indent)) to++
    while (to > headerLine + 1 && L[to - 1].blank) to--
    const decorators = []
    for (let d = li - 1; d >= 0 && L[d].indent === indent && /^\s*@/.test(L[d].text); d--) decorators.push(/^\s*@([\w.]+)/.exec(L[d].text)?.[1] ?? '')
    classes.push({ name: m[2], indent, li, bodyFrom: headerLine + 1, bodyTo: to, basesFrom, basesTo, decorators })
  }

  // class lồng nhau: lớp ngoài là lớp gần nhất chứa nó
  const stack = []
  for (const c of classes) {
    while (stack.length && (stack[stack.length - 1].bodyTo <= c.li || stack[stack.length - 1].indent >= c.indent)) stack.pop()
    c.outer = stack[stack.length - 1] ?? null
    c.namespace = c.outer ? c.outer.id : mod
    c.id = c.namespace ? `${c.namespace}.${c.name}` : c.name
    stack.push(c)
  }

  const types = []
  for (const c of classes) {
    // ---- kế thừa ----
    const bases = []
    const baseRefs = []
    let abstract = false
    const simple = new Set()
    if (c.basesFrom >= 0) {
      for (const { from, to } of splitTopRanges(text.slice(c.basesFrom, c.basesTo), ',')) {
        const raw = source.slice(c.basesFrom + from, c.basesFrom + to).replace(/#[^\n]*/g, '').replace(/\s+/g, ' ').trim()
        if (!raw) continue
        if (/^metaclass\s*=/.test(raw)) {
          if (/ABCMeta/.test(raw)) abstract = true
          continue
        }
        if (raw.includes('=') || raw === 'object' || /^(typing\.)?Generic\b/.test(raw)) continue
        const ref = raw.replace(/\[[\s\S]*$/, '').trim()
        bases.push(raw)
        baseRefs.push(ref)
        simple.add(ref.split('.').pop())
      }
    }
    if (simple.has('ABC')) abstract = true
    const decoNames = c.decorators.map((d) => d.split('.').pop())
    const kind = [...simple].some((b) => ENUM_BASES.has(b)) ? 'enum'
      : simple.has('Protocol') ? 'interface'
        : decoNames.includes('dataclass') || [...simple].some((b) => RECORD_BASES.has(b)) ? 'record' : 'class'

    const t = {
      id: c.id, name: c.name, namespace: c.namespace, display: c.name, kind, abstract, static: false,
      bases, baseRefs, baseKinds: [], usings, path, line: lineAt(L[c.li].start + c.indent), locations: [], fields: [], methods: [], values: [],
    }
    t.locations.push({ path, line: t.line })
    types.push(t)

    // ---- thành viên ----
    const body = L.slice(c.bodyFrom, c.bodyTo)
    const first = body.find((l) => !l.blank)
    if (!first) continue
    const bi = first.indent
    let decos = []
    const seen = new Set()
    const push = (list, m) => {
      const key = `${m.kind}:${m.name}`
      if (seen.has(key)) return
      seen.add(key)
      list.push({ ...m, path })
    }
    const visOf = (name) => (name.startsWith('__') && !name.endsWith('__') ? '-' : name.startsWith('_') && !name.startsWith('__') ? '#' : '+')

    for (let k = c.bodyFrom; k < c.bodyTo; k++) {
      const ln = L[k]
      if (ln.blank || ln.indent !== bi) continue
      const lineText = ln.text.trim()

      if (lineText.startsWith('@')) {
        decos.push(/^@([\w.]+)/.exec(lineText)?.[1] ?? '')
        continue
      }
      const dm = /^(?:async[ \t]+)?def[ \t]+([A-Za-z_]\w*)[ \t]*\(/.exec(lineText)
      if (dm) {
        const name = dm[1]
        const decoSet = new Set(decos.map((d) => d.split('.').pop()))
        const wasSetter = decos.some((d) => /\.(setter|deleter)$/.test(d))
        decos = []
        if (wasSetter || decoSet.has('overload')) continue
        const open = ln.start + (ln.text.length - ln.text.trimStart().length) + dm[0].length - 1
        const close = balanced(text, open, '(', ')')
        const params = []
        const paramTypes = {}
        for (const { from, to } of splitTopRanges(text.slice(open + 1, close - 1), ',')) {
          const pm = text.slice(open + 1 + from, open + 1 + to)
          const po = source.slice(open + 1 + from, open + 1 + to)
          if (!pm.trim() || pm.trim() === '/' || pm.trim() === '*') continue
          const colon = (() => { let d = 0; for (let i = 0; i < pm.length; i++) { const ch = pm[i]; if ('([{'.includes(ch)) d++; else if (')]}'.includes(ch)) d--; else if (d === 0 && (ch === ':' || (ch === '=' && pm[i + 1] !== '='))) return ch === ':' ? i : -1 } return -1 })()
          const eq = pm.search(/=(?!=)/)
          const name2 = (colon >= 0 ? pm.slice(0, colon) : eq >= 0 ? pm.slice(0, eq) : pm).trim()
          const pType = colon >= 0 ? cleanType(po.slice(colon + 1, eq > colon ? eq : po.length)) : ''
          const bare = name2.replace(/^\*+/, '')
          if (bare) paramTypes[bare] = pType
          if (!['self', 'cls'].includes(name2)) params.push(pType ? `${name2}: ${pType}` : name2)
        }
        // kiểu trả về: `-> X` đến dấu `:` kết thúc header
        let ret = ''
        const arrow = /^\s*->\s*/.exec(text.slice(close))
        let colonAt
        if (arrow) {
          const from = close + arrow[0].length
          let d = 0
          let i = from
          for (; i < text.length; i++) {
            const ch = text[i]
            if ('([{'.includes(ch)) d++
            else if (')]}'.includes(ch)) d--
            else if (ch === ':' && d === 0) break
          }
          ret = cleanType(source.slice(from, i))
          colonAt = i
        } else colonAt = text.indexOf(':', close)
        const isStatic = decoSet.has('staticmethod') || decoSet.has('classmethod')
        const common = { vis: visOf(name), static: isStatic, abstract: decoSet.has('abstractmethod'), line: lineAt(ln.start + ln.indent) }
        if (decoSet.has('abstractmethod')) t.abstract = true

        if (decoSet.has('property') || decoSet.has('cached_property')) {
          push(t.fields, { ...common, kind: 'property', name, type: ret, text: ret ? `${name}: ${ret}` : name })
        } else {
          const p = params.join(', ')
          push(t.methods, {
            ...common, kind: name === '__init__' ? 'ctor' : 'method', name, ret, params: p,
            text: `${name}(${p})` + (ret && ret !== 'None' ? ` -> ${ret}` : ''),
          })
        }

        // thuộc tính khai báo trong __init__ / __post_init__
        if (name === '__init__' || name === '__post_init__') {
          const hl = lineIdx(colonAt)
          for (let b = hl + 1; b < c.bodyTo && (L[b].blank || L[b].indent > bi); b++) {
            const sm = /^\s*self\.([A-Za-z_]\w*)\s*(?::([^=]+?))?\s*=(?!=)\s*([\s\S]*)$/.exec(L[b].text)
            if (!sm) continue
            let type = ''
            if (sm[2]) {
              const at = L[b].text.indexOf(':', L[b].text.indexOf('self.'))
              type = cleanType(source.slice(L[b].start + at + 1, L[b].start + at + 1 + sm[2].length + (L[b].text.slice(at + 1).length - L[b].text.slice(at + 1).trimStart().length)))
            }
            if (!type) {
              const v = sm[3].trim()
              type = paramTypes[v] || (/^([A-Z]\w*(?:\.[A-Z]\w*)*)\s*\(/.exec(v)?.[1] ?? '')
            }
            push(t.fields, { kind: 'field', vis: visOf(sm[1]), static: false, abstract: false, name: sm[1], type, text: type ? `${sm[1]}: ${type}` : sm[1], line: lineAt(L[b].start + L[b].indent) })
          }
        }
        continue
      }
      if (/^(?:async[ \t]+)?def\b|^class\b/.test(lineText)) {
        decos = []
        continue
      }
      // gán thuộc tính cấp lớp: `x: int = 1`, `X = 1`, `x: int`
      const am = /^([A-Za-z_]\w*)\s*(?::([^=]+?))?\s*(?:=(?!=)([\s\S]*))?$/.exec(lineText)
      decos = []
      if (!am || (am[2] === undefined && am[3] === undefined)) continue
      const name = am[1]
      if (kind === 'enum') {
        if (!name.startsWith('_')) push(t.values, { kind: 'value', vis: '+', static: false, abstract: false, name, text: name, line: lineAt(ln.start + ln.indent) })
        continue
      }
      let type = ''
      if (am[2] !== undefined) {
        const colonAt = ln.text.indexOf(':', ln.text.indexOf(name) + name.length)
        type = cleanType(source.slice(ln.start + colonAt + 1, ln.start + colonAt + 1 + ln.text.slice(colonAt + 1).replace(/=(?!=)[\s\S]*$/, '').length))
      }
      const classVar = /^ClassVar\b/.test(type) || am[2] === undefined
      push(t.fields, { kind: 'field', vis: visOf(name), static: classVar, abstract: false, name, type, text: type ? `${name}: ${type}` : name, line: lineAt(ln.start + ln.indent) })
    }
  }
  return types
}

export function parsePythonFiles(files) {
  const merged = new Map()
  for (const f of files ?? []) {
    let decls = []
    try {
      decls = parsePythonFile(String(f?.text ?? ''), f?.path ?? '')
    } catch {
      /* bỏ qua file không đọc được */
    }
    for (const d of decls) {
      const prev = merged.get(d.id)
      if (!prev) merged.set(d.id, d)
      else prev.locations.push(...d.locations)
    }
  }
  const types = [...merged.values()]
  return { types, relations: buildRelations(types, { collection: COLLECTION, nsMatches }) }
}

export const parsePython = (source) => parsePythonFiles([{ path: '', text: source }])
