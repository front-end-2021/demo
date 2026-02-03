<script setup>
import Row from './Row.vue';
import FormRow from './FormRow.vue';
import { store } from './store.js'
import { defineProps, ref, inject, computed, watch, onBeforeMount } from 'vue';
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
function buildMap(oMap) {
    let map = new Map()
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
}
const ViewGroups = computed(() => {
    let regionIds = new Set()
    for (let [id, node] of store.NodeTree) { regionIds.add(node.RegionId) }
    let regions = store.filter((r) => regionIds.has(r.Id))
    let landIds = new Set(regions.map(r => r.LandId))
    let lands = store.filter((l) => landIds.has(l.Id), 'land')

    let res = []
    for (let land of lands) {
        let objL = { Land: land }
        let lsR = regions.filter(r => r.LandId == land.Id).map(r => {
            let objR = { Region: r }
            let nodes = store.filter((p) => p.RegionId == r.Id, 'node')
            let prdIds = new Set(nodes.filter(n => 0 < n.ProductId).map(n => n.ProductId))
            let smkIds = new Set(nodes.filter(n => 0 < n.SubmarketId).map(n => n.SubmarketId))
            //let spIds = new Set(nodes.filter(n => !!n.SubmarketProductId).map(n => n.SubmarketProductId))
            let dItems = nodes.filter(n => n.ProductId < 1 && n.SubmarketId < 1)
            let oMap = new Map(dItems.map(n => [n.Id, n]))
            oMap = buildMap(oMap)
            objR.Items = oMap
            nodes = nodes.filter(n => 0 < n.ProductId || 0 < n.SubmarketId)
            let lsSmk = store.filter((s) => smkIds.has(s.Id), 'submarket').map(s => {
                let objS = { Submarket: s }
                objS.Products = store.filter((p) => prdIds.has(p.Id), 'product').map(p => {
                    let objP = { Product: p }
                    dItems = nodes.filter(n => n.ProductId == p.Id && n.SubmarketId < 1)
                    oMap = new Map(dItems.map(n => [n.Id, n]))
                    objP.PItems = buildMap(oMap)
                    dItems = nodes.filter(n => `${s.Id}-${p.Id}` == n.SubmarketProductId)
                    oMap = new Map(dItems.map(n => [n.Id, n]))
                    objP.SPItems = buildMap(oMap)
                    return objP;
                })
                dItems = nodes.filter(n => n.SubmarketId == s.Id && n.ProductId < 1)
                oMap = new Map(dItems.map(n => [n.Id, n]))
                objS.Items = buildMap(oMap)
                return objS;
            })
            for (let kk = lsSmk.length - 1, smk; -1 < kk; kk--) {
                smk = lsSmk[kk];
                if (smk.Items.size + smk.Products.length < 1) { lsSmk.splice(kk, 1) }
            }
            objR.Submarkets = lsSmk;
            return objR
        })
        objL.Regions = lsR
        res.push(objL)
    }
    return res
})
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
    <div class="p-1.5 mt-12">
        <div v-for="objL in ViewGroups" class="bg-gray-100" :key="objL.Land.Id">
            <div class="px-1 pt-3" v-for="objR in objL.Regions" :key="objR.Region.Id">
                <div class="px-1" v-for="objS in objR.Submarkets" :key="objS.Submarket.Id">
                    <div class="flex items-center h-[32px] pt-2">
                        <span class="font-semibold">{{ objL.Land.Name }}</span>
                    </div>
                    <div class="px-1" v-for="objP in objS.Products" :key="objP.Product.Id">
                        <div v-if="0 < objP.SPItems.size" class="flex items-center h-[32px]">
                            <span>{{ objS.Submarket.Name }}</span> - <span>{{ objP.Product.Name }}</span>
                        </div>
                        <div v-if="0 < objP.SPItems.size"
                            class="flex flex-col items-center justify-center gap-[2px] p-1.5">
                            <Row v-for="[id, node] in objP.SPItems" :key="node.Id" :item="node" />
                        </div>
                        <div v-if="0 < objP.PItems.size" class="flex items-center h-[32px]">{{ objP.Product.Name }}</div>
                        <div v-if="0 < objP.PItems.size"
                            class="flex flex-col items-center justify-center gap-[2px] p-1.5">
                            <Row v-for="[id, node] in objP.PItems" :key="node.Id" :item="node" />
                        </div>
                    </div>
                    <div v-if="0 < objS.Items.size" class="flex items-center h-[32px]">{{ objS.Submarket.Name }}</div>
                    <div v-if="0 < objS.Items.size" class="flex flex-col items-center justify-center gap-[2px] p-1.5">
                        <Row v-for="[id, node] in objS.Items" :key="node.Id" :item="node" />
                    </div>
                </div>
                <div v-if="0 < objR.Items.size">
                    <div class="flex items-center h-[32px] pt-2">
                        <span class="font-semibold">{{ objL.Land.Name }}</span>&nbsp;/&nbsp;
                        <span class="font-medium">{{ objR.Region.Name }}</span>
                    </div>
                    <div class="flex flex-col items-center justify-center gap-[2px] p-1.5">
                        <Row v-for="[id, node] in objR.Items" :key="node.Id" :item="node" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="flex flex-col items-center justify-center bg-gray-100 gap-[2px] p-1.5 mt-12">
        <Row v-for="[id, node] in ViewNodes" :key="node.Id" :item="node" />
    </div> -->
    <div class="fixed bottom-0 right-0">
        <div v-if="editNodes.length < 1" class="m-6 cursor-default">
            <div @click.stop="openFormAddRow"
                class="add-row rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                + Row</div>
        </div>
        <FormRow v-for="entry in editNodes" :key="entry.Id" :id="entry.Id" :addNode="addNode"></FormRow>

    </div>
</template>