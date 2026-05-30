import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { emptyItem, getCollapses } from '../mockdata/themen'
import { filterMap, mapFind, setLocal, maxId } from '../utils/utility'
import DOMPurify from 'dompurify';
import { LOCAL_STORE_KEY, ITEM_FTYPE } from '../constants'
import { useGappStore } from './gapp'

export const useThemenStore = defineStore('item', () => {
  const gappStore = useGappStore()

  const collapses = ref(new Set(getCollapses()))

  /**
   * Computes a flat list of visible items respecting expanded state
   * @returns {Array} Flat list of visible items with level information
   */
  const visibleItems = computed(() => {
    const result = []
    let collapsedParents = new Set(collapses.value)
    for (let item of gappStore.treeItems) {
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
   * @param {number} [level=0] - Max level to traverse (0 for all)
   * @returns {Array} Chain of parent items
   */
  function getParentChain(itemId, level = 0) {
    try {
      const chain = []
      let current = gappStore.items.get(itemId)
      while (current) {
        chain.unshift(current)
        if (0 < level && level == chain.length) { return chain }
        current = current.parentId ? gappStore.items.get(current.parentId) : null
      }
      return chain
    } catch (error) {
      console.error('Failed to get parent chain:', error)
      return []
    }
  }

  /**
   * Gets the child chain of a parent
   * @param {number} itemId - Parent item ID
   * @param {number} [level=1] - Max depth to traverse (0 for all levels)
   * @returns {Array} Chain of child items
   */
  function getChildChain(itemId, level = 1) {
    const result = []
    // Map each collected id to its depth relative to itemId (itemId itself = depth 0)
    const depthOf = new Map([[itemId, 0]])
    for (let item of gappStore.treeItems) {
      if (!depthOf.has(item.parentId)) { continue }
      const childDepth = depthOf.get(item.parentId) + 1
      result.push(item)
      // Keep traversing deeper only when level=0 (unlimited) or childDepth < level
      if (level === 0 || childDepth < level) {
        depthOf.set(item.id, childDepth)
      }
    }
    return result
  }

  /**
   * Checks if an item has any children
   * @param {number} id - Item ID to check
   * @returns {Object|undefined} First child found or undefined
   */
  function anyChild(id) { return mapFind(gappStore.items, i => i.parentId === id) }

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
      const item = gappStore.items.get(id)
      if (item) {
        item.done = !item.done
        setLocal(gappStore.items, LOCAL_STORE_KEY.Items)
      }
    } catch (error) {
      console.error('Failed to toggle done:', error)
    }
  }

  /**
   * Removes an edit panel at the specified index
   * @param {number} index - Panel index to close
   */
  function closePanelAt(index) { if (-1 < index) { gappStore.itemPanels.splice(index, 1) } }

  /**
   * Updates an item with new fields, sanitizing title input
   * @param {number} id - Item ID
   * @param {Object} fields - Fields to update
   */
  function updateItem(id, fields, type = '') {
    try {
      const mapItems = gappStore.items
      const item = mapItems.get(id)
      if (item) {
        if (ITEM_FTYPE.regionIds === type) {
          item.regions = fields
          setLocal(mapItems, LOCAL_STORE_KEY.Items)
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
                setLocal(mapItems, LOCAL_STORE_KEY.Items)
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
                setLocal(mapItems, LOCAL_STORE_KEY.Items)
              }
              break;
            default:
              fields.id = id
              fields.title = item.title
              Object.assign(item, fields)
              setLocal(mapItems, LOCAL_STORE_KEY.Items)
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
      const mapItems = gappStore.items
      const parent = parentId ? mapItems.get(parentId) : null
      const newId = maxId(filterMap(mapItems, i => true, [], 'id')) + 1
      const level = typeof gappStore.getLvl(parentId) == 'number' ? gappStore.getLvl(parentId) + 1 : 0
      const nItem = Object.assign(emptyItem(), {
        id: newId, parentId,
        type, color: 'green', regions,
      })
      gappStore.setLvl(newId, level)
      mapItems.set(nItem.id, nItem)
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
      const lsE = gappStore.itemPanels
      let allCids = getChildChain(id, 0).map(x => x.id)
      let dIds = new Set([id, ...allCids])
      for (let ii = lsE.length - 1, xx; -1 < ii; ii--) {
        xx = lsE[ii]
        if (!dIds.has(xx.id)) { continue }
        lsE.splice(ii, 1)
      }
      for (let _id of dIds) {
        gappStore.items.delete(_id)
        delete gappStore.levels[_id]
      }
      setLocal(gappStore.items, LOCAL_STORE_KEY.Items)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  return {
    visibleItems, collapses,
    toggleExpand, toggleDone, closePanelAt, getChildChain,
    updateItem, addItem, getParentChain, anyChild, removeItem
  }
})
