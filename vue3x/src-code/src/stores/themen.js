import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getItems, emptyItem } from '../mockdata/themen'
import { filterMap, mapFind, setLocal } from '../utils/utility'
import DOMPurify from 'dompurify';
import { LOCAL_STORE_KEY } from '../constants'

export const useThemenStore = defineStore('item', () => {
  // ── Active panels ─────────────────────────────────────────────
  const itemPanels = ref([]) // array of item object (max 2 visible side panels)

  // ── Data ──────────────────────────────────────────────────────
  let items = ref(new Map())
  try {
    items.value = getItems() // map
  } catch (error) {
    console.error('Failed to load items from mockdata:', error)
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
   * @param {number} id - Item ID to check
   * @returns {Object|undefined} First child found or undefined
   */
  function anyChild(id) { return mapFind(items.value, i => i.parentId === id) }

  /**
   * Toggles the expanded state of an item
   * @param {number} id - Item ID
   */
  function toggleExpand(id) {
    try {
      const item = items.value.get(id)
      if (item) {
        item.expanded = !item.expanded
        setLocal(items.value, LOCAL_STORE_KEY.Items)
      }
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
      if (item) {
        item.done = !item.done
        setLocal(items.value, LOCAL_STORE_KEY.Items)
      }
    } catch (error) {
      console.error('Failed to toggle done:', error)
    }
  }

  /**
   * Removes an edit panel at the specified index
   * @param {number} index - Panel index to close
   */
  function closePanelAt(index) { if (-1 < index) { itemPanels.value.splice(index, 1) } }

  /**
   * Updates an item with new fields, sanitizing title input
   * @param {number} id - Item ID
   * @param {Object} fields - Fields to update
   */
  function updateItem(id, fields, type = '') {
    try {
      const item = items.value.get(id)
      if (item) {
        switch (type) {
          case 'name':
            let txt = fields.title
            const cleanTextOnly = DOMPurify.sanitize(txt, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
            const name = cleanTextOnly.replace(/[\r\n]+/gm, " ").trim();
            if (name && name != item.title) {
              fields.title = name
              Object.assign(item, fields)
              setLocal(items.value, LOCAL_STORE_KEY.Items)
            }
            break;
          case 'date':
            const regex = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
            let { dateStart, dateEnd } = fields
            dateStart = dateStart.trim()
            dateEnd = dateEnd.trim()
            const isS = !dateStart || regex.test(dateStart)
            const isE = !dateEnd || regex.test(dateEnd)
            if (!isS) { dateStart = item.dateStart }
            if (!isE) { dateEnd = item.dateEnd }
            if (isS || isE) {
              Object.assign(item, fields)
              setLocal(items.value, LOCAL_STORE_KEY.Items)
            }
            break;
          default:
            fields.id = id
            fields.title = item.title
            Object.assign(item, fields)
            setLocal(items.value, LOCAL_STORE_KEY.Items)
            break;
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
      setLocal(items.value, LOCAL_STORE_KEY.Items)
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
