const Constants = require('./Constants');
const global = require('./Global')

InitProject();

function InitProject() {
    const db = global.openTheDatabase(Constants.DbNameObj.Project);
    db.serialize(() => {
        var query = Constants.Project.queryCreateTable(Constants.Project.getProject());
        db.run(query);
        var query = Constants.Project.queryCreateTable(Constants.Project.getProjectGroup());
        db.run(query);
    });
    db.close();
}

function getProjectGroups(){
    return global.runQuery(Constants.DbNameObj.Project, function(db, resolve){
        const Project = Constants.Project;
        const Model = Project.getModel().ProjectGroup;
        const sql = `${Project.querySelect(Project.getProjectGroup())} ORDER BY ${Model.MIndex}`;
        db.all(sql, (err, rows) => {
            if (err) { throw err; } 
            else { resolve(rows); }
        });
    });
}
function getProjects(){
    return global.runQuery(Constants.DbNameObj.Project, function(db, resolve){
        const Project = Constants.Project;
        const Model = Project.getModel().Project;
        const sql = `${Project.querySelect(Project.getProject())} ORDER BY ${Model.MIndex}`;
        db.all(sql, (err, rows) => {
            if (err) { throw err; } 
            else { resolve(rows); }
        });
    });
}

module.exports = {
    getProjectGroups: getProjectGroups,
    getProjects: getProjects
}