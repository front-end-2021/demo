export function getLsTaskType(SnfId) {
    return new Promise((resolve) => {
        let ls = []
        ls.push({ Id: 1, Name: 'Backlog item', Icon: 'bi bi-diagram-2-fill' })
        ls.push({ Id: 2, Name: 'Implement', Icon: 'bi bi-bounding-box' })
        ls.push({ Id: 3, Name: 'Improvement', Icon: 'bi bi-bounding-box-circles' })
        ls.push({ Id: 4, Name: 'Bug', Icon: 'bi bi-bug-fill' })
        ls.push({ Id: 5, Name: 'Main goal', Icon: 'msic-Ellipse' })
        ls.push({ Id: 6, Name: 'Sub goal', Icon: 'msic-Rectangle-1' })
        ls.push({ Id: 7, Name: 'Action', Icon: 'msic-Rectangle-2' })
        ls.push({ Id: 8, Name: 'Epic', Icon: 'msic-Epic' })
        ls.push({ Id: 9, Name: 'Feature', Icon: 'msic-Feature' })
        ls.push({ Id: 10, Name: 'User Story', Icon: 'msic-User-Story' })
        ls.push({ Id: 11, Name: 'Task', Icon: 'msic-Rectangle-3' })
        ls.push({ Id: 12, Name: 'Initiative', Icon: 'msic-Initiative' })
        ls.push({ Id: 13, Name: 'Strategische Ziele', Icon: 'msic-Rectangle-4' })
        ls.push({ Id: 14, Name: 'Aktionen', Icon: 'msic-Rectangle-3' })
        ls.push({ Id: 15, Name: 'Thema', Icon: 'msic-Thema' })
        ls.push({ Id: 16, Name: 'Organisation', Icon: 'msic-Organisation' })
        resolve(ls);
    })
}
export function getUsers(SnfId) {
    return new Promise((resolve) => {
        let ls = []
        ls.push({ Id: `${SnfId.generate()}`, Name: 'Guest 001' })
        ls.push({ Id: `${SnfId.generate()}`, Name: 'Elon Musk' })
        ls.push({ Id: `${SnfId.generate()}`, Name: 'Bill gate' })
        ls.push({ Id: `${SnfId.generate()}`, Name: 'Larry Page' })
        ls.push({ Id: `${SnfId.generate()}`, Name: 'Mark Zukerbeg' })
        ls.push({ Id: `${SnfId.generate()}`, Name: 'Warrent Buffet' })
        resolve(ls);
    })
}
function getRandomInt(min, max) {
    min = Math.ceil(min); max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function getRandId(ids) {
    if (!ids.length) return null
    return ids[getRandomInt(0, ids.length)]
}
export function listLandToNode(SnfId) {
    return new Promise((resolve) => {
        let lands = []
        for (let ii = 1; ii <= 3; ii++) lands.push({ Id: `${SnfId.generate()}`, Name: `Land ${ii}` })
        let landIds = lands.map(r => r.Id)
        let regions = []
        for (let ii = 1; ii <= 6; ii++)
            regions.push({ Id: `${SnfId.generate()}`, Name: `Region ${ii}`, LandId: getRandId(landIds) })
        let regionIds = regions.map(r => r.Id)
        let markets = []
        for (let ii = 1; ii <= 15; ii++)
            markets.push({ Id: `${SnfId.generate()}`, Name: `Market ${ii}`, RegionId: getRandId(regionIds) })
        let prdGroups = []
        for (let ii = 1; ii <= 6; ii++)
            prdGroups.push({ Id: `${SnfId.generate()}`, Name: `Product Group ${ii}`, RegionId: getRandId(regionIds) })
        let products = []
        let prdGroupIds = prdGroups.map(r => r.Id)
        for (let ii = 1; ii <= 6; ii++)
            products.push({ Id: `${SnfId.generate()}`, Name: `Product ${ii}`, ProductGroupId: getRandId(prdGroupIds) })
        let submarkets = []
        for (let ii = 1; ii <= 20; ii++)
            submarkets.push({ Id: `${SnfId.generate()}`, Name: `Submarket ${ii}`, MarketId: getRandId(markets.map(m => m.Id)) })
        let nodes = []
        let types = [1, 2, 3, 4, 5, 6, 8, 12, 15, 16]
        
        for (let ii = 1; ii < 101; ii++) {
            let id = `${SnfId.generate()}`
            let index = ii < 10 ? `00${ii}` : (ii < 100 ? `0${ii}` : ii)
            let parent = null
            if (1 < ii && ii < 5) { parent = nodes[0] }
            let regionId = parent ? parent.RegionId : getRandId(regionIds)
            let asignRid = getRandId(regionIds.filter(rid => rid != regionId))
            let mkId = getRandId(markets.filter(m => m.RegionId == regionId).map(m => m.Id))
            let smkId = mkId ? getRandId(submarkets.filter(s => s.MarketId == mkId).map(s => s.Id)) : 0
            let pgrId = getRandId(prdGroups.filter(p => p.RegionId == regionId).map(p => p.Id))
            let prdId = pgrId ? getRandId(products.filter(p => p.ProductGroupId == pgrId).map(p => p.Id)) : 0
            nodes.push({
                Id: id, ParentId: parent?.Id,
                TypeId: getRandId(types),
                Name: `Node ${index}`,
                RegionId: regionId,
                ProductId: prdId,
                SubmarketId: smkId,
                SubmarketProductId: prdId && smkId ? `${smkId}-${prdId}` : '',
                RegionIds: new Set([asignRid]),
                UserIds: new Set(),
            })
        }
        resolve({ lands, regions, markets, prdGroups, products, submarkets, nodes });
    })
}