// useAnalyzer.js — Composable Vue 3: cầu nối giữa giao diện và analyzer.worker.js.
//
//   const analyzer = useAnalyzer({ onMessage, onError })
//   await analyzer.analyzeDirectory(dirHandle, { includeVendor, onCount })   // showDirectoryPicker (Chrome/Edge)
//   analyzer.analyzeFileList(input.files, { includeVendor })                 // <input webkitdirectory> (Firefox/Safari)
//   analyzer.reload({ includeVendor })    // phân tích lại thư mục đang mở (khi đổi tuỳ chọn)
//   analyzer.show(view, { relayout })     // mở tổng quan / một project
//   analyzer.stop(view)                   // dừng sắp xếp, giữ bố cục hiện tại
//   analyzer.getSource()                  // core/source.js: đọc file theo yêu cầu (read / stat / has / paths)
//   const rel = await analyzer.related(path)   // { found, symbols, uses, usedBy, externals } của MỘT file (từ đồ thị đầy đủ trong Worker)
//   const cancel = analyzer.search({ query, exts }, { onSymbols, onContent, onError })   // tìm symbol + nội dung trong Worker
//
// onMessage(data) chỉ nhận message của yêu cầu MỚI NHẤT (message của job cũ bị bỏ qua).
// data.type: 'progress' | 'loaded' | 'graph' | 'positions' | 'layout-done' | 'error'

import { getCurrentInstance, onBeforeUnmount } from 'vue'
import { createSourceFromDirectory, createSourceFromFileList, SourceError } from '../core/source.js'

export function useAnalyzer({ onMessage, onError } = {}) {
  let worker = null
  let job = 0
  let current = null // { source, options } của thư mục đang mở — để phân tích lại và để đọc file theo yêu cầu
  let searchSeq = 0
  let relatedSeq = 0
  const relatedPending = new Map() // requestId -> resolve
  let searchHandler = null // { searchId, onSymbols, onContent, onError } của lần tìm MỚI NHẤT

  function send(message) {
    job++
    worker.postMessage({ ...message, job })
  }

  function startWorker() {
    worker?.terminate() // giải phóng toàn bộ bộ nhớ của lần mở trước
    searchHandler = null
    for (const resolve of relatedPending.values()) resolve(null) // Worker cũ bị bỏ: người đang chờ nhận null
    relatedPending.clear()
    worker = new Worker(new URL('./analyzer.worker.js', import.meta.url), { type: 'module' })
    worker.onmessage = ({ data }) => {
      // Trả lời truy vấn quan hệ (mang requestId, không mang job)
      if (data.requestId != null) {
        const resolve = relatedPending.get(data.requestId)
        relatedPending.delete(data.requestId)
        resolve?.(data)
        return
      }
      // Message tìm kiếm mang searchId (không mang job): chỉ lần tìm mới nhất được nhận
      if (data.searchId != null) {
        const h = searchHandler
        if (!h || h.searchId !== data.searchId) return
        if (data.type === 'search-symbols') h.onSymbols?.(data)
        else if (data.type === 'search-content') h.onContent?.(data)
        else if (data.type === 'search-error') h.onError?.(data.message)
        return
      }
      if (data.job === job) onMessage?.(data)
    }
    worker.onerror = (e) => {
      console.error(e)
      onError?.(e.message
        ? `Lỗi xử lý: ${e.message}`
        : 'Bộ xử lý bị dừng đột ngột (thường do hết bộ nhớ). Thử mở thư mục nhỏ hơn hoặc bỏ chọn "Gồm thư viện & mã sinh tự động".')
    }
    worker.onmessageerror = () => onError?.('Không truyền được dữ liệu giữa giao diện và bộ xử lý.')
  }

  function load({ includeVendor = false } = {}) {
    if (!current) return false
    startWorker()
    send({ type: 'load', entries: current.source.workerEntries(), options: { ...current.options, includeVendor } })
    return true
  }

  // Path đã được core/source.js chuẩn hoá (và gỡ thư mục gốc) NGAY trên luồng chính, nên Worker không cần
  // gỡ nữa (stripRootFolder: false) và mọi path — node.file, source.read(path) — luôn khớp nhau.

  /** Duyệt thư mục trên luồng chính (chỉ lấy handle, rất nhẹ), rồi giao cho Worker đọc & phân tích. */
  async function analyzeDirectory(dirHandle, { includeVendor = false, onCount } = {}) {
    const source = await createSourceFromDirectory(dirHandle, { onCount })
    const rootName = source.rootName
    current = { source, options: { rootName, stripRootFolder: false } }
    return { count: source.size, started: source.size > 0 && load({ includeVendor }), rootName }
  }

  /** @param {FileList|File[]} fileList */
  function analyzeFileList(fileList, { includeVendor = false } = {}) {
    const source = createSourceFromFileList(fileList)
    const rootName = source.rootName
    current = { source, options: { rootName, stripRootFolder: false } }
    return { count: source.size, started: source.size > 0 && load({ includeVendor }), rootName }
  }

  const reload = (options) => load(options)
  const hasSource = () => !!current

  /** Nguồn file của thư mục đang mở (core/source.js) — null nếu chưa mở thư mục nào. */
  const getSource = () => current?.source ?? null

  function show(view, { relayout = false } = {}) { if (worker) send({ type: 'show', view, relayout }) }

  function stop(view) { if (worker) send({ type: 'stop', view }) }

  /** Quan hệ của một file. KHÔNG dùng send() (nó tăng `job`). Trả về null nếu chưa có Worker / Worker bị thay giữa chừng. */
  function related(path) {
    if (!worker) return Promise.resolve(null)
    return new Promise((resolve) => {
      const requestId = ++relatedSeq
      relatedPending.set(requestId, resolve)
      worker.postMessage({ type: 'related', requestId, path })
    })
  }

  /**
   * Tìm symbol + nội dung trong Worker. KHÔNG dùng send() (nó tăng `job`, làm bố cục đang chạy bị coi là cũ).
   * @returns {() => void} huỷ lần tìm này
   */
  function search({ query, exts = [], symbols = true, content = true }, handlers = {}) {
    if (!worker) return () => {}
    const searchId = ++searchSeq
    searchHandler = { searchId, ...handlers }
    worker.postMessage({ type: 'search', searchId, query, exts, symbols, content })
    return () => {
      if (searchHandler?.searchId !== searchId) return
      searchHandler = null
      worker?.postMessage({ type: 'search-cancel', searchId })
    }
  }

  function dispose() {
    worker?.terminate()
    worker = null
  }

  if (getCurrentInstance()) onBeforeUnmount(dispose) // gọi trong Pinia store thì không có component để gắn

  return { analyzeDirectory, analyzeFileList, reload, hasSource, getSource, show, stop, search, related, dispose }
}
