<template>
    <div class="w-full relative" ref="_el">
        <div
            class="flex items-center rounded-md bg-white px-3 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
            <input type="text" name="drpinput" :placeholder="props.placeholder" v-model="name"
                @click.stop="buildAvailSrc" @blur="blurINput" readonly
                class="block bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 w-full" />
        </div>
        <div v-if="availSrc.length > 0" style="scrollbar-width: thin;" wrap="ls-src"
            class="absolute mt-1 max-h-60 w-100 overflow-auto rounded-md bg-white p-1 text-base shadow-lg focus:outline-none sm:text-sm">
            <div v-for="(item, ii) in availSrc" :key="item.Id" @click.stop="e => selectIndex(ii)"
                class="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-500 hover:text-white rounded-md">
                {{ item.Name }}
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps, ref, watch, nextTick } from 'vue';
const _el = ref()
let timeoutId = null
const props = defineProps({
    src: Array,
    value: Object,
    placeholder: String,
    setValue: Function
});
const name = ref(!!props.value ? props.value.Name : '');
watch(() => props.value, (newVal) => {
    name.value = !!newVal ? newVal.Name : '';
});
const availSrc = ref([]);
async function buildAvailSrc(e) {
    if (!name.value) {
        availSrc.value = props.src;
    } else {
        availSrc.value = props.src.filter(x => x.Name != name.value);
    }
    await nextTick()
    const el = _el.value.querySelector('div[wrap="ls-src"]');
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
    let value = availSrc.value[ii];
    name.value = value.Name;
    availSrc.value = []
    if (typeof timeoutId == 'number') {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    props.setValue(value)
}
function blurINput() {
    timeoutId = setTimeout(() => {
        availSrc.value = []
        timeoutId = null;
    }, 1024)
}
</script>