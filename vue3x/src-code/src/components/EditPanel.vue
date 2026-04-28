<template>
  <div class="edit-panel " :class="{ 'second-panel': isSecond }">
    <!-- Panel toolbar -->
    <div class="panel-toolbar">
      <div class="panel-nav">
        <button class="tool-btn" title="Vorheriger" @click="closeX">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" />
          </svg></button>
        <button class="tool-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <path d="M9 18l6-6-6-6" />
          </svg></button>
        <button class="tool-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <circle cx="12" cy="12" r="2" />
            <circle cx="6" cy="12" r="2" />
            <circle cx="18" cy="12" r="2" />
          </svg></button>
      </div>
      <div class="panel-actions">
        <button class="tool-btn" title="Löschen"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2">
            <polyline points="3,6 5,6 21,6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg></button>
        <button class="tool-btn" title="Duplizieren"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg></button>
        <button class="tool-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg></button>
        <button class="tool-btn save-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" @click.stop="saveClose">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg></button>
        <button class="tool-btn close-btn" @click="closeX">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Panel content -->
    <div class="panel-body">
      <!-- Title section -->
      <div class="panel-title-section">
        <span class="item-dot" v-html="appType[item.type][1]" ref="d-icn" @click.stop="togglePalletColors"></span>
        <textarea class="title-input" v-model="localItem.title" @blur="blurName" rows="2" name="item-name" ref="d-nm"
          placeholder="Type new name"></textarea>
        <div class="title-tags">
          <span v-for="t in localItem.tags" :key="t" class="tag" :class="t.toLowerCase()">{{ t }}</span>
        </div>
        <PalletColor v-if="planStore.popMenu.key == `edit-item-${item.id}`" :item="item" />
      </div>

      <!-- Action buttons -->
      <div class="panel-actions-row">
        <button class="action-btn milestone-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
          Als Meilenstein markieren
        </button>
        <button v-if="localItem.title.trim()" class="action-btn done-btn" :class="{ active: localItem.done }"
          @click="toggleDone">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Als erledigt markieren
        </button>
        <div class="pin-info" v-if="localItem.pinned">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Angepinnt {{ localItem.pinned }}
        </div>
      </div>

      <!-- Mini Gantt -->
      <MiniGantt :item="item" />

      <!-- Fields -->
      <div class="panel-fields">
        <!-- Region -->
        <div class="field-row">
          <label class="field-label">Region</label>
          <div class="field-value">
            <div class="tag-list">
              <span v-for="r in localItem.region" :key="r" class="region-tag">
                {{ r }}
                <button @click="removeRegion(r)" class="tag-remove">×</button>
              </span>
              <input class="tag-input" placeholder="Weitere Region hinzufügen" v-model="newRegion"
                @keydown.enter="addRegion" />
            </div>
          </div>
        </div>

        <!-- Team -->
        <div class="field-row">
          <label class="field-label">Team / Abteilung</label>
          <div class="field-value">
            <input class="plain-input" placeholder="Neues Element hinzufügen" v-model="localItem.team[0]"
              @blur="save" />
          </div>
        </div>

        <!-- Verantwortlich -->
        <div class="field-row">
          <label class="field-label">Verantwortlich</label>
          <div class="field-value">
            <input class="plain-input" placeholder="Neues Element hinzufügen" v-model="localItem.responsible"
              @blur="save" />
          </div>
        </div>

        <!-- Kategorie -->
        <div class="field-row">
          <label class="field-label">Kategorie</label>
          <div class="field-value">
            <input class="plain-input" placeholder="Neues Element hinzufügen" v-model="localItem.category[0]"
              @blur="save" />
          </div>
        </div>

        <!-- Anspruchsgruppe -->
        <div class="field-row">
          <label class="field-label">Anspruchsgruppe</label>
          <div class="field-value">
            <input class="plain-input" placeholder="Neues Element hinzufügen" v-model="localItem.anspruch[0]"
              @blur="save" />
          </div>
        </div>

        <!-- Zeitraum -->
        <div class="field-row">
          <label class="field-label">Zeitraum</label>
          <div class="field-value date-fields">
            <input class="date-input" placeholder="Von" v-model="localItem.dateStart" @blur="save" />
            <span class="date-sep">→</span>
            <input class="date-input" placeholder="Bis" v-model="localItem.dateEnd" @blur="save" />
          </div>
        </div>

        <!-- Fortschritt -->
        <div class="field-row">
          <label class="field-label">Fortschritt</label>
          <div class="field-value">
            <input class="plain-input" placeholder="z.B. +85%" v-model="localItem.progress" @blur="save" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed, useTemplateRef, onMounted, onUpdated, ref, nextTick } from 'vue'
import { useThemenStore } from '../stores/themen.js'
import { usePlanStore } from '../stores/plan.js'
import MiniGantt from './MiniGantt.vue'
import PalletColor from './PalletColor.vue'
import { appType, styleSvgColor } from '../utils/utility.js'

const dIcon = useTemplateRef('d-icn')
const dName = useTemplateRef('d-nm')
const props = defineProps({
  item: { type: Object, required: true },
  panelIndex: { type: Number, default: 0 },
  isSecond: { type: Boolean, default: false },
})

const planStore = usePlanStore()
const store = useThemenStore()
const newRegion = ref('')

const localItem = reactive({ ...props.item, region: [...(props.item.regions || [])], tags: [...(props.item.tags || [])] })

watch(() => props.item, (v) => {
  Object.assign(localItem, { ...v, region: [...(v.regions || [])], tags: [...(v.tags || [])] })
}, { deep: true })

onMounted(() => {
  styleSvgColor(dIcon, props.item.color)
  dName.value.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault() } // Prevents the default newline behavior
  });
  dName.value.focus()
})

onUpdated(() => {
  styleSvgColor(dIcon, props.item.color)
})
function togglePalletColors() {
  const key = `edit-item-${props.item.id}`
  if (key == planStore.popMenu.key) {
    planStore.bindPopMenu('', '')
  } else {
    planStore.bindPopMenu(key, props.item.color, props.item.id)
  }
}
function blurName() { store.updateItem(item.id, { ...localItem }) }
async function save() {
  const newName = localItem.title.trim()
  const item = props.item
  if (!newName) {
    store.closePanelAt(props.panelIndex)
    if (!item.title) { store.removeItem(item.id) }
    return
  }
  store.updateItem(item.id, { ...localItem })
}
function closeX() {
  store.closePanelAt(props.panelIndex)
  const item = props.item
  if (!item.title) { store.removeItem(item.id) }
}
async function saveClose() {
  const newName = localItem.title.trim()
  const item = props.item
  if (newName) {
    store.updateItem(item.id, { ...localItem })
    store.closePanelAt(props.panelIndex)
  } else {
    localItem.title = item.title
    await nextTick()
    dName.value.focus()
  }
}
function toggleDone() {
  localItem.done = !localItem.done
  save()
}

function addRegion() {
  if (newRegion.value.trim()) {
    localItem.region = [...localItem.region, newRegion.value.trim()]
    newRegion.value = ''
    save()
  }
}

function removeRegion(r) {
  localItem.region = localItem.region.filter(x => x !== r)
  save()
}
</script>

<style scoped>
.edit-panel {
  width: var(--panel-w);
  flex-shrink: 0;
  background: var(--surface);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn 0.18s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(20px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.panel-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  height: 44px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.panel-nav,
.panel-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.tool-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.12s;
}

.tool-btn:hover {
  background: var(--bg);
  color: var(--text-primary);
}

.close-btn:hover {
  background: #fee2e2;
  color: var(--accent-red);
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.panel-title-section {
  display: flex;
  position: relative;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
}

.item-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.item-dot.green {
  background: #22c55e;
}

.item-dot.blue {
  background: #3b82f6;
}

.item-dot.gray {
  background: #9ca3af;
}

.title-input {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  border: none;
  outline: none;
  resize: none;
  line-height: 1.5;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
}

.title-input:focus {
  background: var(--accent-blue-light);
  border-radius: var(--radius-sm);
  padding: 2px 4px;
}

.title-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.tag {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.tag.kc {
  background: #fef3c7;
  color: #92400e;
}

.tag.okr {
  background: #ede9fe;
  color: #5b21b6;
}

.panel-actions-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  transition: all 0.12s;
}

.action-btn:hover {
  border-color: var(--border-hover);
  background: var(--bg);
}

.done-btn.active {
  background: var(--accent-green-light);
  color: var(--accent-green);
  border-color: #86efac;
}

.pin-info {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 3px;
}

.panel-fields {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.field-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.field-row:last-child {
  border-bottom: none;
}

.field-label {
  width: 130px;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  padding-top: 2px;
}

.field-value {
  flex: 1;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.region-tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: var(--accent-blue-light);
  color: var(--accent-blue);
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
}

.tag-remove {
  font-size: 13px;
  line-height: 1;
  color: var(--accent-blue);
  opacity: 0.6;
}

.tag-remove:hover {
  opacity: 1;
}

.tag-input,
.plain-input {
  border: none;
  outline: none;
  font-size: 12px;
  color: var(--text-secondary);
  background: transparent;
  width: 100%;
}

.tag-input::placeholder,
.plain-input::placeholder {
  color: var(--text-muted);
}

.tag-input:focus,
.plain-input:focus {
  color: var(--text-primary);
}

.date-fields {
  display: flex;
  align-items: center;
  gap: 6px;
}

.date-input {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 3px 8px;
  font-size: 12px;
  width: 90px;
  outline: none;
  color: var(--text-primary);
}

.date-input:focus {
  border-color: var(--accent-blue);
}

.date-sep {
  color: var(--text-muted);
  font-size: 12px;
}
</style>
