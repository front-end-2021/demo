<template>
  <div class="table-row" :elen="store.itemPanels.length"
    :class="[`level-${item.level}`, { selected: isSelected, 'type-initiative': 9 == item.type }]">
    <!-- Checkbox -->
    <div class="col-check">
      <button class="check-btn" :class="{ done: item.done }" @click.stop="store.toggleDone(item.id)">
        <svg v-if="item.done" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>

    <!-- Expand toggle -->
    <div class="col-expand">
      <button v-if="hasChildren" class="expnd-btn" :class="{ expanded: item.expanded }"
        @click.stop="store.toggleExpand(item.id)">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>

    <!-- Title -->
    <div class="col-title" :style="{
      paddingLeft: `${item.level * 20}px`, maxWidth: colTltWdth
    }">
      <span class="item-dot" v-html="icType[item.type]" ref="item-icon" @click.stop="togglePalletColors"></span>
      <span class="title-text" @click.stop="handleRowClick">{{ item.title }}</span>
      <PalletColor v-if="planStore.popMenu.key == `item-${item.id}`" :item="item" />
    </div>

    <!-- Region / Level -->
    <div class="col-region">
      <span v-for="r in item.regions.slice(0, 3)" :key="r" class="region-pill">{{ r }}</span>
    </div>

    <!-- Verantwortlich -->
    <div class="col-responsible">
      <span v-if="item.responsible" class="responsible-text">{{ item.responsible }}</span>
    </div>

    <!-- Progress + Tags -->
    <div class="col-progress">
      <ProgressBadge :value="item.progress" :color="item.progressColor" />
      <span v-for="t in item.tags" :key="t" class="inline-tag" :class="t.toLowerCase()" @click.stop="clkTag(t, item)">{{
        t }}</span>
    </div>

    <!-- Zeitraum -->
    <div class="col-date">
      <DateRange :start="item.dateStart" :end="item.dateEnd" />
    </div>

    <!-- Row checkbox -->
    <div class="col-rowcheck">
      <input type="checkbox" class="row-checkbox" :checked="planStore.idChecks.has(props.item.id)"
        @click.stop="planStore.toggleCheckFilter(props.item.id)" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, useTemplateRef, onUpdated, nextTick } from 'vue'
import { useThemenStore } from '../stores/themen.js'
import { usePlanStore } from '../stores/plan.js'
import { useKRStore } from '../stores/okr.js'
import ProgressBadge from './ProgressBadge.vue'
import DateRange from './DateRange.vue'
import { icType, styleSvgColor, clickTag } from '../utils/utility.js'
import PalletColor from './PalletColor.vue'

const itemIcon = useTemplateRef('item-icon')
const planStore = usePlanStore()
const props = defineProps({ item: { type: Object, required: true } })
const store = useThemenStore()
const krStore = useKRStore()

const hasChildren = computed(() => store.anyChild(props.item.id))
const isSelected = computed(() => store.itemPanels.map(x => x.id).includes(props.item.id))
const colTltWdth = computed(() => {
  const len = store.itemPanels.length
  if (len < 1) return ''
  const tmpW = planStore.gSize.wdthF * len
  let fWdth = tmpW + 3 + len * 30
  let wTlt = window.innerWidth - planStore.gSize.wdthL - 48 - 8 - 117 - 216 - 28
  if (1 == len) { wTlt -= (220 + 120) }
  return `${wTlt - fWdth}px`
})
onMounted(() => {
  styleSvgColor(itemIcon, props.item.color)
})

onUpdated(() => {
  styleSvgColor(itemIcon, props.item.color)
})
async function handleRowClick() {
  if (planStore.popMenu.key) { planStore.bindPopMenu('', '') }
  const lsEdit = store.itemPanels
  const item = props.item
  let ii = lsEdit.findIndex(x => item.id == x.id)
  if (-1 < ii) {
    krStore.setKrForm(-1)
    lsEdit.splice(ii, 1) // click it self again to close
  } else if (lsEdit.length < 1) {
    lsEdit.push(item)
  } else if (item.parentId) {
    store.itemPanels = lsEdit.filter(x => x.id == item.parentId)
    store.itemPanels.push(item)
  } else {
    lsEdit.splice(0, 1, item)
    lsEdit.splice(1)
  }
}
function togglePalletColors() {
  const key = `item-${props.item.id}`
  if (key == planStore.popMenu.key) {
    planStore.bindPopMenu('', '')
  } else {
    planStore.bindPopMenu(key, props.item.color, props.item.id)
  }
}
function clkTag(t, item) {
  const lsEdit = store.itemPanels
  lsEdit.splice(0, 1, item)
  lsEdit.splice(1)
  clickTag(t.toLowerCase(), item, krStore)
}
</script>
<style scoped>
.table-row {
  display: grid;
  grid-template-columns: 28px 20px auto 220px 120px 117px 216px 28px;
  align-items: center;
  min-height: var(--row-h);
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  padding: 0 4px;
}

.table-row:hover {
  background: #f8f9fc;
}

@media (max-width: 1920px) {
  .table-row[elen="2"] {
    grid-template-columns: 28px 20px auto 0 0 117px 216px 28px;
  }
}

.table-row.type-initiative {
  background: #fafbff;
}

.table-row.type-initiative:hover {
  background: #f3f4ff;
}

.table-row.selected {
  background: #eff6ff;
}

.col-check {
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-btn {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s;
  color: white;
}

.check-btn.done {
  background: var(--accent-green);
  border-color: var(--accent-green);
}

.check-btn:hover {
  border-color: var(--accent-green);
}

.col-expand {
  display: flex;
  align-items: center;
  justify-content: center;
}

.expnd-btn {
  width: 18px;
  height: 18px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: transform 0.15s, color 0.12s;
}

.expnd-btn.expanded {
  transform: rotate(90deg);
}

.expnd-btn:hover {
  color: var(--text-primary);
  background: var(--border);
}

.col-title {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  padding-right: 8px;
}

.type-icon {
  color: var(--text-muted);
  flex-shrink: 0;
  display: flex;
}

.item-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.title-text {
  font-size: 12.5px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  min-width: 90px;
  text-overflow: ellipsis;
}

.col-region {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;
  overflow: hidden;
}

.region-pill {
  font-size: 11px;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 1px 6px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-responsible {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-progress {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
}

.inline-tag {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 3px;
}

.inline-tag.kc {
  background: #fef3c7;
  color: #92400e;
}

.inline-tag.okr {
  background: #ede9fe;
  color: #5b21b6;
}

.col-date {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 6px;
}

.col-rowcheck {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
