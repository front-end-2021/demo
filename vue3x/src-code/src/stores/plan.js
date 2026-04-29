import { defineStore } from 'pinia'
import { ref } from 'vue'
const colors = ['#3f3f41', '#b9c1a5', '#256b3a', '#adcc44', '#80afd7', '#965c6c', '#e99371', '#fde178']
export const usePlanStore = defineStore('plan', () => {
    const leftWidth = ref(52)

    const activeTab = ref('Handlungsplan') // Active tab

    const popMenu = ref({ key: '' })
    const idChecks = ref(new Set()) // item ids

    const fomInf = ref({
        width: 420,
    })

    const ovwRow = ref({
        mxwTitle: ''
    })

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
            if (id) { obj.id = id }
            popMenu.value = obj
        }
    }
    function genMaxWidthTlt(viewWidth, itemPanels) {
        const len = itemPanels.length
        const tmpW = fomInf.value.width * len
        if (0 < len) {
            let fWdth = tmpW + 3 + len * 30
            let wTlt = viewWidth - leftWidth.value - 48 - 8 - 117 - 216 - 28
            if (1 == len) { wTlt -= (220 + 120) }
            ovwRow.value.mxwTitle = `${wTlt - fWdth}px`
        } else {
            ovwRow.value.mxwTitle = ''
        }
    }
    return {
        idChecks, toggleCheckFilter, activeTab, popMenu, bindPopMenu,
        leftWidth, fomInf, ovwRow, genMaxWidthTlt
    }
})
