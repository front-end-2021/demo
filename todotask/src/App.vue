<script setup>
import { getLsTaskType, getLsNode, getRegions, getUsers } from './repository.js';
import { buildTree } from './common.js';
import { ref, provide, computed } from 'vue';
import SnowflakeId from 'snowflake-id';
import Row from './Row.vue';
import FormRow from './FormRow.vue';
import NavHead from './NavHead.vue';
const SnfId = new SnowflakeId({ mid: 42, offset: (2020 - 1970) * 31536000 * 1000 });

const editNodes = ref([])
provide('$editNodes', editNodes);

const TaskTypes = ref([{ Id: 0, Name: '' }]);
provide('$taskTypes', TaskTypes);

const Regions = ref([]);
provide('$Regions', Regions);

const Users = ref([]);
provide('$Users', Users);

const Accout = ref(null)
provide('$Accout', Accout);

const NodeTree = ref(new Map());
provide('$nodeTree', NodeTree); // map[Id, {Id, Name, TypeId, ...}]

Promise.all([getLsTaskType(SnfId), getLsNode(SnfId), getRegions(SnfId), getUsers(SnfId)])
    .then(([tTypes, nodes, regions, users]) => {
        let user = users[0];
        TaskTypes.value = tTypes;

        nodes[0].RegionIds = new Set([regions[0].Id, regions[1].Id]);
        nodes[0].UserIds = new Set([user.Id]);

        NodeTree.value = buildTree(nodes);
        Regions.value = regions
        Users.value = users
        Accout.value = {
            Id: user.Id,
            Name: user.Name,
            RegionId: regions[0].Id,
        }
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
function openFormAddRow() {
    editNodes.value.push({ Id: '' })
}
</script>
<template>
    <NavHead />
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