// stores/search.js — Tìm kiếm và danh sách file (Explorer).
//
// Một ô tìm duy nhất, ba loại kết quả:
//   - Tên file   : trên luồng chính, từ chỉ mục đường dẫn (tức thì)
//   - Symbol     : trong Worker, từ mô hình phân tích (class, hàm, component…)
//   - Nội dung   : trong Worker, quét file theo lô, kết quả về dần và huỷ được khi gõ tiếp
// Kết quả cũng được chuyển cho sơ đồ để LÀM NỔI BẬT các node có kết quả (graph.setHighlight).
// Chọn một kết quả → graph.openFile (chuyển project nếu cần, chọn node, mở editor tại đúng dòng).

import { defineStore } from 'pinia'
import { computed, ref, shallowRef, watch } from 'vue'
import { useWorkspaceStore } from './workspace'
import { useGraphStore } from './graph'
import { countByExt, filterByExt, rankPaths } from '../core/search'

const DEBOUNCE_MS = 250
const IDLE_CONTENT = { scanned: 0, total: 0, done: true, truncated: false }

export const useSearchStore = defineStore('search', () => {
  const workspace = useWorkspaceStore()
  const graph = useGraphStore()

  /* Lịch sử lọc (dùng cho tab Lịch sử lọc), phần tử đầu tiên là cache filter input*/
  const filterLogs = ref([''])

  const query = ref('') // nội dung ô nhập (từng phím)
  const committed = ref('') // sau khi chờ ngừng gõ — chuỗi thật sự được tìm
  const exts = shallowRef(new Set()) // đuôi file đang lọc; rỗng = tất cả
  const symbolHits = shallowRef([])
  const symbolTotal = ref(0)
  const contentHits = shallowRef([])
  const contentState = ref({ ...IDLE_CONTENT })
  const error = ref('')
  const focusTick = ref(0) // tăng để yêu cầu ô tìm nhận focus (Ctrl+K)

  const paths = computed(() => workspace.fileIndex?.paths ?? [])
  const extCounts = computed(() => countByExt(paths.value))
  const searching = computed(() => !!committed.value && !contentState.value.done)
  /** Không có truy vấn: danh sách MỌI file (đã lọc đuôi). */
  const listIndices = computed(() => (committed.value ? [] : filterByExt(paths.value, exts.value)))
  const nameResult = computed(() => (committed.value ? rankPaths(paths.value, committed.value, { exts: exts.value, limit: 500 }) : { indices: [], total: 0 }))

  // ---------- chạy tìm kiếm ----------
  let timer = 0
  let cancel = null

  function run() {
    cancel?.()
    cancel = null
    symbolHits.value = []
    symbolTotal.value = 0
    contentHits.value = []
    error.value = ''
    if (!committed.value) {
      contentState.value = { ...IDLE_CONTENT }
      return
    }
    contentState.value = { scanned: 0, total: 0, done: false, truncated: false }
    cancel = workspace.search({ query: committed.value, exts: [...exts.value] }, {
      onSymbols: (d) => { symbolHits.value = d.hits; symbolTotal.value = d.total },
      onContent: (d) => {
        if (d.hits.length) contentHits.value = contentHits.value.concat(d.hits)
        contentState.value = { scanned: d.scanned, total: d.total, done: d.done, truncated: d.truncated }
      },
      onError: (message) => {
        error.value = message
        contentState.value = { ...contentState.value, done: true }
      },
    })
  }

  function commit() {
    clearTimeout(timer)
    const q = query.value.trim()
    if (q === committed.value) return
    committed.value = q
    run()
  }
  const clearFilterLogs = (type = 0, ii) => {
    const txt = filterLogs.value[0] // giữ lại cache filter input
    if (2 != type && txt != query.value) { setQuery(txt) }
    const emptyZero = () => filterLogs.value[0] = ''
    switch (type) {
      case 0: filterLogs.value = ['']; break // xoá hết
      case 1:  // xoá một
        filterLogs.value.splice(ii + 1, 1);
        emptyZero()
        break
      case 2: emptyZero(); break // xoá cache filter input
    }
  }
  function clear() {
    clearTimeout(timer)
    query.value = ''
    commit()
    filterLogs.value[0] = ''
  }

  // Đổi bộ lọc đuôi khi đang tìm → tìm lại; mở thư mục khác → bỏ hết
  watch(exts, () => { if (committed.value) run() })
  watch(() => workspace.fileIndex, () => {
    exts.value = new Set()
    clear()
    filterLogs.value = [''] // định dùng clearFilterLogs
  })
  const setQuery = (value) => {
    query.value = value
    clearTimeout(timer)
    if (!value.trim()) commit() // xoá hết thì trở về danh sách ngay, không chờ
    else timer = setTimeout(commit, DEBOUNCE_MS)
  }
  // ---------- làm nổi bật trên sơ đồ ----------
  const highlight = computed(() => {
    if (!committed.value) return null
    const files = new Set()
    const projects = new Set()
    const add = (p) => {
      files.add(p)
      const project = workspace.projectOfPath(p)
      if (project) projects.add(project)
    }
    for (const i of nameResult.value.indices) add(paths.value[i])
    for (const h of symbolHits.value) add(h.path)
    for (const h of contentHits.value) add(h.path)
    return { files, projects }
  })
  watch(highlight, (h) => graph.setHighlight(h), { immediate: true })

  const fLogs = computed(() => filterLogs.value.slice(1)) // bỏ phần tử đầu tiên là cache filter input

  return {
    query, committed, exts, symbolHits, symbolTotal, contentHits, contentState, error, focusTick,
    paths, extCounts, searching, listIndices, nameResult, highlight, clear, setQuery,
    commitNow: commit, /** Enter: tìm ngay, không chờ. */
    /** Bấm chip: bật/tắt một đuôi; Alt + bấm: chỉ chọn đuôi đó. Chọn đủ mọi đuôi = "Tất cả". */
    toggleExt: (ext, only = false) => {
      let next
      if (only) next = new Set([ext])
      else {
        next = new Set(exts.value)
        if (!next.delete(ext)) next.add(ext)
        if (next.size === extCounts.value.length) next = new Set()
      }
      exts.value = next
    },
    resetFilters: () => { exts.value = new Set(); clear() },
    focusInput: () => { focusTick.value++ },
    // ---------- chọn kết quả ----------
    /** Mở file; line/query để editor nhảy tới dòng và tô sáng từ khoá. */
    open: (path, { line = null } = {}) => { graph.openFile({ path, line, query: committed.value }) },
    // ---------- lịch sử lọc ----------
    fLogs, filterLogs,
    addFilterLog: (text) => {
      let txt = text.trim()
      filterLogs.value[0] = text
      if (txt.length < 1) return
      if (highlight.value.files.size < 1) { return }
      let logs = fLogs.value.map(t => t.trim())
      if (logs.includes(txt)) return
      filterLogs.value.splice(1, 0, text) // thêm vào sau phần tử đầu tiên (cache filter input)
    },
    selectFilterLog: (txt) => {
      let aTx = query.value
      let old = filterLogs.value[0].trim()
      if (!old.length && aTx.length) { filterLogs.value[0] = aTx } // giữ lại cache filter input
      setQuery(txt)
    },
    clearFilterLogs,
  }
})
