// stores/settings.js — Tuỳ chọn của người dùng (và phần được lưu vào localStorage).

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SHAPES } from '../analyzer/node-shapes'
import { DEFAULT_SHAPES, SHAPE_KEY } from '../features/graph/constants'

function loadShapes() {
  try {
    const saved = JSON.parse(localStorage.getItem(SHAPE_KEY) || '{}')
    const valid = Object.fromEntries(Object.entries(saved).filter(([k, v]) => k in DEFAULT_SHAPES && v in SHAPES))
    return { ...DEFAULT_SHAPES, ...valid }
  } catch {
    return { ...DEFAULT_SHAPES }
  }
}

export const useSettingsStore = defineStore('settings', () => {
  /** "Gồm thư viện & mã sinh tự động" */
  const includeVendor = ref(false)
  /** Hình dạng node theo loại */
  const shapes = ref(loadShapes())

  /** Chỉ lưu tuỳ chọn; việc cập nhật node đang vẽ do stores/graph.js làm. */
  function setShape(kind, shape) {
    shapes.value = { ...shapes.value, [kind]: shape }
   // try { localStorage.setItem(SHAPE_KEY, JSON.stringify(shapes.value)) } catch { /* bỏ qua */ }
  }

  return { includeVendor, shapes, setShape }
})
