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

function getSubsByMainId(mainId) {
    return new Promise((resolve, reject) => {
        dbLite.selectFromTable(dbName,
            `SELECT * FROM ${tableSub} WHERE ParentId = '${mainId}'`).then(rows => {
                resolve(rows)
            }, err => {
                reject(err)
            })
    })
}
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
function updateGoal(id, main) {
    if (!uuidValidate(id) || id == NIL_UUID) Promise.resolve(0);
    const tName = !main.ParentId ? tableName : tableSub
    let values = []
    let qrPram = ``
    if (main.Name) {
        values.push(main.Name)
        qrPram += `Name=?`
    }
    if (main.Description) {
        values.push(main.Description)
        qrPram += qrPram ? `, Description=?` : `Description=?`
    }
    if (main.Budget && typeof main.Budget == 'number') {
        values.push(main.Budget)
        qrPram += qrPram ? `, Budget=?` : `Budget=?`
    }
    if (main.Start) {
        values.push(main.Start)
        qrPram += qrPram ? `, Start=?` : `Start=?`
    }
    if (main.End) {
        values.push(main.End)
        qrPram += qrPram ? `, End=?` : `End=?`
    }
    if (typeof main.IsDone == 'boolean') {
        values.push(main.IsDone ? 1 : 0)
        qrPram += qrPram ? `, IsDone=?` : `IsDone=?`
    }
    if (values.length) {
        values.push(id)
        const qry = `UPDATE ${tName} SET ${qrPram} WHERE Id=?`
        return dbLite.updateTable(dbName, qry, values)
    }
    return Promise.resolve(0);
}
function insertNewMain(main) {
    if (typeof main.Name != 'string') return
    const newId = uuidv4()
    let columns = `Id, Name`
    let values = `'${newId}', '${main.Name}'`
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
    return newId
}
function insertNewSub(sub) {
    if (typeof sub.Name != 'string') return Promise.resolve('invalid Name')
    if (!uuidValidate(sub.ParentId) || sub.ParentId == NIL_UUID) {
        return Promise.resolve('invalid ParentId')
    }
    return new Promise(res => {
        const newId = uuidv4()
        let columns = `Id, ParentId, Name`
        let values = `'${newId}', '${sub.ParentId}', '${sub.Name}'`
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
        const query = `SELECT * FROM ${tableSub} WHERE Name = '${sub.Name}'`
        dbLite.insertIntoTable(dbName, tableSub, columns, values, query)
        res(newId)
    })
}
module.exports = {
    getMainSubGoals: getMainSubGoals,
    insertNewMain: insertNewMain,
    getMainSubBy: getMainSubBy,
    insertNewSub: insertNewSub,
    dbName: dbName,
    updateGoal: updateGoal,
    getSubsByMainId: getSubsByMainId,
}