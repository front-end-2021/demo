<script setup>
import { getLsTaskType, getLsNode } from './repository.js';
import { buildTree } from './common.js';
import { ref, provide, computed } from 'vue';
import SnowflakeId from 'snowflake-id';
import Row from './Row.vue';
import FormRow from './FormRow.vue';
import NavHead from './NavHead.vue';
const SnfId = new SnowflakeId({ mid: 42, offset: (2020 - 1970) * 31536000 * 1000 });

const nodeItem = ref(null)
provide('$nodeItem', nodeItem);

const TaskTypes = ref([{ Id: 0, Name: '' }]);
provide('$taskTypes', TaskTypes);

const NodeTree = ref(new Map());
provide('$nodeTree', NodeTree); // map[Id, {Id, Name, TypeId, ...}]

Promise.all([getLsTaskType(SnfId), getLsNode(SnfId)]).then(([tTypes, nodes]) => {
    TaskTypes.value = tTypes;
    NodeTree.value = buildTree(nodes);
});
const ViewNodes = computed(() => {
    let map = new Map()
    const oMap = NodeTree.value;
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
    let map = NodeTree.value
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
    NodeTree.value = new Map(map);
    return node.Id;
}
</script>
<template>
    <NavHead />
    <div class="flex flex-col items-center justify-center bg-gray-100 gap-[2px] p-1.5 mt-12">
        <Row v-for="[id, node] in ViewNodes" :key="node.Id" :item="node" />
    </div>
    <div class="flex flex-col items-center justify-center bg-gray-100 gap-8">

        <FormRow :addNode="addNode"></FormRow>

        <div class="p-8 rounded-xl shadow bg-white">
            <h1 class="text-2xl font-bold text-gray-800">Hello Tailwind + Vue 3 + Webpack!</h1>
            <p class="mt-2 text-gray-600">Chạy được là mừng rồi 😄</p>
        </div>

        <div class="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
            <div class="md:flex">
                <div class="md:shrink-0">
                    <img class="h-48 w-full object-cover md:h-full md:w-48"
                        src="https://img.freepik.com/free-photo/giant-office-buildings_1137-299.jpg"
                        alt="Modern building architecture" />
                </div>
                <div class="p-8">
                    <div class="text-sm font-semibold tracking-wide text-indigo-500 uppercase">Company retreats</div>
                    <a href="#" class="mt-1 block text-lg leading-tight font-medium text-black hover:underline">
                        Incredible accommodation for your team
                    </a>
                    <p class="mt-2 text-gray-500">
                        Looking to take your team away on a retreat to enjoy awesome food and take in some sunshine? We
                        have a list
                        of
                        places to do just that.
                    </p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-3 gap-3 w-96 text-center text-white">
            <div class="bg-sky-500/100 rounded-lg h-18 content-center">01</div>
            <div class="bg-sky-500/100 rounded-lg h-18 content-center">02</div>
            <div class="bg-sky-500/100 rounded-lg h-18 content-center">03</div>
            <div class="col-span-2 bg-sky-500/100 rounded-lg h-18 content-center">04</div>
            <div class="bg-sky-500/100 rounded-lg h-18 content-center">05</div>
            <div class="bg-sky-500/100 rounded-lg h-18 content-center">06</div>
            <div class="col-span-2 bg-sky-500/100 rounded-lg h-18 content-center">07</div>
        </div>
    </div>
</template>