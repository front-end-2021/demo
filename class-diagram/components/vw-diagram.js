
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
            const lstAr = this.item.idTos
            if(!lstAr || !lstAr.length) return

            let iiT = lstAr.findIndex(x => x[1] == 'implement')
            if (iiT < 0) return
            
            const idI = lstAr[iiT][0]
            if (!idI) return

            const lstCls = this.$root.ListClass
            return lstCls.find(x => idI == x.id)
        },
        ViewName() {
            const item = this.item
            let paIn = this.PaInterface
            if (!paIn) return item.Name
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
            const points = this.$root.getPoints()
            this.$root.drawLines(points)

            this.$root.updateLastArea()
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