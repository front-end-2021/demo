// #region import
import { createApp } from 'vue'
import { drawExtension, drawImplement } from './mcanvas.js'
import { ViewDiagram } from './components/vw-diagram.js'
import { getListCls } from './repository.js'
// #endregion
Promise.all([
    includeHTML(`./components/vw-diagram.html`),
]).then((values) => {
    const app = createApp({
        name: `app-main`,
        components: {
            'view-diagram': ViewDiagram,
        },
        data() {
            return {
                IndexPage: 0,
                MinX: 150, MaxX: 150 + 1754,
                MinY: 10, MaxY: 880,
                ListClass: getListCls(),
                LastArea: [],   // List<[id, x, y, w, h]>
                DragElm: null,  // Dùng kéo các khung class
                FrameCode: null,
            }
        },
        computed: {
            CompPage() {
                switch (this.IndexPage) {
                    case 0: return 'view-diagram';
                    default: break;
                }
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
                if (this.DragElm !== null) {
                    const dgElm = this.DragElm
                    const dItem = dgElm.Item
                    if (x - 20 < this.MinX) return;
                    if (y < this.MinY + 20) return;
                    if (this.MaxY + 3 < y + dItem.height) return
                    let left = x + dgElm.offX
                    let top = y + dgElm.offY
                    if (this.MaxX < x + dItem.width - 6) return;
                    const id = dItem.id
                    if (!this.isOverView(id, left, top, dItem.width, dItem.height)) {
                        if (dItem.left != left || dItem.top != top) {
                            dItem.left = left
                            dItem.top = top
                        }
                    }
                    this.drawLines(this.getPoints())
                }
                document.getElementById('dnb-app-log').innerText = `X: ${x}, Y: ${y}`
            },
            onKeyUp(evt) {
                // console.log('on key up', evt)
                // const dgElm = this.DragElm
                // if (dgElm != null) {
                //     const dItem = dgElm.Item
                //     let x = dItem.left + dItem.width + 20 + this.MinX
                //     if (this.MaxX <= x) {
                //         this.MaxX += dItem.width + 20
                //         this.$nextTick(() => {
                //             this.drawLines(this.getPoints())
                //             this.updateLastArea()
                //         })
                //     }
                // }
                this.DragElm = null
                this.updateLastArea()
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
            isOverView(id, x, y, w, h) {
                const lstArea = this.LastArea.filter(x => x[0] != id)
                for (let ii = 0; ii < lstArea.length; ii++) {
                    const [id0, x0, y0, w0, h0] = lstArea[ii]
                    if (x + w < x0 - 30 || x0 + w0 < x - 30) continue
                    if (y + h < y0 - 30 || y0 + h0 < y - 30) continue
                    return true
                }
                return false
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
            updateLastArea() {
                const lstArea = []
                const lstCls = this.$root.ListClass
                for (let ii = 0, item; ii < lstCls.length; ii++) {
                    item = lstCls[ii]
                    let x = item.left
                    let y = item.top
                    let w = item.width
                    let h = item.height
                    lstArea.push([item.id, x, y, w, h])
                }
                this.$root.LastArea = lstArea
            },
        },
        //  beforeCreate() { },
        //  created() { },
        beforeMount(){
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