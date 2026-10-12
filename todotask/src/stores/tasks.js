import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { formatTs } from '../utils/format'

export const STATUSES = [
  { key: 'todo', label: 'To-do', color: '#2b7be4' },
  { key: 'progress', label: 'On Progress', color: '#f2994a' },
  { key: 'review', label: 'In Review', color: '#a24bd1' },
]

export const PRIORITIES = [
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
]

export const MEMBERS = ['Samantha William', 'Alexa Smith', 'Daniel Park', 'Linh Tran']
export const CURRENT_USER = 'Nguyễn Bá Đại'

const STORAGE_KEY = 'taskflow.tasks.v1'
const HOUR = 3600 * 1000
const MB = 1024 * 1024

let seq = 0
const uid = (prefix = 'id') => `${prefix}_${Date.now().toString(36)}${(seq++).toString(36)}${Math.random().toString(36).slice(2, 6)}`

/* ------------------------------------------------------------------------------------------
 * History
 *
 * Mỗi task có `history: [{ id, type, at, by, from?, to?, ref?, title? }]` xếp theo thời gian tăng dần.
 * Đây là nguồn duy nhất cho thời điểm tạo / sửa của task:
 *   - createdAt  = `at` của entry 'created' (entry đầu tiên)
 *   - modifiedAt = `at` của entry cuối cùng
 * nên task không còn lưu thuộc tính createdAt / modifiedAt riêng.
 *
 * Entry được ghi tự động khi dữ liệu task thay đổi (xem watcher trong store),
 * nên UI cứ v-model thẳng vào task mà không cần gọi gì thêm.
 * ---------------------------------------------------------------------------------------- */

/** Thời điểm tạo task (entry 'created') */
export const createdAtOf = (task) => task.history.find((h) => h.type === 'created')?.at ?? task.history[0]?.at ?? 0
/** Thời điểm sửa gần nhất = entry cuối của history */
export const modifiedAtOf = (task) => task.history.reduce((m, h) => Math.max(m, h.at), 0)

// Các lần sửa liên tiếp cùng loại trong khoảng này được gộp thành 1 entry (tránh mỗi phím gõ ra 1 dòng)
const MERGE_MS = 30_000
const MERGEABLE = new Set(['name', 'description', 'deadline', 'subtask-title'])
const SCALAR_FIELDS = ['name', 'description', 'priority', 'status', 'assignee', 'deadline']

function record(task, entry) {
  const h = task.history
  const last = h[h.length - 1]

  // Thêm rồi xoá ngay (entry cuối) → triệt tiêu nhau
  if ((entry.type === 'subtask-remove' || entry.type === 'file-remove') && last && last.ref === entry.ref
      && last.type === entry.type.replace('remove', 'add')) {
    h.pop()
    return
  }

  // Đang gõ tiêu đề của sub-task vừa thêm: chỉ cập nhật thời điểm
  if (entry.type === 'subtask-title' && last?.type === 'subtask-add' && last.ref === entry.ref) {
    last.at = entry.at
    return
  }

  // Gộp các lần sửa liên tiếp
  if (last && MERGEABLE.has(entry.type) && last.type === entry.type && (last.ref ?? null) === (entry.ref ?? null)
      && entry.at - last.at < MERGE_MS) {
    last.to = entry.to
    last.at = entry.at
    if (last.from === last.to) h.pop() // sửa xong lại về như cũ → coi như không đổi
    return
  }

  h.push({ id: uid('h'), by: CURRENT_USER, ...entry })
}

/** Ảnh chụp các trường được theo dõi của task (để so sánh trước/sau) */
function trackedView(t) {
  return {
    id: t.id,
    name: t.name,
    description: t.description,
    priority: t.priority,
    status: t.status,
    assignee: t.assignee,
    deadline: t.deadline,
    done: t.done,
    subtasks: t.subtasks.map((s) => ({ id: s.id, title: s.title, done: s.done })),
    files: t.files.map((f) => ({ id: f.id, name: f.name })),
    comments: t.comments.map((c) => c.id),
  }
}

/** So sánh 2 ảnh chụp và ghi history cho phần khác nhau */
function recordDiff(task, before, after, at) {
  for (const key of SCALAR_FIELDS) {
    if (before[key] !== after[key]) record(task, { type: key, from: before[key], to: after[key], at })
  }
  if (before.done !== after.done) record(task, { type: 'done', to: after.done, at })

  const prevSubs = new Map(before.subtasks.map((s) => [s.id, s]))
  const nextSubs = new Map(after.subtasks.map((s) => [s.id, s]))
  for (const s of after.subtasks) {
    const o = prevSubs.get(s.id)
    if (!o) record(task, { type: 'subtask-add', ref: s.id, to: s.title, at })
    else {
      if (o.title !== s.title) record(task, { type: 'subtask-title', ref: s.id, from: o.title, to: s.title, at })
      if (o.done !== s.done) record(task, { type: 'subtask-done', ref: s.id, to: s.done, title: s.title, at })
    }
  }
  for (const s of before.subtasks) {
    if (!nextSubs.has(s.id)) record(task, { type: 'subtask-remove', ref: s.id, title: s.title, at })
  }

  const prevFiles = new Set(before.files.map((f) => f.id))
  const nextFiles = new Set(after.files.map((f) => f.id))
  for (const f of after.files) if (!prevFiles.has(f.id)) record(task, { type: 'file-add', ref: f.id, to: f.name, at })
  for (const f of before.files) if (!nextFiles.has(f.id)) record(task, { type: 'file-remove', ref: f.id, title: f.name, at })

  const prevComments = new Set(before.comments)
  for (const id of after.comments) if (!prevComments.has(id)) record(task, { type: 'comment', ref: id, at })
}

/* ------------------------------------------------------------------------------------------
 * Dữ liệu mẫu
 * ---------------------------------------------------------------------------------------- */

const isoShift = (iso, days) => {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d + days)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

function seedTasks() {
  const now = Date.now()
  const CREATED = new Date(2025, 10, 10, 9, 0).getTime() // hiển thị "10 Nov" giống ảnh mẫu
  const SAM = 'Samantha William'
  const h = (type, at, extra = {}, by = SAM) => ({ id: uid('h'), type, at, by, ...extra })

  const mk = (o) => ({
    description: '',
    assignee: SAM,
    done: false,
    subtasks: [],
    files: [],
    comments: [],
    // mặc định: tạo ngày 10 Nov, lần sửa deadline gần nhất cách đây 2 giờ
    history: [
      h('created', CREATED),
      h('deadline', now - 2 * HOUR, { from: isoShift(o.deadline, -3), to: o.deadline }),
    ],
    ...o,
  })

  const moodboardDesc =
    "Moodboard to helping shape the design direction of the website. The spirit of this website is to bring retro ambiance, 80's-90's vibes. It could from the shape, pattern or colors."

  return [
    // To-do
    mk({ id: uid('t'), name: 'Website Sitemap and User Flow', deadline: '2026-11-13', priority: 'high', status: 'todo',
      description: 'Map out every page of the website and the main journeys a visitor can take.' }),
    mk({
      id: uid('t'), name: 'Moodboard Design Style', deadline: '2026-11-17', priority: 'medium', status: 'todo',
      description: moodboardDesc,
      subtasks: [
        { id: uid('s'), title: 'Collect moodboard from Pinterest', done: false },
        { id: uid('s'), title: 'Music album cover', done: false },
        { id: uid('s'), title: "Graphic Poster from 80's-90's", done: false },
      ],
      files: [
        { id: uid('f'), name: 'Vintage Concept.pdf', type: 'pdf', size: 3.5 * MB },
        { id: uid('f'), name: 'List of Elements.xlsx', type: 'xls', size: 12.4 * MB },
      ],
      history: [
        h('created', CREATED),
        h('assignee', now - 26 * HOUR, { from: 'Daniel Park', to: SAM }),
        h('deadline', now - 2 * HOUR, { from: '2026-11-14', to: '2026-11-17' }),
      ],
    }),
    mk({ id: uid('t'), name: 'Final Wireframe', deadline: '2026-11-20', priority: 'medium', status: 'todo',
      description: 'Consolidate the approved low-fidelity layouts into one final wireframe set.' }),
    mk({
      id: uid('t'), name: 'Illustrations', deadline: '2026-11-25', priority: 'low', status: 'todo', assignee: 'Alexa Smith',
      description: 'Hero and section illustrations in the retro style.',
      history: [
        h('created', CREATED),
        h('assignee', now - 5 * HOUR, { from: SAM, to: 'Alexa Smith' }),
        h('deadline', now - 2 * HOUR, { from: '2026-11-22', to: '2026-11-25' }),
      ],
    }),
    // On Progress
    mk({ id: uid('t'), name: 'Website Sitemap and User Flow', deadline: '2026-11-13', priority: 'high', status: 'progress' }),
    mk({ id: uid('t'), name: 'Moodboard Design Style', deadline: '2026-11-17', priority: 'medium', status: 'progress' }),
    // In Review
    mk({ id: uid('t'), name: 'Website Sitemap and User Flow', deadline: '2026-11-13', priority: 'high', status: 'review' }),
    mk({ id: uid('t'), name: 'Moodboard Design Style', deadline: '2026-11-17', priority: 'medium', status: 'review' }),
  ]
}

/** Dữ liệu lưu từ phiên bản cũ (createdAt/modifiedAt) → chuyển sang history */
function migrate(t) {
  if (Array.isArray(t.history)) return t
  const { createdAt, modifiedAt, ...rest } = t
  const created = createdAt ?? Date.now()
  const history = [{ id: uid('h'), type: 'created', at: created, by: CURRENT_USER }]
  if (modifiedAt && modifiedAt > created) history.push({ id: uid('h'), type: 'updated', at: modifiedAt, by: CURRENT_USER })
  return { ...rest, history }
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data.map(migrate) : null
  } catch {
    return null
  }
}

function persist(tasks) {
  try {
    // bỏ `url` (blob tạm) vì không lưu lại được
    const clean = tasks.map((t) => ({ ...t, files: t.files.map(({ url, ...f }) => f) }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
  } catch {
    /* localStorage bị chặn: bỏ qua */
  }
}

/* ------------------------------------------------------------------------------------------
 * Store
 * ---------------------------------------------------------------------------------------- */

export const useTaskStore = defineStore('tasks', () => {
  const project = ref({
    name: 'Landing Page',
    description:
      'Exploration landing page for various industry. The exploration could be company profile, offering service, or selling physical product.',
    members: ['Samantha William', 'Alexa Smith', 'Daniel Park'],
  })

  const tasks = ref(loadSaved() ?? seedTasks())

  const byId = (id) => tasks.value.find((t) => t.id === id) || null

  watch(tasks, (v) => persist(v), { deep: true })

  // Tự ghi history: mỗi lần dữ liệu được theo dõi đổi, so ảnh chụp trước/sau và ghi phần khác nhau.
  // (getter trả về mảng mới mỗi lần nên callback luôn nhận được cả giá trị cũ lẫn mới)
  watch(
    () => tasks.value.map(trackedView),
    (next, prev) => {
      const before = new Map(prev.map((v) => [v.id, v]))
      const at = Date.now()
      for (const after of next) {
        const old = before.get(after.id)
        const task = byId(after.id)
        if (old && task) recordDiff(task, old, after, at)
      }
    },
  )

  const groups = computed(() =>
    STATUSES.map((s) => ({ ...s, items: tasks.value.filter((t) => t.status === s.key) })),
  )

  /** Ngày tạo dự án = ngày tạo task sớm nhất */
  const createdLabel = computed(() => {
    const ts = tasks.value.map(createdAtOf).filter(Boolean)
    return ts.length ? formatTs(Math.min(...ts)) : '—'
  })

  /** Lần sửa gần nhất của cả dự án = lần sửa gần nhất của các task */
  const lastModified = computed(() => tasks.value.reduce((m, t) => Math.max(m, modifiedAtOf(t)), 0) || Date.now())

  function createTask(status = 'todo') {
    const id = uid('t')
    tasks.value.push({
      id,
      name: '',
      description: '',
      deadline: '',
      assignee: MEMBERS[0],
      priority: 'medium',
      status,
      done: false,
      subtasks: [],
      files: [],
      comments: [],
      history: [{ id: uid('h'), type: 'created', at: Date.now(), by: CURRENT_USER }],
    })
    return id
  }

  function remove(id) {
    const i = tasks.value.findIndex((t) => t.id === id)
    if (i >= 0) tasks.value.splice(i, 1)
  }

  function addSubtask(id) {
    const t = byId(id)
    if (!t) return null
    const s = { id: uid('s'), title: '', done: false }
    t.subtasks.push(s)
    return s.id
  }

  function removeSubtask(id, sid) {
    const t = byId(id)
    if (t) t.subtasks = t.subtasks.filter((s) => s.id !== sid)
  }

  function addFile(id, file) {
    const t = byId(id)
    if (t) t.files.push({ id: uid('f'), ...file })
  }

  function removeFile(id, fid) {
    const t = byId(id)
    if (t) t.files = t.files.filter((f) => f.id !== fid)
  }

  function addComment(id, text) {
    const t = byId(id)
    if (!t || !text.trim()) return
    t.comments.push({ id: uid('c'), author: CURRENT_USER, text: text.trim(), at: Date.now() })
  }

  return {
    project, tasks, groups, createdLabel, lastModified,
    byId, createTask, remove,
    addSubtask, removeSubtask, addFile, removeFile, addComment,
  }
})
