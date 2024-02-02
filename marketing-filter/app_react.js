class DFilter {
    Blocks = [];       // [{Operand, Type, Ids}]
    CountChange = 0;
    constructor(criterials) {
        for (let ii = 0; ii < criterials.length; ii++) {
            this.Blocks.push(criterials[ii])
        }
    }
    get LandIds() {
        const rwLandRegns = this.Blocks.filter(x => 1 == x.Type)
        if (!rwLandRegns.length) return Lands.map(x => x.Id)
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
        if (ids.includes(0)) return Lands.map(x => x.Id)
        return ids
    }
    get RegionIds() {
        const rwLandRegns = this.Blocks.filter(x => 1 == x.Type)
        if (!rwLandRegns.length) return Regions.map(x => x.Id)
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
        if (lstId.includes(0)) return Regions.map(x => x.Id)
        return lstId
    }
    get MarketIds() {
        const marketIds = []
        const blocks = this.Blocks
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
            return getMarketsIn(this.LandIds, []).map(x => x.Id)
        }
        if (marketIds.includes(0)) return getMarkets(0, []).map(x => x.Id)
        return marketIds
    }
    get SubmarketIds() {
        let subMrketIds = []
        const blocks = this.Blocks
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
            const marketIds = this.MarketIds
            return getSubmarket(marketIds, []).map(x => x.Id)
        }
        if (subMrketIds.includes(0)) {
            return getSubmarket([0], []).map(x => x.Id)
        }
        return subMrketIds
    }
    get ProductIds() {
        let productIds = []
        const blocks = this.Blocks
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
            const prdGrpIds = getProductGroups(this.RegionIds, []).map(x => x.Id)
            return getProductsIn(prdGrpIds, []).map(x => x.Id)
        }
        return productIds
    }
    get GoalIds() {
        const lst = []
        const goals = Goals.map(goal => {
            const subMrkPrdIds = goal.SubmarketProductId.split('-')
            return {
                Id: goal.Id,
                SubmarketId: parseInt(subMrkPrdIds[0]),
                ProductId: parseInt(subMrkPrdIds[1])
            }
        }
        )
        const subMrktIds = this.SubmarketIds
        for (let ii = 0; ii < goals.length; ii++) {
            const goal = goals[ii]
            if (subMrktIds.includes(goal.SubmarketId)) {
                lst.push(goal)
            }
        }
        const prdIds = this.ProductIds
        for (let ii = lst.length - 1; -1 < ii; ii--) {
            const goal = lst[ii]
            if (!prdIds.includes(goal.ProductId)) {
                lst.splice(ii, 1)
            }
        }
        return lst.map(x => x.Id)
    }
    get Criterials() {
        const lst = []
        for (let ii = 0; ii < this.Blocks.length; ii++) {
            const crite = this.Blocks[ii]
            lst.push(crite.copy())
        }
        return lst
    }
    toTxt(type) {
        type = typeof type != 'string' ? 'Data' : type
        switch (type) {
            case 'Data': return `[${this.Blocks.map(crite => crite.toTxt()).join(',')}]`
            case 'Operand': return `[${this.Blocks.map(crite => crite.Operand).join(',')}]`
            case 'Type': return `[${this.Blocks.map(crite => crite.Type).join(',')}]`
            case 'Ids': return `[${this.Blocks.map(crite => crite.Ids.join(',')).join(',')}]`
        }
    }
    onSearch() {
        console.log('D Filter searching')
        console.log('List Land Id', this.LandIds)
        console.log('List Region Id', this.RegionIds)
        console.log('List Market Id', this.MarketIds)
        console.log('List Submarket Id', this.SubmarketIds)
        console.log('List Product Id', this.ProductIds)
        console.log('List Goal Id', this.GoalIds)
    }
}

const { useState, useEffect } = React

const ReactFltRow = ({ ii, Blocks, onDelRow, cntchange }) => {
    const [cOperand, setOperand] = useState(Blocks[ii].Operand)
    const [cType, setCType] = useState(Blocks[ii].Type)
    const [cIds, setCIds] = useState(Blocks[ii].Ids)

    useEffect(() => {
        const row = Blocks[ii]
        const sWrap = document.querySelector(`[c-criterial="${ii}"]`)
        const $wrap = $(sWrap)
        renderUiIds()
        renOperandControl()
        renTypeControl()
        renderIdsDropdownList()
        return () => {
            for (let jj = cIds.length - 1; -1 < jj; jj--) {
                const $input = $wrap.find(`[c-index="${jj}"]`)
                $input.data("kendoDropDownList").destroy()
            }
            $wrap.find('.ccrite-grp-ids').empty();
        }
        function renderUiIds() {
            $wrap.find('.ccrite-grp-ids').empty();
            let ui = ''
            for (let jj = 0; jj < cIds.length; jj++) {
                ui += `<input class="fcsub-${jj}" c-index="${jj}" style="width: 240px" />`
            }
            $wrap.find('.ccrite-grp-ids').append(ui)
        }
        function renOperandControl() {
            const $operand = $wrap.find(`[c-operand="${ii}"]`)
            const operandChange = (e) => {
                const tOprnd = e.sender.value()
                row.Operand = parseInt(tOprnd)
                setOperand(row.Operand)
            }
            $operand.kendoDropDownList({
                dataTextField: "Name",
                dataValueField: "Id",
                dataSource: ii > 0 ? Operands : [mFilterBy],
                enable: ii < 1 ? false : true,
                value: cOperand,
                change: operandChange
            })
        }
        function renTypeControl() {
            const $type = $wrap.find(`[c-type="${ii}"]`)
            const typeChange = (e) => {
                const tType = e.sender.value()
                row.Type = parseInt(tType)
                row.Ids = getInitIds(row.Type)
                setCType(row.Type)
                setCIds([...row.Ids])
            }
            $type.kendoDropDownList({
                dataTextField: "Name",
                dataValueField: "Id",
                dataSource: mType,
                value: cType,
                change: typeChange
            })
        }
        function renderIdsDropdownList() {
            for (let jj = 0; jj < row.Ids.length; jj++) {
                const _id = row.Ids[jj]
                const $input = $wrap.find(`[c-index="${jj}"]`)
                const idChange = (e) => {
                    let id = e.sender.value()
                    id = parseInt(id)
                    row.Ids[jj] = id
                    setCIds([...row.Ids])
                }
                $input.kendoDropDownList({
                    dataTextField: "Name",
                    dataValueField: "Id",
                    dataSource: getSourceIds(jj),
                    value: _id,
                    change: idChange
                })
            }
        }
        function getSourceIds(index) {
            const criter = row
            let lst = []
            switch (criter.Type) {
                case 1: // Land/Region
                    lst = [lType[0]]
                    if (0 == index) {
                        Lands.forEach(land => lst.push(land))
                        return lst
                    }
                    const landId = criter.Ids[0]
                    return getRegions(landId, lst)
                case 2: // Product groups/Product
                    switch (index) {
                        case 0:     // Product group
                            lst = [lType[1]]
                            return getPrdGroups(lst)
                        case 1:     // product
                            const pgId = criter.Ids[index - 1]
                            const lstPrdGrpId = pgId < 0 ? getPrdGroups([]).map(x => x.Id) : [pgId]
                            lst = [lType[2]]
                            return getProductsIn(lstPrdGrpId, lst)
                        case 2:     // sub product
                            const prdId = criter.Ids[index - 1]
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
                case 5: // Market segments/Stakeholder groups
                    if (index == 0) {
                        lst = [lType[10], lType[0]]
                        const landRegnId = closestIds(ii, 1)
                        const landId = landRegnId.length ? landRegnId[0] : -1
                        return getMarkets(landId, lst)
                    }
                    const marketId = criter.Ids[0]
                    lst = [lType[11]]
                    if (marketId < 0) return lst
                    for (let ii = 0; ii < StakeholderGroups.length; ii++) {
                        const stk = StakeholderGroups[ii]
                        if (0 < marketId && marketId != stk.MarketId) continue
                        lst.push(stk)
                    }
                    return lst
            }
            function getPrdGroups(lst) {
                const landRgnId = closestIds(ii, 1)
                const rgnIds = landRgnId.length > 1 ? [landRgnId[1]] : [0]
                return getProductGroups(rgnIds, lst)
            }
            function closestMarketIds() {
                for (let jj = ii - 1; -1 < jj; jj--) {
                    const prevCrite = Blocks[jj]
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
                for (let jj = ii - 1; -1 < jj; jj--) {
                    const crite = Blocks[jj]
                    if (crite.Type == type) return crite.Ids
                }
                return []
            }
        }
    }, [cOperand, cType, cIds, cntchange])

    const clssBtnDel = `btn btn-primary rounded-circle bi bi-trash-fill btn-del-crite-${ii} btn-del-crite`
    return (
        <div c-criterial={ii}>
            <input c-operand={ii} style={{ width: '96px' }} />
            <input c-type={ii} style={{ width: '270px' }} />
            <span className="ccrite-grp-ids"></span>
            {0 < ii ? <button className={clssBtnDel} type="button"
                onClick={() => onDelRow(ii)}></button> : null}
        </div>
    )
}
const ReactFilter = ({ dfilter, countchange }) => {
    const [blocks, setBlocks] = useState(dfilter.Blocks)

    const onDelRow = (ii) => {
        dfilter.Blocks.splice(ii, 1)
        setBlocks([...dfilter.Blocks])
    }
    const addFilter = () => {
        const type = 0
        const isNewBlk = isNewBlock()
        let oprnd = isNewBlk ? Operands[1].Id : Operands[0].Id
        const criter = new Criterial(oprnd, type, getInitIds(type))
        dfilter.Blocks.push(criter)
        setBlocks([...dfilter.Blocks])

        function isNewBlock() {
            const lstRow = dfilter.Blocks
            if (lstRow.length < 1) return true
            if (type == 1) return true
            if (lstRow.length == 1) {
                if (type == 1) return true
                return false
            }
            return false
        }
    }
    const setFilter = () => {
        dfilter.onSearch()
    }
    return (
        <section className="mb-3">
            <b className="ms-2">React</b>
            <div className="list-criterial pb-0">
                {blocks.map((row, ii) => <ReactFltRow key={'dnb-fcrite_' + ii}
                    cntchange={countchange}
                    ii={ii} Blocks={dfilter.Blocks} onDelRow={onDelRow} />)}
            </div>
            <div className="list-button pt-0">
                <button type="button" className="btn btn-primary btn-sm me-2 btnSetFilter"
                    onClick={() => setFilter()}><i className="bi bi-search"></i> Filter</button>
                <button type="button" className="btn btn-primary btn-sm btnAddFilter"
                    onClick={() => addFilter()}><i className="bi bi-plus-circle"></i> Add</button>
            </div>
        </section>
    )
}

const mdFilter = new DFilter([new Criterial(0, 1, [0, 0])])
const rFlt = ReactDOM.createRoot(document.getElementById('react-filter'))
rFlt.render(<ReactFilter dfilter={mdFilter} countchange={mdFilter.CountChange} />);