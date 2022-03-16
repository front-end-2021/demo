$.get(msRoadmap.View.getPath('msRoadmap.html')).done(template => {
    window.RoadmapApp = new Vue({
        el: '#RoadmapApp',
        template: template,
        data: {
            Cache: {
                TimeRangeTypeVal: -1,
                TimeRangeStart: null,
                TimeRangeEnd: null
            },
            Maingoals: [],
            Subgoals: [],
            Actions: []
        },
        created() {
            console.log('created')

            this.getData();

            $(window).resize(function (e) {
                console.log('window resize', e);
            });
            this.$nextTick(function () {
                console.log('nextTick created DOM')
            });
        },
        mounted() {
            console.log('mounted')
        },
        computed: {
            IsSharepoint() {
                
            },
        }, 
        watch: {
            'Cache.TimeRangeStart'(newCache, oldCache){
                console.log(`Cache.TimeRangeStart: ${oldCache} => ${newCache}`);
            },
            'Cache.TimeRangeEnd'(newCache, oldCache){
                console.log(`Cache.TimeRangeEnd: ${oldCache} => ${newCache}`);
            },
            'Cache.TimeRangeTypeVal'(newCache, oldCache){
                console.log(`Cache.TimeRangeTypeVal: ${oldCache} => ${newCache}`);
            },
        },
        provide() {
            return {
                getElementDetail: this.getElementDetail,
            }
        },
        updated() {
            console.log('updated');

            this.$nextTick(function () {
                console.log('nextTick updated DOM');
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
            getElementDetail(id, typeId) {
                console.log('getElementDetail', id, typeId);

            }
        }
    });
});
