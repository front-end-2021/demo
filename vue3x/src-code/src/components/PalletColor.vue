<template>
    <div class="wrap a-down">
        <div v-for="color in colors" 
            class="color-box" :style="{
                backgroundColor: color,
                borderColor: color == item.color ? '#bbb' : color
            }"
            @click.stop="selectColor(color)"></div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { usePlanStore } from '../stores/plan'
import { useGappStore } from '../stores/gapp'
import { COLORS } from '../constants'

const props = defineProps({
    item: { type: Object, required: true },
})

const gappStore = useGappStore()
const planStore = usePlanStore()

const colors = computed(() => {
    let setC = new Set(COLORS)
    let lsC = [...COLORS]
    const color = props.item.color
    if (!setC.has(color)) { lsC.push(color) }
    return lsC
})

function selectColor(color) {
    props.item.color = color
    gappStore.popMenu = ''
}   
</script>
<style scoped>
.wrap {
    background-color: #ffffff;
    padding: 4px;
    border-radius: 12px;
    display: grid;
    gap: 4px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    position: absolute;
    top: 22px;
    left: 0;
    z-index: 1;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.color-box {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    transition: transform 0.2s;
    cursor: pointer;
    border: 3px solid #bbb;
}

.color-box:hover {
    transform: scale(1.05);
}
</style>