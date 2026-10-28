<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, nextTick } from 'vue'
import { useDiagramStore, MAX_CLASSES } from '../../stores/diagram'
import { useSelectionStore } from '../../stores/selection'
import { useGraphStore } from '../../stores/graph'
import { basename } from '../../core/path'
import { routeEdges } from './layout'
import { canDiagram, supportedLabel } from './parsers'
import ClassBox from './ClassBox.vue'
import domtoimage from 'dom-to-image-more';

const diagram = useDiagramStore()
const selection = useSelectionStore()
const graph = useGraphStore()
const toImg = ref(false)
const canvas = ref(null)
const zoom = ref(1)
const view = reactive({ w: 0, h: 0 })
const supported = supportedLabel()

// ---------- hình học ----------
const boxes = computed(() => {
  const out = new Map()
  for (const t of diagram.types) {
    const p = diagram.positions[t.id]
    if (!p) continue
    const s = diagram.sizeOf(t)
    out.set(t.id, { x: p.x, y: p.y, w: s.w, h: s.h })
  }
  return out
})

const edges = computed(() => routeEdges(diagram.relations, boxes.value))
const boundR = computed(() => {
  let r = 0
  boxes.value.forEach((bx) => { r = Math.max(r, bx.x + bx.w) })
  return r
})
const boundB = computed(() => {
  let b = 0
  boxes.value.forEach((bx) => { b = Math.max(b, bx.y + bx.h) })
  return b
})
const cvWidth = computed(() => Math.max(view.w / zoom.value, boundR.value + 100))
const cvHeigh = computed(() => Math.max(view.h / zoom.value, boundB.value + 100))

const selectedType = computed(() => diagram.types.find((t) => t.id === diagram.selected))
const canAddCurrent = computed(() => !!selection.filePath && canDiagram(selection.filePath) && !diagram.fileSet.has(selection.filePath))

// ---------- tương tác ----------
let frame = 0
let pending = null
const animMoving = () => {
  frame = 0
  if (pending) diagram.moveTo(pending.id, pending.x, pending.y)
  pending = null
}
function onMove(id, x, y) {
  // gộp các sự kiện pointermove trong cùng một khung hình
  pending = { id, x, y }
  if (frame) return
  frame = requestAnimationFrame(animMoving)
}

/** Bấm class / thành viên → mở mã nguồn tại đúng dòng khai báo (graph.openFile lo việc chọn node và mở editor). */
function onOpen({ path, line, name }) { if (path) graph.openFile({ path, line, query: name }) }

function onCanvasDown(e) { if (!e.target.closest('.uml-box')) diagram.select(null) }

const clampZoom = (z) => Math.min(2, Math.max(0.3, Math.round(z * 10) / 10))
const zoomBy = (d) => (zoom.value = clampZoom(zoom.value + d))
function fit() {
  const r = boundR.value, b = boundB.value
  if (!r || !view.w) return
  zoom.value = clampZoom(Math.min(1, view.w / (r + 60), view.h / (b + 60)))
  canvas.value.scrollTo(0, 0)
}

function arrange() { diagram.autoArrange(Math.max(700, view.w / zoom.value - 60)) }

const isHot = (e) => diagram.selected && (e.from === diagram.selected || e.to === diagram.selected)
const isDim = (e) => diagram.selected && !isHot(e)

const markerFor = (e) => {
  const hot = isHot(e) ? 'h' : 'n'
  if (e.kind === 'generalization' || e.kind === 'realization') return { end: `url(#uml-tri-${hot})` }
  if (e.kind === 'aggregation') return { start: `url(#uml-diamond-${hot})`, end: `url(#uml-arrow-${hot})` }
  return { end: `url(#uml-arrow-${hot})` }
}

async function saveImage() {
  toImg.value = true
  diagram.select(null)
  const appWrap = () => document.querySelector('.app-container')
  appWrap().style.pointerEvents = 'none'
  await nextTick()
  setTimeout(() => {
    domtoimage.toJpeg(canvas.value.querySelector('.sizer'), { quality: 0.99 })
      .then((dataUrl) => {
          var link = document.createElement('a');
          let name = diagram.files.map(p => basename(p)).join('-').replaceAll('.', '_')
          link.download =`${name}.jpeg`
          link.href = dataUrl;
          link.click();
          URL.revokeObjectURL(link.href);
      })
      .catch(err => {console.error(err)})
      .finally(() => {
        toImg.value = false
        appWrap().style.pointerEvents = ''
      })
  }, 3)
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
defineExpose({ arrange, zoom, zoomBy, fit })
</script>

<template>
  <section class="diagrams">
    <div class="toolbar" role="toolbar" aria-label="Công cụ sơ đồ class">
      <button class="tool" :class="{ on: diagram.mode === 'follow' }" title="Sơ đồ luôn vẽ file đang chọn" 
        @click="diagram.followSelection()">Theo file đang chọn</button>
      <button class="tool" :disabled="!canAddCurrent" 
        title="Thêm file đang chọn vào sơ đồ (cũng có thể Ctrl + bấm một file trong danh sách)"
        @click="diagram.add(selection.filePath)">+ Thêm file đang chọn</button>
      <span class="stats">{{ diagram.types.length }} class · {{ edges.length }} quan hệ</span>
      <button class="btn-secondary small" @click="saveImage">Lưu ảnh</button>
    </div>
    <div v-if="diagram.files.length && !toImg" class="files">
      <span class="hint">File:</span>
      <span v-for="p in diagram.files" :key="p" class="chip" :title="p">
        <span class="nm">{{ basename(p) }}</span>
        <button :aria-label="`Bỏ ${basename(p)} khỏi sơ đồ`" @click="diagram.remove(p)">✕</button>
      </span>
    </div>
    <div v-if="diagram.unsupportedSelection" class="notice warn">
      “{{ basename(diagram.unsupportedSelection) }}” đang phát triển sơ đồ class (hiện hỗ trợ: {{ supported }}) — sơ đồ giữ nguyên file trước đó.
    </div>
    <div v-for="p in diagram.problems" :key="p.path" class="notice err">Không đọc được {{ basename(p.path) }}: {{ p.message }}.</div>
    <div v-if="diagram.truncated" class="notice warn">
      Chỉ vẽ {{ MAX_CLASSES }} / {{ diagram.total }} class đầu tiên (nhiều hơn sẽ chậm) — hãy chọn ít file hơn.
    </div>

    <div class="work">
      <div ref="canvas" class="canvas" @pointerdown="onCanvasDown">
        <div class="sizer" :style="{
            width: cvWidth * zoom + 'px', height: cvHeigh * zoom + 'px',
            display: toImg ? 'flex' : '', background: toImg ? 'white' : '',
          }">
          <div v-if="diagram.files.length && toImg" class="files" 
            style="position: sticky; top:0; z-index: 1;">
            <span class="hint">File:</span>
            <span v-for="p in diagram.files" class="chip">
              <span class="nm">{{ basename(p) }}</span>
            </span>
          </div>
          <div class="content" :style="{ 
              width: cvWidth + 'px', height: cvHeigh + 'px', transform: `scale(${zoom})`, 
              background: toImg ? 'white' : '', position: toImg ? 'initial' : ''
            }">
            <svg class="edges" :width="cvWidth" :height="cvHeigh" aria-hidden="true" xmlns="http://w3.org">
              <defs>
                <template v-for="state in ['n', 'h']" :key="state">
                  <marker :id="`uml-tri-${state}`" viewBox="0 0 14 12" refX="13" refY="6" markerWidth="14" markerHeight="12"
                    markerUnits="userSpaceOnUse" orient="auto">
                    <path d="M1 1 L13 6 L1 11 Z" fill="#fff" :stroke="state === 'h' ? '#2b7be4' : '#3b4458'" stroke-width="1.4"
                      stroke-linejoin="round" />
                  </marker>
                  <marker :id="`uml-arrow-${state}`" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12"
                    markerUnits="userSpaceOnUse" orient="auto">
                    <path d="M2 1.5 L11 6 L2 10.5" fill="none" :stroke="state === 'h' ? '#2b7be4' : '#3b4458'" stroke-width="1.4"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </marker>
                  <marker :id="`uml-diamond-${state}`" viewBox="0 0 16 12" refX="1" refY="6" markerWidth="16" markerHeight="12"
                    markerUnits="userSpaceOnUse" orient="auto">
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
              @select="diagram.select(t.id)" @move="(x, y) => onMove(t.id, x, y)" @size="(w, h) => diagram.setSize(t.id, w, h)"
              @open="onOpen" />
          </div>
        </div>

        <div v-if="!diagram.types.length" class="empty">
          <p v-if="diagram.loading">Đang đọc file…</p>
          <p v-else-if="!diagram.files.length">Chọn một file {{ supported }} trong danh sách hoặc trên sơ đồ file để vẽ sơ đồ class của nó.</p>
          <p v-else>Không tìm thấy class nào trong file đã chọn.</p>
        </div>
      </div>
    </div>

    <footer class="status">
      <span class="sel">{{ selectedType ? `${selectedType.id} — ${selectedType.path}:${selectedType.line}` : 'Chưa chọn class' }}</span>
      <span class="grow" />
      <span class="mouse">Bấm class hoặc thành viên để mở mã nguồn · kéo để di chuyển</span>
    </footer>
  </section>
</template>

<style src="./diagram-view.css" scoped></style>
<style src="../../utils/diag.css" scoped></style>
