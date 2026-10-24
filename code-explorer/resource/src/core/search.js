// core/search.js — Logic tìm kiếm THUẦN (không phụ thuộc Vue/DOM/Worker): chạy được trong Worker lẫn Node (có test).
//
//   rankPaths      tìm theo tên / đường dẫn file
//   findInText     tìm từ khoá trong một văn bản → số lần khớp, dòng đầu tiên, đoạn trích
//   searchContent  quét nội dung nhiều file theo lô, báo kết quả dần, huỷ được
//   matchSymbols   tìm theo tên symbol (class, hàm, component…)
//
// Mọi phép so khớp đều KHÔNG phân biệt hoa thường và là so khớp chuỗi con (không phải regex).

import { extname } from './path.js'

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function parseQuery(raw) {
  const text = String(raw ?? '').trim()
  const lower = text.toLowerCase()
  return { text, lower, tokens: lower.split(/\s+/).filter(Boolean) }
}

/** [[đuôi, số file]] giảm dần theo số file; file không có đuôi → đuôi ''. */
export function countByExt(paths) {
  const m = new Map()
  for (const p of paths) {
    const e = extname(p)
    m.set(e, (m.get(e) || 0) + 1)
  }
  return [...m].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
}

/** Chỉ số các file có đuôi nằm trong `exts` (rỗng/null = tất cả), giữ thứ tự gốc. */
export function filterByExt(paths, exts) {
  const out = []
  const all = !exts || !exts.size
  for (let i = 0; i < paths.length; i++) if (all || exts.has(extname(paths[i]))) out.push(i)
  return out
}

/**
 * Tìm file theo tên / đường dẫn: MỌI từ trong ô tìm phải có trong đường dẫn.
 * Điểm: 3 = tên file bắt đầu bằng từ đầu tiên · 2 = tên file chứa mọi từ · 1 = chỉ đường dẫn chứa.
 * @returns {{ indices: number[], total: number }} chỉ số trong `paths`, tốt nhất trước; cùng điểm giữ thứ tự gốc
 */
export function rankPaths(paths, query, { exts = null, limit = 500 } = {}) {
  const { tokens } = parseQuery(query)
  if (!tokens.length) return { indices: [], total: 0 }
  const scored = []
  for (let i = 0; i < paths.length; i++) {
    const p = paths[i]
    if (exts && exts.size && !exts.has(extname(p))) continue
    const lp = p.toLowerCase()
    if (!tokens.every((t) => lp.includes(t))) continue
    const name = lp.slice(lp.lastIndexOf('/') + 1)
    scored.push([name.startsWith(tokens[0]) ? 3 : tokens.every((t) => name.includes(t)) ? 2 : 1, i])
  }
  scored.sort((a, b) => b[0] - a[0] || a[1] - b[1])
  return { indices: scored.slice(0, limit).map((x) => x[1]), total: scored.length }
}

/**
 * Tìm `query` trong `text`.
 * @returns {null | { count: number, line: number, before: string, match: string, after: string }}
 *   line = dòng (từ 1) của lần khớp ĐẦU TIÊN; before/match/after = đoạn trích quanh lần khớp đó, đã cắt gọn.
 */
export function findInText(text, query, { maxCount = 1000, context = 24, maxLen = 160 } = {}) {
  const q = String(query ?? '')
  if (!q || !text) return null
  const lower = text.toLowerCase()
  const lq = q.toLowerCase()

  // toLowerCase() đổi độ dài với vài ký tự Unicode (vd. 'İ') → vị trí lệch; khi đó dùng regex trên bản gốc
  let next
  if (lower.length === text.length) {
    next = (from) => { const i = lower.indexOf(lq, from); return i < 0 ? null : [i, lq.length] }
  } else {
    const re = new RegExp(escapeRe(q), 'gi')
    next = (from) => { re.lastIndex = from; const m = re.exec(text); return m ? [m.index, m[0].length] : null }
  }

  const first = next(0)
  if (!first) return null
  let count = 0
  for (let m = first; m && count < maxCount; m = next(m[0] + Math.max(1, m[1]))) count++

  const [idx, len] = first
  let line = 1
  for (let p = 0; p < idx; p++) if (text.charCodeAt(p) === 10) line++

  const start = text.lastIndexOf('\n', idx) + 1
  let end = text.indexOf('\n', idx)
  if (end === -1) end = text.length
  const lineText = text.slice(start, end).replace(/\r$/, '')
  const lead = lineText.length - lineText.trimStart().length
  const col = idx - start
  const from = Math.max(lead, col - context) // giữ từ khoá trong vùng nhìn thấy
  let rest = lineText.slice(from).trimEnd()
  const ms = Math.max(0, col - from)
  if (rest.length > maxLen) rest = `${rest.slice(0, maxLen)}…`
  const ml = Math.max(0, Math.min(len, rest.length - ms))
  return {
    count,
    line,
    before: (from > lead ? '…' : '') + rest.slice(0, ms),
    match: rest.slice(ms, ms + ml),
    after: rest.slice(ms + ml),
  }
}

/**
 * Quét nội dung nhiều file theo lô, báo kết quả dần qua onBatch, dừng ngay khi isCancelled() trả về true.
 * @param {{ paths: string[], read: (path: string) => Promise<string|null>, query: string,
 *           isCancelled?: () => boolean, onBatch?: (p: { hits: object[], scanned: number, total: number, done: boolean, truncated: boolean }) => void,
 *           batchSize?: number, maxFiles?: number, maxCount?: number }} o
 *   read() trả null (hoặc ném lỗi) với file không đọc được / nhị phân → bỏ qua.
 */
export async function searchContent({ paths, read, query, isCancelled = () => false, onBatch = () => {}, batchSize = 32, maxFiles = 500, maxCount = 1000 }) {
  const total = paths.length
  let scanned = 0
  let found = 0
  let truncated = false
  let pending = []
  let lastEmit = 0
  const flush = (done) => {
    onBatch({ hits: pending, scanned, total, done, truncated })
    pending = []
    lastEmit = scanned
  }
  for (let i = 0; i < total && !truncated; i += batchSize) {
    if (isCancelled()) return { cancelled: true, scanned, total, truncated }
    const slice = paths.slice(i, i + batchSize)
    const texts = await Promise.all(slice.map((p) => Promise.resolve().then(() => read(p)).catch(() => null)))
    if (isCancelled()) return { cancelled: true, scanned, total, truncated }
    for (let k = 0; k < slice.length; k++) {
      scanned++
      if (truncated || texts[k] == null) continue
      const hit = findInText(texts[k], query, { maxCount })
      if (!hit) continue
      pending.push({ path: slice[k], ...hit })
      if (++found >= maxFiles) truncated = true
    }
    if (!truncated && (pending.length || scanned - lastEmit >= batchSize * 8)) flush(false)
  }
  flush(true)
  return { cancelled: false, scanned, total, truncated }
}

/**
 * Tìm symbol theo tên. entries: [{ name, lname (tên viết thường), kind, line, path }]
 * Điểm: 3 = trùng hẳn · 2 = bắt đầu bằng · 1 = chứa; cùng điểm: tên ngắn trước.
 * @returns {{ hits: { name, kind, line, path }[], total: number }}
 */
export function matchSymbols(entries, query, { limit = 200, exts = null } = {}) {
  const lq = String(query ?? '').trim().toLowerCase()
  if (!lq) return { hits: [], total: 0 }
  const scored = []
  for (const e of entries) {
    const i = e.lname.indexOf(lq)
    if (i < 0) continue
    if (exts && exts.size && !exts.has(extname(e.path))) continue
    scored.push([e.lname === lq ? 3 : i === 0 ? 2 : 1, e])
  }
  scored.sort((a, b) => b[0] - a[0] || a[1].name.length - b[1].name.length || (a[1].path < b[1].path ? -1 : a[1].path > b[1].path ? 1 : 0))
  return {
    hits: scored.slice(0, limit).map(([, e]) => ({ name: e.name, kind: e.kind, line: e.line, path: e.path })),
    total: scored.length,
  }
}
