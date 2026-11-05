// related.js — Quan hệ của MỘT file, tính từ đồ thị đầy đủ trong Worker (giao diện chỉ giữ đồ thị của màn hình hiện tại).
//
//   symbols   : những gì file này ĐỊNH NGHĨA (class, hàm, component…) kèm số dòng      → "Định nghĩa"
//   uses      : file mà file này DÙNG (cạnh đi ra)                                     → "Dùng"
//   usedBy    : file DÙNG file này (cạnh đi vào)                                        → "Được dùng bởi"
//   externals : thư viện ngoài file này dùng (chỉ để hiển thị, không mở được)
//
// Mỗi mục của uses / usedBy gộp mọi cạnh giữa hai file thành một dòng:
//   { path, kinds[], labels[], confidence, count, line, lines[] }
//   uses   : line = dòng ĐỊNH NGHĨA trong file được dùng (tra theo tên trong `labels`); lines = các dòng dùng NGAY TRONG file này
//   usedBy : line = dòng file kia dùng file này (lines[0]); lines = mọi dòng như vậy
// Gọi API (front-end → endpoint) được nối tiếp tới FILE ĐỊNH NGHĨA endpoint, kể cả ở project khác, và ngược lại.
//
// Cạnh `exposes` / `defines` là file tự định nghĩa endpoint — không phải "dùng" nên không đưa vào uses / usedBy.

const DEFINES = new Set(['exposes', 'defines'])
const MAX_ENTRIES = 200
const MAX_LABELS = 8
const MAX_LINES = 6
const MAX_EXTERNALS = 30

/** Dòng định nghĩa trong `node` của symbol có tên khớp một trong `labels` (nhãn CSS '.x' / '#x' và tên có chấm đều được thử). */
function definitionLine(node, labels = []) {
  const symbols = node.symbols ?? []
  for (const raw of labels) {
    const name = String(raw).replace(/^[.#]/, '')
    for (const candidate of name.includes('.') ? [name, name.split('.').pop()] : [name]) {
      const s = symbols.find((x) => x.name === candidate)
      if (s?.line != null) return s.line
    }
  }
  return null
}

/**
 * @param {object} graph  graphology (hoặc đối tượng có hasNode, getNodeAttributes, forEachInEdge, forEachOutEdge)
 * @param {string} path   đường dẫn file
 * @param {(path: string) => string | undefined} idOf  id node của file theo đường dẫn
 */
export function computeRelated(graph, path, idOf) {
  const empty = { path, found: false, symbols: [], uses: [], usedBy: [], externals: [] }
  const id = idOf(path)
  if (!id || !graph.hasNode(id)) return empty
  const self = graph.getNodeAttributes(id)

  const uses = new Map()
  const usedBy = new Map()
  const externals = new Set()

  const entryOf = (map, p) => {
    let e = map.get(p)
    if (!e) map.set(p, (e = { path: p, kinds: new Set(), labels: [], confidence: 'inferred', count: 0, line: null, lines: [] }))
    return e
  }

  /** Gộp một cạnh vào mục. usageIn = file chứa các dòng tham chiếu (loc.path) cần lấy. */
  function merge(entry, edge, { usageIn, labels = edge.labels, defLine = null }) {
    entry.kinds.add(edge.kind)
    if (edge.confidence === 'certain') entry.confidence = 'certain'
    entry.count += edge.count ?? 1
    for (const l of labels ?? []) if (l && entry.labels.length < MAX_LABELS && !entry.labels.includes(l)) entry.labels.push(l)
    for (const loc of edge.locs ?? []) {
      if (loc.path === usageIn && loc.line != null && entry.lines.length < MAX_LINES && !entry.lines.includes(loc.line)) entry.lines.push(loc.line)
    }
    if (defLine != null && entry.line == null) entry.line = defLine
  }

  // ---- DÙNG: cạnh đi ra ----
  graph.forEachOutEdge(id, (_e, edge, _s, target, _sa, ta) => {
    if (DEFINES.has(edge.kind)) return
    if (ta.kind === 'file') {
      if (ta.path !== path) merge(entryOf(uses, ta.path), edge, { usageIn: path, defLine: definitionLine(ta, edge.labels) })
    } else if (ta.kind === 'endpoint') {
      // Gọi API: đi tiếp tới file định nghĩa endpoint (cạnh `exposes` đi vào endpoint), dòng định nghĩa lấy từ chính cạnh đó
      graph.forEachInEdge(target, (_e2, e2, _s2, _t2, ha) => {
        if (!DEFINES.has(e2.kind) || ha.kind !== 'file' || ha.path === path) return
        const defLine = e2.locs?.find((l) => l.path === ha.path)?.line ?? null
        merge(entryOf(uses, ha.path), edge, { usageIn: path, labels: [ta.label], defLine })
      })
    } else if (ta.kind === 'external') {
      externals.add(ta.label)
    }
  })

  // ---- ĐƯỢC DÙNG BỞI: cạnh đi vào ----
  const addCaller = (callerAttrs, edge, labels) => {
    if (callerAttrs.kind !== 'file' || callerAttrs.path === path) return
    merge(entryOf(usedBy, callerAttrs.path), edge, { usageIn: callerAttrs.path, labels })
  }
  graph.forEachInEdge(id, (_e, edge, _s, _t, sa) => {
    if (!DEFINES.has(edge.kind)) addCaller(sa, edge)
  })
  // Endpoint do file này định nghĩa: ai gọi chúng (back-end ← front-end)
  graph.forEachOutEdge(id, (_e, edge, _s, target, _sa, ta) => {
    if (!DEFINES.has(edge.kind) || ta.kind !== 'endpoint') return
    graph.forEachInEdge(target, (_e2, e2, _s2, _t2, ca) => {
      if (!DEFINES.has(e2.kind)) addCaller(ca, e2, [ta.label])
    })
  })
  for (const e of usedBy.values()) e.line = e.lines[0] ?? null

  const finish = (map) => [...map.values()]
    .sort((a, b) => b.count - a.count || (a.path < b.path ? -1 : a.path > b.path ? 1 : 0))
    .slice(0, MAX_ENTRIES)
    .map((e) => ({ ...e, kinds: [...e.kinds] }))

  return {
    path,
    found: true,
    symbols: (self.symbols ?? [])
      .filter((s) => s.kind !== 'variable')
      .map((s) => ({ kind: s.kind, name: s.name, line: s.line ?? null }))
      .sort((a, b) => (a.line ?? Infinity) - (b.line ?? Infinity)),
    uses: finish(uses),
    usedBy: finish(usedBy),
    externals: [...externals].slice(0, MAX_EXTERNALS),
  }
}
