// 07-views.js — Bước 6: các "phép chiếu" từ cùng một đồ thị.
// Không vẽ gì ở đây: chỉ lọc / gom nhóm / trích xuất dữ liệu cho từng kiểu xem.
//
//   filterGraph(g, opts)        -> Graph con (ví dụ chỉ cạnh 'renders' = cây component)
//   aggregateByFolder(g, depth) -> Graph gom file theo thư mục (góc nhìn tổng quan)
//   componentTree(g)            -> cây [{ id, label, path, children }]   + treeToText()
//   apiBridge(g)                -> bảng cầu nối front-end <-> back-end
//   findCycles(g, kinds)        -> các vòng phụ thuộc (Tarjan)
//   textReport(g, opts)         -> báo cáo Markdown
//   toMermaid(g, opts)          -> sơ đồ Mermaid dạng văn bản

import Graph from 'graphology'

export const EDGE_KIND_LABELS = {
  imports: 'import', renders: 'render', emits: 'emit sự kiện', 'uses-store': 'dùng store',
  'uses-hook': 'dùng hook/composable', 'uses-context': 'dùng context', 'provides-context': 'cung cấp context',
  provides: 'provide/inject', 'styled-by': 'dùng CSS', dom: 'truy cập DOM', calls: 'gọi hàm',
  'routes-to': 'route tới', defines: 'định nghĩa route', navigates: 'điều hướng', 'calls-api': 'gọi API',
  exposes: 'cung cấp endpoint', extends: 'kế thừa', uses: 'dùng kiểu', injects: 'tiêm phụ thuộc',
  manages: 'quản lý entity', registers: 'đăng ký', 'implemented-by': 'được hiện thực bởi', mounts: 'gắn router',
}

const STRUCTURAL = new Set(['imports', 'renders', 'uses-store', 'uses-hook', 'uses-context', 'provides-context', 'injects', 'extends', 'uses', 'implemented-by', 'calls', 'routes-to', 'styled-by', 'mounts', 'registers', 'manages'])

// ---------------------------------------------------------------------------
export function filterGraph(g, {
  edgeKinds = null, nodeKinds = null, langs = null, certainOnly = false,
  pathPrefix = '', hideTests = false, hideExternal = false, keepIsolated = false,
} = {}) {
  const out = new Graph({ type: 'directed', multi: true })
  g.forEachNode((id, a) => {
    if (nodeKinds && !nodeKinds.includes(a.kind)) return
    if (hideExternal && a.kind === 'external') return
    if (a.kind === 'file') {
      if (langs && !langs.includes(a.lang)) return
      if (pathPrefix && !a.path.startsWith(pathPrefix)) return
      if (hideTests && a.roles?.includes('test')) return
    }
    out.addNode(id, a)
  })
  g.forEachEdge((e, a, s, t) => {
    if (!out.hasNode(s) || !out.hasNode(t)) return
    if (edgeKinds && !edgeKinds.includes(a.kind)) return
    if (certainOnly && a.confidence !== 'certain') return
    out.addEdge(s, t, a)
  })
  if (!keepIsolated) {
    const isolated = out.filterNodes((id) => out.degree(id) === 0)
    isolated.forEach((id) => out.dropNode(id))
  }
  return out
}

// Gom file theo thư mục (depth = số cấp thư mục giữ lại)
export function aggregateByFolder(g, depth = 2) {
  const groupOf = (id, a) => {
    if (a.kind !== 'file') return id
    const parts = (a.folder ?? '').split('/').filter(Boolean)
    return 'dir:' + (parts.slice(0, depth).join('/') || '(gốc)')
  }
  const nodes = new Map()
  g.forEachNode((id, a) => {
    const gid = groupOf(id, a)
    if (a.kind !== 'file') { nodes.set(gid, { ...a }); return }
    const n = nodes.get(gid) ?? { kind: 'folder', label: gid.slice(4), fileCount: 0, langs: [], roles: [] }
    n.fileCount++
    if (!n.langs.includes(a.lang)) n.langs.push(a.lang)
    for (const r of a.roles ?? []) if (!n.roles.includes(r)) n.roles.push(r)
    nodes.set(gid, n)
  })
  const edges = new Map()
  g.forEachEdge((e, a, s, t) => {
    const gs = groupOf(s, g.getNodeAttributes(s))
    const gt = groupOf(t, g.getNodeAttributes(t))
    if (gs === gt) return
    const key = `${gs}|${gt}`
    const cur = edges.get(key) ?? { from: gs, to: gt, count: 0, kinds: [], confidence: 'inferred' }
    cur.count += a.count ?? 1
    if (!cur.kinds.includes(a.kind)) cur.kinds.push(a.kind)
    if (a.confidence === 'certain') cur.confidence = 'certain'
    edges.set(key, cur)
  })
  const out = new Graph({ type: 'directed' })
  for (const [id, a] of nodes) out.addNode(id, a)
  for (const e of edges.values()) out.addEdge(e.from, e.to, { kind: e.kinds[0], kinds: e.kinds, count: e.count, confidence: e.confidence })
  return out
}

// ---------------------------------------------------------------------------
export function componentTree(g, { maxDepth = 12, maxNodes = 5000 } = {}) {
  const kinds = new Set(['renders', 'routes-to'])
  const children = new Map()
  const hasParent = new Set()
  g.forEachEdge((e, a, s, t) => {
    if (!kinds.has(a.kind)) return
    if (!children.has(s)) children.set(s, new Set())
    children.get(s).add(t)
    hasParent.add(t)
  })
  let count = 0
  const build = (id, seen, depth) => {
    const a = g.getNodeAttributes(id)
    const node = { id, label: a.label, path: a.path ?? null, kind: a.kind, children: [] }
    if (seen.has(id)) return { ...node, cycle: true }
    if (depth >= maxDepth || ++count > maxNodes) return { ...node, truncated: true }
    const next = new Set(seen).add(id)
    node.children = [...(children.get(id) ?? [])].map((c) => build(c, next, depth + 1))
    return node
  }
  const roots = [...children.keys()].filter((id) => !hasParent.has(id))
  return roots.map((r) => build(r, new Set(), 0))
}

export function treeToText(tree) {
  const lines = []
  const visit = (node, prefix, isLast, isRoot) => {
    const mark = node.cycle ? ' ↻' : node.truncated ? ' …' : ''
    lines.push(isRoot ? `${node.label}${mark}` : `${prefix}${isLast ? '└─ ' : '├─ '}${node.label}${mark}`)
    const childPrefix = isRoot ? '' : prefix + (isLast ? '   ' : '│  ')
    node.children.forEach((c, i) => visit(c, childPrefix, i === node.children.length - 1, false))
  }
  tree.forEach((root) => { visit(root, '', true, true); lines.push('') })
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
export function apiBridge(g) {
  const rows = []
  g.forEachNode((id, a) => {
    if (a.kind !== 'endpoint') return
    const callers = new Set()
    const handlers = new Set()
    g.forEachInEdge(id, (e, ea, s) => {
      const sa = g.getNodeAttributes(s)
      if (ea.kind === 'calls-api') callers.add(sa.path ?? sa.label)
      if (ea.kind === 'exposes') handlers.add(sa.path ?? sa.label)
    })
    rows.push({
      id, method: a.method, url: a.urlPattern, label: a.label, handler: a.handler ?? null,
      external: !!a.external, callers: [...callers], handlerFiles: [...handlers],
    })
  })
  return rows.sort((x, y) => x.url.localeCompare(y.url) || x.method.localeCompare(y.method))
}

// Tarjan dạng lặp (không đệ quy -> không tràn stack với dự án lớn)
export function findCycles(g, kinds = ['imports']) {
  const adj = new Map()
  g.forEachNode((id) => adj.set(id, []))
  g.forEachEdge((e, a, s, t) => { if (kinds.includes(a.kind)) adj.get(s).push(t) })
  let counter = 0
  const index = new Map()
  const low = new Map()
  const onStack = new Set()
  const stack = []
  const sccs = []
  for (const start of adj.keys()) {
    if (index.has(start)) continue
    index.set(start, counter); low.set(start, counter); counter++
    stack.push(start); onStack.add(start)
    const work = [[start, 0]]
    while (work.length) {
      const frame = work[work.length - 1]
      const v = frame[0]
      const nbrs = adj.get(v)
      if (frame[1] < nbrs.length) {
        const w = nbrs[frame[1]++]
        if (!index.has(w)) {
          index.set(w, counter); low.set(w, counter); counter++
          stack.push(w); onStack.add(w)
          work.push([w, 0])
        } else if (onStack.has(w)) low.set(v, Math.min(low.get(v), index.get(w)))
      } else {
        work.pop()
        if (work.length) {
          const p = work[work.length - 1][0]
          low.set(p, Math.min(low.get(p), low.get(v)))
        }
        if (low.get(v) === index.get(v)) {
          const comp = []
          let w
          do { w = stack.pop(); onStack.delete(w); comp.push(w) } while (w !== v)
          if (comp.length > 1) sccs.push(comp)
        }
      }
    }
  }
  return sccs
}

// ---------------------------------------------------------------------------
export function textReport(g, { unresolved = [], config = {}, maxItems = 15 } = {}) {
  const L = []
  const files = []
  const byLang = {}
  const byEdge = {}
  g.forEachNode((id, a) => {
    if (a.kind !== 'file') return
    files.push([id, a])
    byLang[a.lang] = (byLang[a.lang] ?? 0) + 1
  })
  g.forEachEdge((e, a) => { byEdge[a.kind] = (byEdge[a.kind] ?? 0) + 1 })
  const fmt = (obj) => Object.entries(obj).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${EDGE_KIND_LABELS[k] ?? k}: ${v}`).join(', ')
  const list = (items, render) => {
    if (!items.length) { L.push('_Không có._', ''); return }
    items.slice(0, maxItems).forEach((x) => L.push(`- ${render(x)}`))
    if (items.length > maxItems) L.push(`- … và ${items.length - maxItems} mục khác`)
    L.push('')
  }
  const degree = (id, dir) => {
    let n = 0
    const each = dir === 'in' ? g.forEachInEdge.bind(g) : g.forEachOutEdge.bind(g)
    each(id, (e, a) => { if (STRUCTURAL.has(a.kind)) n++ })
    return n
  }

  L.push('# Báo cáo cấu trúc dự án', '')
  L.push(`- **Số file đã phân tích:** ${files.length}`)
  L.push(`- **Ngôn ngữ:** ${fmt(byLang) || '—'}`)
  const frameworks = Array.isArray(config.frameworks) ? config.frameworks : [...(config.frameworks ?? [])]
  if (frameworks.length) L.push(`- **Framework / thư viện nhận diện được:** ${frameworks.join(', ')}`)
  L.push(`- **Quan hệ:** ${fmt(byEdge) || '—'}`, '')

  L.push('## Điểm khởi đầu', '')
  list(files.filter(([, a]) => a.roles?.includes('entry')), ([, a]) => `\`${a.path}\``)

  L.push('## File trung tâm (được tham chiếu nhiều nhất)', '')
  const hubs = files.map(([id, a]) => [a, degree(id, 'in')]).filter(([, d]) => d > 0).sort((x, y) => y[1] - x[1])
  list(hubs, ([a, d]) => `\`${a.path}\` — ${d} nơi dùng`)

  L.push('## File phụ thuộc nhiều nhất', '')
  const heavy = files.map(([id, a]) => [a, degree(id, 'out')]).filter(([, d]) => d > 0).sort((x, y) => y[1] - x[1])
  list(heavy, ([a, d]) => `\`${a.path}\` — phụ thuộc ${d} thứ`)

  L.push('## Vòng phụ thuộc (import vòng tròn)', '')
  list(findCycles(g, ['imports']), (comp) => comp.map((id) => `\`${g.getNodeAttribute(id, 'path') ?? id}\``).join(' → '))

  const bridge = apiBridge(g)
  if (bridge.length) {
    L.push('## Cầu nối front-end ↔ back-end', '')
    const matched = bridge.filter((r) => !r.external && r.callers.length)
    L.push(`- Endpoint có front-end gọi tới: **${matched.length}**`, '')
    L.push('### Endpoint không có lời gọi nào từ front-end trong dự án', '')
    list(bridge.filter((r) => !r.external && !r.callers.length), (r) => `\`${r.method} ${r.url}\` (${r.handler ?? r.handlerFiles.join(', ')})`)
    L.push('### Lời gọi API không tìm thấy back-end tương ứng', '')
    list(bridge.filter((r) => r.external), (r) => `\`${r.label}\` — gọi từ ${r.callers.map((c) => `\`${c}\``).join(', ')}`)
  }

  L.push('## File không được ai tham chiếu', '')
  L.push('_Có thể là mã chết, hoặc được framework gọi ngầm (kiểm tra thủ công)._', '')
  const SKIP_ROLES = ['entry', 'test', 'controller', 'configuration', 'api', 'router', 'entity']
  const orphans = files.filter(([id, a]) =>
    degree(id, 'in') === 0 &&
    !g.inEdges(id).some((e) => ['routes-to', 'mounts', 'registers'].includes(g.getEdgeAttribute(e, 'kind'))) &&
    !(a.roles ?? []).some((r) => SKIP_ROLES.includes(r)) &&
    !/(^|\/)[^/]*\.config\.[^/]+$|(^|\/)(setup|conftest|__init__|manage)\.py$/.test(a.path) &&
    a.lang !== 'html')
  list(orphans, ([, a]) => `\`${a.path}\``)

  const cssFiles = files.filter(([, a]) => a.unusedCss?.length)
  if (cssFiles.length) {
    L.push('## CSS có thể không còn dùng', '')
    list(cssFiles, ([, a]) => `\`${a.path}\`: ${a.unusedCss.slice(0, 8).map((c) => '.' + c).join(', ')}${a.unusedCss.length > 8 ? ` (+${a.unusedCss.length - 8})` : ''}`)
  }

  if (unresolved.length) {
    L.push('## Tham chiếu chưa giải quyết được', '')
    const groups = {}
    for (const u of unresolved) {
      const k = `${u.kind} / ${u.reason}`
      groups[k] = (groups[k] ?? 0) + 1
    }
    list(Object.entries(groups).sort((x, y) => y[1] - x[1]), ([k, v]) => `${k}: ${v}`)
  }

  const errs = files.filter(([, a]) => a.errors?.length)
  if (errs.length) {
    L.push('## Lỗi khi phân tích', '')
    list(errs, ([, a]) => `\`${a.path}\`: ${a.errors[0]}`)
  }
  return L.join('\n')
}

// ---------------------------------------------------------------------------
export function toMermaid(g, { maxNodes = 60, direction = 'LR' } = {}) {
  let ids = g.nodes()
  if (ids.length > maxNodes) ids = ids.sort((a, b) => g.degree(b) - g.degree(a)).slice(0, maxNodes)
  const keep = new Set(ids)
  const alias = new Map(ids.map((id, i) => [id, `n${i}`]))
  const esc = (s) => String(s ?? '').replace(/"/g, "'").replace(/[[\]{}<>]/g, ' ')
  const shape = (a, label) =>
    a.kind === 'endpoint' ? `{{"${label}"}}` : a.kind === 'route' ? `(["${label}"])` : a.kind === 'external' ? `[/"${label}"/]` : `["${label}"]`
  const lines = [`flowchart ${direction}`]
  for (const id of ids) {
    const a = g.getNodeAttributes(id)
    lines.push(`  ${alias.get(id)}${shape(a, esc(a.label))}`)
  }
  const pairs = new Map()
  g.forEachEdge((e, a, s, t) => {
    if (!keep.has(s) || !keep.has(t)) return
    const key = `${s}|${t}`
    const cur = pairs.get(key) ?? { s, t, kinds: new Set(), certain: false }
    cur.kinds.add(a.kind)
    if (a.confidence === 'certain') cur.certain = true
    pairs.set(key, cur)
  })
  for (const p of pairs.values()) {
    const label = esc([...p.kinds].map((k) => EDGE_KIND_LABELS[k] ?? k).join(', '))
    lines.push(`  ${alias.get(p.s)} ${p.certain ? '-->' : '-.->'}|${label}| ${alias.get(p.t)}`)
  }
  return lines.join('\n')
}
