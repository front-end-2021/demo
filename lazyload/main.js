
window.addEventListener("load", (event) => {
    let blockIndex = glbApp.viewIndex
    while (blockIndex < 3) {
        renderGrpTable(blockIndex)
        blockIndex += 1
    }
    const footer = document.querySelector('footer')
    footer.innerText = `Test lazyload with ${glbApp.mains.length} rows`
});

function renderGrpTable(pos) {
    const countItem = getCountItem()
    const minI = countItem * pos + pos
    if (minI > glbApp.mains.length) return

    const grpTable = document.createElement('grp-table-view')
    grpTable.setAttribute('t-pos', pos)

    const contentView = document.querySelector(`.content-view`)
    contentView.appendChild(grpTable)
}

function hideTbodyContent(pos) {
    const grpTables = document.querySelectorAll(`[t-pos]`)
    if (pos > 1) {
        // hide items above current pos
        const currentV = grpTables[pos]
        let maxPos = pos - 1
        const prevV = grpTables[maxPos]

        if (currentV.offsetHeight < prevV.offsetHeight) {
            maxPos = pos - 2
        }
        for (let i = 0; i < maxPos; i++) {
            const grpTable = grpTables[i]
            const tHide = grpTable.getAttribute('t-hide')
            if (tHide != 'true') grpTable.setAttribute('t-hide', true)
        }
    }
    if (pos + 2 < grpTables.length) {
        // hide items under current pos
        for (let i = pos + 2; i < grpTables.length; i++) {
            const grpTable = grpTables[i]
            const tHide = grpTable.getAttribute('t-hide')
            if (tHide != 'true') grpTable.setAttribute('t-hide', true)
        }
    }
}
function getCountItem() {
    const headHeight = 120
    const rowHeight = 24

    const maxHeight = window.outerHeight / 2
    // headHeight + x * rowHeight = maxHeight
    let x = maxHeight - headHeight
    x = x / rowHeight
    return Math.ceil(x)
}

function getStrTds(object, fields) {
    //console.log(object)
    let strTd = ''
    fields.forEach(col => {
        const value = object[col]

        if (value != undefined && value != 'null') {
            if (col == 'Start') {
                strTd += `<td><input class="dte-start" type="date" value="${value}" /></td>`
            }
            else if (col == 'Note') {
                strTd += `<td><input type="text" value="${value}" /></td>`
            }
            else if (typeof value == 'boolean') {
                strTd += `<td><input class="cbx-done" type="checkbox" ${value ? 'checked' : ''}/></td>`
            }
            else strTd += `<td>${value}</td>`
        } else {
            if (col == 'Note') {
                strTd += `<td><input class="txt-note" type="text" /></td>`
            }
            else strTd += `<td></td>`
        }
    })
    return strTd
}

//ex: loadHTML('#grp-templates', `https://github.com/front-end-2021/demo/blob/main/lazyload/template.html`)     // blocked by CORS on github page
function loadHTML(selector, path) {
    fetch(path).then(response => response.text())
        .then(text => document.querySelector(selector).innerHTML = text);
}