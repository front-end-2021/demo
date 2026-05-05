<template>
    <div class="page">
        <!-- ── Header ── -->
        <div class="page-header">
            <h1 class="page-title">OKR</h1>
            <button v-if="510 < width" class="collapse-btn" @click="width = 510"><svg viewBox="0 0 16 16" fill="none">
                    <path d="M4 10l4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>Einklappen</button>
            <button v-else class="expand-btn" @click.stop="width = 780"><svg viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>Details anzeigen
            </button>
            <div class="total-badge">
                Total: ↑{{ totalProgress }}%
            </div>
        </div>

        <TransitionGroup name="list" tag="div" class="kr-list">
            <KRCard v-for="(kr, idx) in activeKResults" :key="kr.id" :kr="kr" :width="width" />
        </TransitionGroup>

        <button class="add-kr-btn" @click="store.addKResult()">
            <svg viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
            Key Result hinzufügen
        </button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import KRMini from './KRMini.vue'
import KrRow from './KrRow.vue'
import KRCard from './KRCard.vue'
import { useKRStore } from '../stores/okr.js'

const props = defineProps({
    kr: { type: Object, required: true },
})

const collapse = ref(false)
const store = useKRStore()

const width = ref(510)
const totalProgress = computed(() => {
    const kr = props.kr
    const ids = kr.idKResults
    const pcts = ids.map((id) => parseFloat(store.getKI(kr)) || 0)
    if (!pcts.length) return 0
    return (pcts.reduce((a, b) => a + b, 0) / pcts.length).toFixed(0)
})
const activeKResults = computed(() => props.kr.idKResults.map(id => ({id, ...store.kResults[id]})))

</script>

<style scoped>
.page {
    max-width: 780px;
    display: flex;
    flex-direction: column;
    gap: 12px;height: 100%;
    overflow-y: auto;
    padding-bottom: 20px;
}

.page-header {
    display: flex; padding: 16px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px; position: sticky;
    top: 0; z-index: 1;
    background: var(--surface);
}

.page-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
}

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
.add-kr-btn {
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

.add-kr-btn:hover {
    color: var(--accent);
    border-color: var(--accent);
    background: #f0f3ff;
}

.add-kr-btn svg {
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
