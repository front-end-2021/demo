import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getItems, emptyItem, getCollapses } from '../mockdata/themen'
import { filterMap } from '../utils/utility'

export const useGappStore = defineStore('gapp', () => {
    const popMenu = ref('')

    const itemPanels = ref([]) // array of item object (max 2 visible side panels)

    const levels = ref({})
    let items = ref(new Map())
    try {
        items.value = getItems() // map
    } catch (error) {
        console.error('Failed to load items from mockdata:', error)
    }

    const treeItems = computed(() => {
        try {
            const result = []
            const genItems = (parentId, lvl) => {
                const children = filterMap(items.value, i => i.parentId === parentId, [])
                children.forEach(item => {
                    setLvl(item.id, lvl)
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

    function getLvl(id) { return levels.value[id] }
    function setLvl(id, l) { levels.value[id] = l }
    return {
        popMenu, items, itemPanels, levels, treeItems,
        getLvl, setLvl,
    }
})