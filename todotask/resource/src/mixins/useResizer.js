import { ref } from 'vue'
// Kéo mép phải để đổi độ rộng
export const dragging = ref(false)

export function onDown(e) {
  e.preventDefault()
  dragging.value = true
  let target = e.currentTarget
  target.setPointerCapture(e.pointerId)
  let parent = target.closest(target.getAttribute('parent'))
  let off = parent ? parent.getBoundingClientRect() : { left: 0 }
  target.dataset.initx = off.left
  document.body.classList.add('is-resizing')
}
export function onMoving(e, callback) {
  if (!dragging.value) return
  callback(e)
}
export function onUp(e) {
  if (!dragging.value) return
  dragging.value = false
  document.body.classList.remove('is-resizing')
  try {
    let target = e.currentTarget
    target.releasePointerCapture(e.pointerId)
    delete target.dataset.initx
  } catch {
    /* đã được nhả */
  }
}