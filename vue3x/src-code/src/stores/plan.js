import { defineStore } from 'pinia'
import { ref } from 'vue'
import { COLORS, MENU_KEYS } from '../constants.js'

export const usePlanStore = defineStore('plan', () => {
    const gSize = ref ({
        wdthL: 52, wdthF: 450
    })
    const activeTab = ref('Handlungsplan') // Active tab

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
            let setC = new Set(COLORS)
            let lsC = [...COLORS]
            if (!setC.has(color)) { lsC.push(color) }
            let obj = { key, color, colors: lsC }
            if (id) { obj.id = id }
            popMenu.value = obj
        }
    }
    
    return {
        idChecks, toggleCheckFilter, activeTab, popMenu, bindPopMenu, gSize, 
    }
})
