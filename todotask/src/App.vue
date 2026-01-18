<script setup>
import { store } from './store.js'
import { getLsTaskType, getLsNode, getRegions, getUsers } from './repository.js';
import { ref, provide, computed } from 'vue';
import SnowflakeId from 'snowflake-id';
import NavHead from './NavHead.vue';
const SnfId = new SnowflakeId({ mid: 42, offset: (2020 - 1970) * 31536000 * 1000 });
provide('$SnfId', SnfId);

const Pagger = ref(null)
provide('$Pagger', Pagger);

const Project = ref(null)
provide('$Project', Project);

const editNodes = ref([])
provide('$editNodes', editNodes);

const TaskTypes = ref([{ Id: 0, Name: '' }]);
provide('$taskTypes', TaskTypes);

Promise.all([getLsTaskType(SnfId), getLsNode(SnfId), getRegions(SnfId), getUsers(SnfId)])
    .then(([tTypes, nodes, regions, users]) => {
        let user = users[0];
        TaskTypes.value = tTypes;

        nodes[0].RegionIds = new Set([regions[0].Id, regions[1].Id]);
        nodes[0].UserIds = new Set([user.Id]);

        store.setRegions(regions)
        store.setUsers(users)
        store.loggedIn({
            Id: user.Id,
            Name: user.Name,
            RegionId: regions[0].Id,
        })
        store.setNodes(nodes)
        
    });
</script>
<template>
    <NavHead />
    <component v-if="null != Pagger" :is="Pagger.comp"></component>
</template>