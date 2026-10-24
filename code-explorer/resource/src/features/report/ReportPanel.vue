<template>
  <!-- Báo cáo văn bản -->
  <div v-if="ws.showReport && ws.report" class="report">
    <div class="report-head">
      <b>Báo cáo cấu trúc</b>
      <button class="btn-secondary small" @click="copyReport">{{ copied ? 'Đã chép' : 'Chép Markdown' }}</button>
      <button class="btn-secondary small" @click="ws.showReport = false">✕</button>
    </div>
    <pre>{{ ws.report }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWorkspaceStore } from '../../stores/workspace'

const ws = useWorkspaceStore()
const copied = ref(false)

async function copyReport() {
  try {
    await navigator.clipboard.writeText(ws.report)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch { /* trình duyệt chặn clipboard */ }
}
</script>

<style scoped>
.report {
  position: absolute;
  z-index: 6;
  right: 12px;
  top: 12px;
  bottom: 12px;
  width: min(560px, 50%);
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.report-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #e2e8f0;
}

.report-head b {
  flex: 1;
  font-size: 13px;
  color: #0f172a;
}

.report pre {
  flex: 1;
  margin: 0;
  padding: 12px;
  overflow: auto;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  color: #334155;
}
</style>
