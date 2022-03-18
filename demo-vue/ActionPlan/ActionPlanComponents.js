msActionPlanView = (function(){
    const __rootFolder__ = '../ActionPlan';

    Vue.component('ViewMainGoal', (resolve) => {
        $.get(getPath('ViewMaingoal.html', ['component']), template => {
            resolve({
                template: template,
                props: ["item"],
                data: () => {
                    return {
                        IsExpand: true,
                        
                    };
                },
                computed: { 
                    Subgoals(){
                        const maingoalId = this.item.Id;
                        const lstSub = this.$root.ListSubgoal.filter(s => s.ParentId == maingoalId);
                        return JSON.parse(JSON.stringify(lstSub));
                    }
                },
                watch: {
                    Subgoals(){
                        console.log('ViewMainGoal watch Subgoals')
                    }
                },
                created() {
                    console.log(`ViewMainGoal ${this.item.Name} created`)
                },
                mounted() {
                    console.log(`ViewMainGoal ${this.item.Name} mounted`);
                },                
                updated() {
                    console.log(`ViewMainGoal ${this.item.Name} updated`);
                },
                methods: {
                    onClickExpandCollapse(e){
                        this.IsExpand = !this.IsExpand;
                    },
                    onMoveCallback(evt, originalEvent){
                        ActionPlanApp.DragEvent = evt;
                    },
                    handleSubgoalsChange(e) {
                        if(e.moved) {       // order trong maingoal
                            this.updateDraggMIndexInsideMaingoal(e.moved);
                        }
                        if(e.added) {       // order khac maingoal them vao maingoal 2
                            const iTo = e.added.newIndex;
                           this.addDraggIndexTo(iTo);
                        }
                        if(e.removed) {       // order khac maingoal remove maingoal 1
                            this.updateDraggMIndex(e.removed);
                        }
                        //console.log(`handleSubgoalsChange:`, e);
                    },
                    updateDraggMIndexInsideMaingoal(eAction){
                        const iFrom = eAction.oldIndex;
                        const item = eAction.element;
                        const iTo = eAction.newIndex;

                    },
                    updateDraggMIndex(eAction){
                        const iFrom = eAction.oldIndex;
                        const element = eAction.element;
                        var iTo;

                        if(ActionPlanApp.DragEvent != null && typeof ActionPlanApp.DragEvent == 'object') {
                            iTo = ActionPlanApp.DragEvent.iTo;
                            const groupTo = ActionPlanApp.DragEvent.to;

                            const mainDragDropTo = groupTo.className.split(' ').find(cls => cls.includes('mainDragDrop'));
                            const mainTo = mainDragDropTo ? mainDragDropTo.replace('mainDragDrop', '') : '';
                            //console.log(`mainTo: ${mainTo} \niFrom: ${iFrom} \niTo: ${iTo}`);

                            ActionPlanApp.updateSubgoalToMain(element.Id, {
                                ParentId : mainTo, 
                                IFrom: iFrom, ITo: iTo
                            });
                            ActionPlanApp.DragEvent = null;
                        }
                    },
                    addDraggIndexTo(iTo){
                        if(ActionPlanApp.DragEvent != null && typeof ActionPlanApp.DragEvent == 'object') {
                            ActionPlanApp.DragEvent.iTo = iTo;
                        }
                        console.log(ActionPlanApp.DragEvent, iTo)
                    }
                }
            });
        });
    });

    Vue.component('ViewSubGoal', (resolve) => {
        $.get(getPath('ViewSubgoal.html', ['component']), template => {
            resolve({
                template: template,
                props: ["item"],
                data: () => {
                    return {
                        IsExpand: false,
                        drag: false
                    };
                },
                computed: { 
                    
                },
                created() {
                    console.log(`ViewSubGoal ${this.item.Name} created`)
                },
                mounted() {
                    console.log(`ViewSubGoal ${this.item.Name} mounted`);
                    this.getData();
                },
                updated() {
                    console.log(`ViewSubGoal ${this.item.Name} updated`);
                },
                methods: {
                    getData(){
                        const _this = this;
                        setTimeout(function() {
                            
                        }, 2500);
                    },
                    onClickExpandCollapse(e){
                        console.log('ViewSubGoal onClickExpandCollapse', e.target)
                        this.IsExpand = !this.IsExpand;
                    }
                }
            });
        });
    });
    
    function getPath(fileName, subfolders) {
        var path = __rootFolder__;
        if(subfolders && Array.isArray(subfolders)) {
            subfolders.forEach(function (sub) {
                path += `/${sub}`;
            });
        }
        return `${path}/${fileName}` 
    };
    return {
        getPath : getPath
    }
})();