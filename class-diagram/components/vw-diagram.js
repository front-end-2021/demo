import { drawExtension } from "../mcanvas.js";
const RectClass = {
    template: `#tmp-rect-class`,
    name: "Rect_Class",
    display: "Rect.Class",
    props: ['item'],
    data() {
        return {
            top: this.top,
            left: this.left,
        }
    },
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
        this.$el.addEventListener('mousedown', this.onMouseDown)
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
        let lstCls = [
            {
                id: 'cls-account', top: 30, left: 90, width: 220,
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
                id: 'cls-contact', top: 70, left: 680, width: 210,
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
            }
        ]
        return {
            ListClass: lstCls
        }
    },
    methods: {
        addTodo() {
            const lstT = this.item.Todos
            lstT.push(`Todo ${lstT.length + 1}`)
        },
    },
    beforeUnmount() {

    },
    mounted() {
        let lstCls = this.ListClass
        let clsAccount = document.getElementById('cls-account')
        let clsContact = document.getElementById('cls-contact')
        const c = document.getElementById(`dnb-mcanvas`);
        let offC = c.getBoundingClientRect()
        const rootY = offC.top
        const rootX = offC.left
        let offAcc = clsAccount.getBoundingClientRect()
        let offCon = clsContact.getBoundingClientRect()
        let x0 = 60, y0 = 60;
        let x1 = 200, y1 = 100;
        x0 = offAcc.left + offAcc.width - rootX
        y0 = offAcc.top + offAcc.height / 10 - rootX

        x1 = offCon.left - rootY
        y1 = offCon.top + offCon.height / 10 - rootY
        var ctx = c.getContext("2d");
        let p0 = [x0, y0];
        let p1 = [x1, y1];

        drawExtension.call(ctx, p0, p1, 8)
        //  drawExtension.call(ctx, [80, 300], [120, 50], 8)
    },
}