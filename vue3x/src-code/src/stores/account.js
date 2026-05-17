import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getRegions, getUsers } from '../mockdata/account'
import {maxId, setLocal} from '../utils/utility'

export const useAccStore = defineStore('acc', () => {
    const users = ref(getUsers())
    const account = ref(users.value[0])
    const regions = ref(getRegions())
    const mapRegions = computed(() => new Map(regions.value.map(r => [r.id, r])))

    function getRegionsBy(ids) {
        return ids.map(id => mapRegions.value.get(id)).filter(r => r).map(r => r.title)
    }
    function addRegion(txt){
        let newId = maxId(regions.value.map(r => r.id)) + 1
        let newRegion = { id: newId, title: txt }
        regions.value.push(newRegion)
        setLocal('regions', regions.value)
        return newRegion
    }

    return {
        users, account, regions, mapRegions,
        getRegionsBy, addRegion
    }
})
