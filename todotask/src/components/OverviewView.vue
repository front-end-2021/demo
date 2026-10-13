<script setup>
import { computed, ref } from 'vue'
import { useTaskStore, PRIORITIES } from '../stores/tasks'
import { useUiStore } from '../stores/ui'
import { formatDay, relativeTime, shortName } from '../utils/format'
import Icon from './Icon.vue'
import Avatar from './Avatar.vue'
import DiagramsView from './DiagramsView.vue'
import { VIEWTYPE, LABELTYPE } from '../utils/common.js'

const store = useTaskStore()
const ui = useUiStore()

const projectTabs = [
  { key: VIEWTYPE.prdetai, label: LABELTYPE.prdetai, icon: 'file-text' },
  { key: VIEWTYPE.lstsk, label: LABELTYPE.lstsk, icon: 'list-task' },
  { key: VIEWTYPE.tmmline, label: LABELTYPE.tmmline, icon: 'calendar' },
  { key: VIEWTYPE.diagrm, label: LABELTYPE.diagrm, icon: 'diagram' },
  { key: VIEWTYPE.mems, label: LABELTYPE.mems, icon: 'people' },
]

const prioLabel = Object.fromEntries(PRIORITIES.map((p) => [p.key, p.label]))

function newTask(status = 'todo') {
  const id = store.createTask(status)
  ui.collapsed = { ...ui.collapsed, [status]: false }
  ui.openDrawer(id, { focusTitle: true })
}

function open(id) { ui.openDrawer(id) }

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
function clkTab(k) {
  ui.closeDrawer()
  ui.projectTab = k
}
</script>

<template>
  <section class="overview">
    <header v-if="ui.projectTab != VIEWTYPE.diagrm" class="project-head">
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
        <button v-if="ui.projectTab === VIEWTYPE.lstsk" class="btn-new" @click="newTask()">
          <Icon name="plus" :size="16" />
          <span>New Task</span>
        </button>
        <span v-else style="height: 40px;"></span>
        <div class="members">
          <Avatar v-for="m in store.project.members" :key="m" :name="m" :size="32" ring class="m" />
          <button class="add-member" title="Add member" aria-label="Add member">
            <Icon name="person-plus" :size="15" />
          </button>
        </div>
      </div>
    </header>

    <div class="ptabs" role="tablist">
      <button v-for="t in projectTabs" :key="t.key" class="ptab" role="tab" :class="{ active: ui.projectTab === t.key }"
        :aria-selected="ui.projectTab === t.key" @click="clkTab(t.key)">
        <Icon :name="t.icon" :size="15" />
        <span>{{ t.label }}</span>
      </button>
      <span class="grow" />
      <button class="ptab search">
        <Icon name="search" :size="14" />
        <span>Search</span>
      </button>
    </div>

    <div v-if="ui.projectTab === VIEWTYPE.lstsk" ref="scrollEl" class="table-wrap">
      <div class="table">
        <div v-for="g in store.groups" :key="g.key" class="group">
          <div class="group-head">
            <button class="chev" :class="{ collapsed: ui.collapsed[g.key] }"
              :aria-label="ui.collapsed[g.key] ? 'Expand' : 'Collapse'" @click="ui.toggleGroup(g.key)">
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

            <div v-for="t in g.items" :key="t.id"
              v-in-view="{ callback: inViewport, throttle: TmThrotte, intersection: OjIntersec }" class="row item"
              :class="{ selected: ui.selectedTaskId === t.id, done: t.done }" tabindex="0" title="Double-click to edit"
              @click="ui.selectedTaskId = t.id" @dblclick="open(t.id)" @keydown.enter="open(t.id)">
              <span class="cell check">
                <input v-model="t.done" type="checkbox" :aria-label="`Mark ${t.name || 'task'} as done`" @click.stop
                  @dblclick.stop />
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

    <DiagramsView v-else-if="ui.projectTab === VIEWTYPE.diagrm" />

    <div v-else class="soon">
      <Icon name="check-circle" :size="34" />
      <p>This section is coming soon.</p>
    </div>
  </section>
</template>

<style src="./overview-view.css" scoped></style>
