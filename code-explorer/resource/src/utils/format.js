// Định dạng số theo kiểu Việt Nam (1.234)
export const fmt = (n) => Number(n || 0).toLocaleString('vi-VN')

/** 1536 → '1.5 KB' */
export function formatSize(bytes) {
  const n = Number(bytes) || 0
  if (n < 1024) return `${n} B`
  const units = ['KB', 'MB', 'GB']
  let v = n / 1024
  let i = 0
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++ }
  return `${parseFloat(v.toFixed(v >= 100 ? 0 : v >= 10 ? 1 : 2))} ${units[i]}`
}
