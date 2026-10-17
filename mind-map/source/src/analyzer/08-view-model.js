// 08-view-model.js — Chia đồ thị theo project cho giao diện "Tổng quan → chi tiết project".
//
// ĐẦU VÀO: graph (06), paths (mọi file đã nhận, để tìm thư mục project), rootName
// ĐẦU RA: model = {
//   projects: Map<id, { id, label, files, nodes, edgesIn, edgesOut }>
//   overview: { nodes, edges }                  mỗi node là một project
//   region(projectId) -> { nodes, edges }       node của project + node project khác có liên kết (ghost)
// }
// Node gửi cho giao diện: { id, label, type, project, file, lang, symbols }
//   type: 'component' | 'module' | 'backend' | 'html' | 'css' | 'endpoint' | 'route' | 'external'
// Cạnh: { source, target, kind, kinds, weight, inferred }
//   kind (nhóm để tô màu): 'api' | 'event' | 'inherit' | 'inject' | 'route' | 'style' | 'use'

export const OVERVIEW = '__overview__'
export const EXTERNAL_PROJECT = '__external__'
export const ROOT_PROJECT = '/' // không dùng chuỗi rỗng: giao diện coi '' là "chưa chọn"

// File đánh dấu thư mục gốc của một project
const PROJECT_MARKER = /\.(csproj|vbproj|fsproj|sqlproj)$|^(package\.json|pom\.xml|build\.gradle(\.kts)?|pyproject\.toml|setup\.py|go\.mod|cargo\.toml|composer\.json)$/i
const BACKEND_LANGS = new Set(['java', 'kotlin', 'csharp', 'python'])

// Nhóm cạnh để tô màu; thứ tự = độ ưu tiên khi nhiều loại cạnh trùng một cặp node
const EDGE_GROUPS = [
  ['api', ['calls-api', 'exposes']],
  ['event', ['emits', 'provides', 'provides-context', 'dom', 'calls']],
  ['inherit', ['extends', 'implemented-by', 'manages']],
  ['inject', ['injects', 'registers', 'mounts']],
  ['route', ['routes-to', 'defines', 'navigates']],
  ['style', ['styled-by']],
]
const GROUP_OF = new Map(EDGE_GROUPS.flatMap(([g, kinds]) => kinds.map((k) => [k, g])))
const GROUP_RANK = new Map([...EDGE_GROUPS.map(([g], i) => [g, i]), ['use', EDGE_GROUPS.length]])
const groupOf = (kind) => GROUP_OF.get(kind) ?? 'use'

/**
 * Project = thư mục chứa file đánh dấu (.csproj, package.json…) NGOÀI CÙNG.
 * (Lấy ngoài cùng để package.json nằm trong Scripts/ không tách project web làm đôi.)
 * File không thuộc thư mục nào như vậy -> project = thư mục cấp 1; file ở thư mục gốc -> ROOT_PROJECT.
 * Khi thư mục gốc cũng là một project -> mọi file như vậy thuộc project gốc.
 */
export function createProjectResolver(paths) {
  const markers = new Set()
  for (const p of paths) {
    const i = p.lastIndexOf('/')
    if (PROJECT_MARKER.test(p.slice(i + 1))) markers.add(i < 0 ? ROOT_PROJECT : p.slice(0, i + 1))
  }
  const rootIsProject = markers.has(ROOT_PROJECT)
  const roots = [...markers].filter((m) => m !== ROOT_PROJECT).sort((a, b) => a.length - b.length)
  const projectOf = (path) => {
    for (const r of roots) if (path.startsWith(r)) return r
    const parts = path.split('/')
    return !rootIsProject && parts.length > 1 ? `${parts[0]}/` : ROOT_PROJECT
  }
  return { projectOf, rootIsProject }
}

export function buildViewModel(graph, { paths, rootName = '', includeExternal = false }) {
  const { projectOf, rootIsProject } = createProjectResolver(paths)
  const labelOf = (id) =>
    id === EXTERNAL_PROJECT ? 'Thư viện ngoài'
    : id === ROOT_PROJECT ? (rootIsProject && rootName ? rootName : '(thư mục gốc)')
    : id.split('/').filter(Boolean).pop()

  // --- Node ---
  const nodeById = new Map()
  graph.forEachNode((id, a) => {
    if (a.kind === 'file') {
      nodeById.set(id, {
        id,
        label: a.label,
        type: uiType(a),
        project: projectOf(a.path),
        file: a.path,
        lang: a.lang,
        symbols: (a.symbols ?? []).filter((s) => s.kind !== 'variable').slice(0, 12).map((s) => `${s.name} (${s.kind})`),
      })
    } else if (a.kind === 'external') {
      if (includeExternal) nodeById.set(id, { id, label: a.label, type: 'external', project: EXTERNAL_PROJECT, file: 'Thư viện / gói bên ngoài' })
    } else {
      nodeById.set(id, { id, label: a.label, type: a.kind, project: null, file: a.handler ?? (a.kind === 'route' ? 'Route' : '') })
    }
  })
  // Endpoint / route thuộc project của file định nghĩa nó; nếu không có thì project của nơi dùng đầu tiên
  for (const n of nodeById.values()) {
    if (n.project !== null) continue
    let owner = null
    graph.forEachInEdge(n.id, (e, ea, s) => {
      if (owner == null && (ea.kind === 'exposes' || ea.kind === 'defines')) owner = nodeById.get(s)?.project ?? null
    })
    if (owner == null) graph.forEachInEdge(n.id, (e, ea, s) => { if (owner == null) owner = nodeById.get(s)?.project ?? null })
    n.project = owner ?? ROOT_PROJECT
  }

  // --- Cạnh: gộp mọi loại cạnh giữa cùng một cặp node ---
  const merged = new Map()
  graph.forEachEdge((e, a, s, t) => {
    if (!nodeById.has(s) || !nodeById.has(t)) return
    const key = `${s}\n${t}`
    const cur = merged.get(key) ?? { source: s, target: t, kinds: [], weight: 0, inferred: true }
    if (!cur.kinds.includes(a.kind)) cur.kinds.push(a.kind)
    cur.weight += a.count ?? 1
    if (a.confidence === 'certain') cur.inferred = false
    merged.set(key, cur)
  })
  const edges = [...merged.values()].map((e) => {
    const groups = e.kinds.map(groupOf).sort((x, y) => GROUP_RANK.get(x) - GROUP_RANK.get(y))
    return { ...e, kind: groups[0] }
  })

  // --- Project ---
  const projects = new Map()
  const ensure = (id) => {
    let p = projects.get(id)
    if (!p) projects.set(id, (p = { id, label: labelOf(id), files: 0, nodes: 0, edgesIn: 0, edgesOut: 0 }))
    return p
  }
  const nodesByProject = new Map()
  for (const n of nodeById.values()) {
    const p = ensure(n.project)
    p.nodes++
    if (n.file && n.type !== 'endpoint' && n.type !== 'route' && n.type !== 'external') p.files++
    if (!nodesByProject.has(n.project)) nodesByProject.set(n.project, [])
    nodesByProject.get(n.project).push(n)
  }

  const edgesByProject = new Map()
  const addTo = (p, e) => {
    if (!edgesByProject.has(p)) edgesByProject.set(p, [])
    edgesByProject.get(p).push(e)
  }
  const cross = new Map()
  for (const e of edges) {
    const ps = nodeById.get(e.source).project
    const pt = nodeById.get(e.target).project
    addTo(ps, e)
    if (ps === pt) continue
    addTo(pt, e) // cạnh liên project được ghi cho cả 2 bên
    projects.get(ps).edgesOut += e.weight
    projects.get(pt).edgesIn += e.weight
    const key = `${ps}\n${pt}`
    cross.set(key, (cross.get(key) ?? 0) + e.weight)
  }

  const sortedProjects = [...projects.values()].sort((a, b) => a.label.localeCompare(b.label))
  const overview = {
    nodes: sortedProjects.map((p) => ({ id: p.id, label: p.label, type: 'project', project: p.id, count: p.nodes, files: p.files })),
    edges: [...cross].map(([key, weight]) => {
      const [source, target] = key.split('\n')
      return { source, target, kind: 'use', kinds: [], weight, inferred: false }
    }),
  }

  /** Vùng của một project: node của nó + node ở project khác có liên kết trực tiếp (đánh dấu ghost). */
  function region(projectId) {
    const own = nodesByProject.get(projectId) ?? []
    const regionEdges = edgesByProject.get(projectId) ?? []
    const nodes = [...own]
    const seen = new Set(own.map((n) => n.id))
    for (const e of regionEdges) {
      for (const id of [e.source, e.target]) {
        if (seen.has(id)) continue
        seen.add(id)
        nodes.push({ ...nodeById.get(id), ghost: true })
      }
    }
    return { nodes, edges: regionEdges }
  }

  return {
    projects: new Map(sortedProjects.map((p) => [p.id, p])),
    overview,
    region,
    stats: { files: graph.filterNodes((id, a) => a.kind === 'file').length, nodes: nodeById.size, edges: edges.length, projects: projects.size },
  }
}

function uiType(a) {
  if (a.lang === 'html') return 'html'
  if (a.lang === 'css') return 'css'
  if (a.roles?.includes('component')) return 'component'
  if (BACKEND_LANGS.has(a.lang)) return 'backend'
  return 'module'
}
