
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
    let SelectRegion = `Wählen Sie Region`
    let SelectMarketsegments = `Wählen Sie ${Marketsegments}`
    let ProductGroups = `Produktegruppen`
    let Product = `Produkt`
    let Submarkets = `Anspruchsgruppen`
    let ContactPerson = `Ansprechsperson`
    let Weighting = `Gewichtung`
    let Criteria = `Kriterien`
    let Valuation = `Bewertung`
    let Productstrategy = `Produktstrategie`
    let Active = `Aktiv`
    let Sub_market = `Teilmarkt`
    let TxtPr0ject = `Projekt`
    let NavMarkt = `Markt Marktsegmentstrategie`
    let NavTeilmarkt = `Teilmarkt / Produktstrategie`
    let NavMass = `Massnahmenplan`
    let NavRMap = `Roadmap`
    let NavTBoard = `Team Board`
    let tEdt = `Bearbeiten`
    let TxtEdtRegion = `Region ${tEdt}`
    if ('en' === lang) {
        PleaseSelect = `Ple@se s3lect`
        Filter = `F1lt3r`
        Reset = `Reset`
        AddFilter = `+ f1lt3r`
        Marketsegments = `M@rket s3gments`
        FilterBy = `Filt3r by`
        SelectAll = `Sel3ct @ll`
        SelectLand = `S3lect L@nd`
        SelectRegion = `S3lect Region`
        SelectMarketsegments = `Sel3ct ${Marketsegments}`
        ProductGroups = `Pr0duct gr0ups`
        Product = `Pr0duct`
        Submarkets = `St@keh0lder gr0ups`
        ContactPerson = `C0nt@ct P3rson`
        And = `@nd`; Or = `Or`
        Weighting = `Weighting`
        Criteria = `Criteria`
        Valuation = `Valu@tion`
        Active = `Activ3`
        Productstrategy = `Pr0duct Str@tegy`
        Sub_market = `Sub-m@rket`
        TxtPr0ject = `Pr0j3ct`
        NavMarkt = `Market segment strategy`
        NavTeilmarkt = `Sub-market/Product Strategy`
        NavMass = `Action plan`
        NavMarkt = `M4rk3t s3gm3nt str@t3gy`; NavTBoard = `T3@m B04rd` /*dnb_dev */
        NavTeilmarkt = `$_b-m4rk3t/Pr0d-ct Str4t3gy`                   /*dnb_dev */
        NavMass = `@ct10n pl4n`; NavRMap = `Ro@dm4p`                   /*dnb_dev */
        tEdt = `Edit`
        TxtEdtRegion = `${tEdt} Region`
    }
    return {
        PleaseSelect,
        Filter, Reset, AddFilter, FilterBy, And, Or,
        Land: `Land`,
        Region: `Region`, TxtEdtRegion,
        Marketsegments, Sub_market,
        SelectAll, SelectLand, SelectMarketsegments, SelectRegion,
        ProductGroups, Product,
        Submarkets, ContactPerson,
        Weighting, Criteria, Valuation,
        Active, Productstrategy,
        TxtPr0ject,
        NavMarkt, NavTeilmarkt, NavMass, NavRMap, NavTBoard,
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
            case 1: jData = localStorage.getItem("Lands");
                break;
            case 2: jData = localStorage.getItem("Regions");
                break;
            case 3: jData = localStorage.getItem("Markets");
                break;
            case 4: jData = localStorage.getItem("Submarkets");
                break;
            case 6:     // Index Page
                jData = localStorage.getItem("IndexPage");
                break;
            case 7:     // Product group
                jData = localStorage.getItem("PrdGroups");
            case 8: jData = localStorage.getItem("Products");
                break;
        }
        switch (type) {
            case 1:     // Lands
            case 2:     // Regions
            case 3:     // Markets
            case 4:     // Submarkets
            case 7:     // Product groups
            case 8:     // Products
                if (!jData) return []
                break;
            case 6:     // Index Page
                jData = parseInt(jData)
                if (isNaN(jData)) jData = 0;
                return jData;
        }
        return JSON.parse(jData)
    } else {
        switch (type) {
            case 1:     // Lands
            case 2:     // Regions
            case 3:     // Markets
            case 4:     // Submarkets
            case 7:     // Product group
            case 8:     // Products
                return []
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
            case 6:     // index page
                jData = localStorage.getItem("IndexPage");
                if (jData) localStorage.removeItem("IndexPage");
                localStorage.setItem("IndexPage", oData)
                return;
            case 7:     // Product group
                jData = localStorage.getItem("PrdGroups");
                if (jData) localStorage.removeItem("PrdGroups");
                if (isRemove) return;
                localStorage.setItem("PrdGroups", JSON.stringify(oData))
            case 8:     // Products
                jData = localStorage.getItem("Products");
                if (jData) localStorage.removeItem("Products");
                if (isRemove) return;
                localStorage.setItem("Products", JSON.stringify(oData))
        }
    }
}
export const isDragDrop = (oIds, nIds) => {
    if (oIds.length != nIds.length) return false;
    if (nIds.length < 2) return false;
    const cOids = [...oIds]
    const cNids = [...nIds]
    cOids.sort((a, b) => a - b)
    cNids.sort((a, b) => a - b)
    if (cOids.join('') != cNids.join('')) return false;
    return true;
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
export const MxSortable = {
    methods: {
        updateAsort(type, newLst, oldLst) {
            const oldIds = oldLst.map(l => l.Id)
            const newIds = newLst.map(l => l.Id)
            if (isDragDrop(oldIds, newIds)) {
                this.$store.dispatch('updateAsort', [type, oldIds, newIds]).then(items => {
                    switch (type) {
                        case 1: setAsort.call(this.Lands, items)
                            return;
                        case 2: setAsort.call(this.Regions, items)
                            return;
                        case 3: setAsort.call(this.Markets, items)
                            return;
                        case 5: setAsort.call(this.ProductGroups, items)
                            return;
                        default: return;
                    }
                })
                function setAsort(items) {
                    for (let ll = 0, itm, nItm; ll < this.length; ll++) {
                        itm = this[ll]
                        nItm = items.find(ld => ld.Id == itm.Id)
                        itm.ASort = nItm.ASort
                    }
                }
            }
        },
    }
}
// export const newIntId = () => {
//     let s = new Date(2024, 6, 19, 8, 20, 0)        // 7/19/2024 08:20
//     s = Date.now() - s.getTime()
//     return Math.floor(s / 1000)     // every 1 second
// }