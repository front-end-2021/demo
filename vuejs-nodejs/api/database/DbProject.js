const Constants = require('./Constants');
const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');

InitProject();

function InitProject() {
    const db = openTheDatabase(Constants.DbNameObj.Project);
    db.serialize(() => {
        var query = Constants.Project.queryCreateTable(Constants.Project.getProject());
        db.run(query);
        var query = Constants.Project.queryCreateTable(Constants.Project.getProjectGroup());
        db.run(query);
    });
    db.close();
}

module.exports = {
    getAllUsers: getAllUsers,
    getUser: getUser,
    insertUser: insertUser
}