const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');

function openTheDatabase(dbName) {
    if(typeof dbName != 'string') return null;
    const dbPath = `./database/${dbName}.db`;
    return new sqlite3.Database(dbPath);
}

module.exports = {
    runQuery: function(dbName, callback){
        const db = openTheDatabase(dbName);
        return new Promise((resolve, reject) => {
            if(db != null) {
                callback(db, resolve);
                db.close(); // close the database connection
            } else reject(); 
        });
    },
    getString: function (date) {
        if(this.isValidDate(date)) {
            return date.toUTCString();
            //return date.toLocaleString('en-GB', { timeZone: 'UTC' })    // default format YYYY-MM-DD HH:MM:SS.SSS
        }
        return '';
    },
    getBaseModel: function () {
        return {
            Id: 'Id', Name: 'Name', MIndex: 'MIndex',
            CreatedDate: 'CreatedDate', CreatedBy: 'CreatedBy',
            ModifiedDate: 'ModifiedDate', ModifiedBy: 'ModifiedBy'
        }
    },
    getQueryInsert: function () {
        if(arguments.length < 1) throw new Error('param must has table name');
        const tbName = arguments[0];
        var iCols = [];
        var iQValues = [];
        for (let i = 1; i < arguments.length; i++) {
            iCols.push(arguments[i]);
            iQValues.push('?');
        }
        var iQueryS = `INSERT INTO ${tbName} (${iCols.join(', ')})`;
        const iQueryE = `VALUES(${iQValues.join(', ')})`;
        return `${iQueryS} ${iQueryE}`
    },
    getQueryCreateTable: function (tableName) {
        return `CREATE TABLE IF NOT EXISTS ${tableName}`;
    },
    getQueryIntAutoIncrease: function (id) {
        return `${id} INTEGER PRIMARY KEY AUTOINCREMENT`;
    },
    isValidDate: function (d) {
        return d instanceof Date && !isNaN(d);
    }
}