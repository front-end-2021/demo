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
                ListPos: [],      // List<[[x0, y0, id0, w0, h0, cType], [x1, y1, id1, w1, h1]]>
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
                        dItem.left = left
                        dItem.top = top
                        this.updatePos(id, left, top)
                    }
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
            updatePos(id, x, y) {
                const lstPos = this.ListPos
                const points = []
                let hasPos = false
                for (let ii = 0, arP; ii < lstPos.length; ii++) {
                    arP = lstPos[ii]
                    let pos = arP[0]
                    if (pos[2] == id) {
                        checkChange(pos);
                        hasPos = true
                        continue;
                    }
                    pos = arP[1]
                    if (pos[2] == id) {
                        checkChange(pos)
                        hasPos = true
                    }
                }
                if (hasPos) {
                    for (let ii = 0, arP; ii < lstPos.length; ii++) {
                        arP = lstPos[ii]
                        let pos0 = arP[0]
                        let pos1 = arP[1]
                        let p0 = [pos0[0], pos0[1], pos0[3], pos0[4], pos0[5]]
                        let p1 = [pos1[0], pos1[1], pos1[3], pos1[4]]
                        points.push([p0, p1])
                    }
                }
                if (points.length) this.drawLines(points)
                function checkChange(pos) {
                    if (pos[0] != x) pos[0] = x
                    if (pos[1] != y) pos[1] = y
                }
            },
            updateLastArea() {
                const lstPos = this.ListPos
                const lstArea = []
                for (let ii = 0; ii < lstPos.length; ii++) {
                    const [arP0, arP1] = lstPos[ii]
                    let x0 = arP0[0], y0 = arP0[1]
                    let w0 = arP0[3], h0 = arP0[4]
                    let id0 = arP0[2]
                    addLst(id0, x0, y0, w0, h0)
                    let x1 = arP1[0], y1 = arP1[1]
                    let w1 = arP1[3], h1 = arP1[4]
                    let id1 = arP1[2]
                    addLst(id1, x1, y1, w1, h1)
                }
                this.$root.LastArea = lstArea
                function addLst(id, x, y, w, h) {
                    let iiA = lstArea.findIndex(x => x[0] == id)
                    if (-1 < iiA) return;
                    lstArea.push([id, x, y, w, h])
                }
            },
        },
        //  beforeCreate() { },
        //  created() { },
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

function getListCls() {
    let lstCls = [
        {
            id: 'cls-account', type: 'class',
            idTo: 'cls-contact', connType: 'extend',
            top: 30, left: 90, width: 220, height: 100,
            Name: 'Account', Fields: [
                { AcModify: '#', Name: 'name', Type: 'String' },
                { AcModify: '#', Name: 'emailAddress', Type: 'String' },
            ], Properties: [
                ['+', 'GetName()', 'String', 'get'],
                ['+', 'SetName(String)', 'void', 'set'],
                ['+', 'GetEmailAddress()', 'String', 'get'],
                ['+', 'SetEmailAddress(String)', 'void', 'set'],
            ]
        },
        {
            id: 'cls-contact', type: 'class',
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
            id: 'cls-animal', type: 'class',
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
            id: 'cls-duck', type: 'class',
            idTo: 'cls-animal,cls-ifly', connType: 'extend,implement',
            top: 270, left: 880, width: 150, height: 100,
            Name: 'Duck', Fields: [
                { AcModify: '+', Name: 'beakColor', Type: 'String' },
            ], Properties: [
                ['+', 'Swim()', 'void', 'set'],
                ['+', 'Quack()', 'void', 'set'],
                ['+', 'Fly(){...}', 'void', 'set'],
            ]
        },
        {
            id: 'cls-zebra', type: 'class',
            idTo: 'cls-animal', connType: 'extend',
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