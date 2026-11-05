// 01-collect-files.js — Bước 1 + 2: lọc file theo đường dẫn, rồi đọc metadata. (Chạy trong Worker.)
//
// ĐẦU VÀO (một trong hai):
//   - FileList từ <input type="file" webkitdirectory>
//   - mảng { path, file?: File, handle?: FileSystemFileHandle } (từ core/source.js → workerEntries())
//     -> handle được gửi thẳng vào Worker; Worker chỉ gọi getFile() cho file vượt qua bộ lọc
// ĐẦU RA:
//   { rootName, files: Map<path, SourceFile>, skipped: [{ path, reason, size }] }
//   reason: 'ignored-dir' | 'binary' | 'generated' | 'vendor' | 'too-large' | 'gitignore' | 'error'
//
// SourceFile = { path, name, ext, size, file, text }
//   text = null lúc đầu; chỉ đọc khi cần (readText) và giữ NGUYÊN văn bản gốc.
//
// Quy tắc lọc nằm ở core/ignore-rules.js, quy ước path ở core/path.js (dùng chung với editor / tìm kiếm).

import ignore from 'ignore'
import { normalizePath, extname, commonRoot } from '../core/path.js'
import { DEFAULT_IGNORED_DIRS, MAX_ANALYZE_SIZE, createPathClassifier } from '../core/ignore-rules.js'

// Tên cũ vẫn được export từ đây cho các module analyzer đang import (04-pass1-index.js…)
export { DEFAULT_IGNORED_DIRS, BINARY_EXTENSIONS, classifyVendorPath, isVendorText } from '../core/ignore-rules.js'

/**
 * @param {FileList|File[]|{path: string, file?: File, handle?: FileSystemFileHandle}[]} input
 * @param {{ maxFileSize?: number, ignoredDirs?: string[], useGitignore?: boolean,
 *           includeVendor?: boolean, stripRootFolder?: boolean, rootName?: string, onProgress?: Function }} options
 */
export async function collectFiles(input, options = {}) {
  const {
    maxFileSize = MAX_ANALYZE_SIZE, ignoredDirs = DEFAULT_IGNORED_DIRS, useGitignore = true,
    includeVendor = false, onProgress = () => {},
  } = options
  const { entries, fromWebkit } = normalizeInput(input)

  // webkitRelativePath luôn bắt đầu bằng tên thư mục được chọn -> bỏ đi
  // (useAnalyzer đã gỡ sẵn ở luồng chính nên thường không còn gì để gỡ; giữ lại cho nơi khác gọi trực tiếp)
  let rootName = options.rootName ?? ''
  if (options.stripRootFolder ?? fromWebkit) {
    const r = commonRoot(entries.map((e) => e.path))
    if (r) {
      rootName ||= r
      for (const e of entries) e.path = e.path.slice(r.length + 1)
    }
  }

  let ig = null
  if (useGitignore) {
    const gi = entries.find((e) => e.path === '.gitignore')
    if (gi) {
      try { ig = ignore().add(await (await fileOf(gi)).text()) } catch { ig = null }
    }
  }

  const classify = createPathClassifier({ ignoredDirs, includeVendor, isGitignored: ig ? (p) => safeIgnores(ig, p) : null })

  const files = new Map()
  const skipped = []
  const accepted = []
  for (const e of entries) {
    if (!e.path) continue
    const reason = classify(e.path)
    if (reason) skipped.push({ path: e.path, reason, size: e.file?.size ?? null })
    else accepted.push(e)
  }

  // Chỉ gọi getFile() cho file đã qua bộ lọc đường dẫn, theo từng lô
  for (let i = 0; i < accepted.length; i += 32) {
    await Promise.all(accepted.slice(i, i + 32).map(async (e) => {
      try {
        const file = await fileOf(e)
        if (file.size > maxFileSize) return skipped.push({ path: e.path, reason: 'too-large', size: file.size })
        const segs = e.path.split('/')
        files.set(e.path, { path: e.path, name: segs[segs.length - 1], ext: extname(e.path), size: file.size, file, text: null })
      } catch (err) {
        skipped.push({ path: e.path, reason: 'error', size: null })
        console.warn('Không đọc được', e.path, err)
      }
    }))
    onProgress({ stage: 'collect', done: Math.min(i + 32, accepted.length), total: accepted.length })
  }
  // Thứ tự ổn định giữa các lần chạy
  const sorted = new Map([...files.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)))
  return { rootName, files: sorted, skipped }
}

/** Đọc nội dung (có cache trong sf.text). Văn bản trả về là bản GỐC. */
export async function readText(sf) {
  if (sf.text == null) sf.text = await sf.file.text()
  return sf.text
}

// ---------------------------------------------------------------------------
function normalizeInput(input) {
  let fromWebkit = false
  const entries = Array.from(input ?? []).map((item) => {
    if (typeof File !== 'undefined' && item instanceof File) {
      if (item.webkitRelativePath) fromWebkit = true
      return { file: item, path: normalizePath(item.webkitRelativePath || item.name) }
    }
    return { file: item.file ?? null, handle: item.handle ?? null, path: normalizePath(item.path) }
  })
  return { entries, fromWebkit }
}

const fileOf = async (e) => e.file ?? (await e.handle.getFile())

function safeIgnores(ig, path) {
  try { return ig.ignores(path) } catch { return false }
}
