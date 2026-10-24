// core/source.js — Nguồn file của thư mục đang mở, dùng trên LUỒNG CHÍNH.
//
// Giữ handle / File (gần như không tốn bộ nhớ) và đọc nội dung THEO YÊU CẦU: editor, tìm kiếm và sơ đồ class
// gọi source.read(path) khi cần, không nạp cả dự án vào RAM. Worker phân tích nhận cùng danh sách entry
// (workerEntries) nên đường dẫn của hai bên luôn khớp: đây là nơi DUY NHẤT quyết định path (core/path.js).
//
//   const source = await createSourceFromDirectory(dirHandle, { onCount })   // Chrome / Edge
//   const source = createSourceFromFileList(input.files)                      // Firefox / Safari
//   source.has(path) · source.paths() · await source.stat(path) · await source.read(path)
//
// read() ném SourceError với .code: 'not-found' | 'binary' | 'too-large' | 'read-error'.

import { normalizePath, extname, basename, commonRoot } from './path.js'
import { BINARY_EXTENSIONS, DEFAULT_IGNORED_DIRS, createIgnoredDirSet, isIgnoredDir } from './ignore-rules.js'

/** Giới hạn khi XEM một file trong editor (khi phân tích, giới hạn nhỏ hơn: MAX_ANALYZE_SIZE). */
export const MAX_VIEW_SIZE = 3 * 1024 * 1024

export class SourceError extends Error {
  constructor(code, path, message, extra = {}) {
    super(message ?? `${code}: ${path}`)
    this.name = 'SourceError'
    this.code = code
    this.path = path
    Object.assign(this, extra)
  }
}

/**
 * @param {FileList|File[]|{path: string, file?: File, handle?: FileSystemFileHandle}[]} input
 * @param {{ rootName?: string, stripRootFolder?: boolean }} options
 *   stripRootFolder: bỏ tên thư mục gốc khỏi đầu path. Mặc định tự bật khi input là File của
 *   <input webkitdirectory> (webkitRelativePath luôn bắt đầu bằng tên thư mục được chọn).
 */
export function createSource(input, options = {}) {
  let fromWebkit = false
  const raw = Array.from(input ?? []).map((item) => {
    if (typeof File !== 'undefined' && item instanceof File) {
      if (item.webkitRelativePath) fromWebkit = true
      return { path: normalizePath(item.webkitRelativePath || item.name), file: item, handle: null }
    }
    return { path: normalizePath(item.path), file: item.file ?? null, handle: item.handle ?? null }
  })

  let rootName = options.rootName ?? ''
  if (options.stripRootFolder ?? fromWebkit) {
    const root = commonRoot(raw.map((e) => e.path))
    if (root) {
      rootName ||= root
      for (const e of raw) e.path = e.path.slice(root.length + 1)
    }
  }

  const entries = new Map()
  for (const e of raw) if (e.path) entries.set(e.path, e)

  async function getFile(path) {
    const e = entries.get(path)
    if (!e) throw new SourceError('not-found', path)
    try {
      return e.file ?? (await e.handle.getFile())
    } catch (err) {
      throw new SourceError('read-error', path, `Không đọc được ${path}: ${err.message}`)
    }
  }

  return {
    rootName,
    get size() { return entries.size },
    has: (path) => entries.has(path),
    paths: () => [...entries.keys()],

    /** Danh sách entry (đã chuẩn hoá path) để gửi sang Worker phân tích. */
    workerEntries: () => [...entries.values()].map(({ path, file, handle }) => (handle ? { path, handle } : { path, file })),

    getFile,

    async stat(path) {
      const file = await getFile(path)
      return { path, name: basename(path), ext: extname(path), size: file.size, lastModified: file.lastModified }
    },

    /** Đọc nội dung văn bản (giữ NGUYÊN bản gốc, kể cả kiểu xuống dòng). */
    async read(path, { maxSize = MAX_VIEW_SIZE } = {}) {
      if (BINARY_EXTENSIONS.has(extname(path))) throw new SourceError('binary', path)
      const file = await getFile(path)
      if (file.size > maxSize) {
        throw new SourceError('too-large', path, `${path} lớn hơn giới hạn ${maxSize} byte`, { size: file.size, maxSize })
      }
      let text
      try {
        text = await file.text()
      } catch (err) {
        throw new SourceError('read-error', path, `Không đọc được ${path}: ${err.message}`)
      }
      if (text.slice(0, 8000).includes('\u0000')) throw new SourceError('binary', path) // file nhị phân đuôi lạ
      return text
    },
  }
}

/**
 * Duyệt thư mục bằng File System Access API (showDirectoryPicker) trên luồng chính.
 * Chỉ thu thập handle, bỏ qua node_modules, .git, file nhị phân… NGAY khi duyệt.
 * onCount(số file đã thấy) để hiện tiến độ.
 */
export async function listDirectoryHandle(dirHandle, { ignoredDirs = DEFAULT_IGNORED_DIRS, onCount } = {}) {
  const ignoredSet = createIgnoredDirSet(ignoredDirs)
  const out = []
  async function walk(handle, prefix) {
    for await (const child of handle.values()) {
      const p = prefix ? `${prefix}/${child.name}` : child.name
      if (child.kind === 'directory') {
        if (!isIgnoredDir(child.name, ignoredSet)) await walk(child, p)
      } else if (!BINARY_EXTENSIONS.has(extname(child.name))) {
        out.push({ path: p, handle: child })
        if (out.length % 200 === 0) onCount?.(out.length)
      }
    }
  }
  await walk(dirHandle, '')
  onCount?.(out.length)
  return out
}

export async function createSourceFromDirectory(dirHandle, { ignoredDirs, onCount } = {}) {
  const entries = await listDirectoryHandle(dirHandle, { ignoredDirs, onCount })
  return createSource(entries, { rootName: dirHandle.name, stripRootFolder: false })
}

/** @param {FileList|File[]} files — từ <input type="file" webkitdirectory> */
export function createSourceFromFileList(files) {
  return createSource(files, { stripRootFolder: true })
}
