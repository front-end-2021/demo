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
    Controls: [],
    $Container: null,
    init: function($container){
        this.$Container = $container

    },
    renderUi: function(ii){
        const row = this.Blocks[ii]

    },
    addFilter: function (type) {
        type = typeof type == 'number' ? type : 0
        const isNewBlk = isNewBlock.call(this)
        let oprnd = isNewBlk ? Operands[1].Id : Operands[0].Id
        const criter = new Criterial(oprnd, type, getInitIds(type))

        function isNewBlock() {
            const lstRow = this.Blocks
            if (lstRow.length < 1) return true
            if (type == 1) return true
            if (lstRow.length == 1) {
                if (type == 1) return true
                return false
            }

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
    if (landId < 1) {
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
        if (prdGroupId != prd.PrgId) continue
        lst.push(prd)
    }
    return lst
}
function getSubProducts(productId, lst){
    const SubProducts = this
    for (let ii = 0; ii < SubProducts.length; ii++) {
        const sprd = SubProducts[ii]
        if (productId != sprd.ProdId) continue
        lst.push(sprd)
    }
    return lst
}