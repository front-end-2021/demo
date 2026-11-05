// features/editor/panel-width.js — Giới hạn độ rộng các panel hai bên sơ đồ (Explorer bên trái, Editor bên phải).
// Sơ đồ luôn được chừa tối thiểu GRAPH_MIN_WIDTH (Sigma ném lỗi nếu vùng vẽ rộng 0).

export const EDITOR_MIN_WIDTH = 320
export const EDITOR_DEFAULT_WIDTH = 560
export const EXPLORER_MIN_WIDTH = 220
export const EXPLORER_DEFAULT_WIDTH = 300
export const GRAPH_MIN_WIDTH = 280

function clamp(width, containerWidth, otherWidth, min, fallback) {
  const max = Math.max(min, containerWidth - otherWidth - GRAPH_MIN_WIDTH)
  const w = Number.isFinite(width) ? width : fallback
  return Math.round(Math.min(max, Math.max(min, w)))
}

/** @param {number} width mong muốn  @param {number} containerWidth rộng cả vùng chứa  @param {number} otherWidth rộng panel bên kia đang mở (0 nếu đóng) */
export const clampEditorWidth = (width, containerWidth, otherWidth = 0) =>
  clamp(width, containerWidth, otherWidth, EDITOR_MIN_WIDTH, EDITOR_DEFAULT_WIDTH)

export const clampExplorerWidth = (width, containerWidth, otherWidth = 0) =>
  clamp(width, containerWidth, otherWidth, EXPLORER_MIN_WIDTH, EXPLORER_DEFAULT_WIDTH)
