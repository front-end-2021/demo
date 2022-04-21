const Constants = require('./Constants');
const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');

InitAccount();

function getAllUsers() {
    const db = openTheDatabase(Constants.DbNameObj.Account);
    
    return new Promise((resolve, reject) => {
        if(db != null) {
            const Model = Constants.User.getModel();
            const sql = `${Constants.User.querySelect()} ORDER BY ${Model.FirstName}`;
            db.all(sql, (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
            db.close(); // close the database connection
        } else reject(); 
    });
}

function getUser(id) {
    const db = openTheDatabase(Constants.DbNameObj.Account);

    return new Promise((reslv, rej) => {
        if(db != null) {
            const Model = Constants.User.getModel();
            const sql = Constants.User.querySelect(`WHERE ${Model.Id} = ?`);
            db.get(sql, [id], (err, result) => {  
                if (err) {
                    throw err;
                } else {
                    reslv(result);
                }
            });
            db.close(); // close the database connection
        } else rej();
    });
}
function insertUser(entry) {
    const db = openTheDatabase(Constants.DbNameObj.Account);
    if(db != null && typeof entry == 'object') {
        const query = Constants.User.queryInsert();
        console.log(query)
        const model = Constants.User.getModel();
        entry = Object.assign(model, entry);
        const values = [entry.FirstName, entry.LastName, entry.Email, entry.DoB];
        const res = db.run(query, values, (err) => {
            if(err) {
                throw err;
            }
        });
        db.close(); // close the database connection
        return res.lastID;
    }
    return -1;
}

function openTheDatabase(dbName) {
    if(typeof dbName != 'string') return null;
    const dbPath = `./database/${dbName}.db`;
    return new sqlite3.Database(dbPath);
}

function InitAccount() {
    const db = openTheDatabase(Constants.DbNameObj.Account);
    db.serialize(() => {
        const query = Constants.User.queryCreateTable();
        db.run(query);
    });
    db.close();
}

module.exports = {
    getAllUsers: getAllUsers,
    getUser: getUser,
    insertUser: insertUser
}