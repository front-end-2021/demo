import {
    ListPrj, Langs,
    DemoLands, DemoRegions,
    DemoPrdGroups, DemoProducts,
    DemoMarkets, DemoSubmarkets,
    DemoGoals,
} from './mock-data.js';
import { getTxtBy, getLocal, setLocal } from './common.js';
import { FTypeId } from './components/dFilter.js';
import { createStore } from 'vuex'
function getListBy(ids) {
    if (ids.includes(0)) {
        return buildListBy.call(this, ids)
    }
    // speed
    const mItm = new Map(this.map(x => [x.Id, x]))
    const lst = []
    for (let ii = ids.length - 1, id; -1 < ii; ii--) {
        id = ids[ii]
        if (mItm.has(id)) lst.push(mItm.get(id))
    }
    mItm.clear()
    return lst;
}
function buildListBy(ids, fnc) {
    const lst = []
    for (let ii = 0, item; ii < this.length; ii++) {
        item = this[ii]
        if (ids.includes(0)) lst.push(item)
        else if (fnc(item)) lst.push(item)
    }
    return lst
}
export default createStore({
    state: {
        Projects: [],// ListPrj,  // [{Id, Name}]
        Languages: [], // Langs,   // [{Key, Name}]
        IndexLang: 0,
        ContextLang: getTxtBy('en'),

        Lands: [], // DemoLands,
        Regions: [], // DemoRegions,
        Markets: [], // DemoMarkets,
        Submarkets: [], // DemoSubmarkets,
        ProductGroups: [],
        Products: [],
        ListGoal: [],
        ListSub: [],
        ListTask: [],

        Currencies: ['CHF', 'USD', 'VND'],
        WkMapDes: new WeakMap(),

        MarketRegions: [], // [{MarketId, RegionId, Criterias [], Active, Comment}]
        count: 0,
        Modals: [],
    },
    actions: {
        openFormValue({ commit, state }, [mId, rId]) {
            const ii = state.MarketRegions.findIndex(x => mId == x.MarketId && rId == x.RegionId);
            return [ii, state.MarketRegions[ii]]
        },
        outConfirmModal({ commit, state }, [fncTxt, data, elDom]) {
            if (!state.Modals.length) return
            const lastMdl = state.Modals[state.Modals.length - 1]
            if (Object.is(lastMdl, null)) return null;

            switch (fncTxt) {
                case 'save-close':
                    if (typeof lastMdl.saveClose != 'function') return;
                    if (!lastMdl.saveClose(data, elDom)) return false;
                    break;
                case 'exit-close':
                    if (typeof lastMdl.exitClose != 'function') return
                    if (!lastMdl.exitClose(data, elDom)) return false
                    break;
            }
            return state
        },
        updateAsort({ commit, state }, [type, oldIds, newIds]) {
            let oId, oItem, item;
            const items = [];
            switch (type) {
                case 1: buildItems(state.Lands)
                    break;
                case 2: buildItems(state.Regions);
                    break;
                case 3: buildItems(state.Markets)
                    break;
                case 5: buildItems(state.ProductGroups)
                    break;
                // case 6: // SubMarket
                // case 8: // Product
                case 9: buildItems(state.ListGoal)
                    break;
                // case 10: buildItems(state.ListSub); break;
                default: return items;
            }
            const mapIndex = new Map()
            newIds.forEach((nId, ii) => {
                oId = oldIds[ii]
                oItem = items.find(l => l.Id == oId)
                mapIndex.set(nId, oItem.ASort)
            })
            for (let ii = 0; ii < items.length; ii++) {
                item = items[ii]
                item.ASort = mapIndex.get(item.Id)
            }
            return items;
            function buildItems(lstItem) {
                for (let ii = 0; ii < lstItem.length; ii++) {
                    item = lstItem[ii]
                    if (newIds.includes(item.Id)) items.push(item)
                }
            }
        },
        copyItem({ commit, state }, [item, type]) {
            let cpyItm
            switch (type) {
                case 9:     //Main
                    cpyItm = copyItm(state.ListGoal, (itm) => item.SubmPrdId == itm.SubmPrdId)
                    let [oldIds, cpyLst] = copyChildren(state.ListSub,
                        (itm) => item.Id == itm.GoalId,
                        (cpI) => { cpI.GoalId = cpyItm.Id }
                    )
                    for (let ii = 0, oId; ii < oldIds.length; ii++) {
                        oId = oldIds[ii]
                        copyChildren(state.ListTask,
                            (itm) => oId == itm.SubId,
                            (cpI) => { cpI.SubId = cpyLst[ii].Id }
                        )
                    }
                    break;
                case 10:    // Sub
                    cpyItm = copyItm(state.ListSub, (itm) => item.GoalId == itm.GoalId)
                    copyChildren(state.ListTask,
                        (itm) => item.Id == itm.SubId,
                        (cpI) => { cpI.SubId = cpyItm.Id }
                    )
                    break;
            }
            return cpyItm
            function copyItm(lstGs, fnc) {
                const cpItm = JSON.parse(JSON.stringify(item))
                cpItm.Name += ` [1]`
                cpItm.Id = lstGs.map(x => x.Id).reduce((a, b) => Math.max(a, b), -Infinity)
                cpItm.Id += 1
                const lst = buildListBy.call(lstGs, [-1], fnc)    // list by parent id
                lst.sort((a, b) => a.ASort - b.ASort)
                let ii, index
                for (ii = 0; ii < lst.length; ii++) {
                    let itm = lst[ii]
                    if (itm.Id == item.Id) {
                        index = itm.ASort + 1
                        cpItm.ASort = index
                        break
                    }
                }
                lstGs.push(cpItm)
                for (ii += 1; ii < lst.length; ii++) {
                    let itm = lst[ii]
                    if (++index <= itm.ASort) break;
                    itm.ASort = index
                }
                return cpItm
            }
            function copyChildren(lstCh, fncCom, fncSetPa) {
                let maxId = lstCh.map(x => x.Id).reduce((a, b) => Math.max(a, b), -Infinity)
                const lst = buildListBy.call(lstCh, [-1], fncCom)    // list by parent ids
                lst.sort((a, b) => a.ASort - b.ASort)
                const cpLst = []
                for (let ii = 0, cpyC; ii < lst.length; ii++) {
                    cpyC = JSON.parse(JSON.stringify(lst[ii]))
                    cpyC.Id = ++maxId
                    cpyC.Name += ` [1]`
                    fncSetPa(cpyC)
                    lstCh.push(cpyC)
                    cpLst.push(cpyC)
                }
                return [lst.map(x => x.Id), cpLst]
            }
        },
    },
    getters: {
        ListModal(state) { return state.Modals },
        Pages(state) {
            const ctxLang = state.ContextLang
            return [ctxLang.NavMarkt, ctxLang.NavTeilmarkt, ctxLang.NavMass, ctxLang.NavRMap, ctxLang.NavTBoard]
        },
        activeLang(state) {
            const lng = state.Languages[state.IndexLang]
            if (typeof lng != 'object' || Object.is(lng, null)) return {}
            return lng
        },
        txtFilter: (state) => (id) => {
            const txt = state.ContextLang;
            if (!txt) return;
            switch (id) {
                case FTypeId.SelectAll:
                    return txt.SelectAll;
                case FTypeId.PleaseSelect:
                    return txt.PleaseSelect;
                case FTypeId.SelectLand:
                    return txt.SelectLand;
                case FTypeId.SelectMarketSegments:
                    return txt.SelectMarketsegments;
                case FTypeId.SelectRegion:
                    return txt.SelectRegion;
                case FTypeId.Land_Region:
                    return `${txt.Land}/${txt.Region}`;
                case FTypeId.ProductGroups_Product:
                    return `${txt.ProductGroups}/${txt.Product}`;
                case FTypeId.MarketSegments_Submarket:
                    return `${txt.Marketsegments}/${txt.Submarkets}`;
                default: break;
            }
            return ''
        },
        newASort: (state) => (type) => {
            let lst = []
            switch (type) {
                case 1: lst = state.Lands.map(x => x.ASort)
                    break;
                case 2: lst = state.Regions.map(x => x.ASort)
                    break;
                case 3: lst = state.Markets.map(x => x.ASort)
                    break;
                case 5: lst = state.ProductGroups.map(x => x.ASort)
                    break;
                case 8: lst = state.Products.map(x => x.ASort)
                    break;
                default: return [];
            }
            if (!lst.length) return 1;
            lst.sort((a, b) => b - a)
            return lst[0] + 1
        },
        SortedItems: (state, getters) => ([type, ids, ignoreIds]) => {
            if (!ids.length && !ignoreIds.length) return []
            let lst = getters.UnsortItems([type, ids, ignoreIds])
            if (lst.length < 2) return lst;
            lst.sort((a, b) => a.ASort - b.ASort)
            return lst
        },
        UnsortItems: (state) => ([type, ids, ignoreIds]) => {
            if (!ids.length && !ignoreIds.length) return []
            let lst = []
            if (ids.length) {
                switch (type) {
                    case 1:     // Land
                        lst = getListBy.call(state.Lands, ids)
                        break;
                    case 2:     // Market
                        lst = getListBy.call(state.Markets, ids)
                        break
                    case 3:     // Region
                        lst = getListBy.call(state.Regions, ids)
                        break
                    case 4: //Submarkets
                        lst = getListBy.call(state.Submarkets, ids)
                        break
                    case 5:     // Product Groups
                        lst = getListBy.call(state.ProductGroups, ids)
                        break
                    case 8:     // Products
                        lst = getListBy.call(state.Products, ids)
                        break;
                    case 9: lst = getListBy.call(state.ListGoal, ids)
                    default: return lst
                }
            } else {
                switch (type) {
                    case 1: lst = state.Lands;
                        break;
                    case 2: lst = state.Markets;
                        break
                    case 3: lst = state.Regions;
                        break
                    case 4: lst = state.Submarkets;
                        break
                    case 5: lst = state.ProductGroups;
                        break
                    case 8: lst = state.Products;
                        break
                    case 9: lst = state.ListGoal;
                        break
                    default: return lst
                }
            }
            if (ignoreIds.length) {
                lst = buildList(lst)
                function buildList(srItems) {
                    const dItems = []
                    for (let ii = 0, item; ii < srItems.length; ii++) {
                        item = srItems[ii]
                        if (!ignoreIds.includes(item.Id)) dItems.push(item)
                    }
                    return dItems
                }
            }
            return lst;
        },
        ItemBy: (state) => ([type, id]) => {
            switch (type) {
                case 1:     // Land
                    return state.Lands.find(x => x.Id == id);
                case 2:     // Market
                    return state.Markets.find(x => x.Id == id);
                case 3:     // Region
                    return state.Regions.find(x => x.Id == id);
                default: break;
            }
        },
        sortedInRange: (state, getters) => ([type, ptIds, i0, ie]) => {
            let lst = []
            switch (type) {
                case 9:     // Goals by SubmarketProductIds
                    lst = buildListBy.call(state.ListGoal, ptIds, (itm) => ptIds.includes(itm.SubmPrdId))
                    break;
                case 10:      // Subs by GoalIds
                    lst = buildListBy.call(state.ListSub, ptIds, (itm) => ptIds.includes(itm.GoalId))
                    break;
                case 11:      // Tasks by SubIds
                    lst = buildListBy.call(state.ListTask, ptIds, (itm) => ptIds.includes(itm.SubId))
                    break;
                default: return lst;
            }
            if (1 < lst.length) lst.sort((a, b) => a.ASort - b.ASort)
            const len = lst.length
            lst.splice(0, i0)
            lst.splice(ie + 1, len - ie)
            return lst;
        },
        sortedItemsBy: (state, getters) => ([type, ptIds, ids]) => {
            let lst = getters.unSortItemsBy([type, ptIds, ids])
            if (1 < lst.length) lst.sort((a, b) => a.ASort - b.ASort)
            return lst
        },
        unSortItemsBy: (state) => ([type, ptIds, ids]) => {
            let lst = []
            switch (type) {
                case 2: // Regions by LandIds
                    lst = buildListBy.call(state.Regions, ptIds, (itm) => ptIds.includes(itm.LandId))
                    break;
                case 3: // Product groups by RegionIds
                    if (ptIds.includes(0))
                        lst = buildListBy.call(state.ProductGroups, [0])
                    else
                        lst = buildListBy.call(state.ProductGroups, ptIds, (itm) => ptIds.includes(itm.RegionId));
                    if (Array.isArray(ids) && ids.length && !ids.includes(0)) {
                        lst = getListBy.call(lst, ids)
                    }
                    break;
                case 4: // Products by PrdGroupIds
                    if (ptIds.length)
                        lst = buildListBy.call(state.Products, ptIds, (itm) => ptIds.includes(itm.PrdGroupId))
                    else lst = buildListBy.call(state.Products, [0])
                    if (Array.isArray(ids) && ids.length && !ids.includes(0)) {
                        lst = getListBy.call(lst, ids)
                    }
                    break;
                case 5: // Markets by LandIds
                    lst = buildListBy.call(state.Markets, ptIds, (itm) => ptIds.includes(itm.LandId))
                    if (Array.isArray(ids) && ids.length && !ids.includes(0)) {
                        lst = getListBy.call(lst, ids)
                    }
                    break;
                case 6: // SubMarkets by MarketIds
                    lst = buildListBy.call(state.Submarkets, ptIds, (itm) => ptIds.includes(itm.MarketId))
                    if (Array.isArray(ids) && ids.length && !ids.includes(0)) {
                        lst = getListBy.call(lst, ids)
                    }
                    break;
                // case 8: // Product
                case 9:     // Goals by SubmarketProductIds
                    lst = buildListBy.call(state.ListGoal, ptIds, (itm) => ptIds.includes(itm.SubmPrdId))
                    if (Array.isArray(ids) && ids.length && !ids.includes(0)) {
                        lst = getListBy.call(lst, ids)
                    }
                    break;
                case 10:      // Subs by GoalIds
                    lst = buildListBy.call(state.ListSub, ptIds, (itm) => ptIds.includes(itm.GoalId))
                    if (Array.isArray(ids) && ids.length && !ids.includes(0)) {
                        lst = getListBy.call(lst, ids)
                    }
                    break;
                case 11:      // Tasks by SubIds
                    lst = buildListBy.call(state.ListTask, ptIds, (itm) => ptIds.includes(itm.SubId))
                    if (Array.isArray(ids) && ids.length && !ids.includes(0)) {
                        lst = getListBy.call(lst, ids)
                    }
                    break;
                default: return lst;
            }
            return lst
        },
        MarketRegionBy: (state) => ([mId, rId]) => {
            return state.MarketRegions.find(x => mId == x.MarketId && rId == x.RegionId);
        },
        newNumId: (state) => (type) => {
            let demoIds = [];
            switch (type) {
                case 1: // Land
                    demoIds = DemoLands.map(x => x.Id)
                    break;
                case 2: // Region
                    demoIds = DemoRegions.map(x => x.Id)
                    break;
                case 3: // Market
                    demoIds = DemoMarkets.map(x => x.Id)
                    break;
                case 4: // Submarket
                    demoIds = DemoSubmarkets.map(x => x.Id)
                    break;
                default: return 1989;
            }
            const localIds = getLocal(type).map(x => x.Id)
            const allIds = [...demoIds, ...localIds];
            if (!allIds.length) return 1;
            allIds.sort((a, b) => b - a)        // decrease
            return allIds[0] + 1;
        },
        Des: (state) => (item) => { return state.WkMapDes.get(item) || '' },
        checkChangeExt: (state, getters) => ([item, mItem, mess]) => {
            let des = mItem.Description
            if (typeof des == 'string') {
                des = des.trim()
                if (!state.WkMapDes.has(item)) {
                    if ('' != des) setDes()
                } else if (state.WkMapDes.get(item) != des) {
                    setDes()
                }
                function setDes() {
                    if (!mess) mess = `Something changes: \n`;
                    mess += `Description : ${getters.Des(item)} => ${des}`
                }
            }
            return mess;
        },
    },
    mutations: {
        setModal(state, [item, saveClose, exitClose]) { state.Modals.push({ item, saveClose, exitClose }) },
        outModal(state, [fncTxt, data]) {
            if (!state.Modals.length) return
            let lastMdl = state.Modals.pop()
            if (Object.is(lastMdl, null)) return null
            switch (fncTxt) {
                case 'save-close':
                    if (typeof lastMdl.saveClose != 'function') return
                    lastMdl.saveClose(data)
                    break;
                case 'exit-close':
                    if (typeof lastMdl.exitClose != 'function') return
                    lastMdl.exitClose(data)
                    break;
            }
        },
        setILang(state, val) {
            state.IndexLang = val
            const lng = state.Languages[val]
            if (lng) state.ContextLang = getTxtBy(lng.Key);
            else state.ContextLang = getTxtBy()
        },
        setDataProject(state, [iProject, oldiPrj]) {
            const prj = state.Projects[iProject]
            if (!prj) return;
            switch (prj.Id) {
                case 1:     // Demo
                    if (oldiPrj < state.Projects.length && 2 == state.Projects[oldiPrj].Id) {
                        updateLocalStore.call(state)
                    }
                    state.Lands = DemoLands
                    state.Regions = DemoRegions
                    state.Markets = DemoMarkets
                    state.Submarkets = DemoSubmarkets
                    state.ProductGroups = DemoPrdGroups
                    state.Products = DemoProducts
                    return;
                case 2:     // localStorage
                    state.Lands = getLocal(1)
                    state.Regions = getLocal(2)
                    state.Markets = getLocal(3)
                    state.Submarkets = getLocal(4)
                    state.ProductGroups = getLocal(7)
                    state.Products = getLocal(8)
                    setMapwDes(state.Lands)
                    setMapwDes(state.Regions)
                    setMapwDes(state.Markets)
                    setMapwDes(state.Submarkets)
                    setMapwDes(state.ProductGroups)
                    setMapwDes(state.Products)
                    return;
                case 3:     // Clear local storage
                    localStorage.clear();
                    break;
                default: return;
            }
            state.Lands = []
            state.Regions = []
            state.Markets = []
            state.Submarkets = []
            state.ProductGroups = []
            state.Products = []
            function setMapwDes(items) {
                for (let ii = 0, item; ii < items.length; ii++) {
                    item = items[ii]
                    let des = item.Descrip
                    delete item.Descrip
                    if (des) state.WkMapDes.set(item, des)
                }
            }
        },
        addUpdateLocal(state, [type, item, iProject]) {
            const prj = state.Projects[iProject]
            if (!prj) return;
            if (!Object.is(item, null)) {
                switch (type) {
                    case 1: state.Lands.push(item);
                        break;;
                    case 2: state.Regions.push(item);
                        break;
                    case 3: state.Markets.push(item);
                        break;
                    case 4: state.Submarkets.push(item);
                        break;
                    case 5: state.ProductGroups.push(item);
                        break;
                    case 8: state.Products.push(item);
                        break;
                    default: return;
                }
            }
            if (2 == prj.Id) {          //localStorage
                updateLocalStore.call(state, type)

            }
        },
        setDes(state, [item, des]) {
            if (typeof des != 'string' || '' == des.trim()) {
                state.WkMapDes.delete(item)
                return;
            }
            state.WkMapDes.set(item, des)
        },
        remove(state, [itemId, type]) {
            let lst, lst2 = [];
            switch (type) {
                case 9: // Main
                    lst = state.ListGoal
                    for (let mm = lst.length - 1, goal; -1 < mm; mm--) {
                        goal = lst[mm]
                        if (goal.Id == itemId) lst.splice(mm, 1)
                    }
                    lst = state.ListSub
                    lst2 = []
                    for (let ss = lst.length - 1, sub; -1 < ss; ss--) {
                        sub = lst[ss]
                        if (sub.GoalId == itemId) {
                            lst2.push(sub.Id)
                            lst.splice(ss, 1)
                        }
                    }
                    lst = state.ListTask
                    for (let tt = lst.length - 1, task; -1 < tt; tt--) {
                        task = lst[tt]
                        if (lst2.includes(task.SubId)) lst.splice(tt, 1)
                    }
                    break;
                case 10:    // Sub
                    lst = state.ListSub
                    for (let ss = lst.length - 1, sub; -1 < ss; ss--) {
                        sub = lst[ss]
                        if (sub.Id == itemId) {
                            lst.splice(ss, 1)
                        }
                    }
                    lst = state.ListTask
                    lst2 = []
                    for (let tt = lst.length - 1, task; -1 < tt; tt--) {
                        task = lst[tt]
                        if (task.SubId == itemId) {
                            lst2.push(task.Id)
                            lst.splice(tt, 1)
                        }
                    }
                    break;
            }
        },
    }
})
function updateLocalStore(type) {
    const state = this
    if (typeof type != 'number') {
        if (state.Lands.length) setLocal(1, getFulInfos(state.Lands))
        if (state.Regions.length) setLocal(2, getFulInfos(state.Regions))
        if (state.Markets.length) setLocal(3, getFulInfos(state.Markets))
        if (state.Submarkets.length) setLocal(4, getFulInfos(state.Submarkets))
        if (state.ProductGroups.length) setLocal(7, getFulInfos(state.ProductGroups))
        if (state.Products.length) setLocal(8, getFulInfos(state.Products))
        return
    }
    switch (type) {
        case 1: setLocal(type, getFulInfos(state.Lands))
            break;;
        case 2: setLocal(type, getFulInfos(state.Regions))
            break;
        case 3: setLocal(type, getFulInfos(state.Markets))
            break;
        case 4: setLocal(type, getFulInfos(state.Submarkets))
            break;
        case 5: setLocal(7, getFulInfos(state.ProductGroups))
            break;
        case 8: setLocal(8, getFulInfos(state.Products))
            break;
        default: break;
    }
    function getFulInfos(items) {
        const mapDes = state.WkMapDes
        const cpyItems = JSON.parse(JSON.stringify(items))
        for (let ii = 0, item; ii < items.length; ii++) {
            item = items[ii]
            if (mapDes.has(item)) {
                cpyItems[ii].Descrip = mapDes.get(item)
            }
        }
        return cpyItems
    }
}