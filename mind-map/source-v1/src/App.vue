<template>
  <div class="app-container">
    <!-- Thanh điều khiển -->
    <header class="control-panel">
      <h2>Mind</h2>
      <button class="btn-primary" :disabled="busy" @click="handleSelectFolder">📁 Chọn thư mục dự án</button>
      <input ref="folderInput" type="file" webkitdirectory multiple hidden @change="onFolderInput" />
      <label class="check" title="Thư viện JS/CSS (jQuery, Bootstrap…), proxy WCF trong Service References, *.Designer.cs… mặc định bị bỏ qua vì làm sơ đồ phình to mà ít giá trị">
        <input v-model="includeVendor" type="checkbox" :disabled="busy" @change="reload" /> Gồm thư viện &amp; mã sinh tự động
      </label>

      <template v-if="hasData">
        <!-- Điều hướng: Tổng quan › project -->
        <nav class="crumbs">
          <button class="btn-secondary" :class="{ active: view === OVERVIEW }" @click="openView(OVERVIEW)">🗂 Tổng quan</button>
          <span>›</span>
          <select :value="view === OVERVIEW ? '' : view" @change="openView($event.target.value)">
            <option value="" disabled>Chọn project…</option>
            <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.label }} ({{ fmt(p.nodes) }})</option>
          </select>
        </nav>
        <button v-if="layingOut" class="btn-secondary" @click="stopLayout">⏸ Dừng sắp xếp</button>
        <button v-else class="btn-secondary" @click="reLayout">🔄 Sắp xếp lại</button>
        <button class="btn-secondary" @click="renderer?.getCamera().animatedReset()">⤢ Vừa khung</button>
        <button class="btn-secondary" :class="{ active: visibility !== 'all' }" :disabled="!canFilter"
          :title="canFilter ? `Đang hiện: ${VISIBILITY[visibility].showing}. Bấm để chuyển sang bước tiếp theo.` : 'Chỉ có một loại node (toàn bộ độc lập hoặc toàn bộ có liên kết)'"
          @click="cycleVisibility">
          {{ VISIBILITY[visibility].button }}
        </button>
      </template>
      <div v-if="statusMessage" class="status-text" :class="{ error: isError }">{{ statusMessage }}</div>
      <div v-if="stats" class="stats" :title="skippedText">
        {{ fmt(stats.files) }} file · {{ fmt(stats.nodes) }} node · {{ fmt(stats.edges) }} liên kết · {{ stats.projects }} project
        <span v-if="skippedText" class="muted">· {{ skippedText }}</span>
      </div>
    </header>

    <!-- Khu vực vẽ (Sigma.js dùng WebGL) -->
    <main class="canvas-container">
      <div ref="graphContainer" class="graph-canvas"></div>

      <div v-if="!hasData && !busy" class="empty-state">
        <p v-if="!isError">Chọn thư mục dự án (có thể là cả solution lớn). Sơ đồ mở ở màn hình <b>Tổng quan</b>: mỗi node là một project.
          Bấm vào một project để xem chi tiết class / hàm bên trong.</p>
      </div>
      <div v-if="busy" class="busy"><div class="spinner"></div>{{ statusMessage }}</div>

      <!-- Chú thích -->
      <div v-if="hasData && view === OVERVIEW" class="legend">
        <span>Mỗi node là một project (to hơn = nhiều class/hàm hơn)</span>
        <span><i class="line"></i>số trên cạnh = số tham chiếu</span>
        <span><b>Bấm vào project để xem chi tiết</b></span>
      </div>
      <div v-else-if="hasData" class="legend">
        <label v-for="(color, kind) in KIND_COLORS" :key="kind" class="kind" :title="`Chọn hình dạng cho node ${KIND_LABELS[kind]}`">
          <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
            <circle v-if="shapes[kind] === 'circle'" cx="6" cy="6" r="5" :fill="color" />
            <rect v-else-if="shapes[kind] === 'square'" x="1.5" y="1.5" width="9" height="9" :fill="color" />
            <polygon v-else points="6,0.8 11.5,10.5 0.5,10.5" :fill="color" />
          </svg>
          {{ KIND_LABELS[kind] }}
          <select :value="shapes[kind]" @change="setShape(kind, $event.target.value)">
            <option v-for="(name, shape) in SHAPES" :key="shape" :value="shape">{{ name }}</option>
          </select>
        </label>
        <span><i class="line"></i>Gọi / dùng</span>
        <span><i class="line inherit"></i>Kế thừa</span>
        <span><i class="line cross"></i>Sang project khác</span>
        <span><i class="ghost"></i>Node của project khác (bấm đúp để mở)</span>
      </div>

      <!-- Bảng thông tin -->
      <div v-if="info" class="info">
        <b>{{ info.label }}</b>
        <span v-for="(line, i) in info.lines" :key="i">{{ line }}</span>
        <button v-if="info.open" class="btn-primary small" @click="openView(info.open.view, info.open.focus)">Mở {{ info.open.label }} →</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import Graph from 'graphology'
import Sigma from 'sigma'
import { SHAPES, nodeProgramClasses, drawNodeHover } from './utils/nodeShapes'
import { listDirectory, listFileList } from './utils/sourceFiles'

const OVERVIEW = '__overview__'
const KIND_COLORS = { class: '#38bdf8', function: '#eab308', file: '#94a3b8', html: '#fb923c', css: '#2dd4bf' }
const KIND_LABELS = { class: 'Class', function: 'Hàm', file: 'File', html: 'HTML', css: 'CSS' }
const EDGE_COLORS = { call: '#cbd5e1', inherit: '#7dd3fc', trigger: '#fdba74', style: '#99f6e4', cross: '#c4b5fd' }
const PROJECT_PALETTE = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#65a30d', '#ea580c', '#0d9488', '#9333ea', '#ca8a04']
const BIG = 5000 // từ ngưỡng này: cạnh không có mũi tên, ẩn cạnh khi kéo/zoom

const fmt = (n) => Number(n || 0).toLocaleString('vi-VN')

const graphContainer = ref(null)
const folderInput = ref(null)
const statusMessage = ref('')
const isError = ref(false)
const hasData = ref(false)
const busy = ref(false)
const layingOut = ref(false)
const stats = ref(null)
const skipped = ref(null)
const info = ref(null)
const projects = ref([])
const view = ref(OVERVIEW)
const includeVendor = ref(false)

const projectById = computed(() => new Map(projects.value.map((p, i) => [p.id, { ...p, color: PROJECT_PALETTE[i % PROJECT_PALETTE.length] }])))
const projectName = (id) => projectById.value.get(id)?.label || id
const skippedText = computed(() => {
  const s = skipped.value
  if (!s) return ''
  const parts = []
  if (s.vendor + s.generated) parts.push(`bỏ qua ${fmt(s.vendor + s.generated)} file thư viện / sinh tự động`)
  if (s.big) parts.push(`${fmt(s.big)} file > 1 MB`)
  if (s.error) parts.push(`${fmt(s.error)} file không đọc được`)
  return parts.join(', ')
})

let graph = null
let renderer = null
let worker = null
let job = 0 // mỗi yêu cầu gửi Worker có số job riêng; message của job cũ bị bỏ qua
let source = null // { items, markers } — danh sách file của thư mục đang mở (để tải lại khi đổi tuỳ chọn)
let nodeIds = []
let indexOf = new Map() // id node → vị trí trong mảng vị trí Worker gửi về
let focused = null
let pendingFocus = null // node cần chọn sau khi mở project (khi bấm đúp node của project khác)
let pendingPositions = null
let hovered = null // node đang rê chuột (để hiện nhãn của node project khác)
let isOverview = true // màn hình hiện tại là tổng quan?

/* ------------------------------ Hình dạng node ------------------------------ */

// Hình dạng theo loại node — người dùng chọn ở bảng chú thích, lưu lại cho lần sau
const SHAPE_KEY = 'code-mindmap.nodeShapes'
const DEFAULT_SHAPES = { class: 'square', function: 'circle', file: 'triangle', html: 'triangle', css: 'circle' }
function loadShapes() {
  try {
    const saved = JSON.parse(localStorage.getItem(SHAPE_KEY) || '{}')
    const valid = Object.fromEntries(Object.entries(saved).filter(([k, v]) => k in DEFAULT_SHAPES && v in SHAPES))
    return { ...DEFAULT_SHAPES, ...valid }
  } catch {
    return { ...DEFAULT_SHAPES }
  }
}
const shapes = ref(loadShapes())

function setShape(kind, shape) {
  shapes.value = { ...shapes.value, [kind]: shape }
  try { localStorage.setItem(SHAPE_KEY, JSON.stringify(shapes.value)) } catch { /* bỏ qua */ }
  graph?.updateEachNodeAttributes((_, attr) => {
    if (attr.kind === kind) attr.type = shape
    return attr
  })
}

/* --------------------------- Lọc node 3 trạng thái --------------------------- */

const isolatedCount = ref(0)
const totalCount = ref(0)
/** Bấm để xoay vòng: all → no-isolated → isolated-only → all. `button` = việc nút sẽ làm ở lần bấm tới. */
const visibility = ref('all')
const linkedCount = computed(() => totalCount.value - isolatedCount.value)
const VISIBILITY = {
  all: { next: 'no-isolated', showing: 'tất cả node', hide: () => false },
  'no-isolated': { next: 'isolated-only', showing: 'node có liên kết', hide: (a) => a.isolated },
  'isolated-only': { next: 'all', showing: 'node độc lập', hide: (a) => !a.isolated },
}
VISIBILITY.all.button = computed(() => `🙈 Ẩn node độc lập (${fmt(isolatedCount.value)})`)
VISIBILITY['no-isolated'].button = computed(() => `🙈 Ẩn node có liên kết (${fmt(linkedCount.value)})`)
VISIBILITY['isolated-only'].button = '👁 Hiện tất cả node'
const canFilter = computed(() => isolatedCount.value > 0 && linkedCount.value > 0)
const isHidden = (attr) => VISIBILITY[visibility.value].hide(attr)

function cycleVisibility() {
  visibility.value = VISIBILITY[visibility.value].next
  if (focused && isHidden(graph.getNodeAttributes(focused.id))) focus(null) // node đang chọn bị ẩn → bỏ chọn
  updateBBox()
  renderer.refresh({ skipIndexation: true })
  renderer.getCamera().animatedReset()
}

/** Khung nhìn chỉ tính các node đang hiện, để sau khi lọc phần còn lại được phóng to vừa màn hình. */
function updateBBox() {
  if (!renderer) return
  if (visibility.value === 'all') return renderer.setCustomBBox(null)
  const bbox = { x: [Infinity, -Infinity], y: [Infinity, -Infinity] }
  graph.forEachNode((_, a) => {
    if (isHidden(a)) return
    bbox.x[0] = Math.min(bbox.x[0], a.x); bbox.x[1] = Math.max(bbox.x[1], a.x)
    bbox.y[0] = Math.min(bbox.y[0], a.y); bbox.y[1] = Math.max(bbox.y[1], a.y)
  })
  renderer.setCustomBBox(Number.isFinite(bbox.x[0]) ? bbox : null)
}

/* ---------------------------------- Vẽ ---------------------------------- */

/** Trộn màu với trắng (t = 0 → giữ nguyên, 1 → trắng) — dùng cho node của project khác. */
function tint(hex, t) {
  const n = parseInt(hex.slice(1), 16)
  const mix = (c) => Math.round(c + (255 - c) * t)
  return `rgb(${mix(n >> 16)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`
}

function buildGraph({ view: v, nodes, edges, positions }) {
  graph = new Graph({ type: 'directed', multi: false, allowSelfLoops: false })
  const overview = v === OVERVIEW
  isOverview = overview
  const big = nodes.length >= BIG
  const maxCount = Math.max(1, ...nodes.map((n) => n.count || 0))

  nodes.forEach((n, i) => {
    const pos = { x: positions[i * 2], y: positions[i * 2 + 1] }
    if (overview) {
      const p = projectById.value.get(n.id)
      graph.addNode(n.id, {
        ...pos,
        label: `${n.label} (${fmt(n.count)})`,
        kind: 'project',
        project: n.id,
        color: p?.color || '#64748b',
        type: 'circle',
        size: 10 + 26 * Math.sqrt((n.count || 0) / maxCount),
      })
    } else {
      const fullLabel = n.ghost ? `${n.label} · ${projectName(n.project)}` : n.label
      graph.addNode(n.id, {
        ...pos,
        // node của project khác: không hiện nhãn thường trực (chỉ khi rê chuột / liên quan node đang chọn)
        label: n.ghost ? '' : fullLabel,
        fullLabel,
        file: n.file,
        kind: n.type,
        project: n.project,
        ghost: !!n.ghost,
        color: n.ghost ? tint(projectById.value.get(n.project)?.color || '#94a3b8', 0.72) : KIND_COLORS[n.type] || '#94a3b8',
        type: shapes.value[n.type] || 'circle', // `type` = chương trình vẽ của Sigma = hình dạng
      })
    }
  })
  for (const e of edges) {
    if (overview) {
      graph.mergeEdge(e.source, e.target, {
        kind: 'cross',
        label: fmt(e.weight),
        color: '#94a3b8',
        size: Math.min(8, 1 + Math.log10(e.weight + 1) * 1.6),
        type: 'arrow',
      })
    } else {
      const crossProject = graph.getNodeAttribute(e.source, 'ghost') || graph.getNodeAttribute(e.target, 'ghost')
      graph.mergeEdge(e.source, e.target, {
        kind: e.kind,
        color: crossProject ? EDGE_COLORS.cross : EDGE_COLORS[e.kind] || EDGE_COLORS.call,
        size: Math.min(4, 0.8 + Math.log2(e.weight || 1)),
        type: big ? 'line' : 'arrow',
      })
    }
  }

  // Kích thước theo số liên kết (vùng chi tiết) + đánh dấu node độc lập
  const base = nodes.length < 300 ? 9 : nodes.length < 3000 ? 5 : 3
  let isolated = 0
  graph.updateEachNodeAttributes((id, attr) => {
    const degree = graph.degree(id)
    // node project khác: nhỏ, cố định — để node của chính project nổi bật
    if (!overview) attr.size = attr.ghost ? base * 0.7 : Math.min(base * 3, base + 1.8 * Math.sqrt(degree))
    attr.isolated = degree === 0
    if (attr.isolated) isolated++
    return attr
  })
  isolatedCount.value = isolated
  totalCount.value = graph.order
  if (!canFilter.value) visibility.value = 'all'

  const settings = {
    defaultEdgeType: big ? 'line' : 'arrow',
    nodeProgramClasses, // tròn / vuông / tam giác
    defaultNodeType: 'circle',
    defaultDrawNodeHover: drawNodeHover,
    renderEdgeLabels: overview, // tổng quan: hiện số tham chiếu trên cạnh
    edgeLabelSize: 12,
    edgeLabelColor: { color: '#334155' },
    labelFont: 'sans-serif',
    labelSize: overview ? 13 : 11,
    labelWeight: overview ? '600' : 'normal',
    labelColor: { color: '#1e293b' },
    labelRenderedSizeThreshold: overview ? 0 : 6,
    labelDensity: overview ? 1 : 0.5,
    labelGridCellSize: overview ? 100 : 220, // ô lưới rộng hơn → nhãn dài không đè lên nhau
    hideEdgesOnMove: big,
    hideLabelsOnMove: big,
    zIndex: true,
    stagePadding: 60,
    minCameraRatio: 0.005,
    maxCameraRatio: 20,
    nodeReducer,
    edgeReducer,
  }

  // Dùng lại MỘT Sigma cho mọi màn hình, chỉ thay đồ thị + cài đặt.
  // (Huỷ rồi tạo Sigma mới mỗi lần chuyển màn hình làm thao tác huỷ chậm dần: 0 → 0,3 → 0,8 → 2 giây…)
  hovered = null
  if (!renderer) {
    renderer = new Sigma(graph, graphContainer.value, settings)
    bindRendererEvents()
  } else {
    renderer.setCustomBBox(null)
    renderer.setSettings(settings)
    renderer.setGraph(graph)
    renderer.getCamera().setState({ x: 0.5, y: 0.5, ratio: 1, angle: 0 })
  }
  updateBBox()

  nodeIds = nodes.map((n) => n.id)
  indexOf = new Map(nodeIds.map((id, i) => [id, i]))
  focused = null
  info.value = null
  hasData.value = true
  if (pendingFocus && graph.hasNode(pendingFocus)) focus(pendingFocus)
  pendingFocus = null
}

/** Gắn sự kiện một lần cho Sigma; hành vi tuỳ theo màn hình hiện tại (isOverview). */
function bindRendererEvents() {
  renderer.on('clickNode', ({ node }) => (isOverview ? openView(node) : focus(node)))
  renderer.on('doubleClickNode', (e) => {
    const a = graph.getNodeAttributes(e.node)
    if (!isOverview && a.ghost) {
      e.preventSigmaDefault() // không phóng to như mặc định
      openView(a.project, e.node)
    }
  })
  renderer.on('clickStage', () => focus(null))
  renderer.on('enterNode', ({ node }) => {
    graphContainer.value.style.cursor = 'pointer'
    hovered = node
    if (isOverview) showProjectInfo(node)
  })
  renderer.on('leaveNode', () => {
    graphContainer.value.style.cursor = ''
    hovered = null
    if (isOverview) info.value = null
  })
}

// Làm mờ những gì không liên quan tới node đang chọn
function nodeReducer(node, data) {
  if (isHidden(data)) return { ...data, hidden: true }
  const labeled = node === hovered ? { ...data, label: data.fullLabel || data.label } : data
  if (!focused) return labeled
  if (node === focused.id) return { ...labeled, label: data.fullLabel || data.label, highlighted: true, zIndex: 2 }
  if (focused.neighbors.has(node)) return { ...labeled, label: data.fullLabel || data.label, zIndex: 1, forceLabel: true }
  return { ...labeled, color: '#e2e8f0', label: '', zIndex: 0 }
}
function edgeReducer(edge, data) {
  if (!focused) return data
  const [s, t] = graph.extremities(edge)
  if (s === focused.id || t === focused.id) return { ...data, color: s === focused.id ? '#2563eb' : '#f97316', zIndex: 1 }
  return { ...data, hidden: true }
}

function focus(id) {
  if (!id) {
    focused = null
    info.value = null
  } else {
    focused = { id, neighbors: new Set(graph.neighbors(id)) }
    const a = graph.getNodeAttributes(id)
    info.value = {
      label: a.fullLabel || a.label,
      lines: [
        a.file,
        `Project: ${projectName(a.project)}`,
        `Gọi / dùng ${fmt(graph.outDegree(id))} · Được dùng bởi ${fmt(graph.inDegree(id))} (trong màn hình này)`,
      ],
      open: a.ghost ? { view: a.project, focus: id, label: projectName(a.project) } : null,
    }
  }
  renderer?.refresh({ skipIndexation: true })
}

function showProjectInfo(id) {
  const p = projectById.value.get(id)
  if (!p) return
  info.value = {
    label: p.label,
    lines: [
      `${fmt(p.files)} file · ${fmt(p.nodes)} class / hàm`,
      `Dùng project khác: ${fmt(p.edgesOut)} tham chiếu · Được dùng: ${fmt(p.edgesIn)}`,
      'Bấm để xem chi tiết',
    ],
    open: null,
  }
}

function applyPositions(positions) {
  if (!graph) return
  pendingPositions = positions
  requestAnimationFrame(() => {
    if (!pendingPositions || !graph) return
    const p = pendingPositions
    pendingPositions = null
    graph.updateEachNodeAttributes((id, attr) => {
      const i = indexOf.get(id)
      attr.x = p[i * 2]
      attr.y = p[i * 2 + 1]
      return attr
    }, { attributes: ['x', 'y'] })
    if (visibility.value !== 'all') updateBBox()
  })
}

/* -------------------------------- Worker -------------------------------- */

function send(message) {
  job++
  worker.postMessage({ ...message, job })
}

function fail(message) {
  isError.value = true
  statusMessage.value = message
  busy.value = false
  layingOut.value = false
}

function onWorkerMessage({ data }) {
  if (data.job !== job) return // message của yêu cầu cũ
  try {
    switch (data.type) {
      case 'progress':
        statusMessage.value = data.text
        break
      case 'loaded':
        projects.value = data.projects
        stats.value = data.stats
        skipped.value = data.skipped
        if (!data.projects.length) fail('Không tìm thấy file mã nguồn được hỗ trợ trong thư mục này.')
        break
      case 'graph':
        statusMessage.value = 'Đang vẽ sơ đồ…'
        view.value = data.view
        buildGraph(data)
        busy.value = false
        layingOut.value = true
        break
      case 'positions':
        applyPositions(data.positions)
        statusMessage.value = `Đang sắp xếp sơ đồ… ${Math.round((data.done / data.total) * 100)}%`
        break
      case 'layout-done':
        layingOut.value = false
        statusMessage.value = ''
        break
      case 'error':
        fail(`Lỗi: ${data.message}`)
    }
  } catch (err) {
    // ví dụ: trình duyệt không tạo được WebGL — trước đây lỗi này bị nuốt và màn hình trống trơn
    console.error(err)
    fail(`Lỗi khi vẽ sơ đồ: ${err.message}`)
  }
}

function startWorker() {
  worker?.terminate() // giải phóng toàn bộ bộ nhớ của lần mở trước
  worker = new Worker(new URL('./parser.worker.js', import.meta.url), { type: 'module' })
  worker.onmessage = onWorkerMessage
  worker.onerror = (e) => {
    console.error(e)
    fail(e.message
      ? `Lỗi xử lý: ${e.message}`
      : 'Bộ xử lý bị dừng đột ngột (thường do hết bộ nhớ). Thử mở thư mục nhỏ hơn hoặc bỏ chọn "Gồm thư viện & mã sinh tự động".')
  }
  worker.onmessageerror = () => fail('Không truyền được dữ liệu giữa giao diện và bộ xử lý.')
}

function openView(v, focusNode = null) {
  if (!worker || !v) return
  focus(null)
  pendingFocus = focusNode
  isError.value = false
  statusMessage.value = v === OVERVIEW ? 'Đang mở tổng quan…' : `Đang mở ${projectName(v)}…`
  view.value = v
  send({ type: 'show', view: v })
}

function reLayout() {
  focus(null)
  send({ type: 'show', view: view.value, relayout: true })
}

function stopLayout() {
  send({ type: 'stop', view: view.value }) // Worker giữ nguyên bố cục hiện tại cho màn hình này
  layingOut.value = false
  statusMessage.value = ''
}

/* ------------------------------ Mở thư mục ------------------------------ */

function load() {
  if (!source) return
  busy.value = true
  isError.value = false
  hasData.value = false
  stats.value = null
  skipped.value = null
  info.value = null
  projects.value = []
  focused = null
  graph = null
  renderer?.setGraph(new Graph()) // xoá sơ đồ cũ (giữ lại Sigma để dùng tiếp)
  if (!source.items.length) return fail('Không tìm thấy file mã nguồn được hỗ trợ trong thư mục này.')
  statusMessage.value = `Đang đọc ${fmt(source.items.length)} file…`
  startWorker()
  send({ type: 'load', items: source.items, markers: source.markers, includeVendor: includeVendor.value })
}

const reload = () => source && load()

async function handleSelectFolder() {
  // Trình duyệt không hỗ trợ showDirectoryPicker (Firefox, Safari) → dùng <input webkitdirectory>
  if (!window.showDirectoryPicker) return folderInput.value.click()
  let dirHandle
  try {
    dirHandle = await window.showDirectoryPicker()
  } catch {
    return // người dùng bấm Huỷ
  }
  busy.value = true
  isError.value = false
  statusMessage.value = 'Đang liệt kê file…'
  try {
    source = await listDirectory(dirHandle, (n) => { statusMessage.value = `Đang liệt kê file… ${fmt(n)}` })
    load()
  } catch (err) {
    console.error(err)
    fail(`Không đọc được thư mục: ${err.message}`)
  }
}

function onFolderInput(e) {
  const list = e.target.files
  if (list.length) {
    source = listFileList(list)
    load()
  }
  e.target.value = ''
}

onBeforeUnmount(() => {
  worker?.terminate()
  renderer?.kill()
})
</script>

<style scoped>
.app-container { display: flex; flex-direction: column; width: 100vw; height: 100vh; background-color: #f8f9fa; }
.control-panel {
  display: flex; align-items: center; flex-wrap: wrap; gap: 10px 12px; padding: 10px 20px;
  background-color: #ffffff; border-bottom: 1px solid #e2e8f0;
}
.control-panel h2 { margin: 0; font-size: 15px; color: #1e293b; }
.btn-primary, .btn-secondary { padding: 8px 14px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; }
.btn-primary { background-color: #1d4ed8; color: white; }
.btn-primary.small { padding: 6px 10px; font-size: 12px; align-self: flex-start; margin-top: 4px; }
.btn-secondary { background-color: #e2e8f0; color: #334155; }
.btn-secondary.active { background-color: #dbeafe; color: #1d4ed8; }
button:disabled { opacity: 0.5; cursor: default; }
.check { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #475569; cursor: pointer; }
.crumbs { display: inline-flex; align-items: center; gap: 6px; color: #94a3b8; }
.crumbs select { max-width: 260px; padding: 7px 8px; border: 1px solid #cbd5e1; border-radius: 4px; background: #fff; color: #0f172a; font: inherit; font-size: 13px; }
.status-text { font-size: 13px; color: #2563eb; font-weight: 500; }
.status-text.error { color: #dc2626; }
.stats { margin-left: auto; font-size: 13px; color: #64748b; }
.muted { color: #94a3b8; }

.canvas-container { flex: 1; position: relative; min-height: 0; }
.graph-canvas { position: absolute; inset: 0; }
.empty-state {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  max-width: 460px; color: #94a3b8; font-size: 14px; line-height: 1.6; text-align: center; pointer-events: none;
}
.busy {
  position: absolute; inset: 0; z-index: 20; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; background: rgba(248, 249, 250, 0.85); color: #334155; font-size: 14px;
}
.spinner { width: 28px; height: 28px; border: 3px solid #cbd5e1; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.legend, .info {
  position: absolute; z-index: 5; display: flex; gap: 6px 14px; padding: 8px 12px; font-size: 12px; color: #475569;
  background: rgba(255, 255, 255, 0.94); border: 1px solid #e2e8f0; border-radius: 6px;
}
.legend { left: 12px; bottom: 12px; flex-wrap: wrap; align-items: center; max-width: calc(100% - 24px); }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.legend .kind { display: inline-flex; align-items: center; gap: 5px; cursor: pointer; }
.legend select { font: inherit; font-size: 11px; color: #475569; padding: 1px 2px; border: 1px solid #cbd5e1; border-radius: 4px; background: #fff; cursor: pointer; }
.legend i.line { width: 16px; height: 2px; background: #94a3b8; }
.legend i.line.inherit { background: #7dd3fc; }
.legend i.line.cross { background: #c4b5fd; }
.legend i.ghost { width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; border: 1px dashed #64748b; }
.info { right: 12px; top: 12px; flex-direction: column; max-width: 380px; }
.info b { color: #0f172a; font-size: 13px; word-break: break-all; }
.info span { word-break: break-all; }
</style>
