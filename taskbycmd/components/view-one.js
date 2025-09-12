
export const ViewOne = {
    template: `#tmp-view-one`,
    name: "View_One",
    display: "View.One",
    data(){
        return {
            ViewType: 1, // 1 = view group, 2 = view list
            ListGroup: [],
        }
    },
    methods: {
        buildListGroup(){
            const root = this.$root
            
        },
    },
}