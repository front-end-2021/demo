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
    let And = `And`
    let Or = `Or`
    let SelectAll = `Wählen Sie Alle`
    if ('en' === lang) {
        PleaseSelect = `Please select`
        Filter = `Filter`
        Reset = `Reset`
        AddFilter = `Add filter`
        Marketsegments = `Market segments`
        FilterBy = `Filter by`
        SelectAll = `Select all`
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
        SelectAll
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