const Operands = [{ Id: 1, Name: 'And' }, { Id: 2, Name: 'Or' }]
const mFilterBy = { Id: 0, Name: 'Filter by' }
// list criterial type
const mType = [
    { Id: 0, Name: 'Please select' },
    { Id: 1, Name: `Land/Region` },
    { Id: 2, Name: `Product groups/Product` },
    { Id: 3, Name: `Stakeholder groups/Contact Person` },
    { Id: 4, Name: `Customer Journey Group` },
    { Id: 5, Name: `Market segments/Stakeholder groups` },
    { Id: 6, Name: `Task` },
    { Id: 7, Name: `User` },
    { Id: 8, Name: `Status` },
    { Id: 9, Name: `Objective category` },
    { Id: 10, Name: `Measure category` },
    { Id: 11, Name: `Instruments` },
    { Id: 12, Name: `Advertising material/Advertiser` },
    { Id: 13, Name: `Superior objectives and measures` },
    { Id: 14, Name: `Master goals` },
    { Id: 20, Name: `Masterbudget` },
    { Id: 19, Name: `Fibu/Cost center` },
    { Id: 15, Name: `Department/Field` },
    { Id: 16, Name: `Subject/thema` },
    { Id: 17, Name: `Supplier` },
    { Id: 18, Name: `Hidden elements` },
]
// list dropdown type
const lType = [
    { Id: 0, Name: `Select all` },
    { Id: -1, Name: `Product groups` },
    { Id: -2, Name: `Product` },
    { Id: -3, Name: `Subproduct` },
    { Id: -4, Name: `Stakeholder groups` },
    { Id: -5, Name: `Contact Person` },
    { Id: -6, Name: `Contact SubPerson` },
    { Id: -7, Name: `Customer Journey Group` },
    { Id: -8, Name: `Customer Journey` },
    { Id: -9, Name: `Customer Sub-journey` },
    { Id: -10, Name: `Select Market segments` },
    { Id: -11, Name: `Select Stakeholder groups` },
    { Id: -12, Name: `Please select` },
    { Id: -13, Name: `All status` },
    { Id: -14, Name: `Advertising meterial` },
    { Id: -15, Name: `Advertiser` },
    { Id: -16, Name: `Superior themes` },
    { Id: -17, Name: `Themes` },
    { Id: -18, Name: `Select master maingoals` },
    { Id: -19, Name: `Select master subgoals` },
    { Id: -20, Name: `Show all` },
    { Id: -21, Name: `Show only hidden` },
    { Id: -22, Name: `Select Land/Region` },
    { Id: -23, Name: `Last status` },
]
class Criterial {
    constructor(operand, type, ids) {
        this.Operand = typeof operand == 'number' ? operand : 0
        this.Type = typeof type == 'number' ? type : lType[0].Id
        this.Ids = Array.isArray(ids) ? ids : []
    }
    toTxt() { return `{Operand:${this.Operand},Type:${this.Type},Ids:[${this.Ids.join(',')}]}` }
    copy() { return JSON.parse(JSON.stringify(this)) }
}
class MktFilter {
    #Blocks = [];       // [{Operand, Type, Ids}]
    #Events = [];
    constructor(criterials) {
        for (let ii = 0; ii < criterials.length; ii++) {
            this.#Blocks.push(criterials[ii])
        }
    }
    get ListBlock() {
        if (!this.#Blocks.length) return []
        const lstBlock = [[this.#Blocks[0]]]
        for (let ii = 1; ii < this.#Blocks.length; ii++) {
            const row = this.#Blocks[ii]        //{Operand, Type, Ids}
            switch (row.Type) {
                case 1:  // Land/Region
                    lstBlock.push([row])
                    break;
                default:
                    const blockItems = lstBlock[lstBlock.length - 1]
                    blockItems.push(row)
                    break;
            }
        }
        return lstBlock
    }
    get LandIds() {
        const rwLandRegns = []  //this.#Blocks.filter(x => 1 == x.Type)
        for (let ii = 0; ii < this.ListBlock.length; ii++) {
            const rows = this.ListBlock[ii]
            if (!rows.length) continue;
            const row = rows[0]
            if (1 == row.Type) rwLandRegns.push(row)
        }
        if (!rwLandRegns.length) return [0]
        let ids = []
        for (let ii = 0; ii < rwLandRegns.length; ii++) {
            const criterial = rwLandRegns[ii]
            const id = criterial.Ids[0]
            if (criterial.Operand < 1) {
                // Filter By
                ids.push(id)
                continue
            }
            if (criterial.Operand < 2) {
                // == 1 (And)
                if (id == 0) {  // select all
                    if (ids.includes(id)) continue
                    ids.push(id)
                    continue
                }
                if (0 < id) {
                    if (ids.includes(id)) {
                        ids = [id]
                        continue
                    }
                    const i0 = ids.indexOf(0)
                    if (-1 < i0) {
                        ids.splice(i0, 1)
                        ids.push(id)
                        continue
                    }
                    return []
                }
                continue
            }
            // == 2 Or
            if (ids.includes(0)) continue
            if (ids.includes(id)) continue
            ids.push(id)
        }
        if (ids.includes(0)) return [0]
        return ids
    }
    get RegionIds() {
        const rwLandRegns = []// this.#Blocks.filter(x => 1 == x.Type)
        for (let ii = 0; ii < this.ListBlock.length; ii++) {
            const rows = this.ListBlock[ii]
            if (!rows.length) continue;
            const row = rows[0]
            if (1 == row.Type) rwLandRegns.push(row)
        }
        if (!rwLandRegns.length) return [0]
        
        let lstId = []
        for (let ii = 0; ii < rwLandRegns.length; ii++) {
            const crite = rwLandRegns[ii]
            const rgnId = crite.Ids[1]
            if (rgnId < 0) continue
            if (!lstId.length) {
                // 1st
                lstId.push(rgnId)
                continue
            }
            if (rgnId == 0) {           // Select all
                if (lstId.includes(0)) {
                    continue
                }
                if (1 == crite.Operand) {       // And
                    continue
                }
                lstId = [0]
                continue
            }
            // 0 < rgnId
            if (1 == crite.Operand) {       // And
                if (!lstId.includes(rgnId)) {
                    if (lstId.includes(0)) {
                        lstId = [rgnId]
                        continue
                    }
                    lstId.splice(0)     // empty list
                    continue
                }
                lstId = [rgnId]
                continue
            }
            if (2 == crite.Operand) {        // Or
                if (lstId.includes(rgnId)) continue
                lstId.push(rgnId)
                continue
            }
        }
        if (lstId.includes(0)) return [0]
        return lstId
    }
    get MarketIds() {
        const marketIds = []
        const blocks = this.#Blocks
        let lastI = -1
        for (let ii = 0; ii < blocks.length; ii++) {
            const crite = blocks[ii]
            if (5 != crite.Type) continue
            const marketId = crite.Ids[0]
            if (!marketIds.length) {
                if (-1 < marketId) marketIds.push(marketId)
                lastI = ii
                continue
            }
            if (1 == crite.Operand) {        // And
                if (marketId < 0) {
                    marketIds.splice(0)
                    lastI = ii
                    continue
                }
                if (marketId == 0) {
                    if (marketIds.includes(0)) {
                        lastI = ii
                        continue
                    }
                    marketIds.splice(0)
                    marketIds.push(0)
                    lastI = ii
                    continue
                }
                // 0 < marketId
                if (marketIds.includes(0)) {
                    marketIds.splice(0)
                    marketIds.push(marketId)
                    lastI = ii
                    continue
                }
            }
            // Or
            if (marketId <= 0 || marketIds.includes(0)) {
                lastI = ii
                continue
            }
            // 0 < marketId
            marketIds.push(marketId)
            lastI = ii
        }
        if (lastI < 0) {
            if (this.LandIds.includes(0)) return [0]
            return getMarketsIn(this.LandIds, []).map(x => x.Id)
        }
        if (marketIds.includes(0)) return [0]
        return marketIds
    }
    get SubmarketIds() {
        let subMrketIds = []
        const blocks = this.#Blocks
        let lastI = -1
        for (let ii = 0; ii < blocks.length; ii++) {
            const crite = blocks[ii]
            if (5 != crite.Type) continue
            const marketId = crite.Ids[0]
            const subMarketId = crite.Ids[1]
            if (!subMrketIds.length) {
                // 1st time
                if (marketId < 0) {
                    lastI = ii
                    continue
                }
                if (0 == marketId) {
                    if (subMarketId < 1) {
                        subMrketIds.push(0)
                        lastI = ii
                        continue
                    }
                    subMrketIds.push(subMarketId)
                    lastI = ii
                    continue
                }
                // 0 < marketId
                if (subMarketId < 1) {
                    lastI = ii
                    continue
                }
                subMrketIds.push(subMarketId)
                lastI = ii
                continue
            }
            // 2nd times or more
            if (1 == crite.Operand) {        // And
                if (marketId < 0) {
                    lastI = ii
                    continue
                }
                // 0 <= marketId
                if (subMarketId < 1) {
                    subMrketIds.splice(0)      // empty array
                    lastI = ii
                    continue
                }
                // 0 < subMarketId
                if (subMrketIds.includes(0)) {
                    subMrketIds.splice(0)      // empty array
                    subMrketIds.push(subMarketId)
                    lastI = ii
                    continue
                }
                if (subMrketIds.includes(subMarketId)) {
                    lastI = ii
                    continue
                }
                subMrketIds.splice(0)      // empty array
                lastI = ii
                continue
            }
            // Or
            if (subMarketId < 1 || subMrketIds.includes(0) || subMrketIds.includes(subMarketId)) {
                lastI = ii
                continue
            }
            // 0 < subMarketId
            subMrketIds.push(subMarketId)
            lastI = ii
        }
        if (lastI < 0) {
            if (this.MarketIds.includes(0)) return [0]
            return getSubmarket(this.MarketIds, []).map(x => x.Id)
        }
        if (subMrketIds.includes(0)) {
            return [0] //return getSubmarket([0], []).map(x => x.Id)
        }
        return subMrketIds
    }
    get ProductIds() {
        let productIds = []
        const blocks = this.#Blocks
        let lastI = -1
        for (let ii = 0; ii < blocks.length; ii++) {
            const crite = blocks[ii]
            if (2 != crite.Type) continue
            const prdId = crite.Ids[1]
            if (prdId < 1) {
                lastI = ii
                continue
            }
            if (!productIds.length) {
                // 1st time
                productIds.push(prdId)
                lastI = ii
                continue
            }
            // 2nd times or more
            if (2 == crite.Operand) {        // Or
                if (productIds.includes(prdId)) {
                    lastI = ii
                    continue
                }
                productIds.push(prdId)
                lastI = ii
                continue
            }
            // And
            if (productIds.includes(prdId)) {
                lastI = ii
                continue
            }
            productIds.splice(0)
            lastI = ii
            continue
        }
        if (lastI < 0) {
            if (this.RegionIds.includes(0)) return [0]
            const prdGrpIds = getProductGroups(this.RegionIds, []).map(x => x.Id)
            return getProductsIn(prdGrpIds, []).map(x => x.Id)
        }
        return productIds
    }
    get Criterials() {
        const lst = []
        for (let ii = 0; ii < this.#Blocks.length; ii++) {
            const crite = this.#Blocks[ii]
            lst.push(crite.copy())
        }
        return lst
    }
    toTxt(type) {
        type = typeof type != 'string' ? 'Data' : type
        switch (type) {
            case 'Data': return `[${this.#Blocks.map(crite => crite.toTxt()).join(',')}]`
            case 'Operand': return `[${this.#Blocks.map(crite => crite.Operand).join(',')}]`
            case 'Type': return `[${this.#Blocks.map(crite => crite.Type).join(',')}]`
            case 'Ids': return `[${this.#Blocks.map(crite => crite.Ids.join(',')).join(',')}]`
        }
    }
    setFilter = null
    getBlock(ii) { return this.#Blocks[ii] }
    setNextIds(ii, isType) {
        if (typeof ii != 'number') return
        for (let kk = ii + 1; kk < this.#Blocks.length; kk++) {
            const row = this.#Blocks[kk]
            if (isType(row.Type)) return;
            const initIds = getInitIds(row.Type);
            row.Ids = initIds
        }
    }
    getBlocks() {
        const lst = []
        for (let ii = 0; ii < this.#Blocks.length; ii++) lst.push(this.#Blocks[ii])
        return lst
    }
    removeBlock(ii) {
        this.#Blocks.splice(ii, 1)
        this.removeEvent(ii)
    }
    pushBlock(row) { this.#Blocks.push(row) }
    setEvent(ii, fnc) {
        if (typeof fnc != 'function')
            fnc = () => { console.error(`event ${ii} is not function`) };
        if (this.#Events[ii]) {
            this.#Events[ii] = fnc
        } else this.#Events.push(fnc)
    }
    removeEvent(ii) { if (this.#Events[ii]) this.#Events.splice(ii, 1) }
    setDataSource(ii) {
        if (typeof ii != 'number')
            this.#Events.forEach(fnc => fnc())
        else if (-1 < ii) {
            for (let kk = ii; kk < this.#Events.length; kk++) {
                this.#Events[kk]()
            }
        }
    }
    setEvtSource(ii) {
        for (let kk = 0; kk < this.#Events.length; kk++) {
            if (ii == kk) continue
            this.#Events[kk]()
        }
    }
}
function getInitIds(type) {
    switch (type) {
        case 1: return [0, 0]           // Land/Region
        case 2: return [-1, -2, -3]     //Product groups/Product
        case 3: return [-4, -5, -6]     // Stakeholder groups/Contact Person
        case 4: return [-7, -8, -9]     // Customer Journey Group
        case 5: return [-10, -11]       // Market segments/Stakeholder groups
        case 7: return [-12]              // User
        case 6:                         // Task
        case 10:                         // Measure category
        case 11:                         // Instruments
        case 15:                        // Department/Field
        case 16:                        // Subject/thema
        case 17:                        // Supplier
        case 18:                        // Hidden elements
        case 9: return [-12]             // Objecttive category
        case 8: return [-13, -12]       // Status
        case 12: return [-14, -15]       // Advertising material/Advertiser
        case 13: return [-16, -17]       // Superior objectives and measures
        case 14: return [-18, -19]       // Master goals
        case 19: return [-22, 0, 0]     //Fibu/Cost center
        case 20: return [-18, -19]      // Masterbudget
    }
    return []
}
function getSourceIds(index, ii, cType, cIds) {
    const dfilter = this
    let lst = []
    switch (cType) {
        case 1: // Land/Region
            lst = [lType[0]]
            if (0 == index) {
                Lands.forEach(land => lst.push(land))
                return lst
            }
            const landId = cIds[0]
            return getRegions(landId, lst)
        case 2: // Product groups/Product
            switch (index) {
                case 0:     // Product group
                    lst = [lType[1]]
                    return getPrdGroups(lst)
                case 1:     // product
                    const pgId = cIds[index - 1]
                    const lstPrdGrpId = pgId < 0 ? getPrdGroups([]).map(x => x.Id) : [pgId]
                    lst = [lType[2]]
                    return getProductsIn(lstPrdGrpId, lst)
                case 2:     // sub product
                    const prdId = cIds[index - 1]
                    lst = [lType[3]]
                    return getSubProducts(prdId, lst)
            }
            return []
        case 3:
            switch (index) {
                case 0:     // stake holder group | sub market
                    lst = [lType[4]]
                    const mkIds = closestMarketIds()
                    return getSubmarket(mkIds, lst)
                case 1: return [lType[5]]    // Contact person
                case 2: return [lType[6]]    // Sub contact
            }
            return []
        case 4:     //Customer Journey Group
            switch (index) {
                case 0: lst.push(lType[7])
                    break;
                case 1: lst.push(lType[8])
                    break;
                default: lst.push(lType[9])
                    break;
            }
            return lst;
        case 5: // Market segments/Stakeholder groups
            if (0 == index) {
                lst = [lType[10], lType[0]]
                const landRegnId = closestIds(ii, 1)
                const landId = landRegnId.length ? landRegnId[0] : -1
                return getMarkets(landId, lst)
            }
            const marketId = cIds[0]
            lst = [lType[11]]
            if (marketId < 0) return lst
            for (let ii = 0; ii < StakeholderGroups.length; ii++) {
                const stk = StakeholderGroups[ii]
                if (0 < marketId && marketId != stk.MarketId) continue
                lst.push(stk)
            }
            return lst
        case 6:    // Task
            lst.push(lType[12])
            return lst
        case 7:    // User
            lst.push(lType[12])
            for (let aa = 0; aa < ListAccount.length; aa++) {
                const user = ListAccount[aa]
                lst.push(user)
            }
            return lst
        case 8:     // Status
            if (0 == index) {
                lst.push(lType[13])
                lst.push(lType[23])
            } else {
                lst.push(lType[12])
            }
            return lst;
        case 9:        //Objective category
            lst.push(lType[12])
            return lst;
        case 10:        //Measure category
            lst.push(lType[12])
            return lst;
        case 11:        //Instruments
            lst.push(lType[12])
            return lst;
        case 12:        //Advertising material/Advertiser
            if (0 == index) {
                lst.push(lType[14])
                lst.push(lType[0])
            } else lst.push(lType[15])
            return lst;
        case 13:    // Superior objectives and measure
            if (0 == index) lst.push(lType[16])
            else lst.push(lType[17])
            return lst
        case 19:    // Fibu/Cost center
            switch (index) {
                case 0: lst.push(lType[22])
                    break;
                default: lst.push(lType[0])
                    break;
            }
            return lst
        case 15:    // Department/Field
            lst.push(lType[12])
            return lst
        case 16:    // Subject/thema
        case 17:    // Supplier
            lst.push(lType[12])
            lst.push(lType[20])
            return lst;
        case 18:    // Hidden elements
            lst.push(lType[12])
            lst.push(lType[20])
            lst.push(lType[21])
            return lst;
        case 14:    //Master goals
        case 20:    //Masterbudget
            if (0 == index) {
                lst.push(lType[18])
            } else lst.push(lType[19])
            return lst
    }
    return lst
    function getPrdGroups(lst) {
        const landRgnId = closestIds(ii, 1)
        const rgnIds = landRgnId.length > 1 ? [landRgnId[1]] : [0]
        return getProductGroups(rgnIds, lst)
    }
    function closestMarketIds() {
        for (let jj = ii - 1; -1 < jj; jj--) {
            const prevCrite = dfilter.getBlock(jj)
            if (1 == prevCrite.Type) {
                const landId = prevCrite.Ids[0]
                if (landId < 0) return []
                if (landId == 0) {
                    const markets = getMarkets(0, [])
                    return markets.map(x => x.Id)
                }
                const markets = getMarkets(landId, [])
                return markets.map(x => x.Id)
            }
            if (5 == prevCrite.Type) {
                const mkrId = prevCrite.Ids[0]
                const markets = getMarkets(mkrId, [])
                return markets.map(x => x.Id)
            }
        }
        return []
    }
    function closestIds(ii, type) {
        if (ii == 0) return [0]
        for (let jj = ii - 1; -1 < jj; jj--) {
            const crite = dfilter.getBlock(jj)
            if (crite.Type == type) return crite.Ids
        }
        return []
    }
}
function getSubmarket(market_Ids, lst) {
    if (market_Ids.includes(0)) {
        for (let ii = 0; ii < StakeholderGroups.length; ii++) {
            const subMrk = StakeholderGroups[ii]
            lst.push(subMrk)
        }
        return lst
    }
    for (let ii = 0; ii < StakeholderGroups.length; ii++) {
        const subMrk = StakeholderGroups[ii]
        if (market_Ids.includes(subMrk.MarketId)) {
            lst.push(subMrk)
        }
    }
    return lst
}
function getMarketsIn(landIds, lst) {
    if (!landIds.length) return lst
    if (landIds.includes(0)) {
        return getMarkets(0, lst)
    }
    for (let ii = 0; ii < MarketSegments.length; ii++) {
        const mrk = MarketSegments[ii]
        for (let ll = 0; ll < landIds.length; ll++) {
            const landId = landIds[ll]
            if (mrk.LandIds.includes(landId)) {
                lst.push(mrk)
                break
            }
        }
    }
    return lst
}
function getMarkets(landId, lst) {
    if (landId < 0) return lst
    if (0 == landId) {
        for (let ii = 0; ii < MarketSegments.length; ii++) {
            const mrk = MarketSegments[ii]
            lst.push(mrk)
        }
        return lst
    }
    for (let ii = 0; ii < MarketSegments.length; ii++) {
        const mrk = MarketSegments[ii]
        if (mrk.LandIds.includes(landId)) {
            lst.push(mrk)
        }
    }
    return lst
}
function getRegionsIn(landIds, lst) {
    if (!landIds.length) return lst
    if (landIds.includes(0)) return getRegions(0, lst)
    for (let ii = 0; ii < Regions.length; ii++) {
        const regn = Regions[ii]
        for (let ll = 0; ll < landIds.length; ll++) {
            const landId = landIds[ll]
            if (landId != regn.LandId) continue
            lst.push(regn)
            break
        }
    }
    return lst
}
function getRegions(landId, lst) {
    for (let ii = 0; ii < Regions.length; ii++) {
        const regn = Regions[ii]
        if (0 == landId || landId == regn.LandId) {
            lst.push(regn)
        }
    }
    return lst
}
function getProductGroups(region_Ids, lst) {
    if (!region_Ids.length) return lst
    if (region_Ids.includes(0)) {
        for (let ii = 0; ii < ProductGroups.length; ii++) {
            lst.push(ProductGroups[ii])
        }
        return lst
    }
    for (let ii = 0; ii < ProductGroups.length; ii++) {
        const prdG = ProductGroups[ii]
        for (let kk = 0; kk < prdG.RegionIds.length; kk++) {
            const rgId = prdG.RegionIds[kk]
            if (region_Ids.includes(rgId)) {
                lst.push(prdG)
                break
            }
        }
    }
    return lst
}
function getProductsIn(prdGrpIds, lst) {
    if (!prdGrpIds.length) return lst
    if (prdGrpIds.includes(0)) return getProducts(0, lst)
    for (let ii = 0; ii < Products.length; ii++) {
        const prd = Products[ii]
        if (prdGrpIds.includes(prd.PrgId)) {
            lst.push(prd)
        }
    }
    return lst
}
function getProducts(prdGroupId, lst) {
    if (0 == prdGroupId) {
        for (let ii = 0; ii < Products.length; ii++) {
            const prd = Products[ii]
            lst.push(prd)
        }
        return lst
    }
    for (let ii = 0; ii < Products.length; ii++) {
        const prd = Products[ii]
        if (prdGroupId != prd.PrgId) continue
        lst.push(prd)
    }
    return lst
}
function getSubProducts(productId, lst) {
    for (let ii = 0; ii < SubProducts.length; ii++) {
        const sprd = SubProducts[ii]
        if (0 != productId && productId != sprd.ProdId) continue
        lst.push(sprd)
    }
    return lst
}