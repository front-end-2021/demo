<template>
  <!-- Bảng thông tin -->
  <div v-if="gs.info && !ws.showReport" class="info">
    <b>{{ gs.info.label }}</b>
    <span v-for="(line, i) in gs.info.lines" :key="i">{{ line }}</span>
    <span v-if="gs.info.symbols?.length" class="symbols">Định nghĩa: {{ gs.info.symbols.join(', ') }}</span>
    <button v-if="gs.info.open" class="btn-primary small" @click="gs.openView(gs.info.open.view, gs.info.open.focus)">Mở
      {{ gs.info.open.label }} →</button>
  </div>
</template>

<script setup>
import { useWorkspaceStore } from '../../stores/workspace'
import { useGraphStore } from '../../stores/graph'

const ws = useWorkspaceStore()
const gs = useGraphStore()
</script>

<style scoped>
.info {
  position: absolute;
  z-index: 5;
  right: 12px;
  top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px 14px;
  max-width: 380px;
  padding: 8px 12px 2px 12px;
  font-size: 12px;
  color: #475569;
  background: rgba(255, 255, 255, 0.94);
  border-radius: 6px;
}

.info b {
  color: #0f172a;
  font-size: 13px;
  word-break: break-all;
}

.info span {
  word-break: break-all;
}

.info .symbols {
  color: #64748b;
  word-break: normal;
}
</style>
