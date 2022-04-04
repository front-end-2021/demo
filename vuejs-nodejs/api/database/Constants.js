
module.exports = {
    DbNameObj: {
        Account: 'Account'
    },
    User: {
        getName: function() {return 'User'},
        getModel: function() {
            return {
                Id: 'Id',
                FirstName: 'FirstName',
                LastName: 'LastName',
                Email: 'Email',
                DoB: 'DateOfBirth'
            }
        },
        queryCreateTable: function() {
            const User = this.getName();
            const Model = this.getModel();
            const cQuery = `CREATE TABLE IF NOT EXISTS ${User} (${Model.Id} INTEGER PRIMARY KEY AUTOINCREMENT, ${Model.FirstName} TEXT, ${Model.LastName} TEXT, ${Model.Email} TEXT, ${Model.DoB} TEXT)`;
            return cQuery;
        },
        queryInsert: function(){
            const User = this.getName();
            const Model = this.getModel();
            const field = `${Model.FirstName}, ${Model.LastName}, ${Model.Email}, ${Model.DoB}`;
            const iQuery = `INSERT INTO ${User}(${field}) VALUES(?, ?, ?, ?)`;
            return iQuery;
        },
        querySelect: function(whereSelect){
            const Model = this.getModel();
            const TbUser = this.getName();
            var where = whereSelect ? whereSelect : '';
            const sQuery = `SELECT ${Model.Id} Id, ${Model.FirstName} FirstName, ${Model.LastName} LastName, ${Model.Email} Email FROM ${TbUser} ${where}`;
            return sQuery;
        }
    }
}