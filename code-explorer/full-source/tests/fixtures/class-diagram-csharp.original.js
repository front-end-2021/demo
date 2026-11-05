/**
 * Bộ đọc mã nguồn C# nhẹ (không phải compiler): lấy ra class / interface / struct / record / enum,
 * các thành viên (field, property, method, constructor) và quan hệ giữa chúng.
 * Không bao giờ ném lỗi — gặp đoạn không hiểu thì bỏ qua.
 *
 * parseCSharp(source) → { types: Type[], relations: Relation[] }
 *
 * Type     { id, name, display, kind, abstract, static, bases[], baseIds[], fields[], methods[], values[] }
 * Member   { kind, vis, name, type?, ret?, params?, static, abstract, text }
 * Relation { from, to, kind: 'generalization'|'realization'|'association'|'aggregation', label, many }
 */

const TYPE_KW = new Set(['class', 'interface', 'struct', 'enum', 'record'])
const TYPE_MODS = new Set(['public', 'private', 'protected', 'internal', 'static', 'abstract', 'sealed', 'partial', 'unsafe', 'new', 'readonly', 'file', 'ref'])
const MEMBER_MODS = new Set([
  'public', 'private', 'protected', 'internal', 'static', 'abstract', 'virtual', 'override', 'sealed', 'readonly',
  'const', 'async', 'extern', 'unsafe', 'new', 'partial', 'required', 'volatile', 'event', 'implicit', 'explicit',
])
const COLLECTION = /\b(List|IList|IEnumerable|ICollection|IReadOnlyList|IReadOnlyCollection|HashSet|ISet|Queue|Stack|LinkedList|ObservableCollection|Collection|Array|Dictionary|IDictionary|SortedSet|SortedList|ImmutableList|ImmutableArray)\b|\[\s*,*\s*\]/

// ---------------------------------------------------------------------------
// 1. Làm sạch: bỏ comment, #region, rút gọn chuỗi / ký tự để dấu { } trong chuỗi không gây nhiễu
// ---------------------------------------------------------------------------
function clean(src) {
  let out = ''
  let i = 0
  const n = src.length
  while (i < n) {
    const c = src[i]
    const d = src[i + 1]
    if (c === '/' && d === '/') {
      while (i < n && src[i] !== '\n') i++
      continue
    }
    if (c === '/' && d === '*') {
      const end = src.indexOf('*/', i + 2)
      i = end < 0 ? n : end + 2
      out += ' '
      continue
    }
    const isString = c === '"' || ((c === '@' || c === '$') && (d === '"' || ((d === '@' || d === '$') && src[i + 2] === '"')))
    if (isString) {
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
      out += '""'
      i = j + 1
      continue
    }
    if (c === "'") {
      let j = i + 1
      if (src[j] === '\\') j += 2
      else j++
      while (j < n && src[j] !== "'" && src[j] !== '\n') j++
      out += "''"
      i = j + 1
      continue
    }
    out += c
    i++
  }
  return out.replace(/^[ \t]*#.*$/gm, '')
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
    if (src[p] === '{') {
      const e = balanced(src, p, '{', '}')
      body = src.slice(p + 1, e - 1)
    } else if (src[p] !== ';') continue // không phải khai báo thật

    decls.push({ kind, isRecord, name, generics, primary, bases, body, mods: new Set(words) })
    re.lastIndex = p // vẫn quét tiếp bên trong để thấy kiểu lồng nhau
  }
  return decls
}

// ---------------------------------------------------------------------------
// 4. Thành viên
// ---------------------------------------------------------------------------
function splitMembers(body) {
  const chunks = []
  const push = (s) => {
    if (s.trim()) chunks.push(s)
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
          push(body.slice(start, i + 1))
          start = i + 1
        } else assigned = true // property có giá trị khởi tạo: { get; set; } = ...;
      }
    } else if (c === ';' && paren === 0 && brack === 0 && brace === 0) {
      push(body.slice(start, i))
      start = i + 1
      assigned = false
    } else if (c === '=' && paren === 0 && brack === 0 && brace === 0) {
      if (body[i + 1] === '=') i++
      else if (!'!<>='.includes(body[i - 1] ?? ' ')) assigned = true
    }
    if (brace === 0 && start === i + 1) assigned = false
  }
  push(body.slice(start))
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
const identsOf = (typeStr) => typeStr.match(/[A-Za-z_]\w*/g) ?? []

function buildRelations(types) {
  const byId = new Map(types.map((t) => [t.id, t]))
  const rels = new Map()
  const interf = 'interface'
  const rlz = 'realization'
  const gnz = 'generalization'
  const addMp = (from, to, kind, label = '', many = false) => {
    const key = `${from}|${to}|${kind}`; const r = rels.get(key)
    if (!r) rels.set(key, { key, from, to, kind, label, many, labels: label ? [label] : [] })
    else if (label && !r.labels.includes(label)) { r.labels.push(label); r.label = r.labels.join(', ') }
  }
  for (const t of types) {
    for (const id of t.baseIds) {
      const target = byId.get(id)
      if (!target || target === t) continue
      addMp(t.id, id, target.kind === interf && t.kind !== interf ? rlz : gnz)
    }
    for (const f of t.fields) {
      const many = COLLECTION.test(f.type)
      for (const id of new Set(identsOf(f.type))) {
        if (id === t.id || !byId.has(id)) continue
        addMp(t.id, id, many ? 'aggregation' : 'association', f.name, many)
      }
    }
  }
  return [...rels.values()].map(({ labels, ...r }) => ({ ...r, label: r.label + (r.many ? ' *' : '') }))
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------
export function parseCSharp(source) {
  let decls = []
  try {
    decls = findTypeDecls(clean(String(source ?? '')))
  } catch {
    decls = []
  }

  const byId = new Map()
  for (const d of decls) {
    let t = byId.get(d.name)
    if (!t) {
      t = {
        id: d.name,
        name: d.name,
        display: d.name + d.generics.replace(/\s+/g, ' '),
        kind: d.kind,
        abstract: d.mods.has('abstract'),
        static: d.mods.has('static'),
        bases: [],
        baseIds: [],
        fields: [],
        methods: [],
        values: [],
      }
      byId.set(d.name, t)
    }
    if (d.kind !== 'enum') {
      for (const b of d.bases) {
        const shown = b.replace(/\s+/g, ' ')
        if (!t.bases.includes(shown)) {
          t.bases.push(shown)
          t.baseIds.push(simpleId(b))
        }
      }
    }

    if (d.kind === 'enum') {
      t.values.push(...parseEnumValues(d.body).filter((v) => !t.values.some((x) => x.name === v.name)))
      continue
    }
    const { props, ctor } = positionalMembers(d.primary, d.isRecord ? 'record' : d.kind, d.name)
    const members = [...props, ...(ctor ? [ctor] : [])]
    for (const chunk of splitMembers(d.body)) {
      try {
        members.push(...parseMember(chunk, t))
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
  return { types, relations: buildRelations(types) }
}
