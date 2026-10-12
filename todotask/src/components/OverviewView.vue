<script setup>
import { computed, ref } from 'vue'
import { useTaskStore, PRIORITIES } from '../stores/tasks'
import { useUiStore } from '../stores/ui'
import { formatDay, relativeTime, shortName } from '../utils/format'
import Icon from './Icon.vue'
import Avatar from './Avatar.vue'
import DiagramsView from './DiagramsView.vue'

const store = useTaskStore()
const ui = useUiStore()

const projectTabs = [
  { key: 'details', label: 'Project Details', icon: 'file-text' },
  { key: 'tasks', label: 'Tasks', icon: 'list-task' },
  { key: 'timeline', label: 'Timeline', icon: 'calendar' },
  { key: 'diagrams', label: 'Diagrams', icon: 'diagram' },
  { key: 'members', label: 'Members', icon: 'people' },
]

const prioLabel = Object.fromEntries(PRIORITIES.map((p) => [p.key, p.label]))

function newTask(status = 'todo') {
  const id = store.createTask(status)
  ui.collapsed = { ...ui.collapsed, [status]: false }
  ui.openDrawer(id, { focusTitle: true })
}

function open(id) {
  ui.openDrawer(id)
}

// ---------- v-in-view (theo dõi hàng nào đang nằm trong vùng cuộn) ----------
const scrollEl = ref(null) // vùng cuộn .table-wrap, dùng làm `root` của IntersectionObserver

// data: tối thiểu 150ms giữa 2 lần gọi callback (tránh gọi dồn khi cuộn nhanh)
const TmThrotte = ref(150)

// computed: tuỳ chọn giống IntersectionObserver API; root tự cập nhật khi scrollEl được gắn
const OjIntersec = computed(() => ({
  threshold: 0,
  root: scrollEl.value,
  rootMargin: '-10px 0px',
}))

// Đánh dấu hàng trên DOM: data-in-view="true|false"
function inViewport(isVisible, entry) {
  entry.target.dataset.inView = String(isVisible)
}
</script>

<template>
  <section class="overview">
    <header class="project-head">
      <div class="head-left">
        <p class="meta">
          <Icon name="clock" :size="14" />
          <span>Created {{ store.createdLabel }}</span>
          <i class="dot">•</i>
          <span>Last modified {{ relativeTime(store.lastModified, ui.now) }}</span>
        </p>
        <h1>{{ store.project.name }}</h1>
        <p class="desc">{{ store.project.description }}</p>
      </div>

      <div class="head-right">
        <button class="btn-new" @click="newTask()">
          <Icon name="plus" :size="16" />
          <span>New Task</span>
        </button>
        <div class="members">
          <Avatar v-for="m in store.project.members" :key="m" :name="m" :size="32" ring class="m" />
          <button class="add-member" title="Add member" aria-label="Add member">
            <Icon name="person-plus" :size="15" />
          </button>
        </div>
      </div>
    </header>

    <div class="ptabs" role="tablist">
      <button
        v-for="t in projectTabs"
        :key="t.key"
        class="ptab"
        role="tab"
        :class="{ active: ui.projectTab === t.key }"
        :aria-selected="ui.projectTab === t.key"
        @click="ui.projectTab = t.key"
      >
        <Icon :name="t.icon" :size="15" />
        <span>{{ t.label }}</span>
      </button>
      <span class="grow" />
      <button class="ptab search">
        <Icon name="search" :size="14" />
        <span>Search</span>
      </button>
    </div>

    <div v-if="ui.projectTab === 'tasks'" ref="scrollEl" class="table-wrap">
      <div class="table">
        <div v-for="g in store.groups" :key="g.key" class="group">
          <div class="group-head">
            <button
              class="chev"
              :class="{ collapsed: ui.collapsed[g.key] }"
              :aria-label="ui.collapsed[g.key] ? 'Expand' : 'Collapse'"
              @click="ui.toggleGroup(g.key)"
            >
              <Icon name="chevron-down" :size="13" />
            </button>
            <span class="bar" :style="{ background: g.color }" />
            <span class="g-label">{{ g.label }}</span>
            <span class="count">{{ g.items.length }}</span>
            <span class="grow" />
            <button class="g-add" :aria-label="`Add task to ${g.label}`" @click="newTask(g.key)">
              <Icon name="plus" :size="16" />
            </button>
          </div>

          <template v-if="!ui.collapsed[g.key]">
            <div class="row labels">
              <span class="cell check"><input type="checkbox" disabled aria-hidden="true" /></span>
              <span class="cell">Task name</span>
              <span class="cell">Deadline</span>
              <span class="cell">Assignee</span>
              <span class="cell">Priority</span>
            </div>

            <div
              v-for="t in g.items"
              :key="t.id"
              v-in-view="{ callback: inViewport, throttle: TmThrotte, intersection: OjIntersec }"
              class="row item"
              :class="{ selected: ui.selectedTaskId === t.id, done: t.done }"
              tabindex="0"
              title="Double-click to edit"
              @click="ui.selectedTaskId = t.id"
              @dblclick="open(t.id)"
              @keydown.enter="open(t.id)"
            >
              <span class="cell check">
                <input
                  v-model="t.done"
                  type="checkbox"
                  :aria-label="`Mark ${t.name || 'task'} as done`"
                  @click.stop
                  @dblclick.stop
                />
              </span>
              <span class="cell name" :class="{ empty: !t.name }">{{ t.name || 'Untitled task' }}</span>
              <span class="cell muted">{{ formatDay(t.deadline) }}</span>
              <span class="cell">{{ shortName(t.assignee) }}</span>
              <span class="cell">
                <span class="prio" :class="'prio-' + t.priority">{{ prioLabel[t.priority] }}</span>
              </span>
            </div>

            <p v-if="!g.items.length" class="empty-group">No tasks here yet</p>
          </template>
        </div>
      </div>
    </div>

    <DiagramsView v-else-if="ui.projectTab === 'diagrams'" />

    <div v-else class="soon">
      <Icon name="check-circle" :size="34" />
      <p>This section is coming soon.</p>
    </div>
  </section>
</template>

<style scoped>
.overview {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* ---------- Header ---------- */
.project-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px 24px;
  padding: 22px 26px 16px;
}
.meta {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--muted);
  font-size: 11.5px;
}
.dot {
  font-style: normal;
}
h1 {
  margin-top: 14px;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.desc {
  margin-top: 8px;
  max-width: 560px;
  color: var(--text-2);
  font-size: 12.5px;
  line-height: 1.55;
}
.head-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}
.btn-new {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 20px;
  border-radius: 10px;
  border: 1px solid var(--border-2);
  background: #fff;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(20, 27, 45, 0.06);
  transition: background 0.15s, box-shadow 0.15s;
}
.btn-new:hover {
  background: var(--soft);
  box-shadow: 0 2px 6px rgba(20, 27, 45, 0.1);
}
.members {
  display: flex;
  align-items: center;
}
.members .m {
  margin-left: -4px;
}
.members .m:first-child {
  margin-left: 0;
}
.add-member {
  margin-left: 8px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid var(--border-2);
  color: var(--text-2);
  background: #fff;
}
.add-member:hover {
  background: var(--soft);
}

/* ---------- Tabs ---------- */
.ptabs {
  display: flex;
  align-items: stretch;
  gap: 22px;
  padding: 0 26px;
  border-bottom: 1px solid var(--border);
}
.ptab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  color: var(--text-2);
  font-weight: 500;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s;
  white-space: nowrap;
}
.ptab:hover {
  color: var(--text);
}
.ptab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}
.ptab.search {
  font-weight: 400;
}
.grow {
  flex: 1;
}

/* ---------- Table ---------- */
.table-wrap {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
.table {
  min-width: 600px;
}

.group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 22px 0 18px;
  background: var(--soft);
  border-bottom: 1px solid var(--border);
}
.group:not(:first-child) .group-head {
  border-top: 1px solid var(--border);
}
.chev {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  color: var(--text-2);
  transition: transform 0.2s, background 0.15s;
}
.chev:hover {
  background: rgba(20, 27, 45, 0.07);
}
.chev.collapsed {
  transform: rotate(-90deg);
}
.bar {
  width: 3px;
  height: 18px;
  border-radius: 3px;
}
.g-label {
  font-weight: 600;
}
.count {
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
.g-add {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  color: var(--text-2);
}
.g-add:hover {
  background: rgba(20, 27, 45, 0.07);
}

.row {
  display: grid;
  grid-template-columns: 46px minmax(180px, 1fr) 110px 150px 110px;
  align-items: center;
  border-bottom: 1px solid #eef0f4;
}
.row .cell {
  padding: 0 8px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.row .cell.check {
  display: grid;
  place-items: center;
  padding: 0 0 0 14px;
}

.row.labels {
  height: 40px;
  color: var(--muted);
  font-size: 12px;
}
.row.labels input {
  visibility: hidden;
}

.row.item {
  position: relative;
  height: 48px;
  cursor: default;
  transition: background 0.12s;
}
.row.item:hover {
  background: #fafbfd;
}
.row.item.selected {
  background: #f4effd;
}
.row.item.selected::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #9b5de5;
}
.row.item .name {
  color: var(--text);
}
.row.item .name.empty {
  color: var(--muted);
  font-style: italic;
}
.row.item .muted {
  color: var(--text-2);
}
.row.item.done .name {
  color: var(--muted);
  text-decoration: line-through;
}

.empty-group {
  padding: 14px 22px 14px 66px;
  color: var(--muted);
  font-size: 12px;
  border-bottom: 1px solid #eef0f4;
}

.prio {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.prio-high {
  background: #fde4e4;
  color: #e5484d;
}
.prio-medium {
  background: #fdf0d3;
  color: #d9902b;
}
.prio-low {
  background: #e8e1fb;
  color: #7a5cdb;
}

.soon {
  flex: 1;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 10px;
  color: var(--muted);
}

@media (max-width: 720px) {
  .project-head {
    grid-template-columns: 1fr;
    padding: 18px 16px 12px;
  }
  .head-right {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .ptabs {
    padding: 0 16px;
    gap: 16px;
    overflow-x: auto;
  }
}
</style>
