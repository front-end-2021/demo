const { v4: uuidv4 } = require('uuid');
const { NIL: NIL_UUID } = require('uuid');
const { validate: uuidValidate } = require('uuid')
const dbLite = require('./dbSqlite')

const dbName = `GoalAction`
const tableName = 'Maingoal'
const cols = `Id TEXT NOT NULL UNIQUE, Name TEXT NOT NULL UNIQUE, 
Description TEXT, Budget REAL DEFAULT 0, Start TEXT, End TEXT, IsDone INTEGER DEFAULT 0`
dbLite.readyTable(dbName, tableName, cols)
const tableSub = 'Subgoal'
const colsSub = `Id TEXT NOT NULL UNIQUE, ParentId TEXT NOT NULL, Name TEXT NOT NULL UNIQUE, 
Description TEXT, Budget REAL DEFAULT 0, Start TEXT, End TEXT, IsDone INTEGER DEFAULT 0`
dbLite.readyTable(dbName, tableSub, colsSub)

function getMainSubGoals(isMain) {
    const tName = isMain ? tableName : tableSub
    return new Promise((resolve, reject) => {
        dbLite.selectFromTable(dbName, `SELECT * FROM ${tName}`).then(rows => {
            resolve(rows)
        }, err => {
            reject(err)
        })
    })
}
function getMainSubBy(id, isMain) {
    const tName = isMain ? tableName : tableSub
    return new Promise((resolve, reject) => {
        dbLite.getFromTable(dbName,
            `SELECT * FROM ${tName} WHERE Id = '${id}'`).then(row => {
                resolve(row)
            }, err => {
                reject(err)
            })
    })
}
function updateGoal(main) {
    if (!uuidValidate(main.Id) || main.Id == NIL_UUID) Promise.resolve(0);
    let values = []
    let qry = `UPDATE ${tableName} SET`
    if(main.Name) {
        values.push(main.Name)
        qry += ` Name=?`
    }
    if(main.Description) {
        values.push(main.Description)
        qry += `, Description=?`
    }
    if(main.Budget && typeof main.Budget == 'number') {
        values.push(main.Budget)
        qry += `, Budget=?`
    }
    if(main.Start) {
        values.push(main.Start)
        qry += `, Start=?`
    }
    if(main.End) {
        values.push(main.End)
        qry += `, End=?`
    }
    if(values.length) {
        values.push(main.Id)
        qry += ` WHERE Id=?`
        return dbLite.updateTable(dbName, qry, values)
    }
    return Promise.resolve(0);
}
function insertNewMain(main) {
    if (typeof main.Name != 'string') return
    let columns = `Id, Name`
    let values = `'${uuidv4()}', '${main.Name}'`
    if (main.Start) {
        columns += `, Start`
        values += `, '${main.Start}'`
    }
    if (main.End) {
        columns += `, End`
        values += `, '${main.End}'`
    }
    if (main.Description) {
        columns += `, Description`
        values += `, '${main.Description}'`
    }
    if (main.Budget) {
        columns += `, Budget`
        values += `, ${main.Budget}`
    }
    dbLite.insertIntoTable(dbName, tableName, columns, values)
}
function insertNewSub(sub) {
    if (typeof sub.Name != 'string') return
    if (!uuidValidate(sub.ParentId) || sub.ParentId == NIL_UUID) return
    getMainSubBy(sub.ParentId).then(row => {
        let columns = `Id, ParentId, Name`
        let values = `'${uuidv4()}', '${sub.ParentId}', '${sub.Name}'`
        if (sub.Start) {
            columns += `, Start`
            values += `, '${sub.Start}'`
        }
        if (sub.End) {
            columns += `, End`
            values += `, '${sub.End}'`
        }
        if (sub.Description) {
            columns += `, Description`
            values += `, '${sub.Description}'`
        }
        if (sub.Budget) {
            columns += `, Budget`
            values += `, ${sub.Budget}`
        }
        dbLite.insertIntoTable(dbName, tableSub, columns, values)
    })
}
module.exports = {
    getMainSubGoals: getMainSubGoals,
    insertNewMain: insertNewMain,
    getMainSubBy: getMainSubBy,
    insertNewSub: insertNewSub,
    dbName: dbName,
    updateGoal: updateGoal
}