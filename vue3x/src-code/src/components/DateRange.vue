<template>
  <template v-if="1 == type">
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
  <div v-if="2 == type" class="date-fields">
    <input class="date-input" type="date" :name="names[0]" :max="max"
      v-model="vStat" placeholder="Von" @blur="onBlur('dateStart')"/>
    <slot></slot>
    <input class="date-input" type="date" :name="names[1]" :min="min"
      v-model="vEndt" placeholder="Bis" @blur="onBlur('dateEnd')"/>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { dateFrom } from '../utils/utility.js'
const props = defineProps({
  type: { type: Number, default: 1 },
  names: { type: Array, default: ['start', 'end'] },
  start: { type: String }, end: { type: String }
})
const emit = defineEmits(['blur'])

const days = computed(() => {
  let sDate = props.start
  let eDate = props.end
  if (!sDate || !eDate) return ''

  sDate = dateFrom(sDate, '.', [0, 1, 2], [0, 0, 0, 1])
  eDate = dateFrom(eDate, '.', [0, 1, 2], [23, 59, 59, 999])
  let dDay = eDate.getTime() - sDate.getTime()
  dDay = dDay / 24000 / 3600
  if (-1 < dDay && dDay < 1) { dDay = 1 }
  return `${Math.round(dDay)} Tg`
})
const negCls = computed(() => {
  if (!days.value) return ''
  return days.value.startsWith('-') ? 'neg' : 'pos'
})
const vStat = ref(inputVal(props.start))
const vEndt = ref(inputVal(props.end))

function inputVal(txt, sep = '.') {
  if (!txt) return ''
  let arr = txt.split(sep)
  if (arr.length < 3) return ''
  if ('.' == sep) return `${arr[2]}-${filZero(arr[1])}-${filZero(arr[0])}` // yyyy-mm-dd
  if ('-' == sep) return `${filZero(arr[2])}.${filZero(arr[1])}.${arr[0]}` // dd.mm.yyyy
  return ''
  function filZero(num, count = 1) {
    if (num.length > count) return num
    return `0${num}`
  }
}

const min = computed(() => {
  let val = vStat.value
  if (!val) return ''
  return val
})
const max = computed(() => {
  let val = vEndt.value
  if (!val) return ''
  return val
})

function onBlur(type) {
  let val = 'dateStart' == type ? vStat.value : vEndt.value
  emit('blur', { type, value: inputVal(val, '-') })
}
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
  min-width: 76px;
  min-height: 18px;
  padding: 2px 5px;
  border-radius: 4px;
}

.date-start,
.date-end {
  background: #f0f4ff;
  color: #4f6ef7;
}

.date-days {
  padding: 2px 5px;
  min-width: 36px;
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

.date-fields {
  display: flex;
  align-items: center;
  gap: 6px; flex: 1;
}
.date-input {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 3px 8px;
  font-size: 12px;
  width: 110px;
  outline: none;
  color: var(--text-primary);
}

.date-input:focus {
  border-color: var(--accent-blue);
}
</style>
