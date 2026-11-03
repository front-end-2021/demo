<script setup>
// Dropdown dùng chung (có animation + shadow + điều khiển bằng bàn phím).
// - options: [{ value, label }]
// - slot `trigger` ({ open, selected }): giao diện nút mở
// - slot `option`  ({ option, selected }): giao diện mỗi dòng (mặc định: hiện label)
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, required: true },
  align: { type: String, default: 'left' }, // 'left' | 'right'
  label: { type: String, default: '' }, // aria-label cho nút mở
})
const emit = defineEmits(['update:modelValue', 'change'])

const open = ref(false)
const active = ref(0)
const root = ref(null)
const triggerEl = ref(null)
const listEl = ref(null)
const uid = Math.random().toString(36).slice(2, 8)

const selected = computed(() => props.options.find((o) => o.value === props.modelValue) ?? null)

async function show() {
  active.value = Math.max(0, props.options.findIndex((o) => o.value === props.modelValue))
  open.value = true
  await nextTick()
  listEl.value?.focus({ preventScroll: true }) // để phím mũi tên / Enter / Esc hoạt động
}

function hide(refocus = false) {
  open.value = false
  if (refocus) triggerEl.value?.focus()
}

const toggle = () => (open.value ? hide() : show())

function pick(option) {
  if (option.value !== props.modelValue) {
    emit('update:modelValue', option.value)
    emit('change', option.value)
  }
  hide(true)
}

function onKey(e) {
  if (!open.value) return
  const last = props.options.length - 1
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      active.value = active.value >= last ? 0 : active.value + 1
      break
    case 'ArrowUp':
      e.preventDefault()
      active.value = active.value <= 0 ? last : active.value - 1
      break
    case 'Home':
      e.preventDefault()
      active.value = 0
      break
    case 'End':
      e.preventDefault()
      active.value = last
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      pick(props.options[active.value])
      break
    case 'Escape':
      e.preventDefault()
      e.stopPropagation() // chỉ đóng dropdown, không đóng cả form edit
      hide(true)
      break
    case 'Tab':
      hide()
      break
  }
}

function onOutside(e) {
  if (open.value && root.value && !root.value.contains(e.target)) hide()
}

onMounted(() => document.addEventListener('pointerdown', onOutside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutside))
</script>

<template>
  <div ref="root" class="dd" @keydown="onKey">
    <button
      ref="triggerEl"
      type="button"
      class="dd-trigger"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-label="label || undefined"
      @click="toggle"
    >
      <slot name="trigger" :open="open" :selected="selected">{{ selected?.label }}</slot>
    </button>

    <Transition name="pop">
      <ul
        v-if="open"
        ref="listEl"
        class="menu"
        :class="align"
        role="listbox"
        tabindex="-1"
        :aria-activedescendant="`${uid}-opt-${active}`"
      >
        <li
          v-for="(o, i) in options"
          :id="`${uid}-opt-${i}`"
          :key="o.value"
          role="option"
          class="opt"
          :class="{ active: i === active, selected: o.value === modelValue }"
          :aria-selected="o.value === modelValue"
          @mouseenter="active = i"
          @click="pick(o)"
        >
          <span class="opt-body">
            <slot name="option" :option="o" :selected="o.value === modelValue">{{ o.label }}</slot>
          </span>
          <Icon v-if="o.value === modelValue" name="check" :size="16" class="tick" />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.dd {
  position: relative;
  display: inline-block;
}

.dd-trigger {
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
}

.menu {
  position: absolute;
  top: calc(100% + 6px);
  z-index: 10;
  min-width: max(100%, 160px);
  width: max-content;
  max-width: 280px;
  padding: 5px;
  outline: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow:
    0 14px 34px rgba(20, 27, 45, 0.18),
    0 3px 8px rgba(20, 27, 45, 0.08),
    0 0 0 1px rgba(20, 27, 45, 0.06);
}
.menu.left {
  left: 0;
  transform-origin: top left;
}
.menu.right {
  right: 0;
  transform-origin: top right;
}

.opt {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 38px;
  padding: 0 10px 0 8px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.1s;
}
.opt.active {
  background: var(--soft);
}
.opt.selected {
  font-weight: 600;
}
.opt-body {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.tick {
  color: var(--primary);
}

/* Animation mở/đóng: mờ dần + trượt xuống nhẹ + phóng to nhẹ */
.pop-enter-active {
  transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.22, 0.9, 0.3, 1);
}
.pop-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}

/* Các mục trượt vào lần lượt cho mềm mại */
.pop-enter-active .opt {
  animation: opt-in 0.24s cubic-bezier(0.22, 0.9, 0.3, 1) backwards;
}
.pop-enter-active .opt:nth-child(2) { animation-delay: 0.025s; }
.pop-enter-active .opt:nth-child(3) { animation-delay: 0.05s; }
.pop-enter-active .opt:nth-child(4) { animation-delay: 0.075s; }
.pop-enter-active .opt:nth-child(n + 5) { animation-delay: 0.1s; }
@keyframes opt-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pop-enter-active,
  .pop-leave-active,
  .pop-enter-active .opt {
    transition: none;
    animation: none;
  }
}
</style>
