<template>
    <div class="rounded-md px-1 shadow bg-white min-w-[120px] min-h-[46px] w-full" :level="Level"
        :style="{ marginLeft: Level * 24 + 'px' }">
        <div class="grid grid-cols-4 gap-0 items-center h-[46px]">
            <div class="inline-grid gap-[6px] items-center grid-cols-[16px_auto] bi">
                <span :class="[clsType]" :style="[stylType]"></span>
                <div class="cursor-default" @click.stop="clickName">{{ item.Name }}</div>
            </div>

        </div>
    </div>
</template>
<script setup>
import { defineProps, ref, inject, computed } from 'vue';
const props = defineProps(['item']);
const $nodeItem = inject('$nodeItem');
const $taskTypes = inject('$taskTypes');

const Level = computed(() => {
    let level = 0;
    let pa = props.item.parent;
    while (pa) {
        level++;
        pa = pa.parent;
    }
    return level;
});
const clsType = computed(() => {
    return $taskTypes.value.find(x => x.Id == props.item.TypeId)?.Icon || ''
});
const stylType = computed(() => {
    switch (props.item.TypeId) {
        case 1: return { fontSize: '14px' }
        case 2:
        case 3: return { fontSize: '10px', marginLeft: '3px' }
        case 6:
        case 13: return { fontSize: '13px', marginLeft: '2px' }
        case 10:
        case 11: return { fontSize: '20px', marginLeft: '-2px' }
        case 12: return { fontSize: '13px', marginLeft: '2px' }
        default: return { fontSize: '12px', marginLeft: '2px' }
    }
});

function clickName(e) {
    if (!$nodeItem.value) {
        $nodeItem.value = props.item
    } else {
        $nodeItem.value = null;
    }
}
</script>