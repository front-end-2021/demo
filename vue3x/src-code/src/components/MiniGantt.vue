<template>
  <div class="mini-gantt">
    <div class="gantt-header">
      <div class="gantt-week">KW 11 | 2026</div>
      <div class="gantt-view-btns">
        <button :class="{ active: view === 'Woche' }" @click="view = 'Woche'">Woche</button>
        <button :class="{ active: view === 'Monat' }" @click="view = 'Monat'">Monat</button>
        <button :class="{ active: view === 'Jahr' }" @click="view = 'Jahr'">Jahr</button>
        <button class="expand-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
        </button>
      </div>
    </div>
    <div class="gantt-days">
      <div v-for="d in days" :key="d.label" class="gantt-day" :class="{ today: d.today }">
        <span class="day-short">{{ d.short }}</span>
        <span class="day-num">{{ d.num }}</span>
      </div>
    </div>
    <div class="gantt-bars">
      <div class="gantt-bar-row secondary">
        <div class="bar-label">Hauptziel: Optimierung der internen Kommunikation...</div>
        <div class="gantt-bar" style="left: 0%; width: 60%; background: #e0e7ff; border: 1px solid #c7d2fe;"></div>
      </div>
      <div class="gantt-bar-row primary">
        <div class="gantt-bar active-bar" style="left: 30%; width: 28%;">
          <span class="bar-dot"></span>
          <span class="bar-label-inside">{{ item?.title?.substring(0, 30) }}...</span>
        </div>
      </div>
      <div class="gantt-bar-row secondary">
        <div class="bar-label">Design und Prototyping des Produkts</div>
        <div class="gantt-bar" style="left: 5%; width: 50%; background: #f3f4f6; border: 1px solid #e5e7eb;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ item: Object })
const view = ref('Woche')
const days = [
  { short: 'Mo', num: '09.03', today: false },
  { short: 'Di', num: '10.03', today: false },
  { short: 'Mi', num: '11.03', today: false },
  { short: 'Do', num: '12.03', today: true },
  { short: 'Fr', num: '13.03', today: false },
  { short: 'Sa', num: '14.03', today: false },
  { short: 'So', num: '15.03', today: false },
]
</script>

<style scoped>
.mini-gantt {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 16px;
}
.gantt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
}
.gantt-week { font-size: 11px; font-weight: 600; color: var(--text-secondary); }
.gantt-view-btns { display: flex; gap: 2px; align-items: center; }
.gantt-view-btns button {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--text-secondary);
  transition: all 0.12s;
}
.gantt-view-btns button.active,
.gantt-view-btns button:hover {
  background: var(--accent-blue-light);
  color: var(--accent-blue);
}
.expand-btn { padding: 2px 4px !important; }
.gantt-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid var(--border);
}
.gantt-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0;
  font-size: 10px;
  color: var(--text-muted);
}
.gantt-day.today .day-num {
  background: var(--accent-blue);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
}
.day-short { font-weight: 500; color: var(--text-secondary); }
.gantt-bars {
  padding: 8px 12px;
  position: relative;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.gantt-bar-row { position: relative; height: 22px; display: flex; align-items: center; }
.gantt-bar {
  position: absolute;
  height: 18px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 6px;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
}
.active-bar {
  background: #3b82f6;
  color: white;
}
.bar-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: white;
  flex-shrink: 0;
  margin-right: 4px;
}
.bar-label-inside { font-size: 10px; overflow: hidden; }
.bar-label {
  position: absolute;
  right: calc(100% - 35%);
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
  z-index: 1;
}
</style>
