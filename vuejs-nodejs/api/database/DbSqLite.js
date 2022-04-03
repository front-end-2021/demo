const Constants = require('./Constants');
const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');

function InitDb() {
    InitAccount();
}

function getAllUsers() {
    const db = openTheDatabase(Constants.DbNameObj.Account);
    const Model = Constants.User.getModel();
    
    return new Promise((resolve, reject) => {
        if(db != null) {
            const sql = `SELECT ${Model.Id} Id,
                    ${Model.FirstName} FirstName,
                    ${Model.LastName} LastName,
                    ${Model.Email} Email
                FROM User ORDER BY ${Model.FirstName}`;
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

function getUsers(dateOfBirth) {
    const db = openTheDatabase(Constants.DbNameObj.Account);
    const Model = Constants.User.getModel();
    const lstRow = [];

    return new Promise((reslv, rej) => {
        if(db != null) {
            const whereC = `WHERE ${Model.DoB} = ?`;
            const sql = `SELECT ${Model.Id} Id,
                    ${Model.FirstName} FirstName,
                    ${Model.LastName} LastName,
                    ${Model.Email} Email
                FROM User ${whereC}
                ORDER BY ${Model.FirstName}`;

            db.each(sql, [dateOfBirth], (err, row) => {
                if (err) {
                    throw err;
                }
                lstRow.push(row);
            });

            reslv(lstRow);

            db.close(); // close the database connection
        } else rej();
    });
}
function insertUser(entry){
    const db = openTheDatabase(Constants.DbNameObj.Account);
    if(db != null && typeof entry == 'object') {
        const query = Constants.User.queryInsert();
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

function openTheDatabase(dbName){
    if(typeof dbName != 'string') return null;
    const dbPath = `./database/${dbName}.db`;
    return new sqlite3.Database(dbPath);
}

function InitAccount(){
    const db = openTheDatabase(Constants.DbNameObj.Account);
    db.serialize(() => {
        const query = Constants.User.queryCreateTable();
        db.run(query);
    });
    db.close();
}

function getTableInDb(dbName) {
    switch(dbName) {
        case Constants.DbNameObj.Account:
            return {
                User: Constants.User.getName()
            }        
    }
    return '';
}

module.exports = {
    InitDb: InitDb,
    getAllUsers: getAllUsers,
    getUsers: getUsers,
    insertUser: insertUser
}