import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getItems } from '../mockdata/themen'
import { filterMap, someMap } from '../utils/utility'

export const useThemenStore = defineStore('themen', () => {
  // ── Active panels ─────────────────────────────────────────────
  const openPanels = ref([]) // array of item IDs (max 2 visible side panels)

  // ── Data ──────────────────────────────────────────────────────
  const items = ref(getItems()) // map

  // ── Computed: visible flat list respecting expanded state ─────
  const visibleItems = computed(() => {
    const result = []
    const addItems = (parentId, lvl) => {
      const children = filterMap(items.value, i => i.parentId === parentId, [])
      children.forEach(item => {
        item.level = lvl
        result.push(item)
        if (item.expanded) addItems(item.id, lvl + 1)
      })
    }
    addItems(null, 0)
    return result
  })

  function getParentChain(itemId) {
    const chain = []
    let current = items.value.get(itemId)
    while (current) {
      chain.unshift(current)
      current = current.parentId ? items.value.get(current.parentId) : null
    }
    return chain
  }

  function anyChild(itemId) { return someMap(items.value, i => i.parentId === itemId) }

  function toggleExpand(id) {
    const item = items.value.get(id)
    if (item) item.expanded = !item.expanded
  }

  function toggleDone(id) {
    const item = items.value.get(id)
    if (item) item.done = !item.done
  }

  function closePanel(id) {
    const idx = openPanels.value.indexOf(id)
    if (idx > -1) openPanels.value.splice(idx, idx === 0 ? openPanels.value.length : 1)
  }

  function closePanelAt(index) {
    openPanels.value.splice(index, 1)
  }

  function updateItem(id, fields) {
    const item = items.value.get(id)
    if (item) Object.assign(item, fields)
  }

  function addItem(parentId) {
    const parent = parentId ? items.value.get(parentId) : null
    const maxId = Math.max(...filterMap(items.value, i => true, [], 'id'), 0)
    items.value.set(maxId + 1, {
      id: maxId + 1,
      parentId,
      level: parent ? parent.level + 1 : 0,
      type: 'aufgabe',
      title: 'Neues Element',
      regions: [],
      responsible: '',
      progress: '',
      progressColor: '',
      dateStart: '', dateDays: '', dateEnd: '',
      tags: [],
      expanded: false,
      done: false,
      pinned: 0,
      region: [],
      team: [],
      category: [],
      anspruch: [],
    })
    if (parent) parent.expanded = true
  }

  const getPanelItems = computed(() => openPanels.value.map(id => items.value.get(id)))

  return {
    visibleItems, openPanels, getPanelItems,
    toggleExpand, toggleDone, closePanel, closePanelAt,
    updateItem, addItem, getParentChain, anyChild
  }
})
