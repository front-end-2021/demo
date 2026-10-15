<template>
  <div class="app" :class="{ dragging }" @dragenter.prevent="onDragEnter" @dragover.prevent @dragleave="onDragLeave"
    @drop.prevent="onDrop">
    <!-- Thanh trên cùng -->
    <header class="topbar" :style="{ height: projectName ? '42px' : '' }">
      <div class="brand" :style="{ width: (sideWidth - 27) + 'px' }">
        <i class="bi bi-braces"></i>
        <span class="ellipsis">{{ projectName || 'Code Viewer' }}</span>
      </div>

      <label class="search" :class="{ off: !hasFiles }" :style="{ height: projectName ? '34px' : '' }">
        <i class="bi bi-search"></i>
        <input ref="searchEl" v-model="searchQuery" type="search" :disabled="!hasFiles"
          placeholder="Tìm trong tên và nội dung file" @keydown="onSearchKey" />
        <kbd v-if="!searchQuery" class="hide-sm">Ctrl K</kbd>
        <button v-else class="icon-btn" title="Xoá (Esc)" @click.prevent="clearSearch"><i
            class="bi bi-x-lg"></i></button>
      </label>
      <button class="btn primary" @click="pickFolder">
        <i class="bi bi-folder2-open"></i><span class="hide-sm">{{ hasFiles ? 'Mở thư mục khác' : 'Mở thư mục'
        }}</span>
      </button>
      <input ref="pickerEl" type="file" webkitdirectory directory multiple hidden @change="onPick" />
    </header>

    <!-- Màn hình chào: chưa có file -->
    <section v-if="!hasFiles" class="welcome">
      <div class="dropzone" @click="pickFolder">
        <template v-if="loading">
          <div class="spinner"></div>
          <h1>Đang đọc {{ progress.done }}/{{ progress.total }} file…</h1>
        </template>
        <template v-else>
          <i class="bi bi-folder-symlink big-icon"></i>
          <h1>Kéo thả thư mục dự án vào đây</h1>
          <p>hoặc <button class="link" @click.stop="pickFolder">chọn thư mục từ máy</button>. File chỉ được đọc trong
            trình duyệt, không tải lên đâu cả.</p>
          <p class="hint">Tự bỏ qua {{ BLACKLIST_FOLDERS.slice(0, 6).join(', ') }}… và file lớn hơn 5 MB.</p>
        </template>
      </div>
    </section>

    <!-- Không gian làm việc -->
    <div v-else class="workspace" :style="{ '--side': sideWidth + 'px' }">
      <aside class="side">
        <div class="chips">
          <button class="chip" :class="{ on: !selectedExtensions.size }" :aria-pressed="!selectedExtensions.size"
            @click="selectedExtensions = new Set()">
            Tất cả <b>{{ totalFilesCount }}</b>
          </button>
          <button v-for="[ext, n] in extensionCounts" :key="ext" class="chip"
            :class="{ on: selectedExtensions.has(ext) }" :aria-pressed="selectedExtensions.has(ext)"
            title="Bấm để chọn thêm · Alt + bấm để chỉ chọn đuôi này" @click="toggleExtensionFilter(ext, $event)">{{ ext
            }} <b>{{ n }}</b></button>
        </div>

        <div class="side-head">
          <span>{{ resultLabel }}</span>
          <span v-if="loading" class="muted">Đang đọc {{ progress.done }}/{{ progress.total }}</span>
        </div>

        <div ref="listEl" class="list" role="listbox">
          <button v-for="(file, i) in filteredResults" :key="file.path" class="item" role="option"
            :class="{ active: selectedFilePath === file.path, cursor: i === cursor }"
            :aria-selected="selectedFilePath === file.path" @click="selectFile(file, i)">
            <span class="item-row">
              <i class="bi" :class="iconOf(file.ext)"></i>
              <span class="item-name ellipsis">{{ file.name }}</span>
              <span v-if="dirty.has(file.path)" class="dot" title="Có thay đổi chưa lưu"></span>
              <span v-if="file.count" class="count">{{ file.count > 999 ? '999+' : file.count }}</span>
            </span>
            <span class="item-dir ellipsis" :title="projectName + '/' + file.rel">{{ file.rel || '/' }}</span>
            <span v-if="file.line" class="snippet">
              <span class="ln">{{ file.line }}</span>
              <code class="ellipsis"><template v-for="(part, k) in file.parts"
              :key="k"><mark v-if="k % 2">{{ part }}</mark><template v-else>{{ part }}</template></template></code>
            </span>
          </button>

          <div v-if="!filteredResults.length" class="none">
            <p>Không có file nào khớp<span v-if="debouncedSearchQuery"> với “{{ debouncedSearchQuery }}”</span>.</p>
            <button class="btn" @click="resetFilters">Xoá bộ lọc</button>
          </div>
        </div>
        <div class="resizer" title="Kéo để đổi độ rộng" @pointerdown="startResize"></div>
      </aside>

      <main class="main">
        <CodeEditor v-if="selectedFile" :path="selectedFile.path" :file-name="selectedFile.name"
          :file-ext="selectedFile.ext" :content="selectedFile.content" :query="debouncedSearchQuery" @save="saveFile"
          @dirty="setDirty" />
        <div v-else class="empty">
          <i class="bi bi-file-earmark-code big-icon"></i>
          <p>Chọn một file bên trái để xem và chỉnh sửa.</p>
          <p class="hint"><kbd>Ctrl K</kbd> tìm kiếm · <kbd>↑</kbd><kbd>↓</kbd> di chuyển · <kbd>Enter</kbd> mở ·
            <kbd>Ctrl
              S</kbd> lưu
          </p>
        </div>
      </main>
    </div>

    <div v-if="dragging" class="drop-overlay"><i class="bi bi-download"></i>Thả để mở thư mục</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { debounce } from 'lodash-es'
import CodeEditor from './components/CodeEditor.vue'
import { getSizeInBytes } from './utils/file.js'

const BLACKLIST_FOLDERS = ['bin', 'obj', '.vs', '.vscode', 'target', '.gradle', '.idea', 'build', 'venv', '.venv', '__pycache__', 'env', 'node_modules', '.git']
const ALLOWED_EXTENSIONS = ['.cs', '.csproj', '.sln', '.config', '.json', '.java', '.xml', '.properties', '.yml', '.yaml', '.gradle', '.py', '.ini', '.cfg', '.sh', '.md', '.txt', '.js', '.ts', '.vue', '.html', '.css']
const MAX_SIZE = 5 * 1024 * 1024
const ICONS = { '.cs': 'bi-filetype-cs', '.java': 'bi-filetype-java', '.py': 'bi-filetype-py', '.js': 'bi-filetype-js', '.ts': 'bi-filetype-tsx', '.json': 'bi-filetype-json', '.xml': 'bi-filetype-xml', '.html': 'bi-filetype-html', '.css': 'bi-filetype-css', '.md': 'bi-filetype-md', '.yml': 'bi-filetype-yml', '.yaml': 'bi-filetype-yml', '.sh': 'bi-filetype-sh', '.txt': 'bi-filetype-txt' }
const iconOf = (ext) => ICONS[ext] || 'bi-file-earmark-text'

// ---------- State ----------
const fileMap = ref(new Map()) // path → { path, name, ext, rel, size, content }
const searchQuery = ref('')
const debouncedSearchQuery = ref('')
const selectedExtensions = ref(new Set()) // các đuôi file đang được chọn; rỗng = tất cả
const selectedFilePath = ref(null)
const dirty = ref(new Set())
const cursor = ref(-1)
const loading = ref(false)
const progress = ref({ done: 0, total: 0 })
const dragging = ref(false)
const searchEl = ref(null)
const pickerEl = ref(null)
const listEl = ref(null)

const hasFiles = computed(() => fileMap.value.size > 0)
const totalFilesCount = computed(() => fileMap.value.size)
const projectName = computed(() => {
  const first = fileMap.value.keys().next().value
  return first && first.includes('/') ? first.split('/')[0] : ''
})
const extensionCounts = computed(() => {
  const m = new Map()
  for (const f of fileMap.value.values()) m.set(f.ext, (m.get(f.ext) || 0) + 1)
  return [...m].sort((a, b) => b[1] - a[1])
})
const selectedFile = computed(() => fileMap.value.get(selectedFilePath.value) || null)

// ---------- Đọc file ----------
async function ingest(entries) { // entries: [{ file, path }]
  const valid = entries.filter(({ file, path }) => {
    const parts = path.split('/')
    if (parts.slice(0, -1).some((p) => BLACKLIST_FOLDERS.includes(p.toLowerCase()))) return false
    const i = file.name.lastIndexOf('.')
    const ext = i !== -1 ? file.name.slice(i).toLowerCase() : ''
    return ALLOWED_EXTENSIONS.includes(ext) && file.size <= MAX_SIZE
  })
  if (!valid.length) { alert('Không tìm thấy file mã nguồn hợp lệ trong thư mục này.'); return }

  loading.value = true
  progress.value = { done: 0, total: valid.length }
  const map = new Map()
  for (let i = 0; i < valid.length; i += 32) { // đọc song song theo lô để không treo trình duyệt
    await Promise.all(valid.slice(i, i + 32).map(async ({ file, path }) => {
      try {
        const name = file.name
        const dir = path.slice(0, path.lastIndexOf('/') + 1)
        const rel = dir.includes('/') ? dir.slice(dir.indexOf('/') + 1) : dir // bỏ tên thư mục gốc
        map.set(path, { path, name, ext: name.slice(name.lastIndexOf('.')).toLowerCase(), rel, size: file.size, content: await file.text() })
      } catch (err) {
        console.error(`Lỗi đọc file: ${file.name}`, err)
      }
      progress.value.done++
    }))
  }
  fileMap.value = new Map([...map].sort((a, b) => a[0].localeCompare(b[0])))
  dirty.value = new Set()
  selectedFilePath.value = null
  selectedExtensions.value = new Set()
  searchQuery.value = ''
  loading.value = false
}

const pickFolder = () => pickerEl.value?.click()
function onPick(e) {
  const files = [...e.target.files].map((file) => ({ file, path: file.webkitRelativePath || file.name }))
  e.target.value = ''
  if (files.length) ingest(files)
}

// Kéo thả thư mục
let dragDepth = 0
const onDragEnter = (e) => { if ([...e.dataTransfer.types].includes('Files')) { dragDepth++; dragging.value = true } }
const onDragLeave = () => { if (--dragDepth <= 0) { dragDepth = 0; dragging.value = false } }
async function onDrop(e) {
  dragDepth = 0
  dragging.value = false
  const roots = [...e.dataTransfer.items].map((it) => it.webkitGetAsEntry?.()).filter(Boolean)
  const out = []
  const walk = async (entry) => {
    if (entry.isFile) {
      const file = await new Promise((res, rej) => entry.file(res, rej))
      out.push({ file, path: entry.fullPath.replace(/^\//, '') })
    } else if (entry.isDirectory) {
      if (BLACKLIST_FOLDERS.includes(entry.name.toLowerCase())) return
      const reader = entry.createReader()
      let batch
      do {
        batch = await new Promise((res, rej) => reader.readEntries(res, rej))
        for (const child of batch) await walk(child)
      } while (batch.length)
    }
  }
  for (const r of roots) await walk(r)
  if (out.length) ingest(out)
}

// ---------- Tìm kiếm ----------
watch(searchQuery, debounce((v) => { debouncedSearchQuery.value = v.trim() }, 250))
watch([debouncedSearchQuery, selectedExtensions], () => { cursor.value = -1 })

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const filteredResults = computed(() => {
  const q = debouncedSearchQuery.value.toLowerCase()
  const re = q ? new RegExp(`(${escapeRe(q)})`, 'gi') : null
  const results = []
  for (const f of fileMap.value.values()) {
    if (selectedExtensions.value.size && !selectedExtensions.value.has(f.ext)) continue
    if (!q) { results.push(f); continue }

    const lower = f.content.toLowerCase()
    let idx = lower.indexOf(q)
    const nameHit = f.name.toLowerCase().includes(q)
    if (idx === -1 && !nameHit) continue
    if (idx === -1) { results.push(f); continue }

    let count = 0
    for (let p = idx; p !== -1 && count < 1000; p = lower.indexOf(q, p + q.length)) count++
    let line = 1
    for (let p = 0; p < idx; p++) if (f.content.charCodeAt(p) === 10) line++
    const start = f.content.lastIndexOf('\n', idx) + 1
    let end = f.content.indexOf('\n', idx)
    if (end === -1) end = f.content.length
    let text = f.content.slice(start, end)
    const lead = text.length - text.trimStart().length
    const from = Math.max(lead, idx - start - 24) // giữ từ khoá trong vùng nhìn thấy
    text = (from > lead ? '…' : '') + text.slice(from).trimEnd()
    results.push({ ...f, count, line, parts: text.split(re) })
  }
  return results
})

const resultLabel = computed(() => {
  const n = filteredResults.value.length
  return debouncedSearchQuery.value ? `${n} file khớp` : `${n} file`
})

function onSearchKey(e) {
  const list = filteredResults.value
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (!list.length) return
    const d = e.key === 'ArrowDown' ? 1 : -1
    cursor.value = (cursor.value + d + list.length) % list.length
    nextTick(() => listEl.value?.querySelector('.item.cursor')?.scrollIntoView({ block: 'nearest' }))
  } else if (e.key === 'Enter') {
    const f = list[cursor.value] || list[0]
    if (f) selectFile(f, list.indexOf(f))
  } else if (e.key === 'Escape') {
    clearSearch()
  }
}
const clearSearch = () => { searchQuery.value = ''; debouncedSearchQuery.value = '' }
const resetFilters = () => { clearSearch(); selectedExtensions.value = new Set() }
function toggleExtensionFilter(ext, e) {
  if (e?.altKey) { selectedExtensions.value = new Set([ext]); return } // Alt + bấm: chỉ chọn đuôi này
  const s = new Set(selectedExtensions.value)
  s.has(ext) ? s.delete(ext) : s.add(ext)
  // chọn đủ mọi đuôi thì coi như "Tất cả"
  selectedExtensions.value = s.size === extensionCounts.value.length ? new Set() : s
}
const selectFile = (file, i) => { selectedFilePath.value = file.path; cursor.value = i }

// ---------- Lưu ----------
function saveFile(path, content) {
  const f = fileMap.value.get(path)
  if (!f) return
  f.content = content
  f.size = getSizeInBytes(content)
}
function setDirty(path, isDirty) {
  const s = new Set(dirty.value)
  isDirty ? s.add(path) : s.delete(path)
  dirty.value = s
}

// ---------- Phím tắt & độ rộng sidebar ----------
function onGlobalKey(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchEl.value?.focus()
    searchEl.value?.select()
  }
}
const beforeUnload = (e) => { if (dirty.value.size) e.preventDefault() }

const sideWidth = ref(340)
function startResize(e) {
  const startX = e.clientX, startW = sideWidth.value
  document.body.classList.add('resizing')
  const move = (ev) => { sideWidth.value = Math.min(640, Math.max(240, startW + ev.clientX - startX)) }
  const up = () => {
    document.body.classList.remove('resizing')
    window.removeEventListener('pointermove', move)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up, { once: true })
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKey)
  window.addEventListener('beforeunload', beforeUnload)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKey)
  window.removeEventListener('beforeunload', beforeUnload)
})
</script>