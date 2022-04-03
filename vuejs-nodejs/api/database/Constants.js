
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
            const cQuery = `CREATE TABLE IF NOT EXISTS ${User} (${Model.Id} BIGINT, ${Model.FirstName} TEXT, ${Model.LastName} TEXT, ${Model.Email} TEXT, ${Model.DoB} TEXT)`;
            return cQuery;
        }
    }
}