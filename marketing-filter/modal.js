const Operands = [
    { Id: 1, Name: 'And' }, { Id: 2, Name: 'Or' }
]
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
    { Id: -13, Name: `All Status` },
    { Id: -14, Name: `Advertising meterial` },
    { Id: -15, Name: `Advertiser` },
    { Id: -16, Name: `Superior themes` },
    { Id: -17, Name: `Themes` },
    { Id: -18, Name: `Select master maingoals` },
    { Id: -19, Name: `Select master subgoals` },
]
class Criterial {
    constructor(operand, type, ids) {
        this.Operand = typeof operand == 'number' ? operand : 0
        this.Type = typeof type == 'number' ? type : lType[0].Id
        this.Ids = Array.isArray(ids) ? ids : []
    }
}
class mkFilter {
    #Blocks = [];       // [{Operand, Type, Ids}]
    #Controls = [];   // [{Operand, Type, Ids}]
    constructor(container, criterials) {
        for (let ii = 0; ii < criterials.length; ii++) {
            this.#Blocks.push(criterials[ii])
        }
        this.Container = container
        const $lstCrite = this.Container.find('.list-criterial')
        for (let ii = 0; ii < this.#Blocks.length; ii++) {
            this.renderRow(ii, $lstCrite)
        }
    }
    get LandIds() {
        const lstTypeLandRegion = this.#Blocks.filter(x => 1 == x.Type)
        let ids = []
        for (let ii = 0; ii < lstTypeLandRegion.length; ii++) {
            const criterial = lstTypeLandRegion[ii]
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

        return []
    }
    addFilter(type) {
        type = typeof type == 'number' ? type : 0
        const isNewBlk = isNewBlock.call(this)
        let oprnd = isNewBlk ? Operands[1].Id : Operands[0].Id
        const criter = new Criterial(oprnd, type, getInitIds(type))
        this.#Blocks.push(criter)

        const ii = this.#Blocks.length - 1
        const $lstCrite = this.Container.find('.list-criterial')
        this.renderRow(ii, $lstCrite)

        function isNewBlock() {
            const lstRow = this.#Blocks
            if (lstRow.length < 1) return true
            if (type == 1) return true
            if (lstRow.length == 1) {
                if (type == 1) return true
                return false
            }
            return false
        }
    }
    renderRow(ii, $lstCrite) {
        const row = this.#Blocks[ii] // {Operand, Type, Ids}
        let tRow = `<div c-criterial="${ii}">
                    <input c-operand="${ii}" style="width: 96px;" />
                    <input c-type="${ii}" style="width: 240px;"/>
                </div>`
        $lstCrite.append(tRow)
        const $operand = $lstCrite.find(`[c-operand="${ii}"]`)
        const operandChange = (e) => {
            const tOprnd = e.sender.value()
            row.Operand = parseInt(tOprnd)
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

            //console.log('on change type', this, e.sender)
            this.destroyControl(ii, 'Ids')
            row.Ids = getInitIds(row.Type)

            const $tRow = e.sender.element.closest(`[c-criterial="${ii}"]`)
            const control = this.#Controls[ii]
            control.Ids = this.renderIdsDropdownList($tRow, ii)
            this.renderBtnRemove($tRow, ii)
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
            cIds = this.renderIdsDropdownList($tRow, ii)
        }
        this.#Controls.push({
            Operand: $operand, Type: $type, Ids: cIds
        })
        this.renderBtnRemove($tRow, ii)
    }
    renderIdsDropdownList($tRow, ii) {
        const crite = this.#Blocks[ii] // {Operand, Type, Ids}
        const cIds = []
        if (!Array.isArray(crite.Ids)) return cIds
        let tInput = ``
        for (let jj = 0; jj < crite.Ids.length; jj++) {
            tInput = `<input class="fcsub-${jj}" c-index="${jj}" style="width: 240px;" />`
            $tRow.append(tInput)
        }

        for (let jj = 0; jj < crite.Ids.length; jj++) {
            const _id = crite.Ids[jj]
            const $input = $tRow.find(`[c-index="${jj}"]`)
            const idChange = (e) => {
                let id = e.sender.value()
                id = parseInt(id)
                crite.Ids[jj] = id
                initCtrlChildren.call(this)
                updateSourceNext.call(this)

                function updateSourceNext() {
                    switch (crite.Type) {
                        case 1:     // Land/Region
                            if (0 < jj) return
                            const control = this.findLowestControl(ii, 5)
                            if(!control) return
                            
                            const lst = [lType[10], lType[0]]
                            const markets = getMarkets(id, lst)
                            const ctrlMarket = control.Ids[0].data("kendoDropDownList")
                            ctrlMarket.setDataSource(markets)
                            ctrlMarket.value(-10)
                            return
                    }
                }
                function initCtrlChildren() {
                    if (crite.Ids.length - 1 <= jj) return

                    const initIds = getInitIds(crite.Type)
                    for (let kk = jj + 1; kk < crite.Ids.length; kk++) {
                        const nxtInitId = initIds[kk]
                        crite.Ids[kk] = nxtInitId
                        const nextCtrl = cIds[kk]
                        if (!nextCtrl) continue

                        const nxtDrp = nextCtrl.data("kendoDropDownList")
                        nxtDrp.value(nxtInitId)
                        nxtDrp.setDataSource(this.getSourceIds(ii, kk))
                        nxtDrp.refresh()
                    }
                }
            }
            $input.kendoDropDownList({
                dataTextField: "Name",
                dataValueField: "Id",
                dataSource: this.getSourceIds(ii, jj),
                value: _id,
                change: idChange
            })
            cIds.push($input)
        }
        return cIds
    }
    renderBtnRemove($tRow, ii) {
        const clssBtnDel = `btn-del-crite`
        let btnDeleteii = $tRow.find(`.${clssBtnDel}-${ii}`)
        if (btnDeleteii.length) {
            btnDeleteii.off('click');
            btnDeleteii.remove()
        }
        if (ii < 1) return
        btnDeleteii = `<button class="btn btn-primary rounded-circle bi bi-trash-fill ${clssBtnDel}-${ii} ${clssBtnDel}"
            type="button"></button>`
        $tRow.append(btnDeleteii)

        const onDelRow = (e) => {
            const btn = e.target
            const row = btn.closest(`[c-criterial]`)
            this.destroyControl(ii, 'All')
            this.#Blocks.splice(ii, 1)
            row.remove()
        }
        btnDeleteii = $tRow.find(`.${clssBtnDel}-${ii}`)
        btnDeleteii.on('click', onDelRow)
    }
    destroyControl(ii, type) {
        const control = this.#Controls[ii]
        const ctlIds = control.Ids
        switch (type) {
            case 'Ids':
                destroyIds()
                break;
            case 'All':
                destroyIds()
                destroyType()
                destroyOperand()
                break;
        }

        function destroyOperand() {
            const $oprnd = control.Operand
            $oprnd.data("kendoDropDownList").destroy()
            $oprnd.closest(`.k-dropdownlist`).remove()
        }
        function destroyType() {
            const $type = control.Type
            $type.data("kendoDropDownList").destroy()
            $type.closest(`.k-dropdownlist`).remove()
        }
        function destroyIds() {
            for (let kk = ctlIds.length - 1; -1 < kk; kk--) {
                const $cId = ctlIds[kk]
                $cId.data("kendoDropDownList").destroy()
                $cId.closest(`.k-dropdownlist.fcsub-${kk}`).remove()
                ctlIds.splice(kk, 1)
            }
        }
    }
    getSourceIds(ii, index) {
        const criter = this.#Blocks[ii]
        let lst
        switch (criter.Type) {
            case 1: // Land/Region
                lst = [lType[0]]
                if (index == 0) {
                    for (let ii = 0; ii < Lands.length; ii++) {
                        lst.push(Lands[ii])
                    }
                    return lst
                }
                const landId = criter.Ids[0]
                return getRegions.call(Regions, landId, lst)
            case 2: // Product groups/Product
                switch (index) {
                    case 0:     // Product group
                        lst = [lType[1]]
                        for (let ii = 0; ii < ProductGroups.length; ii++) {
                            lst.push(ProductGroups[ii])
                        }
                        return lst
                    case 1:     // product
                        const prdGrpId = criter.Ids[index - 1]
                        lst = [lType[2]]
                        return getProducts.call(Products, prdGrpId, lst)
                    case 2:     // sub product
                        const prdId = criter.Ids[index - 1]
                        lst = [lType[3]]
                        return getSubProducts.call(SubProducts, prdId, lst)
                }
                return []

            case 5: // Market segments/Stakeholder groups
                if (index == 0) {
                    lst = [lType[10], lType[0]]
                    const landId = closestLandId.call(this)
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

        function closestLandId() {
            for (let jj = ii - 1; -1 < jj; jj--) {
                const prevCrite = this.#Blocks[jj]
                if (1 == prevCrite.Type) {
                    return prevCrite.Ids[0]
                }
            }
            return -1
        }
    }
    findLowestControl(ii, type) {
        for (let jj = ii + 1; jj < this.#Blocks.length; jj++) {
            const nxtCrite = this.#Blocks[jj]
            if (nxtCrite.Type === type) {
                return this.#Controls[jj]
            }
        }
        return null
    }
}

function getInitIds(type) {
    switch (type) {
        case 1: return [0, 0]           // Land/Region
        case 2: return [-1, -2, -3]     //Product groups/Product
        case 3: return [-4, -5, -6]     // Stakeholder groups/Contact Person
        case 4: return [-7, -8, -9]     // Customer Journey Group
        case 5: return [-10, -11]       // Market segments/Stakeholder groups
        case 6:                         // Task
        case 7:                         // User
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
    }
}
function getMarkets(landId, lst) {
    if (landId < 0) return lst
    for (let ii = 0; ii < MarketSegments.length; ii++) {
        const mrk = MarketSegments[ii]
        if (landId == 0 || mrk.LandIds.includes(landId)) {
            lst.push(mrk)
        }
    }
    return lst
}
function getRegions(landId, lst) {
    const Regions = this
    if (landId == 0) {
        for (let ii = 0; ii < Regions.length; ii++) {
            lst.push(Regions[ii])
        }
        return lst
    }
    for (let ii = 0; ii < Regions.length; ii++) {
        const regn = Regions[ii]
        if (landId != regn.LandId) continue
        lst.push(regn)
    }
    return lst
}
function getProducts(prdGroupId, lst) {
    const Products = this
    for (let ii = 0; ii < Products.length; ii++) {
        const prd = Products[ii]
        if (0 != prdGroupId && prdGroupId != prd.PrgId) continue
        lst.push(prd)
    }
    return lst
}
function getSubProducts(productId, lst) {
    const SubProducts = this
    for (let ii = 0; ii < SubProducts.length; ii++) {
        const sprd = SubProducts[ii]
        if (0 != productId && productId != sprd.ProdId) continue
        lst.push(sprd)
    }
    return lst
}