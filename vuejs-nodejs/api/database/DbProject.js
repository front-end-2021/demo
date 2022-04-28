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
function insertProjectGroup(entry){
    return global.runQuery(Constants.DbNameObj.Project, function(db, resolve) {
        if(typeof entry == 'object') {
            const prj = Constants.Project;
            const model = prj.getModel().ProjectGroup
            entry = Object.assign(model, entry);
            const query = `INSERT INTO ProjectGroup (Name, MIndex, CreatedBy, CreatedDate)
            SELECT ${entry.Name} Name, MAX(Id) + 1 MIndex, ${entry.CreatedBy} CreatedBy, DATETIME('NOW') CreatedDate FROM ProjectGroup;`
            // const values = [entry.FirstName, entry.LastName, entry.Email, entry.DoB];
            // db.run(query, values, (err) => {
            //     if(err) {
            //         throw err;
            //     } else {
            //         resolve(this.lastID)
            //     }
            // });
        }
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
    insertProjectGroup: insertProjectGroup,
    getProjects: getProjects
}