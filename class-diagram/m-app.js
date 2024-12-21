// #region import
import { createApp } from 'vue'
import { drawExtension } from './mcanvas.js'
import { ViewDiagram } from './components/vw-diagram.js'
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
                ListPos: [],      // [[x, y, id, width], ...]
                DragElm: null,
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
            ListPos(lstPos) {
                console.log('watch pos')
                const c = document.getElementById(`dnb-mcanvas`);
                const ctx = c.getContext("2d");
                ctx.clearRect(0, 0, c.width, c.height);
                for (let ii = 0; ii < lstPos.length; ii++) {
                    const [p0, p1] = lstPos[ii]
                    const [x0, y0, id0, w0, h0] = p0
                    const [x1, y1, id1, w1, h1] = p1
                    drawExtension.call(ctx, [x0, y0, w0, h0], [x1, y1, w1, h1], 8)
                }
            },
        },
        methods: {
            selectPage(index) { this.IndexPage = index },
            trackMouse(event) {
                let x = event.clientX;
                let y = event.clientY;

                if (this.DragElm !== null) {
                    const dgElm = this.DragElm
                    let left = x + dgElm.offX
                    let top = y + dgElm.offY
                    const dItem = dgElm.Item
                    dItem.left = left
                    dItem.top = top
                    const id = dItem.id
                    this.updatePos(id, left, top)
                }
                document.getElementById('dnb-app-log').innerText = `X: ${x}, Y: ${y}`
            },
            onKeyUp(evt) {
                // console.log('on key up', evt)
                this.DragElm = null
            },
            updatePos(id, x, y) {
                const lstPos = this.ListPos
                let isChange = false
                for (let ii = 0, arP; ii < lstPos.length; ii++) {
                    arP = lstPos[ii]
                    let pos = arP[0]
                    if (pos[2] == id) {
                        checkChange(pos)
                        continue
                    }
                    pos = arP[1]
                    if (pos[2] == id) {
                        checkChange(pos)
                    }
                }
                if (isChange) {
                    this.ListPos = [...lstPos]
                }
                function checkChange(pos) {
                    if (pos[0] != x) {
                        pos[0] = x
                        isChange = true
                    }
                    if (pos[1] != y) {
                        pos[1] = y
                        isChange = true
                    }
                }
            },
        },
        //  beforeCreate() { },
        created() {

        },
        mounted() {

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