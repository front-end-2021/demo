<template>
  <!-- Khu vực vẽ (Sigma.js dùng WebGL) -->
  <main class="canvas-container">
    <div ref="canvasEl" class="graph-canvas"></div>

    <div v-if="!ws.hasData && !ws.busy" class="empty-state">
      <p v-if="!ws.isError">Chọn thư mục dự án (có thể là cả solution lớn). Sơ đồ mở ở màn hình <b>Tổng quan</b>: mỗi
        node là
        một project.
        Bấm vào một project để xem các file và quan hệ giữa chúng: import, render component, gọi API, kế thừa, dùng
        CSS…
      </p>
    </div>
    <div v-if="ws.busy" class="busy">
      <div class="spinner"></div>{{ ws.statusMessage }}
    </div>

    <GraphLegend />
    <ReportPanel />
    <NodeInfo />
  </main>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useWorkspaceStore } from '../../stores/workspace'
import { useGraphStore } from '../../stores/graph'
import GraphLegend from './GraphLegend.vue'
import NodeInfo from './NodeInfo.vue'
import ReportPanel from '../report/ReportPanel.vue'

const ws = useWorkspaceStore()
const gs = useGraphStore()
const canvasEl = ref(null)

let observer = null
let frame = 0

onMounted(() => {
  gs.mount(canvasEl.value)
  // Vùng vẽ co/giãn khi kéo thanh chia đôi hoặc mở/đóng editor → báo cho Sigma (gộp theo khung hình)
  observer = new ResizeObserver(() => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => gs.resize())
  })
  observer.observe(canvasEl.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
  gs.unmount()
})
</script>

<style scoped>
.canvas-container {
  flex: 1;
  position: relative;
  min-width: 0;
  min-height: 0;
}

.graph-canvas {
  position: absolute;
  inset: 0;
  height: calc(100% - 50px);
}

.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 460px;
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
  pointer-events: none;
}

.busy {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(248, 249, 250, 0.85);
  color: #334155;
  font-size: 14px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #cbd5e1;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
