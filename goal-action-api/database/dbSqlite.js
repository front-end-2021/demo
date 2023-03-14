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
                if (err) reject(err)
                else resolve();
            });
        });
        db.close();
    })
}
function deleteMainFrom(id) {
    const db = readyDatabase(vCommon.dbName)
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(vCommon.deleteAction, id);
            db.run(vCommon.deleteSub, id);
            db.run(`DELETE FROM ${vCommon.tableMain} WHERE Id=(?)`, id,
                function (err) {
                    if (err) reject(err)
                    else resolve();
                }
            );
        });
        db.close();
    })
}
function deleteSubFrom(id) {
    const db = readyDatabase(vCommon.dbName)
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`DELETE FROM ${vCommon.tableAction} WHERE ParentId=(?)`, id)
            db.run(`DELETE FROM ${vCommon.tableSub} WHERE Id=(?)`, id,
                function (err) {
                    if (err) reject(err)
                    else resolve();
                }
            );
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
function duplicateSub(dbName, subid) {
    const db = readyDatabase(dbName)
    return new Promise((reslove, reject) => {
        db.serialize(() => {
            db.get(`SELECT * FROM ${vCommon.tableSub} WHERE Id = '${subid}'`,
                function (err, subg) {
                    if (subg) {
                        const newId = uuidv4()
                        const sid = subg.Id
                        subg.Name = `COPY ${subg.Name}`
                        const subO = vCommon.getColSub(subg, newId)
                        db.run(`INSERT INTO ${vCommon.tableSub} (${subO.Columns}) VALUES (${subO.Values})`)

                        const newSub = subg
                        newSub.Id = newId

                        const qrySlAction = `SELECT * FROM ${vCommon.tableAction} WHERE ParentId='${sid}'`
                        db.all(qrySlAction, function (err, actions) {
                            if (Array.isArray(actions) && actions.length) {
                                const qr2 = `${vCommon.insertIntoAction} VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                                actions.forEach(a => {
                                    a.Id = uuidv4()
                                    a.ParentId = newId
                                    a.Name = `${a.Name} (1)`
                                    db.run(qr2, [a.Id, a.ParentId, a.Name, a.Description,
                                    a.Start, a.End, a.IsDone, a.ExpectCost, a.TrueCost]);
                                })
                            }
                            if (err) reject(err)
                            db.close();
                            reslove(newSub)
                        });
                    } else db.close();
                    if (err) reject(err)
                }
            )
        });
    })
}
function duplicateMain(dbName, mainid) {
    const db = readyDatabase(dbName)
    return new Promise((reslove, reject) => {
        db.serialize(() => {
            db.get(`SELECT * FROM ${vCommon.tableMain} WHERE Id = '${mainid}'`,
                function (err, maing) {
                    if (maing) {
                        const newId = uuidv4()
                        const mid = maing.Id
                        maing.Name = `COPY ${maing.Name}`
                        const mainO = vCommon.getColMain(maing, newId)
                        db.run(`INSERT INTO ${vCommon.tableMain} (${mainO.Columns}) VALUES (${mainO.Values})`)  // insert Main

                        const newMain = maing
                        newMain.Id = newId

                        db.all(`SELECT * FROM ${vCommon.tableSub} WHERE ParentId='${mid}'`, function (err, subs) {
                            if (Array.isArray(subs) && subs.length) {
                                const newSubIds = []
                                const oldSubIds = []
                                const stmtS = db.prepare(`${vCommon.insertIntoSub} VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
                                subs.forEach(s => {
                                    const newSId = uuidv4()
                                    oldSubIds.push(s.Id)
                                    newSubIds.push(newSId)
                                    s.Name = `${s.Name} (1)`
                                    stmtS.run([newSId, newId, s.Name, s.Description, s.Start, s.End, s.IsDone, s.Budget])
                                })
                                stmtS.finalize();

                                db.all(vCommon.selectAction(mid), function (errA, actions) {
                                    if (Array.isArray(actions) && actions.length) {
                                        const stmt = db.prepare(`${vCommon.insertIntoAction} VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
                                        actions.forEach(a => {
                                            const oldSubId = a.ParentId
                                            const _i = oldSubIds.indexOf(oldSubId)
                                            const newSubId = newSubIds[_i]
                                            a.Name = `${a.Name} (1)`
                                            stmt.run([uuidv4(), newSubId, a.Name, a.Description,
                                            a.Start, a.End, a.IsDone, a.ExpectCost, a.TrueCost])
                                        })
                                        stmt.finalize();
                                    }
                                    if (errA) reject(errA)
                                    db.close();
                                    reslove(newMain)
                                })
                            } else {
                                db.close();
                                reslove(newMain)
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