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
    getModelCM: function() {
        return {
            CreatedDate: 'CreatedDate', CreatedBy: 'CreatedBy',
            ModifiedDate: 'ModifiedDate', ModifiedBy: 'ModifiedBy'
        }
    },
    getColumnsCM: function() {
        const Model = this.getModelCM();
        const colCreate = `${Model.CreatedBy} ${this.SqDType.INT}, ${Model.CreatedDate} ${this.SqDType.TEXT}`
        const colModify = `${Model.ModifiedBy} ${this.SqDType.INT}, ${Model.ModifiedDate} ${this.SqDType.TEXT}`
        return `${colCreate}, ${colModify}`
    },
    getBaseModel: function () {
        return Object.assign({
            Id: 'Id', Name: 'Name', MIndex: 'MIndex'
        }, this.getModelCM())
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
    },
    openTheDatabase : openTheDatabase,
    SqDType: {
        INT: 'INTEGER', NULL: 'NULL', TEXT: 'TEXT', BLOB: 'BLOB', REAL: 'REAL',
        AUTOINC: 'AUTOINCREMENT'
    }
}