// stores/layout.js — Bố cục giao diện: Explorer bên trái, sơ đồ ở giữa, editor bên phải.
//
// Editor tự mở khi người dùng CHỌN một file (selection.tick tăng; chọn lại đúng file đang chọn cũng mở lại),
// đóng bằng nút ✕ / nút "Mã nguồn", và tự đóng khi mở thư mục khác.
// Explorer mở sẵn; độ rộng cả hai panel được nhớ (localStorage).

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useSelectionStore } from './selection'
import { useWorkspaceStore } from './workspace'
import {
  clampEditorWidth, clampExplorerWidth, EDITOR_DEFAULT_WIDTH, EXPLORER_DEFAULT_WIDTH,
} from '../features/editor/panel-width'
import { ViewType } from '../utils/viewType'

const EDITOR_WIDTH_KEY = 'code-explorer.editorWidth'
const EXPLORER_WIDTH_KEY = 'code-explorer.explorerWidth'

function loadWidth(key, clamp, fallback) {
  try {
    const n = Number(localStorage.getItem(key))
    return n > 0 ? clamp(n, window.innerWidth) : fallback
  } catch {
    return fallback
  }
}

const saveWidth = (key, value) => {
 // try { localStorage.setItem(key, String(value)) } catch { /* bỏ qua */ }
}

export const useLayoutStore = defineStore('layout', () => {
  const selection = useSelectionStore()
  const workspace = useWorkspaceStore()

  const editorOpen = ref(false)
  const editorWidth = ref(loadWidth(EDITOR_WIDTH_KEY, clampEditorWidth, EDITOR_DEFAULT_WIDTH))
  const explorerOpen = ref(true)
  const explorerWidth = ref(loadWidth(EXPLORER_WIDTH_KEY, clampExplorerWidth, EXPLORER_DEFAULT_WIDTH))
  /** Chỉ ảnh hưởng cách HIỂN THỊ (stripComments), không đổi file. */
  const hideComments = ref(false)
  /** Tab ở giữa: 'graph' = sơ đồ file (mind-map), 'class' = sơ đồ class của các file đang chọn. */
  const centerTab = ref(ViewType.graph)

  watch(() => selection.tick, () => {
    if (selection.filePath) editorOpen.value = true
  })

  // Mở thư mục khác (hoặc phân tích lại) → bỏ file của lần trước
  watch(() => workspace.hasData, (has) => {
    if (!has) editorOpen.value = false
  })

  const toggleEditor = () => { editorOpen.value = !editorOpen.value }
  const toggleExplorer = () => { explorerOpen.value = !explorerOpen.value }

  /** Độ rộng bên kia được tính vào để sơ đồ luôn còn chỗ. */
  function setEditorWidth(width, containerWidth = window.innerWidth) {
    editorWidth.value = clampEditorWidth(width, containerWidth, explorerOpen.value ? explorerWidth.value : 0)
    saveWidth(EDITOR_WIDTH_KEY, editorWidth.value)
  }

  function setExplorerWidth(width, containerWidth = window.innerWidth) {
    explorerWidth.value = clampExplorerWidth(width, containerWidth, editorOpen.value ? editorWidth.value : 0)
    saveWidth(EXPLORER_WIDTH_KEY, explorerWidth.value)
  }

  return {
    editorOpen, editorWidth, explorerOpen, explorerWidth, hideComments, centerTab,
    toggleEditor, toggleExplorer, setEditorWidth, setExplorerWidth,
  }
})
