// #region import
import { createApp } from 'vue'
import { drawExtension, drawImplement } from './mcanvas.js'
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
                ListClass: getListCls(),
                LastArea: [],   // List<[id, x, y, w, h]>
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
                this.DragElm = null

                this.updateLastArea()
            },
            drawLines(points) {
                const c = document.getElementById(`dnb-mcanvas`);
                const ctx = c.getContext("2d");
                ctx.clearRect(0, 0, c.width, c.height);
                for (let ii = 0; ii < points.length; ii++) {
                    const [p0, p1] = points[ii]
                    if (p0[4] == 'extend') drawExtension.call(ctx, p0, p1, 8)
                    if (p0[4] == 'implement') drawImplement.call(ctx, p0, p1, 6)
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
                    if (!item.idTos || !item.idTos.length) continue;
                    let cIds = item.idTos.map(x => x[0])
                    let cTypes = item.idTos.map(x => x[1])
                    let x0 = item.left + 1
                    let y0 = item.top
                    for (let jj = 0, Jtem; jj < lstCls.length; jj++) {
                        if (jj == ii) continue;
                        Jtem = lstCls[jj]
                        if (Jtem.idTos && Jtem.idTos.length) continue
                        let iiT = cIds.indexOf(Jtem.id)
                        if (iiT < 0) continue
                        let w0 = item.width
                        let h0 = item.height
                        let x1 = Jtem.left
                        let y1 = Jtem.top
                        let w1 = Jtem.width
                        let h1 = Jtem.height
                        const cType = cTypes[iiT]
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

function getListCls() {
    let lstCls = [
        {
            id: 'cls-account', type: 'instant class',
            top: 30, left: 90, width: 220, height: 100,
            Name: 'Account', Fields: [
                { AcModify: '#', Name: 'name', Type: 'String' },
                { AcModify: '#', Name: 'emailAddress', Type: 'String' },
            ], Properties: [
                ['+', 'GetName()', 'String', 'get', `return this.Name`],
                ['+', 'SetName(String)', 'void', 'set'],
                ['+', 'GetEmailAddress()', 'String', 'get'],
                ['+', 'SetEmailAddress(String)', 'void', 'set'],
            ]
        },
        {
            id: 'cls-contact', type: 'instant class',
            idTos: [['cls-account', 'extend']],
            top: 70, left: 580, width: 210, height: 100,
            Name: 'Contact', Fields: [
                { AcModify: '#', Name: 'name', Type: 'String' },
                { AcModify: '#', Name: 'emailAddress', Type: 'String' },
                { AcModify: '', Name: 'faxNumber', Type: 'String' },
            ], Properties: [
                ['+', 'GetName()', 'String', 'get'],
                ['+', 'SetName(String)', 'void', 'set'],
                ['+', 'GetEmailAddress()', 'String', 'get'],
                ['+', 'SetEmailAddress(String)', 'void', 'set'],
                ['+', 'GetFaxNumber()', 'Int', 'get'],
                ['+', 'SetFaxNumber(Int)', 'void', 'set'],
            ]
        },
        {
            id: 'cls-animal', type: 'abstract class',
            top: 70, left: 1024, width: 150, height: 100,
            Name: 'Animal', Fields: [
                { AcModify: '+', Name: 'age', Type: 'Int' },
                { AcModify: '+', Name: 'gender', Type: 'String' },
            ], Properties: [
                ['+', 'IsMammal()', 'Bool', 'get'],
                ['+', 'Mate()', 'Int', 'get'],
            ]
        },
        {
            id: 'cls-duck', type: 'instant class',
            idTos: [['cls-animal', 'extend'], ['cls-ifly', 'implement'], ['cls-quack', 'implement']],
            top: 270, left: 880, width: 150, height: 100,
            Name: 'Duck', Fields: [
                { AcModify: '+', Name: 'beakColor', Type: 'String' },
            ], Properties: [
                ['+', 'Swim()', 'void', 'set'],
            ]
        },
        {
            id: 'cls-zebra', type: 'instant class',
            idTos: [['cls-animal', 'extend']],
            top: 270, left: 1280, width: 150, height: 100,
            Name: 'Zebra', Fields: [
                { AcModify: '+', Name: 'isWild', Type: 'String' },
            ], Properties: [
                ['+', 'Run()', 'void', 'set'],
            ]
        },
        {
            id: 'cls-ifly', type: 'interface',
            top: 500, left: 1200, width: 150, height: 100,
            Name: 'iFly', Fields: [], Properties: [
                ['+', 'Fly()', 'void', 'set'],
            ]
        },
        {
            id: 'cls-quack', type: 'interface',
            top: 500, left: 1400, width: 150, height: 100,
            Name: 'iQuack', Fields: [], Properties: [
                ['+', 'Quack()', 'void', 'set'],
            ]
        },
    ]
    return lstCls
}
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