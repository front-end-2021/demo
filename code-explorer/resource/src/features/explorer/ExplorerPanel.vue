<template>
  <!-- Explorer: ô tìm (tên file · symbol · nội dung), chip đuôi file, danh sách file / kết quả -->
  <aside class="explorer">
    <div class="search-box">
      <input ref="inputEl" type="search" class="search-input" placeholder="Tìm tên file, symbol, nội dung…"
        :value="search.query" @input="search.setQuery($event.target.value)" @keydown="onKey" />
      <button v-if="search.query" class="clear" title="Xoá (Esc)" @click="search.clear()">✕</button>
      <kbd v-else>Ctrl K</kbd>
    </div>

    <div class="chips">
      <button class="chip" :class="{ on: !search.exts.size }" @click="search.exts = new Set()">
        Tất cả <b>{{ fmt(search.paths.length) }}</b>
      </button>
      <button v-for="[ext, n] in search.extCounts" :key="ext" class="chip" :class="{ on: search.exts.has(ext) }"
        title="Bấm để chọn thêm · Alt + bấm để chỉ chọn đuôi này" @click="search.toggleExt(ext, $event.altKey)">
        {{ ext || '(không đuôi)' }} <b>{{ fmt(n) }}</b>
      </button>
    </div>

    <div class="head">
      <span>{{ headLabel }}</span>
      <span v-if="search.searching" class="muted">Đang quét {{ fmt(search.contentState.scanned) }}/{{ fmt(search.contentState.total) }}</span>
    </div>
    <div v-if="search.error" class="error">Lỗi tìm kiếm: {{ search.error }}</div>

    <div class="body">
      <VirtualList ref="listEl" :rows="rows">
        <template #row="{ row, index }">
          <div v-if="row.type === 'header'" class="sec">{{ row.text }}</div>
          <button v-else class="item" :class="{ active: row.path === selection.filePath, cursor: index === cursor, 'in-diagram': diagram.fileSet.has(row.path) }"
            :title="row.path + (row.line ? ':' + row.line : '')" @click="openRow(row, index, $event)">
            <span class="line1">
              <template v-if="row.type === 'symbol'">
                <span class="kind">{{ row.kind }}</span>
                <span class="name">{{ row.name }}</span>
              </template>
              <template v-else>
                <span class="badge" :style="{ color: badgeOf(row.path)[1], background: badgeOf(row.path)[1] + '1f' }">{{ badgeOf(row.path)[0] }}</span>
                <span class="name">{{ basename(row.path) }}</span>
                <span v-if="diagram.fileSet.has(row.path)" class="dmark" title="Đang có trong sơ đồ class">◇</span>
                <span v-if="row.count" class="count">{{ row.count > 999 ? '999+' : row.count }}</span>
              </template>
            </span>
            <span class="dir">{{ dirname(row.path) || '/' }}<template v-if="row.type === 'symbol' && row.line">:{{ row.line }}</template></span>
            <span v-if="row.type === 'content'" class="snippet">
              <span class="ln">{{ row.line }}</span>
              <code>{{ row.before }}<mark>{{ row.match }}</mark>{{ row.after }}</code>
            </span>
          </button>
        </template>
      </VirtualList>

      <div v-if="!rows.length && !search.searching" class="none">
        <p v-if="!search.paths.length">Chưa có file nào.</p>
        <template v-else>
          <p v-if="search.committed">Không có kết quả nào cho “{{ search.committed }}”.</p>
          <p v-else>Không có file nào khớp bộ lọc.</p>
          <button class="btn-secondary small" @click="search.resetFilters()">Xoá bộ lọc</button>
        </template>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import VirtualList from './VirtualList.vue'
import { useSearchStore } from '../../stores/search'
import { useSelectionStore } from '../../stores/selection'
import { useDiagramStore } from '../../stores/diagram'
import { basename, dirname, extname } from '../../core/path'
import { fmt } from '../../utils/format'

const search = useSearchStore()
const selection = useSelectionStore()
const diagram = useDiagramStore()

const inputEl = ref(null)
const listEl = ref(null)
const cursor = ref(-1) // hàng đang được "trỏ" bằng bàn phím

// Chiều cao hàng (px): tiêu đề mục · file / symbol · kết quả nội dung (thêm dòng đoạn trích)
const H = { header: 26, file: 44, symbol: 44, content: 66 }

const BADGES = {
  '.cs': ['CS', '#16a34a'], '.java': ['JAVA', '#dc2626'], '.py': ['PY', '#2563eb'], '.js': ['JS', '#ca8a04'],
  '.ts': ['TS', '#2563eb'], '.vue': ['VUE', '#10b981'], '.html': ['HTML', '#ea580c'], '.css': ['CSS', '#0891b2'],
  '.json': ['{ }', '#64748b'], '.md': ['MD', '#64748b'], '.xml': ['XML', '#7c3aed'], '.csproj': ['PRJ', '#7c3aed'],
}
function badgeOf(path) {
  const e = extname(path)
  return BADGES[e] ?? [e ? e.slice(1, 4).toUpperCase() : '·', '#94a3b8']
}

// ---------- các hàng: không tìm → mọi file; có tìm → ba mục (tên file · symbol · nội dung) ----------
const rows = computed(() => {
  const out = []
  const paths = search.paths
  if (!search.committed) {
    for (const i of search.listIndices) out.push({ key: `f${i}`, type: 'file', h: H.file, path: paths[i] })
    return out
  }
  const names = search.nameResult
  if (names.indices.length) {
    out.push({ key: 'h-name', type: 'header', h: H.header, text: `Tên file (${fmt(names.total)}${names.total > names.indices.length ? ', hiện ' + fmt(names.indices.length) : ''})` })
    for (const i of names.indices) out.push({ key: `n${i}`, type: 'file', h: H.file, path: paths[i] })
  }
  if (search.symbolHits.length) {
    out.push({ key: 'h-sym', type: 'header', h: H.header, text: `Symbol (${fmt(search.symbolTotal)}${search.symbolTotal > search.symbolHits.length ? ', hiện ' + fmt(search.symbolHits.length) : ''})` })
    search.symbolHits.forEach((s, k) => out.push({ key: `s${k}`, type: 'symbol', h: H.symbol, path: s.path, name: s.name, kind: s.kind, line: s.line }))
  }
  if (search.contentHits.length) {
    const st = search.contentState
    out.push({ key: 'h-content', type: 'header', h: H.header, text: `Nội dung (${fmt(search.contentHits.length)} file${st.truncated ? '+' : ''})` })
    search.contentHits.forEach((c, k) => out.push({ key: `c${k}`, type: 'content', h: H.content, ...c }))
  }
  return out
})

const headLabel = computed(() => {
  if (!search.committed) return `${fmt(search.listIndices.length)} file`
  const content = `${fmt(search.contentHits.length)}${search.contentState.truncated ? '+' : ''}`
  return `${fmt(search.nameResult.total)} tên · ${fmt(search.symbolTotal)} symbol · ${content} nội dung`
})

// ---------- thao tác ----------
function openRow(row, index, event) {
  cursor.value = index
  // Ctrl / Cmd + bấm: thêm hoặc bỏ file khỏi sơ đồ class (không mở file). File chưa có parser thì mở như thường.
  if ((event?.ctrlKey || event?.metaKey) && row.path && diagram.toggle(row.path)) return
  search.open(row.path, { line: row.type === 'file' ? null : row.line })
}

const selectable = () => rows.value.reduce((acc, r, i) => (r.type !== 'header' ? (acc.push(i), acc) : acc), [])

function move(delta) {
  const list = selectable()
  if (!list.length) return
  const at = list.indexOf(cursor.value)
  const next = at < 0 ? (delta > 0 ? 0 : list.length - 1) : (at + delta + list.length) % list.length
  cursor.value = list[next]
  listEl.value?.scrollToIndex(cursor.value)
}

function onKey(e) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    move(e.key === 'ArrowDown' ? 1 : -1)
  } else if (e.key === 'Enter') {
    if (search.query.trim() !== search.committed) return search.commitNow() // đang chờ ngừng gõ: tìm ngay, rồi Enter lần nữa để mở
    const row = rows.value[cursor.value] ?? rows.value[selectable()[0]]
    if (row) openRow(row, rows.value.indexOf(row))
  } else if (e.key === 'Escape') {
    if (search.query) search.clear()
    else inputEl.value?.blur()
  }
}

// ---------- đồng bộ ----------
// Đổi truy vấn / bộ lọc → về đầu danh sách
watch([() => search.committed, () => search.exts], () => {
  cursor.value = -1
  listEl.value?.resetScroll()
})

// Chọn file từ sơ đồ (khi chưa tìm) → cuộn danh sách tới file đó
watch(() => selection.filePath, (p) => {
  if (!p || search.committed) return
  const i = rows.value.findIndex((r) => r.path === p)
  if (i >= 0) listEl.value?.scrollToIndex(i)
}, { flush: 'post' })

// Ctrl K
watch(() => search.focusTick, async () => {
  await nextTick()
  inputEl.value?.focus()
  inputEl.value?.select()
})
</script>

<style scoped>
.explorer {
  flex: none;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  font-size: 12px;
  color: #475569;
}

.search-box {
  position: relative;
  flex: none;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 7px 56px 7px 10px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: #f8fafc;
  color: #0f172a;
  font: inherit;
  font-size: 13px;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
  background: #fff;
}
.search-input[type="search"]::-webkit-search-results-decoration,
.search-input[type="search"]::-webkit-search-results-button,
.search-input[type="search"]::-webkit-search-cancel-button,
.search-input[type="search"]::-webkit-search-decoration {
  display: none;
}
.search-box kbd,
.search-box .clear {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  margin-top: 1px;
}

.search-box kbd {
  padding: 1px 5px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  background: #fff;
  color: #94a3b8;
  font-size: 10px;
  pointer-events: none;
}

.clear {
  border: none;
  background: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 12px;
}

.chips {
  flex: none; scrollbar-width: thin;
  display: flex;
  flex-wrap: wrap;
  gap: 4px; background: var(--soft);
  max-height: 84px;
  overflow-y: auto;
  padding: 6px 8px 6px;
}

.chip {
  padding: 2px 7px;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #fff;
  color: #475569;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.chip b {
  margin-left: 2px;
  color: #94a3b8;
  font-weight: 600;
}

.chip.on {
  border-color: transparent;
  background: #dbeafe;
  color: #1d4ed8;
}

.chip.on b {
  color: #3b82f6;
}

.head {
  flex: none;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 10px;
  border-bottom: 1px solid #f1f5f9;
  color: #64748b;
}

.muted {
  color: #94a3b8;
}

.error {
  flex: none;
  padding: 6px 10px;
  color: #dc2626;
}

.body {
  position: relative;
  flex: 1;
  min-height: 0;
}

.sec {
  box-sizing: border-box;
  height: 100%;
  padding: 7px 10px 0;
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0 10px;
  border: none;
  border-left: 3px solid transparent;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.item:hover,
.item.cursor {
  background: #f1f5f9;
}

.dmark {
  flex: none;
  color: #7c3aed;
  font-size: 11px;
}

.item.active {
  border-left-color: #2563eb;
  background: #eff6ff;
}

.line1 {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.badge,
.kind {
  flex: none;
  min-width: 18px;
  padding: 0 2px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 700;
  line-height: 15px;
  text-align: center;
}

.kind {
  background: #ede9fe;
  color: #6d28d9;
  font-weight: 600;
}

.name {
  overflow: hidden;
  flex: 1;
  color: #0f172a;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.count {
  flex: none;
  padding: 0 6px;
  border-radius: 999px;
  background: #e2e8f0;
  color: #475569;
  font-size: 10px;
  line-height: 16px;
}

.dir {
  overflow: hidden;
  padding-left: 32px;
  color: #94a3b8;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: rtl; /* quá dài thì cắt phần đầu đường dẫn, giữ thư mục gần file nhất */
  text-align: left;
}

.snippet {
  display: flex;
  gap: 6px;
  min-width: 0;
  padding-left: 32px;
}

.snippet .ln {
  flex: none;
  color: #94a3b8;
  font-size: 10px;
  line-height: 16px;
}

.snippet code {
  overflow: hidden;
  color: #475569;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: pre;
}

mark {
  padding: 0 1px;
  border-radius: 2px;
  background: #fde68a;
  color: #0f172a;
}

.none {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  text-align: center;
  color: #94a3b8;
}

.none p {
  margin: 0;
}
</style>
