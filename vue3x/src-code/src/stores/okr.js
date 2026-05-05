import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Unit types: 1 = %, 2 = number, 3 = effektiv (boolean-like)
export const UNITS = {
    1: { label: '%', symbol: '%' },
    2: { label: 'Zahl', symbol: '' },
    3: { label: 'effektiv', symbol: '' },
}

// Kennzahl (metric) dropdown options
export const KENNZAHL_OPTIONS = [
    { value: 'percent', label: '%' },
    { value: 'absolute', label: 'Absolut' },
    { value: 'index', label: 'Index' },
]

export const useKRStore = defineStore('kr', () => {
    // ── State ──────────────────────────────────────────────
    const krForm = ref(null)
    const krObjects = ref({
        2: {
            id: 2,
            type: 15,
            idKResults: [1, 2],
            idDates: ['24.4.2026', '6.5.2026', '8.5.2026'],
        },
        5: {
            id: 5,
            type: 15,
            idKResults: [3],
            idDates: ['11.12.2026', '8.5.2026'],
        },
    })
    const kResults = ref({
        1: {
            target: 789.0,
            unit: 1,
            name: 'Erhöhung der Social-Media-Follower um 20 % bis Ende des Quartals',
            des: 'Dies umfasst den Ausbau der Social-Media-Präsenz durch gezielte Kampagnen, die Förderung von…',
            lagging: true,
            kennzahl: 'percent',
        },
        2: {
            target: 33.0,
            unit: 3,
            name: 'b',
            des: '',
            lagging: false,
            kennzahl: 'percent',
        },
        3: {
            target: 69.0,
            unit: 2,
            name: 'Erstellung der Marketingstrategie',
            des: 'demo',
            lagging: false,
            kennzahl: 'absolute',
        },
    })
    const kDates = ref({
        '24.4.2026': { 1: 112.0, 2: 30.0 },
        '6.5.2026': { 1: 222.0, 2: 22.0 },
        '8.5.2026': { 1: 77.0, 2: 23.0, 3: 69.0 },
        '11.12.2026': { 3: 77.0 },
    })
    // ── Getters ────────────────────────────────────────────
    const activeKResults = computed(() =>
        krForm.value.idKResults.map((id) => ({ id, ...kResults.value[id] }))
    )

    const activeDates = computed(() => krForm.value.idDates)

    function getDateEntriesForKR(krId) {
        return activeDates.value.map((date) => ({
            date,
            ist: kDates.value[date]?.[krId] ?? null,
            soll: computeSoll(krId, date),
        }))
    }

    function computeSoll(krId, date) {
        // Simple linear interpolation placeholder
        const kr = kResults.value[krId]
        if (!kr) return null
        return kr.target
    }

    function getKI(krId) {
        const entries = getDateEntriesForKR(krId)
        const latest = entries.filter((e) => e.ist !== null).at(-1)
        if (!latest) return null
        const kr = kResults.value[krId]
        if (!kr?.target) return null
        return ((latest.ist / kr.target) * 100).toFixed(1)
    }

    function getIst(krId) {
        const entries = getDateEntriesForKR(krId)
        return entries.filter((e) => e.ist !== null).at(-1)?.ist ?? null
    }

    function getDelta(krId) {
        const entries = getDateEntriesForKR(krId).filter((e) => e.ist !== null)
        if (entries.length < 2) return null
        return entries.at(-1).ist - entries.at(-2).ist
    }

    const totalProgress = computed(() => {
        const ids = krForm.value.idKResults
        const pcts = ids.map((id) => parseFloat(getKI(id)) || 0)
        if (!pcts.length) return 0
        return (pcts.reduce((a, b) => a + b, 0) / pcts.length).toFixed(0)
    })

    // ── Actions ────────────────────────────────────────────
    function updateKennzahl(krId, value) {
        if (kResults.value[krId]) kResults.value[krId].kennzahl = value
    }

    function addDate(krId, date, ist) {
        if (!kDates.value[date]) kDates.value[date] = {}
        kDates.value[date][krId] = ist
        const krO = krForm.value
        if (!krO.idDates.includes(date)) {
            krO.idDates.push(date)
        }
    }

    function addKResult() {
        const newId = Math.max(...Object.keys(kResults.value).map(Number)) + 1
        kResults.value[newId] = {
            target: 0,
            unit: 1,
            name: '',
            des: '',
            lagging: false,
            kennzahl: 'percent',
        }
        krForm.value.idKResults.push(newId)
    }

    function deleteKResult(krId) {
        krForm.value.idKResults = krForm.value.idKResults.filter((id) => id !== krId)
    }
    function setKrForm(krId) {
        let obj = krObjects.value[krId]
        if (obj) { krForm.value = obj }
        else { krForm.value = null }
    }
    return {
        krForm,
        kResults,
        kDates,
        activeKResults,
        activeDates,
        totalProgress,
        getDateEntriesForKR,
        getKI,
        getIst,
        getDelta,
        updateKennzahl,
        addDate,
        addKResult,
        deleteKResult, setKrForm,
        UNITS,
    }
})