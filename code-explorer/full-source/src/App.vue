<template>
  <div class="app-container" data-testid="app" :data-busy="ws.busy" :data-has-data="ws.hasData" :data-view="ws.view">
    <TopBar />
    <div ref="splitEl" class="main-split" data-testid="main-split">
      <template v-if="ws.hasData && showExplorer">
        <ExplorerPanel :style="{ width: layout.explorerWidth + 'px' }" />
        <SplitHandle data-testid="split-handle-explorer" @drag="onDragExplorer" />
      </template>
      <div class="center" data-testid="center-panel">
        <div v-if="ws.fileIndex" class="center-tabs" role="tablist" data-testid="center-tabs">
          <button class="ctab" :class="{ on: layout.centerTab === ViewType.graph }" data-testid="tab-graph" :aria-selected="layout.centerTab === ViewType.graph"
            role="tab" @click="layout.centerTab = ViewType.graph">Sơ đồ file</button>
          <button class="ctab" :class="{ on: layout.centerTab === ViewType.clss }" role="tab" data-testid="tab-class-diagram" :aria-selected="layout.centerTab === ViewType.clss"
            title="Sơ đồ class của các file đang chọn (Ctrl + bấm một file trong danh sách để thêm vào)" 
            @click="layout.centerTab = ViewType.clss">Sơ đồ class<b v-if="diagram.files.length" data-testid="tab-class-diagram-count">{{ diagram.files.length }}</b></button>
          <button class="ctab" :class="{ on: layout.centerTab === ViewType.fltlog }" role="tab" data-testid="tab-filter-logs" :aria-selected="layout.centerTab === ViewType.fltlog"
            title="Lịch sử lọc"
            @click="layout.centerTab = ViewType.fltlog">Lịch sử lọc</button>
          <div class="bts" v-if="layout.centerTab === ViewType.graph" data-testid="graph-actions">
            <button v-if="ws.layingOut" class="btn-secondary small" data-testid="btn-graph-stop-layout" @click="ws.stopLayout()">⏸ Dừng sắp xếp</button>
            <button v-else class="btn-secondary small" data-testid="btn-graph-relayout" @click="gs.reLayout()">Sắp xếp lại</button>
            <button class="btn-secondary small" data-testid="btn-graph-fit" @click="gs.fitView()">Vừa khung</button>
            <button class="btn-secondary small" :class="{ active: gs.visibilityActive }" data-testid="btn-graph-visibility" :disabled="!gs.canFilter"
              :title="gs.visibilityTitle" @click="gs.cycleVisibility()">{{ gs.visibilityLabel }}</button>
          </div>
          <div class="bts" v-if="layout.centerTab === ViewType.clss" data-testid="diagram-actions">
            <button class="btn-secondary small" title="Xếp lại mọi class theo tầng kế thừa" data-testid="btn-diagram-arrange" 
              @click="diagVw.arrange">Xếp tự động</button>
            <span class="sep" />
            <button class="btn-secondary small" aria-label="Thu nhỏ" data-testid="btn-diagram-zoom-out" 
              :disabled="dZoom <= 0.3" @click="diagVw.zoomBy(-0.1)">−</button>
            <span class="zoom" aria-live="polite" data-testid="diagram-zoom-level">{{ Math.round(dZoom * 100) }}%</span>
            <button class="btn-secondary small" aria-label="Phóng to" data-testid="btn-diagram-zoom-in" 
              :disabled="dZoom >= 2" @click="diagVw.zoomBy(0.1)">+</button>
            <button class="btn-secondary small" title="Thu phóng cho vừa khung" data-testid="btn-diagram-fit" 
              @click="diagVw.fit">Vừa khung</button>
          </div>
        </div>
        <!-- v-show: giữ nguyên Sigma (WebGL) khi chuyển tab; sơ đồ class thì dựng lại từ store mỗi lần mở -->
        <GraphView v-show="layout.centerTab === ViewType.graph" />
        <DiagramView v-if="layout.centerTab === ViewType.clss" ref="diagVw"/>
        <FilterLogs v-if="layout.centerTab === ViewType.fltlog" />
      </div>
      <template v-if="layout.editorOpen">
        <SplitHandle data-testid="split-handle-editor" @drag="onDragEditor" />
        <EditorPanel :style="{ width: layout.editorWidth + 'px' }" />
      </template>
    </div>
  </div>
</template>
<script setup>
defineOptions({ name: 'CodeExplorer' })
import { computed, nextTick, onBeforeUnmount, onMounted, ref, defineAsyncComponent } from 'vue'
import TopBar from './components/TopBar.vue'
import FilterLogs from './components/FilterLogs.vue'
import SplitHandle from './components/SplitHandle.vue'
import GraphView from './features/graph/GraphView.vue'
import ExplorerPanel from './features/explorer/ExplorerPanel.vue'
import DiagramView from './features/diagram/DiagramView.vue'
import { useLayoutStore } from './stores/layout'
import { useWorkspaceStore } from './stores/workspace'
import { useSearchStore } from './stores/search'
import { useDiagramStore } from './stores/diagram'
import { useGraphStore } from './stores/graph'
import { ViewType } from './utils/viewType'
const EditorPanel = defineAsyncComponent(() => import('./features/editor/EditorPanel.vue') )

const layout = useLayoutStore()
const ws = useWorkspaceStore()
const gs = useGraphStore()
const search = useSearchStore() // tạo sớm để kết quả tìm kiếm luôn được chuyển sang sơ đồ
const diagram = useDiagramStore() // tạo sớm để chế độ "theo file đang chọn" luôn theo dõi việc chọn file
const diagVw = ref(null)
const splitEl = ref(null)
const showExplorer = computed(() => layout.explorerOpen && !!ws.fileIndex)
const dZoom = computed(() => {
  if(diagVw.value == null) { return 0 }
  return diagVw.value.zoom
})
// Explorer ở bên trái: độ rộng = vị trí con trỏ − mép trái vùng chứa. Editor ở bên phải: ngược lại.
function onDragExplorer(clientX) {
  const rect = splitEl.value.getBoundingClientRect()
  layout.setExplorerWidth(clientX - rect.left, rect.width)
}

function onDragEditor(clientX) {
  const rect = splitEl.value.getBoundingClientRect()
  layout.setEditorWidth(rect.right - clientX, rect.width)
}

// Ctrl/Cmd + K: mở Explorer và đưa con trỏ vào ô tìm (bắt ở pha capture để cả khi đang ở trong editor cũng dùng được)
async function onKeydown(e) {
  if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey || e.key.toLowerCase() !== 'k') return
  e.preventDefault()
  if (!ws.fileIndex) return
  layout.explorerOpen = true
  await nextTick() // chờ panel dựng xong rồi mới yêu cầu focus
  search.focusInput()
}

onMounted(() => window.addEventListener('keydown', onKeydown, true))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown, true))
</script>
<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: #f8f9fa;
}
.bts { display: inline-flex; gap: 6px; align-items: center; padding: 2px 12px; }
.main-split {
  flex: 1;
  display: flex;
  min-height: 0;
}

.center {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.center-tabs {
  flex: none;
  padding: 1px 12px 0 12px;
  background: #fff;
}

.ctab {
  padding: 7px 14px;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  color: #64748b;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.ctab:hover {
  color: #0f172a;
}

.ctab.on {
  border-bottom-color: #2563eb;
  color: #1d4ed8;
  font-weight: 600;
}

.ctab b {
  margin-left: 6px;
  padding: 0 6px;
  border-radius: 999px;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 11px;
  font-weight: 600;
}
</style>
<style src="./utils/diag.css" scoped></style>
