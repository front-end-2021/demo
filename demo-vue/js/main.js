var RoadmapApp;
$.get(msRoadmap.View.getPath('msRoadmap.html')).done(template => {
    RoadmapApp = new Vue({
        el: '#RoadmapApp',
        template: template,
        data: {
            Maingoals: [],
            Subgoals: [],
            Actions: []
        },
        created() {
            console.log('created')

            this.getData();

            $(window).resize(function (e) {
                console.log('window resize');
            });
            this.$nextTick(function () {
                console.log('created DOM')
            });
        },
        mounted() {
            console.log('mounted')
        },
        computed: {
            IsSharepoint() {
                
            },
        }, //watch: {},
        provide() {
            return {
                getElementDetail: this.getElementDetail,
            }
        },
        updated() {
            this.$nextTick(function () {
                console.log('updated DOM')
            });
        },
        methods: {            
            getData() {
                console.log('getData');
                setTimeout(function() {
                    RoadmapApp.Maingoals = msRoadmap.getService().getMaingoals();
                    RoadmapApp.Subgoals = msRoadmap.getService().getSubgoals();
                    RoadmapApp.Actions = msRoadmap.getService().getActions();
                }, 2000);
            },
            getElementDetail(id, typeId){
                console.log('getElementDetail', id, typeId);

            }
        }
    });
});
