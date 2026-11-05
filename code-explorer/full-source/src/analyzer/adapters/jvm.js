// adapters/jvm.js — Java (.java) và Kotlin (.kt, .kts). Parser nhẹ dựa trên regex.
//
//   symbol: class (meta.fqcn, meta.annotations)
//   ref:    jvm-import, type-ref { name, edge: 'extends' | 'uses' }
//   facts.jvm = { pkg, imports, classes: [{ name, kind, line, header, annotations,
//                 members: [{ name, args, line, member }], supertypes, ctorParamTypes, finalFieldTypes }] }
//
// Phần riêng của Spring (endpoint, tiêm phụ thuộc...) nằm ở frameworks/index.js và đọc facts.jvm.

import { createUnit, addSymbol, addRef, maskComments, makeLineLookup, capitalizedIdents, matchClose } from '../utils.js'
import { findHeaderEnd, leadingSegment, paramTypes, typeNames } from './clike.js'

const ANNOTATION_RE = /@([A-Za-z_][\w.]*)(\s*\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\))?/g
const MODIFIERS_RE = /^(?:\s|public\b|private\b|protected\b|internal\b|static\b|final\b|abstract\b|open\b|override\b|suspend\b|synchronized\b|default\b|lateinit\b|inline\b|operator\b|const\b)+/

export const javaAdapter = {
  id: 'java',
  extensions: ['.java'],
  analyze: (sf, text) => analyzeJvm(sf, text, 'java'),
}
export const kotlinAdapter = {
  id: 'kotlin',
  extensions: ['.kt', '.kts'],
  match: (sf) => !/^(build|settings)\.gradle\.kts$/.test(sf.name),
  analyze: (sf, text) => analyzeJvm(sf, text, 'kotlin'),
}

function analyzeJvm(sf, text, lang) {
  const unit = createUnit(sf, lang, lang)
  const kotlin = lang === 'kotlin'
  const src = maskComments(text, { style: 'c' }) // giữ chuỗi: cần đọc "/api/..." trong annotation
  const code = maskComments(text, { style: 'c', maskStrings: true }) // để quét tên kiểu, tránh chữ trong chuỗi
  const lineAt = makeLineLookup(src)

  const pkg = /^[ \t]*package[ \t]+([\w.]+)/m.exec(src)?.[1] ?? ''

  const imports = []
  for (const m of src.matchAll(/^[ \t]*import[ \t]+(static[ \t]+)?([\w.]+?)(\.\*)?(?:[ \t]+as[ \t]+(\w+))?[ \t]*;?[ \t]*$/gm)) {
    imports.push({ fqcn: m[2], static: !!m[1], wildcard: !!m[3], alias: m[4] ?? null, line: lineAt(m.index) })
  }

  // --- Khai báo kiểu ---
  const classes = []
  for (const m of code.matchAll(/\b(class|interface|enum|record|object)[ \t]+([A-Z]\w*)/g)) {
    const start = m.index
    const afterName = start + m[0].length
    const bodyStart = findHeaderEnd(src, afterName, { kotlin })
    const prevEnd = classes.length ? classes[classes.length - 1].bodyStart : 0
    classes.push({
      kind: m[1],
      name: m[2],
      start,
      bodyStart,
      line: lineAt(start),
      header: src.slice(afterName, bodyStart),
      annotations: parseAnnotations(leadingSegment(src, start, prevEnd)),
      members: [],
      supertypes: [],
      ctorParamTypes: [],
      finalFieldTypes: [],
    })
  }

  // --- Annotation trên thành viên (method/field) ---
  for (const m of src.matchAll(ANNOTATION_RE)) {
    const owner = ownerOf(classes, m.index)
    if (!owner) continue
    const member = memberAfter(src, m.index + m[0].length)
    if (!member) continue // annotation của một lớp lồng -> đã tính ở trên
    owner.members.push({ name: m[1].split('.').pop(), args: stripParens(m[2]), line: lineAt(m.index), member })
  }

  // --- Lớp cha, constructor, field final ---
  classes.forEach((c, i) => {
    const bodyEnd = classes[i + 1]?.start ?? src.length
    const body = src.slice(c.bodyStart, bodyEnd)
    if (kotlin) {
      const { params, supers } = splitKotlinHeader(c.header)
      c.ctorParamTypes = paramTypes(params, { kotlin: true })
      c.supertypes = typeNames(supers)
    } else {
      const ext = /\bextends\s+([\s\S]*?)(?=\bimplements\b|$)/.exec(c.header)?.[1] ?? ''
      const impl = /\bimplements\s+([\s\S]*)$/.exec(c.header)?.[1] ?? ''
      c.supertypes = [...typeNames(ext), ...typeNames(impl)]
      const recordParams = c.kind === 'record' ? /^\s*(?:<[^>]*>)?\s*\(([^)]*)\)/.exec(c.header)?.[1] : null
      const ctor = new RegExp(`\\b${c.name}\\s*\\(([^)]*)\\)\\s*(?:throws[^{]*)?\\{`).exec(body)
      c.ctorParamTypes = paramTypes(recordParams ?? ctor?.[1] ?? '')
      c.finalFieldTypes = [...body.matchAll(/\bprivate\s+final\s+([A-Z]\w*)(?:<[^>]*>)?\s+\w+\s*;/g)].map((x) => x[1])
    }
  })

  // --- Symbol & ref ---
  for (const c of classes) {
    addSymbol(unit, 'class', c.name, c.line, {
      classKind: c.kind,
      fqcn: pkg ? `${pkg}.${c.name}` : c.name,
      pkg,
      annotations: c.annotations.map((a) => a.name),
    })
    for (const t of c.supertypes) addRef(unit, 'type-ref', { name: t, edge: 'extends' }, c.line)
  }
  for (const imp of imports) addRef(unit, 'jvm-import', { fqcn: imp.fqcn, wildcard: imp.wildcard, static: imp.static }, imp.line)

  // Tên kiểu được dùng trong file -> nối tới lớp CÙNG package (không cần import)
  const own = new Set(classes.map((c) => c.name))
  const body = code.replace(/^[ \t]*(package|import)[^\n]*$/gm, '')
  for (const n of capitalizedIdents(body)) if (!own.has(n)) addRef(unit, 'type-ref', { name: n, edge: 'uses' }, null)

  unit.facts.jvm = { pkg, imports, classes }
  return unit
}

// ---------------------------------------------------------------------------
function parseAnnotations(segment) {
  return [...segment.matchAll(ANNOTATION_RE)]
    .map((m) => ({ name: m[1].split('.').pop(), args: stripParens(m[2]) }))
    .filter((a) => a.name !== 'interface')
}

function stripParens(s) {
  return (s ?? '').trim().replace(/^\(/, '').replace(/\)$/, '')
}

function ownerOf(classes, pos) {
  let owner = null
  for (const c of classes) if (c.bodyStart < pos) owner = c
  return owner
}

// Thành viên đứng ngay sau một annotation: method hoặc field (kèm kiểu)
function memberAfter(src, idx) {
  let s = src.slice(idx, idx + 400)
  for (let k = 0; k < 10; k++) {
    const m = /^\s*@[\w.]+(\s*\((?:[^()]|\([^()]*\))*\))?/.exec(s)
    if (!m) break
    s = s.slice(m[0].length)
  }
  s = s.replace(MODIFIERS_RE, '')
  if (/^(class|interface|enum|record|object|data|sealed|abstract)\b/.test(s)) return null
  const stop = s.search(/[{;=]/)
  if (stop >= 0) s = s.slice(0, stop)
  let m
  if ((m = /\bfun\s+(?:<[^>]*>\s*)?(?:[\w.]+\.)?(\w+)\s*\(/.exec(s))) return { kind: 'method', name: m[1] }
  if ((m = /\b(?:val|var)\s+(\w+)\s*:\s*([A-Z]\w*)/.exec(s))) return { kind: 'field', name: m[1], type: m[2] }
  if ((m = /(\w+)\s*\(/.exec(s))) return { kind: 'method', name: m[1] }
  if ((m = /\b([A-Z]\w*)(?:<[^>]*>)?(?:\[\])?\s+(\w+)\s*$/.exec(s.trim()))) return { kind: 'field', name: m[2], type: m[1] }
  return null
}

// Kotlin: class Foo<T> @Inject constructor(private val repo: Repo) : Base(), IFoo where T : Any
function splitKotlinHeader(h) {
  let s = h.trimStart()
  if (s.startsWith('<')) s = s.slice(matchClose(s, 0, '<', '>') + 1)
  s = s.replace(/^\s*(?:@[\w.]+(?:\([^)]*\))?\s*)*(?:(?:private|public|internal|protected)\s+)?(?:constructor\s*)?/, '')
  let params = ''
  if (s.startsWith('(')) {
    const end = matchClose(s, 0, '(', ')')
    params = s.slice(1, end)
    s = s.slice(end + 1)
  }
  const colon = s.indexOf(':')
  const supers = colon >= 0 ? s.slice(colon + 1).split(/\bwhere\b/)[0] : ''
  return { params, supers }
}
