<template>
    <div class="f-value">
        <div class="t-list">
            <span v-for="r in values" :key="r" class="r-tag">{{ r }}
                <button @click="removeText(r)" class="tag-rm">×</button>
            </span>
            <input class="tag-input" :placeholder="placeholder" 
                @focus="openList" @blur="closeList" @input="onFilter"
                v-model="newText" @keyup.enter="addText" />
        </div>
        <Transition name="dropdown">
            <div v-if="list.length" class="d-mn">
                <div v-for="txt in filerLs" :key="txt" @click.stop="select(txt)">{{ txt }}</div>
            </div>
        </Transition>
    </div>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
    items: { type: Array, required: true },
    values: { type: Array, required: true },
    placeholder: { type: String, default: "Type for search or add" }
})

const list = ref([])
const filerLs = ref([])
const newText = ref('')

const emit = defineEmits(['rm:text', 'selection', 'add:text'])

function removeText(r) { emit('rm:text', r) }
function addText() {
    let txt = newText.value.trim()
    if (!txt) return
    if (props.items.includes(txt)) {
        newText.value = ''
        if (!props.values.includes(txt)) {
            emit('selection', txt)
        }
        return
    }
    emit('add:text', txt)
    newText.value = ''
    openList()
}
function openList() {
    list.value = props.items.filter(i => !props.values.includes(i))
    filerLs.value = list.value
}
function select(txt) {
    newText.value = ''
    emit('selection', txt)
}
function closeList() {
    list.value = []
    filerLs.value = []
}
function onFilter() {
    let txt = newText.value.trim()
    if (!txt) {
        filerLs.value = list.value
        return
    }
    filerLs.value = list.value.filter(i => i.toLowerCase().includes(txt.toLowerCase()))
}
</script>
<style scoped>
.f-value { flex: 1; position: relative; }

.t-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.r-tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: var(--accent-blue-light);
  color: var(--accent-blue);
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
}

.tag-rm {
  font-size: 13px;
  line-height: 1;
  color: var(--accent-blue);
  opacity: 0.6;
}

.tag-rm:hover { opacity: 1 }
.tag-input{
  border: none;
  outline: none;
  font-size: 12px;
  color: var(--text-secondary);
  background: transparent;
  width: 100%;
}

.tag-input::placeholder { color: var(--text-muted); }
.tag-input:focus { color: var(--text-primary); }
.d-mn {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 100;
  min-width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  overflow: hidden;
}
.d-mn>*{padding: 6px;}
.d-mn>*:hover { background: var(--bg-hover); cursor: pointer; }
/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>