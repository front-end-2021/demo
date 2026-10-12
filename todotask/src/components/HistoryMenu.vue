<script setup>
// Nút icon "History" + popover timeline các thao tác của task (Deadline, Assignee, Priority, Status...).
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import Icon from './Icon.vue'
import { useUiStore } from '../stores/ui'
import { describeEntry } from '../utils/history'
import { formatAgo, formatDateTime, shortName } from '../utils/format'

const props = defineProps({
  task: { type: Object, required: true },
})

const ui = useUiStore()
const open = ref(false)
const root = ref(null)
const btn = ref(null)
const panel = ref(null)

// Mới nhất ở trên cùng
const items = computed(() =>
  [...props.task.history].reverse().map((e) => ({ e, d: describeEntry(e, props.task) })),
)

async function toggle() {
  open.value = !open.value
  if (open.value) {
    await nextTick()
    panel.value?.focus({ preventScroll: true }) // để Esc đóng popover trước khi đóng cả form
  }
}

function close(refocus = false) {
  open.value = false
  if (refocus) btn.value?.focus()
}

function onKey(e) {
  if (open.value && e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    close(true)
  }
}

function onOutside(e) {
  if (open.value && root.value && !root.value.contains(e.target)) close()
}

onMounted(() => document.addEventListener('pointerdown', onOutside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutside))
</script>

<template>
  <div ref="root" class="hm" @keydown="onKey">
    <button
      ref="btn"
      type="button"
      class="hm-btn"
      :class="{ on: open }"
      :title="`History (${task.history.length})`"
      aria-label="History"
      aria-haspopup="dialog"
      :aria-expanded="open"
      @click="toggle"
    >
      <Icon name="history" :size="18" />
    </button>

    <Transition name="pop">
      <section v-if="open" ref="panel" class="panel" role="dialog" aria-label="Task history" tabindex="-1">
        <header class="p-head">
          <strong>History</strong>
          <span class="n">{{ items.length }}</span>
        </header>

        <ol class="list">
          <li v-for="{ e, d } in items" :key="e.id" class="entry" :data-type="e.type">
            <span class="ico" :class="'tone-' + d.tone"><Icon :name="d.icon" :size="14" /></span>
            <div class="body">
              <p class="title">{{ d.title }}</p>

              <p v-if="d.from !== undefined || d.to !== undefined" class="change">
                <span class="chip from">{{ d.from }}</span>
                <Icon name="arrow-right" :size="11" class="arrow" />
                <span class="chip to">{{ d.to }}</span>
              </p>
              <p v-else-if="d.detail" class="detail">{{ d.detail }}</p>

              <p class="meta" :title="formatDateTime(e.at)">
                {{ shortName(e.by) }} · {{ formatAgo(e.at, ui.now) }}
              </p>
            </div>
          </li>
        </ol>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
/* .hm không có position: popover bám theo hàng tiêu đề của form (.top) nên không bị cắt trên màn hình hẹp */
.hm-btn {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--text-2);
  transition: background 0.15s, color 0.15s;
}
.hm-btn:hover,
.hm-btn.on {
  background: var(--soft);
}
.hm-btn.on {
  color: var(--primary);
}

.panel {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 12;
  width: min(340px, 100%);
  max-height: 380px;
  display: flex;
  flex-direction: column;
  outline: 0;
  background: #fff;
  border-radius: 12px;
  transform-origin: top right;
  box-shadow:
    0 14px 34px rgba(20, 27, 45, 0.18),
    0 3px 8px rgba(20, 27, 45, 0.08),
    0 0 0 1px rgba(20, 27, 45, 0.06);
}

.p-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px 8px;
  border-bottom: 1px solid var(--border);
}
.p-head strong {
  font-size: 13px;
}
.n {
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  display: inline-grid;
  place-items: center;
  border-radius: 5px;
  background: #e4e7ee;
  color: var(--text-2);
  font-size: 11px;
  font-weight: 500;
}

.list {
  margin: 0;
  padding: 12px 14px 4px;
  overflow-y: auto;
  list-style: none;
}

.entry {
  position: relative;
  display: flex;
  gap: 11px;
  padding-bottom: 14px;
}
/* đường nối giữa các icon */
.entry:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 13px;
  top: 28px;
  bottom: 0;
  width: 2px;
  border-radius: 2px;
  background: var(--border);
}

.ico {
  flex: none;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
}
.tone-green { background: #e1f4ea; color: #1f9d63; }
.tone-gray { background: #eceef3; color: #5b6478; }
.tone-red { background: #fde4e4; color: #e5484d; }
.tone-purple { background: #f0e1fa; color: #a24bd1; }
.tone-blue { background: #dcebfc; color: #2b7be4; }
.tone-orange { background: #fde8d3; color: #e8812a; }
.tone-teal { background: #d9f2f0; color: #1b9a90; }

.body {
  min-width: 0;
  flex: 1;
}
.title {
  font-weight: 600;
  line-height: 28px;
  margin-top: -2px;
}
.change {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}
.chip {
  max-width: 100%;
  padding: 1px 8px;
  border-radius: 6px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chip.from {
  background: var(--soft);
  color: var(--muted);
  text-decoration: line-through;
  text-decoration-color: rgba(125, 132, 152, 0.6);
}
.chip.to {
  background: var(--primary-soft);
  color: #1f64bb;
  font-weight: 500;
}
.arrow {
  color: var(--muted);
}
.detail {
  margin-top: 2px;
  color: var(--text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta {
  margin-top: 3px;
  color: var(--muted);
  font-size: 11.5px;
}

/* Animation mở/đóng giống dropdown */
.pop-enter-active {
  transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.22, 0.9, 0.3, 1);
}
.pop-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}
@media (prefers-reduced-motion: reduce) {
  .pop-enter-active,
  .pop-leave-active {
    transition: none;
  }
}
</style>
