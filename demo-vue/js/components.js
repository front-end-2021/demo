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
    Vue.component('Filter', (resolve) => {
        $.get( getPath('Filter.html'), template => {
            resolve({
                template: template,
                props: ["subFilter"],
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
