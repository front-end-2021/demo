<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTaskStore, STATUSES, PRIORITIES, MEMBERS, createdAtOf, modifiedAtOf } from '../stores/tasks'
import { useUiStore } from '../stores/ui'
import { formatTs, relativeTime, formatSize, shortName, fileKind } from '../utils/format'
import Icon from './Icon.vue'
import Avatar from './Avatar.vue'
import FileIcon from './FileIcon.vue'
import Dropdown from './Dropdown.vue'
import HistoryMenu from './HistoryMenu.vue'

const store = useTaskStore()
const ui = useUiStore()

const task = computed(() => store.byId(ui.drawerTaskId))

const titleEl = ref(null)
const descEl = ref(null)
const subsEl = ref(null)
const menuOpen = ref(false)
const draft = ref('')

const statusLabel = computed(() => STATUSES.find((s) => s.key === task.value?.status)?.label ?? '')
const priorityOptions = PRIORITIES.map((p) => ({ value: p.key, label: p.label }))
const statusOptions = STATUSES.map((s) => ({ value: s.key, label: s.label }))
const memberOptions = MEMBERS.map((m) => ({ value: m, label: m }))
const prioLabel = computed(() => PRIORITIES.find((p) => p.key === task.value?.priority)?.label ?? '')

/* ---------- Tiện ích ---------- */
function autosize(el) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}
// Mọi thay đổi (kể cả thời điểm sửa) được store tự ghi vào history, nên ở đây chỉ cần v-model
const onTitleInput = (e) => autosize(e.target)
const onDescInput = (e) => autosize(e.target)

/* ---------- Đóng / xoá ---------- */
function isBlank(t) {
  return !t.name.trim() && !t.description.trim() && !t.subtasks.length && !t.files.length && !t.comments.length
}

// Task mới mà chưa nhập gì thì bỏ đi khi đóng form
function discardIfBlank(id, delay = 0) {
  const t = store.byId(id)
  if (!t || !isBlank(t)) return
  const run = () => {
    store.remove(id)
    if (ui.selectedTaskId === id) ui.selectedTaskId = null
  }
  delay ? setTimeout(run, delay) : run()
}

function close() {
  menuOpen.value = false
  discardIfBlank(ui.drawerTaskId, 340) // chờ animation trượt ra xong
  ui.closeDrawer()
}

function removeTask() {
  const id = ui.drawerTaskId
  menuOpen.value = false
  ui.closeDrawer()
  setTimeout(() => {
    store.remove(id)
    if (ui.selectedTaskId === id) ui.selectedTaskId = null
  }, 340)
}

function toggleDone() {
  task.value.done = !task.value.done
  menuOpen.value = false
}

/* ---------- Sub-task ---------- */
async function addSub() {
  store.addSubtask(ui.drawerTaskId)
  await nextTick()
  const inputs = subsEl.value?.querySelectorAll('.sub-input')
  inputs?.[inputs.length - 1]?.focus()
}
function removeSub(sid) {
  store.removeSubtask(ui.drawerTaskId, sid)
}

/* ---------- File ---------- */
function onFiles(e) {
  for (const f of e.target.files) {
    store.addFile(ui.drawerTaskId, {
      name: f.name,
      type: fileKind(f.name),
      size: f.size,
      url: URL.createObjectURL(f),
    })
  }
  e.target.value = ''
}
function removeFile(fid) {
  store.removeFile(ui.drawerTaskId, fid)
}
function download(f) {
  let url = f.url
  let temp = false
  if (!url) {
    // file mẫu chưa có nội dung thật: tạo file giả để thử nút Download
    url = URL.createObjectURL(new Blob([`Placeholder for "${f.name}"\n`], { type: 'text/plain' }))
    temp = true
  }
  const a = document.createElement('a')
  a.href = url
  a.download = f.url ? f.name : f.name + '.txt'
  document.body.appendChild(a)
  a.click()
  a.remove()
  if (temp) setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/* ---------- Comment ---------- */
function send() {
  if (!draft.value.trim()) return
  store.addComment(ui.drawerTaskId, draft.value)
  draft.value = ''
}

/* ---------- Hiệu ứng, phím tắt ---------- */
watch(
  () => [ui.drawerOpen, ui.drawerTaskId],
  async (_, [, oldId]) => {
    draft.value = ''
    menuOpen.value = false
    await nextTick()
    autosize(titleEl.value)
    autosize(descEl.value)
  },
  { flush: 'post' },
)

// Chuyển sang task khác khi form đang mở: dọn task trống trước đó
watch(
  () => ui.drawerTaskId,
  (_, oldId) => {
    if (oldId && ui.drawerOpen) discardIfBlank(oldId)
  },
)

watch(
  () => ui.focusTick,
  () => setTimeout(() => titleEl.value?.focus(), 360),
)

function onKey(e) {
  if (e.key === 'Escape' && ui.drawerOpen) {
    if (menuOpen.value) menuOpen.value = false
    else close()
  }
}
const onDocClick = () => (menuOpen.value = false)

onMounted(() => {
  document.addEventListener('keydown', onKey)
  document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('click', onDocClick)
})
</script>

<template>
  <!-- Cột nằm trong layout: mở ra thì Overview co lại theo -->
  <aside class="drawer-slot" :class="{ open: ui.drawerOpen }" :aria-hidden="!ui.drawerOpen">
    <div class="drawer" role="dialog" aria-label="Edit task">
      <div v-if="task" :key="task.id" class="inner">
        <!-- Pills + actions -->
        <div class="top">
          <div class="pills">
            <Dropdown v-model="task.priority" :options="priorityOptions" label="Priority">
              <template #trigger="{ open }">
                <span class="pill" :class="['p-' + task.priority, { open }]">
                  <span>{{ prioLabel }}</span>
                  <Icon name="chevron-down" :size="10" class="chev" />
                </span>
              </template>
              <template #option="{ option }">
                <span class="pill" :class="'p-' + option.value">{{ option.label }}</span>
              </template>
            </Dropdown>
            <Dropdown v-model="task.status" :options="statusOptions" label="Status">
              <template #trigger="{ open }">
                <span class="pill" :class="['s-' + task.status, { open }]">
                  <span>{{ statusLabel }}</span>
                  <Icon name="chevron-down" :size="10" class="chev" />
                </span>
              </template>
              <template #option="{ option }">
                <span class="pill" :class="'s-' + option.value">{{ option.label }}</span>
              </template>
            </Dropdown>
          </div>

          <div class="actions">
            <HistoryMenu :task="task" />
            <div class="menu-wrap">
              <button class="icon-btn" aria-label="More" @click.stop="menuOpen = !menuOpen">
                <Icon name="dots" :size="18" />
              </button>
              <div v-if="menuOpen" class="menu" @click.stop>
                <button @click="toggleDone">
                  <Icon name="check-circle" :size="15" />
                  {{ task.done ? 'Mark as not done' : 'Mark as done' }}
                </button>
                <button class="danger" @click="removeTask">
                  <Icon name="trash" :size="15" />
                  Delete task
                </button>
              </div>
            </div>
            <button class="icon-btn" aria-label="Close" @click="close"><Icon name="x" :size="16" /></button>
          </div>
        </div>

        <p class="stamp">
          Created {{ formatTs(createdAtOf(task)) }} <i>•</i> Last modified {{ relativeTime(modifiedAtOf(task), ui.now) }}
        </p>

        <!-- Tên task: sửa trực tiếp -->
        <textarea
          ref="titleEl"
          v-model="task.name"
          class="title"
          rows="1"
          placeholder="Task name"
          aria-label="Task name"
          @input="onTitleInput"
          @keydown.enter.prevent="descEl?.focus()"
        />

        <!-- Assignee / Deadline -->
        <div class="fields">
          <div class="field">
            <span class="f-label">Assignee</span>
            <Dropdown v-model="task.assignee" :options="memberOptions" label="Assignee">
              <template #trigger="{ open }">
                <span class="a-trigger" :class="{ open }">
                  <Avatar :name="task.assignee" :size="22" />
                  <span>{{ task.assignee }}</span>
                  <Icon name="chevron-down" :size="10" class="chev" />
                </span>
              </template>
              <template #option="{ option }">
                <Avatar :name="option.value" :size="24" />
                <span>{{ option.label }}</span>
              </template>
            </Dropdown>
          </div>
          <div class="field">
            <span class="f-label">Deadline</span>
            <input v-model="task.deadline" class="date" type="date" />
          </div>
        </div>

        <!-- Mô tả -->
        <textarea
          ref="descEl"
          v-model="task.description"
          class="desc"
          rows="3"
          placeholder="Add a description…"
          aria-label="Description"
          @input="onDescInput"
        />

        <!-- Sub-task -->
        <section class="sec">
          <div class="sec-head">
            <h3>Sub-Task</h3>
            <button class="icon-btn sm" aria-label="Add sub-task" @click="addSub"><Icon name="plus" :size="16" /></button>
          </div>
          <ul ref="subsEl" class="subs">
            <li v-for="s in task.subtasks" :key="s.id">
              <input v-model="s.done" type="checkbox" :aria-label="`Complete ${s.title}`" />
              <input
                v-model="s.title"
                class="sub-input"
                :class="{ done: s.done }"
                placeholder="Sub-task"
                @keydown.enter.prevent="addSub"
              />
              <button class="icon-btn sm rm" aria-label="Remove sub-task" @click="removeSub(s.id)">
                <Icon name="x" :size="13" />
              </button>
            </li>
          </ul>
          <p v-if="!task.subtasks.length" class="none">No sub-tasks yet</p>
        </section>

        <!-- File đính kèm -->
        <section class="sec files">
          <div v-for="f in task.files" :key="f.id" class="file">
            <FileIcon :type="f.type" :size="32" />
            <div class="f-info">
              <strong :title="f.name">{{ f.name.replace(/\.(pdf|xlsx?|csv)$/i, '') }}</strong>
              <small>{{ formatSize(f.size) }}</small>
            </div>
            <button class="dl" @click="download(f)">Download</button>
            <button class="icon-btn sm rm" aria-label="Remove file" @click="removeFile(f.id)">
              <Icon name="x" :size="13" />
            </button>
          </div>
          <label class="attach">
            <Icon name="paperclip" :size="14" />
            <span>Attach file</span>
            <input type="file" multiple hidden @change="onFiles" />
          </label>
        </section>

        <!-- Comment -->
        <section class="sec">
          <ul v-if="task.comments.length" class="comments">
            <li v-for="c in task.comments" :key="c.id">
              <Avatar :name="c.author" :size="26" />
              <div class="c-body">
                <p class="c-head">
                  <strong>{{ shortName(c.author) }}</strong>
                  <span>{{ relativeTime(c.at, ui.now) }}</span>
                </p>
                <p class="c-text">{{ c.text }}</p>
              </div>
            </li>
          </ul>
          <div class="composer">
            <textarea
              v-model="draft"
              placeholder="Write your comments"
              rows="3"
              @keydown.enter.exact.prevent="send"
            />
            <button class="send" :disabled="!draft.trim()" aria-label="Send comment" @click="send">
              <Icon name="arrow-right" :size="16" />
            </button>
          </div>
        </section>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Cột chứa form: nằm cạnh Overview trong flex layout.
   Độ rộng 0 → drawer-w (+ lề phải 10px) nên Overview co lại cùng lúc form trượt vào. */
.drawer-slot {
  --ease: cubic-bezier(0.22, 0.9, 0.3, 1);
  flex: none;
  width: 0;
  height: 100%;
  padding: 10px 0; /* không có padding ngang để khi đóng, cột chiếm đúng 0px */
  overflow: hidden;
  visibility: hidden;
  transition: width 0.34s var(--ease), visibility 0s linear 0.34s;
}
.drawer-slot.open {
  width: calc(var(--drawer-w) + 10px);
  visibility: visible;
  transition: width 0.34s var(--ease), visibility 0s;
}

.drawer {
  width: var(--drawer-w);
  height: 100%;
  margin-right: 10px; /* lề phải; cột mở ra = drawer-w + 10px */
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 6px 30px rgba(52, 38, 120, 0.16);
  overflow: hidden;
  /* trượt từ phải sang trái */
  transform: translateX(100%);
  transition: transform 0.34s var(--ease);
}
.drawer-slot.open .drawer {
  transform: none;
}

.inner {
  height: 100%;
  overflow-y: auto;
  padding: 18px 24px 26px;
}

/* Màn hình hẹp: không đủ chỗ để co Overview nên form phủ lên trên */
@media (max-width: 960px) {
  .drawer-slot {
    position: fixed;
    z-index: 30;
    top: var(--topbar-h);
    right: 0;
    bottom: 0;
    height: auto;
    width: min(calc(var(--drawer-w) + 10px), 100vw);
    padding: 8px;
    transform: translateX(100%);
    transition: transform 0.34s var(--ease), visibility 0s linear 0.34s;
  }
  .drawer-slot.open {
    width: min(calc(var(--drawer-w) + 10px), 100vw);
    transform: none;
    transition: transform 0.34s var(--ease), visibility 0s;
  }
  .drawer {
    width: 100%;
    margin-right: 0;
    transform: none;
    box-shadow: 0 18px 50px rgba(36, 28, 90, 0.28);
  }
}

/* ---------- Top ---------- */
.top {
  position: relative; /* điểm neo cho popover History */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.pills {
  display: flex;
  gap: 8px;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 26px;
  padding: 0 11px;
  border-radius: 8px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: filter 0.15s, box-shadow 0.15s;
}
.pill:hover {
  filter: brightness(0.97);
}
.pill.open {
  box-shadow: 0 0 0 2px rgba(20, 27, 45, 0.08);
}
.chev {
  transition: transform 0.25s cubic-bezier(0.22, 0.9, 0.3, 1);
}
.open .chev {
  transform: rotate(180deg);
}

/* Trigger của Assignee */
.a-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 10px 0 5px;
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
}
.a-trigger:hover,
.a-trigger.open {
  background: var(--soft);
}
.a-trigger.open {
  box-shadow: 0 0 0 1px var(--border-2);
}
.a-trigger .chev {
  color: var(--muted);
}
.p-high { background: #fde4e4; color: #e5484d; }
.p-medium { background: #fdf0d3; color: #d9902b; }
.p-low { background: #e8e1fb; color: #7a5cdb; }
.s-todo { background: #dcebfc; color: #2b7be4; }
.s-progress { background: #fde8d3; color: #e8812a; }
.s-review { background: #f0e1fa; color: #a24bd1; }

.actions {
  display: flex;
  align-items: center;
  gap: 2px;
}
.icon-btn {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--text-2);
}
.icon-btn:hover {
  background: var(--soft);
}
.icon-btn.sm {
  width: 26px;
  height: 26px;
}
.menu-wrap {
  position: relative;
}
.menu {
  position: absolute;
  top: 34px;
  right: 0;
  z-index: 5;
  min-width: 180px;
  padding: 5px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(20, 27, 45, 0.18), 0 0 0 1px var(--border);
}
.menu button {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  height: 34px;
  padding: 0 10px;
  border-radius: 7px;
  text-align: left;
}
.menu button:hover {
  background: var(--soft);
}
.menu .danger {
  color: var(--danger);
}

.stamp {
  margin-top: 14px;
  color: var(--muted);
  font-size: 11.5px;
}
.stamp i {
  font-style: normal;
  margin: 0 3px;
}

/* ---------- Tiêu đề, mô tả ---------- */
textarea {
  resize: none;
  border: 0;
  outline: 0;
  background: transparent;
  width: 100%;
  display: block;
}
.title {
  margin-top: 10px;
  padding: 4px 6px;
  margin-left: -6px;
  width: calc(100% + 12px);
  border-radius: 8px;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.22;
  letter-spacing: -0.02em;
  overflow: hidden;
}
.title::placeholder {
  color: #b9bfcd;
}
.title:hover,
.title:focus,
.desc:hover,
.desc:focus {
  background: #f6f7fa;
}

.fields {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 28px;
  margin-top: 12px;
}
.field {
  display: flex;
  align-items: center;
  gap: 10px;
}
.f-label {
  color: var(--muted);
  font-size: 12px;
}
.date {
  height: 32px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--text-2);
}
.date:hover,
.date:focus {
  background: var(--soft);
  outline: 0;
}

.desc {
  margin-top: 14px;
  padding: 8px 6px;
  margin-left: -6px;
  width: calc(100% + 12px);
  min-height: 72px;
  border-radius: 8px;
  color: var(--text-2);
  font-size: 13px;
  line-height: 1.6;
  overflow: hidden;
}
.desc::placeholder {
  color: #b9bfcd;
}

/* ---------- Sections ---------- */
.sec {
  margin-top: 18px;
}
.sec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 6px;
}
.sec-head h3 {
  font-size: 13px;
  font-weight: 600;
}

.subs li {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
  border-top: 1px solid var(--border);
}
.subs li:last-child {
  border-bottom: 1px solid var(--border);
}
.sub-input {
  flex: 1;
  min-width: 0;
  height: 30px;
  border: 0;
  outline: 0;
  background: transparent;
  padding: 0 4px;
  border-radius: 6px;
}
.sub-input:focus {
  background: var(--soft);
}
.sub-input.done {
  color: var(--muted);
  text-decoration: line-through;
}
.rm {
  opacity: 0;
  transition: opacity 0.15s;
}
li:hover .rm,
.file:hover .rm,
.rm:focus-visible {
  opacity: 1;
}
.none {
  padding: 10px 0;
  color: var(--muted);
  font-size: 12px;
}

.files {
  margin-top: 14px;
}
.file {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 0;
}
.f-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.f-info strong {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.f-info small {
  color: var(--muted);
  font-size: 11.5px;
}
.dl {
  color: #1479c9;
  font-weight: 500;
  padding: 4px 2px;
}
.dl:hover {
  text-decoration: underline;
}
.attach {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 4px;
  padding: 6px 10px 6px 4px;
  border-radius: 8px;
  color: var(--muted);
  cursor: pointer;
}
.attach:hover {
  color: var(--text);
  background: var(--soft);
}

/* ---------- Comments ---------- */
.comments {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 14px;
}
.comments li {
  display: flex;
  gap: 10px;
}
.c-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.c-head strong {
  font-weight: 600;
}
.c-head span {
  color: var(--muted);
  font-size: 11.5px;
}
.c-text {
  margin-top: 2px;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--text-2);
}
.composer {
  position: relative;
  border: 1px solid var(--border-2);
  border-radius: 12px;
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.composer:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(43, 123, 228, 0.12);
}
.composer textarea {
  padding: 16px 64px 16px 16px;
  min-height: 92px;
  color: var(--text);
}
.composer textarea::placeholder {
  color: var(--text-2);
}
.send {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #14213d;
  color: #fff;
  transition: transform 0.15s, opacity 0.15s;
}
.send:hover:not(:disabled) {
  transform: scale(1.06);
}
.send:disabled {
  opacity: 0.45;
  cursor: default;
}
</style>
