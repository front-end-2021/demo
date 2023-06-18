
var glbApp = {
    mains: getDataMains(),
    getMains(pos) {
        const countItem = getCountItem()
        const minI = countItem * pos + pos
        if (minI > this.mains.length) return []
        const maxI = minI + countItem
        return this.mains.filter(x => minI <= x.Id && x.Id <= maxI)
    },
    viewIndex: 0,
    set currentIndex(pos) {
        const oldPos = this.viewIndex
        if (oldPos == pos) return

        const lenTblView = document.querySelectorAll(`[t-pos]`).length
        let isGenNewView = pos > 0 && lenTblView - 1 == pos

        if (isGenNewView) {
            const newI = lenTblView
            renderGrpTable(newI)
        }
        hideTbodyContent(pos)

        this.viewIndex = pos
    },
}

const options = {
    root: null,
    rootMargin: "0px",
    threshold: [1]
}
const callback = (entries) => {
    entries.forEach((entry) => {
        //  console.log(entry.target)
        //  console.log(entry.intersectionRatio)

        if (entry.intersectionRatio == 1) {
            const target = entry.target

            let pos = target.getAttribute('t-pos')
            pos = parseInt(pos)

            if (pos != glbApp.viewIndex) {
                glbApp.currentIndex = pos

                document.querySelectorAll(`[t-active]`).forEach(vActive => {
                    vActive.removeAttribute('t-active')
                })

                target.setAttribute('t-active', pos)
                target.removeAttribute('t-hide')

                const nextESibb = target.nextElementSibling
                if (nextESibb) nextESibb.removeAttribute('t-hide')

                const prevESibb = target.previousElementSibling
                if (prevESibb) prevESibb.removeAttribute('t-hide')
            }
        }
    });
}

let observer = new IntersectionObserver(callback, options)

const fields = ['Id', 'Name', 'IsDone', 'Responsibilities',
    'Regions', 'Index', 'Note', 'Start', 'End']
customElements.define(
    "grp-table-view",
    class extends HTMLElement {
        // Specify observed attributes so that attributeChangedCallback will work
        static get observedAttributes() {
            return ['t-active', 't-hide'];
        }
        constructor() {
            super();
            let template = document.querySelector(`#dnb-table-view`);
            let templateContent = template.content.cloneNode(true);

            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(document.importNode(templateContent, true));
        }

        // fires after the element has been attached to the DOM
        connectedCallback() {
            const shadowRoot = this.shadowRoot

            const _table = shadowRoot.querySelector('table')
            const _thead = _table.querySelector('thead')

            const pos = this.pos
            if (pos == glbApp.viewIndex) {
                document.querySelectorAll(`[t-active]`).forEach(vActive => {
                    vActive.removeAttribute('t-active')
                })
                this.setAttribute('t-active', pos)
            }

            const _tbody = this.getBodyElement(fields, pos)
            if (_tbody != undefined) {
                _table.appendChild(_tbody)
                if (pos != 0) {
                    _thead.style.visibility = 'hidden'
                    _table.style.marginTop = '-34px'
                }

                observer.observe(this);
            }
        }
        disconnectedCallback() {
            console.log('Custom square element removed from page.');
        }
        adoptedCallback() {
            console.log('Custom square element moved to new page.');
        }
        attributeChangedCallback(name, oldValue, newValue) {
            console.log('Custom square element attributes changed.', name, oldValue, newValue);
            const shadowRoot = this.shadowRoot
            switch (name) {
                case 't-hide':
                    const isNullToTrue = oldValue == null && newValue != null
                    if (isNullToTrue) {
                        const _table = shadowRoot.querySelector('table')
                        const _h = _table.offsetHeight
                        _table.style.height = `${_h}px`
                        const _tbody = _table.querySelector('tbody')
                        if (_tbody) _tbody.remove()
                    }

                    const isTrueToNull = oldValue != null && newValue == null
                    if (isTrueToNull) {
                        const _table = shadowRoot.querySelector('table')
                        const pos = this.pos
                        const _tbody = this.getBodyElement(fields, pos)
                        if (_tbody != undefined) {
                            _table.appendChild(_tbody)
                            _table.style.height = ''
                        }
                    }
                    break;
                case 't-active':

                    break;
            }
        }

        getBodyElement(fields, pos) {
            const rows = glbApp.getMains(pos)
            if (!rows.length) return
            const _tbody = document.createElement('tbody')

            rows.forEach(item => {
                const _tr = document.createElement('tr')
                _tr.innerHTML = getStrTds(item, fields)
                _tbody.appendChild(_tr)
            })
            return _tbody
        }

        // gathering data from element attributes
        get pos() {
            let pos = this.getAttribute('t-pos')
            return parseInt(pos)
        }
    }
);

function getStrTds(object, fields) {
    //console.log(object)
    let strTd = ''
    fields.forEach(col => {
        const value = object[col]

        if (value != undefined && value != 'null') {
            if (col == 'Start') {
                strTd += `<td><input type="date" value="${value}" /></td>`
            }
            else if (col == 'Note') {
                strTd += `<td><input type="text" value="${value}" /></td>`
            }
            else if (typeof value == 'boolean') {
                strTd += `<td><input type="checkbox" ${value ? 'checked' : ''}/></td>`
            }
            else strTd += `<td>${value}</td>`
        } else {
            if (col == 'Note') {
                strTd += `<td><input type="text" /></td>`
            }
            else strTd += `<td></td>`
        }
    })
    return strTd
}
function hideTbodyContent(pos) {
    const grpTables = document.querySelectorAll(`[t-pos]`)
    if (pos > 1) {
        for (let i = 0; i < pos - 1; i++) {
            const grpTable = grpTables[i]
            const tHide = grpTable.getAttribute('t-hide')
            if (tHide != 'true') grpTable.setAttribute('t-hide', true)
        }
    }
    if (pos + 2 < grpTables.length) {
        for (let i = pos + 2; i < grpTables.length; i++) {
            const grpTable = grpTables[i]
            const tHide = grpTable.getAttribute('t-hide')
            if (tHide != 'true') grpTable.setAttribute('t-hide', true)
        }
    }
}
function getCountItem() {
    const headHeight = 30
    const rowHeight = 24

    const maxHeight = window.outerHeight / 2
    // headHeight + x * rowHeight = maxHeight
    let x = maxHeight - headHeight
    x = x / rowHeight
    return Math.ceil(x)
}
