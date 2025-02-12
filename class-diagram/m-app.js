// #region import
import { createApp } from 'vue'
import {
    drawExtension, drawImplement, drawGrid,
    drawComposition, drawAssociation
} from './mcanvas.js'
import { ViewDiagram } from './components/vw-diagram.js'
import { getListCls } from './repository.js'
import {
    verifySave, setHeight, isOverlap,
    isAbstract, isClass, isInterface, isStruct, isEnum,
} from './common.js'
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
                MinX: 150, MaxX: 150 + 1754,
                MinY: 30, MaxY: 880,
                DiagName: 'Demo',
                ListClass: getListCls(),
                CompLines: [],  // Composition
                ImplLines: [],  // Inheritance implement
                ExtnLines: [],  // Inheritance extend
                AssoLines: [],  // Association
                AggrLines: [],  // Aggregation
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
                return 'view-diagram';
            },
            ViewCode() {
                const dmVar = this.DynamicVar
                if (dmVar.has('FViewCode')) {
                    return dmVar.get('FViewCode')

                }
                return null
            },
            EditObject() {
                const dmVar = this.DynamicVar
                if (dmVar.has('FrameCode')) {
                    return dmVar.get('FrameCode')

                }
                return null
            },
        },
        watch: {
            //ListClass(val) { },
        },
        methods: {
            drawCanvas(isChange) {
                if (typeof isChange == 'boolean' && isChange) {
                    drawCtx.call(this)
                    return
                }
                const lstCls = this.ListClass
                const lsClass = []
                const lsAbstrac = []
                const lsInteface = []
                const lsEnum = []
                const lsStruct = []
                for (let ii = lstCls.length - 1, item; -1 < ii; ii--) {
                    item = lstCls[ii]
                    if (isInterface(item.type)) {
                        lsInteface.push(item)
                        continue
                    }
                    if (isAbstract(item.type)) {
                        lsAbstrac.push(item)
                        continue
                    }
                    if (isClass(item.type)) {
                        lsClass.push(item)
                        continue
                    }
                    if (isEnum(item.type)) {
                        lsEnum.push(item)
                        continue
                    }
                    if (isStruct(item.type)) {
                        lsStruct.push(item)
                        continue
                    }
                }

                const mpClass = new Map(lsClass.map(x => [x.Name, x]))
                const mpAbstrc = new Map(lsAbstrac.map(x => [x.Name, x]))
                const mpIntefc = new Map(lsInteface.map(x => [x.Name, x]))
                const mName = new Map(lstCls.map(x => [x.Name, x]))

                const linesImpl = []
                const linesExtn = []
                for (let ii = lstCls.length - 1, item; -1 < ii; ii--) {
                    item = lstCls[ii]
                    if (isEnum(item.type)) continue
                    if (!item.toIds || !item.toIds.length) continue;
                    buildLines(item, lsInteface, linesImpl)
                    buildLines(item, lsClass, linesExtn)
                    buildLines(item, lsAbstrac, linesExtn)
                }
                const linesAsso = getLnsAssociation(lstCls)
                isChange = false

                if (!isEqLines(this.ImplLines, linesImpl)) {
                    this.ImplLines = linesImpl
                    isChange = true
                }
                if (!isEqLines(this.ExtnLines, linesExtn)) {
                    this.ExtnLines = linesExtn
                    isChange = true
                }
                if (!isEqLines(this.AssoLines, linesAsso)) {
                    this.AssoLines = linesAsso
                    isChange = true
                }

                if (isChange) {
                    //  console.trace()
                    drawCtx.call(this)
                }
                function drawCtx() {
                    const c = document.getElementById('dnb-mcanvas');
                    const ctx = c.getContext("2d");
                    ctx.clearRect(0, 0, c.width, c.height);
                    drawGrid.call(ctx, c.width, c.height, 10, '#f5f5f5')
                    let lstLns = this.ImplLines
                    for (let ii = lstLns.length - 1; -1 < ii; ii--) {
                        const [p0, p1] = lstLns[ii]
                        drawImplement.call(ctx, p0, p1, 6, '#8b8b8b')
                    }
                    lstLns = this.ExtnLines
                    for (let ii = lstLns.length - 1; -1 < ii; ii--) {
                        const [p0, p1] = lstLns[ii]
                        drawExtension.call(ctx, p0, p1, 6, '#8b8b8b')
                    }
                    lstLns = this.AssoLines
                    for (let ii = lstLns.length - 1; -1 < ii; ii--) {
                        const [p0, p1] = lstLns[ii]
                        drawAssociation.call(ctx, p0, p1, '#8b8b8b')
                        //drawComposition.call(ctx, p0, p1, 6, 18, '#8b8b8b')
                    }
                }
                function getLnsAssociation(lstCls) {
                    const lnsAso = []
                    const mTypF = new Map()
                    for (let ii = lstCls.length - 1, item; -1 < ii; ii--) {
                        item = lstCls[ii]
                        for (let ff = item.Fields.length - 1, field; -1 < ff; ff--) {
                            field = item.Fields[ff]
                            if (mName.has(field.Type)) {
                                if (mTypF.has(field.Type)) {
                                    const lsItm = mTypF.get(field.Type)
                                    if (!lsItm.find(x => Object.is(x, item))) {
                                        lsItm.push(item)
                                    }
                                } else {
                                    mTypF.set(field.Type, [item])
                                }
                            }
                        }
                    }
                    if (mTypF.size < 1) return lnsAso
                    let des, src
                    for (const [name, items] of mTypF) {
                        des = mName.get(name)
                        for (let ii = items.length - 1; -1 < ii; ii--) {
                            src = items[ii]
                            pushLines(lnsAso, src, des)
                        }
                    }
                    return lnsAso
                }
                function getLnsComposition() {

                }
                function isEqLines(lsLine1, lsLine2) {
                    let strO = JSON.stringify(lsLine1)
                    let strN = JSON.stringify(lsLine2)
                    if (strO != strN) return false
                    return true
                }
                function buildLines(item, lsLns, lsLine) {
                    for (let jj = lsLns.length - 1, Jtem; -1 < jj; jj--) {
                        Jtem = lsLns[jj]
                        if (item.id == Jtem.id) continue // it-self
                        if (!item.toIds.includes(Jtem.id)) continue
                        pushLines(lsLine, item, Jtem)
                    }
                }
                function pushLines(lsLine, src, des) {
                    let x0 = src.left + 1, y0 = src.top
                    let w0 = src.width, h0 = src.height
                    let x1 = des.left, y1 = des.top
                    let w1 = des.width, h1 = des.height
                    lsLine.push([[x0, y0, w0, h0], [x1, y1, w1, h1]])
                }
            },
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

                    if (dItem.left != left || dItem.top != top) {
                        this.setTopLeft(dItem, left, top)

                        this.drawCanvas()       // dragging item
                    }
                }
                document.getElementById('dnb-app-log').innerText = `X: ${x}, Y: ${y}`
            },
            setTopLeft(dItem, left, top) {
                dItem.left = left
                dItem.top = top
            },
            disableSrollDown(event) {
                if (event.keyCode === 32) {  // back-space
                    event.preventDefault();
                    return
                }
            },
            onKeyUp(evt) {
                let wrp = document.body.querySelector(`#dnb-vw-main`)
                if (!wrp) return
                const dmVar = this.DynamicVar
                if (dmVar.has('DragElm')) {
                    const dgElm = dmVar.get('DragElm')
                    let itemEl = `#cls_${dgElm.Item.id}`
                    itemEl = wrp.querySelector(itemEl)
                    itemEl.style.zIndex = ''
                    itemEl.style.backgroundColor = ''
                    const dItem = dgElm.Item

                    if ('cls-classname' == dgElm.Item.id) {
                        this.editObject(dgElm.Item)
                    }
                    else if (isOverlap(dItem, this.ListClass)) {
                        // revert
                        this.setTopLeft(dItem, dgElm.Left, dgElm.Top)
                        this.updateSizeCanvas()         // key up => end dnd item => revert
                        this.$nextTick(this.drawCanvas) // key up => end dnd item => revert
                    } else {
                        this.updateSizeCanvas()             // key up => end dnd item
                        this.drawCanvas(true)    // key up => end dnd item
                    }
                    document.removeEventListener('keydown', this.disableSrollDown)

                }
                dmVar.delete('DragElm')
            },
            preventKeyPress(e, codes) {
                if (e.which === 13) {
                    e.target.blur()
                    e.preventDefault()
                }
                if (codes.includes(e.which)) e.preventDefault()
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
            editObject(item) {
                // {id, type, Name, toIds, top, left, width, height, Fields, Methods }
                const dmVar = this.DynamicVar
                dmVar.delete('FViewCode')
                let cItem = JSON.parse(JSON.stringify(item))
                verifySave(cItem, this.PLang)

                const entry = {
                    item,
                    cItem,
                }
                //if (item.toIds) entry.toIds = [...item.toIds]
                dmVar.set('FrameCode', entry)
                this.$nextTick(() => {
                    document.body.querySelectorAll(`textarea.objedit-vwcode`).forEach(el => {
                        let txt = el.value
                        setHeight(el, txt)
                    })
                })
            },
            getLsExtends(lsCls, lstItf, iLang) {
                let lst = this.ListClass
                let arrExt = []
                switch (iLang) {
                    case 1:     //  C#
                        let extds = []
                        if (lsCls.length) {
                            extds = lsCls.map(xx => xx.Name)
                        }
                        if (lstItf.length) {
                            lst = lstItf.map(xx => xx.Name)
                            extds = extds.concat(lst)
                        }
                        arrExt.push([':', extds.join(', ')])
                        return arrExt
                    case 2:     // Java
                        if (lsCls.length) {
                            lst = lsCls.map(xx => xx.Name)
                            arrExt.push([' extends', lst.join(', ')])
                        }
                        if (lstItf.length) {
                            lst = lstItf.map(xx => xx.Name)
                            arrExt.push([' implements', lst.join(', ')])
                        }
                        return arrExt
                    default: return arrExt;
                }
            },
            updateSizeCanvas() {
                const cvns = document.body.querySelector(`#dnb-mcanvas`)
                if (!cvns) return
                let wrp = document.body.querySelector(`#dnb-vw-main`)
                let minW = 1080, minH = 300
                if (wrp) {
                    minW = wrp.offsetWidth
                    minH = wrp.offsetHeight
                }
                let offXy = 180
                const lst = this.ListClass
                let mxX = Math.max(...lst.map(x => x.left + x.width))
                mxX += offXy
                if (mxX < minW) mxX = minW - 21
                let mxY = Math.max(...lst.map(x => x.top + x.height))
                mxY += offXy
                if (mxY < minH) mxY = minH

                this.MaxX = mxX + this.MinX
                this.MaxY = mxY + this.MinY

                cvns.setAttribute('width', mxX)
                cvns.setAttribute('height', mxY)
            },
            // equalHas(txt1, txt2) {
            //     let hash1 = CryptoJS.SHA256(txt1), hash2 = CryptoJS.SHA256(txt2)
            //     return hash1.toString(CryptoJS.enc.Hex) == hash2.toString(CryptoJS.enc.Hex)
            // },
        },
        //  beforeCreate() { },
        //  created() { },
        //beforeMount() { },
        mounted() {
            values.forEach((path, ii) => {
                let pDom = document.body.querySelector(`.dnb-imp-html[dnbpath="${path}"]`)
                if (pDom) pDom.remove();
            })

            // const message = "123456";
            // const hash = CryptoJS.SHA256(message);//CryptoJS.MD5(message);
            // console.log(hash.toString(CryptoJS.enc.Hex));
            // console.log(hash.toString(CryptoJS.enc.Base64));// speed > Hex

            document.addEventListener('mousemove', this.trackMouse)
            document.addEventListener("keyup", this.onKeyUp);

            this.updateSizeCanvas()         // mount-ed
            this.$nextTick(this.drawCanvas) // mount-ed
        },
        //updated(){ console.log('updated') }
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