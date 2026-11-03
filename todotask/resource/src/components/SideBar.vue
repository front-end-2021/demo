<script setup>
import { ref } from 'vue'
import { useUiStore, SIDEBAR_MIN } from '../stores/ui'
import Icon from './Icon.vue'
import { onDown, onMoving, onUp, dragging } from '../mixins/useResizer'
import { VIEWTYPE, LABELTYPE } from '../utils/common.js'

const ui = useUiStore()

const items = [
  { key: VIEWTYPE.mtasks, label: LABELTYPE.mtasks, icon: 'check-square' },
  { key: VIEWTYPE.dboard, label: LABELTYPE.dboard, icon: 'grid' },
  { key: VIEWTYPE.lsmess, label: LABELTYPE.lsmess, icon: 'chat' },
  { key: VIEWTYPE.neews, label: LABELTYPE.neews, icon: 'newspaper' },
  { key:  VIEWTYPE.lstodo, label: LABELTYPE.lstodo, icon: 'checklist' },
]
function moving(e) {
  ui.setSidebarWidth(e.clientX) // sidebar nằm sát mép trái màn hình
}
</script>

<template>
  <aside class="sbr a" :class="{ expanded: ui.sidebarExpanded, dragging }" :style="{ width: ui.sidebarWidth + 'px' }">
    <nav class="nav" aria-label="Areas">
      <button v-for="it in items" :key="it.key" class="item" :class="{ active: ui.activeArea === it.key }"
        :title="ui.sidebarExpanded ? '' : it.label" :aria-label="it.label" @click="ui.activeArea = it.key">
        <Icon :name="it.icon" :size="20" />
        <span v-show="ui.sidebarExpanded" class="label">{{ it.label }}</span>
      </button>
    </nav>
    <div class="resizer" role="separator" aria-orientation="vertical" parent=".sbr"
      title="Kéo để chỉnh độ rộng · double-click để thu gọn" @pointerdown="onDown"
      @pointermove="onMoving($event, moving)" @pointerup="onUp" @pointercancel="onUp"
      @dblclick="ui.setSidebarWidth(SIDEBAR_MIN)" />
  </aside>
</template>

<style scoped>
.sbr {
  position: relative;
  flex: none;
  height: 100%;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-right: 1px solid rgba(255, 255, 255, 0.6);
  z-index: 10;
}
.a.dragging .resizer[data-initx]::after {
  background: var(--primary);
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 7px;
  overflow: hidden;
}

.item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 38px;
  padding: 0 9px;
  border-radius: 10px;
  color: var(--text-2);
  white-space: nowrap;
  text-align: left;
  transition: background 0.15s, color 0.15s;
}

.item:hover {
  background: rgba(20, 27, 45, 0.06);
}

.item.active {
  background: #fff;
  color: var(--primary);
  box-shadow: 0 1px 2px rgba(20, 27, 45, 0.1), 0 0 0 1px rgba(20, 27, 45, 0.04);
}

.label {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
