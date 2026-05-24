<template>
    <div class="container a-down" ref="el">
        <div class="m-section" v-for="mn in gMenus">
            <h5 class="sec-tlt">{{ gTlt[mn.id] }}</h5>
            <div class="menu-item" v-for="t in mn.types" @click.stop="newItem(t)">
                <div class="icon" v-html="icType[t]"></div>
                <span>{{ aTyp[t] }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemenStore } from '../stores/themen'
import { usePlanStore } from '../stores/plan'
import { icType, aTyp } from '../utils/utility'
import { ITEM_TYPES } from '../constants'
const props = defineProps({
    types: { type: Array, default: [] },
    rgnids: { type: Array, default: [] },
    pid: { type: Number, default: 0 },
})
const el = ref(null);
const store = useThemenStore()
const planStore = usePlanStore()
const gTlt = {
    1: 'Ziele / Projekte',
    2: 'Vorhaben',
    3: 'Strategisches Management',
    4: 'Themenfelder',
    5: 'CRM',
}
/**
 * Group list of menu type
 * @returns {Array} [ id: Number, types: [] ]
 */
const gMenus = computed(() => {
    let arr = Object.values(ITEM_TYPES)
    arr.sort((a, b) => a - b)
    let lstyp = props.types.length ? props.types : arr // orderd
    let grp = {
        1: new Set([ITEM_TYPES.HAUPTZIEL, ITEM_TYPES.ETAPPENZIEL, ITEM_TYPES.MASSNAHME]),
        2: new Set([ITEM_TYPES.EPIC, ITEM_TYPES.FEATURE, ITEM_TYPES.USER_STORY, ITEM_TYPES.TASK]),
        3: new Set([ITEM_TYPES.SZENARIO, ITEM_TYPES.INITIATIVE, ITEM_TYPES.STRATEGISCHES_ZIEL, ITEM_TYPES.AKTION]),
        4: new Set([ITEM_TYPES.ORDNER, ITEM_TYPES.SIGNAL]),
        5: new Set([ITEM_TYPES.ORGANISATION])
    }
    let map = new Map()
    for (let _t of lstyp) {
        for (const kk in grp) {
            let set = grp[kk]
            if (set.has(_t)) {
                pushTyp(kk, _t, map)
                break;
            }
        }
    }
    console.log(map, lstyp)
    return [...map.values()]
    function pushTyp(key, typ, map) {
        if (map.has(key)) { map.get(key).types.push(typ) }
        else { map.set(key, { id: key, types: [typ] }) }
    }
})

function newItem(type) {
    let paId = 0 < props.pid ? props.pid : null
    let nItem = store.addItem(paId, type, props.rgnids)
    for (let x of new Set(store.itemPanels)) {
        if (!x.title) { store.removeItem(x.id) }
    }
    store.itemPanels = [nItem]
    planStore.bindPopMenu('', '')
}
onMounted(() => { 
    
 });
</script>
<style scoped>
.container {
    background-color: #fff;
    width: 280px;
    position: absolute;
    top: 30px;
    left: 0;
    z-index: 2;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e0e0e0;
    overflow: hidden;
}

.m-section {
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
}

.m-section:last-child {
    border-bottom: none;
}

.sec-tlt {
    font-size: 14px;
    font-weight: 600;
    color: #000;
    margin: 0;
}

.menu-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s;
    color: #1a1a1a;
    font-size: 12px;
    text-decoration: none;
}

.sec-tlt,
.menu-item {
    padding: 8px 8px 8px 26px;
}

.menu-item:hover {
    background-color: #f8f9fa;
}

.icon {
    width: 18px;
    height: 18px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
}
</style>