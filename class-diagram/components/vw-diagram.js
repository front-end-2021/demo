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
        
    },
}