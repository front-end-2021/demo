$.get(msRoadmap.View.getPath('msRoadmap.html')).done(template => {
    window.RoadmapApp = new Vue({
        el: '#RoadmapApp',
        template: template,
        data: {            
            Maingoals: [],
            Subgoals: [],
            Actions: []
        },
        created() {
            console.log('RoadmapApp created')

            this.getData();

            $(window).resize(function (e) {
                console.log('window resize', e);
            });
            this.$nextTick(function () {
                console.log('nextTick created DOM')
            });
        },
        mounted() {
            console.log('RoadmapApp mounted')
        },
        computed: {
        }, 
        watch: {
            
        },
        provide() {
            return {
                getElementDetail: this.getElementDetail,
            }
        },
        updated() {
            console.log('RoadmapApp updated');

            this.$nextTick(function () {
                console.log('RoadmapApp nextTick updated DOM');
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
            getKendoDropdownList(trg, onchange, src, val){
                if(trg) {
                    var drp = $(trg).data("kendoDropDownList");
                    if(!drp) {
                        $(trg).kendoDropDownList({
                            dataTextField: "Name",
                            dataValueField: "Id",
                            dataSource: src,
                            value: val,
                            change: function(e) {
                                var value = this.value();
                                if(typeof onchange == 'function') onchange(value);
                              }
                        });
                        drp = $(trg).data("kendoDropDownList");
                    }
                    return drp;
                }
            },
            getKendoTimeRange(trg, onChange, date){
                if(trg) {
                    var dp = $(trg).data("kendoDatePicker");
                    if(!dp) {
                        $(trg).kendoDatePicker({
                            value: date, //format: "yyyy/MM/dd",
                            change: function() {
                                var value = this.value();
                                onChange(value);
                            }
                        });
                        dp = $(trg).data("kendoDatePicker");
                    }
                    return dp;
                }
            },
            getElementDetail(id, typeId) {
                console.log('getElementDetail', id, typeId);

            }
        }
    });
});
