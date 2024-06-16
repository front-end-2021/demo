export const getRandomInt = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}
export const deepCopy = (item) => { return JSON.parse(JSON.stringify(item)) }
export const getTxtBy = (lang) => {
    let PleaseSelect = `Bitte auswählen`
    let Filter = `Filtern`
    let Reset = `Zurücksetzen`
    let AddFilter = `Filter hinzufügen`
    let Marketsegments = `Marktsegmente`
    if ('en' === lang) {
        PleaseSelect = `Please select`
        Filter = `Filter`
        Reset = `Reset`
        AddFilter = `Add filter`
        Marketsegments = `Market segments`
    }
    return {
        PleaseSelect,
        Filter,
        Reset,
        AddFilter,
        Land: `Land`,
        Region: `Region`,
        Marketsegments,
    }
}
export const FTypeId = {
    SelectAll: 0,
    ProductGroups: -1,
    Product: -2,
    Subproduct: -3,
    StakeholderGroups: -4,
    ContactPerson: -5,
    ContactSubPerson: -6,
    CustomerJourneyGroup: -7,
    CustomerJourney: -8,
    CustomerSubJourney: -9,
    SelectMarketSegments: -10,
    SelectStakeholderGroups: -11,
    PleaseSelect: -12,
    AllStatus: -13,
    AdvertisingMeterial: -14,
    Advertiser: -15,
    SuperiorThemes: -16,
    Themes: -17,
    SelectMasterMaingoals: -18,
    SelectMasterSubgoals: -19,
    ShowAll: -20,
    ShowOnlyHidden: -21,
    SelectLand_Region: -22,
    LastStatus: -23,
    Land_Region: -24,
    MarketSegments: -25
}
export const CriterialType = [
    'Please select',
    `Land/Region`,
    `Product groups/Product`,
    `Stakeholder groups/Contact Person`,
    `Customer Journey Group`,
    `Market segments/Stakeholder groups`,
    `Task`,
    `User`,
    `Status`,
    `Objective category`,
    `Measure category`,
    `Instruments`,
    `Advertising material/Advertiser`,
    `Superior objectives and measures`,
    `Master goals`,
    `Masterbudget`,
    `Fibu/Cost center`,
    `Department/Field`,
    `Subject/thema`,
    `Supplier`,
    `Hidden elements`,
]
