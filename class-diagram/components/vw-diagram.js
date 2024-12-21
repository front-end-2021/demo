
const RectClass = {
    template: `#tmp-rect-class`,
    name: "Rect_Class",
    display: "Rect.Class",
    props: ['item'],
    methods: {
        getProperty(prp) {
            const space = ` `
            let acModify = prp[0]
            let name = prp[1]
            let type = prp[2]
            let txt = `${acModify}${space}${type}${space}${name}`
            if (name.toLowerCase().includes('get'))
                txt = `${acModify}${space}${name}:${space}${type}`
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
        let lstCls = [
            {
                id: 'cls-account', top: 30, left: 90, width: 220, height: 100,
                idTo: 'cls-contact',
                Name: 'Account', Fields: [
                    { AcModify: '#', Name: 'name', Type: 'String' },
                    { AcModify: '#', Name: 'emailAddress', Type: 'String' },
                ], Properties: [
                    ['+', 'GetName()', 'String'],
                    ['+', 'SetName(String)', 'void'],
                    ['+', 'GetEmailAddress()', 'String'],
                    ['+', 'SetEmailAddress(String)', 'void'],
                ]
            },
            {
                id: 'cls-contact', top: 70, left: 680, width: 210, height: 100,
                Name: 'Contact', Fields: [
                    { AcModify: '#', Name: 'name', Type: 'String' },
                    { AcModify: '#', Name: 'emailAddress', Type: 'String' },
                    { AcModify: '', Name: 'faxNumber', Type: 'String' },
                ], Properties: [
                    ['+', 'GetName()', 'String'],
                    ['+', 'SetName(String)', 'void'],
                    ['+', 'GetEmailAddress()', 'String'],
                    ['+', 'SetEmailAddress(String)', 'void'],
                    ['+', 'GetFaxNumber()', 'Number'],
                    ['+', 'SetFaxNumber(Number)', 'void'],
                ]
            },
        ]
        return {
            ListClass: lstCls,
        }
    },
    methods: {
        drawLines() {
            const lstCls = this.ListClass
            const lstPos = []
            for (let ii = 0, item; ii < lstCls.length; ii++) {
                item = lstCls[ii]
                if (!item.idTo) continue;

                let x0 = item.left + 3
                let y0 = item.top
                for (let jj = ii + 1, Jtem; jj < lstCls.length; jj++) {
                    Jtem = lstCls[jj]
                    if (Jtem.idTo) continue
                    if (item.idTo == Jtem.id) {
                        let w0 = item.width
                        let h0 = item.height
                        let x1 = Jtem.left
                        let y1 = Jtem.top
                        let w1 = Jtem.width
                        let h1 = Jtem.height
                        lstPos.push([[x0, y0, item.id, w0, h0], [x1, y1, Jtem.id, w1, h1]])
                    }
                }
            }
            //console.log(lstPos)
            this.$root.ListPos = lstPos
        },
    },
    //beforeUnmount() { },
    mounted() {
        this.drawLines()
    },
    updated() {
        this.drawLines()
    },
}