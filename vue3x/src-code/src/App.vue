<template>
  <div class="app-layout" @click.stop="clckApp">
    <Sidebar />

    <div class="main-area" :style="{ width: `calc(100vw - ${planStore.leftWidth}px)` }">
      <!-- Top header -->
      <header class="top-header">
        <div class="header-left">
          <h1 class="page-title">Interdisziplinäre Themen</h1>
        </div>
        <div class="header-right">
          <span class="header-meta">Vorlage / Besprechung</span>
        </div>
      </header>

      <!-- Tab bar -->
      <div class="tab-bar">
        <div class="tabs">
          <button v-for="tab in tabs" :key="tab" class="tab-btn" :class="{ active: planStore.activeTab === tab }"
            @click="planStore.activeTab = tab">{{ tab }}</button>
        </div>
      </div>

      <!-- Toolbar row -->
      <div class="toolbar">
        <div class="toolbar-left">
          <button class="add-btn" @click.stop="toggleMenuAddItem">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Neues Element hinzufügen
          </button>
          <MenuNewItem v-if="'menu-add' == planStore.popMenu.key" />
          <div class="search-box">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input placeholder="Suchen" v-model="searchQuery" />
          </div>
        </div>
        <div class="toolbar-right">
          <button class="icon-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filter
          </button>
        </div>
      </div>

      <!-- Filter chips -->
      <div class="filter-chips">
        <button v-for="chip in chips" :key="chip" class="chip">{{ chip }}</button>
        <div class="table-icons">
          <button class="icon-btn-sm"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 3v18" />
            </svg></button>
          <button class="icon-btn-sm"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg></button>
        </div>
      </div>

      <div class="content-area" :elen="store.itemPanels.length">
        <div class="table-section">
          <div class="table-header" :elen="store.itemPanels.length">
            <div class="th-check"></div>
            <div class="th-expand"></div>
            <div class="th-title">Ziele / Projekte</div>
            <div class="th-region">Region / Level</div>
            <div class="th-responsible">Verantwortlich</div>
            <div class="th-progress"> </div>
            <div class="th-date">Zeitraum</div>
            <div class="th-rowcheck">
              <input type="checkbox" class="row-checkbox" v-model="isFilterChecked" @click.stop="toggleChip" />
            </div>
          </div>
          <div class="table-body">
            <TableRow v-for="item in filteredItems" :key="item.id" :item="item" />
          </div>
          <span v-if="store.itemPanels.length" class="f-arr-w" @mousedown="beginArnFormW"></span>
        </div>
        <EditPanel v-for="(edit, ii) in store.itemPanels" :key="edit.id" 
          :item="edit" :panel-index="ii" :is-second="ii > 0" />
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemenStore } from './stores/themen.js'
import { usePlanStore } from './stores/plan.js'
import Sidebar from './components/Sidebar.vue'
import TableRow from './components/TableRow.vue'
import EditPanel from './components/EditPanel.vue'
import MenuNewItem from './components/MenuNewItem.vue'

const planStore = usePlanStore()
const store = useThemenStore()
const tabs = ['Handlungsplan', 'Board', 'Timeline']
const chips = ['Meine hervorheben', 'Meine Aufgaben', 'Hit Kontext', 'Fälligkeiten', 'Aktive Inaktive']
const searchQuery = ref('')
const isFilterChecked = ref(false)

const filteredItems = computed(() => {
  let sItems = store.visibleItems
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    sItems = sItems.filter(i => i.title.toLowerCase().includes(q))
  }
  if (isFilterChecked.value && planStore.idChecks.size) {
    return sItems.filter(i => planStore.idChecks.has(i.id))
  }
  return sItems
})
function toggleChip(chip) {
  const isCheck = !isFilterChecked.value
  isFilterChecked.value = isCheck
  if (!isCheck && planStore.idChecks.size) {
    planStore.idChecks.clear()
  }
}
function toggleMenuAddItem() {
  const key = `menu-add`
  if (key == planStore.popMenu.key) { planStore.bindPopMenu('', '') }
  else { planStore.bindPopMenu(key, '') }

}
function clckApp() {
  if (planStore.popMenu.key) { planStore.bindPopMenu('', '') }
}
function draggingFormW(e) {
  let dX = e.clientX - planStore.fomInf.x0
  let width = planStore.fomInf.width0 - dX
  width = Math.round(width / store.itemPanels.length)
  if (420 < width && width < 525) {
    planStore.fomInf.width = width
    document.documentElement.style.setProperty('--panel-w', `${width}px`);
  }
}
function beginArnFormW(e) {
  window.addEventListener('mousemove', draggingFormW)
  window.addEventListener('mouseup', stopArnFormW)
  planStore.fomInf.x0 = e.clientX
  planStore.fomInf.width0 = planStore.fomInf.width
}
function stopArnFormW(e) {
  window.removeEventListener('mousemove', draggingFormW)
  window.removeEventListener('mouseup', stopArnFormW)
  delete planStore.fomInf.x0
  delete planStore.fomInf.width0
}

</script>

<style scoped>
.content-area {
  flex: 1; grid-template-columns: auto 0; display: grid;
}
.content-area[elen="1"] { grid-template-columns: auto var(--panel-w); }
.content-area[elen="2"] { grid-template-columns: auto var(--panel-w) var(--panel-w); }
.table-section {
  display: flex;position: relative;
  flex-direction: column;
}
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
}

.th-rowcheck {
  display: inline-flex;
  justify-content: center;
}

.main-area {
  flex: 1;
  width: calc(100vw - 52px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface);
}

/* Header */
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 52px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.page-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-meta {
  font-size: 12px;
  color: var(--text-muted);
}

/* Tabs */
.tab-bar {
  padding: 0 24px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.tabs {
  display: flex;
  gap: 0;
}

.tab-btn {
  font-size: 13px;
  padding: 10px 16px;
  color: var(--text-secondary);
  border-bottom: 2px solid transparent;
  transition: var(--transisall);
  margin-bottom: -1px;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  color: var(--accent-blue);
  border-bottom-color: var(--accent-blue);
  font-weight: 500;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  position: relative;
  align-items: center;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: var(--accent-blue);
  padding: 5px 10px;
  border-radius: var(--radius);
  border: 1px solid transparent;
  transition: var(--transisall);
  font-weight: 500;
}

.add-btn:hover {
  background: var(--accent-blue-light);
  border-color: #bfdbfe;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 5px 10px;
}

.search-box svg {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 12.5px;
  color: var(--text-primary);
  width: 160px;
}

.search-box input::placeholder {
  color: var(--text-muted);
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: var(--text-secondary);
  padding: 5px 10px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  transition: var(--transisall);
}

.icon-btn:hover {
  background: var(--bg);
  color: var(--text-primary);
}

/* Filter chips */
.filter-chips {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 24px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.chip {
  font-size: 11.5px;
  padding: 3px 10px;
  border-radius: 20px;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  transition: var(--transisall);
  cursor: pointer;
}

.chip:hover {
  border-color: var(--accent-blue);
  color: var(--accent-blue);
  background: var(--accent-blue-light);
}

.table-icons {
  margin-left: auto;
  display: flex;
  gap: 4px;
}

.icon-btn-sm {
  width: 26px;
  height: 26px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.icon-btn-sm:hover {
  background: var(--bg);
  color: var(--text-secondary);
}

/* Table */
.table-header {
  display: grid;
  grid-template-columns: 28px 20px auto 220px 120px 117px 216px 28px;
  align-items: center;
  height: 34px;
  padding: 0 4px;
  border-bottom: 1px solid var(--border);
  background: #fafbfc;
  flex-shrink: 0;
}
@media (max-width: 1920px) {
  .table-header[elen="2"] { grid-template-columns: 28px 20px auto 0 0 117px 216px 28px; }
  .table-header[elen="2"]>.th-region, .table-header[elen="2"]>.th-responsible { opacity: 0; }
}

.table-header>div {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.th-title {
  padding-left: 4px;
}

.th-date {
  text-align: right;
  padding-right: 6px;
}

.table-body {
  flex: 1;
  overflow-y: auto;
}

</style>
