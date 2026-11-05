<template>
    <ul class="b" v-if="0 < search.fLogs.length">
        <li v-for="(log, ii) in search.fLogs" class="a" :key="ii">
            <button class="btn-secondary small c" :class="[indexLog == ii ? 'active' : '']"
                @click="selectLog(log, ii)">{{ log }}</button>
            <button class="btn-secondary small" @click="removeLog(ii, log)">✕</button>
        </li>
    </ul>
    <div v-else class="d">
        Danh sách lịch sử tìm kiếm đang trống...
    </div>
</template>
<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref } from 'vue'
import { useSearchStore } from '../stores/search'
import { useLayoutStore } from '../stores/layout'
const search = useSearchStore()
const layout = useLayoutStore()

const cacheWdthLayout = layout.editorWidth
const cacheWdthExplorer = layout.explorerWidth
const indexLog = ref(-1)

function selectLog(log, ii) {
    indexLog.value = ii
    search.selectFilterLog(log)
}
function removeLog(ii, log) {
    if (indexLog.value == ii) { indexLog.value = -1 }
    search.clearFilterLogs(1, ii)
}
onBeforeMount(() => {
    let ii = search.fLogs.indexOf(search.query)
    if (-1 < ii) { indexLog.value = ii }
})
onMounted(() => {
    layout.setExplorerWidth(360)
    layout.setEditorWidth(1230)
})
onBeforeUnmount(() => {
    search.clearFilterLogs(2)
    layout.setExplorerWidth(cacheWdthExplorer)
    layout.setEditorWidth(cacheWdthLayout)
})
</script>
<style scoped>
.b {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding-right: 6px;
    padding-left: 18px;
    width: fit-content;
}
.a {
    display: flex;
    gap: 3px;
    background-color: white;
    border-radius: 6px;
}
.c { min-width: 72px; text-align:left; }

.a>* {background-color: transparent;}

.a>*:first-child {
    flex-grow: 1;
    text-align: left;
}
.d {padding: 24px;color: #64748b;}
</style>