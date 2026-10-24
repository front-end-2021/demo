// core/path.js — MỘT quy ước đường dẫn duy nhất cho cả ứng dụng.
//
// Quy ước: phân cách bằng "/", không bắt đầu bằng "/" hay "./", đã gỡ "..", và KHÔNG gồm tên thư mục gốc
// (src/App.vue, không phải myproject/src/App.vue). Analyzer, editor, tìm kiếm và sơ đồ class đều dùng
// đúng dạng này làm khoá — nên node.file khớp trực tiếp với source.read(path).

export function normalizePath(p) {
  const parts = []
  for (const seg of String(p ?? '').replace(/\\/g, '/').split('/')) {
    if (!seg || seg === '.') continue
    if (seg === '..') parts.pop()
    else parts.push(seg)
  }
  return parts.join('/')
}

export const dirname = (p) => { const i = p.lastIndexOf('/'); return i < 0 ? '' : p.slice(0, i) }
export const basename = (p) => { const i = p.lastIndexOf('/'); return i < 0 ? p : p.slice(i + 1) }

/** Đuôi file viết thường, gồm dấu chấm ('.vue'); '' nếu không có (kể cả file kiểu '.gitignore'). */
export function extname(p) {
  const b = basename(p)
  const i = b.lastIndexOf('.')
  return i <= 0 ? '' : b.slice(i).toLowerCase()
}

export function stripExt(name) {
  const i = name.lastIndexOf('.')
  return i <= 0 ? name : name.slice(0, i)
}

export const joinPath = (...parts) => normalizePath(parts.filter((x) => x != null && x !== '').join('/'))

/**
 * Tên thư mục gốc chung (đoạn đầu tiên) nếu MỌI path đều nằm trong nó, ngược lại ''.
 * <input webkitdirectory> luôn trả path bắt đầu bằng tên thư mục được chọn → cần gỡ đi.
 */
export function commonRoot(paths) {
  const first = paths[0]?.split('/')[0]
  if (!first) return ''
  return paths.every((p) => p.startsWith(first + '/')) ? first : ''
}
