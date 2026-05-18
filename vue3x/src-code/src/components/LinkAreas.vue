<template>
  <div class="p-wrp">
    <div class="p-cnn">
      
      <div class="p-header">
        <div class="head-tlt-bx">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="ic-svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span class="h-text">Verknüpfte Bereiche</span>
        </div>
        <button @click="addArea" class="sqb-add">+</button>
      </div>

      <div class="a-list">
        <div v-for="area in areas" :key="area.id" class="a-item">          
          <div @click="area.isOpen = !area.isOpen" class="a-header">
            <span class="c-i">
              <svg v-if="area.isOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="c-svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="c-svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
            <h2 class="a-tlt">{{ area.title }}</h2>
          </div>
          <div v-show="area.isOpen" class="a-cnt">
            <div v-for="milestone in area.lsitem" :key="milestone.id" class="m-r">
              <div class="m-l">
                <div class="diamond-icon"></div>
                <span class="m-t">{{ milestone.title }}</span>
                <span v-if="milestone.isOkr" class="okr-badge">OKR</span>
              </div>

              <div class="date-pill">
                <span>{{ milestone.dateStart }}</span>
                <span class="duration-badge">{{ milestone.duration }}</span>
                <span>{{ milestone.dateEnd }}</span>
              </div>
            </div>
          </div>
          <button @click="addMilestone(area)" class="act-btn">
            <span class="btn-plus">+</span> Etappenziel hinzufügen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ITEM_TYPES, TAG_TYPES, LOCAL_STORE_KEY } from '../constants.js'
import { useThemenStore } from '../stores/themen.js'
import { useAccStore } from '../stores/account.js'
import {emptyItem} from '../mockdata/themen.js'
const props = defineProps({
  parent: { type: Object, required: true },
})

const store = useThemenStore()
const accStore = useAccStore()

const treeChild = computed(() => { return store.getChildChain(props.parent.id) })

const lsArea = computed(() => {
  let grps = []
  let ids = treeChild.value.map(i => i.id)
  let levels = new Set(ids.map(id => store.levels[id]))
  levels = [...levels].sort((a, b) => a - b)
  let lvl1Ids = new Set(ids.filter(id => store.levels[id] == levels[0]))
  let lsLv1 = treeChild.value.filter(i => lvl1Ids.has(i.id))
  

  return lsLv1
})


// Dữ liệu mẫu khởi tạo đúng theo ảnh mẫu của bạn
const areas = ref([
  Object.assign({
    isOpen: true,
    lsitem: [
      {
        id: 1,
        title: 'Etappenziel 1: Marktforschung',
        isOkr: true,
        dateStart: '23.12.2025',
        duration: '125 Tg',
        dateEnd: '23.12.2025'
      },
      {
        id: 2,
        title: 'Etappenziel 2: Produktentwicklung und Usability...',
        isOkr: false,
        dateStart: '23.12.2025',
        duration: '125 Tg',
        dateEnd: '23.12.2025'
      }
    ]
  }, accStore.regions[0])
])

const addMilestone = (area) => {
  const title = prompt('Tên Etappenziel mới:')
  if (title) {
    let nItem = emptyItem()
    area.lsitem.push({
      id: Date.now(),
      title: title,
      isOkr: confirm('Đây có phải mục tiêu OKR không?'),
      dateStart: '23.12.2025',
      duration: '125 Tg',
      dateEnd: '23.12.2025'
    })
  }
}

const addArea = () => {
  const name = prompt('Tên Bereich mới:')
  if (name) {
    areas.value.push({
      id: Date.now(),
      title: name,
      isOpen: true,
      lsitem: []
    })
  }
}
</script>

<style scoped>
.p-wrp {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
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
  width: 24px; height: 24px;
  display: flex; font-size: 18px;
  align-items: center; justify-content: center;
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
  display: flex; flex-direction: column;
}

.a-item {
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  padding-bottom: 8px; margin-bottom: 6px;
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

.m-r {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f8fafc;
}

.m-r:last-of-type {
  border-bottom: none;
}

.m-l {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  flex: 1;
  padding-right: 16px;
}

.diamond-icon {
  width: 10px;
  height: 10px;
  background-color: #64c79b;
  transform: rotate(45deg);
  flex-shrink: 0;
  border-radius: 2px;
}

.m-t {
  font-size: 12px;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Nhãn OKR màu tím */
.okr-badge {
  background-color: #d4bbff;
  color: #6b21a8;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.date-pill {
  background-color: #8ac6ff;
  color: #1e40af;
  font-size: 10px;
  padding: 6px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.duration-badge {
  background-color: #aadbff;
  color: #1d4ed8;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.act-btn {
  display: flex; align-items: center;
  gap: 6px; font-size: 12px;
  background-color: #e8f1f5;
  border: none;
  color: #1e293b;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 8px;
}

.act-btn:hover {
  background-color: #deeaef;
}

.btn-plus {
  line-height: 1; font-size: 18px;
}

</style>