// 01-collect-files.js — Bước 1 + 2: quét thư mục, lọc, lưu vào Map.
//
// ĐẦU VÀO (một trong hai):
//   - FileList từ <input type="file" webkitdirectory>
//   - mảng { path, file?: File, handle?: FileSystemFileHandle } (từ entriesFromDirectoryHandle)
//     -> handle được gửi thẳng vào Worker; Worker chỉ gọi getFile() cho file vượt qua bộ lọc
// ĐẦU RA:
//   { rootName, files: Map<path, SourceFile>, skipped: [{ path, reason, size }] }
//   reason: 'ignored-dir' | 'binary' | 'generated' | 'vendor' | 'too-large' | 'gitignore' | 'error'
//
// SourceFile = { path, name, ext, size, file, text }
//   text = null lúc đầu; chỉ đọc khi cần (readText) và giữ NGUYÊN văn bản gốc.

import ignore from 'ignore'
import { normalizePath, extname } from './utils.js'

// Luôn bỏ qua (cùng mọi thư mục bắt đầu bằng dấu chấm: .git, .vs, .idea…)
export const DEFAULT_IGNORED_DIRS = [
  'node_modules', 'bin', 'obj', 'dist', 'build', 'out', 'target', 'coverage', 'testresults', 'packages',
  '__pycache__', 'venv', 'env', 'storybook-static',
]

export const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.bmp', '.svg', '.avif',
  '.pdf', '.zip', '.gz', '.tar', '.rar', '.7z', '.jar', '.war', '.class',
  '.dll', '.exe', '.so', '.dylib', '.pdb', '.nupkg', '.snk', '.pfx',
  '.woff', '.woff2', '.ttf', '.otf', '.eot',
  '.mp3', '.mp4', '.webm', '.mov', '.avi', '.wav', '.ogg',
  '.psd', '.ai', '.sketch', '.fig', '.db', '.sqlite', '.mdf', '.ldf', '.bin', '.dat', '.pyc', '.cache', '.suo',
])

const LOCK_FILES = new Set([
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'composer.lock', 'cargo.lock',
  'poetry.lock', 'pipfile.lock', 'gradle.lockfile', 'packages.lock.json',
])

// --- Thư viện & mã sinh tự động: bỏ qua mặc định, bật lại bằng includeVendor ---
const VENDOR_FOLDERS = new Set(['service references', 'connected services', 'web references', 'bower_components', 'jspm_packages', 'vendor', 'vendors', 'third-party', 'thirdparty'])
const VENDOR_ASSET_FOLDERS = new Set(['lib', 'libs']) // chỉ tính với .js / .css (wwwroot/lib, Scripts/lib…)
const GENERATED_NAME = /(\.designer\.cs|\.g\.cs|\.g\.i\.cs|\.generated\.cs|\.feature\.cs|^reference\.cs|^assemblyinfo\.cs|^temporarygeneratedfile_.*|\.intellisense\.js|-vsdoc\.js|\.debug\.js|\.bundle\.js|\.chunk\.js)$/i
const VENDOR_NAME = /^(jquery|bootstrap|modernizr|respond|knockout|angular|kendo|moment|lodash|underscore|select2|datatables|d3|toastr|sweetalert2?|signalr|ckeditor|tinymce|highcharts|fullcalendar|popper|globalize|microsoftajax|microsoftmvc|backbone|handlebars|mustache|bluebird|axios|font-?awesome|normalize|summernote|dropzone|jstree|bootbox|daterangepicker|nprogress|hammer|leaflet|raphael|typeahead|bloodhound|icheck|isotope|fancybox|plupload|codemirror|html2canvas|jspdf|es5-shim|es6-shim|core-js)([.\-_\d]|$)/i
// Đầu file thư viện thường có banner bản quyền hoặc khung UMD
const LICENSE_BANNER = /\/\*!|@license|^\/\/!|\(c\)\s*(?:\d{4}|[a-z]).{0,80}\b(?:MIT|BSD|Apache|GPL)\b|Licensed under (?:the )?(?:MIT|BSD|Apache)/im
const UMD_WRAPPER = /typeof\s+exports\s*===?\s*['"]object['"]\s*&&\s*typeof\s+module|typeof\s+define\s*===?\s*['"]function['"]\s*&&\s*define\.amd/

const isIgnoredDir = (name, ignoredSet) => name.startsWith('.') || ignoredSet.has(name.toLowerCase())

/** Phân loại theo đường dẫn: 'generated' | 'vendor' | null */
export function classifyVendorPath(path) {
  const parts = path.toLowerCase().split('/')
  const name = parts.pop()
  const ext = extname(name)
  if (GENERATED_NAME.test(name)) return 'generated'
  if (parts.some((p) => VENDOR_FOLDERS.has(p))) return 'vendor'
  if (ext === '.js' || ext === '.css') {
    if (parts.some((p) => VENDOR_ASSET_FOLDERS.has(p))) return 'vendor'
    if (VENDOR_NAME.test(name)) return 'vendor'
  }
  return null
}

/** Thư viện nhận ra qua nội dung (banner bản quyền, UMD). Gọi khi đã đọc file. */
export function isVendorText(ext, text) {
  if (ext !== '.js' && ext !== '.css') return false
  const head = text.slice(0, 1500)
  return LICENSE_BANNER.test(head) || (ext === '.js' && UMD_WRAPPER.test(head))
}

/**
 * @param {FileList|File[]|{path: string, file?: File, handle?: FileSystemFileHandle}[]} input
 * @param {{ maxFileSize?: number, ignoredDirs?: string[], useGitignore?: boolean,
 *           includeVendor?: boolean, stripRootFolder?: boolean, rootName?: string, onProgress?: Function }} options
 */
export async function collectFiles(input, options = {}) {
  const {
    maxFileSize = 1024 * 1024, ignoredDirs = DEFAULT_IGNORED_DIRS, useGitignore = true,
    includeVendor = false, onProgress = () => {},
  } = options
  const ignoredSet = new Set(ignoredDirs.map((d) => d.toLowerCase()))
  const { entries, fromWebkit } = normalizeInput(input)

  // webkitRelativePath luôn bắt đầu bằng tên thư mục được chọn -> bỏ đi
  let rootName = options.rootName ?? ''
  if (options.stripRootFolder ?? fromWebkit) {
    const r = commonRoot(entries)
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

  const files = new Map()
  const skipped = []
  const accepted = []
  for (const e of entries) {
    const { path } = e
    if (!path) continue
    const segs = path.split('/')
    const name = segs[segs.length - 1]
    const ext = extname(path)
    let reason = null
    if (segs.slice(0, -1).some((s) => isIgnoredDir(s, ignoredSet))) reason = 'ignored-dir'
    else if (BINARY_EXTENSIONS.has(ext)) reason = 'binary'
    else if (LOCK_FILES.has(name.toLowerCase()) || /\.min\.(js|css)$/i.test(name) || ext === '.map' || /\.d\.ts$/.test(name)) reason = 'generated'
    else if (!includeVendor) reason = classifyVendorPath(path)
    if (!reason && !includeVendor && ig && safeIgnores(ig, path)) reason = 'gitignore' // thêm kiểm tra vendor thì không cần ignore 
    if (reason) skipped.push({ path, reason, size: e.file?.size ?? null })
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
  //console.log(`Đọc xong các file`, files, 'vendor', includeVendor, 'skipped', skipped)
  return { rootName, files: sorted, skipped }
}

/** Đọc nội dung (có cache trong sf.text). Văn bản trả về là bản GỐC. */
export async function readText(sf) {
  if (sf.text == null) sf.text = await sf.file.text()
  return sf.text
}

/**
 * Duyệt thư mục bằng File System Access API (showDirectoryPicker) trên luồng chính.
 * Chỉ thu thập handle (gần như không tốn bộ nhớ), bỏ qua node_modules, .git... NGAY khi duyệt.
 * onCount(số file đã thấy) để hiện tiến độ.
 */
export async function entriesFromDirectoryHandle(dirHandle, { ignoredDirs = DEFAULT_IGNORED_DIRS, onCount } = {}) {
  const ignoredSet = new Set(ignoredDirs.map((d) => d.toLowerCase()))
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

function commonRoot(entries) {
  const first = entries[0]?.path.split('/')[0]
  if (!first) return ''
  return entries.every((e) => e.path.startsWith(first + '/')) ? first : ''
}

function safeIgnores(ig, path) {
  try { return ig.ignores(path) } catch { return false }
}
