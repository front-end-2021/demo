class DFilter {
    Blocks = [];       // [{Operand, Type, Ids}]
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
}

const { useState, useEffect, useRef } = React
const ReactFilter = (props) => {
    const Container = useRef(null);
    const [blocks, setBlocks] = useState(props.dfilter.Blocks)
    const [Controls] = useState([])   // [{Operand, Type, Ids}]

    useEffect(() => {
        console.log('on use effect setup')
        const { dfilter } = props
        const $mFilter = $(Container.current)
        const $lstCrite = $mFilter.find('.list-criterial')
        for (let ii = 0; ii < dfilter.Blocks.length; ii++) {
            renderControl(ii, $lstCrite)
        }
        return () => {
            console.log('on use effect return')
            for (let ii = Controls.length - 1; -1 < ii; ii--) {
                const cotnrol = Controls[ii]
                destroyIds(cotnrol.Ids)
                destroyOperandType(cotnrol)
            }
            Controls.splice(0)
            function destroyOperandType(control) {
                let $ctr = control.Operand
                $ctr.data("kendoDropDownList").destroy()
                $ctr = control.Type
                $ctr.data("kendoDropDownList").destroy()
            }
            function destroyIds(ctlIds) {
                for (let kk = ctlIds.length - 1; -1 < kk; kk--) {
                    const $cId = ctlIds[kk]
                    $cId.data("kendoDropDownList").destroy()
                    ctlIds.splice(kk, 1)
                }
            }
        };
    }, [blocks]);

    const renderControl = (ii, $lstCrite) => {
        const Blocks = [...blocks]
        const row = Blocks[ii]          // {Operand, Type, Ids}
        const $operand = $lstCrite.find(`[c-operand="${ii}"]`)
        const operandChange = (e) => {
            const tOprnd = e.sender.value()
            row.Operand = parseInt(tOprnd)
            setBlocks(Blocks)
        }
        $operand.kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "Id",
            dataSource: ii > 0 ? Operands : [mFilterBy],
            enable: ii < 1 ? false : true,
            value: row.Operand,
            change: operandChange
        })
        const $type = $lstCrite.find(`[c-type="${ii}"]`)
        const typeChange = (e) => {
            const tType = e.sender.value()
            row.Type = parseInt(tType)
            const newIds = getInitIds(row.Type)
            if (newIds.length < row.Ids.length) {
                const copyLst = [...blocks]
                copyLst.splice(ii, 1)
                setBlocks(copyLst)
                setTimeout(() => {
                    row.Ids = newIds
                    setBlocks(Blocks)
                }, 333)
            } else {
                row.Ids = newIds
                setBlocks(Blocks)
            }
        }
        $type.kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "Id",
            dataSource: mType,
            value: row.Type,
            change: typeChange
        })
        const $tRow = $lstCrite.find(`[c-criterial="${ii}"]`)
        let cIds = []
        if (row.Ids.length) {
            cIds = renderIdsDropdownList($tRow, ii)
        }
        Controls.push({ Operand: $operand, Type: $type, Ids: cIds })

        function renderIdsDropdownList($tRow, ii) {
            const crite = Blocks[ii] // {Operand, Type, Ids}
            const cIds = []
            if (!Array.isArray(crite.Ids)) return cIds
            for (let jj = 0; jj < crite.Ids.length; jj++) {
                const _id = crite.Ids[jj]
                const $input = $tRow.find(`[c-index="${jj}"]`)
                const idChange = (e) => {
                    let id = e.sender.value()
                    id = parseInt(id)
                    crite.Ids[jj] = id
                    setBlocks(Blocks)
                }
                $input.kendoDropDownList({
                    dataTextField: "Name",
                    dataValueField: "Id",
                    dataSource: getSourceIds(ii, jj),
                    value: _id,
                    change: idChange
                })
                cIds.push($input)
            }
            return cIds
        }
        function getSourceIds(ii, index) {
            const criter = Blocks[ii]
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
    }
    const onDelRow = (ii) => {
        const { dfilter } = props
        dfilter.Blocks.splice(ii, 1)
        setBlocks(dfilter.Blocks.map(x => x))
    }
    const addFilter = () => {
        const { dfilter } = props
        const Blocks = dfilter.Blocks
        const type = 0
        const isNewBlk = isNewBlock()
        let oprnd = isNewBlk ? Operands[1].Id : Operands[0].Id
        const criter = new Criterial(oprnd, type, getInitIds(type))
        Blocks.push(criter)
        setBlocks(dfilter.Blocks.map(x => x))
        function isNewBlock() {
            const lstRow = Blocks
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
        const { onSearch } = props
        if (typeof onSearch == 'function') onSearch()
    }
    return (
        <section ref={Container} className="mb-3">
            <b className="ms-2">React</b>
            <div className="list-criterial pb-0">
                {blocks.map((row, ii) => {
                    const clssBtnDel = `btn btn-primary rounded-circle bi bi-trash-fill btn-del-crite-${ii} btn-del-crite`
                    return (<div c-criterial={ii} key={'react-df-row_' + ii}>
                        <input c-operand={ii} style={{ width: '96px' }} />
                        <input c-type={ii} style={{ width: '270px' }} />
                        {row.Ids.map((id, jj) => {
                            const cls = `fcsub-${jj}`
                            return <input className={cls} c-index={jj} style={{ width: '240px' }} key={'react-df-rids_' + jj} />
                        })}
                        {0 < ii ? <button className={clssBtnDel} type="button" onClick={() => onDelRow(ii)}></button> : null}
                    </div>)
                })}
            </div>
            <div className="list-button pt-0">
                <button type="button" className="btn btn-primary btn-sm me-2 btnSetFilter"
                    onClick={() => setFilter()}><i className="bi bi-search"></i> Filter</button>
                <button type="button" className="btn btn-primary btn-sm btnAddFilter"
                    onClick={() => addFilter()}><i className="bi bi-plus-circle"></i> Add</button>
            </div>
        </section>
    );
}

const mdFilter = new DFilter([new Criterial(0, 1, [0, 0])])
const rFlt = ReactDOM.createRoot(document.getElementById('react-filter'))
rFlt.render(<ReactFilter dfilter={mdFilter} />);