const Constants = require('./Constants');
const sqlite3 = require('sqlite3').verbose();
const global = require('./Global')

InitAccount();

function getAllUsers() {
    return global.runQuery(Constants.DbNameObj.Account, function(db, resolve){
        const Model = Constants.User.getModel();
        const sql = `${Constants.User.querySelect()} ORDER BY ${Model.FirstName}`;
        db.all(sql, (err, rows) => {
            if (err) { throw err; } 
            else { resolve(rows); }
        });
    });
}

function getUser(id) {
    return global.runQuery(Constants.DbNameObj.Account, function(db, resolve){
        const Model = Constants.User.getModel();
        const sql = Constants.User.querySelect(`WHERE ${Model.Id} = ?`);
        db.get(sql, [id], (err, result) => {  
            if (err) {
                throw err;
            } else {
                resolve(result);
            }
        });
    });
}
function insertUser(entry) {
    return global.runQuery(Constants.DbNameObj.Account, function(db, resolve) {
        if(typeof entry == 'object') {
            const query = Constants.User.queryInsert();
            const model = Constants.User.getModel();
            entry = Object.assign(model, entry);
            const values = [entry.FirstName, entry.LastName, entry.Email, entry.DoB];
            db.run(query, values, (err) => {
                if(err) {
                    throw err;
                } else {
                    resolve(this.lastID)
                }
            });
        }
    });

    // const db = openTheDatabase(Constants.DbNameObj.Account);
    // if(db != null && typeof entry == 'object') {
    //     const query = Constants.User.queryInsert();
    //     const model = Constants.User.getModel();
    //     entry = Object.assign(model, entry);
    //     const values = [entry.FirstName, entry.LastName, entry.Email, entry.DoB];
    //     const res = db.run(query, values, (err) => {
    //         if(err) { throw err; }
    //         console.log(values)
    //     });
    //     db.close(); // close the database connection
    //     console.log('lastID', res.lastID)
    //     return res.lastID;
    // }
    // return -1;
}

function openTheDatabase(dbName) {
    if(typeof dbName != 'string') return null;
    const dbPath = `./database/${dbName}.db`;
    return new sqlite3.Database(dbPath);
}

function InitAccount() {
    const db = openTheDatabase(Constants.DbNameObj.Account);
    db.serialize(() => {
        var query = Constants.User.queryCreateTable();
        db.run(query);
        query = Constants.AccountRole.queryCreateTable();
        db.run(query);
    });
    db.close();
}

module.exports = {
    getAllUsers: getAllUsers,
    getUser: getUser,
    insertUser: insertUser
}