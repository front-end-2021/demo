// stores/graph.js — Vẽ sơ đồ bằng Sigma.js + graphology: node/cạnh, làm nổi bật, lọc node, bảng thông tin.
//
// `graph` và `renderer` được giữ NGOÀI state phản ứng của Vue (biến thường trong closure):
// bọc reactive lên đối tượng Sigma/graphology sẽ làm chậm đáng kể.
// Dữ liệu phân tích và việc gọi Worker nằm ở stores/workspace.js.

import { defineStore } from 'pinia'
import { computed, ref, toRaw } from 'vue'
import Graph from 'graphology'
import Sigma from 'sigma'
import EdgeCurveProgram, { EdgeCurvedArrowProgram } from '@sigma/edge-curve'
import { nodeProgramClasses, drawNodeHover } from '../analyzer/node-shapes'
import { useWorkspaceStore } from './workspace'
import { useSettingsStore } from './settings'
import { useSelectionStore } from './selection'
import { BIG, KIND_COLORS, KIND_LABELS, EDGE_COLORS, VISIBILITY } from '../features/graph/constants'
import { fmt } from '../utils/format'
import { ViewType } from '../utils/viewType'

/** Loại node KHÔNG phải một file mã nguồn (không có đường dẫn file thật để mở trong editor). */
const NON_FILE_TYPES = new Set(['endpoint', 'route', 'external'])

/** Trộn màu với trắng (t = 0 → giữ nguyên, 1 → trắng) — dùng cho node của project khác và cạnh suy đoán. */
function tint(hex, t) {
  const n = parseInt(hex.slice(1), 16)
  const mix = (c) => Math.round(c + (255 - c) * t)
  return `rgb(${mix(n >> 16)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`
}

export const useGraphStore = defineStore('graph', () => {
  const workspace = useWorkspaceStore()
  const settings = useSettingsStore()
  const selection = useSelectionStore()

  // ---------- state hiển thị ----------
  const info = ref(null) // bảng thông tin node đang chọn / project đang rê chuột
  const isolatedCount = ref(0)
  const totalCount = ref(0)
  /** Bấm để xoay vòng: all → no-isolated → isolated-only → all. */
  const visibility = ref('all')
  const linkedCount = computed(() => totalCount.value - isolatedCount.value)
  const canFilter = computed(() => isolatedCount.value > 0 && linkedCount.value > 0)
  const visibilityActive = computed(() => visibility.value !== 'all')
  /** Nhãn nút = việc nút sẽ làm ở lần bấm tới. */
  const visibilityLabel = computed(() => {
    if (visibility.value === 'all') return `Ẩn node độc lập (${fmt(isolatedCount.value)})`
    if (visibility.value === 'no-isolated') return `Ẩn node có liên kết (${fmt(linkedCount.value)})`
    return '👁 Hiện tất cả node'
  })
  const visibilityTitle = computed(() => (canFilter.value
    ? `Đang hiện: ${VISIBILITY[visibility.value].showing}. Bấm để chuyển sang bước tiếp theo.`
    : 'Chỉ có một loại node (toàn bộ độc lập hoặc toàn bộ có liên kết)'))

  // ---------- đối tượng vẽ (không reactive) ----------
  let container = null // phần tử DOM chứa canvas, do GraphView gắn vào qua mount()
  let graph = null
  let renderer = null
  let nodeIds = []
  let indexOf = new Map() // id node → vị trí trong mảng vị trí Worker gửi về
  let focused = null
  let pendingFocus = null // node cần chọn sau khi mở project (khi bấm đúp node của project khác)
  let pendingPositions = null
  let hovered = null // node đang rê chuột (để hiện nhãn của node project khác)
  let isOverview = true // màn hình hiện tại là tổng quan?
  let fileToNode = new Map() // đường dẫn file -> id node (chỉ node file; màn hình chi tiết project)
  let highlight = null // { files: Set<path>, projects: Set<id> } của kết quả tìm kiếm; null = không tìm
  let pendingOpen = null // { path, line, query }: file cần mở sau khi chuyển sang project chứa nó

  const isHidden = (attr) => VISIBILITY[visibility.value].hide(attr)

  function mount(el) {
    container = el
  }

  function unmount() {
    renderer?.kill()
    renderer = null
    container = null
  }

  // ---------- lọc node ----------
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

  // ---------- vẽ ----------
  function buildGraph({ view: v, nodes, edges, positions }) {
    graph = new Graph({ type: 'directed', multi: false, allowSelfLoops: false })
    const overview = v === ViewType.oviw
    isOverview = overview
    const big = nodes.length >= BIG
    const maxCount = Math.max(1, ...nodes.map((n) => n.count || 0))

    nodes.forEach((n, i) => {
      const pos = { x: positions[i * 2], y: positions[i * 2 + 1] }
      if (overview) {
        const p = workspace.projectById.get(n.id)
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
        const fullLabel = n.ghost ? `${n.label} · ${workspace.projectName(n.project)}` : n.label
        graph.addNode(n.id, {
          ...pos,
          // node của project khác: không hiện nhãn thường trực (chỉ khi rê chuột / liên quan node đang chọn)
          label: n.ghost ? '' : fullLabel,
          fullLabel,
          file: n.file,
          symbols: n.symbols,
          kind: n.type,
          project: n.project,
          ghost: !!n.ghost,
          color: n.ghost ? tint(workspace.projectById.get(n.project)?.color || '#94a3b8', 0.72) : KIND_COLORS[n.type] || '#94a3b8',
          type: settings.shapes[n.type] || 'circle', // `type` = chương trình vẽ của Sigma = hình dạng
        })
      }
    })

    // Chỉ mục file -> node (node endpoint/route/thư viện ngoài không phải file; node của chính project được ưu tiên hơn ghost)
    fileToNode = new Map()
    if (!overview) {
      for (const n of nodes) {
        if (!n.file || NON_FILE_TYPES.has(n.type)) continue
        if (!fileToNode.has(n.file) || !n.ghost) fileToNode.set(n.file, n.id)
      }
    }

    if (overview) {
      for (const e of edges) {
        graph.mergeEdge(e.source, e.target, {
          kind: 'cross',
          label: fmt(e.weight),
          color: '#94a3b8',
          size: Math.min(8, 1 + Math.log10(e.weight + 1) * 1.6),
          type: 'curvedArrow',
          curvature: 0.2,
        })
      }
    } else {
      for (const e of edges) {
        const crossProject = graph.getNodeAttribute(e.source, 'ghost') || graph.getNodeAttribute(e.target, 'ghost')
        const base = crossProject ? EDGE_COLORS.cross : EDGE_COLORS[e.kind] || EDGE_COLORS.use
        graph.mergeEdge(e.source, e.target, {
          kind: e.kind,
          kinds: e.kinds,
          color: e.inferred ? tint(base, 0.55) : base, // cạnh suy đoán vẽ nhạt hơn
          size: Math.min(3, 0.8 + Math.log2(e.weight || 1)),
          type: 'curvedArrow',
          curvature: 0.2,
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

    const sigmaSettings = {
      defaultEdgeType: 'curvedArrow',//big ? 'line' : 'arrow',
      nodeProgramClasses, // tròn / vuông / tam giác…
      edgeProgramClasses: {
        curvedArrow: EdgeCurvedArrowProgram, // đường cong có mũi tên
      },
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
      zIndex: true, allowInvalidContainer: true,
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
      renderer = new Sigma(graph, container, sigmaSettings)
      bindRendererEvents()
    } else {
      renderer.setCustomBBox(null)
      renderer.setSettings(sigmaSettings)
      renderer.setGraph(graph)
      renderer.getCamera().setState({ x: 0.5, y: 0.5, ratio: 1, angle: 0 })
    }
    updateBBox()

    nodeIds = nodes.map((n) => n.id)
    indexOf = new Map(nodeIds.map((id, i) => [id, i]))
    focused = null
    info.value = null
    selection.clear()
    if (pendingFocus && graph.hasNode(pendingFocus)) focus(pendingFocus)
    pendingFocus = null
    if (pendingOpen) {
      const req = pendingOpen
      pendingOpen = null
      revealFile(req)
    }
  }

  /** Gắn sự kiện một lần cho Sigma; hành vi tuỳ theo màn hình hiện tại (isOverview). */
  function bindRendererEvents() {
    renderer.on('clickNode', ({ node }) => (isOverview ? openView(node) : focus(node)))
    //renderer.on('doubleClickNode', (e) => { const a = graph.getNodeAttributes(e.node); if (!isOverview && a.ghost) { e.preventSigmaDefault(); openView(a.project, e.node) } })
    renderer.on('clickStage', () => focus(null))
    renderer.on('enterNode', ({ node }) => {
      container.style.cursor = 'pointer'
      hovered = node
      if (isOverview) showProjectInfo(node)
    })
    renderer.on('leaveNode', () => {
      container.style.cursor = ''
      hovered = null
      if (isOverview) info.value = null
    })
  }

  // Làm mờ những gì không liên quan tới node đang chọn
  function nodeReducer(node, data) {
    if (isHidden(data)) return { ...data, hidden: true }
    const labeled = node === hovered ? { ...data, label: data.fullLabel || data.label } : data
    if (!focused && highlight) {
      // Đang tìm kiếm: node có kết quả nổi lên, còn lại mờ đi (chọn một node thì quy tắc "đang chọn" bên dưới ưu tiên)
      const hit = isOverview ? highlight.projects.has(node) : highlight.files.has(data.file)
      return hit
        ? { ...labeled, label: data.fullLabel || data.label, zIndex: 2, forceLabel: true }
        : { ...labeled, color: '#e2e8f0', label: '', zIndex: 0 }
    }
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
      selection.clear()
    } else {
      focused = { id, neighbors: new Set(graph.neighbors(id)) }
      const a = graph.getNodeAttributes(id)
      const base = [a.file, `${KIND_LABELS[a.kind] ?? a.kind} · Project: ${workspace.projectName(a.project)}`].filter(Boolean)
      // File: số "Dùng / Được dùng bởi" lấy từ Worker (toàn bộ mô hình) — CÙNG nguồn với dải quan hệ trong editor nên luôn khớp nhau.
      // Node không phải file (endpoint, route, thư viện ngoài): không có quan hệ kiểu file, chỉ có bậc trong màn hình này.
      const isFile = !!a.file && !NON_FILE_TYPES.has(a.kind)
      const current = {
        label: a.fullLabel || a.label,
        lines: isFile ? base : [...base, `Dùng ${fmt(graph.outDegree(id))}`, `Được dùng bởi ${fmt(graph.inDegree(id))} (trong màn hình này)`],
        symbols: a.symbols,
        open: a.ghost ? { view: a.project, focus: id, label: workspace.projectName(a.project) } : null,
      }
      info.value = current
      if (isFile) {
        workspace.related(a.file).then((r) => {
          // Bỏ qua nếu trong lúc chờ đã chọn node khác / bỏ chọn, hoặc Worker không có dữ liệu cho file này
          if (toRaw(info.value) !== current || !r?.found) return
          info.value = { ...current, lines: [...current.lines, `Dùng ${fmt(r.uses.length)}`, `Được dùng bởi ${fmt(r.usedBy.length)}`] }
        }).catch((err) => {
          console.warn('Không lấy được quan hệ của node', id, err)
        })
      }
      selection.select({ nodeId: id, filePath: a.file ?? null })
    }
    renderer?.refresh({ skipIndexation: true })
  }

  function showProjectInfo(id) {
    const p = workspace.projectById.get(id)
    if (!p) return
    info.value = {
      label: p.label,
      lines: [
        `${fmt(p.files)} file · ${fmt(p.nodes)} node`,
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

  /** Workspace gọi khi mở thư mục mới: bỏ đồ thị cũ (giữ lại Sigma để dùng tiếp). */
  function clear() {
    info.value = null
    selection.clear()
    pendingOpen = null
    fileToNode = new Map()
    focused = null
    graph = null
    renderer?.setGraph(new Graph())
  }

  // ---------- thao tác từ giao diện ----------
  function openView(v, focusNode = null) {
    if (!v || !workspace.hasData) return
    focus(null)
    pendingFocus = focusNode
    workspace.showView(v)
  }

  function reLayout() {
    focus(null)
    workspace.relayout()
  }

  function fitView() {
    renderer?.getCamera().animatedReset()
  }

  /** Vùng vẽ đổi kích thước (kéo thanh chia đôi, mở/đóng editor): Sigma không tự biết. */
  function resize() {
    // Tab "Sơ đồ class" đang mở → vùng vẽ bị ẩn (rộng 0): Sigma không vẽ được và sẽ ném lỗi, nên bỏ qua
    if (!renderer || !container || container.offsetWidth === 0) return
    try {
      renderer.resize()
      renderer.refresh({ skipIndexation: true })
    } catch (err) {
      console.warn('Sigma resize', err)
    }
  }

  /** Đổi hình dạng một loại node: lưu tuỳ chọn + cập nhật node đang vẽ. */
  function setShape(kind, shape) {
    settings.setShape(kind, shape)
    graph?.updateEachNodeAttributes((_, attr) => {
      if (attr.kind === kind) attr.type = shape
      return attr
    })
  }

  // ---------- mở file từ Explorer / kết quả tìm kiếm ----------

  /** Đưa camera tới node (giữ nguyên mức phóng nếu đã phóng to hơn). */
  function centerOn(id, retried = false) {
    if (!renderer) return
    try {
      const d = renderer.getNodeDisplayData(id)
      if (!d) {
        // Vừa chuyển sang project khác: Sigma chưa xử lý đồ thị mới → thử lại một lần ở khung hình kế tiếp
        if (!retried) requestAnimationFrame(() => centerOn(id, true))
        return
      }
      const camera = renderer.getCamera()
      camera.animate({ x: d.x, y: d.y, ratio: Math.min(camera.ratio, 0.6) }, { duration: 300 })
    } catch (err) {
      console.warn('Không căn được camera vào node:', err) // phần phụ: node vẫn được chọn
    }
  }

  /** Chọn file ở màn hình hiện tại: có node thì chọn + căn camera; không có node (README, .csproj…) thì chỉ mở trong editor. */
  function revealFile({ path, line = null, query = '' }) {
    const id = !isOverview && graph ? fileToNode.get(path) : null
    if (id) {
      focus(id)
      centerOn(id)
    } else {
      focus(null)
    }
    selection.select({ nodeId: id ?? null, filePath: path, line, query }) // ghi đè để mang theo dòng và từ khoá
  }

  /**
   * Mở một file: nếu nó thuộc project khác với màn hình đang xem thì chuyển sang project đó trước,
   * rồi chọn node ngay khi sơ đồ dựng xong (pendingOpen). line/query dành cho editor (nhảy dòng, tô sáng).
   */
  function openFile({ path, line = null, query = '' }) {
    const project = workspace.projectOfPath(path)
    const inThisView = !isOverview && graph && fileToNode.has(path)
    if (inThisView || !project || (!isOverview && workspace.view === project)) return revealFile({ path, line, query })
    pendingFocus = null
    pendingOpen = { path, line, query }
    focus(null)
    workspace.showView(project)
  }

  /** Làm nổi bật node theo kết quả tìm kiếm; null = bỏ làm nổi bật. */
  function setHighlight(h) {
    highlight = h
    renderer?.refresh({ skipIndexation: true })
  }

  workspace.attachGraph({ render: buildGraph, applyPositions, clear })

  return {
    info, visibilityActive, visibilityLabel, visibilityTitle, canFilter,
    mount, unmount, resize, openView, openFile, setHighlight, reLayout, fitView, cycleVisibility, setShape,
  }
})
