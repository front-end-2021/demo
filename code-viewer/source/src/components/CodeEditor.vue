<template>
    <div class="editor">
        <div class="editor-bar">
            <div class="crumbs ellipsis" :title="path">
                <span v-for="(seg, i) in segments" :key="i" class="crumb">{{ seg }}<i
                        class="bi bi-chevron-right"></i></span>
                <b>{{ fileName }}</b>
            </div>

            <div class="meta">
                <span class="muted hide-sm">{{ language }} · {{ sizeLabel }}</span>
                <span v-if="flash" class="saved"><i class="bi bi-check2"></i>Đã lưu</span>
                <span v-else-if="isDirty" class="unsaved"><span class="dot"></span>Chưa lưu</span>
            </div>

            <div class="actions">
                <button class="btn"
                    title="Xoá comment và dòng trống thừa (có thể hoàn tác bằng Ctrl Z)" @click="cleanCode">
                    <i class="bi bi-magic"></i><span class="hide-sm">Dọn comment</span>
                </button>
                <button class="btn" title="Tải file về máy" @click="download"><i class="bi bi-download"></i></button>
                <button class="btn primary" :disabled="!isDirty" title="Lưu thay đổi (Ctrl S)" @click="save">
                    <i class="bi bi-floppy"></i><span class="hide-sm">Lưu</span>
                </button>
            </div>
        </div>
        <div ref="host" class="monaco-host"></div>
    </div>
</template>
<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { getSizeInBytes, formatSize } from '../utils/file.js'
import { stripComments } from '../utils/stripComments.js'

const props = defineProps({
    path: { type: String, required: true },
    fileName: { type: String, required: true },
    fileExt: { type: String, required: true },
    content: { type: String, default: '' },
    query: { type: String, default: '' },
})
const emit = defineEmits(['save', 'dirty'])

const LANGS = {
    '.cs': 'csharp', '.java': 'java', '.py': 'python', '.js': 'javascript', '.ts': 'typescript', '.vue': 'html',
    '.json': 'json', '.xml': 'xml', '.csproj': 'xml', '.config': 'xml', '.yml': 'yaml', '.yaml': 'yaml',
    '.html': 'html', '.css': 'css', '.md': 'markdown', '.sh': 'shell', '.ini': 'ini', '.cfg': 'ini', '.properties': 'ini',
}
const language = computed(() => LANGS[props.fileExt] || 'plaintext')
const segments = computed(() => props.path.split('/').slice(0, -1))

const host = ref(null)
const isDirty = ref(false)
const liveSize = ref(0)
const flash = ref(false)
const sizeLabel = computed(() => formatSize(liveSize.value))

// Mỗi file có một model riêng → giữ nguyên bản nháp và lịch sử hoàn tác khi chuyển qua lại giữa các file.
const models = new Map()
let editor = null
let hits = null
let flashTimer = null

// Theme Monaco khớp với bảng màu của app
monaco.editor.defineTheme('cv-light', { base: 'vs', inherit: true, rules: [], colors: { 'editor.background': '#fbfcfd', 'editorLineNumber.foreground': '#a3adbb', 'editor.lineHighlightBackground': '#eef2f7' } })
monaco.editor.defineTheme('cv-dark', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#171c24', 'editorLineNumber.foreground': '#4d5868', 'editor.lineHighlightBackground': '#1e2530' } })
const media = window.matchMedia('(prefers-color-scheme: dark)')
const applyTheme = () => monaco.editor.setTheme(media.matches ? 'cv-dark' : 'cv-light')

function modelFor(path) {
    let m = models.get(path)
    if (!m) {
        m = monaco.editor.createModel(props.content, language.value, monaco.Uri.file(`/${models.size}/${path}`))
        m.onDidChangeContent(() => { if (props.path === path) refresh() })
        models.set(path, m)
    }
    return m
}

function refresh() {
    const v = editor.getModel().getValue()
    const d = v !== props.content
    liveSize.value = getSizeInBytes(v)
    if (d !== isDirty.value) { isDirty.value = d; emit('dirty', props.path, d) }
    if (d) flash.value = false
}

// Tô sáng mọi vị trí khớp từ khoá và cuộn tới vị trí đầu tiên
function markQuery(reveal) {
    const m = editor.getModel()
    const found = props.query ? m.findMatches(props.query, false, false, false, null, false, 5000) : []
    hits.set(found.map((f) => ({ range: f.range, options: { inlineClassName: 'find-hit', overviewRuler: { color: '#f5c518', position: monaco.editor.OverviewRulerLane.Center } } })))
    if (reveal && found.length) {
        editor.revealRangeInCenter(found[0].range)
        editor.setSelection(found[0].range)
    }
}

function open() {
    editor.setModel(modelFor(props.path))
    refresh()
    markQuery(true)
}

onMounted(() => {
    applyTheme()
    media.addEventListener('change', applyTheme)
    editor = monaco.editor.create(host.value, {
        automaticLayout: true,
        fontSize: 13,
        lineHeight: 20,
        fontFamily: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace",
        scrollBeyondLastLine: false,
        tabSize: 4,
        padding: { top: 12 },
        smoothScrolling: true,
        renderLineHighlight: 'all',
        acceptSuggestionOnEnter: 'on',
        formatOnType: true,
        formatOnPaste: true,
        minimap: { enabled: true, renderCharacters: false },
        scrollbar: {
            verticalScrollbarSize: 10,   // độ rộng vùng thanh cuộn dọc (mặc định 14)
            horizontalScrollbarSize: 8, // độ cao vùng thanh cuộn ngang (mặc định 10)
            verticalSliderSize: 8,       // độ rộng phần "con trượt" bên trong, phải ≤ verticalScrollbarSize
            horizontalSliderSize: 6,
        },
    })
    hits = editor.createDecorationsCollection()
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, save)
    open()
})

watch(() => props.path, () => { flash.value = false; open() })
watch(() => props.query, () => markQuery(true))
watch(() => props.content, () => editor && refresh()) // sau khi lưu, nội dung gốc đổi → tính lại trạng thái

onBeforeUnmount(() => {
    media.removeEventListener('change', applyTheme)
    clearTimeout(flashTimer)
    editor?.dispose()
    for (const m of models.values()) m.dispose()
})

function save() {
    if (!isDirty.value) return
    emit('save', props.path, editor.getModel().getValue())
    flash.value = true
    clearTimeout(flashTimer)
    flashTimer = setTimeout(() => (flash.value = false), 1800)
}

function cleanCode() {
    const m = editor.getModel()
    editor.pushUndoStop()
    editor.executeEdits('clean-cs', [{ range: m.getFullModelRange(), text: stripComments(m.getValue(), 'cs') }])
    editor.pushUndoStop()
}

function download() {
    const url = URL.createObjectURL(new Blob([editor.getModel().getValue()], { type: 'text/plain' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: props.fileName })
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
}
</script>