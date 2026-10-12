<script setup>
import { computed } from 'vue'
import { initials } from '../utils/format'

const props = defineProps({
  name: { type: String, default: '' },
  size: { type: Number, default: 32 },
  ring: { type: Boolean, default: false },
})

// Màu phẳng (không gradient), chữ trắng vẫn đủ tương phản
const PALETTE = ['#e07a5f', '#7b4bd6', '#2a9d8f', '#3b82f6', '#e5486f', '#e8903a']

const color = computed(() => {
  let h = 0
  for (const ch of props.name) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return PALETTE[h % PALETTE.length]
})
</script>

<template>
  <span
    class="avatar"
    :class="{ ring }"
    :title="name"
    :style="{
      width: size + 'px',
      height: size + 'px',
      fontSize: Math.round(size * 0.4) + 'px',
      background: color,
    }"
  >{{ initials(name) }}</span>
</template>

<style scoped>
.avatar {
  display: inline-grid;
  place-items: center;
  flex: none;
  border-radius: 50%;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.02em;
  user-select: none;
}
.avatar.ring {
  box-shadow: 0 0 0 2px #fff;
}
</style>
