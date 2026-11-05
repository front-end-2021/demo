// core/ignore-rules.js — MỘT bộ quy tắc "file nào đáng đọc" cho cả ứng dụng.
//
// Trước đây có hai bộ riêng (analyzer: danh sách đen + vendor + .gitignore; code-viewer: danh sách trắng
// đuôi file). Bộ của analyzer bao trùm bộ kia (mọi thư mục code-viewer bỏ qua đều là thư mục dấu chấm
// hoặc nằm trong DEFAULT_IGNORED_DIRS), nên được chọn làm bộ duy nhất. Đuôi lạ KHÔNG còn bị loại:
// editor hiển thị như văn bản thường.
//
// Module không phụ thuộc thư viện nào (kể cả `ignore`): việc khớp .gitignore do bên gọi cấp qua isGitignored.

import { extname } from './path.js'

/** Giới hạn khi PHÂN TÍCH một file (nhỏ hơn giới hạn khi XEM trong editor — xem MAX_VIEW_SIZE ở source.js). */
export const MAX_ANALYZE_SIZE = 3 * 1024 * 1024

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

/** Thư mục này có bị bỏ qua không? (mọi thư mục bắt đầu bằng dấu chấm + danh sách truyền vào) */
export const isIgnoredDir = (name, ignoredSet) => name.startsWith('.') || ignoredSet.has(name.toLowerCase())

/** Tập tên thư mục bỏ qua (viết thường) — tạo một lần rồi dùng lại cho cả lần duyệt. */
export const createIgnoredDirSet = (dirs = DEFAULT_IGNORED_DIRS) => new Set(dirs.map((d) => d.toLowerCase()))

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
 * Tạo hàm phân loại đường dẫn. Trả về lý do bỏ qua, hoặc null nếu file đáng đọc.
 * reason: 'ignored-dir' | 'binary' | 'generated' | 'vendor' | 'gitignore'
 * (Thứ tự kiểm tra là một phần của hợp đồng — giữ nguyên như bản gốc của analyzer.)
 *
 * @param {{ ignoredDirs?: string[], includeVendor?: boolean, isGitignored?: ((path: string) => boolean) | null }} options
 * @returns {(path: string) => string | null}
 */
export function createPathClassifier({ ignoredDirs = DEFAULT_IGNORED_DIRS, includeVendor = false, isGitignored = null } = {}) {
  const ignoredSet = createIgnoredDirSet(ignoredDirs)
  return (path) => {
    const segs = path.split('/')
    const name = segs[segs.length - 1]
    const ext = extname(path)
    if (segs.slice(0, -1).some((s) => isIgnoredDir(s, ignoredSet))) return 'ignored-dir'
    if (BINARY_EXTENSIONS.has(ext)) return 'binary'
    if (LOCK_FILES.has(name.toLowerCase()) || /\.min\.(js|css)$/i.test(name) || ext === '.map' || /\.d\.ts$/.test(name)) return 'generated'
    if (!includeVendor) {
      const vendor = classifyVendorPath(path)
      if (vendor) return vendor
      if (isGitignored?.(path)) return 'gitignore'
    }
    return null
  }
}
