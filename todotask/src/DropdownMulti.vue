<script setup>
import { defineProps, ref, watch, nextTick } from 'vue';
const _el = ref()
let timeoutId = null
const props = defineProps({
    src: Array,
    values: Array,
    placeholder: String,
    setValue: Function
});
const name = ref(props.values.map(x => x.Name).join(', '));
watch(() => props.values, (newVals) => {
    name.value = newVals.map(x => x.Name).join(', ');
});
const availSrc = ref([]);
async function buildAvailSrc(e) {
    availSrc.value = props.src
    let el = _el.value.querySelector('div[wrap="ls-src"]');
    if (el) {
        el.style.top = ''
        el.style.bottom = ''
    }
    await nextTick()
    el = _el.value.querySelector('div[wrap="ls-src"]');
    if (el) {
        let bound = el.getBoundingClientRect()
        if (window.innerHeight < bound.bottom) {
            el.style.top = 'initial'
            el.style.bottom = '42px'
        } else {
            el.style.top = ''
            el.style.bottom = ''
        }
    }
}
function selectIndex(ii) {
    props.setValue(availSrc.value[ii])
    if (typeof timeoutId == 'number') {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    const el = _el.value.querySelector('input[name="drpinput"]');
    if (el) el.focus()
}
function blurINput() {
    timeoutId = setTimeout(() => {
        availSrc.value = []
        timeoutId = null;
    }, 559)
}
</script>
<template>
    <div class="w-full relative" ref="_el">
        <div
            class="flex items-center rounded-md bg-white px-3 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-green-600">
            <input type="text" name="drpinput" :placeholder="props.placeholder" v-model="name"
                @click.stop="buildAvailSrc" @blur="blurINput" readonly
                class="block bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 w-full" />
        </div>
        <div v-if="availSrc.length > 0" style="scrollbar-width: thin;z-index: 1;" wrap="ls-src"
            class="absolute flex flex-col gap-0.5 mt-1 max-h-60 min-w-60 overflow-auto rounded-md bg-white p-1 text-base shadow-lg focus:outline-none sm:text-sm">
            <div v-for="(item, ii) in availSrc" :key="item.Id" @click.stop="e => selectIndex(ii)"
                class="inline-flex items-center cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-green-500 hover:text-white rounded-md"
                :class="props.values.find(x => item.Id == x.Id) ? 'bg-neutral-200' : ''">
                <span v-if="item.Icon" :class="[item.Icon]"
                    style="font-size: 11px;margin-right: 6px;display: inline-flex;"></span>
                <div>{{ item.Name }}</div>
            </div>
        </div>
    </div>
</template>