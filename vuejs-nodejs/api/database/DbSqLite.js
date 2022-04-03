const Constants = require('./Constants');
const sqlite3 = require('sqlite3').verbose();

InitAccount();

export async function getUsers(dateOfBirth) {
    const db = openTheDatabase(Constants.DbNameObj.Account);
    const Model = Constants.User.getModel();

    return new Promise((reslv, rej) => {
        if(db != null) {
            let sql = `SELECT ${Model.Id} id,
                    ${Model.FirstName} firstName,
                    ${Model.LastName} lastName,
                    ${Model.Email} email
                FROM User WHERE ${Model.DoB} = ?
                ORDER BY ${Model.FirstName}`;

            const lstRow = [];
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

function openTheDatabase(dbName){
    if(typeof dbName != 'string') return null;
    const dbPath = `./${dbName}.db`;
    return new sqlite3.Database(dbPath);
}

function InitAccount(){
    const db = openTheDatabase(Constants.DbNameObj.Account);
    db.serialize(() => {
        db.run(Constants.User.queryCreateTable());
    });
    db.close();
}

export function getTableInDb(dbName) {
    switch(dbName) {
        case Constants.DbNameObj.Account:
            return {
                User: Constants.User.getName()
            }        
    }
    return '';
}
