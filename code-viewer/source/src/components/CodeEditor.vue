<template>
    <div class="code-content-wrapper">
        <!-- Header hiển thị thông tin file bên trong Component -->
        <div class="code-viewer-header">
            <h4 style="margin:0;">📂 {{ fileDir }}{{ fileName }}</h4>
            <div class="header-meta">
                <span class="language-badge">Ngôn ngữ: {{ currentLanguage.toUpperCase() }}</span>
                <span class="file-size">Dung lượng: {{ (fileSize / 1024).toFixed(2) }} KB</span>
            </div>
        </div>
        <div ref="host" class="monaco-host" />
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as monaco from 'monaco-editor';

const props = defineProps({
    fileName: { type: String, required: true },
    fileDir: { type: String, required: true },
    modelValue: { type: String, default: '' },
    fileSize: { type: Number, required: true },
    fileExt: { type: String, required: true }
});
// Hàm tự động map đuôi file sang ngôn ngữ của Monaco
const currentLanguage = computed(() => {
    const map = {
        '.cs': 'csharp',
        '.java': 'java',
        '.py': 'python',
        '.js': 'javascript',
        '.ts': 'typescript',
        '.json': 'json',
        '.xml': 'xml',
        '.yml': 'yaml',
        '.yaml': 'yaml',
        '.html': 'html',
        '.css': 'css',
        '.md': 'markdown',
        '.sh': 'shell'
    };
    return map[props.fileExt] || 'plaintext';
});
const emit = defineEmits(['update:modelValue'])

const host = ref(null)
let editor = null

onMounted(() => {
    editor = monaco.editor.create(host.value, {
        value: props.modelValue,
        language: currentLanguage.value,
        theme: 'vs',
        automaticLayout: true, // tự co giãn khi kéo thanh resizer hoặc đổi cỡ cửa sổ
        fontSize: 12.5,
        fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
        scrollBeyondLastLine: false,
        wordWrap: 'off',
        tabSize: 4,
        // --- CẤU HÌNH CHO CHẾ ĐỘ CHỈNH SỬA (EDIT) ---
        readOnly: false,             // BẬT chế độ chỉnh sửa
        domReadOnly: false,          // Cho phép mở bàn phím ảo trên thiết bị di động
        acceptSuggestionOnEnter: "on", // Tự động hoàn thành từ khi nhấn Enter
        formatOnType: true,          // Tự động căn lề (format) khi gõ code
        formatOnPaste: true,         // Tự động format khi paste code từ ngoài vào
        minimap: { enabled: true }
    })
    editor.onDidChangeModelContent(() => {
        const v = editor.getValue()
        if (v !== props.modelValue) emit('update:modelValue', v)
    })
})
// Khi nơi khác đổi source (ví dụ nút Sample) thì cập nhật vào editor
watch(
    () => props.modelValue,
    (v) => {
        if (editor && v !== editor.getValue()) {
            const model = editor.getModel(); // Lấy model hiện tại của editor
            monaco.editor.setModelLanguage(model, currentLanguage.value); // Cập nhật ngôn ngữ của model dựa trên đuôi file
            editor.setValue(v)
        }
    },
)
onBeforeUnmount(() => editor?.dispose()) // panel Source dùng v-if nên phải dọn khi ẩn
</script>

<style scoped>
.monaco-host {
    width: 100%;
    height: 100%;
}

.code-content-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: #1e1e1e;
}

.code-viewer-header {
    padding: 6px 12px;
    background-color: #0088d2;
    border-bottom: 1px solid #0075b7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
}

.code-viewer-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
}

.header-meta {
    display: flex;
    gap: 15px;
    align-items: center;
}

.language-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    color: #fff;
}

.file-size {
    font-size: 12px;
    color: white;
}
</style>
