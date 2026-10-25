// stores/workspace.js — Thư mục đang mở và kết quả phân tích.
//
// Là cầu nối giữa giao diện và analyzer.worker.js (qua useAnalyzer). Store này KHÔNG biết gì về Sigma:
// các message 'graph' / 'positions' được chuyển cho "graph sink" do stores/graph.js đăng ký
// (attachGraph), nên phụ thuộc chỉ đi một chiều: graph → workspace.

import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { useAnalyzer } from '../analyzer/useAnalyzer'
import { useSettingsStore } from './settings'
import { SourceError } from '../core/source'
import { PROJECT_PALETTE } from '../features/graph/constants'
import { fmt } from '../utils/format'
import { ViewType } from '../utils/viewType'

export const useWorkspaceStore = defineStore('workspace', () => {
  const settings = useSettingsStore()

  const rootDir = ref('Chọn project…')
  const statusMessage = ref('')
  const isError = ref(false)
  const hasData = ref(false)
  const busy = ref(false)
  const layingOut = ref(false)
  const stats = ref(null)
  const skipped = ref(null)
  const projects = ref([])
  const view = ref(ViewType.oviw) // ViewType.oviw hoặc id project đang mở
  const report = ref('')
  const showReport = ref(false)
  /** Chỉ mục file: { paths: string[], projectIds: string[], pidx: Int32Array } (shallow: mảng rất lớn, không bọc reactive) */
  const fileIndex = shallowRef(null)

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

  // ---------- nơi nhận kết quả vẽ (do stores/graph.js đăng ký) ----------
  // sink = { render(data), applyPositions(positions), clear() }
  let sink = null
  function attachGraph(s) { sink = s }

  // ---------- message từ Worker ----------
  function fail(message) {
    isError.value = true
    statusMessage.value = message
    busy.value = false
    layingOut.value = false
  }

  function onAnalyzerMessage(data) {
    try {
      switch (data.type) {
        case 'progress':
          statusMessage.value = data.text
          break
        case 'loaded':
          projects.value = data.projects
          stats.value = data.stats
          skipped.value = data.skipped
          report.value = data.report
          fileIndex.value = data.files ?? null
          if (!data.projects.length) fail('Không tìm thấy file mã nguồn được hỗ trợ trong thư mục này.')
          break
        case 'graph':
          statusMessage.value = 'Đang vẽ sơ đồ…'
          view.value = data.view
          sink?.render(data)
          hasData.value = true
          busy.value = false
          layingOut.value = true
          break
        case 'positions':
          sink?.applyPositions(data.positions)
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

  const analyzer = useAnalyzer({ onMessage: onAnalyzerMessage, onError: fail })

  // ---------- mở thư mục ----------
  /** Xoá trạng thái của lần mở trước (giữ lại Sigma để dùng tiếp). */
  function resetView() {
    busy.value = true
    isError.value = false
    hasData.value = false
    stats.value = null
    skipped.value = null
    report.value = ''
    showReport.value = false
    projects.value = []
    fileIndex.value = null
    sink?.clear()
  }

  /** Bắt đầu phân tích; `start` trả về { count, started } từ useAnalyzer. */
  async function run(start) {
    resetView()
    statusMessage.value = 'Đang liệt kê file…'
    try {
      const { count, started, rootName } = await start()
      if (!started) return fail('Không tìm thấy file nào trong thư mục này.')
      statusMessage.value = `Đang đọc ${fmt(count)} file…`
      rootDir.value = rootName
    } catch (err) {
      console.error(err)
      fail(`Không đọc được thư mục: ${err.message}`)
    }
  }

  /** Chrome / Edge: showDirectoryPicker (chỉ giữ handle, rất nhẹ). */
  async function pickDirectory() {
    let dirHandle
    try {
      dirHandle = await window.showDirectoryPicker()
    } catch {
      return // người dùng bấm Huỷ
    }
    await run(() => analyzer.analyzeDirectory(dirHandle, {
      includeVendor: settings.includeVendor,
      onCount: (n) => { statusMessage.value = `Đang liệt kê file… ${fmt(n)}` },
    }))
  }

  /** Firefox / Safari: danh sách file từ <input webkitdirectory>. */
  function openFileList(files) {
    if (files?.length) run(() => analyzer.analyzeFileList(files, { includeVendor: settings.includeVendor }))
  }

  /** Đổi tuỳ chọn "Gồm thư viện & mã sinh tự động" → phân tích lại thư mục đang mở. */
  function reload() {
    if (!analyzer.hasSource()) return
    resetView()
    statusMessage.value = 'Đang phân tích lại…'
    analyzer.reload({ includeVendor: settings.includeVendor })
  }

  // ---------- điều hướng & bố cục ----------
  function showView(v) {
    if (!v || !hasData.value) return
    isError.value = false
    statusMessage.value = v === ViewType.oviw ? 'Đang mở tổng quan…' : `Đang mở ${projectName(v)}…`
    view.value = v
    analyzer.show(v)
  }

  function relayout() {
    analyzer.show(view.value, { relayout: true })
  }

  function stopLayout() {
    analyzer.stop(view.value) // Worker giữ nguyên bố cục hiện tại cho màn hình này
    layingOut.value = false
    statusMessage.value = ''
  }

  // ---------- chỉ mục file & tìm kiếm ----------
  const pathIndex = computed(() => (fileIndex.value ? new Map(fileIndex.value.paths.map((p, i) => [p, i])) : null))
  /** Project (id) chứa file này, hoặc null nếu không thuộc project nào có sơ đồ. */
  function projectOfPath(path) {
    const i = pathIndex.value?.get(path)
    if (i == null) return null
    const k = fileIndex.value.pidx[i]
    return k < 0 ? null : fileIndex.value.projectIds[k]
  }
  /** Tìm symbol + nội dung trong Worker (xem useAnalyzer.search). Trả về hàm huỷ. */
  const search = (request, handlers) => analyzer.search(request, handlers)
  /** Quan hệ của một file (Dùng / Được dùng bởi / Định nghĩa) — xem analyzer/related.js. null nếu chưa có dữ liệu. */
  const related = (path) => analyzer.related(path)

  // ---------- đọc nội dung file (editor, tìm kiếm, sơ đồ class dùng) ----------
  // Đọc theo yêu cầu qua core/source.js, không giữ nội dung trong store. path = node.file / selection.filePath.
  const hasFile = (path) => !!analyzer.getSource()?.has(path)
  const filePaths = () => analyzer.getSource()?.paths() ?? []

  function requireSource(path) {
    const source = analyzer.getSource()
    if (!source) throw new SourceError('not-found', path, 'Chưa mở thư mục nào')
    return source
  }
  /** @returns {Promise<string>} — ném SourceError (.code: not-found | binary | too-large | read-error) */
  const readFile = async (path, options) => requireSource(path).read(path, options)
  const statFile = async (path) => requireSource(path).stat(path)

  return {
    statusMessage, isError, hasData, busy, layingOut, stats, skipped, projects, view, report, showReport,
    projectById, projectName, skippedText, rootDir,
    fileIndex, projectOfPath, search, related,
    hasFile, filePaths, readFile, statFile,
    attachGraph, pickDirectory, openFileList, reload, showView, relayout, stopLayout,
  }
})
