<template>
  <Transition name="card" mode="out-in">
    <KrRow v-if="!collapse"
      :kr="props.kr" :width="props.width"
      @collapse="collapse = true"
      @delete="onDelete"
      @addDate="onAddDate"
    />
    <KRMini v-else
      :kr="props.kr"  :width="props.width"
      @expand="collapse = false"
    />
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import KRMini from './KRMini.vue'
import KrRow from './KrRow.vue'
import { useKRStore } from '../stores/okr.js'

const props = defineProps({
  kr: { type: Object, required: true },
  width: { type: Number, default: 510 }
})

const collapse = ref(false)
const store = useKRStore()

function onDelete(id) { store.deleteKResult(props.kr.value) }

function onAddDate(id) {
  // placeholder: could open a modal
  const date = prompt('Datum eingeben (z.B. 15.5.2026):')
  const val = parseFloat(prompt('Ist-Wert:'))
  if (date && !isNaN(val)) {
    store.addDate(id, date, val)
  }
}
</script>

<style scoped>
.card-enter-active,
.card-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.card-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.card-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>