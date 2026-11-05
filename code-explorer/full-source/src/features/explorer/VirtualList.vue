<template>
  <!-- Danh sách cuộn dài: chỉ dựng các hàng đang nhìn thấy (hàng có chiều cao riêng: row.h) -->
  <div ref="el" class="vlist" @scroll.passive="onScroll">
    <div class="spacer" :style="{ height: totalHeight + 'px' }">
      <div v-for="i in visible" :key="rows[i].key" class="vrow" :style="{ top: offsets[i] + 'px', height: rows[i].h + 'px' }">
        <slot name="row" :row="rows[i]" :index="i" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { buildOffsets, scrollToReveal, visibleRange } from './virtual-list'

const props = defineProps({ rows: { type: Array, required: true } }) // [{ key, h, ... }]

const el = ref(null)
const scrollTop = ref(0)
const viewport = ref(0)

const offsets = computed(() => buildOffsets(props.rows.map((r) => r.h)))
const totalHeight = computed(() => offsets.value[offsets.value.length - 1])
const visible = computed(() => {
  const { start, end } = visibleRange(offsets.value, scrollTop.value, viewport.value)
  return Array.from({ length: end - start }, (_, k) => start + k)
})

const onScroll = () => { scrollTop.value = el.value.scrollTop }

let observer = null
onMounted(() => {
  viewport.value = el.value.clientHeight
  observer = new ResizeObserver(() => { viewport.value = el.value?.clientHeight ?? 0 })
  observer.observe(el.value)
})
onBeforeUnmount(() => observer?.disconnect())

/** Cuộn tối thiểu để hàng `index` nằm trọn trong khung nhìn. */
function scrollToIndex(index) {
  if (!el.value || index < 0 || index >= props.rows.length) return
  const top = scrollToReveal(offsets.value, index, el.value.scrollTop, el.value.clientHeight)
  if (top !== el.value.scrollTop) el.value.scrollTop = top
}

function resetScroll() {
  if (el.value) el.value.scrollTop = 0
  scrollTop.value = 0
}

defineExpose({ scrollToIndex, resetScroll })
</script>

<style scoped>
.vlist {
  position: relative;
  height: 100%; scroll-behavior: smooth;
  overflow-y: auto; scrollbar-width: thin;
}

.spacer {
  position: relative;
}

.vrow {
  position: absolute;
  left: 0;
  right: 0;
}
</style>
