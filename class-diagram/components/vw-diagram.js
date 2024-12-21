
const RectClass = {
    template: `#tmp-rect-class`,
    name: "Rect_Class",
    display: "Rect.Class",
    props: ['item'],
    methods: {
        getProperty(prp) {
            let acModify = prp[0]
            let name = prp[1]
            let type = prp[2]
            let returnType = prp[3]
            let txt = `${acModify} ${type} ${name}`
            if (returnType.toLowerCase().includes('get'))
                txt = `${acModify} ${name}: ${type}`
            return txt
        },
        onMouseDown(event) {
            const off = this.$el.getBoundingClientRect()
            this.$root.DragElm = {
                Item: this.item,
                offX: off.left - event.clientX,
                offY: off.top - event.clientY
            }
        },
    },
    computed: {
        PaInterface() {
            let cType = this.item.connType
            if(!cType) return
            cType = cType.split(',')
            let iiT = cType.indexOf('implement')
            if (iiT < 0) return
            let idTo = this.item.idTo
            idTo = idTo.split(',')
            const idI = idTo[iiT]
            if (!idI) return
            const lstCls = this.$root.ListClass
            return lstCls.find(x => idI == x.id)
        },
        ViewName() {
            const item = this.item
            let paIn = this.PaInterface
            if(!paIn) return item.Name
            return `${item.Name}: ${paIn.Name}`
        },
    },
    mounted() {
        const off = this.$el.getBoundingClientRect()
        this.item.height = off.height
        this.$el.addEventListener('mousedown', this.onMouseDown)
    },
    // updated() { },
    beforeUnmount() {
        this.$el.removeEventListener('mousedown', this.onMouseDown)
    },
}
export const ViewDiagram = {
    template: `#tmp-vw-diagram`,
    name: "View_Diagram",
    display: "View.Diagram",
    components: {
        'rect-class': RectClass,
    },
    //inject: [''],
    //mixins: [],
    // props: ['item'],
    data() {
        return {}
    },
    methods: {
        buildLines() {
            const lstCls = this.$root.ListClass
            const lstPos = []
            const points = []
            for (let ii = 0, item; ii < lstCls.length; ii++) {
                item = lstCls[ii]
                if (!item.idTo) continue;
                let idTos = item.idTo.split(',')
                let cTypes = item.connType.split(',')
                let x0 = item.left + 3
                let y0 = item.top
                for (let jj = 0, Jtem; jj < lstCls.length; jj++) {
                    if (jj == ii) continue;
                    Jtem = lstCls[jj]
                    if (Jtem.idTo) continue
                    let iiT = idTos.indexOf(Jtem.id)
                    if (-1 < iiT) {
                        let w0 = item.width
                        let h0 = item.height
                        let x1 = Jtem.left
                        let y1 = Jtem.top
                        let w1 = Jtem.width
                        let h1 = Jtem.height
                        const cType = cTypes[iiT]
                        lstPos.push([[x0, y0, item.id, w0, h0, cType], [x1, y1, Jtem.id, w1, h1]])
                        points.push([[x0, y0, w0, h0, cType], [x1, y1, w1, h1]])
                    }
                }
            }
            console.log(lstPos, points)
            this.$root.ListPos = lstPos
            this.$root.drawLines(points)
        },
    },
    //beforeUnmount() { },
    mounted() {
        this.buildLines()
    },
    updated() {
        this.buildLines()
    },
}