<template>
  <!-- Dải quan hệ của file đang xem: Định nghĩa · Dùng · Được dùng bởi. Danh sách thả xuống phủ lên editor (không làm editor co giãn). -->
  <div v-if="data" ref="root" class="rel-bar">
    <div class="tabs">
      <button v-for="t in tabs" :key="t.id" class="tab" :class="{ on: openTab === t.id }" :disabled="!t.count" :title="t.title"
        @click="toggle(t.id)">{{ t.label }} <b>{{ t.count }}</b></button>
      <span v-if="data.externals.length" class="ext" :title="data.externals.join(', ')">+ {{ data.externals.length }} thư viện ngoài</span>
    </div>

    <div v-if="openTab" class="panel">
      <template v-if="openTab === 'defs'">
        <div v-for="s in data.symbols" :key="s.name + ':' + s.line" class="row" role="button" tabindex="0"
          @click="jumpHere(s.line, s.name)" @keydown.enter="jumpHere(s.line, s.name)">
          <span class="kind">{{ s.kind }}</span>
          <span class="name">{{ s.name }}</span>
          <span v-if="s.line" class="line">:{{ s.line }}</span>
        </div>
      </template>
      <template v-else>
        <div v-for="r in list" :key="r.path" class="row col" role="button" tabindex="0" :title="r.path"
          @click="openRelated(r)" @keydown.enter="openRelated(r)">
          <span class="line1">
            <span class="name">{{ basename(r.path) }}</span>
            <i v-for="k in r.kinds" :key="k" class="chip">{{ kindLabel(k) }}</i>
            <span v-if="r.confidence === 'inferred'" class="guess" title="Suy đoán (khớp theo tên / URL), không chắc chắn">≈</span>
            <span v-if="r.line" class="line">:{{ r.line }}</span>
          </span>
          <span class="dir">{{ dirname(r.path) || '/' }}</span>
          <span v-if="r.labels.length" class="labels">{{ r.labels.join(', ') }}</span>
          <span v-if="openTab === 'uses' && r.lines.length" class="usage">dùng ở dòng
            <a v-for="l in r.lines" :key="l" href="#" @click.prevent.stop="jumpHere(l, searchLabel(r))">{{ l }}</a>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useWorkspaceStore } from '../../stores/workspace'
import { useGraphStore } from '../../stores/graph'
import { useSelectionStore } from '../../stores/selection'
import { basename, dirname } from '../../core/path'

const props = defineProps({ path: { type: String, required: true } })

const workspace = useWorkspaceStore()
const graph = useGraphStore()
const selection = useSelectionStore()

const root = ref(null)
const data = ref(null) // { symbols, uses, usedBy, externals } hoặc null (file không có trong đồ thị, hoặc đang tải)
const openTab = ref(null) // 'defs' | 'uses' | 'usedBy' | null

const tabs = computed(() => [
  { id: 'defs', label: 'Định nghĩa', count: data.value.symbols.length, title: 'Những gì file này định nghĩa — bấm để nhảy tới dòng' },
  { id: 'uses', label: 'Dùng', count: data.value.uses.length, title: 'File mà file này dùng — bấm để nhảy tới dòng ĐỊNH NGHĨA' },
  { id: 'usedBy', label: 'Được dùng bởi', count: data.value.usedBy.length, title: 'File đang dùng file này — bấm để nhảy tới dòng đang dùng' },
])
const list = computed(() => data.value?.[openTab.value] ?? [])

// ---------- nạp quan hệ của file đang xem (từ đồ thị đầy đủ trong Worker) ----------
let seq = 0
watch(() => props.path, async (p) => {
  const my = ++seq
  openTab.value = null
  data.value = null
  if (!p) return
  let result = null
  try {
    result = await workspace.related(p)
  } catch (err) {
    console.warn('Không lấy được quan hệ của file:', err)
  }
  if (my === seq) data.value = result?.found ? result : null // file không có node (README, .json…) → không hiện dải
}, { immediate: true })

const toggle = (id) => { openTab.value = openTab.value === id ? null : id }

// ---------- nhảy ----------
const NOISE = new Set(['dynamic', 'type']) // nhãn "import động / chỉ kiểu" — không có trong mã

/** Từ khoá để tô sáng khi mở file: tên được import / gọi (bỏ nhãn kiểu "GET /users", ".class", "#id"). */
function searchLabel(r) {
  if (r.kinds.includes('calls-api')) return ''
  const label = r.labels.find((l) => l && !NOISE.has(l))
  return label ? String(label).replace(/^[.#]/, '').split('.').pop() : ''
}

/** Dùng → mở file được dùng ở DÒNG ĐỊNH NGHĨA; Được dùng bởi → mở file kia ở DÒNG ĐANG DÙNG mình. */
function openRelated(r) {
  openTab.value = null
  graph.openFile({ path: r.path, line: r.line, query: r.line ? searchLabel(r) : '' })
}

/** Nhảy tới một dòng ngay trong file đang xem (giữ nguyên node đang chọn). */
function jumpHere(line, query = '') {
  openTab.value = null
  selection.select({ nodeId: selection.nodeId, filePath: props.path, line, query })
}

// ---------- tên loại quan hệ (tiếng Việt cho các loại hay gặp; còn lại giữ nguyên) ----------
const KINDS = {
  imports: 'import', renders: 'render', extends: 'kế thừa', 'implemented-by': 'triển khai', registers: 'đăng ký DI',
  injects: 'tiêm DI', 'calls-api': 'gọi API', emits: 'sự kiện', provides: 'cung cấp', 'styled-by': 'CSS',
  dom: 'DOM', calls: 'gọi', 'routes-to': 'route', navigates: 'điều hướng', mounts: 'mount',
}
const kindLabel = (k) => KINDS[k] ?? k

// ---------- đóng danh sách: bấm ra ngoài hoặc Esc ----------
const onDocDown = (e) => { if (root.value && !root.value.contains(e.target)) openTab.value = null }
const onDocKey = (e) => {
  if (e.key !== 'Escape') return
  openTab.value = null
  e.stopPropagation()
}
watch(openTab, (tab) => {
  const op = tab ? 'addEventListener' : 'removeEventListener'
  document[op]('pointerdown', onDocDown, true)
  document[op]('keydown', onDocKey, true)
})
onBeforeUnmount(() => {
  seq++
  document.removeEventListener('pointerdown', onDocDown, true)
  document.removeEventListener('keydown', onDocKey, true)
})
</script>

<style scoped>
.rel-bar {
  position: relative;
  z-index: 200; /* trên mọi thành phần nội bộ của Monaco (thanh cuộn, minimap, widget) */
  flex: none;
  background: #fff;
  font-size: 12px;
  color: #475569;
}

.tabs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px 10px;
}

.tab {
  padding: 2px 9px;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #fff;
  color: #475569;
  font: inherit;
  cursor: pointer;
}

.tab b {
  margin-left: 2px;
  color: #94a3b8;
  font-weight: 600;
}

.tab.on {
  border-color: #2563eb;
  background: #dbeafe;
  color: #1d4ed8;
}

.tab:disabled {
  opacity: 0.5;
  cursor: default;
}

.ext {
  margin-left: auto;
  color: #94a3b8;
  cursor: default;
}

.panel {
  position: absolute;
  z-index: 50;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 340px;
  overflow-y: auto;
  background: #fff;
  border-bottom: 1px solid #cbd5e1;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.14);
}

.row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
}

.row.col {
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
}

.row:hover,
.row:focus-visible {
  background: #f1f5f9;
  outline: none;
}

.line1 {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.name {
  overflow: hidden;
  color: #0f172a;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line,
.guess {
  flex: none;
  color: #94a3b8;
}

.kind,
.chip {
  flex: none;
  padding: 0 6px;
  border-radius: 3px;
  font-size: 10px;
  font-style: normal;
  line-height: 16px;
}

.kind {
  background: #ede9fe;
  color: #6d28d9;
}

.chip {
  background: #e0f2fe;
  color: #0369a1;
}

.dir,
.labels,
.usage {
  overflow: hidden;
  color: #94a3b8;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.labels {
  color: #64748b;
}

.usage a {
  margin-left: 4px;
  color: #2563eb;
  text-decoration: none;
}

.usage a:hover {
  text-decoration: underline;
}
</style>
