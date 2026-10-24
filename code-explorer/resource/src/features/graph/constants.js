// features/graph/constants.js — Hằng số giao diện của sơ đồ: màu, nhãn, hình dạng mặc định.

// Loại node (theo file) — xem uiType() trong analyzer/08-view-model.js
export const KIND_COLORS = {
  component: '#10b981', module: '#eab308', backend: '#38bdf8', html: '#fb923c', css: '#2dd4bf',
  endpoint: '#ef4444', route: '#6366f1', external: '#94a3b8',
}
export const KIND_LABELS = {
  component: 'Component', module: 'JS / TS', backend: 'Back-end', html: 'HTML', css: 'CSS',
  endpoint: 'API endpoint', route: 'Route', external: 'Thư viện ngoài',
}
// Nhóm cạnh — xem EDGE_GROUPS trong analyzer/08-view-model.js
export const EDGE_COLORS = {
  use: '#cbd5e1', inherit: '#7dd3fc', inject: '#a78bfa', api: '#f87171', event: '#fdba74',
  route: '#a5b4fc', style: '#99f6e4', cross: '#c4b5fd',
}
export const EDGE_LABELS = {
  use: 'Import / dùng', inherit: 'Kế thừa', inject: 'Tiêm phụ thuộc', api: 'Gọi API',
  event: 'Sự kiện / emit', route: 'Route', style: 'CSS', cross: 'Sang project khác',
}
export const PROJECT_PALETTE = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#65a30d', '#ea580c', '#0d9488', '#9333ea', '#ca8a04']

/** Từ ngưỡng này: cạnh không có mũi tên, ẩn cạnh/nhãn khi kéo hoặc zoom. */
export const BIG = 5000

// Hình dạng node theo loại — người dùng chọn ở bảng chú thích, lưu lại cho lần sau.
// (Đổi khoá lưu khi đổi bộ mặc định, để lựa chọn đã lưu theo bộ cũ không che mất hình mới.)
export const SHAPE_KEY = 'code-mindmap.nodeShapes.v2'
export const DEFAULT_SHAPES = {
  component: 'circle', module: 'diamond', backend: 'square', html: 'triangle', css: 'ellipse',
  endpoint: 'square', route: 'pentagon', external: 'hexagon',
}

// Lọc node 3 trạng thái: all → no-isolated → isolated-only → all
export const VISIBILITY = {
  all: { next: 'no-isolated', showing: 'tất cả node', hide: () => false },
  'no-isolated': { next: 'isolated-only', showing: 'node có liên kết', hide: (a) => a.isolated },
  'isolated-only': { next: 'all', showing: 'node độc lập', hide: (a) => !a.isolated },
}
