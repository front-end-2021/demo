import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { parseCSharp } from '../utils/csharp'
import { autoLayout, estimateSize, snap } from '../utils/diagram'
import { SAMPLE_CSHARP } from '../data/sampleCSharp'

const KEY = 'taskflow.diagram.v1'
const PARSE_DELAY = 350 // chờ người dùng gõ xong rồi mới đọc lại mã nguồn

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (raw && typeof raw.source === 'string' && raw.positions && typeof raw.positions === 'object') return raw
  } catch {
    /* bỏ qua */
  }
  return null
}

export const useDiagramStore = defineStore('diagram', () => {
  const saved = load()

  const source = ref(saved?.source ?? SAMPLE_CSHARP) // mã nguồn đang soạn
  const parsedSource = ref(source.value) // bản đã được đọc (trễ vài trăm ms so với source)
  const positions = ref(saved?.positions ?? {}) // { [classId]: { x, y } }
  const sizes = ref({}) // kích thước thật đo từ DOM: { [classId]: { w, h } }
  const selected = ref(null)

  const model = computed(() => parseCSharp(parsedSource.value))
  const types = computed(() => model.value.types)
  const relations = computed(() => model.value.relations)

  let timer = null
  watch(source, (v) => {
    clearTimeout(timer)
    timer = setTimeout(() => (parsedSource.value = v), PARSE_DELAY)
  })

  // ---------- kích thước & vị trí ----------
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
    positions.value = autoLayout(model.value, sizeOf, maxWidth ? { maxWidth } : undefined)
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
  watch(types, placeMissing, { immediate: true })

  function select(id) {
    selected.value = id
  }

  function loadSample() {
    source.value = SAMPLE_CSHARP
    parsedSource.value = SAMPLE_CSHARP
    positions.value = {}
    selected.value = null
    placeMissing()
  }

  // ---------- lưu ----------
  let saveTimer = null
  watch(
    [source, positions],
    () => {
      clearTimeout(saveTimer)
      saveTimer = setTimeout(() => {
        try {
          localStorage.setItem(KEY, JSON.stringify({ source: source.value, positions: positions.value }))
        } catch {
          /* bỏ qua */
        }
      }, 250)
    },
    { deep: true },
  )

  return { source, positions, sizes, selected, model, types, relations, sizeOf, setSize, moveTo, autoArrange, select, loadSample }
})
