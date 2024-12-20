import { drawExtension } from "../mcanvas.js";

export const ViewDiagram = {
    template: `#tmp-vw-diagram`,
    name: "View_Diagram",
    display: "View.Diagram",
    //inject: [''],
    //mixins: [],
    // props: ['item'],
    methods: {
        addTodo() {
            const lstT = this.item.Todos
            lstT.push(`Todo ${lstT.length + 1}`)
        },
    },
    beforeUnmount() {

    },
    mounted() {
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