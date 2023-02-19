const { v4: uuidv4 } = require('uuid');
const dbLite = require('./dbSqlite')

const dbName = `GoalAction`
const tableName = 'Maingoal'
const cols = `Id TEXT NOT NULL UNIQUE, Name TEXT NOT NULL UNIQUE, 
Description TEXT, Budget REAL DEFAULT 0, Start TEXT, End TEXT`
dbLite.readyTable(dbName, tableName, cols)

function getMaingoals() {
    return new Promise((resolve, reject) => {
        dbLite.selectFromTable(dbName, `SELECT * FROM ${tableName}`).then(rows => {
            resolve(rows)
        }, err => {
            reject(err)
        })
    })
}
function getMaingoal(id) {
    return new Promise((resolve, reject) => {
        dbLite.getFromTable(dbName,
            `SELECT * FROM ${tableName} WHERE Id = '${id}'`).then(row => {
                resolve(row)
            }, err => {
                reject(err)
            })
    })
}
function insertNewMain(main) {
    let columns = `Id, Name`
    let values = `'${uuidv4()}', '${main.Name}'`
    if (main.Start) {
        columns += `, Start`
        values += `, '${main.Start}'`
    }
    dbLite.insertIntoTable(dbName, tableName, columns, values)
}
module.exports = {
    getMaingoals: getMaingoals,
    insertNewMain: insertNewMain,
    getMaingoal: getMaingoal
}