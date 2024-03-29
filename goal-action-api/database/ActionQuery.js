const { v4: uuidv4 } = require('uuid');
const { NIL: NIL_UUID } = require('uuid');
const { validate: uuidValidate } = require('uuid')
const dbLite = require('./dbSqlite')
const vCommon = require('./common')

const cols = `Id TEXT NOT NULL UNIQUE, ParentId TEXT NOT NULL, 
Name TEXT NOT NULL, Description TEXT, 
Start TEXT, End TEXT, IsDone INTEGER DEFAULT 0,
ExpectCost REAL DEFAULT 0, TrueCost REAL DEFAULT 0`
dbLite.readyTable(vCommon.dbName, vCommon.tableAction, cols)

function getActions() {
    return new Promise((resolve, reject) => {
        dbLite.selectFromTable(vCommon.dbName, `SELECT * FROM ${vCommon.tableAction}`).then(rows => {
            resolve(rows)
        }, err => {
            reject(err)
        })
    })
}
function getActionsBySubId(subId) {
    return new Promise((resolve, reject) => {
        dbLite.selectFromTable(vCommon.dbName,
            `SELECT * FROM ${vCommon.tableAction} WHERE ParentId = '${subId}'`).then(rows => {
                resolve(rows)
            }, err => {
                reject(err)
            })
    })
}
function getActionBy(id) {
    return new Promise((resolve, reject) => {
        dbLite.getFromTable(vCommon.dbName,
            `SELECT * FROM ${vCommon.tableAction} WHERE Id = '${id}'`).then(row => {
                resolve(row)
            }, err => {
                reject(err)
            })
    })
}
function deleteAction(id) {
    return dbLite.deleteItemFrom(vCommon.dbName, vCommon.tableAction, id).then(() => {
        return `Delete Action success`
    })
}
function insertNewAction(action) {
    if (typeof action.Name != 'string') return Promise.resolve('invalid Name')
    if (!uuidValidate(action.ParentId) || action.ParentId == NIL_UUID) {
        return Promise.resolve('invalid ParentId')
    }
    return new Promise(res => {
        const newId = uuidv4()
        let columns = `Id, ParentId, Name`
        let values = `'${newId}', '${action.ParentId}', '${action.Name}'`
        if (action.Start) {
            columns += `, Start`
            values += `, '${action.Start}'`
        }
        if (action.End) {
            columns += `, End`
            values += `, '${action.End}'`
        }
        if (action.Description) {
            columns += `, Description`
            values += `, '${action.Description}'`
        }
        if (action.ExpectCost) {
            columns += `, ExpectCost`
            values += `, ${action.ExpectCost}`
        }
        if (action.TrueCost) {
            columns += `, TrueCost`
            values += `, ${action.TrueCost}`
        }
        
        dbLite.insertIntoTable(vCommon.dbName, vCommon.tableAction, columns, values)
        res(newId)
    })
}
function updateAction(id, action) {
    if (!uuidValidate(id) || id == NIL_UUID) Promise.resolve(0);
    let values = []
    let qrPram = ``
    if (action.Name) {
        values.push(action.Name)
        qrPram += `Name=?`
    }
    if (action.Description) {
        values.push(action.Description)
        qrPram += qrPram ? `, Description=?` : `Description=?`
    }
    if (action.ExpectCost && typeof action.ExpectCost == 'number') {
        values.push(action.ExpectCost)
        qrPram += qrPram ? `, ExpectCost=?` : `ExpectCost=?`
    }
    if (action.TrueCost && typeof action.TrueCost == 'number') {
        values.push(action.TrueCost)
        qrPram += qrPram ? `, TrueCost=?` : `TrueCost=?`
    }
    if (action.Start) {
        values.push(action.Start)
        qrPram += qrPram ? `, Start=?` : `Start=?`
    }
    if (action.End) {
        values.push(action.End)
        qrPram += qrPram ? `, End=?` : `End=?`
    }
    if (typeof action.IsDone == 'boolean') {
        values.push(action.IsDone ? 1 : 0)
        qrPram += qrPram ? `, IsDone=?` : `IsDone=?`
    }
    if (values.length && qrPram) {
        values.push(id)
        const qry = `UPDATE ${vCommon.tableAction} SET ${qrPram} WHERE Id=?`
        return dbLite.updateTable(vCommon.dbName, qry, values)
    }
    return Promise.resolve(0);
}
module.exports = {
    getActions: getActions,
    getActionBy: getActionBy,
    insertNewAction: insertNewAction,
    updateAction: updateAction,
    getActionsBySubId: getActionsBySubId,
    deleteAction: deleteAction
}