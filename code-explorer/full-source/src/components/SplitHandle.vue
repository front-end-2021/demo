<template>
  <!-- Thanh kéo để đổi độ rộng giữa sơ đồ và editor. Chỉ báo vị trí con trỏ (clientX); bên ngoài tự tính độ rộng. -->
  <div class="split-handle" role="separator" aria-orientation="vertical" @pointerdown.prevent="start"></div>
</template>

<script setup>
const emit = defineEmits(['drag'])

function start(e) {
  const el = e.currentTarget
  el.setPointerCapture(e.pointerId)
  document.body.classList.add('is-resizing')
  const move = (ev) => emit('drag', ev.clientX)
  const stop = () => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerup', stop)
    el.removeEventListener('pointercancel', stop)
    document.body.classList.remove('is-resizing')
  }
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerup', stop)
  el.addEventListener('pointercancel', stop)
}
</script>

<style scoped>
.split-handle {
  flex: none;
  width: 6px;
  margin: 0 -3px; /* vùng bắt chuột rộng hơn đường kẻ, nhưng không chiếm chỗ */
  z-index: 10;
  cursor: col-resize;
  touch-action: none;
  background: transparent;
}

.split-handle:hover {
  background: rgba(37, 99, 235, 0.25);
}
</style>
