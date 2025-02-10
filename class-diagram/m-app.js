// #region import
import { createApp } from 'vue'
import { drawExtension, drawImplement, drawGrid, drawComposition } from './mcanvas.js'
import { ViewDiagram } from './components/vw-diagram.js'
import { getListCls } from './repository.js'
import {
    isInterface, verifySave, setHeight, isNotOverlap,
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
                MinY: 10, MaxY: 880,
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
            drawCanvas() {
                const lstCls = this.ListClass
                const linesImpl = []
                const linesExtn = []
                for (let ii = lstCls.length - 1, item; -1 < ii; ii--) {
                    item = lstCls[ii]
                    if (!item.toIds || !item.toIds.length) continue;
                    let x0 = item.left + 1
                    let y0 = item.top
                    for (let jj = lstCls.length - 1, Jtem; -1 < jj; jj--) {
                        if (jj == ii) continue;
                        Jtem = lstCls[jj]
                        if (!item.toIds.includes(Jtem.id)) continue
                        let w0 = item.width
                        let h0 = item.height
                        let x1 = Jtem.left
                        let y1 = Jtem.top
                        let w1 = Jtem.width
                        let h1 = Jtem.height
                        if (isInterface(Jtem.type)) {
                            linesImpl.push([[x0, y0, w0, h0], [x1, y1, w1, h1]])
                            continue
                        }
                        // class
                        linesExtn.push([[x0, y0, w0, h0], [x1, y1, w1, h1]])
                    }
                }
                let hasChange = false
                let strO = JSON.stringify(this.ImplLines)
                let strN = JSON.stringify(linesImpl)
                if (strO != strN) {
                    this.ImplLines = linesImpl
                    hasChange = true
                  //  console.log('is change implements', strO, strN)
                }
                strO = JSON.stringify(this.ExtnLines)
                strN = JSON.stringify(linesExtn)
                if (strO != strN) {
                    this.ExtnLines = linesExtn
                    hasChange = true
                  //  console.log('is change extends', strO, strN)
                }

                if (hasChange) {
                  //  console.trace()
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
                        //drawComposition.call(ctx, p0, p1, 6, 18, '#8b8b8b')
                    }
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
                    if (this.MaxY + 3 < y + dItem.height) return;
                    if (this.MaxX < x + dItem.width - 6) return;

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
                    else if (isNotOverlap(dItem, this.ListClass)) {
                        this.setTopLeft(dItem, dgElm.Left, dgElm.Top)

                        this.updateSizeCanvas()         // key up => end dnd item
                        this.$nextTick(this.drawCanvas) // key up => end dnd item
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