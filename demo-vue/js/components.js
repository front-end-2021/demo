msRoadmap.View = (function () {
    const __rootFolder__ = '../../demo-vue/component';

    Vue.component('BrandAndUser', (resolve) => {
        $.get( getPath('BrandAndUser.html'), template => {
            resolve({
                template: template,
                inject: ['openLoginWindow'],
                data: () => {
                    return {
                        LblProject: 'Project',
                        LblStrategy: 'Strategy',
                        Projects: [],
                        Strategies: [],
                        ActivePrj: -1,
                        ActiveStrg: -1
                    };
                },
                computed: { 
                    DisplayProject(){
                        const aP = this.ActivePrj;
                        const p = this.Projects.find(pr => pr.Id == aP) || {Name: '...'};                        
                        return p;
                    },
                    DisplayStrategy(){
                        const aS = this.ActiveStrg;
                        const s = this.Strategies.find(st => st.Id == aS) || {Name: '...'};                        
                        return s;
                    },
                    UserLoginId(){
                        return `userLogin-${Date.now()}`
                    }
                },
                mounted() {
                    this.getData();
                },
                methods: {
                    getData(){
                        const _this = this;
                        setTimeout(function() {
                            _this.LblProject = 'Projekt';
                            _this.LblStrategy = 'Strategie';
                            _this.Projects = [{Id: 62811, Name: 'Roadmap tick Label'}];
                            _this.Strategies = [{Id: 65603, Name: 'Marketingstrategie'}];
                            _this.ActivePrj = 62811;
                            _this.ActiveStrg = 65603;
                        }, 2500);
                    },
                    onOpenLoginWindow(e){
                        const queryId = `#${this.UserLoginId}`;
                        const thisRef = this;
                        this.openLoginWindow(queryId, function onDestroy (){
                            let div = thisRef.$el.querySelector(queryId);
                            if(div) return;
                            div = document.createElement("div");
                            div.id = thisRef.UserLoginId;
                            thisRef.$el.append(div);
                        });

                    },
                }
            });
        });
    });
    Vue.component('SubMenu', (resolve) => {
        $.get( getPath('SubMenu.html'), template => {
            resolve({
                template: template,
                data: () => {
                    return {
                        Labels: ['...'],
                        ActiveIndex: -1,
                        Evaluation: 'Evaluation'
                    };
                },
                computed: { },
                mounted() {
                    this.getData();
                },
                methods: {
                    getData(){
                        const _this = this;
                        setTimeout(function() {
                            _this.Labels = ['Markt Marktsegmentstrategie', 'Teilmarkt / Produktstrategie', 'Massnahmenplan', 'Marketingmix / Einsatzplanung', 'Roadmap', 'Team Board', 'Dashboard'];
                            _this.ActiveIndex = 3;
                            _this.Evaluation = 'Auswertung';
                        }, 1000);
                    }
                }
            });
        });
    });
    Vue.component('mFilter', (resolve) => {
        $.get( getPath('Filter.html'), template => {
            resolve({
                template: template,
             //   props: ["subFilter"],
                data: () => {
                    const trTypeSrc = [
                        {Id: 0, Name: 'Show all'}, 
                        {Id: -1, Name: 'individual'}
                    ];
                    
                    return {
                        Timerange: {
                            TypeValue: -1,
                            Start: null,
                            End: null,
                            TypeSource: trTypeSrc
                        },
                        IsShow: true,
                        Criterials: [],
                        SelectionSources: [],
                    }
                },
                computed: {
                    TimeRangeId(){
                        const dateNow = Date.now();
                        return {
                            TypeId: 'dnbTimeRangeType' + dateNow,
                            StartId: 'dnbTimeRangeStart' + dateNow,
                            EndId: 'dnbTimeRangeEnd' + dateNow
                        }
                    },
                    ButtonShowHide(){
                        if(this.IsShow) return 'Hide Filter';
                        return 'Show Filter';
                    },
                 },
                mounted() {
                    this.getData();
                    this.$nextTick(() => {
                        this.getKendoTimeRangeType(this.Timerange);
                        this.getKendoTimeRangeStart(this.Timerange);
                        this.getKendoTimeRangeEnd(this.Timerange);
                    });
                },
                watch: {
                    'Timerange.TypeValue'(newCache, oldCache){
                        console.log(`(mFilter) Timerange.TypeValue: ${oldCache} => ${newCache}`);
                    },
                    'Timerange.Start'(newCache, oldCache){
                        console.log(`(mFilter) Timerange.Start: ${oldCache} => ${newCache}`);
                    },
                    'Timerange.End'(newCache, oldCache){
                        console.log(`(mFilter) Timerange.End: ${oldCache} => ${newCache}`);
                    },
                },
                methods: {
                    callService(){
                        const timerange = JSON.parse((JSON.stringify(this.Timerange)));

                        console.log(`(mFilter) call Service: \nTime Range = ${JSON.stringify(timerange)}`);
                    },
                    getData(){
                        const _this = this;
                        setTimeout(function() {
                            const serverData = {
                                TimeRangeSrc: [{Id: 2022, Name: "2022"}],
                                Start: new Date(2022, 0, 01), 
                                End: new Date(2024, 2, 01)
                            }
                            testUpdateTimeRange(serverData);
                            
                        }, 1500);

                        function testUpdateTimeRange(serverData){
                            var datepicker = _this.getKendoTimeRangeStart();
                            if(datepicker) {
                                datepicker.value(serverData.Start);
                                datepicker.trigger("change");
                            }
                            datepicker = _this.getKendoTimeRangeEnd();
                            if(datepicker) {
                                datepicker.value(serverData.End);
                                datepicker.trigger("change");
                            }

                            const trTypeSrc = JSON.parse(JSON.stringify(_this.Timerange.TypeSource)).concat(serverData.TimeRangeSrc);
                            _this.updateTimerangeTypeSource(trTypeSrc);

                            console.log(_this.Timerange)
                        }
                    },
                    updateTimerangeTypeSource(src){
                        const drp = this.getKendoTimeRangeType();
                        if(drp) {
                            drp.setDataSource(src);
                            drp.refresh();
                        }
                        this.Timerange.TypeSource = src;

                    },
                    getKendoTimeRangeType(timerange){
                        const trId = this.TimeRangeId.TypeId;
                        const trg = this.$el.querySelector(`#${trId}`);
                        const onChange = timerange ? function(value){
                            timerange.TypeValue = value;
                        } : null;
                        const src = timerange ? timerange.TypeSource : [];
                        const val = timerange ? timerange.TypeValue : 0;
                        return this.$root.getKendoDropdownList(trg, onChange, src, val);                        
                    },                    
                    getKendoTimeRangeStart(timerange){
                        const trId = this.TimeRangeId.StartId;
                        const trg = this.$el.querySelector(`#${trId}`);
                        const onChange = timerange ? function(value){
                            timerange.Start = value;
                        } : null;
                        const start = timerange ? timerange.Start : null;
                        return this.$root.getKendoTimeRange(trg, onChange, start);
                    },
                    getKendoTimeRangeEnd(timerange){
                        const trId = this.TimeRangeId.EndId;
                        const trg = this.$el.querySelector(`#${trId}`);
                        const onChange = timerange ? function(value){
                            timerange.End = value;
                        } : null;
                        const end = timerange ? timerange.End : null;
                        return this.$root.getKendoTimeRange(trg, onChange, end);
                    },
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
