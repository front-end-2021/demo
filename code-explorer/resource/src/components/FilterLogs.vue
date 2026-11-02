<template>
    <ul class="b">
        <li v-for="(log, ii) in search.fLogs" class="a" :key="ii">
            <button class="btn-secondary small c" @click="search.selectFilterLog(log)">{{ log }}</button>
            <button class="btn-secondary small" @click="search.clearFilterLogs(1, ii)">✕</button>
        </li>
    </ul>

</template>
<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useSearchStore } from '../stores/search'
import { useLayoutStore } from '../stores/layout'
const search = useSearchStore()
const layout = useLayoutStore()

const cacheWdthLayout = layout.editorWidth
const cacheWdthExplorer = layout.explorerWidth

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
    padding-left: 24px;
}

.a {
    display: inline-flex;
    gap: 3px;
    background-color: white;
    width: fit-content;
    border-radius: 6px;
}

.c {
    min-width: 72px;
}

.a>* {
    background-color: transparent;
}
</style>