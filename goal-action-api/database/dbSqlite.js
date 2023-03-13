const sqlite3 = require('sqlite3').verbose()
const vCommon = require('./common')
const { v4: uuidv4 } = require('uuid');

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
function insertIntoTable(dbName, tableName, columns, values) {
    const db = readyDatabase(dbName)
    db.serialize(() => {
        db.run(`INSERT INTO ${tableName} (${columns}) VALUES (${values})`)
    });
    db.close();
}
function deleteItemFrom(dbName, tableName, id) {
    const db = readyDatabase(dbName)
    return new Promise((resolve, reject) => {
        db.serialize(() => {
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
function deleteMainFrom(id) {
    const db = readyDatabase(vCommon.dbName)
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`DELETE FROM ${vCommon.tableAction}
            WHERE Id IN (SELECT a.Id FROM ${vCommon.tableAction} AS a
                INNER JOIN ${vCommon.tableSub} AS s ON s.Id = a.ParentId
                INNER JOIN ${vCommon.tableMain} AS m ON m.Id = s.ParentId
                WHERE m.Id=(?) )`, id
            );
            db.run(`DELETE FROM ${vCommon.tableSub} 
            WHERE Id IN (SELECT s.Id FROM ${vCommon.tableSub} as s
                INNER JOIN ${vCommon.tableMain} as m ON m.Id = s.ParentId
                WHERE m.Id=(?) )`, id
            );
            db.run(`DELETE FROM ${vCommon.tableMain} WHERE Id=(?)`, id, function (err) {
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
function deleteSubFrom(id) {
    const db = readyDatabase(vCommon.dbName)
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`DELETE FROM ${vCommon.tableAction} WHERE ParentId=(?)`, id)
            db.run(`DELETE FROM ${vCommon.tableSub} WHERE Id=(?)`, id, function (err) {
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
function duplicateSub(dbName, subg) {
    const db = readyDatabase(dbName)
    const sid = subg.Id
    const newId = uuidv4()
    const qrySlAction = `SELECT * FROM ${vCommon.tableAction} WHERE ParentId='${sid}'`
    return new Promise((reslove, reject) => {
        db.serialize(() => {
            const subO = vCommon.getColSub(subg, newId)
            db.run(`INSERT INTO ${vCommon.tableSub} (${subO.Columns}) VALUES (${subO.Values})`)

            db.all(qrySlAction, function (err, rows) {
                if (rows) {
                    if (rows.length) {
                        const qr1 = `INSERT INTO ${vCommon.tableAction}(Id, ParentId, Name, Description, Start, End, IsDone, ExpectCost, TrueCost)`
                        const qr2 = `${qr1} VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                        rows.forEach(a => {
                            a.Id = uuidv4()
                            a.ParentId = newId
                            a.Name = `${a.Name} (1)`
                            db.run(qr2, [a.Id, a.ParentId, a.Name, a.Description, a.Start, a.End, a.IsDone, a.ExpectCost, a.TrueCost]);
                        })
                    }
                    reslove(newId)
                }
                if (err) reject(err)
                db.close();
            });
        });

    })
}
function duplicateMain(dbName, mainid) {
    const db = readyDatabase(dbName)
    const newId = uuidv4()
    return new Promise((reslove, reject) => {
        db.serialize(() => {
            db.get(`SELECT * FROM Maingoal WHERE Id = '${mainid}'`,
                function (err, maing) {
                    if (maing) {
                        const mid = maing.Id
                        maing.Name = `COPY ${maing.Name}`
                        const mainO = vCommon.getColMain(maing, newId)
                        db.run(`INSERT INTO ${vCommon.tableMain} (${mainO.Columns}) VALUES (${mainO.Values})`)  // insert Main
                        const newMaingoal = maing
                        newMaingoal.Id = newId
                        const newSubIds = []
                        const oldSubIds = []
                        db.all(`SELECT * FROM ${vCommon.tableSub} WHERE ParentId='${mid}'`, function (err, subs) {
                            if (Array.isArray(subs) && subs.length) {
                                const qrS1 = `INSERT INTO ${vCommon.tableSub}(Id, ParentId, Name, Description, Start, End, IsDone, Budget)`
                                const stmtS = db.prepare(`${qrS1} VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
                                subs.forEach(s => {
                                    const newSId = uuidv4()
                                    oldSubIds.push(s.Id)
                                    newSubIds.push(newSId)
                                    s.Name = `${s.Name} (1)`
                                    stmtS.run([newSId, newId, s.Name, s.Description, s.Start, s.End, s.IsDone, s.Budget])
                                })
                                stmtS.finalize();

                                const slctSub = `(SELECT Id AS ParentId FROM ${vCommon.tableSub} WHERE ParentId = '${mid}')`
                                const qrA = `SELECT * FROM ${vCommon.tableAction} Where ParentId IN ${slctSub}`
                                db.all(qrA, function (errA, actions) {
                                    if (Array.isArray(actions) && actions.length) {
                                        const qrA1 = `INSERT INTO ${vCommon.tableAction}(Id, ParentId, Name, Description, Start, End, IsDone, ExpectCost, TrueCost)`
                                        const stmt = db.prepare(`${qrA1} VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
                                        actions.forEach(a => {
                                            const oldSubId = a.ParentId
                                            const _i = oldSubIds.indexOf(oldSubId)
                                            const newSubId = newSubIds[_i]
                                            a.Name = `${a.Name} (1)`
                                            stmt.run([uuidv4(), newSubId, a.Name, a.Description, a.Start, a.End, a.IsDone, a.ExpectCost, a.TrueCost])
                                        })
                                        stmt.finalize();
                                    }
                                    if (errA) reject(errA)
                                    db.close();
                                    reslove(newMaingoal)
                                })
                            } else {
                                db.close();
                                reslove(newMaingoal)
                            }
                            if (err) reject(err)
                        })
                    } else db.close();
                    if (err) reject(err)
                })
        })
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
    deleteSubFrom: deleteSubFrom,
    deleteMainFrom: deleteMainFrom,
    duplicateSub: duplicateSub,
    duplicateMain: duplicateMain
}