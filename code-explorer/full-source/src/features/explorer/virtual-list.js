// features/explorer/virtual-list.js — Tính các hàng đang nhìn thấy cho danh sách cuộn dài (hàng chục nghìn file).
// Mỗi hàng có chiều cao riêng (tiêu đề mục, hàng file, hàng kết quả có đoạn trích); chỉ dựng phần DOM nhìn thấy.

/** offsets[i] = vị trí đầu hàng i; offsets[n] = tổng chiều cao. */
export function buildOffsets(heights) {
  const offsets = new Float64Array(heights.length + 1)
  for (let i = 0; i < heights.length; i++) offsets[i + 1] = offsets[i] + heights[i]
  return offsets
}

/** Hàng chứa vị trí y (tìm nhị phân), giới hạn trong [0, n-1]. */
export function indexAt(offsets, y) {
  const n = offsets.length - 1
  if (n <= 0) return 0
  let lo = 0
  let hi = n - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (offsets[mid] <= y) lo = mid
    else hi = mid - 1
  }
  return lo
}

/** @returns {{ start: number, end: number }} dải hàng cần dựng, end không gồm; thêm `overscan` hàng mỗi phía. */
export function visibleRange(offsets, scrollTop, viewport, overscan = 4) {
  const n = offsets.length - 1
  if (n <= 0) return { start: 0, end: 0 }
  const start = Math.max(0, indexAt(offsets, scrollTop) - overscan)
  const end = Math.min(n, indexAt(offsets, scrollTop + viewport) + 1 + overscan)
  return { start, end }
}

/** scrollTop mới để hàng `index` nằm trọn trong khung nhìn (giữ nguyên nếu đã nhìn thấy). */
export function scrollToReveal(offsets, index, scrollTop, viewport) {
  const top = offsets[index]
  const bottom = offsets[index + 1]
  if (top < scrollTop) return top
  if (bottom > scrollTop + viewport) return bottom - viewport
  return scrollTop
}
