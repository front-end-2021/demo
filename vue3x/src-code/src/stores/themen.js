import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getItems, emptyItem } from '../mockdata/themen'
import { filterMap, someMap } from '../utils/utility'

export const useThemenStore = defineStore('item', () => {
  // ── Active panels ─────────────────────────────────────────────
  const itemPanels = ref([]) // array of item object (max 2 visible side panels)

  // ── Data ──────────────────────────────────────────────────────
  const items = ref(getItems()) // map

  // ── Computed: visible flat list respecting expanded state ─────
  const visibleItems = computed(() => {
    const result = []
    const genItems = (parentId, lvl) => {
      const children = filterMap(items.value, i => i.parentId === parentId, [])
      children.forEach(item => {
        item.level = lvl
        result.push(item)
        if (item.expanded) genItems(item.id, lvl + 1)
      })
    }
    genItems(null, 0)
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
    let lsEdit = itemPanels.value
    const ii = lsEdit.findIndex(x => id == x.id)
    if (-1 < ii) lsEdit.splice(ii, 0 == ii ? lsEdit.length : 1)
  }

  function closePanelAt(index) { itemPanels.value.splice(index, 1) }

  function updateItem(id, fields) {
    const item = items.value.get(id)
    if (item) {
      let name = fields.title
      if (name) {
        name = name.replaceAll('\n', ' ')
        name = name.trim()
      }
      if (name) {
        fields.title = name
        Object.assign(item, fields)
      }
    }
  }

  function addItem(parentId, type = 1, regions = []) {
    const parent = parentId ? items.value.get(parentId) : null
    const maxId = Math.max(...filterMap(items.value, i => true, [], 'id'), 0)
    const newItem = Object.assign(emptyItem(), {
      id: maxId + 1, parentId,
      level: parent ? parent.level + 1 : 0,
      type, color: 'green', regions,
      dateDays: '',
    })
    items.value.set(newItem.id, newItem)
    if (parent) parent.expanded = true
    return newItem
  }
  function removeItem(id) { items.value.delete(id) }
  return {
    visibleItems, itemPanels, removeItem,
    toggleExpand, toggleDone, closePanel, closePanelAt,
    updateItem, addItem, getParentChain, anyChild
  }
})
