<template>
  <!-- Chú thích -->
  <div v-if="ws.hasData && ws.view === ViewType.oviw" class="legend">
    <span>Mỗi node là một project (to hơn = nhiều file hơn)</span>
    <span><i class="line"></i>số trên cạnh = số tham chiếu</span>
    <span><b>Bấm vào project để xem chi tiết</b></span>
  </div>
  <div v-else-if="ws.hasData" class="legend">
    <label v-for="(color, kind) in KIND_COLORS" :key="kind" class="kind"
      :title="`Chọn hình dạng cho node ${KIND_LABELS[kind]}`">
      <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
        <component :is="shapeIcon(settings.shapes[kind]).tag" v-bind="shapeIcon(settings.shapes[kind]).attrs"
          :fill="color" />
      </svg>
      {{ KIND_LABELS[kind] }}
      <select :value="settings.shapes[kind]" @change="gs.setShape(kind, $event.target.value)">
        <option v-for="(name, shape) in SHAPES" :key="shape" :value="shape">{{ name }}</option>
      </select>
    </label>
    <span v-for="(label, kind) in EDGE_LABELS" :key="kind"><i class="line"
        :style="{ background: EDGE_COLORS[kind] }"></i>{{ label }}</span>
    <span><i class="line faint"></i>Nét nhạt = suy đoán (khớp theo tên / URL)</span>
    <span><i class="ghost"></i>Node của project khác (bấm đúp để mở)</span>
  </div>
</template>

<script setup>
import { SHAPES, shapeIcon } from '../../analyzer/node-shapes'
import { useWorkspaceStore } from '../../stores/workspace'
import { useGraphStore } from '../../stores/graph'
import { useSettingsStore } from '../../stores/settings'
import { KIND_COLORS, KIND_LABELS, EDGE_COLORS, EDGE_LABELS } from './constants'
import { ViewType } from '../../utils/viewType'

const ws = useWorkspaceStore()
const gs = useGraphStore()
const settings = useSettingsStore()
</script>

<style scoped>
.legend {
  position: absolute;
  z-index: 5;
  left: 0;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 14px;
  max-width: calc(100% - 6px);
  padding: 8px 12px 2px 12px;
  font-size: 12px;
  color: #475569;
  background: rgba(255, 255, 255, 0.94);
  border-radius: 6px;
}

.legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend .kind {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.legend select {
  font: inherit;
  font-size: 11px;
  color: #475569;
  padding: 1px 2px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.legend i.line {
  width: 16px;
  height: 2px;
  background: #94a3b8;
}

.legend i.line.faint {
  background: #94a3b8;
  opacity: 0.4;
}

.legend i.ghost {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #cbd5e1;
  border: 1px dashed #64748b;
}
</style>
