<template>
    <div class="m-r">
        <div class="m-l" :style="{ paddingLeft: `${(gappStore.getLvl(item.id) - llvl) * 10}px` }">
            <span class="item-dot" v-html="icType[item.type]" :ref="el => dIcon = el"></span>
            <span class="m-t">{{ item.title }}</span>
            <span v-if="item.tags.includes(TAG_TYPES.OKR)" class="inline-tag okr">OKR</span>
        </div>
        <div class="col-date" v-if="props.item.type < ITEM_TYPES.ORDNER">
            <DateRange :start="item.dateStart" :end="item.dateEnd" />
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, watch, inject } from 'vue'
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
const genAreas = inject('genAreas')

let dIcon = ref(null)

watch(() => props.item.color, (c) => { styleSvgColor(dIcon, c) }, { deep: true })
watch(() => props.item.regions, (ids) => { genAreas() }, { deep: true })

onMounted(() => { styleSvgColor(dIcon, props.item.color) })

</script>
<style scoped>
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