<template>
    <div class="m-r">
        <div class="m-l" :style="{ paddingLeft: `${(gappStore.getLvl(item.id) - llvl) * 10}px`}">
            <span class="item-dot" v-html="icType[item.type]" :ref="el => itemIcon = el"></span>
            <span class="m-t">{{ item.title }}</span>
            <span v-if="item.tags.includes(TAG_TYPES.OKR)" class="inline-tag okr">OKR</span>
        </div>
        <div class="col-date" v-if="props.item.type < ITEM_TYPES.ORDNER">
        <DateRange :start="item.dateStart" :end="item.dateEnd" />
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, onUpdated } from 'vue'
import { ITEM_TYPES, TAG_TYPES } from '../constants'
import { icType, styleSvgColor } from '../utils/utility'
import { useThemenStore } from '../stores/themen'
import { useGappStore } from '../stores/gapp'
import DateRange from './DateRange.vue'

const props = defineProps({ 
    item: { type: Object, required: true },
    llvl: { type: Number, default: 0 }
})
const store = useThemenStore()
const gappStore = useGappStore()

let itemIcon = ref(null)

onMounted(() => { styleSvgColor(itemIcon, props.item.color) })
onUpdated(() => { styleSvgColor(itemIcon, props.item.color) })
</script>
<style scoped>
.m-r {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f8fafc;
}
.m-r:last-of-type { border-bottom: none; }
.m-l {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow: hidden;
    flex: 1;
    padding-right: 6px;
}
.m-t {
    font-size: 12px;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>