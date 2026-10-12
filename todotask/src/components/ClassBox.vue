<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  type: { type: Object, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  zoom: { type: Number, default: 1 },
  selected: { type: Boolean, default: false },
})
const emit = defineEmits(['select', 'move', 'size'])

const el = ref(null)
const dragging = ref(false)

const stereotype = computed(() => {
  const t = props.type
  if (t.kind === 'interface') return 'interface'
  if (t.kind === 'enum') return 'enumeration'
  if (t.kind === 'struct') return 'struct'
  if (t.kind === 'record') return 'record'
  if (t.abstract) return 'abstract'
  if (t.static) return 'static'
  return ''
})
const attrs = computed(() => (props.type.kind === 'enum' ? props.type.values : props.type.fields))
const ops = computed(() => props.type.methods)
const isAbstract = computed(() => props.type.abstract || props.type.kind === 'interface')

// ---------- kéo thả ----------
let drag = null
function down(e) {
  if (e.button !== 0) return
  emit('select')
  drag = { sx: e.clientX, sy: e.clientY, ox: props.x, oy: props.y }
  dragging.value = true
  el.value.setPointerCapture(e.pointerId)
}
function move(e) {
  if (!drag) return
  emit('move', drag.ox + (e.clientX - drag.sx) / props.zoom, drag.oy + (e.clientY - drag.sy) / props.zoom)
}
function up(e) {
  if (!drag) return
  drag = null
  dragging.value = false
  if (el.value.hasPointerCapture?.(e.pointerId)) el.value.releasePointerCapture(e.pointerId)
}

// Phím mũi tên dịch chuyển ô đang chọn (Shift = bước lớn)
function key(e) {
  const step = e.shiftKey ? 50 : 10
  const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key]
  if (!d) return
  e.preventDefault()
  emit('move', props.x + d[0], props.y + d[1])
}

// ---------- đo kích thước thật để đi dây chính xác ----------
let ro
onMounted(() => {
  const report = () => emit('size', el.value.offsetWidth, el.value.offsetHeight)
  report()
  ro = new ResizeObserver(report)
  ro.observe(el.value)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <div
    ref="el"
    class="uml-box"
    :class="[type.kind, { abstract: isAbstract, selected, dragging }]"
    :data-name="type.id"
    :style="{ left: x + 'px', top: y + 'px' }"
    tabindex="0"
    role="group"
    :aria-label="`${stereotype || 'class'} ${type.id}`"
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @pointercancel="up"
    @focus="emit('select')"
    @keydown="key"
  >
    <header class="head">
      <span v-if="stereotype" class="stereo">«{{ stereotype }}»</span>
      <div class="title">
        <b class="name" :class="{ italic: type.abstract }">{{ type.display }}</b>
        <span v-if="type.bases.length" class="ext">: {{ type.bases.join(', ') }}</span>
      </div>
    </header>

    <ul v-if="attrs.length" class="sec attrs">
      <li v-for="(m, i) in attrs" :key="i" :class="{ static: m.static, abstract: m.abstract }">
        <i class="vis">{{ m.vis }}</i><span>{{ m.text }}</span>
      </li>
    </ul>
    <ul v-if="ops.length" class="sec ops">
      <li v-for="(m, i) in ops" :key="i" :class="{ static: m.static, abstract: m.abstract }">
        <i class="vis">{{ m.vis }}</i><span>{{ m.text }}</span>
      </li>
    </ul>
    <div v-if="!attrs.length && !ops.length" class="sec empty" />
  </div>
</template>

<style scoped>
.uml-box {
  position: absolute;
  width: max-content;
  min-width: 120px;
  background: #fff;
  border: 1.5px solid var(--text);
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(20, 27, 45, 0.12);
  font-family: var(--mono);
  cursor: grab;
  user-select: none;
  touch-action: none;
  overflow: hidden;
  z-index: 1;
}
.uml-box.selected {
  z-index: 3;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft), 0 4px 14px rgba(43, 123, 228, 0.25);
}
.uml-box.dragging {
  cursor: grabbing;
  z-index: 4;
  box-shadow: 0 0 0 3px var(--primary-soft), 0 10px 26px rgba(20, 27, 45, 0.3);
}
.uml-box:focus-visible {
  outline: none;
}

.head {
  padding: 7px 12px;
  text-align: center;
  white-space: nowrap;
}
.interface .head {
  background: #e8f1fd;
}
.enum .head {
  background: #fdf0d3;
}
.abstract:not(.interface) .head {
  background: #f4effd;
}
.struct .head,
.record .head {
  background: #e3f5ef;
}
.stereo {
  display: block;
  height: 14px;
  line-height: 14px;
  font-size: 10.5px;
  color: var(--text-2);
}
.title {
  line-height: 18px;
}
.name {
  font-size: 12.5px;
}
.name.italic {
  font-style: italic;
}
.ext {
  font-size: 11px;
  color: var(--text-2);
}

.sec {
  margin: 0;
  padding: 5px 10px;
  border-top: 1.5px solid var(--text);
  font-size: 11.5px;
}
.selected .sec,
.selected .head {
  border-color: var(--primary);
}
.sec.empty {
  height: 14px;
  padding: 0;
}
.sec li {
  display: flex;
  gap: 6px;
  height: 18px;
  line-height: 18px;
  white-space: nowrap;
}
.vis {
  flex: none;
  width: 8px;
  font-style: normal;
  font-weight: 700;
  color: var(--text-2);
}
.sec li.static span {
  text-decoration: underline;
}
.sec li.abstract span {
  font-style: italic;
}
</style>
