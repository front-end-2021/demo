<template>
  <div class="kr-rowwrap" :style="{ width: props.width + 'px' }">
    <!-- Header row -->
    <div class="kr-header">
      <div class="header-left">
        <div class="section-label">Key Result</div>
        <div class="kr-name">{{ kr.name || '(Kein Name)' }}</div>
      </div>
      <div class="divider-v" />
      <div class="header-right">
        <div class="section-label">Beschreibung</div>
        <div class="kr-des">{{ kr.des || '—' }}</div>
      </div>
      <button class="delete-btn" @click="$emit('delete', kr.id)" title="Löschen">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5L11 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <div class="kr-meta-data" :style="{ flexDirection: 510 < props.width ? '' : 'column' }">
      <div class="kr-meta-row">
        <!-- Meta row: badge + toggles -->
        <div class="kr-wrap">
          <span class="badge" :class="kr.lagging ? 'lagging' : 'leading'">
            {{ kr.lagging ? 'Lagging' : 'Leading' }}
          </span>
          <button class="info-btn">
            <svg viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.2" />
              <path d="M7 6v4M7 4.5v.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <!-- % / effektiv radio -->
        <div class="kr-wrap">
          <label class="radio-label">
            <input type="radio" name="unitType" :value="1" v-model="localUnit" @change="onUnitChange" />
            <span>%</span>
          </label>
          <label class="radio-label">
            <input type="radio" name="unitType" :value="3" v-model="localUnit" @change="onUnitChange" />
            <span>effektiv</span>
          </label>
        </div>
      </div>

      <!-- Data row: Kennzahl | Soll | KI% | +/- | Ist -->
      <div class="kr-data-row">
        <div class="data-col">
          <div class="col-label">
            Kennzahl
            <button class="icon-btn">
              <svg viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2" />
                <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2" />
                <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2" />
                <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2" />
              </svg>
            </button>
          </div>
          <OneDropdown :src="kennzahlOptions" v-model="localKennzahl" @selection="onKennzahlSelect" />
        </div>

        <div class="data-col">
          <div class="col-label">Soll</div>
          <div class="data-value muted">+{{ kr.target }}{{ unitSymbol }}</div>
        </div>

        <div class="data-col">
          <div class="col-label">KI%</div>
          <div class="data-value muted">{{ ki !== null ? '+' + ki + '%' : '—' }}</div>
        </div>

        <div class="data-col">
          <div class="col-label">+/-</div>
          <div class="data-value muted">{{ deltaFormatted }}</div>
        </div>

        <div class="data-col">
          <div class="col-label">Ist</div>
          <div class="data-value ist-pill">
            <span class="arrow">↑</span>{{ istFormatted }}
          </div>
        </div>
      </div>
    </div>

    <!-- Dates row -->
    <div class="kr-dates-section">
      <div class="dates-scroll-wrapper">
        <button class="scroll-btn" @click="scrollLeft">
          <svg viewBox="0 0 8 12" fill="none">
            <path d="M6 1L1 6l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>

        <div class="dates-track" ref="datesTrack">
          <div v-for="entry in dateEntries" :key="entry.date" class="date-col">
            <div class="date-label">{{ entry.date }}</div>
            <div class="date-values">
              <div class="dv">
                <span class="dv-sub">Ist</span>
                <span class="dv-num">{{ entry.ist !== null ? entry.ist : '—' }}</span>
              </div>
              <div class="dv">
                <span class="dv-sub">Soll</span>
                <span class="dv-num">{{ entry.soll !== null ? entry.soll : '—' }}</span>
              </div>
            </div>
          </div>
        </div>

        <button class="scroll-btn" @click="scrollRight">
          <svg viewBox="0 0 8 12" fill="none">
            <path d="M2 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <button class="add-date-btn" @click="$emit('addDate', kr.id)">
        <svg viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <!-- Collapse -->
    <button class="collapse-btn" @click="$emit('collapse')">
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M4 10l4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
      Einklappen
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useKRStore, UNITS, KENNZAHL_OPTIONS } from '../stores/okr.js'
import OneDropdown from './OneDropdown.vue'

const props = defineProps({
  kr: { type: Object, required: true },
  width: { type: Number, default: 510 }
})
defineEmits(['collapse', 'delete', 'addDate'])

const store = useKRStore()
const datesTrack = ref(null)

const kennzahlOptions = KENNZAHL_OPTIONS

const localUnit = ref(props.kr.unit)
const localKennzahl = ref(props.kr.kennzahl || 'percent')

const unit = computed(() => UNITS[localUnit.value] || UNITS[1])
const unitSymbol = computed(() => unit.value.symbol)

const ki = computed(() => store.getKI(props.kr.id))
const ist = computed(() => store.getIst(props.kr.id))
const delta = computed(() => store.getDelta(props.kr.id))
const dateEntries = computed(() => store.getDateEntriesForKR(props.kr.id))

const istFormatted = computed(() => {
  if (ist.value === null) return '000'
  return ist.value + unitSymbol.value
})
function getDelta(krId) {
  const entries = dateEntries.filter((e) => e.ist !== null)
  if (entries.length < 2) return null
  return entries.at(-1).ist - entries.at(-2).ist
}
const deltaFormatted = computed(() => {
  if (delta.value === null) return '—'
  const sign = delta.value >= 0 ? '+' : ''
  return sign + delta.value + unitSymbol.value
})

function onKennzahlSelect(item) {
  store.updateKennzahl(props.kr.value.id, item.value)
}

function onUnitChange() {
  store.kResults[props.kr.value.id].unit = localUnit.value
}

function scrollLeft() {
  datesTrack.value?.scrollBy({ left: -160, behavior: 'smooth' })
}
function scrollRight() {
  datesTrack.value?.scrollBy({ left: 160, behavior: 'smooth' })
}
</script>

<style scoped>
.kr-rowwrap {
  background: var(--bg-card);
  border-radius: 14px;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

/* ── Header ── */
.kr-header {
  display: flex;
  align-items: flex-start;
  gap: 0;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  position: relative;
}

.header-left {
  flex: 1;
  min-width: 0;
  padding-right: 16px;
}

.header-right {
  flex: 1;
  min-width: 0;
  padding-left: 16px;
  padding-right: 32px;
}

.divider-v {
  width: 1px;
  background: var(--border);
  align-self: stretch;
}

.section-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.kr-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.45;
}

.kr-des {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.delete-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: color 0.15s, background 0.15s;
}

.delete-btn:hover {
  color: var(--red);
  background: #fff0f0;
}

.delete-btn svg {
  width: 16px;
  height: 16px;
}

.kr-meta-data {
  display: flex;
  justify-content: space-between;
}

/* ── Meta Row ── */
.kr-meta-row {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 278px;
  gap: 8px;
  justify-content: space-between;
  padding: 10px 16px 2px;
}

.kr-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.02em;
}

.badge.lagging {
  background: #fff3e8;
  color: #d4700a;
}

.badge.leading {
  background: #e8f5e9;
  color: #2e7d32;
}

.info-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  padding: 0;
}

.info-btn svg {
  width: 14px;
  height: 14px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
}

.radio-label input[type="radio"] {
  accent-color: var(--accent);
}

/* ── Data Row ── */
.kr-data-row {
  display: flex;
  align-items: flex-end;
  gap: 0;
  min-width: 502px;
  padding: 10px 16px 2px;
  flex-wrap: wrap;
  row-gap: 10px;
}

.data-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 20px;
  min-width: 90px;
}

.col-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  padding: 0;
}

.icon-btn svg {
  width: 12px;
  height: 12px;
}

.data-value {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  color: var(--text-primary);
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-input);
  white-space: nowrap;
}

.data-value.muted {
  color: var(--text-secondary);
}

.data-value.ist-pill {
  background: var(--green-bg);
  border-color: var(--green-border);
  color: var(--green);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 3px;
}

.arrow {
  font-size: 14px;
}

/* ── Dates Section ── */
.kr-dates-section {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  overflow: hidden;
}

.add-date-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: color 0.15s, border-color 0.15s;
}

.add-date-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.add-date-btn svg {
  width: 12px;
  height: 12px;
}

.dates-scroll-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.scroll-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: color 0.15s, border-color 0.15s;
}

.scroll-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.scroll-btn svg {
  width: 8px;
  height: 12px;
}

.dates-track {
  display: flex;
  gap: 0;
  overflow-x: auto;
  flex: 1;
  scrollbar-width: none;
}

.dates-track::-webkit-scrollbar {
  display: none;
}

.date-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 110px;
  border-right: 1px solid var(--border);
  padding: 4px 8px;
}

.date-col:last-child {
  border-right: none;
}

.date-label {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
}

.date-values {
  display: flex;
  gap: 12px;
}

.dv {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.dv-sub {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 500;
}

.dv-num {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: var(--text-primary);
  font-weight: 500;
}
</style>