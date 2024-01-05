
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

function getCountItem() {
    const headHeight = 120
    const rowHeight = 24

    const maxHeight = window.outerHeight / 2
    // headHeight + x * rowHeight = maxHeight
    let x = maxHeight - headHeight
    x = x / rowHeight
    return Math.ceil(x)
}

//ex: loadHTML('#grp-templates', `https://github.com/front-end-2021/demo/blob/main/lazyload/template.html`)     // blocked by CORS on github page
function loadHTML(selector, path) {
    fetch(path).then(response => response.text())
        .then(text => document.querySelector(selector).innerHTML = text);
}