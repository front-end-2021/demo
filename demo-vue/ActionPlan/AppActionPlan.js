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
            ListSubgoal(){
                const subgoals = this.Subgoals.sort(function(a, b){
                    return a.MIndex - b.MIndex;
                });
                return subgoals;
            }
        }, 
        watch: {
            Maingoals(){
                console.log('ActionPlanApp watch Maingoals')
            },
            ListSubgoal(){
                console.log('ActionPlanApp watch ListSubgoal')
            }
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
            updateSubgoalToMain(id, option){
                var subs = this.ListSubgoal.filter(s => s.ParentId == option.ParentId);
                subs = JSON.parse(JSON.stringify(subs));

                var sub = this.ListSubgoal.find(s => s.Id == id);
                if(sub) {
                    const MIndex1 = sub.MIndex;
                    var MIndex2 = subs.find((s, i) => { return i == option.ITo });
                    if(typeof MIndex2 == 'object') {
                        MIndex2 = MIndex2.MIndex;
                    } else if(subs.length > 0) {
                        MIndex2 = subs[subs.length - 1].MIndex;
                    }

                    var subs2 = this.ListSubgoal.filter(s => s.ParentId == sub.ParentId);
                    subs2 = JSON.parse(JSON.stringify(subs2));

                    if(MIndex1 > MIndex2) {
                        subs2 = subs2.filter((s, i) => {
                            return i < option.IFrom;
                        });
                    } else {
                        subs2 = subs2.filter((s, i) => {
                            return i > option.IFrom;
                        });
                    }                   
                    
                    sub.ParentId = option.ParentId;     // ref
                    sub = JSON.parse(JSON.stringify(sub));
                    

                    var newSubs = JSON.parse(JSON.stringify(subs));
                    newSubs.splice(option.ITo, 0, sub);
                    if(MIndex1 > MIndex2) newSubs = newSubs.concat(subs2);
                    else newSubs = subs2.concat(newSubs);

                    const LstMIndex = newSubs.map(s => s.MIndex);
                    const NewLstMIndex = LstMIndex.sort(function(a, b){ return a - b; });
                    newSubs.forEach((s, i) => {
                        s.MIndex = NewLstMIndex[i];
                    });

                    this.Subgoals.filter(s => {
                        const sg = newSubs.find(ss => ss.Id == s.Id);
                        if(sg){
                            s.MIndex = sg.MIndex;
                            s.ParentId = sg.ParentId;
                        }
                        return true;
                    });

                    console.log(MIndex1, MIndex2);
                    console.log(subs, subs2, newSubs);
                    console.log(NewLstMIndex, NewLstMIndex, option);
                }
            },
            getData() {
                console.log('ActionPlanApp getData');
                setTimeout(function() {
                    const mains = msRoadmap.getService().getMaingoals();
                    ActionPlanApp.Maingoals = mains;
                    ActionPlanApp.Subgoals = msRoadmap.getService().getSubgoals();
                    ActionPlanApp.Actions = msRoadmap.getService().getActions();

                    setTimeout(function() {
                        ActionPlanApp.Subgoals = msRoadmap.getService().getSubgoals(2);
                    }, 1500);
                }, 1000);
            },
            handleMaingoalsChange(e) {
                const iFrom = e.moved.oldIndex;
                const iTo = e.moved.newIndex;


                console.log(`handleMaingoalsChanged: ${iFrom} -> ${iTo}`, e);
            },
        }
    });
});
