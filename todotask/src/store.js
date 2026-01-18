import { reactive } from 'vue'
import { buildTree } from './common.js';

export const store = reactive({
    Regions: [],
    Users: [],
    Accout: null,
    NodeTree: new Map(), //[Id, {Id, Name, TypeId, ...}]
    setRegions(arr) { this.Regions = arr },
    setUsers(arr) { this.Users = arr },
    loggedIn(acc) { this.Accout = acc },
    setNodes(arr){ this.NodeTree = buildTree(arr) },
})