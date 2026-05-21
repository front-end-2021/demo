import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getItems, emptyItem, getCollapses } from '../mockdata/themen'
import { filterMap, mapFind, setLocal, maxId } from '../utils/utility'
import DOMPurify from 'dompurify';
import { LOCAL_STORE_KEY, ITEM_FTYPE } from '../constants'

export const useThemenStore = defineStore('item', () => {
  // ── Active panels ─────────────────────────────────────────────
  const itemPanels = ref([]) // array of item object (max 2 visible side panels)
  const levels = ref({})
  const collapses = ref(new Set(getCollapses()))
  // ── Data ──────────────────────────────────────────────────────
  let items = ref(new Map())
  try {
    items.value = getItems() // map
  } catch (error) {
    console.error('Failed to load items from mockdata:', error)
  }

  // ── Computed: visible flat list respecting expanded state ─────
  const treeItems = computed(() => {
    try {
      const result = []
      const genItems = (parentId, lvl) => {
        const children = filterMap(items.value, i => i.parentId === parentId, [])
        children.forEach(item => {
          levels.value[item.id] = lvl
          result.push(item)
          genItems(item.id, lvl + 1)
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
   * Computes a flat list of visible items respecting expanded state
   * @returns {Array} Flat list of visible items with level information
   */
  const visibleItems = computed(() => {
    const result = []
    let collapsedParents = new Set(collapses.value)
    for (let item of treeItems.value) {
      if (!item.parentId) { result.push(item) }
      else if (collapsedParents.has(item.parentId)) {
        collapsedParents.add(item.id)
      } else {
        result.push(item)
      }
    }
    return result
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
  function getChildChain(itemId, level = 1) {
    const result = []
    let ids = new Set([itemId])
    let lvl = level - 1
    for (let item of treeItems.value) {
      if (ids.has(item.parentId)) {
        result.push(item)
        if (0 == level || 0 < lvl) { ids.add(item.id) }
        lvl--
      }
    }
    return result
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
      if (collapses.value.has(id)) {
        collapses.value.delete(id)
      } else {
        collapses.value.add(id)
      }
      setLocal(Array.from(collapses.value), LOCAL_STORE_KEY.Collapses)
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
        if (ITEM_FTYPE.regionIds === type) {
          item.value.regions = fields
          setLocal(items.value, LOCAL_STORE_KEY.Items)
        } else {
          fields = { ...fields }
          fields.regions = item.regions
          switch (type) {
            case ITEM_FTYPE.name:
              let txt = fields.title
              const cleanTextOnly = DOMPurify.sanitize(txt, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
              const name = cleanTextOnly.replace(/[\r\n]+/gm, " ").trim();
              if (name && name != item.title) {
                fields.title = name
                Object.assign(item, fields)
                setLocal(items.value, LOCAL_STORE_KEY.Items)
              }
              break;
            case ITEM_FTYPE.date:
              const regex = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
              let { dateStart, dateEnd } = fields
              dateStart = dateStart.trim()
              dateEnd = dateEnd.trim()
              const isS = !dateStart || regex.test(dateStart)
              const isE = !dateEnd || regex.test(dateEnd)
              if (!isS) { dateStart = item.dateStart }
              if (!isE) { dateEnd = item.dateEnd }
              if (isS && isE) {
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
      const newId = maxId(filterMap(items.value, i => true, [], 'id')) + 1
      const level = levels.value[parentId] ? levels.value[parentId] + 1 : 0
      const nItem = Object.assign(emptyItem(), {
        id: newId, parentId,
        level,
        type, color: 'green', regions,
      })
      items.value.set(nItem.id, nItem)
      if (parent) { collapses.value.delete(parentId) }
      return nItem
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
      const lsE = itemPanels.value
      for (let ii = lsE.length - 1, x; -1 < ii; ii--) {
        x = lsE[ii]
        if (x.id != id) continue
        lsE.splice(ii, 1)
      }
      items.value.delete(id)
      setLocal(items.value, LOCAL_STORE_KEY.Items)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  return {
    visibleItems, itemPanels, items, levels, collapses, treeItems,
    toggleExpand, toggleDone, closePanelAt, getChildChain,
    updateItem, addItem, getParentChain, anyChild, removeItem
  }
})
