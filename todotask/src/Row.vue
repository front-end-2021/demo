<script setup>
import { defineProps, ref, inject, computed } from 'vue';
import { store } from './store.js'
const props = defineProps(['item']);
const $editNodes = inject('$editNodes');
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
const clsType = computed(() => { return $taskTypes.value.find(x => x.Id == props.item.TypeId)?.Icon || '' });
const stylType = computed(() => {
    switch (props.item.TypeId) {
        case 1: return { fontSize: '16px' }
        case 2:
        case 3: return { fontSize: '11px' }
        case 4: return { fontSize: '13px' }
        default: return { fontSize: '12px' }
    }
});
const availRegions = computed(() => { return store.Regions.filter(r => props.item.RegionIds.has(r.Id)) });
const availUsers = computed(() => { return store.Users.filter(u => props.item.UserIds.has(u.Id)) });

function clickName(e) {
    const edits = $editNodes.value
    if (edits.find(x => x.Id == props.item.Id)) {
        $editNodes.value = []
        return;
    }
    $editNodes.value = [{ Id: props.item.Id }]
}
</script>
<template>
    <div class="rounded-md px-1 shadow bg-white min-w-[120px] min-h-[46px] w-full" :level="Level">
        <div class="grid grid-cols-4 gap-0 items-center h-[46px]">
            <div class="inline-flex gap-[6px] items-center" :style="{ paddingLeft: Level * 6 + 'px' }">
                <span class="w-[16px]" style="display: inline-flex;" :class="[clsType]" :style="[stylType]"></span>
                <div class="cursor-default min-w-12 text-lg" @click.stop="clickName">{{ item.Name }}</div>
            </div>
            <div class="inline-flex gap-1 cursor-default text-sm">
                <div v-for="r in availRegions" class="rounded-md bg-neutral-200 p-1.5">{{ r.Name }}</div>
            </div>
            <div class="inline-flex gap-1 cursor-default text-sm">
                <div v-for="r in availUsers" class="rounded-md bg-neutral-200 p-1.5">{{ r.Name }}</div>
            </div>
        </div>
    </div>
</template>