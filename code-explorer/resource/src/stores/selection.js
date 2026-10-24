// stores/selection.js — "Đang chọn gì": nguồn sự thật DUY NHẤT cho cả ba phần của ứng dụng.
//
//   Sơ đồ file (mind-map)      → ghi vào đây khi bấm node
//   Editor / Explorer (code-viewer) → đọc filePath để mở file; ghi vào khi chọn trong danh sách / kết quả tìm kiếm
//   Sơ đồ class (class-diagram) → đọc filePath (sau này: danh sách file) để biết cần vẽ class của file nào
//
// Ghi: sơ đồ file (M0). Đọc: editor (M2, features/editor). Sẽ thêm: tìm kiếm (M3), dòng cần nhảy tới (M3/M4), sơ đồ class (M5).
// filePath dùng cùng quy ước path với analyzer (node.file) — M1 sẽ gom quy ước này vào core/path.js.

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSelectionStore = defineStore('selection', () => {
  const nodeId = ref(null) // id node đang chọn trên sơ đồ file
  const filePath = ref(null) // đường dẫn file tương ứng (null nếu node không phải file, vd. endpoint)
  /** Tăng mỗi lần select() — để biết "vừa chọn lại" ngay cả khi chọn đúng node đang chọn (mở lại editor đã đóng). */
  const line = ref(null) // dòng cần nhảy tới trong editor (từ kết quả tìm kiếm / symbol); null = không
  const query = ref('') // từ khoá cần tô sáng trong editor; '' = không
  const tick = ref(0)

  function select({ nodeId: id = null, filePath: path = null, line: ln = null, query: q = '' } = {}) {
    nodeId.value = id
    filePath.value = path
    line.value = ln
    query.value = q
    tick.value++
  }

  function clear() {
    nodeId.value = null
    filePath.value = null
    line.value = null
    query.value = ''
  }

  return { nodeId, filePath, line, query, tick, select, clear }
})
