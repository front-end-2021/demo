<script setup>
import { defineProps, ref, inject, computed, watch, onBeforeMount } from 'vue';
import { store } from './store.js'
import DropdownSingle from './DropdownSingle.vue';
import DropdownMulti from './DropdownMulti.vue';
import { buildAssignIds } from './common.js';

const props = defineProps(['addNode', 'id'])

const editNodes = inject('$editNodes');
const TaskTypes = inject('$taskTypes');

const availParents = computed(() => {
    const noPa = { Id: '', Name: 'No parent' }
    if (!props.id) return [noPa, ...store.NodeTree.values()];
    let ls = [noPa];
    let ignoreIds = new Set([props.id]);
    let node = store.NodeTree.get(props.id);
    if (node.parent) {
        let p = node.parent;
        while (p) {
            ignoreIds.add(p.Id);
            p = p.parent;
        }
    }
    let children = node.children
    while (0 < children.size) {
        let grandChilds = new Set();
        for (let child of children) {
            ignoreIds.add(child.Id);
            grandChilds = grandChilds.union(child.children);
        }
        children = grandChilds;
    }
    for (let [id, node] of store.NodeTree) {
        if (!ignoreIds.has(id)) ls.push(node);
    }
    return ls;
});
const parent = ref(availParents.value[0]);
const name = ref('');

const availTypes = computed(() => {
    let lsType = TaskTypes.value;
    let pa = parent.value;
    if (!pa) return lsType
    lsType = lsType.filter(x => x.Id != pa.TypeId)
    let cTypes = new Set([15])  // Thema
    switch (pa.TypeId) {
        case 1: break;
        case 2:
        case 3:
        case 4: cTypes = new Set([1])
            return lsType.filter(x => !cTypes.has(x.Id))
        case 5: // Main goal
        case 8: // Epic
        case 12: // Initiative
            cTypes = cTypes.union(new Set([6, 7, 9, 10, 11, 14, 16])) // Sub goal, Action, Task, Organisation
            return lsType.filter(x => cTypes.has(x.Id)) // Sub goal, Action
        case 6: // Sub goal
        case 9: // Feature  
        case 13: cTypes = cTypes.union(new Set([7, 10, 11, 14, 16])) // Action, Task, Organisation
            return lsType.filter(x => cTypes.has(x.Id)) // Action
        case 7:
        case 10:
        case 11:
        case 14: cTypes = cTypes.union(new Set([7, 10, 11, 14]))
            return lsType.filter(x => cTypes.has(x.Id))
        default: break;
    }
    return lsType
});
const taskType = ref(availTypes.value[0]);

const srcAssignRegions = computed(() => { return store.Regions.filter(r => r.Id != store.Accout.RegionId) });
const srcAssignUsers = computed(() => { return store.Users.filter(r => r.Id != store.Accout.Id) });

const assignedRegions = ref([]);
const assignedUsers = ref([]);

onBeforeMount(() => {
    if (props.id) {
        let node = store.NodeTree.get(props.id)
        taskType.value = availTypes.value.find(x => x.Id == node.TypeId)
        name.value = node.Name
        parent.value = node.parent
        assignedRegions.value = srcAssignRegions.value.filter(r => node.RegionIds.has(r.Id))
        assignedUsers.value = srcAssignUsers.value.filter(r => node.UserIds.has(r.Id))
    }
})
watch(availTypes, (newVal) => {
    if (!newVal.find(x => x.Id == taskType.value.Id)) {
        taskType.value = newVal[0];
    }
})

function saveForm(e) {
    e.preventDefault();
    let newName = name.value.trim();
    if (!newName) return;
    let node, valPa = parent.value
    let assignRids = new Set(assignedRegions.value.map(r => r.Id))
    let assignUids = new Set(assignedUsers.value.map(u => u.Id))
    const account = store.Accout
    // Edit mode
    if (props.id) {
        node = store.NodeTree.get(props.id)
        node.Name = newName;
        node.RegionIds = new Set([account.RegionId, ...assignRids])
        node.UserIds = new Set([account.Id, ...assignUids])
        node.TypeId = taskType.value.Id;
        if (valPa && valPa.Id) {
            node.parent = valPa;
            const oSz = valPa.children.size;
            valPa.children.add(node);
            if (oSz < valPa.children.size) {
                valPa.children = new Set(valPa.children) // new ref => trigger reactivity
            }
        }
        else if (!valPa || !valPa.Id) {
            let pa = node.parent
            if (pa) {
                node.parent = null
                pa.children.delete(node);
                pa.children = new Set(pa.children) // new ref => trigger reactivity
            }
        }
        cancelForm()
        return;
    }
    // New Node
    let parentId = valPa ? valPa.Id : '';
    node = {
        Name: newName,
        TypeId: taskType.value.Id,
        RegionIds: new Set([account.RegionId, ...assignRids]),
        UserIds: new Set([account.Id, ...assignUids]),
    };
    let newId = props.addNode(node, parentId);
    clearForm()
    const edits = editNodes.value;
    let entry = edits.find(x => '' == x.Id);
    if (entry) entry.Id = newId
}
function setParent(pa) { parent.value = pa }
function setTaskType(value) { taskType.value = value }
function clearForm() {
    name.value = '';
    parent.value = null;
}
function cancelForm() {
    clearForm()
    editNodes.value = []
}
function setAssignRegions(region) {
    assignedRegions.value = buildAssignIds(region.Id, assignedRegions.value, srcAssignRegions.value);
}
function setAssignUsers(user) {
    assignedUsers.value = buildAssignIds(user.Id, assignedUsers.value, srcAssignUsers.value);
}
</script>
<template>
    <form class="form-row w-[600px] p-3 rounded-xl shadow-md m-3 bg-white">
        <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-base/7 font-semibold text-gray-900 border-b-1 border-solid border-stone-200">Form Row
                </h2>
                <div class="mt-1 flex flex-col gap-y-1.5">
                    <div class="flex gap-x-1 items-center">
                        <label for="username"
                            class="w-[120px] grow block text-sm/6 font-medium text-gray-900">Name</label>
                        <div class="w-full">
                            <div
                                class="flex items-center rounded-md bg-white px-3 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-green-600">
                                <input id="username" type="text" placeholder="DaiNB" v-model="name"
                                    class="block bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 w-full" />
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-x-1 items-center">
                        <div class="w-[120px] grow block text-sm/6 font-medium text-gray-900">Parent</div>
                        <DropdownSingle :src="availParents" :value="parent" placeholder="Select parent"
                            :setValue="setParent" />
                    </div>
                    <div class="flex gap-x-1 items-center">
                        <div class="w-[120px] grow block text-sm/6 font-medium text-gray-900">Task type</div>
                        <DropdownSingle :src="availTypes" :value="taskType" placeholder="Select type"
                            :setValue="setTaskType" />
                    </div>
                    <div class="flex gap-x-1 items-center">
                        <div class="w-[120px] grow block text-sm/6 font-medium text-gray-900">Assign regions</div>
                        <DropdownMulti :src="srcAssignRegions" :values="assignedRegions" placeholder="Assign regions"
                            :setValue="setAssignRegions" />
                    </div>
                    <div class="flex gap-x-1 items-center">
                        <div class="w-[120px] grow block text-sm/6 font-medium text-gray-900">Assign users</div>
                        <DropdownMulti :src="srcAssignUsers" :values="assignedUsers" placeholder="Assign users"
                            :setValue="setAssignUsers" />
                    </div>
                    <!-- <div class="flex gap-x-1">
                        <label for="about" class="w-[120px] grow block text-sm/6 font-medium text-gray-900 mt-2">About</label>
                        <textarea id="about" name="about" rows="3"
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"></textarea>
                    </div> -->
                </div>
            </div>

            <!-- <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-base/7 font-semibold text-gray-900">Notifications</h2>
                <p class="mt-1 text-sm/6 text-gray-600">We'll always let you know about important changes, but you pick
                    what else you want to hear about.</p>
                <div class="mt-10 space-y-10">
                    <fieldset>
                        <legend class="text-sm/6 font-semibold text-gray-900">By email</legend>
                        <div class="mt-6 space-y-6">
                            <div class="flex gap-3">
                                <div class="flex h-6 shrink-0 items-center">
                                    <div class="group grid size-4 grid-cols-1">
                                        <input id="candidates" type="checkbox" name="candidates"
                                            aria-describedby="candidates-description"
                                            class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-green-600 checked:bg-green-600 indeterminate:border-green-600 indeterminate:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto" />
                                        <svg viewBox="0 0 14 14" fill="none"
                                            class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25">
                                            <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="opacity-0 group-has-checked:opacity-100" />
                                            <path d="M3 7H11" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="opacity-0 group-has-indeterminate:opacity-100" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="text-sm/6">
                                    <label for="candidates" class="font-medium text-gray-900">Candidates</label>
                                    <p id="candidates-description" class="text-gray-500">Get notified when a candidate
                                        applies for a job.</p>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend class="text-sm/6 font-semibold text-gray-900">Push notifications</legend>
                        <p class="mt-1 text-sm/6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
                        <div class="mt-6 space-y-6">
                            <div class="flex items-center gap-x-3">
                                <input id="push-everything" type="radio" name="push-notifications" checked
                                    class="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-green-600 checked:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden" />
                                <label for="push-everything"
                                    class="block text-sm/6 font-medium text-gray-900">Everything</label>
                            </div>
                            <div class="flex items-center gap-x-3">
                                <input id="push-nothing" type="radio" name="push-notifications"
                                    class="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-green-600 checked:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden" />
                                <label for="push-nothing" class="block text-sm/6 font-medium text-gray-900">No push
                                    notifications</label>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div> -->
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" class="text-sm/6 font-semibold text-gray-900" @click.stop="cancelForm">Close</button>
            <button type="submit" @click.stop="saveForm"
                class="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Save</button>
        </div>
    </form>
</template>