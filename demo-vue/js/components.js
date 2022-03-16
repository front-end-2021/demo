msRoadmap.View = (function () {
    const __rootFolder__ = '../component';

    Vue.component('BrandAndUser', (resolve) => {
        $.get( getPath('BrandAndUser.html'), template => {
            resolve({
                template: template,
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
                    }
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
                        IsShow: true,
                        TimeRangeTypeSrc: trTypeSrc,
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
                    TimeRange() {
                        const typeVal = this.$root && this.$root.Cache ? this.$root.Cache.TimeRangeTypeVal : -1;
                        const start = this.$root && this.$root.Cache ? this.$root.Cache.TimeRangeStart : null;
                        const end = this.$root && this.$root.Cache ? this.$root.Cache.TimeRangeEnd : null;
                        return {
                            TypeVal: typeVal, Start: start, End: end
                        }
                    }
                 },
                mounted() {
                    this.getData();
                    this.getKendoTimeRangeType();
                    this.getKendoTimeRangeStart(this.$root);
                    this.getKendoTimeRangeEnd(this.$root);
                },
                methods: {
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
                            var datepicker = _this.getKendoTimeRangeStart(_this.$root);
                            if(datepicker) {
                                datepicker.value(serverData.Start);
                                datepicker.trigger("change");
                            }
                            datepicker = _this.getKendoTimeRangeEnd(_this.$root);
                            if(datepicker) {
                                datepicker.value(serverData.End);
                                datepicker.trigger("change");
                            }

                            const trTypeSrc = JSON.parse(JSON.stringify(_this.TimeRangeTypeSrc)).concat(serverData.TimeRangeSrc);
                            const drp = _this.getKendoTimeRangeType();
                            if(drp) {
                                drp.setDataSource(trTypeSrc);
                                drp.refresh();
                            }
                            _this.TimeRangeTypeSrc = trTypeSrc;

                            console.log(_this.TimeRange)
                        }
                    },
                    getKendoTimeRangeType(){
                        const trId = this.TimeRangeId.TypeId;
                        const trg = this.$el.querySelector(`#${trId}`);
                        if(trg) {
                            var drp = $(trg).data("kendoDropDownList");
                            if(!drp) {
                                const trTypeSrc = this.TimeRangeTypeSrc;
                                const val = this.TimeRange.TypeVal;
                                $(trg).kendoDropDownList({
                                    dataTextField: "Name",
                                    dataValueField: "Id",
                                    dataSource: trTypeSrc,
                                    value: val,
                                    change: function(e) {
                                        var value = this.value();
                                        (!!RoadmapApp) && (RoadmapApp.Cache.TimeRangeTypeVal = value);
                                      }
                                });
                                drp = $(trg).data("kendoDropDownList");
                            }
                            return drp;
                        }
                        
                    },
                    getKendoTimeRangeStart(root){
                        const trId = this.TimeRangeId.StartId;
                        const trg = this.$el.querySelector(`#${trId}`);
                        return this.getKendoTimeRange(trg, function(value){
                            (root && root.Cache) && (root.Cache.TimeRangeStart = value);
                        }, this.TimeRange.Start);
                    },
                    getKendoTimeRangeEnd(root){
                        const trId = this.TimeRangeId.EndId;
                        const trg = this.$el.querySelector(`#${trId}`);
                        return this.getKendoTimeRange(trg, function(value){
                            (root && root.Cache) && (root.Cache.TimeRangeEnd = value);
                        }, this.TimeRange.End);
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
