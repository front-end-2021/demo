$.get(msRoadmap.View.getPath('msRoadmap.html')).done(template => {
    window.RoadmapApp = new Vue({
        el: '#RoadmapApp',
        template: template,
        data: {            
            Maingoals: [],
            Subgoals: [],
            Actions: [],
            Account: {
                Email: 'dainb@kloon.vn'
            }
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
            console.log('RoadmapApp mounted');

            this.$nextTick(() => {
                console.log('RoadmapApp mounted DOM')

                this.getKendoWindow('#dialog', this.$el, 
                {
                    activate: function() {
                        const account = JSON.parse(JSON.stringify(RoadmapApp.Account));
                        const thisWindow = this;
                        const $body = thisWindow.element.find('iframe').contents();
                        const $inputEmail = $body.find((`input[type=email][name=email]`));
                        $inputEmail.val(account.Email);
                        
                        const $inputPass = $body.find((`input[type=password][name=pass]`));
                        
                        const $btnLogin = $body.find(`input.login100-form-btn[type=submit]`);
                        $btnLogin.click(function(e){
                            console.log('window dialog btnLogin click')
                            console.log(thisWindow, $inputEmail.val(), $inputPass.val())

                        });
                    }, 
                    close: function(e){
                        const account = JSON.parse(JSON.stringify(RoadmapApp.Account));
                        const $body = this.element.find('iframe').contents();
                        const $inputEmail = $body.find((`input[type=email][name=email]`));
                        const $inputPass = $body.find((`input[type=password][name=pass]`));
                        console.log($inputEmail.val(), $inputPass.val())
                    }
                }).open();
            });
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
            getKendoWindow(selector, this_$el, option){
                this_$el = this_$el || this.$el;
                const $window = $(this_$el.querySelector(selector));
                var kWindow = $window.data("kendoWindow");
                if(!kWindow) {
                    option = option || {};
                    option = Object.assign({
                        title: 'Login form',
                        content: {
                            //url: "https://colorlib.com/etc/lf/Login_v18/index.html"
                            url: "./login/Login V18.html", iframe: true
                        },
                        modal:true, visible: false,
                        animation: {
                            close: { effects: "fade:out" }
                        },
                        width: 900, height: 768
                    }, option);
                    $window.kendoWindow(option);
                    kWindow = $window.data("kendoWindow");
                    kWindow.center();
                };
                return kWindow;
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
