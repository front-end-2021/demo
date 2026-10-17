// useAnalyzer.js — Composable Vue 3: cầu nối giữa giao diện và analyzer.worker.js.
//
//   const analyzer = useAnalyzer({ onMessage, onError })
//   await analyzer.analyzeDirectory(dirHandle, { includeVendor, onCount })   // showDirectoryPicker (Chrome/Edge)
//   analyzer.analyzeFileList(input.files, { includeVendor })                 // <input webkitdirectory> (Firefox/Safari)
//   analyzer.reload({ includeVendor })    // phân tích lại thư mục đang mở (khi đổi tuỳ chọn)
//   analyzer.show(view, { relayout })     // mở tổng quan / một project
//   analyzer.stop(view)                   // dừng sắp xếp, giữ bố cục hiện tại
//
// onMessage(data) chỉ nhận message của yêu cầu MỚI NHẤT (message của job cũ bị bỏ qua).
// data.type: 'progress' | 'loaded' | 'graph' | 'positions' | 'layout-done' | 'error'

import { onBeforeUnmount } from 'vue'
import { entriesFromDirectoryHandle } from './01-collect-files.js'

export { OVERVIEW } from './08-view-model.js'

export function useAnalyzer({ onMessage, onError } = {}) {
  let worker = null
  let job = 0
  let source = null // { entries, options } của thư mục đang mở — để phân tích lại khi đổi tuỳ chọn

  function send(message) {
    job++
    worker.postMessage({ ...message, job })
  }

  function startWorker() {
    worker?.terminate() // giải phóng toàn bộ bộ nhớ của lần mở trước
    worker = new Worker(new URL('./analyzer.worker.js', import.meta.url), { type: 'module' })
    worker.onmessage = ({ data }) => {
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
    if (!source) return false
    startWorker()
    send({ type: 'load', entries: source.entries, options: { ...source.options, includeVendor } })
    return true
  }

  /** Duyệt thư mục trên luồng chính (chỉ lấy handle, rất nhẹ), rồi giao cho Worker đọc & phân tích. */
  async function analyzeDirectory(dirHandle, { includeVendor = false, onCount } = {}) {
    const entries = await entriesFromDirectoryHandle(dirHandle, { onCount })
    source = { entries, options: { rootName: dirHandle.name, stripRootFolder: false } }
    //console.log('folder Source: ', source)
    return { count: entries.length, started: entries.length > 0 && load({ includeVendor }) }
  }

  /** @param {FileList|File[]} fileList */
  function analyzeFileList(fileList, { includeVendor = false } = {}) {
    const entries = Array.from(fileList).map((f) => ({ file: f, path: f.webkitRelativePath || f.name }))
    source = { entries, options: { stripRootFolder: true } }
    //console.log('File List Source: ', source)
    return { count: entries.length, started: entries.length > 0 && load({ includeVendor }) }
  }

  const reload = (options) => load(options)
  const hasSource = () => !!source

  function show(view, { relayout = false } = {}) {
    if (worker) send({ type: 'show', view, relayout })
  }

  function stop(view) {
    if (worker) send({ type: 'stop', view })
  }

  function dispose() {
    worker?.terminate()
    worker = null
  }

  onBeforeUnmount(dispose)

  return { analyzeDirectory, analyzeFileList, reload, hasSource, show, stop, dispose }
}
