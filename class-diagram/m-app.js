// #region import
import { createApp } from 'vue'
import { drawExtension, drawImplement, drawComposition } from './mcanvas.js'
import { ViewDiagram } from './components/vw-diagram.js'
import { getListCls } from './repository.js'
import {
    StructTypes, isInterface, verifySave, isClass, setHeight, inOverview,
    isAbstract
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
            // canExtend(type) {
            //     let hasTyp = type
            //     if (isClass(hasTyp)) return 'class'
            //     hasTyp = type
            //     if (isInterface(hasTyp)) return 'itf_'
            // },
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
                    else if (inOverview(dItem, this.ListClass)) {
                        this.setTopLeft(dItem, dgElm.Left, dgElm.Top)
                        this.drawLines(this.getPoints())
                    }
                    document.removeEventListener('keydown', this.disableSrollDown)

                }
                dmVar.delete('DragElm')
            },
            drawLines(points) {
                this.updateSizeCanvas()
                const c = document.getElementById(`dnb-mcanvas`);
                const ctx = c.getContext("2d");
                ctx.clearRect(0, 0, c.width, c.height);
                let xx = 0
                for (let ii = 0; ii < points.length; ii++) {
                    const [p0, p1] = points[ii]
                    if (isClass(p0[4])) {
                        if (0 < xx) drawComposition.call(ctx, p0, p1, 6, 18, '#8b8b8b')
                        else drawExtension.call(ctx, p0, p1, 6, '#8b8b8b')
                        xx++
                    }
                    if (isInterface(p0[4])) drawImplement.call(ctx, p0, p1, 6, '#8b8b8b')
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
            // getExtend(item, hTag1, hTag2) {
            //     let extend = ''
            //     const tIds = item.toIds
            //     if (tIds && tIds.length) {
            //         let lst = this.ListClass
            //         const lsCls = []
            //         const lstItf = []
            //         for (let jj = 0, cls; jj < lst.length; jj++) {
            //             cls = lst[jj]
            //             if (item.id == cls.id) continue;  // it-self
            //             if (!tIds.includes(cls.id)) continue;
            //             switch (cls.type) {
            //                 case StructTypes[0][0]: // 'interface'
            //                     lstItf.push(cls)
            //                     break;  // switch
            //                 case StructTypes[1][0]: // 'abstract class'
            //                 case StructTypes[2][0]: // 'class'
            //                     lsCls.push(cls)
            //                     break;  // switch
            //                 default: break;  // switch
            //             }
            //         }
            //         extend = this.getExtends(hTag1, hTag2, lsCls, lstItf)
            //     }
            //     return extend
            // },
            // getExtends(hTag1, hTag2, lsCls, lstItf) {
            //     let extend = ''
            //     const ii = this.PLang
            //     let lst = this.ListClass
            //     if (2 == ii) {    // java
            //         let tag = ''
            //         if (lsCls.length) {
            //             lst = lsCls.map(xx => xx.Name)
            //             tag = `extends`
            //             if (hTag1) tag = `<${hTag1}>${tag}</${hTag1}>`
            //             extend = `${tag} ${lst.join(', ')}`
            //         }
            //         if (lstItf.length) {
            //             lst = lstItf.map(xx => xx.Name)
            //             tag = `implements`
            //             if (hTag1) tag = `<${hTag1}>${tag}</${hTag1}>`
            //             if (extend.length)
            //                 extend += ` ${tag} ${lst.join(', ')}`
            //             else extend = `${tag} ${lst.join(', ')}`
            //         }
            //         if (extend.length) {
            //             if (hTag2) extend = `<${hTag2}>&nbsp;${extend}</${hTag2}>`
            //             else extend = ' ' + extend
            //         }
            //     } else {
            //         if (lsCls.length) {
            //             lst = lsCls.map(xx => xx.Name)
            //             extend = `${lst.join(', ')}`
            //         }
            //         if (lstItf.length) {
            //             lst = lstItf.map(xx => xx.Name)
            //             if (extend.length) extend += `, ${lst.join(', ')}`
            //             else extend = `${lst.join(', ')}`
            //         }
            //         if (extend.length) {
            //             if (hTag2) extend = `: <${hTag2}>${extend}</${hTag2}>`
            //             else extend = `: ${extend}`
            //         }
            //     }
            //     return extend
            // },
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
        },
        //  beforeCreate() { },
        //  created() { },
        //beforeMount() { },
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

            this.updateSizeCanvas()
            this.$nextTick(() => {
                this.drawLines(this.getPoints())
            })
        },
        //updated() { },
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