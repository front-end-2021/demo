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

function getProjectGroups() {
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
function insertProjectGroup(entry) {
    return global.runQuery(Constants.DbNameObj.Project, function(db, resolve) {
        if(typeof entry == 'object') {
            const prj = Constants.Project;
            const model = prj.getModel().ProjectGroup
            entry = Object.assign(model, entry);
            const query = `INSERT INTO ${prj.getProjectGroup()} (Name, MIndex, CreatedBy, CreatedDate)
                        SELECT ? Name, (MAX(Id) + 1) MIndex, ? CreatedBy, DATETIME('NOW') CreatedDate 
                        FROM ProjectGroup;`
            const values = [entry.Name, entry.CreatedBy];
            db.run(query, values, (err) => {
                if(err) { throw err; } 
                else {
                    resolve(global.DbStatus.Success)
                }
            });
        }
    });
}
function editProjectGroup(entry){
    return global.runQuery(Constants.DbNameObj.Project, function(db, resolve) {
        if(typeof entry == 'object') {
            const prj = Constants.Project
            const model = prj.getModel().ProjectGroup
            entry = Object.assign(model, entry)
            const query = `UPDATE ${prj.getProjectGroup()} 
                        SET Name = ?, MIndex = ?, ModifiedBy = ?, ModifiedDate = DATETIME('NOW')
                            WHERE Id = ?;`
            const values = [entry.Name, entry.MIndex, entry.ModifiedBy, entry.Id];
            db.run(query, values, (err) => {
                if(err) { throw err; } 
                else {
                    resolve(global.DbStatus.Success, entry.Id)
                }
            })
        }
    })
}
function deleteProjectGroup(id){
    return global.runQuery(Constants.DbNameObj.Project, function(db, resolve){
        if(typeof id == 'number' && id > 0) {
            const prj = Constants.Project
            const query = `DELETE FROM ${prj.getProjectGroup()} WHERE Id = ?;`
            const values = [id];
            db.run(query, values, (err) => {
                if(err) { throw err; } 
                else {
                    resolve(global.DbStatus.Success)
                }
            })
        }
    })
}

function getProjects() {
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
    editProjectGroup: editProjectGroup,
    deleteProjectGroup: deleteProjectGroup,
    getProjects: getProjects
}