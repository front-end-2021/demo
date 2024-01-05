const options = {
    root: null,
    rootMargin: "0px",
    threshold: [1]
}
const callback = (entries) => {
    entries.forEach((entry) => {

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

            const stl = document.querySelector(`style[stl-grp-vtable]`)
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(stl.textContent);
            shadowRoot.adoptedStyleSheets = [sheet];
        }

        // fires after the element has been attached to the DOM
        connectedCallback() {
            const shadowRoot = this.shadowRoot

            const _table = shadowRoot.querySelector('table')
            const pos = this.pos
            this.addDomHeader(_table, pos)
            
            if (pos == glbApp.viewIndex) {
                document.querySelectorAll(`[t-active]`).forEach(vActive => {
                    vActive.removeAttribute('t-active')
                })
                this.setAttribute('t-active', pos)
            }

            const _tbody = this.getBodyElement(fields, pos)
            if (_tbody) {
                _table.appendChild(_tbody)
                if (pos != 0) {
                    _table.style.marginTop = '-34px'
                }
                this.bindInputEvent()
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
            // console.log('Custom square element attributes changed.', name, oldValue, newValue);
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
                        const _thead = _table.querySelector('thead')
                        if (_thead) _thead.remove()
                        const _colGrp = _table.querySelector('colgroup')
                        if (_colGrp) _colGrp.remove()
                        return
                    }

                    const isTrueToNull = oldValue != null && newValue == null
                    if (isTrueToNull) {
                        const _table = shadowRoot.querySelector('table')
                        const pos = this.pos
                        this.addDomHeader(_table, pos)
                        const _tbody = this.getBodyElement(fields, pos)
                        if (_tbody) {
                            _table.appendChild(_tbody)
                            _table.style.height = ''
                            this.bindInputEvent()
                        }
                        return
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
                _tr.setAttribute('r-id', item.Id)
                _tr.innerHTML = getStrTds(item, fields)
                _tbody.appendChild(_tr)
            })
            return _tbody
        }
        bindInputEvent() {
            const shadowRoot = this.shadowRoot
            const _table = shadowRoot.querySelector('table')
            _table.querySelectorAll('.cbx-done').forEach(cbxDone => {
                cbxDone.addEventListener("change", (e) => {
                    const target = e.target
                    const _tr = target.closest(`[r-id]`)
                    const id = _tr.getAttribute('r-id')
                    const newIsDone = target.checked
                    glbApp.setMainDone(id, newIsDone)
                }, true)
            })
            _table.querySelectorAll('.dte-start').forEach(dteStart => {
                dteStart.addEventListener("change", (e) => {
                    const target = e.target
                    const _tr = target.closest(`[r-id]`)
                    const id = _tr.getAttribute('r-id')
                    //const newDate = new Date(target.value)
                    glbApp.setMainStartDate(id, target.value)
                }, true)
            })
            _table.querySelectorAll('.txt-note').forEach(txtNote => {
                txtNote.addEventListener("change", (e) => {
                    const target = e.target
                    const _tr = target.closest(`[r-id]`)
                    const id = _tr.getAttribute('r-id')
                    glbApp.setMainNote(id, target.value)
                }, true)
            })
        }
        // gathering data from element attributes
        addDomHeader(table, pos){
            const colGrp = document.createElement('colgroup')
            colGrp.innerHTML = `<col span="2">`
            table.appendChild(colGrp)

            const tHead = document.createElement('thead')
            if(0 < pos) {
                tHead.style.visibility = 'hidden'
            }
            tHead.innerHTML = `<tr>
            <th>Id</th><th>Name</th>
            <th>Finish</th>
            <th>Responsibilities</th>
            <th>Regions</th>
            <th>Index</th>
            <th>Note</th>
            <th>Start</th><th>End</th>
        </tr>`
            table.appendChild(tHead)
        }
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
