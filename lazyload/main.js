
window.addEventListener("load", (event) => {
    let blockIndex = glbApp.viewIndex
    while (blockIndex < 3) {
        renderGrpTable(blockIndex)
        blockIndex += 1
    }
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

//ex: loadHTML('#grp-templates', `https://github.com/front-end-2021/demo/blob/main/lazyload/template.html`)     // blocked by CORS
function loadHTML(selector, path) {
    fetch(path).then(response => response.text())
        .then(text => document.querySelector(selector).innerHTML = text);
}