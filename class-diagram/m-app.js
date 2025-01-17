// #region import
import { createApp } from 'vue'
import { drawExtension, drawImplement } from './mcanvas.js'
import { ViewDiagram } from './components/vw-diagram.js'
import { getListCls } from './repository.js'
import { StructTypes } from './common.js'
import { FormEdit } from './components/minicontrols.js'
// #endregion
Promise.all([
    includeHTML(`./components/vw-diagram.html`),
]).then((values) => {
    const app = createApp({
        name: `app-main`,
        components: {
            'view-diagram': ViewDiagram,
            'form-edit': FormEdit,
        },
        data() {
            return {
                IndexPage: 0,
                MinX: 150, MaxX: 150 + 1754,
                MinY: 10, MaxY: 880,
                ListClass: getListCls(),
                DynamicVar: new Map(),
                /* PopMenu, FViewCode, FrameCode: {top,left,html,type,item}, 
                *  DragElm (Dùng kéo các khung class),  */
                NewClassName: null,

                PLang: 1,
                Langs: ['Uml', 'CSharp', 'Java'],
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
                if (dmVar.has('FViewCode')) {
                    return dmVar.get('FViewCode')
                    // let frmCode = dmVar.get('FViewCode')
                    // if (1 == frmCode.type) return frmCode
                }
                return null
            },
            EditObject() {
                const dmVar = this.DynamicVar
                if (dmVar.has('FrameCode')) {
                    return dmVar.get('FrameCode')
                    // let frmCode = dmVar.get('FrameCode')
                    // if (2 == frmCode.type) return frmCode
                }
                return null
            },
        },
        watch: {
            IndexPage(val) { setLocal(6, val) },
        },
        methods: {
            canExtend(item) {
                let hasTyp = item.type
                if (hasTyp.includes('class')) return 'class'
                hasTyp = item.type
                if (hasTyp.includes('interface')) return 'itf_'
            },
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
                    let itemEl = `#dnb-vw-main #cls_${dgElm.Item.id}`
                    itemEl = document.body.querySelector(itemEl)
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
                    const lstCls = this.ListClass
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
                const lstCls = this.ListClass
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
            equalHas(txt1, txt2) {
                let hash1 = CryptoJS.SHA256(txt1), hash2 = CryptoJS.SHA256(txt2)
                return hash1.toString(CryptoJS.enc.Hex) == hash2.toString(CryptoJS.enc.Hex)
            },
            closePMenu(e) {
                const dmVar = this.DynamicVar
                if (dmVar.has('PopMenu')) {
                    document.removeEventListener('click', this.closePMenu)
                    const target = e.target
                    if (!target.closest('.wrap-mnlist')) {
                        let popM = dmVar.get('PopMenu')
                        popM.emptySrc()
                        dmVar.delete('PopMenu')
                    }
                }
            },
            clearDyVar() {
                const dmVar = this.DynamicVar
                dmVar.delete('FrameCode')
                dmVar.delete('FViewCode')
            },
            closePopupForm() {
                const dmVar = this.DynamicVar
                dmVar.delete('FrameCode')
                dmVar.delete('FViewCode')
            },
            getListInherit(item) {
                if (StructTypes[3][0] == item.type) return []   // 'enum'
                if (StructTypes[1][0] == item.type) return []   // 'abstract class'
                let lst = this.ListClass
                const lstCls = []
                const lstItf = []
                for (let ii = 0, cls; ii < lst.length; ii++) {
                    cls = lst[ii]
                    switch (cls.type) {
                        case StructTypes[0][0]: // 'interface'
                            lstItf.push(cls)
                            break;
                        case StructTypes[1][0]: // 'abstract class'
                        case StructTypes[2][0]: // 'instant'
                            lstCls.push(cls)
                            break;
                        default: break;
                    }
                }
                const lstIdTo = item.toIds
                if (lstItf.length && lstIdTo && lstIdTo.length) {
                    const itfIds = []
                    for (let ii = 0, cls; ii < lst.length; ii++) {
                        cls = lst[ii]
                        if (!lstIdTo.includes(cls.id)) continue;
                        if (StructTypes[0][0] == cls.type)
                            itfIds.push(cls.id)     // interface
                    }
                    for (let ii = lstItf.length - 1, itf; -1 < ii; ii--) {
                        itf = lstItf[ii]
                        if (!itfIds.includes(itf.id)) continue
                        lstItf.splice(ii, 1)    // remove at ii
                    }
                }
                if (StructTypes[0][0] == item.type) return lstItf   // interface
                // class
                if (!lstIdTo || !lstIdTo.length) return lst;

                for (let ii = 0, cls; ii < lst.length; ii++) {
                    cls = lst[ii]
                    if (!lstIdTo.includes(cls.id)) continue;
                    if (StructTypes[1][0] == cls.type || StructTypes[2][0] == cls.type) {
                        // 'abstract class' || 'instant class'
                        lstCls.splice(0)
                        break;
                    }
                }
                if (!lstCls.length) return lstItf;
                if (!lstItf.length) return lstCls;
                lst = []
                for (let ii = 0; ii < lstItf.length; ii++) lst.push(lstItf[ii])
                for (let ii = 0; ii < lstCls.length; ii++) lst.push(lstCls[ii])
                return lst
            },
            getExtend(item, hTag1, hTag2) {
                let extend = ''
                const ii = this.PLang
                const tIds = item.toIds
                if (tIds && tIds.length) {
                    let lst = this.ListClass
                    const lsCls = []
                    const lstItf = []
                    for (let jj = 0, cls; jj < lst.length; jj++) {
                        cls = lst[jj]
                        if (item.id == cls.id) continue;  // it-self
                        if (!tIds.includes(cls.id)) continue;
                        switch (cls.type) {
                            case StructTypes[0][0]: // 'interface'
                                lstItf.push(cls)
                                break;  // switch
                            case StructTypes[1][0]: // 'abstract class'
                            case StructTypes[2][0]: // 'class'
                                lsCls.push(cls)
                                break;  // switch
                            default: break;  // switch
                        }
                    }
                    if (2 == ii) {    // java
                        let tag = ''
                        if (lsCls.length) {
                            lst = lsCls.map(xx => xx.Name)
                            tag = `extends`
                            if (hTag1) tag = `<${hTag1}>${tag}</${hTag1}>`
                            extend = `${tag} ${lst.join(', ')}`
                        }
                        if (lstItf.length) {
                            lst = lstItf.map(xx => xx.Name)
                            tag = `implements`
                            if (hTag1) tag = `<${hTag1}>${tag}</${hTag1}>`
                            if (extend.length)
                                extend += ` ${tag} ${lst.join(', ')}`
                            else extend = `${tag} ${lst.join(', ')}`
                        }
                        if (extend.length) {
                            if (hTag2) extend = `<${hTag2}>&nbsp;${extend}</${hTag2}>`
                            else extend = ' ' + extend
                        }
                    } else {
                        if (lsCls.length) {
                            lst = lsCls.map(xx => xx.Name)
                            extend = `${lst.join(', ')}`
                        }
                        if (lstItf.length) {
                            lst = lstItf.map(xx => xx.Name)
                            if (extend.length) extend += `, ${lst.join(', ')}`
                            else extend = `${lst.join(', ')}`
                        }
                        if (extend.length) {
                            if (hTag2) extend = `: <${hTag2}>${extend}</${hTag2}>`
                            else extend = `: ${extend}`
                        }
                    }
                }
                return extend
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