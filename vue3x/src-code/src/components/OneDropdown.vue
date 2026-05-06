<template>
  <div class="dropdown-wrapper" ref="wrapperRef">
    <button class="dropdown-trigger" @click="toggle" :class="{ open: isOpen }">
      <span class="dropdown-label">{{ selectedLabel }}</span>
      <svg class="chevron" viewBox="0 0 10 6" fill="none">
        <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu">
        <button
          v-for="item in src"
          :key="item.value"
          class="dropdown-item"
          :class="{ active: item.value === modelValue }"
          @click="select(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  src: { // Array of { value, label }
    type: Array,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'selection'])

const isOpen = ref(false)
const wrapperRef = ref(null)

const selectedLabel = computed(() => {
  const found = props.src.find((i) => i.value === props.modelValue)
  return found ? found.label : '—'
})

function toggle() {
  isOpen.value = !isOpen.value
}

function select(item) {
  emit('update:modelValue', item.value)
  emit('selection', item)
  isOpen.value = false
}

function onClickOutside(e) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<style scoped>
.dropdown-wrapper {
  position: relative;
  display: inline-block;
  min-width: 90px;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 6px 10px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  color: var(--text-primary);
  transition: border-color 0.15s, background 0.15s;
  white-space: nowrap;
}

.dropdown-trigger:hover,
.dropdown-trigger.open {
  border-color: var(--accent);
  background: var(--bg-hover);
}

.dropdown-label {
  flex: 1;
  text-align: left;
}

.chevron {
  width: 10px;
  height: 6px;
  flex-shrink: 0;
  color: var(--text-muted);
  transition: transform 0.2s;
}

.dropdown-trigger.open .chevron {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 100;
  min-width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  overflow: hidden;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  color: var(--text-primary);
  text-align: left;
  transition: background 0.12s;
}

.dropdown-item:hover {
  background: var(--bg-hover);
}

.dropdown-item.active {
  color: var(--accent);
  font-weight: 500;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
