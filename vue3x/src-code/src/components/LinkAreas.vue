<template>
  <div class="p-wrp">
    <div class="p-cnn">

      <div class="p-header">
        <div class="head-tlt-bx">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
            stroke="currentColor" class="ic-svg">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span class="h-text">Verknüpfte Bereiche</span>
        </div>
        <button @click="addArea" class="sqb-add">+</button>
      </div>

      <div class="a-list">
        <div v-for="area in lsArea" :key="area.rgnids.join('.')" class="a-item">
          <div @click.stop="toggleOpen(area.name)" class="a-header">
            <span class="c-i">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="c-svg">
                <path stroke-linecap="round" stroke-linejoin="round"
                  :d="sCollaps.has(area.name) ? 'M19.5 8.25l-7.5 7.5-7.5-7.5' : 'M4.5 15.75l7.5-7.5 7.5 7.5'" />
              </svg>
            </span>
            <h2 class="a-tlt">{{ area.name }}</h2>
          </div>
          <div v-if="!sCollaps.has(area.name)" class="a-cnt">
            <LinkRow v-for="xx in area.lsitem" :key="xx.id" :item="xx" :llvl="gappStore.getLvl(parent.id)" />
          </div>
          <div v-if="area.rgnids.length" style="position: relative;">
            <button @click.stop="toggleMnChild(area.rgnids)" class="act-btn">
              <span class="btn-plus">+</span> Etappenziel hinzufügen
            </button>
            <MenuNewItem v-if="`mnnew.${parent.id}_${area.rgnids.join('.')}` == gappStore.popMenu"
              :types="cTypes" :pid="parent.id" :rgnids="aRegions" style="top:32px;"/>
          </div>
        </div>
      </div>
    </div>
    <div style="position: relative;">
      <button @click.stop="toggleMnChild([])" class="act-btn">
          <span class="btn-plus">+</span> Etappenziel hinzufügen
        </button>
        <MenuNewItem v-if="`mnnew.${parent.id}_` == gappStore.popMenu" 
          :types="cTypes" :pid="parent.id" :rgnids="aRegions" style="top:32px;"/>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { ITEM_TYPES, LOCAL_STORE_KEY } from '../constants'
import { icType, styleSvgColor } from '../utils/utility'
import { useThemenStore } from '../stores/themen'
import { useGappStore } from '../stores/gapp'
import { useAccStore } from '../stores/account'
import { emptyItem } from '../mockdata/themen'
import LinkRow from './LinkRow.vue'
import MenuNewItem from './MenuNewItem.vue'

const props = defineProps({
  parent: { type: Object, required: true },
})
const store = useThemenStore()
const accStore = useAccStore()
const gappStore = useGappStore()

const cTypes = ref([])
const aRegions = ref([])
const sCollaps = ref(new Set())

const lsArea = ref(getAreas(props.parent))

function getAreas(parent) {
  let lsLv1 = store.getChildChain(parent.id, 1)
  lsLv1.sort((a, b) => b.regions.length - a.regions.length)
  let rIds = new Set(lsLv1.map(a => a.regions).flat())
  let regions = accStore.regions.filter(r => rIds.has(r.id))
  let ls = []
  for (let c1 of lsLv1) {
    let rgnids = [...c1.regions]
    rgnids.sort()
    let set = new Set(rgnids)
    let rgns = regions.filter(r => set.has(r.id))
    let lsitem = store.getChildChain(c1.id, 0)
    lsitem.unshift(c1)
    ls.push({
      name: rgns.map(r => r.title).join(', '),
      rgnids,
      lsitem,
    })
  }
  for (let ii = ls.length - 1; 0 < ii; ii--) {
    let c1 = ls[ii]
    let c0 = ls[ii - 1]
    if (c1.name == c0.name) {
      c0.lsitem.push(...c1.lsitem)
      ls.splice(ii, 1)
    }
  }
  return ls
}
function toggleMnChild(rgnids) {
  const oPpo = gappStore.popMenu
  const parent = props.parent
  const mnnew = `mnnew.${parent.id}_${rgnids.join('.')}`
  let _ls = []
  if (oPpo && oPpo == mnnew) {
    cTypes.value = _ls
    aRegions.value = _ls
    gappStore.popMenu = ''
    return
  }
  aRegions.value = rgnids
  const paType = parent.type
  if (ITEM_TYPES.ORGANISATION <= paType) { _ls.push(ITEM_TYPES.ORDNER) }
  else {
    _ls = Object.values(ITEM_TYPES)
    _ls = _ls.filter(x => x < ITEM_TYPES.ORGANISATION && x != paType)
    if (paType == ITEM_TYPES.ORDNER) { _ls.push(ITEM_TYPES.ORDNER) }
    _ls.sort((a, b) => a - b)
  }
  cTypes.value = _ls
  if(_ls.length) {
    gappStore.popMenu = mnnew
  }
}
const addArea = () => {
  const name = prompt('Tên Bereich mới:')
  if (name) {
    let nwRgn = accStore.addRegion(name)
    lsArea.value.push({
      name: nwRgn.title,
      rgnids: [nwRgn.id],
      lsitem: []
    })
  }
}
function toggleOpen(name) {
  let set = sCollaps.value
  if (set.has(name)) {
    set.delete(name)
  } else {
    set.add(name)
  }
}
</script>
<style scoped>
.p-wrp {
  display: flex; flex-direction: column;
  /* align-items: center; */
  justify-content: center; box-sizing: border-box;
}

.p-cnn {
  width: 100%;
  padding: 24px 0;
}

/* Tiêu đề chính */
.p-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.head-tlt-bx {
  display: flex;
  align-items: center;
  color: #334155;
}

.ic-svg {
  width: 18px;
  height: 18px;
}

.h-text {
  font-weight: 500;
  margin-left: 8px;
  color: #000000;
}

/* Nút cộng vuông nhỏ cạnh tiêu đề */
.sqb-add {
  width: 24px;
  height: 24px;
  display: flex;
  font-size: 18px;
  align-items: center;
  justify-content: center;
  background-color: rgba(226, 232, 240, 0.7);
  border: none;
  color: #334155;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sqb-add:hover {
  background-color: #e2e8f0;
}

.a-list {
  display: flex;
  flex-direction: column;
}

.a-item {
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  padding-bottom: 8px;
  margin-bottom: 6px;
}

.a-item:last-child {
  border: none;
  margin-bottom: 0;
}

.a-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
}

.c-i {
  color: #64748b;
  display: flex;
  align-items: center;
}

.c-svg {
  width: 12px;
  height: 12px;
}

.a-tlt {
  font-size: 13px;
  font-weight: 400;
  margin: 0;
  color: #000000;
}

.a-cnt {
  padding-left: 12px;
}

.act-btn {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; border: none; cursor: pointer;
  background-color: #e8f1f5; color: #1e293b;
  transition: background-color 0.2s;
  padding: 6px 12px; border-radius: 8px; margin-top: 8px;
}

.act-btn:hover {
  background-color: #deeaef;
}

.btn-plus {
  line-height: 1;
  font-size: 18px;
}
</style>