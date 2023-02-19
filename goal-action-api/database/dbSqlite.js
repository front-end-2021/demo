const sqlite3 = require('sqlite3').verbose()

function readyDatabase(dbName) {
    if (typeof dbName != 'string') return null;
    const dbPath = `./database/${dbName}.db`;
    return new sqlite3.Database(dbPath);
}
function openDatabase(dbName) {
    const db = readyDatabase(dbName)
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db)
            db.close(); // close the database connection
        } else { reject() }
    })
}
function readyTable(dbName, tableName, columns) {
    const db = readyDatabase(dbName)
    db.serialize(() => {
        const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
        db.run(query)
    });
    db.close();
}
function insertIntoTable(dbName, tableName, columns, values) {
    const db = readyDatabase(dbName)
    db.serialize(() => {
        db.run(`INSERT INTO ${tableName} (${columns}) VALUES (${values})`)
    });
    db.close();
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
module.exports = {
    openDatabase: openDatabase,
    readyTable: readyTable,
    insertIntoTable: insertIntoTable,
    selectFromTable: selectFromTable,
    getFromTable: getFromTable
}