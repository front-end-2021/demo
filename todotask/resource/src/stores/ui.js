import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { VIEWTYPE, LABELTYPE } from '../utils/common'

export const SIDEBAR_MIN = 52
export const SIDEBAR_MAX = 280
export const SIDEBAR_EXPAND_AT = 132 // từ độ rộng này trở lên thì hiện nhãn chữ
const WIDTH_KEY = 'taskflow.sidebarWidth'

function loadWidth() {
  try {
    const v = Number(localStorage.getItem(WIDTH_KEY))
    return v >= SIDEBAR_MIN && v <= SIDEBAR_MAX ? v : SIDEBAR_MIN
  } catch {
    return SIDEBAR_MIN
  }
}

export const useUiStore = defineStore('ui', () => {
  // --- Thanh lề trái ---
  const sidebarWidth = ref(loadWidth())
  const sidebarExpanded = computed(() => sidebarWidth.value >= SIDEBAR_EXPAND_AT)

  function setSidebarWidth(w) {
    sidebarWidth.value = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, Math.round(w)))
    try {
      localStorage.setItem(WIDTH_KEY, String(sidebarWidth.value))
    } catch {
      /* bỏ qua */
    }
  }

  // --- Điều hướng ---
  const activeArea = ref(VIEWTYPE.mtasks) // sidebar
  const activeTab = ref(VIEWTYPE.ovview) // topbar
  const projectTab = ref(VIEWTYPE.lstsk) // tab trong overview

  // --- Overview ---
  const collapsed = ref({})
  const selectedTaskId = ref(null)

  function toggleGroup(key) {
    collapsed.value = { ...collapsed.value, [key]: !collapsed.value[key] }
  }

  // --- Form edit trượt bên phải ---
  const drawerOpen = ref(false)
  const drawerTaskId = ref(null)
  const focusTick = ref(0)

  function openDrawer(id, { focusTitle = false } = {}) {
    drawerTaskId.value = id
    selectedTaskId.value = id
    drawerOpen.value = true
    if (focusTitle) focusTick.value++
  }

  function closeDrawer() { drawerOpen.value = false }

  // --- Đồng hồ để cập nhật "x minutes ago" ---
  const now = ref(Date.now())
  function tick() {
    now.value = Date.now()
  }

  return {
    sidebarWidth, sidebarExpanded, setSidebarWidth,
    activeArea, activeTab, projectTab,
    collapsed, selectedTaskId, toggleGroup,
    drawerOpen, drawerTaskId, focusTick, openDrawer, closeDrawer,
    now, tick,
  }
})
