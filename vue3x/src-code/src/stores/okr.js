import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { KENNZAHL_OPTIONS, UNITS, ITEM_TYPES } from '../constants'
import { maxId } from '../utils/utility'

/**
 * Creates an empty KR (Key Result) object
 * @param {number} id - The KR identifier
 * @param {number} unit - The unit type (1=%, 2=number, 3=effective)
 * @returns {Object} Empty KR object
 */
export function emptyKResult(id, unit) {
    return {
        id, unit, target: 0, name: '', des: '', lagging: false,
        kennzahl: KENNZAHL_OPTIONS.percent.value
    }
}

export const useKRStore = defineStore('kr', () => {
    // ── State ──────────────────────────────────────────────
    const krForm = ref(null)
    const krObjects = ref({
        2: {
            id: 2,
            type: ITEM_TYPES.OKR,
            idKResults: [1, 2],
            idDates: ['24.4.2026', '6.5.2026', '8.5.2026'],
        },
        5: {
            id: 5,
            type: ITEM_TYPES.OKR,
            idKResults: [3],
            idDates: ['11.12.2026', '8.5.2026'],
        },
    })
    const kResults = ref({
        1: Object.assign(emptyKResult(1, UNITS.PERCENT), {
            target: 789.0,
            name: 'Erhöhung der Social-Media-Follower um 20 % bis Ende des Quartals',
            des: 'Dies umfasst den Ausbau der Social-Media-Präsenz durch gezielte Kampagnen, die Förderung von…',
            lagging: true,
        }),
        2: Object.assign(emptyKResult(2, UNITS.EFFECTIVE), {
            target: 33.0,
            name: 'b',
            kennzahl: KENNZAHL_OPTIONS.index.value,
        }),
        3: Object.assign(emptyKResult(3, UNITS.NUMBER), {
            target: 69.0,
            name: 'Erstellung der Marketingstrategie',
            des: 'demo',
            kennzahl: KENNZAHL_OPTIONS.absolute.value,
        }),
    })
    const kDates = ref({
        '24.4.2026': { 1: 112.0, 2: 30.0 },
        '6.5.2026': { 1: 222.0, 2: 22.0 },
        '8.5.2026': { 1: 77.0, 2: 23.0, 3: 69.0 },
        '11.12.2026': { 3: 77.0 },
    })
    // ── Getters ────────────────────────────────────────────   
    const activeDates = computed(() => krForm ? krForm.value.idDates : [])

    function getDateEntriesForKR(krId) {
        return activeDates.value.map((date) => ({
            date,
            ist: kDates.value[date]?.[krId] ?? null,
            soll: computeSoll(krId, date),
        }))
    }

    function computeSoll(krId, date) {
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

    // ── Actions ────────────────────────────────────────────
    function updateKennzahl(krId, value) {
        if (kResults.value[krId]) kResults.value[krId].kennzahl = value
    }

    function addDate(krId, date, ist) {
        if (!kDates.value[date]) kDates.value[date] = {}
        kDates.value[date][krId] = ist
        const krO = krForm.value
        if (!krO.idDates.includes(date)) { krO.idDates.push(date) }
    }

    function addKResult() {
        const newId = maxId(Object.keys(kResults.value).map(Number)) + 1
        kResults.value[newId] = Object.assign(emptyKResult(newId, 1), {
            lagging: true,
        })
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
        activeDates,
        getDateEntriesForKR,
        getKI, getIst, getDelta,
        updateKennzahl,
        addDate, addKResult,
        deleteKResult, setKrForm,
    }
})