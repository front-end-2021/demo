<script setup>
import { store } from './store.js'
import { getLsTaskType, getUsers, listLandToNode } from './repository.js';
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
Promise.all([getLsTaskType(SnfId), getUsers(SnfId)]).then(([tTypes, users]) => {
    let user = users[0];
    TaskTypes.value = tTypes;
    store.setUsers(users)
    Promise.all([listLandToNode(SnfId)]).then(([r]) => {
        store.setLands(r.lands)
        store.setRegions(r.regions)
        store.setMarkets(r.markets)
        store.setProductGroups(r.prdGroups)
        store.setProducts(r.products)
        store.setSubmarkets(r.submarkets)
        r.nodes[0].UserIds = new Set([user.Id]);
        store.setNodes(r.nodes)
        store.loggedIn({
            Id: user.Id,
            Name: user.Name,
            RegionId: r.regions[0].Id,
        })
    })
})
</script>
<template>
    <NavHead />
    <component v-if="null != Pagger" :is="Pagger.comp"></component>
</template>