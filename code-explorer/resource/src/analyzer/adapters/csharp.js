// adapters/csharp.js — C# (.cs). Parser nhẹ dựa trên regex.
//
//   symbol: class (meta.ns, meta.fqn) — gồm class, interface, record, struct, enum
//   ref:    cs-type-ref { name, edge: 'extends' | 'uses' }
//   facts.cs = { usings, namespaces, types: [{ name, kind, ns, line, attributes, supertypes,
//               ctorParamTypes, members: [{ method, attributes, line }] }],
//               diRegistrations: [{ iface, impl, line }], minimalApis: [{ method, path, line }] }
//
// Phần riêng của ASP.NET (controller, route, DI) nằm ở frameworks/index.js.

import { createUnit, addSymbol, addRef, maskComments, makeLineLookup, capitalizedIdents, splitTopLevel, matchClose } from '../utils.js'
import { findHeaderEnd, leadingSegment, paramTypes, typeNames } from './clike.js'

export const csharpAdapter = {
  id: 'csharp',
  extensions: ['.cs'],
  // bỏ file sinh tự động
  match: (sf) => !/\.(designer|g|g\.i|AssemblyInfo)\.cs$/i.test(sf.name) && !/(^|\/)Migrations\//.test(sf.path),
  analyze(sf, text) {
    const unit = createUnit(sf, 'csharp', 'csharp')
    const src = maskComments(text, { style: 'c' })
    const code = maskComments(text, { style: 'c', maskStrings: true })
    const lineAt = makeLineLookup(src)

    const usings = []
    for (const m of src.matchAll(/^[ \t]*(global[ \t]+)?using[ \t]+(static[ \t]+)?(?:(\w+)[ \t]*=[ \t]*)?([\w.]+)[ \t]*;/gm)) {
      usings.push({ ns: m[4], static: !!m[2], alias: m[3] ?? null, global: !!m[1], line: lineAt(m.index) })
    }
    const namespaces = [...code.matchAll(/\bnamespace\s+([\w.]+)/g)].map((m) => ({ name: m[1], pos: m.index }))
    const nsAt = (pos) => {
      let ns = ''
      for (const n of namespaces) if (n.pos <= pos) ns = n.name
      return ns
    }

    // --- Khai báo kiểu ---
    const matches = [...code.matchAll(/\b(class|interface|record|struct|enum)\s+([A-Z]\w*)/g)]
    const types = matches.map((m, i) => {
      const start = m.index
      const afterName = start + m[0].length
      const bodyStart = findHeaderEnd(src, afterName)
      const nextStart = matches[i + 1]?.index ?? src.length
      const header = src.slice(afterName, bodyStart)
      const body = src.slice(bodyStart, nextStart)
      const prevEnd = i > 0 ? findHeaderEnd(src, matches[i - 1].index + matches[i - 1][0].length) : 0
      const { params, supers } = splitCsHeader(header)
      const ctor = new RegExp(`\\b${m[2]}\\s*\\(([^)]*)\\)\\s*(?::\\s*(?:base|this)\\s*\\([^)]*\\)\\s*)?\\{`).exec(body)
      return {
        kind: m[1],
        name: m[2],
        ns: nsAt(start),
        line: lineAt(start),
        attributes: parseAttributeBlocks(leadingSegment(src, start, prevEnd)),
        supertypes: typeNames(supers),
        ctorParamTypes: paramTypes(params || ctor?.[1] || ''), // primary constructor (C# 12) hoặc constructor thường
        members: memberAttributes(src, bodyStart, nextStart, lineAt),
      }
    })

    // --- DI: services.AddScoped<IFoo, Foo>() ---
    const diRegistrations = []
    for (const m of code.matchAll(/\.Add(Scoped|Transient|Singleton|HostedService|DbContext)\s*<\s*([\w.]+)\s*(?:,\s*([\w.]+)\s*)?>/g)) {
      diRegistrations.push({ iface: m[2].split('.').pop(), impl: (m[3] ?? m[2]).split('.').pop(), lifetime: m[1], line: lineAt(m.index) })
    }

    // --- Minimal API: app.MapGet("/x", ...), kể cả MapGroup("/api") ---
    const groups = {}
    for (const m of src.matchAll(/\b(\w+)\s*=\s*\w+(?:\.\w+)*\.MapGroup\(\s*"([^"]*)"/g)) groups[m[1]] = m[2]
    const minimalApis = []
    for (const m of src.matchAll(/\b(\w+)\.Map(Get|Post|Put|Delete|Patch)\s*\(\s*"([^"]*)"/g)) {
      const prefix = groups[m[1]] ?? ''
      minimalApis.push({ method: m[2].toUpperCase(), path: `${prefix.replace(/\/$/, '')}/${m[3].replace(/^\//, '')}`, line: lineAt(m.index) })
    }

    // --- Symbol & ref ---
    const own = new Set(types.map((t) => t.name))
    for (const t of types) {
      addSymbol(unit, 'class', t.name, t.line, { classKind: t.kind, ns: t.ns, fqn: t.ns ? `${t.ns}.${t.name}` : t.name })
      for (const s of t.supertypes) addRef(unit, 'cs-type-ref', { name: s, edge: 'extends' }, t.line)
    }
    const body = code.replace(/^[ \t]*(global[ \t]+)?using[^\n]*$/gm, '')
    for (const n of capitalizedIdents(body)) if (!own.has(n)) addRef(unit, 'cs-type-ref', { name: n, edge: 'uses' }, null)

    unit.facts.cs = { usings, namespaces: namespaces.map((n) => n.name), types, diRegistrations, minimalApis }
    return unit
  },
}

// ---------------------------------------------------------------------------
// [ApiController]\n[Route("api/[controller]")] -> [{ name: 'ApiController', args: '' }, { name: 'Route', args: '"api/[controller]"' }]
function parseAttributeBlocks(segment) {
  const out = []
  for (const block of segment.matchAll(/\[((?:[^[\]]|\[[^\]]*\])*)\]/g)) {
    for (const part of splitTopLevel(block[1], ',')) {
      const m = /^\s*([\w.]+)\s*(?:\(([\s\S]*)\))?\s*$/.exec(part)
      if (m) out.push({ name: m[1].split('.').pop().replace(/Attribute$/, ''), args: m[2] ?? '' })
    }
  }
  return out
}

// Method có attribute ([HttpGet("{id}")], [Route(...)]...) trong thân lớp
function memberAttributes(src, from, to, lineAt) {
  const region = src.slice(from, to)
  const out = []
  const re = /((?:\[(?:[^[\]]|\[[^\]]*\])*\]\s*)+)(?:(?:public|private|protected|internal|static|virtual|override|async|sealed|new|abstract|partial)\s+)*[\w<>[\],.?\s]*?\b(\w+)\s*(?:<[^>]*>)?\s*\(/g
  for (const m of region.matchAll(re)) {
    const attributes = parseAttributeBlocks(m[1])
    if (attributes.length) out.push({ method: m[2], attributes, line: lineAt(from + m.index) })
  }
  return out
}

// class Foo<T>(IBar bar) : Base, IFoo where T : class
function splitCsHeader(h) {
  let s = h.trimStart()
  if (s.startsWith('<')) s = s.slice(matchClose(s, 0, '<', '>') + 1).trimStart()
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
