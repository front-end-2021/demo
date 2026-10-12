const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** '2026-11-13' -> '13 Nov' */
export function formatDay(iso) {
  if (!iso) return '—'
  const [, m, d] = iso.split('-').map(Number)
  if (!m || !d) return '—'
  return `${d} ${MONTHS[m - 1]}`
}

/** timestamp -> '10 Nov' */
export function formatTs(ts) {
  const d = new Date(ts)
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

/** timestamp -> '9 Oct 2026, 14:32' */
export function formatDateTime(ts) {
  const d = new Date(ts)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`
}

/** timestamp -> '2 hours ago' */
export function relativeTime(ts, now = Date.now()) {
  const s = Math.max(0, Math.round((now - ts) / 1000))
  if (s < 45) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`
  const d = Math.round(h / 24)
  return `${d} day${d === 1 ? '' : 's'} ago`
}

/** Gần đây → '2 hours ago'; cũ hơn 30 ngày → '10 Nov 2025' */
export function formatAgo(ts, now = Date.now()) {
  if (now - ts <= 30 * 24 * 3600 * 1000) return relativeTime(ts, now)
  const d = new Date(ts)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/** 'Samantha William' -> 'Samantha W' */
export function shortName(name) {
  const p = (name || '').trim().split(/\s+/).filter(Boolean)
  if (p.length < 2) return p[0] || ''
  return `${p[0]} ${p[p.length - 1][0]}`
}

/** 'Samantha William' -> 'SW' */
export function initials(name) {
  const p = (name || '').trim().split(/\s+/).filter(Boolean)
  if (!p.length) return '?'
  if (p.length === 1) return p[0][0].toUpperCase()
  return (p[0][0] + p[p.length - 1][0]).toUpperCase()
}

export function formatSize(bytes) {
  if (!bytes) return '0 KB'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export function fileKind(name = '') {
  const ext = name.split('.').pop().toLowerCase()
  if (ext === 'pdf') return 'pdf'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'xls'
  return 'file'
}
