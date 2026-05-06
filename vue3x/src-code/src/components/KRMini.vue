<template>
  <div class="kr-mini" @click="$emit('expand')">
    <div class="kr-mini-header">
      <div class="kr-mini-name">{{ kr.name || '(Kein Name)' }}</div>
      <div class="kr-mini-meta">
        <span class="badge" :class="kr.lagging ? 'lagging' : 'leading'">
          {{ kr.lagging ? 'Lagging' : 'Leading' }}
        </span>
        <span class="ki-value">{{ ki !== null ? ki + '%' : '—' }}</span>
      </div>
    </div>

    <div class="kr-mini-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressWidth + '%', background: progressColor }" />
      </div>
      <div class="progress-labels">
        <span class="ist-label">Ist: <strong>{{ istFormatted }}</strong></span>
        <span class="soll-label">Soll: <strong>{{ sollFormatted }}</strong></span>
      </div>
    </div>

    <button class="expand-btn" @click.stop="$emit('expand')">
      <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>Details anzeigen
    </button>
  </div>
</template>

<script setup>
import { computed,inject } from 'vue'
import { useKRStore, UNITS } from '../stores/okr.js'

const props = defineProps({
  kr: { type: Object, required: true },
  width: { type: Number, default: 510 }
})
defineEmits(['expand'])
const mKI = inject('mpki')
const store = useKRStore()
const ki = computed(() => mKI.value.get(props.kr.id))
const ist = computed(() => store.getIst(props.kr.id))
const unit = computed(() => UNITS[props.kr.unit] || UNITS[1])

const progressWidth = computed(() => {
  if (ki.value === null) return 0
  return Math.min(parseFloat(ki.value), 100)
})

const progressColor = computed(() => {
  const v = progressWidth.value
  if (v >= 80) return 'var(--green)'
  if (v >= 50) return 'var(--orange)'
  return 'var(--red)'
})

const istFormatted = computed(() => {
  if (ist.value === null) return '—'
  return ist.value + unit.value.symbol
})

const sollFormatted = computed(() => {
  return props.kr.target + unit.value.symbol
})
</script>

<style scoped>
.kr-mini {
  background: var(--bg-card);
  border-radius: 14px;
  padding: 14px 16px; cursor: pointer;
  transition: box-shadow 0.18s, border-color 0.18s;
  display: flex; flex-direction: column; gap: 10px; 
}

.kr-mini:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  border-color: var(--accent-subtle);
}

.kr-mini-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.kr-mini-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  flex: 1;
  line-height: 1.4;
}

.kr-mini-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
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

.ki-value {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.kr-mini-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-bar {
  height: 6px;
  background: #ebebed;
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.4s cubic-bezier(.4,0,.2,1);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
}

</style>