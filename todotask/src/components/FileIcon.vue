<script setup>
import pdf from 'bootstrap-icons/icons/file-earmark-pdf-fill.svg?raw'
import xls from 'bootstrap-icons/icons/file-earmark-excel-fill.svg?raw'
import other from 'bootstrap-icons/icons/file-earmark-fill.svg?raw'

const map = { pdf, xls, file: other }

defineProps({
  type: { type: String, default: 'file' },
  size: { type: Number, default: 30 },
})
</script>

<template>
  <span
    class="file-icon"
    :class="type"
    :style="{ width: size + 'px', height: size + 'px' }"
    v-html="map[type] || other"
  />
</template>

<style scoped>
.file-icon {
  display: inline-flex;
  flex: none;
  line-height: 0;
}
.file-icon :deep(svg) {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
.pdf {
  color: #f0613f;
}
.xls {
  color: #21a366;
}
.file {
  color: #9aa3b5;
}
</style>
