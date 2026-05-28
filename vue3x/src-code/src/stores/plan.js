import { defineStore } from 'pinia'
import { ref } from 'vue'
import { COLORS, MENU_KEYS } from '../constants'
//import { useGappStore } from './gapp'

export const usePlanStore = defineStore('plan', () => {
    //const gappStore = useGappStore()

    const gSize = ref ({
        wdthL: 52, wdthF: 450
    })
    const activeTab = ref('Handlungsplan') // Active tab
    
    const idChecks = ref(new Set()) // item ids

    function toggleCheckFilter(id) {
        if (idChecks.value.has(id)) {
            idChecks.value.delete(id)
        } else {
            idChecks.value.add(id)
        }
    }
    return {
        idChecks, toggleCheckFilter, activeTab, gSize, 
    }
})
