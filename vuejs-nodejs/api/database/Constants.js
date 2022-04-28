const global = require('./Global')

module.exports = {
    DbNameObj: {
        Account: 'Account',
        Project: 'Project'
    },
    AccountRole: {
        getName: function () {return 'AccountRole'},
        getModel: function (){
            const modelCM = global.getModelCM();
            return Object.assign({
                Id: 'Id',
                AccountId: 'AccountId',
                RoleId: 'RoleId',
                ProjectGroupId: 'ProjectGroupId',
                ProjectId: 'ProjectId',
                StrategyId: 'StrategyId'
            }, modelCM) 
        },
        queryCreateTable: function () {
            const Acc = this.getName();
            const Model = this.getModel();
            const cols1 = `${global.getQueryIntAutoIncrease(Model.Id)}, ${Model.AccountId} INTEGER, ${Model.RoleId} INTEGER`;
            const cols2 = `${Model.ProjectGroupId} INTEGER, ${Model.ProjectId} INTEGER, ${Model.StrategyId} INTEGER`;
            return `${global.getQueryCreateTable(Acc)} (${cols1}, ${cols2}, ${global.getColumnsCM()})`;
        },
        queryInsert: function () {
            const User = this.getName();
            const Model = this.getModel();
            return global.getQueryInsert(User, Model.AccountId, Model.RoleId, Model.ProjectGroupId, Model.ProjectId, Model.StrategyId, Model.CreatedBy, Model.CreatedDate, Model.ModifiedBy, Model.ModifiedDate);
        }
    },
    Project: {
        getProject: function () { return 'Project'},
        getProjectGroup: function () { return 'ProjectGroup'},
        getModel: function () {
            const projectGroupM = global.getBaseModel();
            const projectM = Object.assign({
                ProjectGroupId: 'ProjectGroupId', PriorityGroupName: 'PriorityGroupName',
                StartYear: 'StartYear', EndYear: 'EndYear'
            }, projectGroupM);
            return {
                Project: projectM, 
                ProjectGroup: projectGroupM
            }
        },
        queryCreateTable: function (tableName) {
            if(tableName == this.getProject()) {
                const Model = this.getModel().Project;
                const cols1 = `${global.getQueryIntAutoIncrease(Model.Id)}, ${Model.Name} ${global.SqDType.TEXT}, ${Model.ProjectGroupId} ${global.SqDType.INT}`;
                const cols3 = `${Model.StartYear} ${global.SqDType.INT}, ${Model.EndYear} ${global.SqDType.INT}`;
                const cols4 = `${Model.MIndex} ${global.SqDType.INT} NOT NULL, ${Model.PriorityGroupName} ${global.SqDType.TEXT}`;
                return `${global.getQueryCreateTable(tableName)} (${cols1}, ${global.getColumnsCM()}, ${cols3}, ${cols4})`;
            }
            if(tableName == this.getProjectGroup()) {
                const Model = this.getModel().ProjectGroup;
                const cols1 = `${global.getQueryIntAutoIncrease(Model.Id)}, ${Model.Name} ${global.SqDType.TEXT}, ${Model.MIndex} ${global.SqDType.INT} NOT NULL`;
                return `${global.getQueryCreateTable(tableName)} (${cols1}, ${global.getColumnsCM()})`;
            }
        },
        querySelect: function (tableName, whereSelect) {
            var Table, columns;
            if(tableName == this.getProject()) {
                Table = this.getProject()
                const Model = this.getModel().Project;
                columns = `${Model.Id}, ${Model.MIndex}, ${Model.Name}, ${Model.CreatedDate}, ${Model.StartYear}`
                columns += `, ${Model.EndYear}, ${Model.ProjectGroupId}, ${Model.PriorityGroupName}, ${Model.ModifiedDate}`
            } else if(tableName == this.getProjectGroup()) {
                Table = this.getProjectGroup()
                const Model = this.getModel().ProjectGroup;
                columns = `${Model.Id}, ${Model.MIndex}, ${Model.Name}, ${Model.CreatedDate}`
            }
            var where = whereSelect ? whereSelect : '';
            return `SELECT ${columns} FROM ${Table} ${where}`;
        }
    },
    User: {
        getName: function () {return 'User'},
        getModel: function () {
            return {
                Id: 'Id',
                FirstName: 'FirstName',
                LastName: 'LastName',
                Email: 'Email',
                DoB: 'DateOfBirth'
            }
        },
        queryCreateTable: function () {
            const User = this.getName();
            const Model = this.getModel();
            const columns = `${global.getQueryIntAutoIncrease(Model.Id)}, ${Model.FirstName} TEXT, ${Model.LastName} TEXT, ${Model.Email} TEXT, ${Model.DoB} TEXT`;
            return `${global.getQueryCreateTable(User)} (${columns})`;
        },
        queryInsert: function () {
            const User = this.getName();
            const Model = this.getModel();
            return global.getQueryInsert(User, Model.FirstName, Model.LastName, Model.Email, Model.DoB);
        },
        querySelect: function (whereSelect) {
            const Model = this.getModel();
            const TbUser = this.getName();
            var where = whereSelect ? whereSelect : '';
            return `SELECT ${Model.Id} Id, ${Model.FirstName}, ${Model.LastName}, ${Model.Email} FROM ${TbUser} ${where}`;
        }
    }
}