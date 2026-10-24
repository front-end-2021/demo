// stores/diagram.js — Sơ đồ class của các file ĐANG CHỌN.
//
// Hai chế độ:
//   'follow' (mặc định): sơ đồ luôn vẽ file đang chọn (selection.filePath) nếu file đó có parser hỗ trợ.
//   'pinned'           : người dùng tự chọn tập file (nút "+ Thêm file đang chọn", hoặc Ctrl+bấm trong Explorer).
// File được đọc THEO YÊU CẦU qua workspace.readFile rồi parse ngay trên luồng chính (mỗi sơ đồ chỉ vài file).
// Vị trí các class được giữ trong phiên (theo id đầy đủ của class) để mở lại file thì sơ đồ về đúng chỗ cũ.

import { defineStore } from 'pinia'
import { computed, ref, shallowRef, watch } from 'vue'
import { useWorkspaceStore } from './workspace'
import { useSelectionStore } from './selection'
import { useLayoutStore } from './layout'
import { canDiagram, parseFiles } from '../features/diagram/parsers'
import { autoLayout, estimateSize, snap } from '../features/diagram/layout'
import { MAX_VIEW_SIZE, SourceError } from '../core/source'
import { ViewType } from '../utils/viewType'

/** Vượt ngưỡng này sơ đồ DOM + SVG sẽ chậm (đường nối A* tính lại mỗi khi kéo): chỉ vẽ phần đầu và báo người dùng. */
export const MAX_CLASSES = 60
const EMPTY = { types: [], relations: [], total: 0, unsupported: [] }

function describe(err) {
  if (err instanceof SourceError) {
    if (err.code === 'too-large') return 'file quá lớn'
    if (err.code === 'binary') return 'file nhị phân'
    if (err.code === 'not-found') return 'không tìm thấy file'
  }
  return err?.message ?? String(err)
}

export const useDiagramStore = defineStore('diagram', () => {
  const workspace = useWorkspaceStore()
  const selection = useSelectionStore()
  const layout = useLayoutStore()

  const mode = ref('follow')
  const files = ref([]) // đường dẫn các file trong sơ đồ (mảng được THAY MỚI mỗi lần đổi để watch nhận ra)
  const loading = ref(false)
  const problems = ref([]) // [{ path, message }] — file không đọc được
  const unsupportedSelection = ref('') // file đang chọn (chế độ follow) mà chưa có parser
  const parsed = shallowRef(EMPTY)
  const positions = ref({}) // { [classId]: { x, y } }
  const sizes = ref({}) // kích thước thật đo từ DOM: { [classId]: { w, h } }
  const selected = ref(null)

  const types = computed(() => parsed.value.types)
  const relations = computed(() => parsed.value.relations)
  const total = computed(() => parsed.value.total)
  const truncated = computed(() => parsed.value.total > parsed.value.types.length)
  const fileSet = computed(() => new Set(files.value))
  const model = computed(() => ({ types: types.value, relations: relations.value }))

  // ---------- chọn file ----------
  function follow() {
    const path = selection.filePath
    if (!path) return // bỏ chọn: giữ nguyên sơ đồ hiện tại
    if (canDiagram(path)) {
      unsupportedSelection.value = ''
      if (files.value.length !== 1 || files.value[0] !== path) files.value = [path]
    } else {
      unsupportedSelection.value = path
    }
  }
  watch(() => selection.tick, () => { if (mode.value === 'follow') follow() }, { immediate: true })

  function followSelection() {
    mode.value = 'follow'
    follow()
  }

  /** Thêm một file vào sơ đồ (chuyển sang chế độ pinned). Trả về true nếu file được hỗ trợ. */
  function add(path) {
    if (!canDiagram(path)) return false
    mode.value = 'pinned'
    if (!files.value.includes(path)) files.value = [...files.value, path]
    return true
  }

  function remove(path) {
    mode.value = 'pinned'
    files.value = files.value.filter((p) => p !== path)
  }

  /** Ctrl+bấm trong Explorer. Trả về false nếu file chưa có parser (để bên gọi mở file như thường). */
  function toggle(path) {
    if (!canDiagram(path)) return false
    if (files.value.includes(path)) remove(path)
    else add(path)
    return true
  }

  // ---------- đọc & parse ----------
  // Chỉ làm khi tab "Sơ đồ class" đang mở (bấm node ở tab sơ đồ file không tốn công đọc / parse), và không làm lại
  // khi tập file không đổi kể từ lần trước (mảng `files` được thay mới mỗi khi đổi).
  let seq = 0
  let loadedFor = null
  async function load() {
    if (layout.centerTab !== ViewType.clss || loadedFor === files.value) return
    const my = ++seq
    const list = files.value
    if (!list.length) {
      parsed.value = EMPTY
      problems.value = []
      loading.value = false
      loadedFor = list
      return
    }
    loading.value = true
    const results = await Promise.all(list.map(async (path) => {
      try {
        return { path, text: await workspace.readFile(path, { maxSize: MAX_VIEW_SIZE }) }
      } catch (err) {
        return { path, error: describe(err) }
      }
    }))
    if (my !== seq) return // đã đổi tập file trong lúc đọc
    problems.value = results.filter((r) => r.error != null).map((r) => ({ path: r.path, message: r.error }))
    let { types: all, relations: rels, unsupported } = parseFiles(results.filter((r) => r.text != null))
    const count = all.length
    if (count > MAX_CLASSES) {
      all = all.slice(0, MAX_CLASSES)
      const keep = new Set(all.map((t) => t.id))
      rels = rels.filter((r) => keep.has(r.from) && keep.has(r.to))
    }
    parsed.value = { types: all, relations: rels, total: count, unsupported }
    loading.value = false
    loadedFor = list
  }
  watch([files, () => layout.centerTab], load, { immediate: true })

  // ---------- kích thước & vị trí (từ class-diagram) ----------
  const sizeOf = (t) => sizes.value[t.id] ?? estimateSize(t)

  function setSize(id, w, h) {
    const cur = sizes.value[id]
    if (cur && cur.w === w && cur.h === h) return
    sizes.value = { ...sizes.value, [id]: { w, h } }
  }

  function moveTo(id, x, y) {
    const cur = positions.value[id]
    const nx = Math.max(20, snap(x))
    const ny = Math.max(20, snap(y))
    if (cur && cur.x === nx && cur.y === ny) return
    positions.value = { ...positions.value, [id]: { x: nx, y: ny } }
  }

  /** Xếp lại toàn bộ class theo tầng kế thừa. */
  function autoArrange(maxWidth) {
    positions.value = { ...positions.value, ...autoLayout(model.value, sizeOf, maxWidth ? { maxWidth } : undefined) }
  }

  /** Class mới xuất hiện (chưa có vị trí) được đặt bên dưới phần đã có. */
  function placeMissing() {
    const all = types.value
    const missing = all.filter((t) => !positions.value[t.id])
    if (!missing.length) return
    const layout = autoLayout(model.value, sizeOf)
    const next = { ...positions.value }
    if (missing.length === all.length) {
      for (const t of missing) next[t.id] = layout[t.id]
    } else {
      let bottom = 0
      for (const t of all) if (positions.value[t.id]) bottom = Math.max(bottom, positions.value[t.id].y + sizeOf(t).h)
      const top = Math.min(...missing.map((t) => layout[t.id].y))
      for (const t of missing) next[t.id] = { x: layout[t.id].x, y: snap(layout[t.id].y - top + bottom + 60) }
    }
    positions.value = next
  }
  watch(types, () => {
    placeMissing()
    if (selected.value && !types.value.some((t) => t.id === selected.value)) selected.value = null
  }, { immediate: true })

  const select = (id) => { selected.value = id }

  // Mở thư mục khác → bỏ hết
  watch(() => workspace.fileIndex, () => {
    mode.value = 'follow'
    files.value = []
    positions.value = {}
    sizes.value = {}
    selected.value = null
    unsupportedSelection.value = ''
  })

  return {
    mode, files, fileSet, loading, problems, unsupportedSelection, selected, positions, sizes,
    types, relations, total, truncated,
    sizeOf, setSize, moveTo, autoArrange, select, followSelection, add, remove, toggle,
  }
})
