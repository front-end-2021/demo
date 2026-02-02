import { reactive } from 'vue'
import { buildTree } from './common.js';

export const store = reactive({
    Regions: [],
    Lands: [],
    Markets: [],
    Submarkets: [],
    Products: [],
    ProductGroups: [],
    Users: [],
    Accout: null,
    NodeTree: new Map(), //[Id, {Id, Name, TypeId, ...}]
    setUsers(arr) { this.Users = arr },
    setLands(arr) { this.Lands = new Map(arr.map(r => [r.Id, r])) },
    setRegions(arr) { this.Regions = new Map(arr.map(r => [r.Id, r])) },
    setMarkets(arr) { this.Markets = new Map(arr.map(r => [r.Id, r])) },
    setProductGroups(arr) { this.ProductGroups = new Map(arr.map(r => [r.Id, r])) },
    setProducts(arr) { this.Products = new Map(arr.map(r => [r.Id, r])) },
    setSubmarkets(arr) { this.Submarkets = new Map(arr.map(r => [r.Id, r])) },
    setNodes(arr) { this.NodeTree = buildTree(arr) },
    loggedIn(acc) { this.Accout = acc },
    filter(fn, key = 'region') {
        let res = []
        let data
        if (key == 'land') data = this.Lands
        if (key == 'region') data = this.Regions
        if (key == 'product') data = this.Products
        if (key == 'submarket') data = this.Submarkets
        if (key == 'node') data = this.NodeTree
        for (let [id, item] of data) { if (fn(item, id)) res.push(item) }
        return res
    },
})