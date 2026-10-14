<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as monaco from 'monaco-editor';
// self.MonacoEnvironment = {
//     getWorker() { // Cấu hình môi trường tối giản để không phụ thuộc vào file worker vật lý riêng lẻ
//         return new Worker(URL.createObjectURL(new Blob([''], { type: 'application/javascript' })))
//         //  return new Worker('data:text/javascript;charset=utf-8,' + encodeURIComponent(''));// Trả về một worker giả lập hoặc cấu hình rỗng nếu chỉ dùng highlight cơ bản cho C#
//     }
// };
const props = defineProps({
    modelValue: { type: String, default: '' },
    language: { type: String, default: 'csharp' },
})
const emit = defineEmits(['update:modelValue'])

const host = ref(null)
let editor = null

onMounted(() => {
    editor = monaco.editor.create(host.value, {
        value: props.modelValue,
        language: props.language,
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
    (v) => { if (editor && v !== editor.getValue()) editor.setValue(v) },
)

onBeforeUnmount(() => editor?.dispose()) // panel Source dùng v-if nên phải dọn khi ẩn
</script>

<template>
    <div ref="host" class="monaco-host" />
</template>

<style scoped>
.monaco-host {
    width: 100%;
    height: 100%;
}
</style>