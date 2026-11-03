import { PRIORITIES, STATUSES } from '../stores/tasks'
import { formatDay } from './format'

const labelOf = (list, key) => list.find((i) => i.key === key)?.label ?? key
const clip = (s, n = 36) => (s && s.length > n ? s.slice(0, n - 1) + '…' : s)
const day = (iso) => (iso ? formatDay(iso) : 'No deadline')

/**
 * Chuyển 1 entry history thành dữ liệu hiển thị.
 * @returns {{ icon: string, tone: string, title: string, from?: string, to?: string, detail?: string }}
 *   - icon: tên icon trong Icon.vue, tone: màu (green|gray|red|purple|blue|orange|teal)
 *   - from/to: giá trị trước → sau (nếu có), detail: dòng mô tả thêm
 */
export function describeEntry(e, task) {
  const sub = task.subtasks.find((s) => s.id === e.ref)
  const comment = task.comments.find((c) => c.id === e.ref)

  switch (e.type) {
    case 'created':
      return { icon: 'plus-circle', tone: 'green', title: 'Task created' }
    case 'name':
      return e.from
        ? { icon: 'pencil', tone: 'gray', title: 'Title changed', from: clip(e.from), to: clip(e.to) || '(empty)' }
        : { icon: 'pencil', tone: 'gray', title: 'Title set', detail: clip(e.to) }
    case 'description':
      return { icon: 'text-left', tone: 'gray', title: 'Description edited' }
    case 'priority':
      return { icon: 'flag', tone: 'red', title: 'Priority changed', from: labelOf(PRIORITIES, e.from), to: labelOf(PRIORITIES, e.to) }
    case 'status':
      return { icon: 'arrow-left-right', tone: 'purple', title: 'Status changed', from: labelOf(STATUSES, e.from), to: labelOf(STATUSES, e.to) }
    case 'assignee':
      return { icon: 'person', tone: 'blue', title: 'Assignee changed', from: e.from, to: e.to }
    case 'deadline':
      return { icon: 'calendar-event', tone: 'orange', title: 'Deadline changed', from: day(e.from), to: day(e.to) }
    case 'done':
      return e.to
        ? { icon: 'check-circle', tone: 'green', title: 'Marked as done' }
        : { icon: 'undo', tone: 'gray', title: 'Marked as not done' }
    case 'subtask-add':
      return { icon: 'list-check', tone: 'teal', title: 'Sub-task added', detail: clip(sub?.title || e.to) || 'Untitled sub-task' }
    case 'subtask-title':
      return { icon: 'list-check', tone: 'teal', title: 'Sub-task renamed', from: clip(e.from) || '(empty)', to: clip(e.to) || '(empty)' }
    case 'subtask-done':
      return { icon: 'list-check', tone: 'teal', title: e.to ? 'Sub-task completed' : 'Sub-task reopened', detail: clip(sub?.title || e.title) }
    case 'subtask-remove':
      return { icon: 'list-check', tone: 'teal', title: 'Sub-task removed', detail: clip(e.title) || 'Untitled sub-task' }
    case 'file-add':
      return { icon: 'file-plus', tone: 'teal', title: 'File attached', detail: clip(e.to) }
    case 'file-remove':
      return { icon: 'file-x', tone: 'teal', title: 'File removed', detail: clip(e.title) }
    case 'comment':
      return { icon: 'chat', tone: 'blue', title: 'Comment added', detail: clip(comment?.text) }
    default:
      return { icon: 'pencil-square', tone: 'gray', title: 'Task updated' }
  }
}
