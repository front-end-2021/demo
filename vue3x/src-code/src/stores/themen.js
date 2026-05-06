import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getItems, emptyItem } from '../mockdata/themen'
import { filterMap, mapFind } from '../utils/utility'
import DOMPurify from 'dompurify';

export const useThemenStore = defineStore('item', () => {
  // ── Active panels ─────────────────────────────────────────────
  const itemPanels = ref([]) // array of item object (max 2 visible side panels)

  // ── Data ──────────────────────────────────────────────────────
  let items = ref({})
  try {
    items.value = getItems() // map
  } catch (error) {
    console.error('Failed to load items from mockdata:', error)
    items.value = new Map()
  }

  // ── Computed: visible flat list respecting expanded state ─────
  /**
   * Computes a flat list of visible items respecting expanded state
   * @returns {Array} Flat list of visible items with level information
   */
  const visibleItems = computed(() => {
    try {
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
    } catch (error) {
      console.error('Failed to compute visible items:', error)
      return []
    }
  })

  /**
   * Gets the parent chain of an item
   * @param {number} itemId - Item ID
   * @param {number} [level=0] - Max levels to traverse (0 for all)
   * @returns {Array} Chain of parent items
   */
  function getParentChain(itemId, level = 0) {
    try {
      const chain = []
      let current = items.value.get(itemId)
      while (current) {
        chain.unshift(current)
        if (0 < level && level == chain.length) { return chain }
        current = current.parentId ? items.value.get(current.parentId) : null
      }
      return chain
    } catch (error) {
      console.error('Failed to get parent chain:', error)
      return []
    }
  }

  /**
   * Checks if an item has any children
   * @param {number} itemId - Item ID to check
   * @returns {Object|undefined} First child found or undefined
   */
  function anyChild(itemId) { 
    return mapFind(items.value, i => i.parentId === itemId) 
  }

  /**
   * Toggles the expanded state of an item
   * @param {number} id - Item ID
   */
  function toggleExpand(id) {
    try {
      const item = items.value.get(id)
      if (item) item.expanded = !item.expanded
    } catch (error) {
      console.error('Failed to toggle expand:', error)
    }
  }

  /**
   * Toggles the done state of an item
   * @param {number} id - Item ID
   */
  function toggleDone(id) {
    try {
      const item = items.value.get(id)
      if (item) item.done = !item.done
    } catch (error) {
      console.error('Failed to toggle done:', error)
    }
  }

  /**
   * Removes an edit panel at the specified index
   * @param {number} index - Panel index to close
   */
  function closePanelAt(index) { 
    try {
      itemPanels.value.splice(index, 1)
    } catch (error) {
      console.error('Failed to close panel:', error)
    }
  }

  /**
   * Updates an item with new fields, sanitizing title input
   * @param {number} id - Item ID
   * @param {Object} fields - Fields to update
   */
  function updateItem(id, fields) {
    try {
      const item = items.value.get(id)
      if (item) {
        let txt = fields.title
        const cleanTextOnly = DOMPurify.sanitize(txt, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
        const name = cleanTextOnly.replace(/[\r\n]+/gm, " ").trim();
        if (name && name != item.title) {
          fields.title = name
          Object.assign(item, fields)
        }
      }
    } catch (error) {
      console.error('Failed to update item:', error)
    }
  }

  /**
   * Adds a new item to the tree
   * @param {number|null} parentId - Parent item ID or null for root
   * @param {number} [type=1] - Item type
   * @param {Array} [regions=[]] - Associated regions
   * @returns {Object} The newly created item
   */
  function addItem(parentId, type = 1, regions = []) {
    try {
      const parent = parentId ? items.value.get(parentId) : null
      const maxId = Math.max(...filterMap(items.value, i => true, [], 'id'), 0)
      const newItem = Object.assign(emptyItem(), {
        id: maxId + 1, parentId,
        level: parent ? parent.level + 1 : 0,
        type, color: 'green', regions,
      })
      items.value.set(newItem.id, newItem)
      if (parent) parent.expanded = true
      return newItem
    } catch (error) {
      console.error('Failed to add item:', error)
      return null
    }
  }

  /**
   * Removes an item from the tree
   * @param {number} id - Item ID to remove
   */
  function removeItem(id) { 
    try {
      items.value.delete(id)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  return {
    visibleItems, itemPanels, removeItem, items,
    toggleExpand, toggleDone, closePanelAt,
    updateItem, addItem, getParentChain, anyChild
  }
})
