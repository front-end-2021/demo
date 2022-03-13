const msRoadmap = {
    getService: function(){
        function getMaingoals () {
            return [
                {Id: '5cab2f37-f50e-4b3e-8c4f-a88a75284ea5', TypeId: 1, Name: 'Main goal 1'},
                {Id: '5cab2f37-f50e-4b3e-8c4f-a88a75284ea9', TypeId: 1, Name: 'Main goal 2'}
            ];
        }
        function getSubgoals () {
            return [
                {Id: '1ee4e327-9c06-4bbb-9c72-86cc0f95954d', TypeId: 2, Name: 'Main 1 / Sub goal 1', ParentId: '5cab2f37-f50e-4b3e-8c4f-a88a75284ea5'},
                {Id: '1ee4e327-9c06-4bbb-9c72-86cc0f9595fd', TypeId: 2, Name: 'Main 1 /Sub goal 2', ParentId: '5cab2f37-f50e-4b3e-8c4f-a88a75284ea5'}
            ];
        }
        function getActions () {
            return [
                {Id: 'e24ef4fb-b166-4afa-95e5-37ade8cea728', TypeId: 3, Name: 'Main 1 / Sub goal 1 / Action 1', ParentId: '1ee4e327-9c06-4bbb-9c72-86cc0f95954d'},
                {Id: 'ecfc2c7a-b096-4fb0-977a-8152b1d1661a', TypeId: 3, Name: 'Main 1 / Sub goal 2 / Action 2', ParentId: '1ee4e327-9c06-4bbb-9c72-86cc0f9595fd'}
            ];
        }

        return {
            getMaingoals: getMaingoals, getSubgoals: getSubgoals, getActions: getActions
        }
    }
}

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
