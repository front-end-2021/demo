
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
            const tbLeft = document.getElementById('dnb-vwtab-left')
            let x = tbLeft ? tbLeft.offsetWidth : 0
            this.$root.DragElm = {
                Item: this.item,
                offX: off.left - event.clientX - x,
                offY: off.top - event.clientY
            }
        },
        setWidth() {
            let w = this.item.width
            let cW = this.$el.offsetWidth
            cW = Math.ceil(cW)
            if (w != cW) {
                this.item.width = cW
                this.$root.drawLines(this.$root.getPoints())
                this.$root.updateLastArea()
            }
        }
    },
    computed: {
        ExtendsProperty() {
            const item = this.item
            if ('interface' == item.type) return item.Properties
            let idTos = item.idTos
            if (!idTos || !idTos.length) return item.Properties
            idTos = idTos.filter(xx => xx[1].includes('implement'))
            idTos = idTos.map(xx => xx[0])
            if (!idTos.length) return item.Properties
            let lstCls = this.$root.ListClass.filter(xx => 'interface' == xx.type)
            lstCls = lstCls.filter(xx => idTos.includes(xx.id))
            if (!lstCls.length) return item.Properties
            let lstPrp = []
            for (let ii = 0, xx; ii < lstCls.length; ii++) {
                xx = lstCls[ii]
                if (!xx.Properties || !xx.Properties.length) continue;
                for (let jj = 0; jj < xx.Properties.length; jj++) {
                    lstPrp.push(xx.Properties[jj])
                }
            }
            if(!lstPrp.length) return item.Properties
            return [...lstPrp, ...item.Properties]
        },
        ExtendsView() {
            let idTos = this.item.idTos
            if (!idTos || !idTos.length) return null
            idTos = idTos.map(xx => xx[0])
            let lstCls = this.$root.ListClass.filter(xx => idTos.includes(xx.id))
            lstCls = lstCls.map(xx => xx.Name)
            return `${lstCls.join(', ')}`
        },
    },
    mounted() {
        const off = this.$el.getBoundingClientRect()
        this.item.height = off.height
        this.$el.addEventListener('mousedown', this.onMouseDown)
        this.setWidth()
    },
    updated() {
        this.setWidth()

    },
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
            const points = this.$root.getPoints()
            this.$root.drawLines(points)

            this.$root.updateLastArea()
        },
        setWithCanvas() {
            const vwM = document.getElementById('dnb-vw-main')
            if (vwM) {
                const offW = vwM.offsetWidth
                const cv = document.getElementById(`dnb-mcanvas`);
                if (cv.width != offW) {
                    cv.width = offW
                    return true
                }
            }
            return false
        },
    },
    //beforeUnmount() { },
    mounted() {
        this.setWithCanvas()
        this.buildLines()
    },
    updated() {
        if (this.setWithCanvas()) this.buildLines()
    },
}