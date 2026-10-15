// Web Worker: đọc + làm sạch file, phân tích, tách theo project và tính bố cục — giao diện không bao giờ bị đứng.
//
// Giao tiếp (mọi message đều mang `job`; job mới hơn sẽ huỷ việc của job cũ):
//   → { type: 'load', job, items, markers, includeVendor }
//        ← progress… ← loaded { projects, root, stats, skipped } ← (rồi tự hiện tổng quan như 'show')
//   → { type: 'show', job, view, relayout }      view = OVERVIEW hoặc id project
//        ← graph { view, nodes, edges, positions } ← positions… ← layout-done
//   → { type: 'stop', job, view }                dừng sắp xếp, giữ bố cục hiện tại của màn hình
//
// Toàn bộ mô hình (mọi node/cạnh của solution) chỉ nằm trong Worker; giao diện chỉ nhận phần đang xem.
import { readSources, createProjectResolver, projectLabel } from './utils/sourceFiles'
import { parseProjectCode } from './utils/codeParser'
import { initialPositions, runLayout } from './utils/layout'

const OVERVIEW = '__overview__'
let currentJob = 0
let model = null // { root, projects: Map, nodesByProject: Map, edgesByProject: Map, nodeById: Map, overview }
const viewCache = new Map() // view → { nodes, edges, positions, final }

const post = (msg, transfer) => self.postMessage(msg, transfer || [])
const isStale = (job) => job !== currentJob

function throttled(job, prefix) {
  let last = 0
  return (done, total) => {
    const now = Date.now()
    if (now - last > 120 || done === total) {
      last = now
      post({ type: 'progress', job, text: `${prefix} ${done.toLocaleString('vi-VN')}/${total.toLocaleString('vi-VN')}…` })
    }
  }
}

/* -------------------------------- Mô hình -------------------------------- */

function buildModel(nodes, edges, files, root, rootIsProject) {
  const nodeById = new Map(nodes.map((n) => [n.id, n]))
  const projects = new Map()
  const ensure = (id) => {
    let p = projects.get(id)
    if (!p) projects.set(id, (p = { id, label: projectLabel(id, root, rootIsProject), nodes: 0, files: 0, edgesIn: 0, edgesOut: 0 }))
    return p
  }
  for (const f of files) ensure(f.project).files++

  const nodesByProject = new Map()
  for (const n of nodes) {
    ensure(n.project).nodes++
    if (!nodesByProject.has(n.project)) nodesByProject.set(n.project, [])
    nodesByProject.get(n.project).push(n)
  }

  // Cạnh của mỗi project (cạnh liên project được ghi cho cả 2 bên) + gộp cạnh cho màn hình tổng quan
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
    if (ps !== pt) {
      addTo(pt, e)
      projects.get(ps).edgesOut++
      projects.get(pt).edgesIn++
      const key = `${ps}\n${pt}`
      cross.set(key, (cross.get(key) || 0) + 1)
    }
  }

  const overview = {
    nodes: [...projects.values()]
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((p) => ({ id: p.id, label: p.label, type: 'project', project: p.id, count: p.nodes, files: p.files })),
    edges: [...cross].map(([key, weight]) => {
      const [source, target] = key.split('\n')
      return { source, target, kind: 'call', weight }
    }),
  }
  return { root, projects, nodesByProject, edgesByProject, nodeById, overview }
}

/** Vùng của một project: node của nó + node ở project khác có liên kết trực tiếp (đánh dấu ghost). */
function buildRegion(projectId) {
  const own = model.nodesByProject.get(projectId) || []
  const edges = model.edgesByProject.get(projectId) || []
  const nodes = [...own]
  const seen = new Set(own.map((n) => n.id))
  for (const e of edges) {
    for (const id of [e.source, e.target]) {
      if (seen.has(id)) continue
      seen.add(id)
      nodes.push({ ...model.nodeById.get(id), ghost: true })
    }
  }
  return { nodes, edges }
}

/* --------------------------------- Hiển thị --------------------------------- */

async function show(job, view, relayout = false) {
  let v = viewCache.get(view)
  if (!v) {
    const data = view === OVERVIEW ? model.overview : buildRegion(view)
    v = { ...data, positions: null, final: false }
    viewCache.set(view, v)
  }
  if (relayout || !v.positions) {
    v.positions = initialPositions(v.nodes.length, relayout)
    v.final = false
  }
  post({ type: 'graph', job, view, nodes: v.nodes, edges: v.edges, positions: v.positions.slice() })
  if (v.final) return post({ type: 'layout-done', job })

  const ids = v.nodes.map((n) => n.id)
  v.latest = v.positions
  const final = await runLayout(ids, v.edges, v.positions, (pos, done, total) => {
    v.latest = pos.slice() // vị trí mới nhất (giữ lại nếu người dùng bấm "Dừng sắp xếp")
    post({ type: 'positions', job, positions: pos, done, total }, [pos.buffer])
  }, () => isStale(job))
  if (!final) return // bị huỷ (chuyển màn hình / dừng) — xem 'stop' bên dưới
  v.positions = final
  v.final = true
  post({ type: 'layout-done', job })
}

async function load(job, { items, markers, includeVendor }) {
  model = null
  viewCache.clear()
  const { files, skipped } = await readSources(items, { includeVendor }, throttled(job, 'Đang đọc và làm sạch file'))
  if (isStale(job)) return
  if (!files.length) {
    post({ type: 'loaded', job, projects: [], stats: { files: 0, nodes: 0, edges: 0 }, skipped })
    return
  }
  post({ type: 'progress', job, text: `Đang phân tích ${files.length.toLocaleString('vi-VN')} file…` })
  const projectOf = createProjectResolver(items, markers)
  const root = items[0].path.split('/')[0] + '/'
  const parseProgress = throttled(job, 'Đang phân tích mã nguồn')
  const { nodes, edges, stats } = parseProjectCode(files, { projectOf }, (d, t) => parseProgress(d, t))
  model = buildModel(nodes, edges, files, root, markers.includes(root)) // files đã được gán `project` khi phân tích
  files.length = 0 // giải phóng nội dung file, không cần nữa
  post({
    type: 'loaded',
    job,
    root,
    projects: [...model.projects.values()].sort((a, b) => a.label.localeCompare(b.label)),
    stats: { ...stats, projects: model.projects.size },
    skipped,
  })
  // chỉ có 1 project (vd. import riêng thư mục MarketingStrategy.BLL) → mở thẳng vào chi tiết
  await show(job, model.projects.size === 1 ? [...model.projects.keys()][0] : OVERVIEW)
}

self.onmessage = async ({ data: msg }) => {
  currentJob = msg.job
  try {
    if (msg.type === 'load') await load(msg.job, msg)
    else if (msg.type === 'show' && model) await show(msg.job, msg.view, msg.relayout)
    else if (msg.type === 'stop') {
      // job mới đã làm vòng lặp bố cục đang chạy tự dừng; giữ bố cục lúc dừng cho lần mở sau
      const v = viewCache.get(msg.view)
      if (v?.latest) Object.assign(v, { positions: v.latest, final: true })
    }
  } catch (err) {
    console.error(err)
    post({ type: 'error', job: msg.job, message: err?.message || String(err) })
  }
}
