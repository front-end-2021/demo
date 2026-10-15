/**
 * Liệt kê và đọc file mã nguồn của dự án.
 *
 * Chia làm 2 phần để tiết kiệm bộ nhớ với dự án lớn:
 *  - Luồng chính chỉ LIỆT KÊ file (đường dẫn + handle/File, gần như không tốn bộ nhớ).
 *  - Web Worker tự ĐỌC từng file, bỏ thư viện / mã sinh tự động, xoá comment ngay và chỉ giữ bản đã làm sạch.
 *    → nội dung gốc không bao giờ bị giữ trọn trong bộ nhớ, cũng không bị sao chép giữa 2 luồng.
 */
import { stripComments } from './stripComments.js'

export const CODE_EXTS = ['cs', 'java', 'py', 'js', 'mjs', 'jsx', 'ts', 'tsx', 'vue', 'html', 'css']

// Luôn bỏ qua: thư mục build, gói cài đặt, công cụ (cùng mọi thư mục bắt đầu bằng dấu chấm: .git, .vs, .idea…)
const SKIP_FOLDERS = new Set(['node_modules', 'bin', 'obj', 'dist', 'build', 'out', 'target', 'venv', 'env', '__pycache__', 'coverage', 'packages', 'testresults'])
const MAX_FILE_SIZE = 1024 * 1024 // file > 1 MB gần như luôn là file sinh tự động / thư viện đã bundle

// Bỏ qua mặc định (có thể bật lại bằng ô "Gồm thư viện & mã sinh tự động")
const VENDOR_FOLDERS = new Set(['service references', 'connected services', 'web references', 'bower_components', 'jspm_packages', 'vendor', 'vendors', 'third-party', 'thirdparty'])
const VENDOR_ASSET_FOLDERS = new Set(['lib', 'libs']) // chỉ tính với .js / .css (wwwroot/lib, Scripts/lib…)
const GENERATED_NAME = /(\.designer\.cs|\.g\.cs|\.g\.i\.cs|\.generated\.cs|\.feature\.cs|^reference\.cs|^assemblyinfo\.cs|^temporarygeneratedfile_.*|\.intellisense\.js|-vsdoc\.js|\.debug\.js|\.min\.(js|css)|\.bundle\.js|\.d\.ts|\.chunk\.js)$/i
const VENDOR_NAME = /^(jquery|bootstrap|modernizr|respond|knockout|angular|kendo|moment|lodash|underscore|select2|datatables|d3|toastr|sweetalert2?|signalr|ckeditor|tinymce|highcharts|fullcalendar|popper|globalize|microsoftajax|microsoftmvc|backbone|handlebars|mustache|bluebird|axios|font-?awesome|normalize|summernote|dropzone|jstree|bootbox|daterangepicker|nprogress|hammer|leaflet|raphael|typeahead|bloodhound|icheck|isotope|fancybox|plupload|codemirror|html2canvas|jspdf|es5-shim|es6-shim|core-js)([.\-_\d]|$)/i // tên thư viện đặc trưng; thư viện khác được nhận diện qua banner bản quyền
// Đầu file thư viện thường có banner bản quyền: /*! jQuery v3… | (c) …  hoặc @license
// Khung UMD (chạy được cả CommonJS / AMD / global) — gần như chỉ thư viện phát hành mới dùng
const UMD_WRAPPER = /typeof\s+exports\s*===?\s*['"]object['"]\s*&&\s*typeof\s+module|typeof\s+define\s*===?\s*['"]function['"]\s*&&\s*define\.amd/
const LICENSE_BANNER = /\/\*!|@license|^\/\/!|\(c\)\s*(?:\d{4}|[a-z]).{0,80}\b(?:MIT|BSD|Apache|GPL)\b|Licensed under (?:the )?(?:MIT|BSD|Apache)/im

export const extOf = (name) => (name.includes('.') ? name.split('.').pop().toLowerCase() : '')
const isSkippedFolder = (name) => name.startsWith('.') || SKIP_FOLDERS.has(name.toLowerCase())
const isCodeFile = (name) => CODE_EXTS.includes(extOf(name))
// File đánh dấu thư mục gốc của một project
const PROJECT_MARKER = /\.(csproj|vbproj|fsproj|sqlproj)$|^(package\.json|pom\.xml|build\.gradle(\.kts)?|pyproject\.toml|setup\.py|go\.mod|cargo\.toml|composer\.json)$/i

/* ------------------------------ Luồng chính ------------------------------ */

/**
 * Duyệt FileSystemDirectoryHandle (Chrome / Edge).
 * → { items: [{ path, handle }], markers: [thư mục chứa file .csproj / package.json…] }. onCount(số file đã thấy).
 */
export async function listDirectory(dirHandle, onCount) {
  const items = []
  const markers = []
  async function walk(dir, prefix) {
    for await (const entry of dir.values()) {
      if (entry.kind === 'directory') {
        if (!isSkippedFolder(entry.name)) await walk(entry, `${prefix}${entry.name}/`)
      } else if (isCodeFile(entry.name)) {
        items.push({ path: prefix + entry.name, handle: entry })
        if (items.length % 200 === 0) onCount?.(items.length)
      } else if (PROJECT_MARKER.test(entry.name)) {
        markers.push(prefix)
      }
    }
  }
  await walk(dirHandle, `${dirHandle.name}/`)
  return { items, markers }
}

/** Danh sách File từ <input webkitdirectory> (Firefox, Safari) → { items: [{ path, file }], markers }. */
export function listFileList(fileList) {
  const items = []
  const markers = []
  for (const f of fileList) {
    const path = f.webkitRelativePath || f.name
    if (path.split('/').slice(0, -1).some(isSkippedFolder)) continue
    if (isCodeFile(f.name)) items.push({ path, file: f })
    else if (PROJECT_MARKER.test(f.name)) markers.push(path.slice(0, path.length - f.name.length))
  }
  return { items, markers }
}

/**
 * Tạo hàm path → project.
 * Project = thư mục chứa file đánh dấu (.csproj, package.json…) NGOÀI CÙNG bên dưới thư mục gốc
 * (lấy ngoài cùng để package.json nằm trong Scripts/ không tách project web làm đôi).
 * File không thuộc thư mục nào như vậy → project = thư mục cấp 1; file ở ngay thư mục gốc → "(thư mục gốc)".
 * Riêng khi thư mục gốc cũng là một project → các file đó thuộc luôn project gốc.
 * Id project là tiền tố đường dẫn, ví dụ "stratsigner/MarketingStrategy.BLL/".
 */
export function createProjectResolver(items, markers) {
  const root = items[0]?.path.split('/')[0] + '/'
  const roots = [...new Set(markers)].filter((m) => m !== root).sort((a, b) => a.length - b.length)
  // Thư mục được chọn tự nó là một project (vd. chọn riêng MarketingStrategy.BLL có .csproj ở gốc)
  // → file không thuộc project con nào đều thuộc project này, không tách theo thư mục con
  const rootIsProject = markers.includes(root)
  return (path) => {
    for (const r of roots) if (path.startsWith(r)) return r // roots sắp theo độ dài tăng dần → ngoài cùng trước
    const parts = path.split('/')
    return !rootIsProject && parts.length > 2 ? `${parts[0]}/${parts[1]}/` : root
  }
}

/** Tên hiển thị của project từ id. */
export const projectLabel = (id, root, rootIsProject = false) =>
  id === root && !rootIsProject ? '(thư mục gốc)' : id.split('/').filter(Boolean).pop()

/* -------------------------------- Worker -------------------------------- */

/** Phân loại theo đường dẫn: 'generated' | 'vendor' | null */
function classifyPath(path) {
  const parts = path.toLowerCase().split('/')
  const name = parts.pop()
  const ext = extOf(name)
  if (GENERATED_NAME.test(name)) return 'generated'
  if (parts.some((p) => VENDOR_FOLDERS.has(p))) return 'vendor'
  if (ext === 'js' || ext === 'css') {
    if (parts.some((p) => VENDOR_ASSET_FOLDERS.has(p))) return 'vendor'
    if (VENDOR_NAME.test(name)) return 'vendor'
  }
  return null
}

/**
 * Đọc + làm sạch file (chạy trong Worker). Trả về { files, skipped }.
 * Mỗi file chỉ giữ bản đã xoá comment; bản gốc được giải phóng ngay sau khi xử lý.
 */
export async function readSources(items, { includeVendor = false } = {}, onProgress) {
  const files = []
  const skipped = { vendor: 0, generated: 0, big: 0, error: 0 }
  let done = 0
  for (let i = 0; i < items.length; i += 16) {
    await Promise.all(items.slice(i, i + 16).map(async ({ path, handle, file }) => {
      try {
        const kind = includeVendor ? null : classifyPath(path)
        if (kind) { skipped[kind]++; return }
        const f = file || (await handle.getFile())
        if (f.size > MAX_FILE_SIZE) { skipped.big++; return }
        const ext = extOf(f.name)
        const raw = await f.text()
        if (!includeVendor && (ext === 'js' || ext === 'css')) {
          const head = raw.slice(0, 1500)
          if (LICENSE_BANNER.test(head) || (ext === 'js' && UMD_WRAPPER.test(head))) { skipped.vendor++; return }
        }
        files.push({ name: f.name, path, ext, content: stripComments(raw, ext) })
      } catch (err) {
        skipped.error++
        console.warn('Không đọc được', path, err)
      } finally {
        onProgress?.(++done, items.length)
      }
    }))
  }
  files.sort((a, b) => (a.path < b.path ? -1 : 1)) // thứ tự ổn định giữa các lần chạy
  return { files, skipped }
}
