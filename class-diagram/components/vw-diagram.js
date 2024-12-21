
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
            let returnType = prp[3]
            let txt = `${acModify}${space}${type}${space}${name}`
            if (returnType.toLowerCase().includes('get'))
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
                    ['+', 'GetName()', 'String', 'get'],
                    ['+', 'SetName(String)', 'void', 'set'],
                    ['+', 'GetEmailAddress()', 'String', 'get'],
                    ['+', 'SetEmailAddress(String)', 'void', 'set'],
                ]
            },
            {
                id: 'cls-contact', top: 70, left: 580, width: 210, height: 100,
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
                id: 'cls-animal', top: 70, left: 1024, width: 150, height: 100,
                Name: 'Animal', Fields: [
                    { AcModify: '+', Name: 'age', Type: 'Int' },
                    { AcModify: '+', Name: 'gender', Type: 'String' },
                ], Properties: [
                    ['+', 'IsMammal()', 'Bool', 'get'],
                    ['+', 'Mate()', 'Int', 'get'],
                ]
            },
            {
                id: 'cls-duck', top: 270, left: 880, width: 150, height: 100,
                idTo: 'cls-animal',
                Name: 'Duck', Fields: [
                    { AcModify: '+', Name: 'beakColor', Type: 'String' },
                ], Properties: [
                    ['+', 'Swim()', 'void', 'set'],
                    ['+', 'Quack()', 'void', 'set'],
                ]
            },
            {
                id: 'cls-zebra', top: 270, left: 880 + 200, width: 150, height: 100,
                idTo: 'cls-animal',
                Name: 'Zebra', Fields: [
                    { AcModify: '+', Name: 'isWild', Type: 'String' },
                ], Properties: [
                    ['+', 'Run()', 'void', 'set'],
                ]
            },
        ]
        return {
            ListClass: lstCls,
        }
    },
    methods: {
        buildLines() {
            const lstCls = this.ListClass
            const lstPos = []
            const points = []
            for (let ii = 0, item; ii < lstCls.length; ii++) {
                item = lstCls[ii]
                if (!item.idTo) continue;

                let x0 = item.left + 3
                let y0 = item.top
                for (let jj = 0, Jtem; jj < lstCls.length; jj++) {
                    if(jj == ii) continue;
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
                        points.push([[x0, y0, w0, h0], [x1, y1, w1, h1]])
                    }
                }
            }
            //console.log(lstPos)
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