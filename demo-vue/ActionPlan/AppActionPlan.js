$.get(msActionPlanView.getPath('AppActionPlan.html')).done(template => {
    window.ActionPlanApp = new Vue({
        el: '#AppActionPlan',
        template: template,
        data: {            
            Maingoals: [],
            Subgoals: [],
            Actions: [],
            IsDragDropEnable: true,
            DragEvent: null
        },
        created() {
            console.log('ActionPlanApp created')

            this.getData();

            this.$nextTick(function () {
                console.log('ActionPlanApp nextTick created DOM')
            });
        },
        mounted() {
            console.log('ActionPlanApp mounted');

            this.$nextTick(() => {
                console.log('ActionPlanApp mounted DOM')

            });
        },
        computed: {
        }, 
        watch: {
            
        },
        // provide() {
        //     return {
        //         getElementDetail: this.getElementDetail,
        //     }
        // },
        updated() {
            console.log('ActionPlanApp updated');

            this.$nextTick(function () {
                console.log('ActionPlanApp nextTick updated DOM');
            });
        },
        methods: {
            updateSubgoal(id, option){
                var sub = this.Subgoals.find(s => s.Id == id);
                sub = Object.assign(sub, option);
            },
            getData() {
                console.log('ActionPlanApp getData');
                setTimeout(function() {
                    const mains = msRoadmap.getService().getMaingoals();
                    ActionPlanApp.Maingoals = mains;
                    ActionPlanApp.Subgoals = msRoadmap.getService().getSubgoals();
                    ActionPlanApp.Actions = msRoadmap.getService().getActions();
                }, 2000);
            },
            handleMaingoalsChange(e) {
                const iFrom = e.moved.oldIndex;
                const iTo = e.moved.newIndex;


                console.log(`handleMaingoalsChanged: ${iFrom} -> ${iTo}`, e);
            },
        }
    });
});
