<template>
  <span v-if="start || days || end" class="date-range">
    <span v-if="start" class="date-start">{{ start }}</span>
    <span v-if="days" class="date-days" :class="isNegative ? 'neg' : 'pos'">{{ days }}</span>
    <span v-if="end" class="date-end">{{ end }}</span>
  </span>
  <span v-else-if="end" class="date-range">
    <span class="date-icon">↑</span>
    <span class="date-end">{{ end }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ start: String, days: String, end: String })
const isNegative = computed(() => props.days && props.days.startsWith('-'))
</script>

<style scoped>
.date-range {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-family: 'DM Mono', monospace;
}
.date-start, .date-end {
  background: #f0f4ff;
  color: #4f6ef7;
  padding: 2px 5px;
  border-radius: 4px;
  white-space: nowrap;
}
.date-days {
  padding: 2px 5px;
  border-radius: 4px;
  white-space: nowrap;
}
.date-days.pos { background: #dcfce7; color: #15803d; }
.date-days.neg { background: #fee2e2; color: #b91c1c; }
.date-icon { color: #6b7280; font-size: 10px; }
</style>
