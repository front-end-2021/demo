<template>
  <div class="ecntn" :class="{ 'fom-nd': 0 < panelIndex }">
    <!-- Panel toolbar -->
    <div class="etoolbar">
      <div class="pane-acts">
        <button class="tool-btn" title="Vorheriger" @click="openFparent" v-html="icArl"></button>
        <button v-if="store.anyChild(item.id)" class="tool-btn" @click="opFormChild" v-html="icArr"></button>
        <button class="tool-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="12" r="2" />
          </svg>
        </button>
        <span style="font-size: 12px;">{{item.title ? 'Edit' : 'New'}}</span>
      </div>
      <div class="pane-acts">
        <button class="tool-btn" title="Löschen" @click="delItem" v-html="icDel"></button>
        <button class="tool-btn" title="Duplizieren">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
        </button>
        <button class="tool-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
          </svg>
        </button>
        <button class="tool-btn save-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" @click.stop="saveClose">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
          </svg>
        </button>
        <button class="tool-btn close-btn" @click="closeX" v-html="icClse"></button>
      </div>
    </div>

    <!-- Panel content -->
    <div class="body" @scroll="scrollBody">
      <!-- Title section -->
      <div class="tlt-section">
        <span class="item-dot" v-html="icType[item.type]" ref="d-icn" @click.stop="togglePalletColors"></span>
        <textarea class="title-input" v-model="localItem.title" @blur="blurName" name="item-name" ref="d-nm"
          placeholder="Type new name"></textarea>
        <div class="title-tags">
          <span v-for="t in localItem.tags" :key="t" class="tag" :class="t.toLowerCase()"
            @click.stop="clkTag(t.toLowerCase())">{{ t }}</span>
        </div>
        <PalletColor v-if="gappStore.popMenu === `edit-item-${item.id}`" :item="item" />
      </div>

      <!-- Action buttons -->
      <div class="pane-acts-row">
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

      <MiniGantt v-if="item.type < ITEM_TYPES.ORDNER" :item="item" />

      <!-- Fields -->
      <div class="p-fields">
        <!-- Region -->
        <div class="field-row">
          <label class="fld-lbl">Region</label>
          <PopMultiChose :items="accStore.regions.map(x => x.title)" :values="localItem.regions"
            placeholder="Weitere Region hinzufügen" @selection="selectRegion" @add:text="addRegion"
            @rm:text="removeRegion" />
        </div>

        <!-- Team -->
        <div class="field-row">
          <label class="fld-lbl">Team / Abteilung</label>
          <div class="fld-v">
            <input class="plain-input" placeholder="Neues Element hinzufügen" v-model="localItem.team[0]"
              @blur="save" />
          </div>
        </div>

        <!-- Verantwortlich -->
        <div class="field-row">
          <label class="fld-lbl">Verantwortlich</label>
          <div class="fld-v">
            <input class="plain-input" placeholder="Neues Element hinzufügen" v-model="localItem.lsresp" @blur="save" />
          </div>
        </div>

        <!-- Kategorie -->
        <div class="field-row">
          <label class="fld-lbl">Kategorie</label>
          <div class="fld-v">
            <input class="plain-input" placeholder="Neues Element hinzufügen" v-model="localItem.category[0]"
              @blur="save" />
          </div>
        </div>

        <!-- Anspruchsgruppe -->
        <div class="field-row">
          <label class="fld-lbl">Anspruchsgruppe</label>
          <div class="fld-v">
            <input class="plain-input" placeholder="Neues Element hinzufügen" v-model="localItem.anspruch[0]"
              @blur="save" />
          </div>
        </div>

        <!-- Zeitraum -->
        <div class="field-row" v-if="item.type < ITEM_TYPES.ORDNER">
          <label class="fld-lbl">Zeitraum</label>
          <DateRange :type="2" :start="localItem.dateStart" :end="localItem.dateEnd" @blur="svDate"
            :names="[`start-${item.id}`, `end-${item.id}`]">
            <span class="date-sep">→</span>
          </DateRange>
        </div>

        <!-- Fortschritt -->
        <div class="field-row">
          <label class="fld-lbl">Fortschritt</label>
          <div class="fld-v">
            <input class="plain-input" placeholder="z.B. +85%" v-model="localItem.progress" @blur="save" />
          </div>
        </div>
      </div>
      <LinkAreas :parent="item" />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, useTemplateRef, onMounted, ref, nextTick, computed } from 'vue'
import { useThemenStore } from '../stores/themen'
import { useAccStore } from '../stores/account'
import { useGappStore } from '../stores/gapp'
import { usePlanStore } from '../stores/plan'
import { useKRStore } from '../stores/okr'
import MiniGantt from './MiniGantt.vue'
import PalletColor from './PalletColor.vue'
import PopMultiChose from './PopMultiChose.vue'
import LinkAreas from './LinkAreas.vue'
import DateRange from './DateRange.vue'
import { icType, styleSvgColor, clickTag, icArl, icArr, icDel, icClse } from '../utils/utility.js'
import { ITEM_TYPES, ITEM_FTYPE } from '../constants.js'

const dIcon = useTemplateRef('d-icn')
const dName = useTemplateRef('d-nm')
const props = defineProps({
  item: { type: Object, required: true },
  panelIndex: { type: Number, default: 0 },
})

const gappStore = useGappStore()
const planStore = usePlanStore()
const store = useThemenStore()
const krStore = useKRStore()
const accStore = useAccStore()

const localItem = reactive({
  ...props.item,
  regions: accStore.getRegionsBy(props.item.regions),
  tags: [...(props.item.tags)]
}
)

watch(() => props.item, (v) => {
  Object.assign(localItem, {
    ...v,
    regions: accStore.getRegionsBy(v.regions),
    tags: [...(v.tags)]
  })
}, { deep: true })

watch(() => props.item.color, (c) => { styleSvgColor(dIcon, c) }, { deep: true })

onMounted(async () => {
  styleSvgColor(dIcon, props.item.color)
  dName.value.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault() } // Prevents the default newline behavior
  });
  dName.value.focus()
})

function togglePalletColors() {
  const key = `edit-item-${props.item.id}`
  if (key == gappStore.popMenu) { gappStore.popMenu = '' }
  else { gappStore.popMenu = key }
}
function blurName() { store.updateItem(props.item.id, localItem, ITEM_FTYPE.name) }
function save() {
  let newName = localItem.title.trim()
  const item = props.item
  if (!newName) {
    krStore.setKrForm(-1)
    store.closePanelAt(props.panelIndex)
    if (!item.title) { store.removeItem(item.id) }
    return
  }
  store.updateItem(item.id, localItem)
}
function svDate(obj) { 
  localItem[obj.type] = obj.value
  store.updateItem(props.item.id, localItem, ITEM_FTYPE.date) 
}
function closeX() {
  krStore.setKrForm(-1)
  store.closePanelAt(props.panelIndex)
  const item = props.item
  if (!item.title) { store.removeItem(item.id) }
}
async function saveClose() {
  let newName = localItem.title.trim()
  const item = props.item
  if (newName) {
    store.updateItem(item.id, { ...localItem })
    krStore.setKrForm(-1)
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
function addRegion(txt) {
  if (txt) {
    const newR = accStore.addRegion(txt)
    store.updateItem(props.item.id, [...props.item.regions, newR.id], ITEM_FTYPE.regionIds)
    save()
  }
}
function selectRegion(r) {
  const reg = accStore.regions.find(x => x.title == r)
  if (reg) {
    let item = props.item
    if (!item.regions.includes(reg.id)) {
      store.updateItem(item.id, [...item.regions, reg.id], ITEM_FTYPE.regionIds)
      save()
    }
  }
}
function removeRegion(r) {
  const reg = accStore.regions.find(x => x.title == r)
  if (reg) {
    store.updateItem(props.item.id, props.item.regions.filter(x => x !== reg.id), ITEM_FTYPE.regionIds)
  }
  save()
}
function openFparent() {
  const item = props.item
  let parents = store.getParentChain(item.parentId, 1)
  if (parents.length) {
    let pa = parents[0]
    gappStore.itemPanels = gappStore.itemPanels.filter(x => x.id == item.id)
    gappStore.itemPanels.unshift(pa)
  }
}
function opFormChild() {
  const item = props.item
  let child = store.anyChild(item.id)
  if (child) {
    krStore.setKrForm(-1)
    gappStore.itemPanels = gappStore.itemPanels.filter(x => x.id == item.id)
    gappStore.itemPanels.push(child)
  }
}
function delItem() {
  const item = props.item
  let text = "Press a button!\nEither OK or Cancel.";
  if (confirm(text) == true) {
    gappStore.itemPanels = gappStore.itemPanels.filter(x => x.id != item.id)
    store.removeItem(item.id) // pressed OK
  } else {/* "You canceled!" */ }
}
function clkTag(t) {
  const item = props.item
  gappStore.itemPanels = gappStore.itemPanels.filter(x => x.id == item.id)
  if (!krStore.krForm || krStore.krForm.id != item.id) {
    clickTag(t, item, krStore)
  } else { clickTag(t, { id: -1 }, krStore) }
}
function scrollBody(){
  gappStore.popMenu = ''
}
</script>
<style scoped>
.ecntn {
  width: var(--panel-w);
  background: var(--surface);
  border-left: 1px solid var(--border);
  display: flex;
  height: inherit;
  flex-direction: column;
}

.body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.tlt-section {
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
  field-sizing: content;
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
  cursor: pointer;
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

.pane-acts-row {
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

.p-fields {
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

.fld-lbl {
  width: 120px;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  padding-top: 2px;
}

.fld-v { flex: 1; }

.plain-input {
  border: none;
  outline: none;
  font-size: 12px;
  color: var(--text-secondary);
  background: transparent;
  width: 100%;
}

.plain-input::placeholder {
  color: var(--text-muted);
}

.plain-input:focus {
  color: var(--text-primary);
}

.date-sep {
  color: var(--text-muted);
  font-size: 12px;
}
</style>
