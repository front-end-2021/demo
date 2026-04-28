import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
const colors = ['#3f3f41', '#b9c1a5', '#256b3a', '#adcc44', '#80afd7', '#965c6c', '#e99371', '#fde178']
export const usePlanStore = defineStore('plan', () => {
    // ── Active tab ────────────────────────────────────────────────
    const leftWidth = ref(52)
    const activeTab = ref('Handlungsplan')
    const popMenu = ref({ key: '' })
    const idChecks = ref(new Set()) // item ids

    function toggleCheckFilter(id) {
        if (idChecks.value.has(id)) {
            idChecks.value.delete(id)
        } else {
            idChecks.value.add(id)
        }
    }
    function bindPopMenu(key = '', color, id) {
        if (!key) {
            popMenu.value = { key: '' }
        } else {
            let setC = new Set(colors)
            let lsC = [...colors]
            if (!setC.has(color)) { lsC.push(color) }
            let obj = { key, color, colors: lsC }
            if(id) { obj.id = id }
            popMenu.value = obj
        }
    }
    return {
        idChecks, toggleCheckFilter, activeTab, popMenu, bindPopMenu,
        leftWidth,
    }
})
