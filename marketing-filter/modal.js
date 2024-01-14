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
]
class Criterial {
    constructor(operand, type, ids) {
        this.Operand = typeof operand == 'number' ? operand : 0
        this.Type = typeof type == 'number' ? type : lType[0].Id
        this.Ids = Array.isArray(ids) ? ids : []
    }
}
const mFilter = {
    Blocks: [
        new Criterial(0, 1, [0, 0])
    ],
    Controls: [],   // [{Operand, Type, Ids}]
    $Container: null,
    init: function ($container) {
        this.$Container = $container
        const $lstCrite = $container.find('.list-criterial')
        for (let ii = 0; ii < this.Blocks.length; ii++) {
            this.renderRow(ii, $lstCrite)
        }
    },
    renderRow: function (ii, $lstCrite) {
        const row = this.Blocks[ii] // {Operand, Type, Ids}
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
            let drpOperand
            switch (row.Type) {
                case 1: // Land/Region
                    drpOperand = $operand.data('kendoDropDownList')
                    drpOperand.value(2)     // Or
                    row.Operand = 2
                    drpOperand.enable(false)
                    break;
                default:
                    drpOperand = $operand.data('kendoDropDownList')
                    drpOperand.value(1)     // And
                    row.Operand = 1
                    drpOperand.enable(true)
                    break;
            }
            console.log('on change type', this, e.sender)

            destroyControl.call(this, ii, 'Ids')
            row.Ids = getInitIds(row.Type)

            const $tRow = e.sender.element.closest(`[c-criterial="${ii}"]`)
            const control = this.Controls[ii]
            control.Ids = renderIdsDropdownList.call(this, $tRow, ii)
            renderBtnRemove.call(this, $tRow, ii)
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
            cIds = renderIdsDropdownList.call(this, $tRow, ii)
        }
        this.Controls.push({
            Operand: $operand, Type: $type, Ids: cIds
        })

        renderBtnRemove.call(this, $tRow, ii)
    },
    addFilter: function (type) {
        type = typeof type == 'number' ? type : 0
        const isNewBlk = isNewBlock.call(this)
        let oprnd = isNewBlk ? Operands[1].Id : Operands[0].Id
        const criter = new Criterial(oprnd, type, getInitIds(type))
        this.Blocks.push(criter)

        const ii = this.Blocks.length - 1
        const $lstCrite = this.$Container.find('.list-criterial')
        this.renderRow(ii, $lstCrite)


        function isNewBlock() {
            const lstRow = this.Blocks
            if (lstRow.length < 1) return true
            if (type == 1) return true
            if (lstRow.length == 1) {
                if (type == 1) return true
                return false
            }
            return false
        }
    },
    getLandIds: function(){
        const lstTypeLandRegion = this.Blocks.filter(x => 1 == x.Type)
        const allLandId = Lands.map(x => x.Id)
        let ids = []
        for(let ii = 0; ii < lstTypeLandRegion.length; ii++) {
            const criterial = lstTypeLandRegion[ii]
            const id = criterial.Ids[0]
            if(criterial.Operand < 1) {
                // Filter By
                ids.push(id)
                continue
            }
            if(criterial.Operand < 2) {
                // == 1 (And)
                if(id == 0) {
                    if(ids.includes(id)) continue
                    ids.push(id)
                    continue
                }
                if(0 < id) {
                    if(ids.includes(id)) {
                        ids = [id]    
                        continue
                    }
                    ids.splice(0)       // list empty
                    break
                }
                continue
            }
            // == 2 Or
            
        }
        return ids
    },

}
function renderIdsDropdownList($tRow, ii) {
    const crite = this.Blocks[ii] // {Operand, Type, Ids}
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
            initCtrlChildren()

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
                    nxtDrp.setDataSource(getSourceIds(crite, kk))
                    nxtDrp.refresh()
                }
            }
        }
        $input.kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "Id",
            dataSource: getSourceIds(crite, jj),
            value: _id,
            change: idChange
        })
        cIds.push($input)
    }
    return cIds
}
function renderBtnRemove($tRow, ii) {
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
        destroyControl.call(this, ii, 'All')
        row.remove()
    }
    btnDeleteii = $tRow.find(`.${clssBtnDel}-${ii}`)
    btnDeleteii.on('click', onDelRow)
}
function destroyControl(ii, type) {
    const control = this.Controls[ii]
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
function getInitIds(type) {
    switch (type) {
        case 1: // Land/Region
            return [0, 0]
        case 2:
            return [-1, -2, -3]
    }
}

function getSourceIds(criter, index) {
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
                case 0:
                    lst = [lType[1]]
                    for (let ii = 0; ii < ProductGroups.length; ii++) {
                        lst.push(ProductGroups[ii])
                    }
                    return lst
                case 1:
                    const prdGrpId = criter.Ids[index - 1]
                    lst = [lType[2]]
                    return getProducts.call(Products, prdGrpId, lst)
                case 2:
                    const prdId = criter.Ids[index - 1]
                    lst = [lType[3]]
                    return getSubProducts.call(SubProducts, prdId, lst)
            }


            return [-1, -2, -3]
    }
}
function* getCriterial(type, parentId) {
    switch (type) {
        case 1: // Land/Region
            yield getRegions.call(Regions, parentId, [])
        case 2: // Product groups/Product
            yield getProducts.call(Products, parentId, [])
    }
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