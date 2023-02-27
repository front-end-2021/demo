const sqlite3 = require('sqlite3').verbose()

function readyDatabase(dbName) {
    if (typeof dbName != 'string') return null;
    const dbPath = `./database/${dbName}.db`;
    return new sqlite3.Database(dbPath);
}
function readyTable(dbName, tableName, columns) {
    const db = readyDatabase(dbName)
    db.serialize(() => {
        const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
        db.run(query)
    });
    db.close();
}
function insertIntoTable(dbName, tableName, columns, values, query) {
    const db = readyDatabase(dbName)
    db.serialize(() => {
        let r;
        db.get(query, function (err, row) {
            r = row
        })
        if (!r)
            db.run(`INSERT INTO ${tableName} (${columns}) VALUES (${values})`)
    });
    db.close();
}
function deleteItemFrom(dbName, tableName, id, query) {
    const db = readyDatabase(dbName)
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            if (typeof query == 'string' && query.trim() != '') db.run(query)
            db.run(`DELETE FROM ${tableName} WHERE Id=(?)`, id, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve();
                }
            });
        });
        db.close();
    })
}
function selectFromTable(dbName, query) {
    const db = readyDatabase(dbName)
    return new Promise((reslove, reject) => {
        db.serialize(() => {
            db.all(query, function (err, rows) {
                if (rows) reslove(rows)
                if (err) reject(err)
            });
        });
        db.close();
    })
}
function getFromTable(dbName, query) {
    const db = readyDatabase(dbName)
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get(query, function (err, row) {
                if (row) resolve(row)
                if (err) reject(err)
            });
        });
        db.close();
    })
}
function updateTable(dbName, query, values) {
    const db = readyDatabase(dbName)
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(query, values, function (err) {
                reject(err)
            });
            resolve()
        });
        db.close();
    })
}
module.exports = {
    readyTable: readyTable,
    insertIntoTable: insertIntoTable,
    selectFromTable: selectFromTable,
    getFromTable: getFromTable,
    updateTable: updateTable,
    deleteItemFrom: deleteItemFrom,
}