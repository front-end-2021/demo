// list criterial type
const mType = [
    { Type: 0, Value: 'Please select' },
    { Type: 1, Value: `Land/Region` },
    { Type: 2, Value: `Product groups/Product` },
    { Type: 3, Value: `Stakeholder groups/Contact Person` },
    { Type: 4, Value: `Customer Journey Group` },
    { Type: 5, Value: `Market segments/Stakeholder groups` },
    { Type: 6, Value: `Task` },
    { Type: 7, Value: `User` },
    { Type: 8, Value: `Status` },
    { Type: 9, Value: `Objective category` },
    { Type: 10, Value: `Measure category` },
    { Type: 11, Value: `Instruments` },
    { Type: 12, Value: `Advertising material/Advertiser` },
    { Type: 13, Value: `Superior objectives and measures` },
    { Type: 14, Value: `Master goals` },
    { Type: 15, Value: `Department/Field` },
    { Type: 16, Value: `Subject/thema` },
    { Type: 17, Value: `Supplier` },
    { Type: 18, Value: `Hidden elements` },
]

// list dropdown type
const lType = [
    { Id: 0, Name: `Select all` }
]
const mFilter = {
    Blocks: [], // [{Operand, Type, Values}]


}
function* getCriterial(type, parentId) {
    switch (type) {
        case 1: // Land/Region
            yield getRegionIds(parentId)
        case 2: // Product groups/Product
            yield getProductIds(parentId)
    }
}
function getRegionIds(landId) {
    // (listLand || listRegion) = this

    return lType
}
function getProductIds(productGroupId){
    // (listProductGroupd || listProducts) = this

    return lType
}