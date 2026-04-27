<template>
    <div class="palette-container">
        <div v-for="color in planStore.popMenu.colors" 
            class="color-box" :style="{
                backgroundColor: color,
                borderColor: color == item.color ? '#bbb' : color
            }"
            @click.stop="selectColor(color)"></div>
    </div>
</template>
<script setup>
import { usePlanStore } from '../stores/plan.js'
const props = defineProps({
    item: { type: Object, required: true },
})

const planStore = usePlanStore()
function selectColor(color) {
    props.item.color = color
    planStore.bindPopMenu('', '')
}   
</script>
<style scoped>
.palette-container {
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