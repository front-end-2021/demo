<template>
  <!-- Thanh điều khiển -->
  <header class="control-panel" data-testid="topbar" :style="{ padding: ws.fileIndex != null ? '2px 20px' : '10px 20px'}">
    <h2 data-testid="app-title">Code Explorer</h2>
    <button class="btn-primary" data-testid="btn-select-folder" :disabled="ws.busy" @click="selectFolder">📁 Folder dự án</button>
    <input ref="folderInput" type="file" webkitdirectory multiple hidden data-testid="input-folder" @change="onFolderInput" />
    <label class="check"
      title="Thư viện JS/CSS (jQuery, Bootstrap…), proxy WCF trong Service References, *.Designer.cs… mặc định bị bỏ qua vì làm sơ đồ phình to mà ít giá trị">
      <input v-model="settings.includeVendor" type="checkbox" data-testid="chk-include-vendor" :disabled="ws.busy" 
      @change="ws.reload()" /> Gồm thư viện &amp; mã sinh tự động
    </label>

    <template v-if="ws.hasData">
      <!-- Điều hướng: Tổng quan › project -->
      <nav class="crumbs" data-testid="breadcrumbs">
        <button class="btn-secondary" :class="{ active: ws.view === ViewType.oviw }" data-testid="btn-overview" 
          @click="gs.openView(ViewType.oviw)">Tổng quan</button>
        <span>›</span>
        <select data-testid="select-project" :value="ws.view === ViewType.oviw ? '' : ws.view" @change="gs.openView($event.target.value)">
          <option value="" disabled>{{ws.rootDir}}</option>
          <option v-for="p in ws.projects" :key="p.id" :value="p.id">{{ p.label }} ({{ fmt(p.nodes) }})</option>
        </select>
      </nav>
      <button class="btn-secondary" :class="{ active: layout.explorerOpen }" data-testid="btn-toggle-explorer" :aria-pressed="layout.explorerOpen" title="Mở / đóng danh sách file và tìm kiếm (Ctrl K)"
        @click="layout.toggleExplorer()">Danh sách file</button>
      <button class="btn-secondary" :class="{ active: layout.editorOpen }" data-testid="btn-toggle-editor" :aria-pressed="layout.editorOpen" title="Mở / đóng panel mã nguồn (bấm một node file để xem)"
        @click="layout.toggleEditor()">Mã nguồn</button>
      <button class="btn-secondary" :class="{ active: ws.showReport }" data-testid="btn-report" :aria-pressed="ws.showReport" :disabled="!ws.report"
        @click="clkBaocao">Báo cáo</button>
    </template>
    <div v-if="ws.statusMessage" class="status-text" :class="{ error: ws.isError }" data-testid="status-message" :data-error="ws.isError">{{ ws.statusMessage }}</div>
    <div v-if="ws.stats" class="stats" data-testid="stats" :title="ws.skippedText">
      {{ fmt(ws.stats.files) }} file · {{ fmt(ws.stats.nodes) }} node · {{ fmt(ws.stats.edges) }} liên kết · {{
        ws.stats.projects }}
      project
      <span v-if="ws.skippedText" class="muted">· {{ ws.skippedText }}</span>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useWorkspaceStore } from '../stores/workspace'
import { useGraphStore } from '../stores/graph'
import { useSettingsStore } from '../stores/settings'
import { useLayoutStore } from '../stores/layout'
import { fmt } from '../utils/format'
import { ViewType } from '../utils/viewType'

const ws = useWorkspaceStore()
const gs = useGraphStore()
const settings = useSettingsStore()
const layout = useLayoutStore()
const folderInput = ref(null)

function selectFolder() {
  // Trình duyệt không hỗ trợ showDirectoryPicker (Firefox, Safari) → dùng <input webkitdirectory>
  if (!window.showDirectoryPicker) return folderInput.value.click()
  return ws.pickDirectory()
}

function onFolderInput(e) {
  const files = Array.from(e.target.files) // chép ra trước khi xoá giá trị của input
  e.target.value = ''
  ws.openFileList(files)
}
function clkBaocao() {
  ws.showReport = !ws.showReport
  layout.centerTab = ViewType.graph
}
</script>

<style scoped>
.control-panel {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 12px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.control-panel h2 {
  margin: 0;
  font-size: 15px;
  color: #1e293b;
}

.check {
  display: inline-flex;
  align-items: center;
  gap: 6px; /*width:126px;*/
  font-size: 13px;
  color: #475569;
  cursor: pointer;
}

.crumbs {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
}

.crumbs select {
  max-width: 260px;
  padding: 7px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  background: #fff;
  color: #0f172a;
  font: inherit;
  font-size: 13px;
}

.status-text {
  font-size: 13px;
  color: #2563eb;
  font-weight: 500;
}

.status-text.error {
  color: #dc2626;
}

.stats {
  margin-left: auto;
  font-size: 13px;
  color: #64748b;
}

.muted {
  color: #94a3b8;
}
</style>
