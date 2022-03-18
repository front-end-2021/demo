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
                        Subgoals: [],
                        
                    };
                },
                computed: { 

                },
                created() {
                    console.log('ViewMainGoal created')
                },
                mounted() {
                    console.log('ViewMainGoal mounted');
                    this.getData();
                },
                methods: {
                    getData(){
                        const _this = this;
                        const lstSub = _this.$root.Subgoals.filter(s => s.ParentId == _this.item.Id);
                        _this.Subgoals = lstSub;
                    },
                    onClickExpandCollapse(e){
                        console.log('ViewMainGoal onClickExpandCollapse', e.target)
                        this.IsExpand = !this.IsExpand;
                    },
                    onMoveCallback(evt, originalEvent){
                        console.log(evt)
                        ActionPlanApp.DragEvent = evt;
                        console.log(typeof ActionPlanApp.DragEvent)
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
        
                        console.log(`handleSubgoalsChange:`, e);
                    },
                    updateDraggMIndexInsideMaingoal(eAction){
                        const iFrom = eAction.oldIndex;
                        const item = eAction.element;
                        const iTo = eAction.newIndex;

                    },
                    updateDraggMIndex(eAction){
                        const iFrom = eAction.oldIndex;
                        const item = eAction.element;
                        var iTo;

                        if(ActionPlanApp.DragEvent != null && typeof ActionPlanApp.DragEvent == 'object') {
                            iTo = ActionPlanApp.DragEvent.iTo;
                            const groupFrom = ActionPlanApp.DragEvent.from;
                            const groupTo = ActionPlanApp.DragEvent.to;

                            const mainDragDropFrom = groupFrom.className.split(' ').find(cls => cls.includes('mainDragDrop'));
                            const mainFrom = mainDragDropFrom ? mainDragDropFrom.replace('mainDragDrop', '') : '';
                            const mainDragDropTo = groupTo.className.split(' ').find(cls => cls.includes('mainDragDrop'));
                            const mainTo = mainDragDropTo ? mainDragDropTo.replace('mainDragDrop', '') : '';
                            console.log(mainFrom, mainTo, iFrom, iTo, item);

                            ActionPlanApp.updateSubgoal(item.Id, {ParentId : mainTo});
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
                    console.log('ViewSubGoal created')
                },
                mounted() {
                    console.log('ViewSubGoal mounted');
                    this.getData();
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