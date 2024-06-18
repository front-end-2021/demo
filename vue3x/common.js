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
export const includeHTML = (path) => {
    const items = document.getElementsByClassName("dnbimporthtml");
    path = path.trim()
    for (let i = 0; i < items.length; i++) {
        const elmnt = items[i];   /*search for elements with a certain atrribute:*/
        const file = elmnt.getAttribute("dnbpath");
        if (!file) continue
        if (file.trim() !== path) continue

        const xhr = new XMLHttpRequest(); /* Make an HTTP request using the attribute value as the file name: */
        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 0 || (200 <= xhr.status && xhr.status < 400)) {
                        // The request has been completed successfully
                        document.body.innerHTML += `\n ${xhr.responseText}`
                        resolve({ path, resText: xhr.responseText })
                    } else {
                        reject(xhr.status) // There has been an error with the request!
                    }
                    elmnt.removeAttribute("dnbpath"); /* Remove the attribute, and call xhr function once more: */
                }
            }
            xhr.open("GET", file, true);
            xhr.send();
        })
    }
}