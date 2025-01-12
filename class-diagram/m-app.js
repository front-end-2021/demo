// #region import
import { createApp } from 'vue'
import { drawExtension, drawImplement } from './mcanvas.js'
import { ViewDiagram, MenuList } from './components/vw-diagram.js'
import { getListCls } from './repository.js'
import { setHeight, StructTypes, AccessInit } from './common.js'
// #endregion
Promise.all([
    includeHTML(`./components/vw-diagram.html`),
]).then((values) => {
    const app = createApp({
        name: `app-main`,
        components: {
            'view-diagram': ViewDiagram,
            'menu-list': MenuList,
        },
        data() {
            return {
                IndexPage: 0,
                MinX: 150, MaxX: 150 + 1754,
                MinY: 10, MaxY: 880,
                ListClass: getListCls(),
                DynamicVar: new Map(),
                //'PopMenu', 'FrameCode': {top,left,html,type,item}, DragElm (Dùng kéo các khung class)
                NewClassName: null,
                StructTypes: StructTypes,
                AccessInit: AccessInit,
                PLang: 1,
            }
        },
        computed: {
            CompPage() {
                switch (this.IndexPage) {
                    case 0: return 'view-diagram';
                    default: break;
                }
            },
            ViewCode() {
                const dmVar = this.DynamicVar
                if (dmVar.has('FrameCode')) {
                    let frmCode = dmVar.get('FrameCode')
                    if (1 == frmCode.type) return frmCode
                }
                return null
            },
            EditObject() {
                const dmVar = this.DynamicVar
                if (dmVar.has('FrameCode')) {
                    let frmCode = dmVar.get('FrameCode')
                    if (2 == frmCode.type) return frmCode
                }
                return null
            },
        },
        watch: {
            IndexPage(val) { setLocal(6, val) },
        },
        methods: {
            selectPage(index) { this.IndexPage = index },
            trackMouse(event) {
                let x = event.clientX;
                let y = event.clientY;
                const dmVar = this.DynamicVar
                if (dmVar.has('DragElm')) {
                    const dgElm = dmVar.get('DragElm')
                    const dItem = dgElm.Item
                    let left = x + dgElm.offX
                    let top = y + dgElm.offY

                    if ('cls-classname' == dItem.id) {
                        this.setTopLeft(dItem, left, top)
                        return
                    }

                    if (x - 20 < this.MinX) return;
                    if (y < this.MinY + 20) return;
                    if (this.MaxY + 3 < y + dItem.height) return

                    if (this.MaxX < x + dItem.width - 6) return;
                    if (dItem.left != left || dItem.top != top) {
                        this.setTopLeft(dItem, left, top)
                        this.drawLines(this.getPoints())
                    }
                }
                document.getElementById('dnb-app-log').innerText = `X: ${x}, Y: ${y}`
            },
            setTopLeft(dItem, left, top) {
                dItem.left = left
                dItem.top = top
            },
            onKeyUp(evt) {
                const dmVar = this.DynamicVar
                if (dmVar.has('DragElm')) {
                    const dgElm = dmVar.get('DragElm')
                    const itemEl = document.body.querySelector(`#dnb-vw-main #${dgElm.Item.id}`)
                    itemEl.style.zIndex = ''
                    itemEl.style.backgroundColor = ''
                    const dItem = dgElm.Item
                    if (isOverView.call(this, dItem.id, dItem.left, dItem.top, dItem.width, dItem.height)) {
                        this.setTopLeft(dItem, dgElm.Left, dgElm.Top)
                        this.drawLines(this.getPoints())
                    }
                }
                dmVar.delete('DragElm')

                function isOverView(id, x, y, w, h) {
                    const lstArea = areaBlocks.call(this, id)
                    for (let ii = 0; ii < lstArea.length; ii++) {
                        const [x0, y0, w0, h0] = lstArea[ii]
                        if (x + w < x0 - 30 || x0 + w0 < x - 30) continue
                        if (y + h < y0 - 30 || y0 + h0 < y - 30) continue
                        return true
                    }
                    return false
                }
                function areaBlocks(id) {
                    const lst = []
                    const lstCls = this.$root.ListClass
                    for (let ii = 0, item; ii < lstCls.length; ii++) {
                        item = lstCls[ii]
                        if (item.id === id) continue
                        let x = item.left
                        let y = item.top
                        let w = item.width
                        let h = item.height
                        lst.push([x, y, w, h])
                    }
                    return lst
                }
            },
            drawLines(points) {
                const c = document.getElementById(`dnb-mcanvas`);
                const ctx = c.getContext("2d");
                ctx.clearRect(0, 0, c.width, c.height);
                for (let ii = 0; ii < points.length; ii++) {
                    const [p0, p1] = points[ii]
                    if (p0[4].includes('class')) drawExtension.call(ctx, p0, p1, 8)
                    if (p0[4].includes('interface')) drawImplement.call(ctx, p0, p1, 6)
                }
            },
            getPoints() {
                const lstCls = this.$root.ListClass
                const points = []
                for (let ii = 0, item; ii < lstCls.length; ii++) {
                    item = lstCls[ii]
                    if (!item.toIds || !item.toIds.length) continue;
                    let cIds = item.toIds
                    let x0 = item.left + 1
                    let y0 = item.top
                    for (let jj = 0, Jtem; jj < lstCls.length; jj++) {
                        if (jj == ii) continue;
                        Jtem = lstCls[jj]
                        let iiT = cIds.indexOf(Jtem.id)
                        if (iiT < 0) continue
                        let w0 = item.width
                        let h0 = item.height
                        let x1 = Jtem.left
                        let y1 = Jtem.top
                        let w1 = Jtem.width
                        let h1 = Jtem.height
                        const cType = Jtem.type
                        points.push([[x0, y0, w0, h0, cType], [x1, y1, w1, h1]])
                        // points.push([[x0, y0, item.id, w0, h0, cType], [x1, y1, Jtem.id, w1, h1]])
                    }
                }
                return points;
            },
            preventKeyPress(e, codes) {
                if (e.which === 13) {
                    e.target.blur()
                    e.preventDefault()
                }
                if (codes.includes(e.which)) e.preventDefault()
            },
            getTxtAcModify(symb, isStr) {   // AccessModifiers
                if (typeof symb != 'string') return
                if (isStr) {
                    symb = symb.toLowerCase()
                    if (symb.includes('public')) return symb.replace('public', '+')
                    if (symb.includes('private')) return symb.replace('private', '-')
                    if (symb.includes('protected')) return symb.replace('protected', '#')
                    return
                }
                if (symb.includes('+')) return symb.replace('+', 'public')
                if (symb.includes('-')) return symb.replace('-', 'private')
                if (symb.includes('#')) return symb.replace('#', 'protected')
            },
            getTxtType(type) {
                if (typeof type != 'string') return
                const ii = this.PLang
                if (StructTypes[1][0] == type) return StructTypes[1][ii]
                if (type.includes('class')) return StructTypes[2][ii]
                if (type.includes('interface')) return StructTypes[0][ii]
            },
            changeTypeObject(val) {
                console.log('change type object ', val)
                //getTxtType(EditObject.item.type)
            },
            getReturnType(acs) {
                if (typeof acs != 'string') return false;
                if (acs.includes('get')) return true
                return false
            },
            equalHas(txt1, txt2) {
                let hash1 = CryptoJS.SHA256(txt1), hash2 = CryptoJS.SHA256(txt2)
                return hash1.toString(CryptoJS.enc.Hex) == hash2.toString(CryptoJS.enc.Hex)
            },
            pasteTxtArea(e) {
                setTimeout(() => {
                    let target = e.target
                    let txt = target.value
                    setHeight(target, txt)
                }, 111)
            },
            keyUpTxtArea(e) {
                let target = e.target
                let txt = target.value
                setHeight(target, txt)
            },
            onChange(e, type, ii) {
                const frmCode = this.DynamicVar.get('FrameCode')
                const target = e.target
                let mItem = frmCode.MItem || {}
                let fAcMd = mItem.FdAcM || new Map()
                let fName = mItem.FdName || new Map()
                let fType = mItem.FdType || new Map()
                let amKey = mItem.PrpAmKey || new Map()
                let amName = mItem.PrpAmName || new Map()
                let amType = mItem.PrpAmType || new Map()
                let ctCode = mItem.PrpAmCode || new Map()
                switch (type) {
                    case 'class name':
                        mItem.Name = target.textContent
                        break;
                    case 'field acmodify':
                        fAcMd.set(ii, target.textContent)
                        break;
                    case 'field name':
                        fName.set(ii, target.textContent)
                        break;
                    case 'field type':
                        fType.set(ii, target.textContent)
                        break;
                    case 'access modify key':
                        amKey.set(ii, target.textContent)
                        break;
                    case 'access modify name':
                        amName.set(ii, target.textContent)
                        break;
                    case 'access modify type':
                        amType.set(ii, target.textContent)
                        break;
                    case 'code context':
                        ctCode.set(ii, target.value)
                        setHeight(target, target.value)
                        break;
                    default: break;
                }
                if (!mItem.FdAcM) mItem.FdAcM = fAcMd
                if (!mItem.FdName) mItem.FdName = fName
                if (!mItem.FdType) mItem.FdType = fType
                if (!mItem.PrpAmKey) mItem.PrpAmKey = amKey
                if (!mItem.PrpAmName) mItem.PrpAmName = amName
                if (!mItem.PrpAmType) mItem.PrpAmType = amType
                if (!mItem.PrpAmCode) mItem.PrpAmCode = ctCode
                if (!frmCode.MItem) frmCode.MItem = mItem
                // console.log('on change ', type, target.textContent, e)
            },
            onCloseEdit() {
                this.DynamicVar.delete('FrameCode')
            },
            onSaveChange() {
                const frmCode = this.DynamicVar.get('FrameCode')
                const mItem = frmCode.MItem
                const item = frmCode.item
                if (!mItem) {
                    item.Fields = frmCode.iFields
                    addNewFields.call(this)
                    item.Properties = frmCode.iPropes
                    addNewPropes.call(this)
                    this.DynamicVar.delete('FrameCode')
                    return
                }
                let name = mItem.Name
                name = clearSpace(name, item.Name)
                let arrChange = []
                if (name != item.Name) {
                    item.Name = name
                    arrChange.push('Name')
                }
                const fAcMd = mItem.FdAcM
                for (const [ii, txt] of fAcMd) {
                    const field = frmCode.iFields[ii]
                    name = txt.trim()
                    name = name.toLowerCase()
                    name = this.getTxtAcModify(name, true)
                    if (field.AcModify != name) {
                        arrChange.push(`Field.AcModify ${field.AcModify}`)
                        field.AcModify = name
                    }
                }
                const fName = mItem.FdName
                for (const [ii, txt] of fName) {
                    const field = frmCode.iFields[ii]
                    name = clearSpace(txt, field.Name)
                    if (field.Name != name) {
                        arrChange.push(`Field.Name ${field.Name}`)
                        field.Name = name
                    }
                }
                const fType = mItem.FdType
                for (const [ii, txt] of fType) {
                    const field = frmCode.iFields[ii]
                    name = clearSpace(txt, field.Type)
                    if (field.Type != name) {
                        arrChange.push(`Field.Type ${field.Type}`)
                        field.Type = name
                    }
                }
                item.Fields = frmCode.iFields
                addNewFields.call(this)
                const amKey = mItem.PrpAmKey
                for (const [ii, txt] of amKey) {
                    const prp = frmCode.iPropes[ii]
                    name = txt
                    if (typeof name != 'string') continue
                    name = name.trim()
                    if (!name.length) continue
                    name = name.split(' ')
                    name = name.map(x => x.replaceAll(' ', ''))
                    name = name.filter(x => x.length)
                    if (!name.length) continue
                    name = name.map(x => {
                        let xx = x.toLowerCase()
                        if (xx.includes('public')) return '+'
                        if (xx.includes('protected')) return '#'
                        if (xx.includes('private')) return '-'
                        return x
                    })
                    name = name.join(' ')
                    const pKey = prp[0]
                    if (pKey != name) {
                        prp[0] = name
                        arrChange.push(`Accessor Fuction ${pKey}`)
                    }
                }
                const amName = mItem.PrpAmName
                for (const [ii, txt] of amName) {
                    const prp = frmCode.iPropes[ii]
                    const pName = prp[1]
                    name = txt.trim()
                    if (pName != name) {
                        prp[1] = name
                        arrChange.push(`Fuction ${pName}`)
                    }
                }
                const amType = mItem.PrpAmType
                for (const [ii, txt] of amType) {
                    const prp = frmCode.iPropes[ii]
                    const pType = prp[2]
                    name = clearSpace(txt, pType)
                    if (pType != name) {
                        prp[2] = name
                        arrChange.push(`Return Fuction ${pType}`)
                    }
                }
                const ctCode = mItem.PrpAmCode
                for (const [ii, txt] of ctCode) {
                    const prp = frmCode.iPropes[ii]
                    const pType = prp[4]
                    name = txt
                    if (!this.equalHas(name, pType)) {
                        prp[4] = name
                        arrChange.push(`Return Fuction ${pType}`)
                    }
                }
                item.Properties = frmCode.iPropes
                addNewPropes.call(this)
                if (arrChange.length) {
                    //  console.log('changes ', arrChange)
                }
                this.DynamicVar.delete('FrameCode')
                function clearSpace(str, nm) {
                    if (typeof str != 'string') return nm
                    str = str.trim()
                    return str.replaceAll(' ', '')
                }
                function addNewFields() {
                    if (!frmCode.Fields) return
                    if (!frmCode.Fields.length) return
                    for (let ff = 0, fld; ff < frmCode.Fields.length; ff++) {
                        fld = frmCode.Fields[ff]
                        fld.AcModify = this.getTxtAcModify(fld.AcModify, true)
                        item.Fields.push(fld)
                    }
                }
                function addNewPropes() {
                    if (!frmCode.Propers) return
                    if (!frmCode.Propers.length) return
                    for (let ff = 0, prp; ff < frmCode.Propers.length; ff++) {
                        prp = frmCode.Propers[ff]
                        prp[0] = this.getTxtAcModify(prp[0], true)
                        item.Properties.push(prp)
                    }
                }
            },
            getAccessors(acs) {
                let txt = acs
                if (acs.includes(this.AccessInit[2][0]))
                    txt = this.AccessInit[2][this.PLang]
                return txt
            },
            changeAccessor(ii, txt) {
                let acs = txt
                const frmCode = this.DynamicVar.get('FrameCode')
                const prp = frmCode.item.Properties[ii]
                switch (txt) {
                    case AccessInit[2][this.PLang]: // init
                        acs = this.AccessInit[2][0]
                        let a0 = prp[0].split(' ')
                        prp[0] = a0[0]
                        if (prp[2].length) prp[2] = ''
                        break;
                    case AccessInit[1][this.PLang]: // set
                        prp[2] = 'void'
                        break;
                    case AccessInit[0][this.PLang]: // get
                        if ('void' == prp[2]) prp[2] = 'string'
                        if (!prp[2].length) prp[2] = 'string'
                        break;
                    default: break;
                }
                prp[3] = acs
            },
            removeField(ii, isNew) {
                const frmCode = this.DynamicVar.get('FrameCode')
                let fields = frmCode.Fields
                if (isNew) {
                    if (fields) {
                        fields = JSON.parse(JSON.stringify(fields))
                        fields.splice(ii, 1)
                        if (!fields.length) delete frmCode.Fields
                        else frmCode.Fields = fields
                    }
                    return
                }
                fields = frmCode.iFields
                fields.splice(ii, 1)
                const mItem = frmCode.MItem
                if (mItem) {
                    const fAcMd = mItem.FdAcM
                    if (fAcMd && fAcMd.has(ii)) fAcMd.delete(ii)
                    const fName = mItem.FdName
                    if (fName && fName.has(ii)) fName.delete(ii)
                    const fType = mItem.FdType
                    if (fType && fType.has(ii)) fType.delete(ii)
                }
            },
            addField() {
                const frmCode = this.DynamicVar.get('FrameCode')
                if (!frmCode.Fields) {
                    frmCode.Fields = [{
                        ii: 0,
                        AcModify: 'private', Name: 'fieldName', Type: 'String'
                    }]
                } else {
                    if (frmCode.Fields.filter(x => 'fieldName' == x.Name).length) {
                        return;
                    }
                    let ii = frmCode.Fields.length
                    frmCode.Fields.push({
                        ii: ii,
                        AcModify: 'private', Name: 'fieldName', Type: 'String'
                    })
                }
            },
            onEditNewField(e, type, ii) {
                const target = e.target
                const frmCode = this.DynamicVar.get('FrameCode')
                switch (type) {
                    case 'field acmodify':
                        frmCode.Fields[ii].AcModify = target.textContent
                        break;
                    case 'field name':
                        frmCode.Fields[ii].Name = target.textContent
                        break;
                    case 'field type':
                        frmCode.Fields[ii].Type = target.textContent
                        break;
                    default: break;
                }
            },
            addProperty() {
                const frmCode = this.DynamicVar.get('FrameCode')
                if (!frmCode.Propers) {
                    frmCode.Propers = [
                        ['public', 'ProperName()', 'string', AccessInit[0][0], '']
                    ]
                } else {
                    if (frmCode.Propers.filter(x => 'ProperName()' == x[1]).length) {
                        return;
                    }
                    frmCode.Propers.push(['public', 'ProperName()', 'string', AccessInit[0][0], ''])
                }
            },
            removeProperty(ii, isNew) {
                const frmCode = this.DynamicVar.get('FrameCode')
                let lstNwPr = frmCode.Propers
                if (isNew) {
                    if (lstNwPr) {
                        if (-1 < ii) lstNwPr.splice(ii, 1)
                        if (!lstNwPr.length) delete frmCode.Propers
                    }
                    return
                }
                lstNwPr = frmCode.iPropes
                lstNwPr.splice(ii, 1)
                const mItem = frmCode.MItem
                if (mItem) {
                    const amKey = mItem.PrpAmKey
                    if (amKey && amKey.has(ii)) amKey.delete(ii)
                    const aName = mItem.PrpAmName
                    if (aName && aName.has(ii)) aName.delete(ii)
                    const aType = mItem.PrpAmType
                    if (aType && aType.has(ii)) aType.delete(ii)
                    const amCode = mItem.PrpAmCode
                    if (amCode && amCode.has(ii)) amCode.delete(ii)
                }
            },
            changeNewProp(e, type, ii) {
                const frmCode = this.DynamicVar.get('FrameCode')
                const prop = frmCode.Propers[ii]
                if ('acmtp' == type) {
                    let acs = e
                    switch (e) {
                        case AccessInit[2][this.PLang]: // init
                            acs = this.AccessInit[2][0]
                            let a0 = prop[0].split(' ')
                            prop[0] = a0[0]
                            if (prop[2].length) prop[2] = ''
                            break;
                        case AccessInit[1][this.PLang]: // set
                            prop[2] = 'void'
                            break;
                        case AccessInit[0][this.PLang]: // get
                            if ('void' == prop[2]) prop[2] = 'string'
                            if (!prop[2].length) prop[2] = 'string'
                            break;
                        default: break;
                    }
                    prop[3] = acs
                    return
                }
                const target = e.target
                let txt = target.textContent
                switch (type) {
                    case 'access modify key': prop[0] = txt
                        break;
                    case 'access modify name': prop[1] = txt
                        break;
                    case 'access modify type': prop[2] = txt
                        break;
                    case 'code context':
                        txt = target.value
                        prop[4] = txt
                        setHeight(target, target.value)
                        break;
                    default: break;
                }
            },
            closePMenu(e) {
                const dmVar = this.$root.DynamicVar
                if (dmVar.has('PopMenu')) {
                    document.removeEventListener('click', this.$root.closePMenu)
                    const target = e.target
                    if (!target.closest('.wrap-mnlist')) {
                        let popM = dmVar.get('PopMenu')
                        popM.emptySrc()
                        dmVar.delete('PopMenu')
                    }
                }
            },
        },
        //  beforeCreate() { },
        //  created() { },
        beforeMount() {
            this.MaxX = window.innerWidth
        },
        mounted() {
            values.forEach((path, ii) => {
                let pDom = document.body.querySelector(`.dnb-imp-html[dnbpath="${path}"]`)
                if (pDom) pDom.remove();
            })

            const message = "123456";
            const hash = CryptoJS.SHA256(message);
            console.log('test sha256', hash.toString(CryptoJS.enc.Hex));

            document.addEventListener('mousemove', this.trackMouse)
            document.addEventListener("keyup", this.onKeyUp);
        }
    })
    app.mount('#m-app')

}).catch(errStatus => { console.log('Woop!', errStatus) })

function includeHTML(path) {
    const items = document.body.getElementsByClassName("dnb-imp-html");
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