// analyzer.worker.js — Web Worker: phân tích dự án, chia theo project và tính bố cục.
// Giao diện không bao giờ bị đứng; toàn bộ mô hình chỉ nằm trong Worker, giao diện chỉ nhận phần đang xem.
//
// Giao tiếp (mọi message đều mang `job`; job mới hơn sẽ huỷ việc của job cũ):
//   → { type: 'load', job, entries, options: { includeVendor, rootName, stripRootFolder } }
//        ← progress { text } … ← loaded { projects, stats, skipped, report, frameworks }
//        ← (rồi tự hiện tổng quan, như 'show')
//   → { type: 'show', job, view, relayout } view = ViewType.oviw hoặc id project
//        ← graph { view, nodes, edges, positions } ← positions … ← layout-done
//   → { type: 'stop', job, view }                dừng sắp xếp, giữ bố cục hiện tại của màn hình
//   → { type: 'search', searchId, query, exts, symbols, content }   (KHÔNG mang job: không được huỷ bố cục đang chạy)
//        ← search-symbols { searchId, hits, total } ← search-content { searchId, hits, scanned, total, done, truncated }
//   → { type: 'search-cancel', searchId }
//   → { type: 'related', requestId, path }   ← related { requestId, path, found, symbols, uses, usedBy, externals }
//   ← error { message }

import { analyzeProject } from './pipeline.js'
import { toPlainConfig } from './02-project-config.js'
import { textReport } from './07-views.js'
import { buildViewModel } from './08-view-model.js'
import { initialPositions, runLayout } from './layout.js'
import { searchContent } from '../core/search.js'
import { extname } from '../core/path.js'
import { MAX_ANALYZE_SIZE } from '../core/ignore-rules.js'
import { ViewType } from '../utils/viewType.js'

let currentJob = 0
let model = null
let sourceEntries = new Map() // path -> { handle | file } — để quét nội dung khi tìm kiếm (giữ tham chiếu, không giữ nội dung)
let searchPaths = [] // các file đã nhận (cùng danh sách giao diện hiển thị)
let activeSearch = 0 // searchId đang chạy; 0 = không có
const viewCache = new Map() // view → { nodes, edges, positions, final, latest }

const post = (msg, transfer) => self.postMessage(msg, transfer ?? [])
const isStale = (job) => job !== currentJob
const fmt = (n) => Number(n ?? 0).toLocaleString('vi-VN')

const STAGE_TEXT = {
  collect: 'Đang đọc file',
  pass1: 'Đang phân tích mã nguồn',
  pass2: 'Đang nối liên kết',
}

function progressReporter(job) {
  let last = 0
  return (p) => {
    const now = Date.now()
    const final = p.done != null && p.done === p.total
    if (now - last < 120 && !final) return
    last = now
    let text
    if (p.stage === 'config') text = `Đang đọc cấu hình dự án (${fmt(p.files)} file)…`
    else if (p.stage === 'done') text = 'Đang dựng sơ đồ…'
    else text = `${STAGE_TEXT[p.stage] ?? p.stage} ${fmt(p.done)}/${fmt(p.total)}…`
    post({ type: 'progress', job, text })
  }
}

/** Gom lý do bỏ qua thành số liệu hiển thị (thư mục/nhị phân/.gitignore không tính: đó là bỏ qua bình thường). */
function summarizeSkipped(skipped) {
  const s = { vendor: 0, generated: 0, big: 0, error: 0 }
  for (const x of skipped) {
    if (x.reason === 'vendor') s.vendor++
    else if (x.reason === 'generated') s.generated++
    else if (x.reason === 'too-large') s.big++
    else if (x.reason === 'error') s.error++
  }
  return s
}

/* --------------------------------- Phân tích --------------------------------- */

async function load(job, { entries, options = {} }) {
  model = null
  viewCache.clear()
  activeSearch = 0
  sourceEntries = new Map(entries.map((e) => [e.path, e]))
  searchPaths = []
  const result = await analyzeProject(entries, {
    includeVendor: !!options.includeVendor,
    aliases: options.aliases ?? [],
    collectOptions: { rootName: options.rootName, stripRootFolder: options.stripRootFolder },
    onProgress: progressReporter(job),
    isCancelled: () => isStale(job),
  })
  if (!result || isStale(job)) return

  const config = toPlainConfig(result.config)
  model = buildViewModel(result.graph, { paths: result.paths, rootName: config.rootName, includeExternal: !!options.includeVendor })
  // Chỉ mục file cho giao diện (Explorer, tìm theo tên, chuyển sang đúng project): path + project của từng path
  const projectIds = [...model.projects.keys()]
  const projectIndex = new Map(projectIds.map((id, i) => [id, i]))
  const pidx = new Int32Array(result.paths.length)
  result.paths.forEach((p, i) => { pidx[i] = projectIndex.get(model.projectOf(p)) ?? -1 })
  searchPaths = result.paths
  post({
    type: 'loaded',
    job,
    files: { paths: result.paths, projectIds, pidx },
    projects: [...model.projects.values()],
    stats: model.stats,
    skipped: summarizeSkipped(result.skipped),
    frameworks: config.frameworks,
    report: textReport(result.graph, { unresolved: result.unresolved, config, maxItems: 6 }),
  }, [pidx.buffer])
  if (!model.projects.size) return
  // chỉ có 1 project → mở thẳng vào chi tiết
  await show(job, model.projects.size === 1 ? [...model.projects.keys()][0] : ViewType.oviw)
}

/* --------------------------------- Hiển thị --------------------------------- */

async function show(job, view, relayout = false) {
  let v = viewCache.get(view)
  if (!v) {
    const data = view === ViewType.oviw ? model.overview : model.region(view)
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

/* --------------------------------- Tìm kiếm --------------------------------- */

async function readForSearch(path) {
  const e = sourceEntries.get(path)
  if (!e) return null
  const file = e.file ?? (await e.handle.getFile())
  if (file.size > MAX_ANALYZE_SIZE) return null
  const text = await file.text()
  return text.slice(0, 8000).includes('\u0000') ? null : text // nhị phân đuôi lạ
}

/** Symbol (từ mô hình trong bộ nhớ) rồi nội dung (đọc file theo lô). Search mới huỷ search cũ. */
async function runSearch({ searchId, query, exts, symbols = true, content = true }) {
  activeSearch = searchId
  const cancelled = () => activeSearch !== searchId
  const q = String(query ?? '').trim()
  const extSet = exts?.length ? new Set(exts) : null
  const finish = (extra = {}) => post({ type: 'search-content', searchId, hits: [], scanned: 0, total: 0, done: true, truncated: false, ...extra })
  try {
    if (!model || !q) return finish()
    if (symbols) {
      const { hits, total } = model.searchSymbols(q, { limit: 200, exts: extSet })
      post({ type: 'search-symbols', searchId, hits, total })
    }
    if (!content) return finish()
    const paths = extSet ? searchPaths.filter((p) => extSet.has(extname(p))) : searchPaths
    await searchContent({
      paths, query: q, read: readForSearch, isCancelled: cancelled,
      onBatch: (b) => { if (!cancelled()) post({ type: 'search-content', searchId, ...b }) },
    })
  } catch (err) {
    console.error(err)
    post({ type: 'search-error', searchId, message: err?.message ?? String(err) })
  }
}

const NO_RELATED = { found: false, symbols: [], uses: [], usedBy: [], externals: [] }

self.onmessage = async ({ data: msg }) => {
  // Truy vấn quan hệ của một file: trả lời ngay từ mô hình trong bộ nhớ, cũng không đụng tới currentJob
  if (msg.type === 'related') {
    post({ type: 'related', requestId: msg.requestId, ...(model ? model.related(msg.path) : { path: msg.path, ...NO_RELATED }) })
    return
  }
  // Tìm kiếm có vòng đời riêng: TUYỆT ĐỐI không gán currentJob (job mới sẽ huỷ bố cục đang chạy)
  if (msg.type === 'search') return runSearch(msg)
  if (msg.type === 'search-cancel') {
    if (activeSearch === msg.searchId) activeSearch = 0
    return
  }
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
    post({ type: 'error', job: msg.job, message: err?.message ?? String(err) })
  }
}
