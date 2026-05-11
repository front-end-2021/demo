<template>
  <span v-if="!start && end" class="date-range">
    <span class="date-icon">↑</span>
    <span class="date-end">{{ end }}</span>
  </span>
  <span v-else-if="start || end" class="date-range">
    <span class="s--e" :class="[start ? 'date-start' : '']">{{ start }}</span>
    <span class="date-days" :class="[negCls]">{{ days }}</span>
    <span class="s--e" :class="[end ? 'date-end' : '']">{{ end }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { dateFrom } from '../utils/utility.js'
const props = defineProps({ start: String, end: String })

const days = computed(() => {
  let sDate = props.start
  let eDate = props.end
  if (!sDate || !eDate) return ''

  sDate = dateFrom(sDate)
  eDate = dateFrom(eDate)
  let dDay = eDate.getTime() - sDate.getTime()
  dDay = dDay / 24000 / 3600
  if (-1 < dDay && dDay < 1) { dDay = 1 }
  return `${Math.round(dDay)} Tg`
})
const negCls = computed(() => {
  if (!days.value) return ''
  return days.value.startsWith('-') ? 'neg' : 'pos'
})
</script>

<style scoped>
.date-range {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-family: 'DM Mono', monospace;
}
.s--e {
  white-space: nowrap;
  min-width: 76px; min-height: 18px;
  padding: 2px 5px; border-radius: 4px;
}
.date-start,
.date-end {
  background: #f0f4ff; color: #4f6ef7;
}

.date-days {
  padding: 2px 5px; min-width: 36px;
  border-radius: 4px;
  white-space: nowrap;
}

.date-days.pos {
  background: #dcfce7;
  color: #15803d;
}

.date-days.neg {
  background: #fee2e2;
  color: #b91c1c;
}

.date-icon {
  color: #6b7280;
  font-size: 10px;
}
</style>
