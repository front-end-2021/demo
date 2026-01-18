<script setup>
import Row from './Row.vue';
import FormRow from './FormRow.vue';
import { store } from './store.js'
import { defineProps, ref, inject, computed, watch, onBeforeMount } from 'vue';
//import { getLsTaskType, getLsNode, getRegions, getUsers } from './repository.js';
const SnfId = inject('$SnfId');
const editNodes = inject('$editNodes');

const ViewNodes = computed(() => {
    let map = new Map()
    const oMap = store.NodeTree;
    for (let [id, node] of oMap) {
        if (!node.parent) {
            map.set(id, node)
            addChilds(node)
            if (map.size == oMap.size) break;
        }
    }
    return map
    function addChilds(node) {
        for (let child of node.children) {
            if (!map.has(child.Id)) {
                map.set(child.Id, child)
                addChilds(child)
                if (map.size == oMap.size) break;
            }
        }
    }
});

function addNode(node, parentId = '') {
    let map = store.NodeTree
    node.Id = `${SnfId.generate()}`;
    node.children = new Set()
    if (map.has(parentId)) {
        let parent = map.get(parentId);
        let set = parent.children;
        set.add(node);
        parent.children = new Set(set)
        node.parent = parent;
    } else node.parent = null;
    map.set(node.Id, node);
    store.NodeTree = new Map(map);
    return node.Id;
}
function openFormAddRow() {
    editNodes.value.push({ Id: '' })
}
</script>
<template>
    <div class="flex flex-col items-center justify-center bg-gray-100 gap-[2px] p-1.5 mt-12">
        <Row v-for="[id, node] in ViewNodes" :key="node.Id" :item="node" />
    </div>
    <div class="fixed bottom-0 right-0">
        <div v-if="editNodes.length < 1" class="m-6 cursor-default">
            <div @click.stop="openFormAddRow"
                class="add-row rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                + Row</div>
        </div>
        <FormRow v-for="entry in editNodes" :key="entry.Id" :id="entry.Id" :addNode="addNode"></FormRow>

    </div>
</template>