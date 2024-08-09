
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
    let FilterBy = `Filtern by`
    let And = `Und`
    let Or = `Oder`
    let SelectAll = `Wählen Sie Alle`
    let SelectLand = `Wählen Sie Land`
    let SelectMarketsegments = `Wählen Sie ${Marketsegments}`
    let ProductGroups = `Produktegruppen`
    let Product = `Produkt`
    let Submarkets = `Anspruchsgruppen`
    let ContactPerson = `Ansprechsperson`
    let Weighting = `Gewichtung`
    let Criteria = `Criteria`
    let Valuation = `Bewertung`
    let Productstrategy = `Produktstrategie`
    let Active = `Aktiv`
    let Sub_market = `Teilmarkt`
    if ('en' === lang) {
        PleaseSelect = `Please select`
        Filter = `Filter`
        Reset = `Reset`
        AddFilter = `Add filter`
        Marketsegments = `Market segments`
        FilterBy = `Filter by`
        SelectAll = `Select all`
        SelectLand = `Select Land`
        SelectMarketsegments = `Select ${Marketsegments}`
        ProductGroups = `Product groups`
        Product = `Product`
        Submarkets = `Stakeholder groups`
        ContactPerson = `Contact Person`
        And = `And`
        Or = `Or`
        Weighting = `Weighting`
        Criteria = `Kriterien`
        Valuation = `Valuation`
        Active = `Active`
        Productstrategy = `Product Strategy`
        Sub_market = `Sub-market`
    }
    return {
        PleaseSelect,
        Filter,
        Reset,
        AddFilter,
        Land: `Land`,
        Region: `Region`,
        Marketsegments,
        FilterBy, And, Or,
        SelectAll,
        SelectLand,
        SelectMarketsegments,
        ProductGroups, Product,
        Submarkets, ContactPerson,
        Weighting, Criteria, Valuation,
        Active, Productstrategy,
        Sub_market
    }
}
export const includeHTML = (path) => {
    const items = document.body.getElementsByClassName("dnbimporthtml");
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
                        resolve(path, xhr.responseText)
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
const admin = {
    user: 'DaiNB'
}
const addHistoryState = (oEntry, isPush) => {
    const url = new URL(location);
    Object.keys(oEntry).forEach(tKey => {
        url.searchParams.set(tKey, oEntry[tKey]);
    })
    if (isPush) history.pushState(admin, "", url);
    else history.replaceState(admin, "", url);
}
const originHistory = () => {
    const url = new URL(location.origin);
    delete admin.action
    history.replaceState(admin, "", url);
}
export const getLastState = () => {
    const url = new URL(location.href);
    const oParams = url.searchParams

    const type = parseInt(oParams.get('type'))
    const id = parseInt(oParams.get('id'))

    return new Promise((resolve, reject) => {
        resolve({ type, id });
    })
}
export const setLastState = (type, id) => {
    switch (type) {
        case 1:     // Edit Land
            admin.action = 'Edit Land'
            break;
        case 2:     // Edit Region
            admin.action = 'Edit Region'
            break;
        case 3:     // Edit Market
            admin.action = 'Edit Market'
            break;
        case 4:     // Edit Submarket
            break;
    }
    switch (type) {
        case 1:     // Edit Land
        case 2:     // Edit Region
        case 3:     // Edit Market
            if (0 == id) setLocal(5)
            else setLocal(5, { type, id })
            return;
        case 4:     // Edit Submarket
            break;
    }
}
export const getLocal = (type) => {
    if (storageAvailable("localStorage")) {
        let jData
        switch (type) {
            case 1:     // Lands
                jData = localStorage.getItem("Lands");
                break;
            case 2:     // Regions
                jData = localStorage.getItem("Regions");
                break;
            case 3:     // Markets
                jData = localStorage.getItem("Markets");
                break;
            case 4:     // Submarkets
                jData = localStorage.getItem("Submarkets");
                break;
        }
        if (!jData) return []
        return JSON.parse(jData)
    } else {
        switch (type) {
            case 1:
            case 2:
            case 3:
            case 4: return []
            default: return
        }
    }
}
export const setLocal = (type, oData) => {
    const isRemove = Object.is(oData, null) || (typeof oData == 'undefined')
    if (storageAvailable("localStorage")) {
        let jData
        switch (type) {
            case 1:     // Lands
                jData = localStorage.getItem("Lands");
                if (jData) localStorage.removeItem("Lands");
                if (isRemove) return;
                localStorage.setItem("Lands", JSON.stringify(oData))
                return;
            case 2:     // Regions
                jData = localStorage.getItem("Regions");
                if (jData) localStorage.removeItem("Regions");
                if (isRemove) return;
                localStorage.setItem("Regions", JSON.stringify(oData))
                return;
            case 3:     // Markets
                jData = localStorage.getItem("Markets");
                if (jData) localStorage.removeItem("Markets");
                if (isRemove) return;
                localStorage.setItem("Markets", JSON.stringify(oData))
                return;
            case 4:     // Submarkets
                jData = localStorage.getItem("Submarkets");
                if (jData) localStorage.removeItem("Submarkets");
                if (isRemove) return;
                localStorage.setItem("Submarkets", JSON.stringify(oData))
                return;
            case 5:     // last state
                jData = localStorage.getItem("LastState");
                if (jData) localStorage.removeItem("LastState");
                if (isRemove) {
                    originHistory()
                    return;
                }
                localStorage.setItem("LastState", JSON.stringify(oData))
                addHistoryState(oData)
                return;
        }
    }
}

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
}
// export const newIntId = () => {
//     let s = new Date(2024, 6, 19, 8, 20, 0)        // 7/19/2024 08:20
//     s = Date.now() - s.getTime()
//     return Math.floor(s / 1000)     // every 1 second
// }