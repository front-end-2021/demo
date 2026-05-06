<template>
    <div class="container" :style="{ width: width + 'px'}">
        <div class="header">
            <div class="left">
                <h1 class="title">OKR</h1>
                <button v-if="510 < width" class="collapse-btn" @click="width = 510" v-html="icArr + 'Einklappen'"></button>
                <button v-else class="expand-btn" @click.stop="width = 780" v-html="icArl + 'Details anzeigen'"></button>
            </div>
            <div class="total-badge">
                Total: ↑{{ totalProgress }}%
            </div>
        </div>

        <TransitionGroup name="list" tag="div" class="kr-list">
            <KRCard v-for="(kr, idx) in activeKResults" :key="kr.id" :kr="kr" :width="width" />
        </TransitionGroup>

        <button class="adkr" @click="store.addKResult()">
            <svg viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
            Key Result hinzufügen
        </button>
    </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import KRCard from './KRCard.vue'
import { useKRStore } from '../stores/okr.js'
import { icArl, icArr, icAdd } from '../utils/utility.js'

const props = defineProps({
    kr: { type: Object, required: true },
})

const store = useKRStore()

const width = ref(510)
const mKI = computed(() => new Map(props.kr.idKResults.map(id => [id, store.getKI(id)])))
provide('mpki', mKI)
const totalProgress = computed(() => {
    const ids = props.kr.idKResults
    const pcts = ids.map(id => parseFloat(mKI.value.get(id)) || 0)
    if (!pcts.length) return 0
    return (pcts.reduce((a, b) => a + b, 0) / pcts.length).toFixed(0)
})
const activeKResults = computed(() => props.kr.idKResults.map(id => store.kResults[id]))

</script>
<style scoped>
.container {
    display: flex;background: var(--surface);
    flex-direction: column;
    gap: 12px;height: 100%;
    overflow-y: auto; animation: slideRl 0.51s ease;
    padding-bottom: 20px; transform-origin: left;
    transition: width 0.3s ease;
}
@keyframes slideRl {
    0% { transform: translateX(var(--panel-w)); opacity: 0;}
    100% { transform: translateX(0); opacity: 1;}
}
.header {
    display: flex; padding: 16px;
    align-items: center;gap: 12px;
    justify-content: space-between;
    margin-bottom: 4px; position: sticky;
    top: 0; z-index: 1;
    background: var(--surface);
}
.title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
}
.left {display: inline-flex; align-items: center; gap: 12px;}
.left .collapse-btn { padding-left: 0;}
.total-badge {
    font-size: 13px;
    font-weight: 600;
    color: #2e7d32;
    background: #e8f5e9;
    border: 1px solid #c8e6c9;
    padding: 4px 12px;
    border-radius: 20px;
    letter-spacing: 0.01em;
}

.kr-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Add button */
.adkr {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: 1.5px dashed var(--border);
    border-radius: 14px;
    padding: 12px 18px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    font-family: inherit;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
    margin: 0 16px;
}

.adkr:hover {
    color: var(--accent);
    border-color: var(--accent);
    background: #f0f3ff;
}

.adkr svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
}

/* TransitionGroup for list */
.list-enter-active,
.list-leave-active {
    transition: opacity 0.25s, transform 0.25s;
}

.list-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.list-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

.list-move {
    transition: transform 0.3s;
}

.card-enter-active,
.card-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.card-enter-from {
    opacity: 0;
    transform: translateY(6px);
}

.card-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>