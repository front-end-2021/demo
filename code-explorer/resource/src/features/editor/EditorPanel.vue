<template>
  <!-- Panel mã nguồn (chỉ đọc). Monaco tải lười khi mở file đầu tiên. -->
  <aside class="editor-panel">
    <header class="bar">
      <div class="crumbs" :title="path">
        <div v-if="path" class="crumb"><i>{{ sPth }}</i><b>{{ fileName }}</b></div>
        <b v-else>Mã nguồn</b>
      </div>
      <span v-if="meta" class="meta">{{ meta }}</span>
      <button v-if="canDiagram(path)" class="btn-secondary small" :class="{ active: diagram.fileSet.has(path) }"
        title="Xem sơ đồ class của file này (nếu đang ghim các file khác thì thêm file này vào sơ đồ)" @click="showInDiagram">Sơ đồ class</button>
      <button class="btn-secondary small" :class="{ active: layout.hideComments }" :disabled="!canStrip"
        :title="canStrip ? 'Ẩn comment và dòng trống thừa (chỉ đổi cách hiển thị, không đổi file)' : 'Chưa hỗ trợ ẩn comment cho loại file này'"
        @click="layout.hideComments = !layout.hideComments">{{ layout.hideComments ? 'Hiện comment' : '&nbsp;&nbsp;&nbsp;Ẩn comment' }}</button>
      <button class="btn-secondary small" title="Đóng (vẫn giữ node đang chọn)" @click="layout.editorOpen = false">✕</button>
    </header>

    <RelationsBar v-if="path && status === 'ready'" :path="path" />

    <div class="body">
      <div ref="host" class="monaco-host" :class="{ hidden: status !== 'ready' }"></div>
      <div v-if="status === 'idle'" class="msg">Bấm một node file trong sơ đồ để xem mã nguồn.</div>
      <div v-else-if="status === 'loading'" class="msg">Đang đọc file…</div>
      <div v-else-if="status === 'error'" class="msg error">{{ errorText }}</div>
    </div>
  </aside>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useSelectionStore } from '../../stores/selection'
import { useWorkspaceStore } from '../../stores/workspace'
import { useLayoutStore } from '../../stores/layout'
import { useDiagramStore } from '../../stores/diagram'
import { canDiagram } from '../diagram/parsers'
import { SourceError } from '../../core/source'
import { stripComments, canStripComments } from '../../core/mask-comments'
import { basename, extname } from '../../core/path'
import { formatSize } from '../../utils/format'
import { loadMonaco } from './useMonaco'
import { languageOf } from './languages'
import RelationsBar from './RelationsBar.vue'
import { ViewType } from '../../utils/viewType.js'

const selection = useSelectionStore()
const workspace = useWorkspaceStore()
const layout = useLayoutStore()
const diagram = useDiagramStore()

/** Chuyển sang tab sơ đồ class; file chưa có trong sơ đồ thì thêm vào (ở chế độ "theo file đang chọn" nó đã có sẵn nên không ghim). */
function showInDiagram() {
  if (!diagram.fileSet.has(path.value)) diagram.add(path.value)
  layout.centerTab = ViewType.clss
}

const host = ref(null)
const status = ref('idle') // 'idle' | 'loading' | 'ready' | 'error'
const errorText = ref('')
const meta = ref('')
// Đường dẫn ĐANG HIỂN THỊ. Khi bỏ chọn (bấm vào khoảng trống của sơ đồ) panel vẫn giữ file cuối cùng.
const path = ref('')

const sPth = computed(() => path.value.split('/').slice(0, -1).join('/'))
const fileName = computed(() => basename(path.value))
const canStrip = computed(() => !!path.value && canStripComments(extname(path.value).slice(1)))

// Đối tượng của Monaco giữ NGOÀI state phản ứng của Vue (bọc reactive làm chậm và dễ lỗi)
let monaco = null
let editor = null
let uid = 0
let current = null // khoá của model đang hiển thị
let seq = 0 // chống lỗi chạy lộn thứ tự khi người dùng chọn file liên tục
const entries = new Map() // khoá → { model, text, viewState }; thứ tự Map = lâu chưa dùng nhất ở đầu
const MAX_MODELS = 24

// Đặt TRƯỚC các watcher (watcher `immediate` chạy ngay trong lúc setup): bật khi cần nhảy dòng sau khi mở lại file ở dạng gốc
let jumpAfterReload = false

// Mỗi lần chọn (kể cả chọn lại cùng file với dòng / từ khoá khác): file khác → mở; cùng file → chỉ nhảy dòng và tô sáng.
// Bỏ chọn (bấm vào khoảng trống của sơ đồ) → giữ nguyên file đang xem.
watch(() => selection.tick, () => {
  const p = selection.filePath
  if (!p) return
  if (p === path.value && status.value === 'ready') applyJump()
  else show(p)
}, { immediate: true })

// Bật/tắt "Ẩn comment" → hiển thị lại file ĐANG XEM (kể cả khi đã bỏ chọn trên sơ đồ)
watch(() => layout.hideComments, () => {
  const reveal = jumpAfterReload
  jumpAfterReload = false
  if (path.value) show(path.value, { reveal })
})

async function show(p, { reveal = true } = {}) {
  const my = ++seq
  if (status.value !== 'ready') status.value = 'loading'
  try {
    // Đọc file và tải Monaco song song (lần đầu mới phải chờ Monaco)
    const [text, m] = await Promise.all([workspace.readFile(p), loadMonaco()])
    await nextTick() // đảm bảo vùng chứa đã nằm trong DOM
    if (my !== seq || !host.value) return
    monaco = m
    ensureEditor()
    open(p, text)
    status.value = 'ready'
    applyJump({ reveal })
  } catch (err) {
    if (my !== seq) return
    path.value = p
    meta.value = ''
    errorText.value = describeError(err)
    status.value = 'error'
  }
}

function describeError(err) {
  if (err instanceof SourceError) {
    if (err.code === 'not-found') return 'Không tìm thấy file trong thư mục đang mở.'
    if (err.code === 'binary') return 'File nhị phân — không hiển thị được dưới dạng văn bản.'
    if (err.code === 'too-large') return `File quá lớn để xem (${formatSize(err.size)}; giới hạn ${formatSize(err.maxSize)}).`
    return err.message
  }
  return `Không mở được trình soạn thảo: ${err.message}`
}

function ensureEditor() {
  if (editor) return
  editor = monaco.editor.create(host.value, {
    readOnly: true,
    domReadOnly: true,
    theme: 'explorer-light',
    automaticLayout: true,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace",
    scrollBeyondLastLine: false,
    tabSize: 4,
    padding: { top: 12 },
    smoothScrolling: true,
    renderLineHighlight: 'all',
    minimap: { enabled: true, renderCharacters: false },
    scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 8, verticalSliderSize: 8, horizontalSliderSize: 6 },
  })
}

// ---------- nhảy dòng & tô sáng từ khoá (từ kết quả tìm kiếm / symbol) ----------
let hitDecor = null
let lineDecor = null
let flashTimer = 0

function clearDecorations() {
  hitDecor?.clear()
  lineDecor?.clear()
  hitDecor = lineDecor = null
  clearTimeout(flashTimer)
}

/** Tô sáng mọi chỗ khớp từ khoá (kể cả trên thanh cuộn); trả về các chỗ khớp. */
function markQuery(q) {
  hitDecor?.clear()
  hitDecor = null
  const model = editor?.getModel()
  if (!q || !model) return []
  const matches = model.findMatches(q, false, false, false, null, false, 2000)
  hitDecor = editor.createDecorationsCollection(matches.map((m) => ({
    range: m.range,
    options: { inlineClassName: 'find-hit', overviewRuler: { color: '#f5c518', position: monaco.editor.OverviewRulerLane.Center } },
  })))
  return matches
}

function flashLine(lineNumber) {
  lineDecor?.clear()
  lineDecor = editor.createDecorationsCollection([{
    range: new monaco.Range(lineNumber, 1, lineNumber, 1),
    options: { isWholeLine: true, className: 'jump-line' },
  }])
  clearTimeout(flashTimer)
  flashTimer = setTimeout(() => lineDecor?.clear(), 2000)
}

/** Áp selection.line / selection.query lên file đang hiển thị. reveal=false: chỉ tô sáng, không cuộn. */
function applyJump(options) {
  try {
    jump(options)
  } catch (err) {
    console.warn('Không nhảy dòng / tô sáng được:', err) // phần phụ: file vẫn hiển thị bình thường
  }
}

function jump({ reveal = true } = {}) {
  if (!editor) return
  const line = selection.line
  if (reveal && line && layout.hideComments) {
    // Số dòng của kết quả tính theo bản GỐC; bản đã ẩn comment bị lệch dòng → tắt ẩn comment rồi nhảy sau khi mở lại file
    jumpAfterReload = true
    layout.hideComments = false
    return
  }
  const matches = markQuery(selection.query)
  if (!reveal) return
  const model = editor.getModel()
  if (line && model) {
    const ln = Math.min(Math.max(1, line), model.getLineCount())
    editor.setPosition({ lineNumber: ln, column: 1 })
    editor.revealLineInCenter(ln)
    flashLine(ln)
  } else if (matches.length) {
    editor.setSelection(matches[0].range)
    editor.revealRangeInCenter(matches[0].range)
  }
}

function open(p, text) {
  clearDecorations()
  const ext = extname(p).slice(1)
  const strip = layout.hideComments && canStripComments(ext)
  const key = strip ? `${p}\u0000clean` : p // bản đã ẩn comment dùng model riêng
  const shown = strip ? stripComments(text, ext) : text

  if (current) {
    const prev = entries.get(current)
    if (prev) prev.viewState = editor.saveViewState() // nhớ vị trí cuộn để quay lại đúng chỗ
  }

  let e = entries.get(key)
  if (!e) {
    e = { model: monaco.editor.createModel(shown, languageOf(p), monaco.Uri.file(`/${++uid}/${p}`)), text, viewState: null }
  } else if (e.text !== text) {
    e.model.setValue(shown) // file đã đổi trên đĩa kể từ lần xem trước
    e.text = text
    e.viewState = null
  }
  entries.delete(key)
  entries.set(key, e) // đưa về cuối = vừa dùng

  editor.setModel(e.model)
  if (e.viewState) editor.restoreViewState(e.viewState)
  else editor.setScrollTop(0)
  current = key
  path.value = p
  meta.value = `${languageOf(p)} · ${formatSize(new Blob([text]).size)}`

  while (entries.size > MAX_MODELS) { // bỏ model lâu chưa dùng nhất
    const [oldKey, old] = entries.entries().next().value
    old.model.dispose()
    entries.delete(oldKey)
  }
}

onBeforeUnmount(() => {
  seq++ // huỷ mọi lần đọc đang chờ
  clearDecorations()
  editor?.dispose()
  for (const e of entries.values()) e.model.dispose()
  entries.clear()
  editor = null
})
</script>

<style scoped>
.editor-panel {
  flex: none;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #fbfcfd;
  border-left: 1px solid #e2e8f0;
}

.bar {
  flex: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 10px;
  background: #fff;
  font-size: 12px;
  color: #475569;
}

.crumbs {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  direction: rtl; /* khi quá dài thì cắt phần đầu đường dẫn, giữ tên file */
  text-align: left;
}

.crumbs > * {
  direction: ltr;
  unicode-bidi: isolate;
}
.crumb {display: inline-flex; flex-direction: column;}
.crumb>i { font-size: 10px; }
.crumb>b { font-size: 11px; }

.crumbs b {
  color: #0f172a;
}

.meta {
  flex: none;
  color: #94a3b8;
}

.body {
  position: relative;
  flex: 1;
  min-height: 0;
}

.monaco-host {
  position: absolute;
  inset: 0;
}

.monaco-host.hidden {
  visibility: hidden; /* không dùng display:none — Monaco cần vùng chứa có kích thước để tự bố trí */
}

.msg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  font-size: 13px;
  line-height: 1.6;
  color: #94a3b8;
}

.msg.error {
  color: #dc2626;
}
</style>
