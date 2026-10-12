<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useDiagramStore } from '../stores/diagram'
import { routeEdges } from '../utils/diagram'
import ClassBox from './ClassBox.vue'
import Icon from './Icon.vue'
import { onDown, onMoving, onUp, dragging } from '../mixins/useResizer'
import MonacoEditor from './MonacoEditor.vue'

const SOURCE_PANEL_MIN = 340
const SOURCE_PANEL_MAX = 900
const srcWidth = ref(SOURCE_PANEL_MIN) // chiều rộng mặc định của source panel
const diagram = useDiagramStore()

const canvas = ref(null)
const content = ref(null)
const zoom = ref(1)
const codeOpen = ref(typeof matchMedia === 'function' ? matchMedia('(min-width: 900px)').matches : true)
const mouse = reactive({ x: 0, y: 0 })
const view = reactive({ w: 0, h: 0 })

// ---------- hình học ----------
const boxes = computed(() => {
  const out = {}
  for (const t of diagram.types) {
    const p = diagram.positions[t.id]
    if (!p) continue
    const s = diagram.sizeOf(t)
    out[t.id] = { x: p.x, y: p.y, w: s.w, h: s.h }
  }
  return out
})

const edges = computed(() => routeEdges(diagram.relations, boxes.value))

const bounds = computed(() => {
  let r = 0
  let b = 0
  for (const bx of Object.values(boxes.value)) {
    r = Math.max(r, bx.x + bx.w)
    b = Math.max(b, bx.y + bx.h)
  }
  return { r, b }
})

const size = computed(() => ({
  w: Math.max(view.w / zoom.value, bounds.value.r + 100),
  h: Math.max(view.h / zoom.value, bounds.value.b + 100),
}))

// ---------- tương tác ----------
let frame = 0
let pending = null
function onMove(id, x, y) {
  // gộp các sự kiện pointermove trong cùng một khung hình
  pending = { id, x, y }
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    if (pending) diagram.moveTo(pending.id, pending.x, pending.y)
    pending = null
  })
}

function onCanvasDown(e) {
  if (!e.target.closest('.uml-box')) diagram.select(null)
}

function trackMouse(e) {
  const r = content.value?.getBoundingClientRect()
  if (!r) return
  mouse.x = Math.round((e.clientX - r.left) / zoom.value)
  mouse.y = Math.round((e.clientY - r.top) / zoom.value)
}

const clampZoom = (z) => Math.min(2, Math.max(0.3, Math.round(z * 10) / 10))
const zoomBy = (d) => (zoom.value = clampZoom(zoom.value + d))
function fit() {
  const { r, b } = bounds.value
  if (!r || !view.w) return
  zoom.value = clampZoom(Math.min(1, view.w / (r + 60), view.h / (b + 60)))
  canvas.value.scrollTo(0, 0)
}

function arrange() {
  diagram.autoArrange(Math.max(700, view.w / zoom.value - 60))
}

const isHot = (e) => diagram.selected && (e.from === diagram.selected || e.to === diagram.selected)
const isDim = (e) => diagram.selected && !isHot(e)

const markerKinds = ['tri', 'arrow', 'diamond']
const markerFor = (e) => {
  const hot = isHot(e) ? 'h' : 'n'
  if (e.kind === 'generalization' || e.kind === 'realization') return { end: `url(#uml-tri-${hot})` }
  if (e.kind === 'aggregation') return { start: `url(#uml-diamond-${hot})`, end: `url(#uml-arrow-${hot})` }
  return { end: `url(#uml-arrow-${hot})` }
}

let ro
onMounted(() => {
  ro = new ResizeObserver(([entry]) => {
    view.w = entry.contentRect.width
    view.h = entry.contentRect.height
  })
  ro.observe(canvas.value)
})
onBeforeUnmount(() => {
  ro?.disconnect()
  cancelAnimationFrame(frame)
})
function setWidth(e) {
  let target = e.currentTarget
  let dW = e.clientX - parseInt(target.dataset.initx)
  srcWidth.value = Math.min(SOURCE_PANEL_MAX, Math.max(SOURCE_PANEL_MIN, Math.round(dW)))
}
</script>

<template>
  <section class="diagrams">
    <div class="toolbar" role="toolbar" aria-label="Diagram tools">
      <button class="tool" :class="{ on: codeOpen }" aria-label="Source" :aria-pressed="codeOpen"
        title="Show or hide the source code" @click="codeOpen = !codeOpen">
        <Icon name="code-slash" :size="15" /><span class="lbl">Source</span>
      </button>
      <span class="lang" title="Language of the source code">C#</span>
      <span class="stats">{{ diagram.types.length }} classes · {{ edges.length }} relations</span>
      <span class="grow" />
      <button class="tool" aria-label="Auto layout" title="Re-arrange all classes by inheritance level"
        @click="arrange">
        <Icon name="magic" :size="15" /><span class="lbl">Auto layout</span>
      </button>
      <button class="tool" aria-label="Sample" title="Replace the source with the C# sample"
        @click="diagram.loadSample()">
        <Icon name="undo" :size="15" /><span class="lbl">Sample</span>
      </button>
      <span class="sep" />
      <button class="tool square" aria-label="Zoom out" :disabled="zoom <= 0.3" @click="zoomBy(-0.1)">
        <Icon name="zoom-out" :size="15" />
      </button>
      <span class="zoom" aria-live="polite">{{ Math.round(zoom * 100) }}%</span>
      <button class="tool square" aria-label="Zoom in" :disabled="zoom >= 2" @click="zoomBy(0.1)">
        <Icon name="zoom-in" :size="15" />
      </button>
      <button class="tool square" aria-label="Fit to window" title="Fit to window" @click="fit">
        <Icon name="fit" :size="15" />
      </button>
    </div>

    <div class="work">
      <aside v-if="codeOpen" class="source sbr b" aria-label="Source code" :class="{ dragging }"
        :style="{ width: srcWidth + 'px' }">
        <span class="src-title">C# source</span>
        <MonacoEditor v-model="diagram.source" class="src-editor" aria-label="C# source" />
        <div class="resizer" role="separator" aria-orientation="vertical" parent=".sbr"
          title="Kéo để chỉnh độ rộng · double-click để thu gọn" @pointerdown="onDown"
          @pointermove="onMoving($event, setWidth)" @pointerup="onUp" @pointercancel="onUp"
          @dblclick="srcWidth = SOURCE_PANEL_MIN" />
      </aside>

      <div ref="canvas" class="canvas" @pointerdown="onCanvasDown" @pointermove="trackMouse">
        <div class="sizer" :style="{ width: size.w * zoom + 'px', height: size.h * zoom + 'px' }">
          <div ref="content" class="content"
            :style="{ width: size.w + 'px', height: size.h + 'px', transform: `scale(${zoom})` }">
            <svg class="edges" :width="size.w" :height="size.h" aria-hidden="true">
              <defs>
                <template v-for="state in ['n', 'h']" :key="state">
                  <marker :id="`uml-tri-${state}`" viewBox="0 0 14 12" refX="13" refY="6" markerWidth="14"
                    markerHeight="12" markerUnits="userSpaceOnUse" orient="auto">
                    <path d="M1 1 L13 6 L1 11 Z" fill="#fff" :stroke="state === 'h' ? '#2b7be4' : '#3b4458'"
                      stroke-width="1.4" stroke-linejoin="round" />
                  </marker>
                  <marker :id="`uml-arrow-${state}`" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12"
                    markerHeight="12" markerUnits="userSpaceOnUse" orient="auto">
                    <path d="M2 1.5 L11 6 L2 10.5" fill="none" :stroke="state === 'h' ? '#2b7be4' : '#3b4458'"
                      stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                  </marker>
                  <marker :id="`uml-diamond-${state}`" viewBox="0 0 16 12" refX="1" refY="6" markerWidth="16"
                    markerHeight="12" markerUnits="userSpaceOnUse" orient="auto">
                    <path d="M1 6 L8 1 L15 6 L8 11 Z" fill="#fff" :stroke="state === 'h' ? '#2b7be4' : '#3b4458'"
                      stroke-width="1.4" stroke-linejoin="round" />
                  </marker>
                </template>
              </defs>

              <g v-for="e in edges" :key="e.key" class="edge" :class="[e.kind, { hot: isHot(e), dim: isDim(e) }]"
                :data-from="e.from" :data-to="e.to" :data-kind="e.kind">
                <path :d="e.d" :marker-start="markerFor(e).start" :marker-end="markerFor(e).end">
                  <title>{{ e.from }} → {{ e.to }} ({{ e.kind }})</title>
                </path>
                <text v-if="e.label" class="label" :x="e.lx" :y="e.ly" :text-anchor="e.anchor">{{ e.label }}</text>
              </g>
            </svg>

            <ClassBox v-for="t in diagram.types" :key="t.id" :type="t" :x="diagram.positions[t.id]?.x ?? 0"
              :y="diagram.positions[t.id]?.y ?? 0" :zoom="zoom" :selected="diagram.selected === t.id"
              @select="diagram.select(t.id)" @move="(x, y) => onMove(t.id, x, y)"
              @size="(w, h) => diagram.setSize(t.id, w, h)" />
          </div>
        </div>

        <p v-if="!diagram.types.length" class="empty">No classes found — paste some C# code into the Source panel.</p>
      </div>
    </div>

    <footer class="status">
      <span class="sel">{{ diagram.selected ?? '--No select--' }}</span>
      <span class="grow" />
      <span class="mouse">Mouse: X: {{ mouse.x }}, Y: {{ mouse.y }}</span>
    </footer>
  </section>
</template>

<style src="./diagrams-view.css" scoped></style>
