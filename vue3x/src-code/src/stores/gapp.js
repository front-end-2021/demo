import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getItems, emptyItem, getCollapses } from '../mockdata/themen'
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
    function getLvl(id) { return levels.value[id] }
    function setLvl(id, l) { levels.value[id] = l}
    return {
        popMenu, items, itemPanels, levels,
        getLvl, setLvl
    }
})